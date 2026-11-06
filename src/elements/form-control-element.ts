export type FormRestoreState = string | File | FormData | null;

export interface FormCallbacks {
	reset?: () => void;
	restore?: (state: FormRestoreState, mode: 'restore' | 'autocomplete') => void;
	disabled?: (disabled: boolean) => void;
}

export const formCallbacks = Symbol('formCallbacks');

/**
 * Base class for form-associated pion components:
 * `component(fn, { baseElement: FormControlElement })`.
 *
 * Form association and the form lifecycle callbacks must live on the class,
 * so this declares `formAssociated`, attaches the `ElementInternals` and
 * forwards the callbacks to `useFormValue`, which owns the behaviour. It also
 * gives the host the form control API native controls have (`form`,
 * `validity`, `checkValidity()`, …).
 *
 * `internals` is for the component's own code (e.g. default `role` and ARIA
 * states, rule 5 of the Base UI port); consumers use the form control API.
 */
export class FormControlElement extends HTMLElement {
	static formAssociated = true;

	readonly internals: ElementInternals = this.attachInternals();

	[formCallbacks]?: FormCallbacks;

	get form() {
		return this.internals.form;
	}

	get validity() {
		return this.internals.validity;
	}

	get validationMessage() {
		return this.internals.validationMessage;
	}

	get willValidate() {
		return this.internals.willValidate;
	}

	checkValidity() {
		return this.internals.checkValidity();
	}

	reportValidity() {
		return this.internals.reportValidity();
	}

	formResetCallback() {
		this[formCallbacks]?.reset?.();
	}

	formStateRestoreCallback(
		state: FormRestoreState,
		mode: 'restore' | 'autocomplete',
	) {
		this[formCallbacks]?.restore?.(state, mode);
	}

	formDisabledCallback(disabled: boolean) {
		this[formCallbacks]?.disabled?.(disabled);
	}
}
