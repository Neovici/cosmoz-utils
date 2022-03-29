class ManagedPromise extends Promise {
	constructor(callback) {
		const handles = {};
		super((resolve, reject) => Object.assign(handles, { resolve, reject }));
		Object.assign(this, handles);
		callback?.(handles.resolve, handles.reject);
	}
}


const timeout$ = ms => new Promise(res => setTimeout(res, ms)),
	event$ = (target, type, predicate = () => true, timeout = 300000) =>
		new Promise((resolve, reject) => {
			let handler;
			const tid = setTimeout(() => {
				target.removeEventListener(type, handler);
				reject(new Error('Timeout out'));
			}, timeout);
			target.addEventListener(
				type,
				handler = e => {
					if (predicate(e)) {
						target.removeEventListener(type, handler);
						clearTimeout(tid);
						resolve(e);
					}
				}
			);
		}),
	limit$ = (fn, limit) => {
		const state = {
				queue: [],
				pending: []
			},
			process = () => {
				if (state.queue.length === 0) {
					return;
				}

				if (state.pending.length >= limit) {
					return;
				}

				const task = state.queue.shift();
				state.pending.push(task);
				Promise.resolve(fn(...task.args))
					.then(task.resolve, task.reject)
					.then(() => {
						state.pending.splice(state.pending.indexOf(task), 1);
						process();
					});
			};

		return (...args) =>
			new Promise((resolve, reject) => {
				state.queue.push({ args, resolve, reject });
				process();
			});
	},
	debounce$ = (fn, ms) => {
		let timeoutId;
		const pending = [];
		return (...args) =>
			new Promise((res, rej) => {
				clearTimeout(timeoutId);
				timeoutId = setTimeout(() => {
					const currentPending = [...pending];
					pending.length = 0;
					Promise.resolve(fn(...args)).then(
						data => {
							currentPending.forEach(({ resolve }) => resolve(data));
						},
						error => {
							currentPending.forEach(({ reject }) => reject(error));
						}
					);
				}, ms);
				pending.push({ resolve: res, reject: rej });
			});
	};

export {
	ManagedPromise,
	timeout$,
	event$,
	limit$,
	debounce$
};
