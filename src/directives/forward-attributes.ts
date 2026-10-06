import { AttributePart, noChange } from 'lit-html';
import { AsyncDirective, directive } from 'lit-html/async-directive.js';
import { invoke } from '../function';

type Value = string | null | ((item: Element) => string | null);

const write = (item: Element, name: string, value: string | null) => {
	if (value == null) {
		item.removeAttribute(name);
	} else {
		item.setAttribute(name, value);
	}
};

const forward = (attrs: Record<string, Value>, item: Element) => {
	for (const [name, value] of Object.entries(attrs)) {
		write(item, name, invoke(value, item));
	}
};

/**
 * Forwards attributes onto every flattened assigned element of the slot
 * the directive is placed on — on each render (state changes re-render
 * the slot) and on slot changes (different elements are assigned).
 *
 * Values are strings, nulls (removals), or functions of the assigned
 * element. Placement is the configuration: the placed slot states which
 * members receive the attributes. Slot semantics decide membership:
 * slotting forwards through nested slots, wrappers do not — a
 * non-forwarding wrapper receives the attributes itself without
 * exposing state.
 */
class ForwardAttributesDirective extends AsyncDirective {
	_slot?: HTMLSlotElement;
	_attrs?: Record<string, Value>;

	#forward = () => {
		if (!this._slot || !this._attrs) {
			return;
		}
		const items = this._slot.assignedElements({ flatten: true });
		for (const item of items) {
			forward(this._attrs, item);
		}
	};

	#onSlotChange = () => this.#forward();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render(attrs?: Record<string, Value>) {
		return noChange;
	}

	update(part: AttributePart, [attrs]: [Record<string, Value>]) {
		this._attrs = attrs;
		const slot = part.element as HTMLSlotElement;
		if (this._slot !== slot) {
			this._slot?.removeEventListener('slotchange', this.#onSlotChange);
			this._slot = slot;
			slot.addEventListener('slotchange', this.#onSlotChange);
		}
		this.#forward();
		return noChange;
	}

	disconnected() {
		// the slot outlives renders; the listener is owned for its lifetime
		// and removed when the part is cleared (template swap, disconnect)
		this._slot?.removeEventListener('slotchange', this.#onSlotChange);
		this._slot = undefined;
	}
}

export const forwardAttributes = directive(ForwardAttributesDirective) as (
	attrs: Record<string, Value>,
) => unknown;
