import { Context, ContextDetail } from '@pionjs/pion/lib/create-context';
import { contextEvent } from '@pionjs/pion/lib/symbols';
import { AttributePart, noChange } from 'lit-html';
import { AsyncDirective, directive } from 'lit-html/async-directive.js';
import {
	ChildPart,
	DirectiveParameters,
	DirectiveResult,
} from 'lit-html/directive.js';
import { identity } from '../function';

const getEmitter = (part: AttributePart | ChildPart) =>
	'element' in part ? part.element : part.parentNode;

class ConsumeDirective<T> extends AsyncDirective {
	value!: T;
	context!: Context<T>;
	pluck!: (value: T) => unknown;
	unsubscribe!: VoidFunction | null;
	raf!: number;

	update(
		part: AttributePart | ChildPart,
		[context, pluck = identity]: DirectiveParameters<this>,
	) {
		// if the context has changed OR we are not yet subscribed
		if (this.context !== context || !this.unsubscribe) {
			this.unsubscribe?.();

			this.context = context;
			this.pluck = pluck;

			// when first initialized, the element is not part of the DOM
			// so we attempt to subscribe in the next animation frame
			cancelAnimationFrame(this.raf);
			this.raf = requestAnimationFrame(() => this.subscribe(getEmitter(part)));

			return noChange;
		}

		if (this.pluck === pluck) {
			return noChange;
		}

		this.pluck = pluck;
		return this.render(context, pluck);
	}

	subscribe(emitter: Node) {
		const detail = { Context: this.context, callback: this.updater.bind(this) };
		emitter.dispatchEvent(
			new CustomEvent(contextEvent, {
				detail,
				bubbles: true,
				cancelable: true,
				composed: true,
			}),
		);
		const { unsubscribe = null, value } = detail as ContextDetail<T>;

		this.value = unsubscribe ? value : this.context.defaultValue;
		this.unsubscribe = unsubscribe;
		this.setValue(this.pluck(this.value));
	}

	render(context: Context<T>, pluck: (value: T) => unknown) {
		return pluck(this.value);
	}

	updater(value: T) {
		this.value = value;
		this.setValue(this.pluck(this.value));
	}

	disconnected(): void {
		this.unsubscribe?.();
	}
}

interface Consume {
	<T>(
		consume: Context<T>,
		pluck: (value: T) => unknown,
	): DirectiveResult<typeof ConsumeDirective<T>>;
}

export const consume: Consume = directive(ConsumeDirective) as Consume;
