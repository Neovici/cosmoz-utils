import { useEffect, useState } from '@pionjs/pion';

type ScopedViewTransition = {
	ready: Promise<void>;
	finished: Promise<void>;
};

type Scope = Element & {
	startViewTransition?: (
		update:
			| (() => Promise<void>)
			| { update: () => Promise<void>; types?: string[] },
	) => ScopedViewTransition;
};

const query = () => matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = () => query().matches;

export const useReducedMotion = () => {
	const [reduced, setReduced] = useState(prefersReducedMotion);

	useEffect(() => {
		const mql = query(),
			onChange = () => setReduced(mql.matches);
		mql.addEventListener('change', onChange);
		return () => mql.removeEventListener('change', onChange);
	}, []);

	return reduced;
};

export interface ScopedTransitionOptions {
	/** The new state is captured when this settles, or after `timeout`. */
	ready?: Promise<unknown>;
	/** Longest wait for `ready`, in ms. Motion never holds data back longer. */
	timeout?: number;
	/** View transition types, matched with `:active-view-transition-type()`. */
	types?: string[];
}

/**
 * Runs `update` as a view transition scoped to `scope`, so the rest of the page
 * stays live. Without element-scoped view transitions, or when the user prefers
 * reduced motion, `update` runs at once with no animation.
 */
export const scopedTransition = async (
	scope: Element,
	update: () => unknown,
	{ ready, timeout = 250, types }: ScopedTransitionOptions = {},
): Promise<void> => {
	const start = (scope as Scope).startViewTransition?.bind(scope);
	if (!start || prefersReducedMotion()) {
		await update();
		return;
	}
	const run = async () => {
			await update();
			if (!ready) return;
			await Promise.race([
				ready.catch(() => undefined),
				new Promise((resolve) => setTimeout(resolve, timeout)),
			]);
		},
		transition = start(types ? { update: run, types } : run);
	transition.ready.catch(() => undefined);
	await transition.finished.catch(() => undefined);
};
