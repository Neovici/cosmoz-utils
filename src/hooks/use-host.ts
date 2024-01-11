import { hook, Hook } from '@pionjs/pion';

type UseHost  = <T extends HTMLElement>()=>T;

export const useHost: UseHost = hook(
	class extends Hook {
		update() {
			return this.state.host;
		}
	}
) as UseHost;
