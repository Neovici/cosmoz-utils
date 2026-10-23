import { css } from '@pionjs/pion';
import { noChange, type ElementPart } from 'lit-html';
import { AsyncDirective, directive } from 'lit-html/async-directive.js';
import { sheet } from '../sheet.js';

/**
 * The directive expects this css. Adopt it on your component, set the
 * class `cz-overflow-band` on the band slot, and give it a `max-height`
 * to match one row.
 */
export const overflowStyle = sheet(css`
	slot.cz-overflow-band {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		overflow: clip;
	}

	::slotted([overflowing]) {
		visibility: hidden;
	}
`);

/**
 * The directive marks the elements that overflow with "[overflowing]"
 * and reports the full list via `onOverflow`. The effect relies mainly
 * on css flex wrapping, so make sure to use the accompanying stylesheet
 * (or match in your own css).
 */
export interface OverflowConfig {
	onOverflow: (overflowing: Set<HTMLElement>) => void;
}

const members = (slot: HTMLSlotElement) =>
	slot.assignedElements({ flatten: true }) as HTMLElement[];

const stable = (a?: Set<HTMLElement>, b?: Set<HTMLElement>) =>
	a != null &&
	b != null &&
	a.size === b.size &&
	[...b].every((el) => a.has(el));

class OverflowDirective extends AsyncDirective {
	_slot?: HTMLSlotElement;
	_onOverflow?: (overflowing: Set<HTMLElement>) => void;

	#clipped = new Map<HTMLElement, boolean>();
	#last?: Set<HTMLElement>;
	#observer?: IntersectionObserver;

	#classify = (entries: IntersectionObserverEntry[]) => {
		entries.forEach((entry) => {
			const member = entry.target as HTMLElement;
			this.#clipped.set(
				member,
				entry.boundingClientRect.height > 0 &&
					entry.intersectionRect.height === 0,
			);
		});
		this.#flush();
	};

	#observe = (member: HTMLElement) => {
		this.#observer?.unobserve(member);
		this.#observer?.observe(member);
	};

	#flush = () => {
		if (!this._slot) {
			return;
		}
		const current = members(this._slot);

		current.forEach((member) => {
			const on = this.#clipped.get(member) === true;
			if (on === member.hasAttribute('overflowing')) {
				return;
			}
			if (on) {
				member.setAttribute('overflowing', '');
			} else {
				member.removeAttribute('overflowing');
			}
		});

		// a member that left the slot: forget it, stop watching it,
		// remove the mark
		this.#clipped.forEach((_, member) => {
			if (current.includes(member)) {
				return;
			}
			this.#clipped.delete(member);
			this.#observer?.unobserve(member);
			if (member.hasAttribute('overflowing')) {
				member.removeAttribute('overflowing');
			}
		});

		const next = new Set(
			current.filter((member) => this.#clipped.get(member) === true),
		);
		if (stable(this.#last, next)) {
			return;
		}
		this.#last = next;
		this._onOverflow?.(next);
	};

	#onSlotChange = () => this.#arm();

	#arm = () => {
		if (!this.#observer || !this._slot) {
			return;
		}
		for (const member of members(this._slot)) {
			this.#observe(member);
		}
		this.#flush();
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render(config: OverflowConfig) {
		return noChange;
	}

	update(part: ElementPart, [config]: [OverflowConfig]) {
		this._onOverflow = config.onOverflow;

		const slot = part.element as HTMLSlotElement;
		if (this._slot !== slot) {
			this._slot?.removeEventListener('slotchange', this.#onSlotChange);
			this.#observer?.disconnect();
			this.#observer = undefined;
			this._slot = slot;
			slot.addEventListener('slotchange', this.#onSlotChange);
		}

		this.#observer ??= new IntersectionObserver(this.#classify, {
			root: this._slot,
			threshold: [0, 1],
		});
		this.#arm();
		return noChange;
	}

	disconnected() {
		this._slot?.removeEventListener('slotchange', this.#onSlotChange);
		this._slot = undefined;
		this.#observer?.disconnect();
		this.#observer = undefined;
		this.#clipped.clear();
		this.#last = undefined;
	}
}

export const overflow = directive(OverflowDirective);
