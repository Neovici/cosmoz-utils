import { useContext, useEffect } from '@pionjs/pion';
import { ActivityHandler } from './types';
import { Keybindings } from './context';
import { useMeta } from '../hooks/use-meta';

export const useActivity = (handler: ActivityHandler, deps: unknown[]) => {
	const register = useContext(Keybindings);
	const meta = useMeta(handler);
	useEffect(() => register(meta), deps);
};
