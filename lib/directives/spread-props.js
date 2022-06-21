import { nothing } from 'lit-html';
import { Directive, directive } from 'lit-html/directive.js';

const undefs = (prev, obj) => {
	if (!prev || !obj) {
		return;
	}
	const keys = Object.keys(obj);
	return Object.fromEntries(
		Object.keys(prev).flatMap((k) => (keys.includes(k) ? [] : [[k, undefined]]))
	);
};

class SpreadPropsDirective extends Directive {
	render() {
		return nothing;
	}

	update(part, [props]) {
		if (this._props !== props) {
			Object.assign(
				part.element,
				undefs(this._props, props),
				(this._props = props)
			);
		}
		return nothing;
	}
}

export const spreadProps = directive(SpreadPropsDirective);
