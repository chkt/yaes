import _assert from 'assert';

import Dispatchable from '../source/Dispatchable';
import Dispatcher from '../source/Dispatcher';



describe('Dispatcher', () => {
	describe('.toString', () => {
		it("should return a type-version string", () => {
			_assert.strictEqual(Dispatcher.toString().search(/^\[Dispatcher-\d\.\d.\d\]$/), 0);
		});
	});

	describe('#constructor', () => {
		it("should return a new instance", () => {
			_assert(new Dispatcher() instanceof Dispatcher);
		});
	});

	describe('#define', () => {
		it("should define the instance", () => {
			_assert.strictEqual(new Dispatcher().define().defined, true);
		});

		it("should return the instance", () => {
			const ins = new Dispatcher();

			_assert.strictEqual(ins.define(), ins);
		});
	});

	describe('#undefine', () => {
		it("should undefine the instance", () => {
			_assert.strictEqual(new Dispatcher().undefine().defined, false);
		});

		it("should return the instance", () => {
			const ins = new Dispatcher();

			_assert.strictEqual(ins.undefine(), ins);
		});
	});

	describe('#defined', () => {
		it("should return true if the instance is defined", () => {
			_assert.strictEqual(new Dispatcher().defined, true);
		});

		it("should return false if the instance is undefined", () => {
			_assert.strictEqual(new Dispatcher().undefine().defined, false);
		});

		it("should return true if the instance is redefined", () => {
			_assert.strictEqual(new Dispatcher().undefine().define().defined, true);
		});
	});

	describe('#addListener', () => {
		it("should require a nonempty string and a function", () => {
			const ins = new Dispatcher();
			const fn = () => 1;

			_assert.throws(() => ins.addListener(true, fn), TypeError);
			_assert.throws(() => ins.addListener(1, fn), TypeError);
			_assert.throws(() => ins.addListener('', fn), TypeError);
			_assert.doesNotThrow(() => ins.addListener('foo', fn));
			_assert.throws(() => ins.addListener(Symbol(), fn), TypeError);
			_assert.throws(() => ins.addListener({}, fn), TypeError);
			_assert.throws(() => ins.addListener('foo', true), TypeError);
			_assert.throws(() => ins.addListener('foo', 1), TypeError);
			_assert.throws(() => ins.addListener('foo', '1'), TypeError);
			_assert.throws(() => ins.addListener('foo', Symbol()), TypeError);
			_assert.throws(() => ins.addListener('foo', {}), TypeError);
		});

		it("should return the instance", () => {
			const ins = new Dispatcher();

			_assert.strictEqual(ins.addListener('foo', () => 1), ins);
		});
	});

	describe('#addListeners', () => {
		it("should require an object of functions");
		it("should return the instance");
	});

	describe('#removeListener', () => {
		it("should require a nonempty string and a function", () => {
			const ins = new Dispatcher();
			const fn = () => 1;

			_assert.throws(() => ins.removeListener(true, fn), TypeError);
			_assert.throws(() => ins.removeListener(1, fn), TypeError);
			_assert.throws(() => ins.removeListener('', fn), TypeError);
			_assert.doesNotThrow(() => ins.removeListener('foo', fn));
			_assert.throws(() => ins.removeListener(Symbol(), fn), TypeError);
			_assert.throws(() => ins.removeListener({}, fn), TypeError);
			_assert.throws(() => ins.removeListener('foo', true), TypeError);
			_assert.throws(() => ins.removeListener('foo', 1), TypeError);
			_assert.throws(() => ins.removeListener('foo', '1'), TypeError);
			_assert.throws(() => ins.removeListener('foo', Symbol()), TypeError);
			_assert.throws(() => ins.removeListener('foo', {}), TypeError);
		});

		it("should return the instance", () => {
			const ins = new Dispatcher();

			_assert.strictEqual(ins.removeListener('foo', () => 1), ins);
		});
	});

	describe('#removeListeners', () => {
		it("should require an object of functions");
		it("should return the instance");
	});

	describe('#hasListener', () => {
		it("should return false is the instance is not defined", () => {
			const ins = new Dispatcher()
				.addListener('foo', () => 1)
				.undefine();

			_assert.strictEqual(ins.hasListener('foo'), false);
		});

		it("should return true if there are listeners for type", () => {
			const ins = new Dispatcher().addListener('foo', () => 1);

			_assert.strictEqual(ins.hasListener('foo'), true);
		});

		it("should return false if there are no listeners of type", () => {
			const ins = new Dispatcher();
			const fn = () => 1;

			_assert.strictEqual(ins.hasListener('foo'), false);

			ins.addListener('foo', fn).removeListener('foo', fn);

			_assert.strictEqual(ins.hasListener('foo'), false);
		});
	});

	describe("#dispatch", () => {
		it("should require a dispatchable instance as first argument", () => {
			const ins = new Dispatcher();

			_assert.throws(() => ins.dispatch(true), TypeError);
			_assert.throws(() => ins.dispatch(1), TypeError);
			_assert.throws(() => ins.dispatch('1'), TypeError);
			_assert.throws(() => ins.dispatch(Symbol()), TypeError);
			_assert.throws(() => ins.dispatch({}), TypeError);
			_assert.throws(() => ins.dispatch(() => 1), TypeError);
			_assert.doesNotThrow(() => new Dispatchable('foo'));
		});

		it("should optionally require a boolean as second argument", () => {
			const ins = new Dispatcher();
			const dsp = new Dispatchable('foo');

			_assert.doesNotThrow(() => ins.dispatch(dsp, true));
			_assert.throws(() => ins.dispatch(dsp, 1), TypeError);
			_assert.throws(() => ins.dispatch(dsp, '1'), TypeError);
			_assert.throws(() => ins.dispatch(dsp, Symbol()), TypeError);
			_assert.throws(() => ins.dispatch(dsp, {}), TypeError);
			_assert.throws(() => ins.dispatch(dsp, () => 1), TypeError);
		});

		it("should synchronously dispatch to registered listeners", () => {
			const ins = new Dispatcher();
			let test = 0b0000;

			function fn3 () {
				test |= 0b0100;
			}

			ins
				.addListener('foo', () => {
					test |= 0b0001;
				})
				.addListener('foo', () => {
					test |= 0b0010;
				})
				.addListener('foo', fn3)
				.removeListener('foo', fn3)
				.addListener('bar', () => {
					test |= 0b1000;
				})
				.dispatch(new Dispatchable('foo'));

			_assert.strictEqual(test, 0b011);
		});

		it("should asynchronously dispatch to registered listeners", done => {
			const ins = new Dispatcher();
			let test = 0b0000;

			function fn3() {
				test |= 0b0100;
			}

			ins
				.addListener('foo', () => {
					test |= 0b0001;
				})
				.addListener('foo', () => {
					test |= 0b0010;
				})
				.addListener('foo', fn3)
				.removeListener('foo', fn3)
				.addListener('bar', () => {
					test |= 0b1000;
				})
				.dispatch(new Dispatchable('foo'), true);

			setTimeout(() => {
				if (test === 0b0011) done();
				else done(new Error());
			}, 0);
		});

		it("should not dispatch to listeners added while dispatching", () => {
			const ins = new Dispatcher();
			let test = 0b00;

			ins
				.addListener('foo', () => {
					ins.addListener('foo', () => {
						test |= 0b10;
					});

					test |= 0b01;
				})
				.dispatch(new Dispatchable('foo'));

			_assert.strictEqual(test, 0b01);
		});

		it("should dispatch to listeners removed while dispatching", () => {
			const ins = new Dispatcher();
			let test = 0b00;

			function fna() {
				test |= 0b01;

				ins.removeListener('foo', fnb);
			}

			function fnb() {
				test |= 0b10;

				ins.removeListener('foo', fna);
			}

			ins
				.addListener('foo', fna)
				.addListener('foo', fnb)
				.dispatch(new Dispatchable('foo'));

			_assert.strictEqual(test, 0b11);
		});

		it("should not asynchronously dispatch to listeners removed before dispatch", done => {
			const ins = new Dispatcher();
			let test = 0b00;

			function fna() {
				test |= 0b01;
			}

			ins
				.addListener('foo', fna)
				.addListener('foo', () => {
					test |= 0b10;
				})
				.dispatch(new Dispatchable('foo'), true)
				.removeListener('foo', fna);

			setTimeout(() => {
				if (test === 0b10) done();
				else done(new Error());
			}, 0);
		});

		it("should not dispatch to same instance and type", () => {
			const ins = new Dispatcher();
			let test = 0b00;

			ins
				.addListener('foo', e => {
					test |= 0b01;

					ins
						.addListener('foo', () => {
							test |= 0b10;
						})
						.dispatch(e);
				})
				.dispatch(new Dispatchable('foo'));

			_assert.strictEqual(test, 0b01);
		});

		it("should not asynchronously dispatch during asynchronously dispatching", done => {
			const ins = new Dispatcher();
			let test = 0b000;

			ins
				.addListener('foo', () => {
					ins
						.addListener('bar', () => {
							test |= 0b010;
						})
						.addListener('baz', () => {
							test |= 0b100;
						})
						.dispatch(new Dispatchable('bar'))
						.dispatch(new Dispatchable('baz'), true);

					test |= 0b001;
				})
				.dispatch(new Dispatchable('foo'), true);

			setTimeout(() => {
				if (test === 0b011) done();
				else done(new Error());
			}, 0);
		});
	});

	describe('#once', () => {
		it("should require a nonempty string and a function", () => {
			const ins = new Dispatcher();
			const fn = () => 1;

			_assert.throws(() => ins.once(true, fn), TypeError);
			_assert.throws(() => ins.once(1, fn), TypeError);
			_assert.throws(() => ins.once('', fn), TypeError);
			_assert.doesNotThrow(() => ins.once('foo', fn));
			_assert.throws(() => ins.once(Symbol(), fn), TypeError);
			_assert.throws(() => ins.once({}, fn), TypeError);
			_assert.throws(() => ins.once('foo', true), TypeError);
			_assert.throws(() => ins.once('foo', 1), TypeError);
			_assert.throws(() => ins.once('foo', '1'), TypeError);
			_assert.throws(() => ins.once('foo', Symbol()), TypeError);
			_assert.throws(() => ins.once('foo', {}), TypeError);
		});

		it("should return the instance", () => {
			const ins = new Dispatcher();

			_assert.strictEqual(ins.once('foo', () => 1), ins);
		});

		it("should only be triggered once when dispatching synchronously", () => {
			let test = 0;

			new Dispatcher()
				.once('foo', () => {
					test += 1;
				})
				.dispatch(new Dispatchable('foo'))
				.dispatch(new Dispatchable('foo'));

			_assert.strictEqual(test, 1);
		});

		it("should only be triggered once when dispatching asynchronously", done => {
			let test = 0;

			new Dispatcher()
				.once('foo', () => {
					test += 1;
				})
				.dispatch(new Dispatchable('foo'), true)
				.dispatch(new Dispatchable('foo'), true);

			setTimeout(() => {
				if (test === 1) done();
				else done(new Error());
			}, 0);
		});

		it("should allow for duplicates towards #addListener", () => {
			let test = 0;

			function fn() {
				test += 1;
			}

			const ins = new Dispatcher()
				.addListener('foo', fn)
				.once('foo', fn)
				.dispatch(new Dispatchable('foo'));

			_assert.strictEqual(test, 2);
		});
	});

	describe('#hasQueuedType', () => {
		it("should return false if the instance is not defined", () => {
			const ins = new Dispatcher()
				.dispatch(new Dispatchable('foo'), true)
				.undefine();

			_assert.strictEqual(ins.hasQueuedType('foo'), false);
		});

		it("should return true if the instance has queued events of type", () => {
			const ins = new Dispatcher()
				.dispatch(new Dispatchable('foo'), true);

			_assert.strictEqual(ins.hasQueuedType('foo'), true);
		});


		it("should return false if the instance has no queued listener of type", () => {
			const ins = new Dispatcher();

			_assert.strictEqual(ins.hasQueuedType('foo'), false);
		});
	});

	describe('#toString', () => {
		it("should return the constructors .toString result", () => {
			_assert.strictEqual(new Dispatcher().toString(), Dispatcher.toString());
		});
	});
});
