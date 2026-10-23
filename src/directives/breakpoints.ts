import { ElementPart, nothing } from 'lit-html';
import {
	AsyncDirective,
	directive,
	PartInfo,
	PartType,
} from 'lit-html/async-directive.js';

export interface Breakpoint {
	/** Reflected as data-breakpoint when this breakpoint is the narrowest match. */
	name?: string;
	/** Matches when container width <= maxWidth. Omit for the base breakpoint (maxWidth ∞, always matches). */
	maxWidth?: number;
	/** Element property writes. */
	props?: Record<string, unknown>;
	/** Attribute writes; boolean true → empty string, false → removed. */
	attrs?: Record<string, string | boolean>;
}

interface ManagedKey {
	name: string;
	/** How to write the key on the host. */
	channel: 'prop' | 'attr';
}

interface Resolved {
	/** Name of the narrowest matching named breakpoint, if any. */
	breakpointName?: string;
	/** Effective value per managed key. */
	values: Map<string, unknown>;
}

interface Snapshot {
	breakpoints: Breakpoint[];
	keys: ManagedKey[];
}

const depsEqual = (a: unknown[] | undefined, b: unknown[] | undefined) =>
	(a ?? []).length === (b ?? []).length &&
	(a ?? []).every((v, i) => (b ?? [])[i] === v);

const matches = (breakpoint: Breakpoint, width: number) =>
	breakpoint.maxWidth == null || width <= breakpoint.maxWidth;

/**
 * Normalize breakpoints into a frozen snapshot.
 * - exactly one breakpoint without maxWidth (the base, required)
 * - keys declared in bounded breakpoints must also be declared in the base
 *   breakpoint (every managed key gets a resting value, so exit is well-defined)
 * - keys are the union across breakpoints, prop channel wins on conflicts
 */
export const normalize = (breakpoints: Breakpoint[]): Snapshot => {
	const base = breakpoints.filter((b) => b.maxWidth == null);
	if (base.length !== 1) {
		throw new Error(
			`breakpoints: exactly one breakpoint without maxWidth is required (the base), got ${base.length}`,
		);
	}

	const sorted = [...breakpoints].sort(
		(a, b) => (a.maxWidth ?? Infinity) - (b.maxWidth ?? Infinity),
	);

	const collect = (channel: 'props' | 'attrs') =>
		new Set(sorted.flatMap((b) => Object.keys(b[channel] ?? {})));

	const propKeys = collect('props');
	const attrKeys = collect('attrs');

	const keys: ManagedKey[] = [
		...[...propKeys].map((name) => ({ name, channel: 'prop' as const })),
		...[...attrKeys]
			.filter((name) => !propKeys.has(name))
			.map((name) => ({ name, channel: 'attr' as const })),
	];

	const baseKeys = new Set([
		...Object.keys(base[0].props ?? {}),
		...Object.keys(base[0].attrs ?? {}),
	]);
	const orphans = [...propKeys, ...attrKeys].filter((k) => !baseKeys.has(k));
	if (orphans.length > 0) {
		throw new Error(
			`breakpoints: key(s) [${orphans.join(', ')}] must also be declared in the base breakpoint (no maxWidth)`,
		);
	}

	return { breakpoints: sorted, keys };
};

/**
 * Pure: snapshot × width → resolved values. No host reads.
 * Returns undefined when the width is not resolvable (no layout box, <= 0):
 * the caller must hold last state instead of resolving — 0 would false-match
 * the narrowest breakpoint.
 */
const compute = (snapshot: Snapshot, width: number): Resolved | undefined => {
	if (width <= 0) {
		return undefined;
	}
	const values = new Map<string, unknown>();
	for (const { name } of snapshot.keys) {
		const breakpoint = snapshot.breakpoints.find(
			(b) =>
				matches(b, width) &&
				(b.props?.[name] !== undefined || b.attrs?.[name] !== undefined),
		);
		if (!breakpoint) {
			continue;
		}
		// Strict presence: null is a legitimate value (the exit path), so ??
		// is wrong here — it would reduce a base `null` to "no opinion" and
		// skip the write, stranding a previous breakpoint's override.
		const value =
			breakpoint.props?.[name] !== undefined
				? breakpoint.props?.[name]
				: breakpoint.attrs?.[name];
		values.set(name, value);
	}
	const named = snapshot.breakpoints.find((b) => b.name && matches(b, width));
	return { breakpointName: named?.name, values };
};

const applyValue = (el: HTMLElement, key: ManagedKey, value: unknown) => {
	if (key.channel === 'prop') {
		(el as unknown as Record<string, unknown>)[key.name] = value;
		return;
	}
	if (typeof value === 'boolean') {
		if (value) {
			el.setAttribute(key.name, '');
		} else {
			el.removeAttribute(key.name);
		}
		return;
	}
	el.setAttribute(key.name, String(value));
};

const sameResolved = (a?: Resolved, b?: Resolved) => {
	if (!a || !b || a.breakpointName !== b.breakpointName) {
		return false;
	}
	if (a.values.size !== b.values.size) {
		return false;
	}
	for (const [k, v] of a.values) {
		if (b.values.get(k) !== v) {
			return false;
		}
	}
	return true;
};

class BreakpointsDirective extends AsyncDirective {
	private _el?: HTMLElement;
	private _ro?: ResizeObserver;
	private _snapshot?: Snapshot;
	private _deps?: unknown[];
	private _resolved?: Resolved;

	constructor(partInfo: PartInfo) {
		super(partInfo);
		if (partInfo.type !== PartType.ELEMENT) {
			throw new Error('breakpoints directive must be used on an element');
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	override render(_factory?: () => Breakpoint[], _deps?: unknown[]) {
		return nothing;
	}

	override update(
		part: ElementPart,
		[factory, deps]: [() => Breakpoint[], unknown[] | undefined],
	) {
		if (this._el !== undefined && this._el !== part.element) {
			this._teardown();
			this._el = undefined;
			this._resolved = undefined;
		}
		this._el ??= part.element as HTMLElement;

		if (this._snapshot === undefined || !depsEqual(deps, this._deps)) {
			this._deps = deps;
			this._snapshot = normalize(factory());
			// Snapshot change invalidates the memo; re-resolve at current width.
			this._resolved = undefined;
			this._evaluate();
		}

		this._observe();
		if (!this._ro) {
			// update() can run before the element is connected (initial fixture
			// render) or before layout gives it a box; retry on the next
			// microtask so observation + first evaluation happen post-connect.
			queueMicrotask(() => {
				if (!this.isConnected) {
					return;
				}
				this._observe();
				this._evaluate();
			});
		}
		return nothing;
	}

	private _observe() {
		if (!this._el?.isConnected || this._ro) {
			return;
		}
		this._ro = new ResizeObserver((entries) => {
			this._evaluate(entries[0]?.contentRect.width ?? 0);
		});
		this._ro.observe(this._el);
	}

	private _evaluate(measured?: number) {
		if (!this._el || !this._snapshot) {
			return;
		}
		const width =
			measured === undefined
				? // No RO measurement yet (snapshot change outside an RO tick):
					// measure synchronously to avoid a pre-breakpoint flash.
					this._el.getBoundingClientRect().width
				: measured;
		const resolved = compute(this._snapshot, width);
		if (resolved) {
			this._apply(resolved);
		}
	}

	private _apply(resolved: Resolved) {
		const el = this._el!;
		if (sameResolved(this._resolved, resolved)) {
			return; // RO churn / idempotent re-render — write nothing
		}

		for (const key of this._snapshot!.keys) {
			const value = resolved.values.get(key.name);
			if (value === undefined) {
				continue; // no breakpoint has an opinion — never write
			}
			applyValue(el, key, value);
		}

		if (resolved.breakpointName) {
			el.setAttribute('data-breakpoint', resolved.breakpointName);
		} else {
			el.removeAttribute('data-breakpoint');
		}

		this._resolved = resolved;
	}

	private _teardown() {
		this._ro?.disconnect();
		this._ro = undefined;
	}

	override disconnected() {
		this._teardown();
	}

	override reconnected() {
		this._observe();
	}
}

/**
 * Container-width breakpoint directive for element parts: applies the
 * narrowest matching breakpoint's `props`/`attrs` onto the host and
 * reflects its `name` as `data-breakpoint`, driven by a ResizeObserver on
 * the element.
 *
 * Exactly one base breakpoint (no `maxWidth`) is required and must declare
 * every key used by bounded breakpoints — base values are the resting
 * (exit) state. Snapshots are rebuilt only when `deps` change, so
 * unrelated re-renders don't churn writes.
 *
 * ```js
 * html`<my-list ${breakpoints(() => [
 * 	{ name: 'mini', maxWidth: 480, props: { renderItem: renderMini } },
 * 	{ props: { renderItem: null } },
 * ], [renderMini])}></my-list>`
 * ```
 */
export const breakpoints = directive(BreakpointsDirective) as (
	factory?: () => Breakpoint[],
	deps?: unknown[],
) => unknown;
