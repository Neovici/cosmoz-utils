import { useCallback, useEffect, useProperty } from '@pionjs/pion';

type UsePersistResult = {
	value: string;
	setValue: (value: string) => void;
	revalidate: () => string;
};

/**
 * Hook to persist a string property to localStorage with cross-tab sync.
 * Uses useProperty internally to make the value reactive to parent prop changes.
 * When key is undefined, acts like a regular useProperty.
 *
 * @param property - property name on the host element
 * @param key - localStorage key (if undefined, persistence is disabled)
 * @param defaultValue - fallback value when no stored value exists
 * @returns { value, setValue, revalidate }
 */
export const usePersist = (
	property: string,
	key: string | undefined,
	defaultValue: string,
): UsePersistResult => {
	const [value, setValue] = useProperty<string>(property, () => {
		if (!key) return defaultValue;
		try {
			return localStorage.getItem(key) ?? defaultValue;
		} catch {
			return defaultValue;
		}
	});

	// Cross-tab sync via storage events (different browser windows)
	useEffect(() => {
		if (!key) return;

		const handleStorage = (e: StorageEvent) => {
			if (e.key === key && e.newValue) {
				setValue(e.newValue);
			}
		};

		window.addEventListener('storage', handleStorage);
		return () => window.removeEventListener('storage', handleStorage);
	}, [key]);

	const setPersistedValue = useCallback(
		(newValue: string) => {
			setValue(newValue);
			if (key) {
				try {
					localStorage.setItem(key, newValue);
				} catch {
					// Silently fail
				}
			}
		},
		[key],
	);

	const revalidate = useCallback((): string => {
		if (!key) return value;
		try {
			const stored = localStorage.getItem(key);
			if (stored != null && stored !== value) {
				setValue(stored);
				return stored;
			}
		} catch {
			// Ignore
		}
		return value;
	}, [key, value]);

	return { value, setValue: setPersistedValue, revalidate };
};
