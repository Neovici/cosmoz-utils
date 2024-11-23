/* eslint-disable no-alert */
import { component, css, html, useEffect, useState } from '@pionjs/pion';
import { KeyBinding } from '../../src/keybindings/types';
import { useKeybindings } from '../../src/keybindings/use-keybindings';
import { useActivity } from '../../src/keybindings/use-activity';

const twist = Symbol('twist');
const jump = Symbol('jump');
const add = Symbol('add');
const del = Symbol('delete');

const bindings: readonly KeyBinding[] = [
	[{ key: 't' }, [twist], { title: 't', description: 'Do the twist!' }],
	[{ key: 'j' }, [jump], { title: 'j', description: 'Jump around!' }],
	[{ key: 'Enter' }, [add], { title: 'Enter', description: 'More items' }],
	[{ key: ' ' }, [add], { title: 'Space', description: 'More items' }],
	[
		{ key: 'Backspace' },
		[del],
		{ title: 'Backspace', description: 'Less items' },
	],
] as const;

const DemoKeybindings = () => {
	const [n, setN] = useState(1);
	const register = useKeybindings(bindings);

	useEffect(
		() =>
			register({
				activity: del,
				callback: () => setN((n) => Math.max(0, n - 1)),
			}),
		[],
	);
	useEffect(
		() =>
			register({
				activity: add,
				callback: () => setN((n) => n + 1),
			}),
		[],
	);

	return html` <div>
			<textarea>Focus me and make sure that you can type</textarea>
		</div>
		<ul>
			${bindings.map(
				([, , details]) =>
					html`<li>${details.title} - ${details.description}</li>`,
			)}
		</ul>
		<cosmoz-keybinding-provider .value=${register}>
			${Array.from(new Array(n)).map(() => html`<demo-element></demo-element>`)}
			<div class="no-go"></div>
		</cosmoz-keybinding-provider>`;
};

customElements.define(
	'demo-keybindings',
	component(DemoKeybindings, {
		styleSheets: [
			css`
				.no-go {
					width: 200px;
					height: 200px;
					position: absolute;
					top: 100px;
					left: 200px;
					background: red;
					opacity: 0.2;
				}
			`,
		],
	}),
);

const twisting: Keyframe[] = [
		{ transform: 'rotate(0)' },
		{ transform: 'rotate(360deg)' },
	],
	jumping: Keyframe[] = [
		{ transform: 'translateY(0)' },
		{ transform: 'translateY(-40px)' },
		{ transform: 'translateY(0px)' },
		{ transform: 'translateY(-40px)' },
		{ transform: 'translateY(0px)' },
	],
	animate = (el: HTMLElement, animation: Keyframe[]) => () => {
		const timing: KeyframeAnimationOptions = {
			duration: 500,
			iterations: 1,
			easing: 'ease-in-out',
			composite: 'accumulate',
		};

		el.animate(animation, timing);
	};

type Host = HTMLElement;

const DemoElement = (host: Host) => {
	useEffect(animate(host, jumping), []);

	const [activation, setActivation] = useState(Symbol());

	useActivity(
		{ activity: twist, callback: animate(host, twisting), element: () => host },
		[activation],
	);
	useActivity(
		{
			activity: jump,
			callback: animate(host, jumping),
			element: () => host,
		},
		[activation],
	);

	return html`<div
		@click=${animate(host, twisting)}
		@mouseenter=${() => setActivation(Symbol())}
	></div>`;
};

customElements.define(
	'demo-element',
	component(DemoElement, {
		styleSheets: [
			css`
				:host {
					display: inline-block;
					width: 20px;
					height: 20px;
					margin: 1px;
					vertical-align: middle;
					text-align: center;
					background: lightgray;
					color: white;
					user-select: none;
				}

				div {
					height: 100%;
				}
			`,
		],
	}),
);
