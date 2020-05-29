'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var AsyncStates;

(function (AsyncStates) {
  AsyncStates["Idle"] = "Idle";
  AsyncStates["Pending"] = "Pending";
  AsyncStates["Success"] = "Success";
  AsyncStates["Error"] = "Error";
})(AsyncStates || (AsyncStates = {}));

function useAsyncStatus(asyncFn, successTimeout // How long Success state is active until reverting to Idle
) {
  const _React$useState = React.useState({
    status: AsyncStates.Idle,
    lastResult: null,
    lastError: null
  }),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        _React$useState2$ = _React$useState2[0],
        status = _React$useState2$.status,
        lastResult = _React$useState2$.lastResult,
        lastError = _React$useState2$.lastError,
        updateState = _React$useState2[1]; // Thing that calls the async function


  function trigger() {
    return _trigger.apply(this, arguments);
  }

  function _trigger() {
    _trigger = _asyncToGenerator(function* (...args) {
      updateState(state => _objectSpread2(_objectSpread2({}, state), {}, {
        status: AsyncStates.Pending
      }));

      try {
        const result = yield asyncFn(...args);
        updateState(state => _objectSpread2(_objectSpread2({}, state), {}, {
          status: AsyncStates.Success,
          lastResult: result
        }));

        if (successTimeout !== undefined) {
          // Reset to Idle state
          setTimeout(function () {
            updateState(state => _objectSpread2(_objectSpread2({}, state), {}, {
              status: AsyncStates.Idle
            }));
          }, successTimeout);
        } // Return the result of the async function


        return result;
      } catch (error) {
        updateState(state => _objectSpread2(_objectSpread2({}, state), {}, {
          status: AsyncStates.Error,
          lastError: error
        })); // Return the error

        return error;
      }
    });
    return _trigger.apply(this, arguments);
  }

  function reset() {
    updateState(state => _objectSpread2(_objectSpread2({}, state), {}, {
      status: AsyncStates.Idle,
      lastResult: null,
      lastError: null
    }));
  }

  return {
    trigger,
    status,
    lastResult,
    lastError,
    reset
  };
}

exports.useAsyncStatus = useAsyncStatus;
