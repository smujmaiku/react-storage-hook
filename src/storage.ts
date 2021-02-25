/*!
 * React Storage Hooks <https://github.com/smujmaiku/just-storage-hooks>
 * Copyright(c) 2021 Michael Szmadzinski
 * MIT Licensed
 */

import { useMemo, useCallback, useState, useReducer, useEffect } from 'react';

export const DEBOUNCE_MS = 100;
export const STATE_UNDEFINED = 'undefined';
export const STATE_NULL = 'null';

export type UseStorageMutateFn<T> = (value: T) => T;
export type UseStorage<T = undefined> = [
	state: T,
	storeState: (value: T) => void,
	data: { wasUnset: boolean },
];
export type UseStorageState<T> = [state: T, setState: React.Dispatch<T>];
export type UseStorageReducerFn<T, A> = (state: T, action: A) => T;
export type UseStorageReducer<T, A> = [T, (action: A) => void];

export default function useStorage<T = unknown>(
	key: string,
	mutate?: UseStorageMutateFn<T>,
): UseStorage<T> {
	const [state, wasUnset] = useMemo(() => {
		try {
			const item = localStorage.getItem(key);

			if (item === null) {
				return [undefined, true];
			} else if (item === STATE_UNDEFINED) {
				return [undefined, false];
			} else if (item === STATE_NULL) {
				return [null, false];
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
				localStorage.setItem(key, STATE_UNDEFINED);
			} else if (value === null) {
				localStorage.setItem(key, STATE_NULL);
			} else {
				localStorage.setItem(key, JSON.stringify(value));
			}
		} catch (err) {
			console.error(err);
		}
	}, [key, mutate]);

	return [state, storeState, { wasUnset }];
}

export function useDebounceCallback<T>(
	state: T,
	callback: (value: T) => void,
	debounce = DEBOUNCE_MS
): void {
	useEffect(() => {
		const timer = setTimeout(() => {
			callback(state);
		}, debounce);

		return () => {
			clearTimeout(timer);
		};
	}, [state, callback, debounce]);
}

export function useStorageState<T>(
	key: string,
	defaultState: T,
	mutate?: UseStorageMutateFn<T>
): UseStorageState<T> {
	const [initState, storeState, { wasUnset }] = useStorage<T>(key, mutate);
	const startState = wasUnset ? defaultState : initState;

	const [state, setState] = useState<T>(startState);
	useDebounceCallback<T>(state, storeState);

	return [state, setState];
}

export function useStorageReducer<T = unknown, A = unknown>(
	key: string,
	reducer: UseStorageReducerFn<T, A>,
	defaultState: T,
	mutate?: UseStorageMutateFn<T>,
): UseStorageReducer<T, A> {
	const [initState, storeState, { wasUnset }] = useStorage<T>(key, mutate);
	const startState = wasUnset ? defaultState : initState;

	const [state, dispatch] = useReducer(reducer, startState);
	useDebounceCallback<T>(state, storeState);

	return [state, dispatch];
}
