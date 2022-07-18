import { useEffect } from 'haunted';

export const useHandleDrop = <T extends HTMLElement>(
	el: T,
	callback: (e: DragEvent)=>void
) =>
	useEffect(() => {
		const dragStop = (event: DragEvent) => {
				event.stopPropagation();
				event.preventDefault();
			},
			handleDrop = (event: DragEvent) => {
				dragStop(event);
				callback(event as DragEvent);
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
