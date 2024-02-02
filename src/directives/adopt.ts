import {
	Directive,
	directive,
	ElementPart,
	DirectiveParameters,
} from 'lit-html/directive.js';
import { noChange } from 'lit-html';

class AdoptCss extends Directive {
	stylesheet: CSSStyleSheet | undefined;

	update(part: ElementPart, [stylesheet]: DirectiveParameters<this>) {
		if (this.stylesheet === stylesheet) return noChange;

		this.stylesheet = stylesheet;

		const shadowRoot = part.element.shadowRoot;
		if (!shadowRoot) return noChange;

		shadowRoot.adoptedStyleSheets = [
			...shadowRoot.adoptedStyleSheets,
			stylesheet,
		];
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render(stylesheet: CSSStyleSheet) {
		return noChange;
	}
}

export const adopt = directive(AdoptCss);
