import { useLayoutEffect, useState } from '@pionjs/pion';
import {
	formCallbacks,
	FormControlElement,
	FormRestoreState,
} from '../elements/form-control-element';
import { useHost } from './use-host';

export interface UseFormValueOptions {
	/** The submitted value; `null` submits nothing. */
	value: string | File | FormData | null;
	/** Sets `valueMissing` while `value` is `null` or `''`. */
	required?: boolean;
	/** Further constraint failures, e.g. `rangeUnderflow`; `message` is shown by `reportValidity()`. */
	validity?: { flags: ValidityStateFlags; message: string };
	/** The form was reset: go back to the initial value. */
	onReset?: () => void;
	/** The browser restores the value submitted before (back navigation, autofill). */
	onRestore?: (state: FormRestoreState) => void;
}

let valueMissingMessage: string | undefined;
// the browser's own wording, in the browser's language, as native fields show it
const valueMissing = () =>
	(valueMissingMessage ??=
		Object.assign(document.createElement('input'), { required: true })
			.validationMessage || 'Please fill out this field.');

/**
 * Takes part in a `<form>` through `ElementInternals`: submits `value` under
 * the host's `name` attribute, reports validity, and handles reset, restore
 * and disabling by a `<fieldset>`.
 *
 * The host must extend `FormControlElement`
 * (`component(fn, { baseElement: FormControlElement })`).
 *
 * @returns `disabled`: true while the host is disabled by its own `disabled`
 * attribute or a disabled ancestor `<fieldset>`; disabled controls are not
 * submitted.
 */
export const useFormValue = ({
	value,
	required,
	validity,
	onReset,
	onRestore,
}: UseFormValueOptions) => {
	const host = useHost<FormControlElement>(),
		{ internals } = host,
		[disabled, setDisabled] = useState(() => host.matches(':disabled'));

	host[formCallbacks] = {
		reset: onReset,
		restore: onRestore,
		disabled: setDisabled,
	};

	useLayoutEffect(() => {
		internals.setFormValue(value);
		const missing = !!required && (value == null || value === '');
		if (missing) {
			internals.setValidity(
				{ ...validity?.flags, valueMissing: true },
				valueMissing(),
			);
		} else if (validity && Object.values(validity.flags).some(Boolean)) {
			// setValidity throws on an empty message
			internals.setValidity(
				validity.flags,
				validity.message || 'Invalid value',
			);
		} else {
			internals.setValidity({});
		}
	});

	return { disabled };
};
