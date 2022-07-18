import { AttributePart, noChange } from 'lit-html';
import { Directive, directive } from 'lit-html/directive.js';
import { array } from '../array';

type OnMeasure = (rects: DOMRectReadOnly[]) => void;
type Select = (el: HTMLElement) => HTMLElement[];

class MeasureDirective extends Directive {
	_observer?: ResizeObserver;
	render() {
		return noChange;
	}

	update(part: AttributePart, [select, onMeasure]: [Select, OnMeasure]) {
		this.measure(part.element, select, onMeasure);
		return noChange;
	}

	measure(element: HTMLElement, select: Select, onMeasure: OnMeasure) {
		this._observer?.disconnect();
		const elements = array(select(element)),
			observer = (this._observer = new ResizeObserver((entries) => {
				onMeasure(
					entries
						.sort(
							(a, b) => elements.indexOf(a.target) - elements.indexOf(b.target)
						)
						.map((e) => e.contentRect)
				);
			}));
		elements.forEach((el) => observer.observe(el));
		return noChange;
	}
}

export const measure = directive(MeasureDirective);
