import {
	directive, NodePart, html
} from 'lit-html';

const destroyOutlet = part => {
	part._outletPart.clear();
	part._outletPart.commit();

	const parent = part._outletPart.startNode.parentNode;
	parent.removeChild(part._outletPart.startNode);
	parent.removeChild(part._outletPart.endNode);
	part._outletPart = undefined;
};

/**
 * Helper element with a customizable disconnect behavior.
 */
class DisconnectObserver extends HTMLElement {
	disconnectedCallback() {
		this.onDisconnect();
	}
}

customElements.define('disconnect-observer', DisconnectObserver);

export const
	// eslint-disable-next-line max-statements
	portal = directive((content, outlet = document.body) => sourcePart => {
		// Initialize a disconnect-observer element that cleans up the outletPart when the sourcePart is removed from DOM.
		if (!sourcePart._portalCleanerSetUp) {
			sourcePart._portalCleanerSetUp = true;
			sourcePart.setValue(html`<disconnect-observer .onDisconnect="${ () => {
				destroyOutlet(sourcePart);
				sourcePart._portalCleanerSetUp = undefined;
			} }">`);
		}

		// Clean up a previously set up outletPart if the outlet target has changed
		if (sourcePart._outletPart && sourcePart._outlet !== outlet) {
			destroyOutlet(sourcePart);
		}

		if (!sourcePart._outletPart) {
			// Create a new sourcePart to be used as output of this directive.
			sourcePart._outletPart = new NodePart(sourcePart.options);
			sourcePart._outletPart.appendInto(outlet);
			sourcePart._outlet = outlet;
		}

		// Update the outlet's content.
		sourcePart._outletPart.setValue(content);
		sourcePart._outletPart.commit();
	});
