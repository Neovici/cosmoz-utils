export const sheet = (...styles: string[]) => {
	const cs = new CSSStyleSheet();
	cs.replaceSync(styles.join(''));
	return cs;
};
