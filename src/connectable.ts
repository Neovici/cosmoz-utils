declare global {
	interface HTMLElement {
		connectedCallback(): void;
		disconnectedCallback(): void;
	}
}

/**
 * A mixin that dispatches 'connected' and 'disconnected' custom events
 * when the element is attached to or detached from the DOM.
 *
 * Useful for components that need to react to their connection state,
 * e.g., showing popovers when connected.
 *
 * @example
 * ```ts
 * import { connectable } from '@neovici/cosmoz-utils/connectable';
 * import { component } from '@pionjs/pion';
 *
 * const MyComponent = () => html`<div>Hello</div>`;
 *
 * customElements.define(
 *   'my-component',
 *   connectable(component(MyComponent))
 * );
 *
 * // Usage in template:
 * html`<my-component @connected=${(e) => e.target.showPopover?.()}></my-component>`
 * ```
 */
export const connectable = (base = HTMLElement) =>
	class extends base {
		connectedCallback() {
			super.connectedCallback?.();
			this.dispatchEvent(new CustomEvent('connected'));
		}
		disconnectedCallback() {
			super.disconnectedCallback?.();
			this.dispatchEvent(new CustomEvent('disconnected'));
		}
	};
