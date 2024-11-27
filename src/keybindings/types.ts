export type Activity = symbol;

export type Matcher = Pick<KeyboardEvent, 'key'> &
	Partial<Pick<KeyboardEvent, 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>>;

export type Info = {
	title: string;
	description: string;
};

export type KeyBinding = readonly [Matcher, Activity[], Info];

export type ActivityHandler = {
	activity: Activity;
	callback: () => void;
	check?: () => boolean;
	element?: () => Element | null | undefined;
};

export type RegisterFn = (handler: ActivityHandler) => () => void;
