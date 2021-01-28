import { useMemo } from 'haunted';

/**
 * Copies properties of an Object into a memoized object.
 * Useful to create an object that does not change.
 *
 * @param {Object} meta - The source object
 * @returns {Object} The memoized object.
 */
export const useMeta = meta => {
	const ref = useMemo(() => ({}), []);
	return useMemo(() => Object.assign(ref, meta), [ref, ...Object.values(meta)]);
};

