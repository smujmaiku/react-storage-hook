"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useStorage;
exports.useDebounceCallback = useDebounceCallback;
exports.useStorageState = useStorageState;
exports.useStorageReducer = useStorageReducer;
exports.DEBOUNCE_MS = void 0;

var _react = require("react");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var DEBOUNCE_MS = 10;
/**
 * use storage hook
 * @param {string} key
 * @param {function?} mutate
 */

exports.DEBOUNCE_MS = DEBOUNCE_MS;

function useStorage(key) {
  var mutate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var state = (0, _react.useMemo)(function () {
    try {
      var item = localStorage.getItem(key);
      if (item === null) return undefined;
      return JSON.parse(item);
    } catch (err) {
      return undefined;
    }
  }, [key]);
  var storeState = (0, _react.useCallback)(function (data) {
    try {
      var value = mutate ? mutate(data) : data;

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


function useDebounceCallback(state, callback) {
  var debounce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEBOUNCE_MS;
  (0, _react.useEffect)(function () {
    var timer = setTimeout(function () {
      callback(state);
    }, debounce);
    return function () {
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


function useStorageState(key) {
  var defaultState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var mutate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  var _useStorage = useStorage(key, mutate),
      _useStorage2 = _slicedToArray(_useStorage, 2),
      initState = _useStorage2[0],
      storeState = _useStorage2[1];

  var startState = initState !== undefined ? initState : defaultState;

  var _useState = (0, _react.useState)(startState),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

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


function useStorageReducer(key, reducer) {
  var defaultState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var mutate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  var _useStorage3 = useStorage(key, mutate),
      _useStorage4 = _slicedToArray(_useStorage3, 2),
      initState = _useStorage4[0],
      storeState = _useStorage4[1];

  var startState = initState !== undefined ? initState : defaultState;

  var _useReducer = (0, _react.useReducer)(reducer, startState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  useDebounceCallback(state, storeState);
  return [state, dispatch];
}
