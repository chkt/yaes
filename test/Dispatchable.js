import _assert from 'assert';

import Dispatchable from '../source/Dispatchable';



describe('Dispatchable', () => {
	describe('.toString', () => {
		it("should return a type-version string", () => {
			_assert.strictEqual(Dispatchable.toString().search(/^\[Dispatchable-\d\.\d.\d\]$/), 0);
		});
	});

	describe('#constructor', () => {
		it("should accept a nonempty string as first argument", () => {
			_assert.throws(() => new Dispatchable(true), TypeError);
			_assert.throws(() => new Dispatchable(1), TypeError);
			_assert.throws(() => new Dispatchable(''), TypeError);
			_assert.doesNotThrow(() => new Dispatchable('1'));
			_assert.throws(() => new Dispatchable(Symbol()), TypeError);
			_assert.throws(() => new Dispatchable({}), TypeError);
		});

		it("should accept a object as second argument", () => {
			_assert.throws(() => new Dispatchable('1', true), TypeError);
			_assert.throws(() => new Dispatchable('1', 1), TypeError);
			_assert.throws(() => new Dispatchable('1', '1'), TypeError);
			_assert.throws(() => new Dispatchable('1', Symbol()), TypeError);
			_assert.doesNotThrow(() => new Dispatchable('1', {}));
			_assert.throws(() => new Dispatchable('1', null), TypeError);
		});
	});

	describe('#type', () => {
		it("should return the type string", () => {
			_assert.strictEqual(new Dispatchable('foo').type, 'foo');
		});
	});

	describe('#timestamp', () => {
		it("should return the creation time stamp", () => {
			_assert.strictEqual(new Dispatchable('foo').timestamp, Date.now());
		});
	});

	describe('#data', () => {
		it("should return the event data", () => {
			const data = { a : 1 };

			_assert.strictEqual(new Dispatchable('foo', data).data, data);
		});
	});

	describe('#toString', () => {
		it("should return the event type and timestamp", () => {
			_assert.strictEqual(new Dispatchable('foo').toString().search(/^\[Dispatchable-\d\.\d\.\d\]\s+foo\s+\d+$/), 0);
		});
	});

	describe('#toJSON', () => {
		it("should return the event data", () => {
			const data = {
				a : 1
			};

			_assert.strictEqual(new Dispatchable('foo', data).toJSON(), data);
		});

		it("should serialize the event data", () => {
			const data = {
				a : 1
			};

			_assert.deepEqual(JSON.parse(JSON.stringify(new Dispatchable('foo', data))), data);
		});
	});
});
