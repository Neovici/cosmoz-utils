import { useCallback } from 'haunted';
import { useMeta } from './use-meta';
import { parse } from '../number';

export const applyMove = <T>(list: T[], from: number, to: number) => {
	const newList = list.slice();
	newList.splice(to + (from >= to ? 0 : -1), 0, newList.splice(from, 1)[0]);
};

export const useDragItems = (onMove?: (from: number, to: number) => void) => {
	const meta = useMeta<{ handle?: HTMLElement; onMove?: typeof onMove }>({
		onMove,
	});

	return {
		onDown: useCallback(
			(e: MouseEvent) => {
				if (!(e.target as HTMLElement).closest('[data-pull]')) {
					return;
				}
				meta.handle = e.currentTarget as HTMLElement;
			},
			[meta]
		),

		onDragStart: useCallback(
			(e: DragEvent) => {
				const target = e.target as HTMLElement,
					index = parse(target.dataset.index);

				if (!meta.handle?.contains(target) || index == null) {
					return e.preventDefault();
				}

				meta.handle = undefined;
				const dt = e.dataTransfer as DataTransfer;
				const idx = index.toString();
				dt.effectAllowed = 'move';
				dt.setData('move-index', idx);
				dt.setData('text/plain', idx);
				setTimeout(() => (target.dataset.drag = ''), 0);
				target.addEventListener(
					'dragend',
					(e) => delete (e.target as HTMLElement).dataset.drag,
					{ once: true }
				);
			},
			[meta]
		),

		onDragEnter: useCallback((e: DragEvent) => {
			const ctg = e.currentTarget;
			if (ctg !== e.target) {
				return;
			}

			e.preventDefault();
			(e.dataTransfer as DataTransfer).dropEffect = 'move';
			(ctg as HTMLElement).dataset.dragover = '';
		}, []),

		onDragOver: useCallback((e: DragEvent) => {
			e.preventDefault();
			(e.currentTarget as HTMLElement).dataset.dragover = '';
		}, []),

		onDragLeave: useCallback((e: DragEvent) => {
			const ctg = e.currentTarget as HTMLElement;
			if (ctg.contains(e.relatedTarget as HTMLElement)) {
				return;
			}
			delete ctg.dataset.dragover;
		}, []),

		onDrop: useCallback(
			(e: DragEvent) => {
				const from =
					parse((e.dataTransfer as DataTransfer).getData('move-index')) || 0;
				const to = parse((e.currentTarget as HTMLElement).dataset.index) || 0;
				delete (e.currentTarget as HTMLElement).dataset.dragover;
				e.preventDefault();
				meta.onMove?.(from, to);
			},
			[meta]
		),
	};
};
