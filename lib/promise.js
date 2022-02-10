export const
  timeout$ = (ms)=>new Promise(res=>setTimeout(res, ms)),
  event$ = (target, type, predicate = () => true, timeout = 60000) => new Promise((resolve, reject) => {
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
	});
