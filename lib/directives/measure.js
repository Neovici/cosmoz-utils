import { directive } from 'lit-html';
import {array} from '../array';

export const measure = directive((select, onMeasure) => part => {
	// Set up the resize observer.
	if (!part._resizeObserver) {
		part._resizeObserver = new ResizeObserver(entries => {
			// Ensure that the onMeasure callback is called with *all* selected elements dimensions.
			// NOTE: `entries` can be a subset of the observed elements, i.e. the ones that actually changed dimensions.
			entries.forEach(entry => {
				part._measurements[part._observedElements.indexOf(entry.target)] = entry.contentRect;
			});

			onMeasure(part._measurements);
		});
	}

	// Observe the same elements, if the selection function did not change,
	if (part._select === select) {
		return;
	}

	// Stop observing previously selected elements.
	if (part._observedElements) {
		part._observedElements.forEach(element => part._resizeObserver.unobserve(element));
	}

	// Reset measurements.
	part._measurements = [];
	part._select = select;

	// Postpone the selection until the DOM has been updated.
	requestAnimationFrame(() => {
		// Start observing selected elements.
		part._observedElements = array(part._select(part.committer.element));
		part._observedElements.forEach(element => part._resizeObserver.observe(element));
	});
});
