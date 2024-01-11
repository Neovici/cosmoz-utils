import { Context, ContextDetail } from '@pionjs/pion/lib/create-context';
import { contextEvent } from '@pionjs/pion/lib/symbols';
import { noChange, nothing } from 'lit-html';
import { AsyncDirective, directive } from 'lit-html/async-directive.js';
import { ChildPart } from 'lit-html/directive.js';

class ProvideDirective<T> extends AsyncDirective {
	value!: T;
	context!: Context<T>;

	listeners: Set<(value: T) => void> = new Set();
	cleanup!: VoidFunction | undefined;

	update(part: ChildPart, [context, value]: [Context<T>, T]) {
		this.context = context;

		if (this.value !== value) {
			this.value = value;

			for (const callback of this.listeners) {
				callback(value);
			}
		}

		if (!this.cleanup) {
			part.parentNode.addEventListener(contextEvent, this);
			this.cleanup = () =>
				part.parentNode.removeEventListener(contextEvent, this);
		}

		return noChange;
	}

	render() {
		return nothing;
	}

	handleEvent(event: CustomEvent<ContextDetail<T>>): void {
		const { detail } = event;

		if (detail.Context !== this.context) return;

		detail.value = this.value;
		detail.unsubscribe = this.unsubscribe.bind(this, detail.callback);

		this.listeners.add(detail.callback);

		event.stopPropagation();
	}

	unsubscribe(callback: (value: T) => void): void {
		this.listeners.delete(callback);
	}

	protected disconnected(): void {
		this.cleanup?.();
		this.cleanup = undefined;
	}
}

export const provide = directive(ProvideDirective);
