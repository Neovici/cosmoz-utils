import { nothing } from 'lit-html';
import { Directive, directive } from 'lit-html/directive.js';
import { array } from '../array';

class MeasureDirective extends Directive {
	render() {
		return nothing;
	}

	update(part, [select, onMeasure]) {
		this.measure(part.element, select, onMeasure);
		return nothing;
	}

	measure(element, select, onMeasure) {
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
		return nothing;
	}
}

export const measure = directive(MeasureDirective);
