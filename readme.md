# Just Storage Hooks

Do you have an input or checkbox you'd like to recover after a reload?
Do you need to store your app's configuration page?

Just use storage hooks with localStorage to ensure data is fresh on the first hook call.

## Installation

`npm i just-storage-hooks`

## Methods

### useStorage

Read and write to localStorage.

Optional `mutate` function allows for storeState data to be altered before storing. This should be memo'd or unchanged between hooks.

```js
const mutate = useCallback(data => `${data}`);
const [state, storeState] = useStorage(key, mutate);
```

### useDebounceCallback

Debounce a callback when state changes. Used to avoid thrashing localStorage in the following hooks

```js
const callback = useCallback((data) => { console.log(data); });
useDebounceCallback(state, callback, 10);
```

### useStorageState

Like useState but with localStorage when first starting the effect

```js
const [state, setState] = useStorageState('key', { some: 'state' }, optionalMutate);
```

### useStorageReducer

Like useReducer but with localStorage when first starting the effect

```js
const [state, dispatch] = useStorageReducer('key', reducer, { some: 'state' }, optionalMutate);
```

## License

Copyright (c) 2021, Michael Szmadzinski. (MIT License)
