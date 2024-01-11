import { useCallback } from '@pionjs/pion';
import { useMeta } from './use-meta';
import { parse } from '../number';

export const applyMove = <T>(list: T[], from: number, to: number) => {
	const newList = list.slice();
	newList.splice(to + (from >= to ? 0 : -1), 0, newList.splice(from, 1)[0]);
	return newList;
};

const getIndexer = (prefix?: string) => {
	const key = ['move-index', prefix].filter(Boolean).join('-');
	return {
		set(dt: DataTransfer, index: string | number) {
			const idx = index.toString();
			dt.setData(key, idx);
			dt.setData('text/plain', idx);
		},
		get(dt: DataTransfer) {
			return parse(dt.getData(key));
		},
		has(dt: DataTransfer) {
			return dt.types.includes(key);
		},
	};
};

interface Opts {
	prefix?: string;
}

export const useDragItems = (
	onMove?: (from: number, to: number) => void,
	{ prefix }: Opts = {}
) => {
	const meta = useMeta<{ handle?: HTMLElement; onMove?: typeof onMove }>({
		onMove,
	});
	const indexer = getIndexer(prefix);

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
				const dt = e.dataTransfer!;
				dt.effectAllowed = 'move';
				indexer.set(dt, index);
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
			const ctg = e.currentTarget as HTMLElement;
			const dt = e.dataTransfer as DataTransfer;
			if (ctg !== e.target || !indexer.has(dt)) return;
			e.preventDefault();
			dt.dropEffect = 'move';
			ctg.dataset.dragover = '';
		}, []),

		onDragOver: useCallback((e: DragEvent) => {
			if (!indexer.has(e.dataTransfer!)) return;
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
				const ctg = e.currentTarget as HTMLElement;
				const dt = e.dataTransfer as DataTransfer;
				delete ctg.dataset.dragover;
				if (!indexer.has(dt)) return;
				const from = indexer.get(dt) || 0;
				const to = parse(ctg.dataset.index) || 0;
				e.preventDefault();
				meta.onMove?.(from, to);
			},
			[meta]
		),
	};
};
