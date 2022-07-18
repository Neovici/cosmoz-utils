import { html, nothing, render, Part, ChildPart } from 'lit-html';
import { AsyncDirective, directive } from 'lit-html/async-directive.js';
import {
	setChildPartValue,
	clearPart,
	removePart,
} from 'lit-html/directive-helpers.js';

type ChildPartCC = new (...args: unknown[]) => ChildPart;

const createMarker = () => document.createComment(''),
	ChildPartC = render(nothing, new DocumentFragment())
		.constructor as ChildPartCC;

/**
 * Helper element with a customizable disconnect behavior.
 */
class DisconnectObserver extends HTMLElement {
	onDisconnect?: () => void;
	disconnectedCallback() {
		this.onDisconnect?.();
	}
}
customElements.define('disconnect-observer', DisconnectObserver);

class PortalDirective extends AsyncDirective {
	_op?: ChildPart;
	_outlet?: HTMLElement;
	_content?: Part;
	render() {
		return html`<disconnect-observer
			.onDisconnect=${() => {
				this.isConnected = false;
				this.disconnected();
			}}
		></disconnect-observer>`;
	}
	update(part: Part, [content, outlet = document.body]: [Part, HTMLElement]) {
		this.updateOutlet(outlet, content);
		return this.render();
	}

	updateOutlet(outlet: HTMLElement, content: Part) {
		if (this._outlet !== outlet) {
			this.clearOutlet();
		}
		this._outlet = outlet;
		const part = (this._op ??= new ChildPartC(
			outlet.appendChild(createMarker()),
			outlet.appendChild(createMarker())
		));
		setChildPartValue(part, (this._content = content));
	}

	clearOutlet() {
		const part = this._op;
		if (!part) {
			return;
		}
		clearPart(part);
		removePart(part);
		this._op = undefined;
	}

	disconnected() {
		this.clearOutlet();
	}
	reconnected() {
		if (this._outlet && this._content) {
			this.updateOutlet(this._outlet, this._content);
		}
	}
}

export const portal = directive(PortalDirective);
