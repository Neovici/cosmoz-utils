import {
	assert, fixture, html, nextFrame
} from '@open-wc/testing';

import {
	PolymerElement, html as polymerHtml
} from '@polymer/polymer';

import { hauntedPolymer } from '../lib/haunted-polymer.js';
import { useMemo } from 'haunted';
import { spy } from 'sinon';

const useTestHook = element => {
	return useMemo(() => {
		switch (element.mood) {
		case 'happy': return 'not so scared';
		case 'frightened': return 'very scared';
		}
	}, [element.mood]);
};

class MyHauntedPolymer extends hauntedPolymer('scared', useTestHook)(PolymerElement) {
	static get properties() {
		return {
			scared: {
				type: String
			},
			mood: {
				type: String,
				value: 'happy',
				// In order for hauntedPolymer to detect a change, property effects need to be initialized for that specific property.
				// To do this make sure there exists a template binding for that prop or that it is a notifying prop.
				notify: true
			}
		};
	}
}

customElements.define('my-haunted-polymer', MyHauntedPolymer);

suite('haunted polymer', () => {
	let basicFixture;
	setup(async () => {
		basicFixture = await fixture(html`<my-haunted-polymer></my-haunted-polymer>`);
	});
	test('happy start', () => {
		assert.equal(basicFixture.mood, 'happy');
		assert.equal(basicFixture.scared, 'not so scared');
	});
	test('👻', async () => {
		basicFixture.mood = 'frightened';
		await nextFrame();
		assert.equal(basicFixture.scared, 'very scared');
	});
});

const useLitTemplate = ({ text }) => {
	return useMemo(() => html`lit says: ${ text }`, [text]);
};

class RendersFromHook extends hauntedPolymer('lit', useLitTemplate)(PolymerElement) {
	static get properties() {
		return {
			text: {
				type: String,
				notify: true
			}
		};
	}

	static get template() {
		return polymerHtml`<div id="outlet"></div>`;
	}

	static get observers() {
		return ['renderLitTo(lit, $.outlet)'];
	}
}

customElements.define('renders-from-hook', RendersFromHook);

suite('haunted polymer render lit', () => {
	test('basic', async () => {
		const basicFixture = await fixture(html`<renders-from-hook text=${ 'hi' }></renders-from-hook>`);
		await nextFrame();
		assert.equal(basicFixture.shadowRoot.textContent, 'lit says: hi');

		basicFixture.text = 'bye';
		await nextFrame();
		await nextFrame();
		assert.equal(basicFixture.shadowRoot.textContent, 'lit says: bye');
	});
});

const useSum = ({
	a, b
}) => {
	return { sum: useMemo(() => a + b, [a, b]) };
};

class myCalculator extends hauntedPolymer(useSum)(PolymerElement) {
	static get properties() {
		return {
			a: {
				type: Number
			},
			b: {
				type: Number
			}
		};
	}

	static get template() {
		return polymerHtml`[[ a ]] + [[ b ]] = [[ sum ]]`;
	}
}

customElements.define('my-calculator', myCalculator);

suite('haunted polymer without outputPath', () => {
	test('basic', async () => {
		const calculator = await fixture(html`<my-calculator a="1" b="2"></my-calculator>`);
		assert.equal(calculator.shadowRoot.textContent, '1 + 2 = 3');
		calculator.a = 5;
		await nextFrame();
		assert.equal(calculator.shadowRoot.textContent, '5 + 2 = 7');
	});
});

const useLitSum = ({
	a, b
}) => {
	return {
		sum: html`${ a + b }`,
		diff: b - a
	};
};

class myLitCalculator extends hauntedPolymer(useLitSum)(PolymerElement) {
	static get properties() {
		return {
			a: {
				type: Number
			},
			b: {
				type: Number
			},
			// normally you should omit listing props that are set by the haunted hook
			// if you *need* to define a haunted prop as a polymer prop (for notify purposes for example), mark them as haunted prop
			diff: {
				type: Number,
				haunted: true,
				notify: true
			}
		};
	}

	static get template() {
		return polymerHtml`
			[[ a ]] + [[ b ]] = <span id="sum"></span>
			[[ b ]] - [[ a ]] = [[ diff ]]
		`;
	}

	static get observers() {
		return ['renderLitTo(sum, $.sum)'];
	}
}

customElements.define('my-lit-calculator', myLitCalculator);

suite('haunted polymer with lit rendering and notifying props', () => {
	test('basic', async () => {
		const diffChanged = spy(),
			calculator = await fixture(html`<my-lit-calculator a="1" b="2" @diff-changed=${ diffChanged }></my-lit-calculator>`);

		spy(calculator, 'renderLitTo');

		await nextFrame();
		assert.equal(calculator.shadowRoot.textContent.replace(/[\n\t]/gui, ''), '1 + 2 = 32 - 1 = 1');

		calculator.a = 5;
		await nextFrame();
		await nextFrame();
		assert.equal(calculator.shadowRoot.textContent.replace(/[\n\t]/gui, ''), '5 + 2 = 72 - 5 = -3');

		await nextFrame();
		await nextFrame();
		assert.lengthOf(calculator.renderLitTo.getCalls(), 1);
		assert.isTrue(diffChanged.calledTwice);
	});
});
