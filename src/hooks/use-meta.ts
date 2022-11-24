import { useMemo } from 'haunted';
import { Rec } from '../object';

/**
 * Copies properties of an Object into a memoized object.
 * Useful to create an object that does not change.
 *
 * @param {Object} meta - The source object
 * @returns {Object} The memoized object.
 */
export const useMeta = <T extends Rec>(meta: T) => {
	const ref = useMemo(() => ({}), []);
	return useMemo(
		() => Object.assign(ref, meta) as T,
		[ref, ...Object.values(meta)]
	);
};
