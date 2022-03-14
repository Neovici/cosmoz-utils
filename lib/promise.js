export const
	timeout$ = ms => new Promise(res => setTimeout(res, ms)),
	event$ = (target, type, predicate = () => true, timeout = 300000) => new Promise((resolve, reject) => {
		let handler;
		const tid = setTimeout(() => {
			target.removeEventListener(type, handler);
			reject(new Error('Timeout out'));
		}, timeout);
		target.addEventListener(type, handler = e => {
			if (predicate(e)) {
				target.removeEventListener(type, handler);
				clearTimeout(tid);
				resolve(e);
			}
		});
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
				fn(...task.args)
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
	};

