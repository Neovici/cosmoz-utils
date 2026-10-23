import { assert, fixture, html, nextFrame } from '@open-wc/testing';
import { component } from '@pionjs/pion';
import { FormControlElement } from '../src/elements/form-control-element';
import { useFormValue } from '../src/hooks/use-form-value';

customElements.define(
	'test-form-value',
	component(
		(host) => {
			const { disabled } = useFormValue({
				value: host.value ?? null,
				required: host.required,
				validity: host.flags,
				onReset: () => (host.value = 'initial'),
				onRestore: (state) => (host.value = state),
			});
			return html`${disabled ? 'disabled' : 'enabled'}`;
		},
		{
			baseElement: FormControlElement,
			observedAttributes: ['required', 'disabled'],
		},
	),
);

const submitted = (form) => [...new FormData(form).entries()];

suite('useFormValue', () => {
	let form;
	let el;

	setup(async () => {
		form = await fixture(html`
			<form>
				<fieldset>
					<test-form-value name="field" .value=${'initial'}></test-form-value>
				</fieldset>
			</form>
		`);
		el = form.querySelector('test-form-value');
		await nextFrame();
	});

	test('submits the value under the name attribute', async () => {
		assert.deepEqual(submitted(form), [['field', 'initial']]);
		el.value = 'changed';
		await nextFrame();
		assert.deepEqual(submitted(form), [['field', 'changed']]);
	});

	test('null submits nothing', async () => {
		el.value = null;
		await nextFrame();
		assert.deepEqual(submitted(form), []);
	});

	test('required sets valueMissing with the browser message', async () => {
		el.required = true;
		await nextFrame();
		assert.isTrue(el.checkValidity());

		el.value = '';
		await nextFrame();
		assert.isFalse(el.checkValidity());
		assert.isTrue(el.validity.valueMissing);
		assert.isNotEmpty(el.validationMessage);
		assert.isFalse(form.checkValidity());

		el.value = 'x';
		await nextFrame();
		assert.isTrue(el.validity.valid);
	});

	test('reports further constraint failures', async () => {
		el.flags = {
			flags: { rangeUnderflow: true },
			message: 'Too small',
		};
		await nextFrame();
		assert.isTrue(el.validity.rangeUnderflow);
		assert.equal(el.validationMessage, 'Too small');

		el.flags = { flags: { rangeUnderflow: false }, message: '' };
		await nextFrame();
		assert.isTrue(el.validity.valid);
	});

	test('an empty message does not throw', async () => {
		el.flags = { flags: { customError: true }, message: '' };
		await nextFrame();
		assert.isTrue(el.validity.customError);
		assert.isNotEmpty(el.validationMessage);
	});

	test('valueMissing wins over other flags', async () => {
		el.required = true;
		el.value = null;
		el.flags = { flags: { rangeUnderflow: true }, message: 'Too small' };
		await nextFrame();
		assert.isTrue(el.validity.valueMissing);
		assert.isTrue(el.validity.rangeUnderflow);
		assert.notEqual(el.validationMessage, 'Too small');
	});

	test('form reset calls onReset', async () => {
		el.value = 'changed';
		await nextFrame();
		form.reset();
		assert.equal(el.value, 'initial');
		await nextFrame();
		assert.deepEqual(submitted(form), [['field', 'initial']]);
	});

	test('restore hands the saved state to onRestore', () => {
		el.formStateRestoreCallback('restored', 'restore');
		assert.equal(el.value, 'restored');
	});

	test('a disabled fieldset disables it', async () => {
		assert.equal(el.shadowRoot.textContent, 'enabled');
		form.querySelector('fieldset').disabled = true;
		await nextFrame();
		assert.equal(el.shadowRoot.textContent, 'disabled');
		assert.deepEqual(submitted(form), []);

		form.querySelector('fieldset').disabled = false;
		await nextFrame();
		assert.equal(el.shadowRoot.textContent, 'enabled');
	});

	test('its own disabled attribute disables it', async () => {
		el.setAttribute('disabled', '');
		await nextFrame();
		assert.equal(el.shadowRoot.textContent, 'disabled');
		assert.deepEqual(submitted(form), []);
	});

	test('is disabled on first render inside a disabled fieldset', async () => {
		const disabledForm = await fixture(html`
			<form>
				<fieldset disabled>
					<test-form-value name="field" .value=${'x'}></test-form-value>
				</fieldset>
			</form>
		`);
		await nextFrame();
		const field = disabledForm.querySelector('test-form-value');
		assert.equal(field.shadowRoot.textContent, 'disabled');
	});
});

suite('FormControlElement', () => {
	test('is form-associated and exposes the form control API', async () => {
		const form = await fixture(
			html`<form><test-form-value></test-form-value></form>`,
		);
		const el = form.querySelector('test-form-value');
		assert.isTrue(customElements.get('test-form-value').formAssociated);
		assert.instanceOf(el.internals, ElementInternals);
		assert.equal(el.form, form);
		assert.isTrue(el.willValidate);
		assert.isTrue(el.reportValidity());
	});
});
