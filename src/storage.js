/*!
 * React Storage Hooks <https://github.com/smujmaiku/just-storage-hooks>
 * Copyright(c) 2020 Michael Szmadzinski
 * MIT Licensed
 */

import { useMemo, useCallback, useState, useReducer, useEffect } from 'react';

export const DEBOUNCE_MS = 10;

/**
 * use storage hook
 * @param {string} key
 * @param {function?} mutate
 */
export default function useStorage(key, mutate = undefined) {
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
			const value = mutate ? mutate(data) : data;
			if (value === undefined || value === null || Number.isNaN(value)) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, JSON.stringify(value));
			}
		} catch (err) {
			console.error(err);
		}
	}, [key, mutate]);

	return [state, storeState];
}

/**
 * Call function with state when changed
 * @param {*} state
 * @param {function} callback
 * @param {number?} debounce
 */
export function useDebounceCallback(state, callback, debounce = DEBOUNCE_MS) {
	useEffect(() => {
		const timer = setTimeout(() => {
			callback(state);
		}, debounce);

		return () => {
			clearTimeout(timer);
		};
	}, [state, callback, debounce]);
}

/**
 * Use storage like useState
 * @param {string} key
 * @param {*?} defaultState
 * @param {function?} mutate
 */
export function useStorageState(key, defaultState = undefined, mutate = undefined) {
	const [initState, storeState] = useStorage(key, mutate);
	const startState = initState !== undefined ? initState : defaultState;

	const [state, setState] = useState(startState);
	useDebounceCallback(state, storeState);

	return [state, setState];
}

/**
 * Use storage like useReducer
 * @param {string} key localStorage key
 * @param {function} reducer
 * @param {*?} defaultState
 * @param {function?} mutate
 */
export function useStorageReducer(key, reducer, defaultState = undefined, mutate = undefined) {
	const [initState, storeState] = useStorage(key, mutate);
	const startState = initState !== undefined ? initState : defaultState;

	const [state, dispatch] = useReducer(reducer, startState);
	useDebounceCallback(state, storeState);

	return [state, dispatch];
}
