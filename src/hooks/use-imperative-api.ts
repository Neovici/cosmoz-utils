import { Hook, hook, State } from '@pionjs/pion';

export const useImperativeApi = hook(
	class<A, D = unknown> extends Hook<[A, D[]], void> {
		values: D[];
		constructor(id: number, state: State, api: A, values: D[]) {
			super(id, state);
			Object.assign(state.host as HTMLElement, api);
			this.values = values;
		}

		update(api: A, values: D[]) {
			if (this.hasChanged(values)) {
				this.values = values;
				Object.assign(this.state.host as HTMLElement, api);
			}
		}

		hasChanged(values: D[] = []) {
			return values.some((value, i) => this.values[i] !== value);
		}
	}
);
