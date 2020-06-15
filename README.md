# Just Storage Hooks

Some storage hooks

## Installation

`npm i just-storage-hooks`

## Methods

### useStorage

Read and write to localStorage.

Optional mutate function allows for storeState data to be altered before storing. This should be memo'd or unchanged between hooks.

```js
const mutate = useCallback(data => `${data}`);
const [state, storeState] = useStorage(key, mutate);
```

### useDebounceCallback

Debounce a callback when state changes. Used to avoid thrashing localStorage in the following hooks

```js
const callback = useCallback((data) => { console.log(data); }));
useDebounceCallback(state, callback, 10);
```

### useStorageState

Like useState but with localStorage when first starting the effect

```js
const [state, setState] = useStorageState('key', { undefined: 'state' }, optionalMutate);
```

### useStorageReducer

Like useReducer but with localStorage when first starting the effect

```js
const [state, dispatch] = useStorageReducer('key', reducer, { undefined: 'state' }, optionalMutate);
```

## License

Copyright (c) 2020, Michael Szmadzinski. (MIT License)
