import { assert } from '@open-wc/testing';
import { html, noChange, nothing, render } from 'lit-html';
import { liveEq, numericEquals, stringEquals } from '../src/directives/live-eq';

/**
 * Harness adopted from lit's live_test.ts
 * (packages/lit-html/src/test/directives/live_test.ts): detached container +
 * synchronous asserts + a write-counting element. The `_setCount` pattern
 * proves the dirty-check skip deterministically (no frames, no fixture).
 */

class LiveTester extends HTMLElement {
	constructor() {
		super();
		this._setCount = 0;
	}

	get value() {
		return this._value;
	}

	set value(v) {
		this._value = v;
		this._setCount++;
	}
}
if (!customElements.get('live-tester')) {
	customElements.define('live-tester', LiveTester);
}

suite('liveEq', () => {
	let container;

	setup(() => {
		container = document.createElement('div');
	});

	// the keystroke flow being modeled: numeric cells whose wrapper parses on
	// every input (`parseFloat('2.') === 2`) flow the normalized number back
	// through the binding; the element coerces `.value` to a string internally,
	// so `live`'s === never stabilizes and rewrites the text mid-composition —
	// `2.1 → backspace → 2.` gets destroyed to `2`, and typing `2.2` yields
	// `22`. `-`/`e` fragments parse to undefined and blank the input.

	suite('properties', () => {
		const go = (value, eq) => {
			render(html`<live-tester .value=${liveEq(value, eq)} />`, container);
			return container.firstElementChild;
		};

		test('drop-in live parity: a rebind of the same value does not write', () => {
			const el = go('a');
			assert.equal(el._setCount, 1);
			go('a');
			assert.equal(el._setCount, 1);
		});

		test('updates an externally set property', () => {
			const el = go('a');
			el.value = 'b'; // external write — goes through the counting setter
			assert.equal(el._setCount, 2);
			go('a');
			// live re-asserts: the element's current value differs from the bound
			assert.equal(el._setCount, 3);
			assert.equal(el._value, 'a');
		});

		test('does not set a non-changed property through a custom equality', () => {
			const el = go(2.1, numericEquals);
			// the user edited the text; a parse normalized the model to 2
			el.value = '2.';
			assert.equal(el._setCount, 2);
			go(2, numericEquals);
			// '2.' vs 2 is numerically equal: the write is skipped
			assert.equal(el._setCount, 2);
			assert.equal(el._value, '2.');
		});

		test('writes through the custom equality when the number differs', () => {
			const el = go(2.1, numericEquals);
			el.value = '2.';
			go(2, numericEquals);
			assert.equal(el._setCount, 2); // the equal rebind above is skipped
			go(3, numericEquals);
			assert.equal(el._setCount, 3);
			assert.equal(el._value, '3');
		});

		test('never blanks partially typed numbers: -/e fragments parse to undefined', () => {
			const el = go(2.1, numericEquals);
			el.value = '-'; // parse('-') is undefined; the binding holds undefined
			go(undefined, numericEquals);
			assert.equal(el._setCount, 2);
			assert.equal(el._value, '-');
		});

		test('the full backspace path: 2.1 → 2. → 2.2, not 22', () => {
			let el = go(2.1, numericEquals);
			el.value = '2.'; // backspace
			el = go(2, numericEquals);
			assert.equal(el._setCount, 2); // no rewrite
			el.value = '2.2'; // the user types the '2' back after the dot
			el = go(2.2, numericEquals);
			assert.equal(el._setCount, 3);
			assert.equal(el._value, '2.2');
		});

		test('progressive decimal typing: 2.543534', () => {
			let el = go(undefined, numericEquals);
			el.value = '2';
			for (const [typed, model] of [
				['2.', 2],
				['2.5', 2.5],
				['2.54', 2.54],
				['2.543', 2.543],
				['2.5435', 2.5435],
				['2.54353', 2.54353],
				['2.543534', 2.543534],
			]) {
				// the user types the fragment, then the wrapper parses and rebinds
				el.value = typed;
				const before = el._setCount;
				el = go(model, numericEquals);
				// rebinding the parsed model must not programmatic-write: the
				// element text is already numerically equal to it
				assert.equal(el._setCount, before);
				assert.equal(el._value, typed);
			}
			// every write so far is a simulated keystroke; zero programmatic writes
			assert.equal(el._setCount, 8);
		});

		test('stringEquals skips rewrites for string-coercing bindings', () => {
			const el = go('a', stringEquals);
			assert.equal(el._setCount, 1);
			el.value = 'A'; // external write
			el.value = '2'; // external write
			assert.equal(el._setCount, 3);
			go(2, stringEquals);
			// String('2') === String(2): the write is skipped
			assert.equal(el._setCount, 3);
			assert.equal(el._value, '2');
		});

		test('drop-in live parity: without `eq`, === against the coerced value', () => {
			const el = go(2.1);
			el.value = '2.';
			// '2.' !== 2 -> live rewrites the element with the normalized 2
			go(2);
			assert.equal(el._setCount, 3);
			assert.equal(el._value, '2');
		});

		test('noChange passes through', () => {
			const el = go('a');
			el.value = 'b'; // external
			go(noChange);
			assert.equal(el._value, 'b');
			assert.equal(el._setCount, 2); // noChange does not commit
		});

		test('nothing passes through: the machinery blanks the value, never the sentinel', () => {
			const el = go('a');
			go(nothing);
			// the property part commits undefined for nothing; the sentinel
			// itself must never reach the element or `eq`
			assert.equal(el._value, undefined);
			assert.equal(el._setCount, 2);
		});

		test('rejects child parts and multi-expression bindings', () => {
			assert.throws(() => {
				render(html`<div>${liveEq(2)}</div>`, container);
			});
		});
	});

	suite('attributes', () => {
		const go = (value, eq) => {
			render(html`<div id="a" class=${liveEq(value, eq)}></div>`, container);
			return container.firstElementChild;
		};

		test('updates an externally set attribute', () => {
			const el = go('a');
			el.setAttribute('class', 'b');
			go('a');
			assert.equal(el.getAttribute('class'), 'a');
		});

		test('removes an attribute with nothing', () => {
			const el = go('a');
			go(nothing);
			assert.isFalse(el.hasAttribute('class'));
		});

		test('noChange keeps the attribute', () => {
			const el = go('a');
			el.setAttribute('class', 'b');
			go(noChange);
			assert.equal(el.getAttribute('class'), 'b');
		});
	});
});

suite('live-eq predicates', () => {
	test('stringEquals: number/string coercions compare as strings', () => {
		assert.isTrue(stringEquals(2, '2'));
		assert.isTrue(stringEquals('2', 2));
		assert.isFalse(stringEquals('2', '3'));
		assert.isFalse(stringEquals(2, '2.'));
		assert.isFalse(stringEquals('2.', '2.0')); // '2.'≈2 is numericEquals's case
	});

	test('numericEquals: coercion and NaN equality', () => {
		assert.isTrue(numericEquals('2.', 2));
		assert.isTrue(numericEquals(2, '2.0'));
		assert.isFalse(numericEquals('2.', 3));
		assert.isTrue(numericEquals('-', undefined));
		assert.isTrue(numericEquals('abc', undefined));
		assert.isTrue(numericEquals('abc', 'e'));
	});
});
