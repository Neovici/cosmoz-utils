import { useEffect, useMemo } from 'haunted';

export const useAbortSignal = () => {
	const { controller, signal } = useMemo(() => {
		const controller = new AbortController(),
			signal = controller.signal;
		return { controller, signal };
	}, []);

	useEffect(() => () => controller.abort(), []);

	return signal;
};
