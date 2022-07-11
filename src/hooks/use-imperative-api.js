import {
	Hook, hook
} from 'haunted';

export const useImperativeApi = hook(class extends Hook {
	constructor(id, state, api, values) {
		super(id, state);
		Object.assign(state.host, api);
		this.values = values;
	}

	update(api, values) {
		if (this.hasChanged(values)) {
			this.values = values;
			Object.assign(this.state.host, api);
		}
	}

	hasChanged(values = []) {
		return values.some((value, i) => this.values[i] !== value);
	}
});
