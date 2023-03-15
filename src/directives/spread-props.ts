import { AttributePart, noChange } from 'lit-html';
import { Directive, directive } from 'lit-html/directive.js';

const undefs = <T extends object, P extends object>(prev?: T, obj?: P) => {
	if (!prev || !obj) {
		return;
	}
	const keys = Object.keys(obj);
	return Object.fromEntries(
		Object.keys(prev).flatMap((k) => (keys.includes(k) ? [] : [[k, undefined]]))
	);
};

class SpreadPropsDirective<T extends object> extends Directive {
	_props?: T;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render(props: T) {
		return noChange;
	}

	update(part: AttributePart, [props]: [T]) {
		if (this._props !== props) {
			Object.assign(
				part.element,
				undefs<T, T>(this._props, props),
				(this._props = props)
			);
		}
		return noChange;
	}
}

export const spreadProps = directive(SpreadPropsDirective);
