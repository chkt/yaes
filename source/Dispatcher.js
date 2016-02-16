import Dispatchable from './Dispatchable';



const _VERSION = '0.1.0';



const _stackIns = [];
const _stackType = [];

const _queueIns = [];
const _queueDsp = [];

const _defined = new WeakMap();
const _listener = new WeakMap();



function _dispatchQueue() {
	const len = _queueIns.length;
	const qins = _queueIns.splice(0, len);
	const qdsp = _queueDsp.splice(0, len);

	for (let i = 0, ins = qins[0]; ins !== undefined; ins = qins[++i]) {
		if (ins.defined) _dispatchSync.call(ins, qdsp[i]);
	}
}

function _dispatchAsync(dsp) {
	if (_queueIns.length === 0) setTimeout(_dispatchQueue, 0);

	_queueIns.push(this);
	_queueDsp.push(dsp);
}

function _dispatchSync(dsp) {
	const listener = _listener.get(this);
	const type = dsp.type;

	if (
		!(type in listener) ||
		_stackIns.indexOf(this) !== -1 && _stackType.indexOf(type) !== -1
	) return;

	_stackIns.push(this), _stackType.push(type);

	const queue = listener[type].slice(0);

	try {
		for (let i = 0, fn = queue[0]; fn !== undefined; fn = queue[++i]) fn.call(this, dsp);
	}
	catch (err) {
		throw err;
	}
	finally {
		_stackIns.pop(), _stackType.pop();
	}
}



export default class Dispatcher {
	static toString() {
		return `[Dispatcher-${ _VERSION }]`;
	}



	constructor() {
		this.define();
	}


	define() {
		if (this.defined) this.undefine();

		_defined.set(this, true);
		_listener.set(this, {});

		return this;
	}

	undefine() {
		if (this.defined) {
			_defined.delete(this);
			_listener.delete(this);
		}

		return this;
	}


	get defined() {
		return _defined.has(this);
	}


	hasListener(type) {
		if (typeof type !== 'string' || type === '') throw new TypeError();

		return this.defined && type in _listener.get(this);
	}

	hasQueuedType(type) {
		if (typeof type !== 'string' || type === '') throw new TypeError();

		if (!this.defined) return false;

		for (let i = 0, ins = _queueIns[0]; ins !== undefined; ins = _queueIns[++i]) {
			if (ins === this && _queueDsp[i].type === type) return true;
		}

		return false;
	}


	addListener(type, fn) {
		if (
			typeof type !== 'string' || type === '' ||
			typeof fn !== 'function'
		) throw new TypeError();

		if (!this.defined) return this;

		const listener = _listener.get(this);

		if (!(type in listener)) listener[type] = [];

		if (listener[type].indexOf(fn) === -1) listener[type].push(fn);

		return this;
	}

	addListeners(dict) {
		if (typeof dict !== 'object' || dict === null) throw new TypeError();

		if (!this.defined) return this;

		for (let type in dict) this.addListener(type, dict[type]);

		return this;
	}


	once(type, fn) {
		if (
			typeof type !== 'string' || type === '' ||
			typeof fn !== 'function'
		) throw new TypeError();

		if (!this.defined) return this;

		const listener = _listener.get(this);

		if (!(type in listener)) listener[type] = [];

		function cb(e) {
			this.removeListener(type, cb);

			fn();
		}

		listener[type].push(cb);

		return this;
	}


	removeListener(type, fn) {
		if (
			typeof type !== 'string' || type === '' ||
			typeof fn !== 'function'
		) throw new TypeError();

		if (!this.defined) return this;

		const listener = _listener.get(this);

		if (!(type in listener)) return this;

		const queue = listener[type], index = queue.indexOf(fn);

		if (index === -1) return this;

		queue.splice(index, 1);

		if (queue.length === 0) delete listener[type];

		return this;
	}

	removeListeners(dict) {
		if (typeof dict !== 'object' || dict === null) throw new TypeError();

		if (!this.defined) return this;

		for (let type in dict) this.removeListener(type, dict[type]);

		return this;
	}


	getTypes(fn) {
		if (typeof fn !== 'function') throw new TypeError();

		if (!this.defined) return [];

		const listener = _listener.get(this), res = [];

		for (let type in listener) {
			if (listener[type].indexOf(fn) !== -1) res.push(type);
		}

		return res;
	}


	dispatch(dsp, async = false) {
		if (
			!(dsp instanceof Dispatchable) ||
			typeof async !== 'boolean'
		) throw new TypeError();

		if (!this.defined) return this;

		if (async) _dispatchAsync.call(this, dsp);
		else _dispatchSync.call(this, dsp);

		return this;
	}


	toString() {
		return `${ this.constructor.toString() }`;
	}
}
