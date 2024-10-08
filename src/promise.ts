/* eslint-disable import/group-exports */
type Pfn<T> = (arg?: T) => void;
interface Pfnc<T> {
	resolve: Pfn<T>;
	reject: Pfn<T>;
}
export class ManagedPromise<T> extends Promise<T> {
	constructor(callback?: (resolve: Pfn<T>, reject: Pfn<T>) => void) {
		const handles: Pfnc<T> = {} as Pfnc<T>;
		super((resolve, reject) => Object.assign(handles, { resolve, reject }));
		Object.assign(this, handles);
		callback?.(handles.resolve, handles.reject);
	}
	// eslint-disable-next-line no-empty-function
	resolve: Pfn<T> = () => {};
}

export const timeout$ = (ms?: number) =>
	new Promise((res) => setTimeout(res, ms));

type Predicate<T extends Event> = (e: T) => boolean;
export const event$ = <E extends Event, P extends Predicate<E> = Predicate<E>>(
	target: EventTarget,
	type: string,
	predicate?: P,
	timeout = 300000,
) =>
	new Promise<E>((resolve, reject) => {
		let handler: (e: E) => void;
		const tid = setTimeout(() => {
			target.removeEventListener(type, handler as EventListener);
			reject(new Error('Timeout out'));
		}, timeout);
		target.addEventListener(
			type,
			(handler = (e: E) => {
				if (predicate == null || predicate(e)) {
					target.removeEventListener(type, handler as EventListener);
					clearTimeout(tid);
					resolve(e);
				}
			}) as EventListener,
		);
	});

interface Task<T, P> {
	args: T;
	resolve: (a: P) => void;
	reject: (a: P) => void;
}
export const limit$ = <T extends unknown[], P>(
	fn: (...args: T) => PromiseLike<P>,
	limit: number,
) => {
	const state: Record<'queue' | 'pending', Task<T, P>[]> = {
			queue: [],
			pending: [],
		},
		process = () => {
			if (state.queue.length === 0) {
				return;
			}

			if (state.pending.length >= limit) {
				return;
			}

			const task = state.queue.shift() as Task<T, P>;
			state.pending.push(task);
			Promise.resolve(fn(...task.args))
				.then(task.resolve, task.reject)
				.then(() => {
					state.pending.splice(state.pending.indexOf(task), 1);
					process();
				});
		};

	return (...args: T) =>
		new Promise<P>((resolve, reject) => {
			state.queue.push({ args, resolve, reject });
			process();
		});
};

type Pending<T, P> = Pick<Task<T, P>, 'resolve' | 'reject'>;
export const debounce$ = <T extends unknown[], P>(
	fn: (...args: T) => P | PromiseLike<P>,
	ms?: number,
) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	const pending: Pending<T, P>[] = [];
	return (...args: T): Promise<P> =>
		new Promise((res, rej) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				const currentPending = [...pending];
				pending.length = 0;
				Promise.resolve(fn(...args)).then(
					(data) => {
						currentPending.forEach(({ resolve }) => resolve(data));
					},
					(error) => {
						currentPending.forEach(({ reject }) => reject(error));
					},
				);
			}, ms);
			pending.push({ resolve: res, reject: rej });
		});
};

export const log$ =
	<T extends unknown[], P>(fn: (...args: T) => PromiseLike<P>) =>
	(...args: T) =>
		fn(...args).then((response: P) => {
			// eslint-disable-next-line no-console
			console.log(response);
			return response;
		});

export const retry$ =
	<T extends unknown[], P>(fn: (...args: T) => P | PromiseLike<P>, n: number) =>
	async (...args: T) => {
		let r = 0;
		let error;
		while (r < n) {
			try {
				return await fn(...args);
			} catch (e) {
				error = e;
				r++;
			}
		}
		throw error;
	};
