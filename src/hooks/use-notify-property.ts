import { useEffect } from 'haunted';
import { useHost } from './use-host';

const UPPER = /([A-Z])/gu,
	/* Emulate polymer notify props */
	notifyProperty = <
		T extends HTMLElement,
		K extends Extract<keyof T, string>,
		V extends T[K]
	>(
		host: T,
		name: K,
		value: V
	) => {
		// this is required to make polymer double-binding recognize the change
		// @see https://github.com/Polymer/polymer/blob/76c71e186ecc605294c3575dd31ac7983a8b3ae3/lib/mixins/property-effects.js#L382
		host[name] = value;

		// emulate polymer notify event
		host.dispatchEvent(
			new CustomEvent(name.replace(UPPER, '-$1').toLowerCase() + '-changed', {
				detail: { value },
			})
		);
	},
	useNotifyProperty = <
		T extends HTMLElement,
		K extends Extract<keyof T, string>,
		V extends T[K]
	>(
		name: K,
		value: V
	) => {
		const host = useHost<T>();
		useEffect(() => {
			notifyProperty(host, name, value);
		}, [value]);
	};

export { notifyProperty, useNotifyProperty };
