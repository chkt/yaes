'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _VERSION = '0.1.0';

var _type = new WeakMap();
var _ts = new WeakMap();
var _data = new WeakMap();

var Dispatchable = function () {
	_createClass(Dispatchable, null, [{
		key: 'toString',
		value: function toString() {
			return '[Dispatchable-' + _VERSION + ']';
		}
	}]);

	function Dispatchable(type) {
		var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, Dispatchable);

		if (typeof type !== 'string' || type === '' || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' || data === null) throw new TypeError();

		_type.set(this, type);
		_ts.set(this, Date.now());
		_data.set(this, data);
	}

	_createClass(Dispatchable, [{
		key: 'toString',
		value: function toString() {
			return this.constructor.toString() + '\t' + this.type + ' ' + this.timestamp;
		}
	}, {
		key: 'toJSON',
		value: function toJSON() {
			return _data.get(this);
		}
	}, {
		key: 'type',
		get: function get() {
			return _type.get(this);
		}
	}, {
		key: 'timestamp',
		get: function get() {
			return _ts.get(this);
		}
	}, {
		key: 'data',
		get: function get() {
			return _data.get(this);
		}
	}]);

	return Dispatchable;
}();

exports.default = Dispatchable;