import { ANY_KEY } from './consts';

export type Activity = symbol;

export type Matcher = Partial<
	Pick<KeyboardEvent, 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>
> & {
	key: KeyboardEvent['key'] | typeof ANY_KEY;
};

export type Info = {
	title: string;
	description: string;
};

export type BindingOptions = {
	allowInEditable?: boolean;
};

export type KeyBinding = readonly [Matcher, Activity[], Info, BindingOptions?];

export type ActivityHandler = {
	activity: Activity;
	callback: (e: KeyboardEvent) => void;
	check?: () => boolean;
	element?: () => Element | null | undefined;
	allowDefault?: boolean;
};

export type RegisterFn = (handler: ActivityHandler) => () => void;
