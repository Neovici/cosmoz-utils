import {
	BaseScheduler,
	render,
	GenericRenderer,
	ComponentOrVirtualComponent,
} from 'haunted';
import { ChildPart } from 'lit-html';

class Scheduler<
	P extends object,
	T extends HTMLElement | ChildPart,
	R extends GenericRenderer<T, P>,
	H extends ComponentOrVirtualComponent<T, P>,
	C extends (result: unknown) => void
> extends BaseScheduler<P, T, R, H> {
	_commit: C;
	constructor(renderer: R, host: H, commitCallback: C) {
		super(renderer, host);
		this._commit = commitCallback;
	}

	commit(result: unknown) {
		this._commit(result);
	}
}

interface PElement extends HTMLElement {
	connectedCallback(): void;
	disconnectedCallback(): void;
	set<T>(path: string, value: T): void;
	setProperties<T>(props: T): void;
	_propertiesChanged<P, C, O>(
		currentProps: P,
		changedProps: C,
		oldProps: O
	): void;
	_hauntedUpdateFrameHandle: ReturnType<typeof requestAnimationFrame>;
	_onlyHauntedPropertiesChanged<T>(changedProps: T): boolean;
}

export type Constructor<T> = new (...args: any[]) => T;
type Hook = <T>(a: T) => void;
type Obj = Record<string, any>;

/**
 * Creates a mixin that mixes a haunted hook with a polymer component.
 *
 * @param {String} outputPath The property where the result of the hook will be stored (deprecated)
 * @param {Function} hook A haunted hook
 * @returns {Function} The mixin
 */
export const hauntedPolymer =
	// eslint-disable-next-line max-lines-per-function
	(outputPath: string | Hook, hook?: Hook) => (base: Constructor<PElement>) => {
		const hasOutputPath = hook !== undefined,
			_hook = hasOutputPath ? hook : (outputPath as unknown as Hook);

		// TODO: drop outputPath support after all usages are fixed.
		if (hasOutputPath) {
			// eslint-disable-next-line no-console
			console.warn(
				'Haunted Polymer: use of outputPath is deprecated. Instead have the hook return an object with the keys being property names to update.'
			);
		}

		return class extends base {
			_scheduler: Scheduler<
				object,
				HTMLElement | ChildPart,
				() => void,
				this,
				(result: unknown) => void
			>;
			constructor() {
				super();

				this._scheduler = new Scheduler( // whenever the state is updated
					() => _hook(this), // run the hook with the element as input
					this, // using the element as state host
					(result) =>
						hasOutputPath
							? this.set(outputPath as string, result)
							: this.setProperties(result) // and update the output path with the results
				);
			}

			connectedCallback() {
				super.connectedCallback();
				this._scheduler.update();
			}

			disconnectedCallback() {
				super.disconnectedCallback();
				this._scheduler.teardown();
			}

			_propertiesChanged<P extends Obj, C extends Obj, O>(
				currentProps: P,
				changedProps: C,
				oldProps: O
			) {
				super._propertiesChanged(currentProps, changedProps, oldProps);

				// skip haunted state update if the only thing that has changed is the hook output path
				if (
					hasOutputPath &&
					Object.keys(changedProps).length === 1 &&
					changedProps[outputPath as string] != null
				) {
					return;
				}

				// update haunted state only if a polymer prop has changed
				if (this._onlyHauntedPropertiesChanged(changedProps)) {
					return;
				}

				// trigger a haunted update loop
				// do it in the next animation frame, so the current loop finishes processing first
				cancelAnimationFrame(this._hauntedUpdateFrameHandle);
				this._hauntedUpdateFrameHandle = requestAnimationFrame(() =>
					this._scheduler.update()
				);
			}

			_onlyHauntedPropertiesChanged<C extends Obj>(changedProps: C) {
				const props = (this.constructor as unknown as { __properties: Obj })
					.__properties;

				if (
					Object.keys(changedProps)
						.map((prop) => prop.split('.')[0])
						// props updated by haunted are not listed or have the `haunted` flag
						.every((prop) => props[prop] == null || props[prop].haunted)
				) {
					return true;
				}

				return false;
			}

			renderLitTo(part: ChildPart | (() => ChildPart), outlet: HTMLElement) {
				// render in the next animation frame to allow the haunted scheduler to finish processing the current state update
				// otherwise hooks might be updated twice
				cancelAnimationFrame(
					(
						outlet as unknown as {
							__renderAF: ReturnType<typeof requestAnimationFrame>;
						}
					).__renderAF
				);
				(
					outlet as unknown as {
						__renderAF: ReturnType<typeof requestAnimationFrame>;
					}
				).__renderAF = requestAnimationFrame(() =>
					render(typeof part === 'function' ? part() : part, outlet)
				);
			}
		};
	};
