'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Dispatchable = require('./Dispatchable');

var _Dispatchable2 = _interopRequireDefault(_Dispatchable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _VERSION = '0.1.0';

var _stackIns = [];
var _stackType = [];

var _queueIns = [];
var _queueDsp = [];

var _defined = new WeakMap();
var _listener = new WeakMap();

function _dispatchQueue() {
	var len = _queueIns.length;
	var qins = _queueIns.splice(0, len);
	var qdsp = _queueDsp.splice(0, len);

	for (var i = 0, ins = qins[0]; ins !== undefined; ins = qins[++i]) {
		if (ins.defined) _dispatchSync.call(ins, qdsp[i]);
	}
}

function _dispatchAsync(dsp) {
	if (_queueIns.length === 0) setTimeout(_dispatchQueue, 0);

	_queueIns.push(this);
	_queueDsp.push(dsp);
}

function _dispatchSync(dsp) {
	var listener = _listener.get(this);
	var type = dsp.type;

	if (!(type in listener) || _stackIns.indexOf(this) !== -1 && _stackType.indexOf(type) !== -1) return;

	_stackIns.push(this), _stackType.push(type);

	var queue = listener[type].slice(0);

	try {
		for (var i = 0, fn = queue[0]; fn !== undefined; fn = queue[++i]) {
			fn.call(this, dsp);
		}
	} catch (err) {
		throw err;
	} finally {
		_stackIns.pop(), _stackType.pop();
	}
}

var Dispatcher = function () {
	_createClass(Dispatcher, null, [{
		key: 'toString',
		value: function toString() {
			return '[Dispatcher-' + _VERSION + ']';
		}
	}]);

	function Dispatcher() {
		_classCallCheck(this, Dispatcher);

		this.define();
	}

	_createClass(Dispatcher, [{
		key: 'define',
		value: function define() {
			if (this.defined) this.undefine();

			_defined.set(this, true);
			_listener.set(this, {});

			return this;
		}
	}, {
		key: 'undefine',
		value: function undefine() {
			if (this.defined) {
				_defined.delete(this);
				_listener.delete(this);
			}

			return this;
		}
	}, {
		key: 'hasListener',
		value: function hasListener(type) {
			if (typeof type !== 'string' || type === '') throw new TypeError();

			return this.defined && type in _listener.get(this);
		}
	}, {
		key: 'hasQueuedType',
		value: function hasQueuedType(type) {
			if (typeof type !== 'string' || type === '') throw new TypeError();

			if (!this.defined) return false;

			for (var i = 0, ins = _queueIns[0]; ins !== undefined; ins = _queueIns[++i]) {
				if (ins === this && _queueDsp[i].type === type) return true;
			}

			return false;
		}
	}, {
		key: 'addListener',
		value: function addListener(type, fn) {
			if (typeof type !== 'string' || type === '' || typeof fn !== 'function') throw new TypeError();

			if (!this.defined) return this;

			var listener = _listener.get(this);

			if (!(type in listener)) listener[type] = [];

			if (listener[type].indexOf(fn) === -1) listener[type].push(fn);

			return this;
		}
	}, {
		key: 'addListeners',
		value: function addListeners(dict) {
			if ((typeof dict === 'undefined' ? 'undefined' : _typeof(dict)) !== 'object' || dict === null) throw new TypeError();

			if (!this.defined) return this;

			for (var type in dict) {
				this.addListener(type, dict[type]);
			}return this;
		}
	}, {
		key: 'once',
		value: function once(type, fn) {
			if (typeof type !== 'string' || type === '' || typeof fn !== 'function') throw new TypeError();

			if (!this.defined) return this;

			var listener = _listener.get(this);

			if (!(type in listener)) listener[type] = [];

			function cb(e) {
				this.removeListener(type, cb);

				fn();
			}

			listener[type].push(cb);

			return this;
		}
	}, {
		key: 'removeListener',
		value: function removeListener(type, fn) {
			if (typeof type !== 'string' || type === '' || typeof fn !== 'function') throw new TypeError();

			if (!this.defined) return this;

			var listener = _listener.get(this);

			if (!(type in listener)) return this;

			var queue = listener[type],
			    index = queue.indexOf(fn);

			if (index === -1) return this;

			queue.splice(index, 1);

			if (queue.length === 0) delete listener[type];

			return this;
		}
	}, {
		key: 'removeListeners',
		value: function removeListeners(dict) {
			if ((typeof dict === 'undefined' ? 'undefined' : _typeof(dict)) !== 'object' || dict === null) throw new TypeError();

			if (!this.defined) return this;

			for (var type in dict) {
				this.removeListener(type, dict[type]);
			}return this;
		}
	}, {
		key: 'getTypes',
		value: function getTypes(fn) {
			if (typeof fn !== 'function') throw new TypeError();

			if (!this.defined) return [];

			var listener = _listener.get(this),
			    res = [];

			for (var type in listener) {
				if (listener[type].indexOf(fn) !== -1) res.push(type);
			}

			return res;
		}
	}, {
		key: 'dispatch',
		value: function dispatch(dsp) {
			var async = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			if (!(dsp instanceof _Dispatchable2.default) || typeof async !== 'boolean') throw new TypeError();

			if (!this.defined) return this;

			if (async) _dispatchAsync.call(this, dsp);else _dispatchSync.call(this, dsp);

			return this;
		}
	}, {
		key: 'toString',
		value: function toString() {
			return '' + this.constructor.toString();
		}
	}, {
		key: 'defined',
		get: function get() {
			return _defined.has(this);
		}
	}]);

	return Dispatcher;
}();

exports.default = Dispatcher;