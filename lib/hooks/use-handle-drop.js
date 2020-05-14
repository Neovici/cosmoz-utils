import { useEffect } from 'haunted';

export const useHandleDrop = (el, callback) =>
	useEffect(() => {
		const dragStop = event => {
				event.stopPropagation();
				event.preventDefault();
			},
			handleDrop = event => {
				dragStop(event);
				callback(event);
			};

		el.addEventListener('dragenter', dragStop);
		el.addEventListener('dragover', dragStop);
		el.addEventListener('drop', handleDrop);
		return () => {
			el.removeEventListener('dragenter', dragStop);
			el.removeEventListener('dragover', dragStop);
			el.removeEventListener('drop', handleDrop);
		};
	}, [el, callback]);
