import { AttributePart, noChange } from 'lit-html';
import { AsyncDirective, directive } from 'lit-html/async-directive.js';

interface RefObject<T> {
	current?: T;
}

/**
 * Writes the slot's flattened assigned elements into the ref object,
 * like ref() writes the element.
 *
 * Consumers read refObject.current at event time; a ref does not
 * trigger renders.
 */
class AssignedRefDirective extends AsyncDirective {
	_slot?: HTMLSlotElement;
	_ref?: RefObject<Element[]>;

	#project = () => {
		if (!this._slot || !this._ref) {
			return;
		}
		this._ref.current = this._slot.assignedElements({ flatten: true });
	};

	#onSlotChange = () => this.#project();

	update(part: AttributePart, [ref]: [RefObject<Element[]>]) {
		this._ref = ref;
		const slot = part.element as HTMLSlotElement;
		if (this._slot !== slot) {
			this._slot?.removeEventListener('slotchange', this.#onSlotChange);
			this._slot = slot;
			slot.addEventListener('slotchange', this.#onSlotChange);
		}
		this.#project();
	}

	disconnected() {
		// the slot outlives renders; the listener is owned for its lifetime
		// and removed when the part is cleared (template swap, disconnect)
		this._slot?.removeEventListener('slotchange', this.#onSlotChange);
		this._slot = undefined;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render(ref?: RefObject<Element[]>) {
		return noChange;
	}
}

export const assignedRef = directive(AssignedRefDirective) as (
	ref: RefObject<Element[]>,
) => unknown;
