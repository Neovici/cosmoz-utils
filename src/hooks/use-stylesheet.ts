import { useEffect, useMemo } from '@pionjs/pion';
import { useHost } from './use-host';

export const useStyleSheet = (css: string) => {
	const host = useHost();
	const cs = useMemo(() => new CSSStyleSheet(), []);

	useEffect(() => {
		host.shadowRoot!.adoptedStyleSheets = [
			...host.shadowRoot!.adoptedStyleSheets,
			cs,
		];
	}, []);

	useEffect(() => {
		cs.replaceSync(css);
	}, [css]);
};
