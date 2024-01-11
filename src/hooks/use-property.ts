import { useEffect, useCallback } from '@pionjs/pion';
import { useMeta } from './use-meta';
import { useHost } from './use-host';
import { invoke } from '../function';
import { notifyProperty } from './use-notify-property';

type Init<T> = T | (() => T);
type UpdateFn<T> = (prev: T) => T;
type Update<T> = T | UpdateFn<T>;
type Setter<T> = (update: Update<T>) => void;
type Result<T> = [T, Setter<T>];

export function useProperty<T>(prop: string): Result<T | undefined>;
export function useProperty<T>(prop: string, init: Init<T>): Result<T>;
export function useProperty<T>(prop: string, init?: Init<T>): Result<T> {
	const host = useHost<HTMLElement & Record<typeof prop, T>>();
	const value = host[prop];
	const setValue = useCallback((update: Update<T>) => {
		const val = host[prop];
		const newVal =
			typeof update === 'function' ? (update as UpdateFn<T>)(val) : update;
		if (Object.is(val, newVal)) {
			return;
		}
		notifyProperty(host, prop, newVal);
	}, []);
	const meta = useMeta({ init });
	useEffect(() => {
		const { init } = meta;
		if (init == null) return;
		setValue(invoke(init));
	}, []);
	return [value, setValue];
}
