import { useLayoutEffect, useRef } from '@pionjs/pion';
import { useHost } from './use-host';

export const useStyleSheet = (css: string) => {
	const host = useHost();
	const csRef = useRef<CSSStyleSheet | null>(null);
	const getSheet = () => {
		if (!csRef.current) {
			const win = host.ownerDocument?.defaultView;
			csRef.current = new win!.CSSStyleSheet();
			host.shadowRoot!.adoptedStyleSheets = [
				...host.shadowRoot!.adoptedStyleSheets,
				csRef.current,
			];
		}
		return csRef.current;
	};
	useLayoutEffect(() => {
		getSheet().replaceSync(css);
	}, [css]);
};
