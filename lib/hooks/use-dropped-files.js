import {
	useState,
	useCallback
} from 'haunted';
import { useHandleDrop } from './use-handle-drop';

export const useDroppedFiles = el => {
	const [files, setFiles] = useState([]),
		handleDrop = useCallback(event => setFiles(event.dataTransfer.files), [setFiles]);
	useHandleDrop(el, handleDrop);
	return files;
};
