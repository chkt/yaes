const _VERSION = '0.1.0';

const _type = new WeakMap();
const _ts = new WeakMap();
const _data = new WeakMap();



export default class Dispatchable {

	static toString() {
		return `[Dispatchable-${ _VERSION }]`;
	}



	constructor(type, data = {}) {
		if (
			typeof type !== 'string' || type === '' ||
			typeof data !== 'object' || data === null
		) throw new TypeError();

		_type.set(this, type);
		_ts.set(this, Date.now());
		_data.set(this, data);
	}


	get type() {
		return _type.get(this);
	}

	get timestamp() {
		return _ts.get(this);
	}

	get data() {
		return _data.get(this);
	}


	toString() {
		return `${ this.constructor.toString() }\t${ this.type } ${ this.timestamp }`;
	}

	toJSON() {
		return _data.get(this);
	}
}
