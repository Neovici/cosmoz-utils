import { useMemo } from '@pionjs/pion';
import { Rec } from '../object';

/**
 * Returns a stable object reference, mutated in-place with the
 * latest properties of `meta`. The identity never changes (`===`).
 */
export const useMeta = <T extends Rec>(meta: T) => {
	const ref = useMemo(() => ({}), []);
	return useMemo(
		() => Object.assign(ref, meta) as T,
		[ref, ...Object.values(meta)]
	);
};
