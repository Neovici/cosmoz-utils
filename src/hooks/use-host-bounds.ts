import { useLayoutEffect, useState } from '@pionjs/pion';
import { useHost } from './use-host';

const useHostBounds = () => {
	const host = useHost(),
		[bounds, setBounds] = useState<DOMRectReadOnly>();

	useLayoutEffect(() => {
		const observer = new ResizeObserver((entries) =>
			requestAnimationFrame(() => setBounds(entries[0]?.contentRect))
		);
		observer.observe(host);
		return () => observer.unobserve(host);
	}, []);

	return bounds;
};

export { useHostBounds };
