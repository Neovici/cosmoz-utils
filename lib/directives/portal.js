import {
	directive, NodePart
} from 'lit-html';

const destroyOutlet = part => {
	part._outletPart.clear();
	part._outletPart.commit();

	const parent = part._outletPart.startNode.parentNode;
	parent.removeChild(part._outletPart.startNode);
	parent.removeChild(part._outletPart.endNode);
	part._outletPart = undefined;
};

export const
	// eslint-disable-next-line max-statements
	portal = directive((content, outlet = document.body) => part => {
		if (part._outletPart && part._outlet !== outlet) {
			destroyOutlet(part);
		}

		if (!part._outletPart) {
			// Create a new part to be used as output of this directive.
			part._outletPart = new NodePart(part.options);
			part._outletPart.appendInto(outlet);
			part._outlet = outlet;
		}

		// Update the outlet's content.
		part._outletPart.setValue(content);
		part._outletPart.commit();

		// Run in an animation frame, so the DOM changes finish commiting.
		requestAnimationFrame(() => requestAnimationFrame(() => {
			// If the origin part is no longer connected
			// clear the outlet part and clean up the marker nodes.
			if (part.startNode.isConnected || !part._outletPart) {
				return;
			}

			destroyOutlet(part);
		}));
	});
