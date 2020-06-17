import {
	assert, fixture, html, aTimeout
} from '@open-wc/testing';

import {
	PolymerElement
} from '@polymer/polymer';

import { hauntedPolymer } from '../lib/haunted-polymer.js';
import { useMemo } from 'haunted';

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
				value: 'happy'
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
		await aTimeout(1000);
		assert.equal(basicFixture.scared, 'very scared');
	});
});
