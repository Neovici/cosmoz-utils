import { useEffect } from 'haunted';
import { useHost } from './use-host';

const UPPER = /([A-Z])/gu,

	/* Emulate polymer notify props */
	notifyProperty = (host, name, value) => {
		// this is required to make polymer double-binding recognize the change
		// @see https://github.com/Polymer/polymer/blob/76c71e186ecc605294c3575dd31ac7983a8b3ae3/lib/mixins/property-effects.js#L382
		host[name] = value;

		// emulate polymer notify event
		host.dispatchEvent(new CustomEvent(name.replace(UPPER, '-$1').toLowerCase() + '-changed', { detail: { value }}));
	},

	useNotifyProperty = (name, value) => {
		const host = useHost();
		useEffect(() => {
			notifyProperty(host, name, value);
		}, [value]);
	};

export {
	notifyProperty,
	useNotifyProperty
};
