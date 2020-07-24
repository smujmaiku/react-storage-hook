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
	const [state, wasUnset] = useMemo(() => {
		try {
			const item = localStorage.getItem(key);

			if (item === null) {
				return [null, true];
			}

			return [JSON.parse(item), false];
		} catch (err) {
			return [undefined, true];
		}
	}, [key]);

	const storeState = useCallback((data) => {
		try {
			const value = mutate ? mutate(data) : data;
			if (value === undefined) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, JSON.stringify(value));
			}
		} catch (err) {
			console.error(err);
		}
	}, [key, mutate]);

	return [state, storeState, { wasUnset }];
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
	const [initState, storeState, { wasUnset }] = useStorage(key, mutate);
	const startState = wasUnset ? defaultState : initState;

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
	const [initState, storeState, { wasUnset }] = useStorage(key, mutate);
	const startState = wasUnset ? defaultState : initState;

	const [state, dispatch] = useReducer(reducer, startState);
	useDebounceCallback(state, storeState);

	return [state, dispatch];
}
