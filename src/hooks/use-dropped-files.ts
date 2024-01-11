import { useState, useCallback } from '@pionjs/pion';
import { useHandleDrop } from './use-handle-drop';

export const useDroppedFiles = <T extends HTMLElement>(el: T) => {
	const [files, setFiles] = useState<File[]>([]),
		handleDrop = useCallback(
			(event: DragEvent) =>
				setFiles(Array.from(event.dataTransfer?.files ?? [])),
			[setFiles]
		);
	useHandleDrop(el, handleDrop);
	return files;
};
