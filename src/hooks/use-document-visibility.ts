import { useEffect, useState } from '@pionjs/pion';

export const useDocumentVisibility = () => {
	const [visibility, setVisibility] = useState<string>(
		document.visibilityState,
	);

	useEffect(() => {
		const handleVisibilityChange = () => {
			setVisibility(document.visibilityState);
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	return visibility === 'visible';
};
