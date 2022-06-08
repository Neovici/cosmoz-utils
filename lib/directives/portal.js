import { html, nothing, render } from 'lit-html';
import { AsyncDirective, directive } from 'lit-html/async-directive.js';
import {
	setChildPartValue,
	clearPart,
	removePart,
} from 'lit-html/directive-helpers.js';
const createMarker = () => document.createComment(''),
	ChildPart = render(nothing, new DocumentFragment()).constructor;

/**
 * Helper element with a customizable disconnect behavior.
 */
class DisconnectObserver extends HTMLElement {
	disconnectedCallback() {
		this.onDisconnect();
	}
}
customElements.define('disconnect-observer', DisconnectObserver);

class PortalDirective extends AsyncDirective {
	render() {
		return html`<disconnect-observer
			.onDisconnect=${() => {
				this.isConnected = false;
				this.disconnected();
			}}
		></disconnect-observer>`;
	}
	update(part, [content, outlet = document.body]) {
		this.updateOutlet(outlet, content);
		return this.render();
	}

	updateOutlet(outlet, content) {
		if (this._outlet !== outlet) {
			this.clearOutlet();
		}
		this._outlet = outlet;
		const part = (this._op ??= new ChildPart(
			outlet.appendChild(createMarker()),
			outlet.appendChild(createMarker())
		));
		setChildPartValue(part, (this.content = content));
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
		this.updateOutlet(this._outlet, this._content);
	}
}

export const portal = directive(PortalDirective);
