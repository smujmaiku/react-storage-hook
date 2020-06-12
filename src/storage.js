/*!
 * React Storage Hooks <https://github.com/smujmaiku/react-storage-hooks>
 * Copyright(c) 2020 Michael Szmadzinski
 * MIT Licensed
 */

import { useMemo, useCallback, useState } from 'react';

export default function useStorage(key) {
	const state = useMemo(() => {
		try {
			const item = localStorage.getItem(key);
			if (item === null) return undefined;
			return JSON.parse(item);
		} catch (err) {
			return undefined;
		}
	}, [key]);

	const storeState = useCallback((data) => {
		try {
			localStorage.setItem(key, JSON.stringify(data));
		} catch (err) {
			console.error(err);
		}
	}, [key]);

	return [state, storeState];
}

export function useStorageState(key, defaultState) {
	const [init, storeState] = useStorage(key);

	const [state, setState] = useState(init !== undefined ? init : defaultState);

	const saveState = useCallback((data) => {
		setState(data);
		storeState(data);
	}, [storeState]);

	return [state, saveState];
}
