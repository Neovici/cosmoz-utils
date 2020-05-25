import {
	hook, Hook
} from 'haunted';

export const useHost = hook(class extends Hook {
	update() {
		return this.state.host;
	}
});
