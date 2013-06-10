/*global setImmediate */
define(function(require) {

	'use strict';


	var toArray = require('mout/lang/toArray');
	var isFunction = require('mout/lang/isFunction');
	require('setimmediate');

	var isPromise = require('./isPromise');
	var Promise = require('./Promise');


	/**
	 * @class
	 */
	var Deferred = function() {
		if (!(this instanceof Deferred)) {
			throw new Error('Deferred constructor function must be called with the "new" keyword');
		}

		this._state = Deferred.State.PENDING;
		this._callbacks = {
			fulfilled: [],
			rejected: []
		};
		this._closingArguments = [];
		this._promise = new Promise(this);
	};


	/**
	 * @return {Promise}
	 */
	Deferred.prototype.promise = function() {
		return this._promise;
	};


	/**
	 * @return {Deferred.State}
	 */
	Deferred.prototype.state = function() {
		return this._state;
	};


	Deferred.prototype._drainCallbacks = function() {
		if (this._isDrainPending) {
			return;
		}
		this._isDrainPending = true;

		setImmediate(function() {
			this._isDrainPending = false;

			var callbacks;

			switch (this._state) {
				case Deferred.State.FULFILLED:
					callbacks = this._callbacks.fulfilled;
					this._callbacks.rejected = [];
					break;
				case Deferred.State.REJECTED:
					callbacks = this._callbacks.rejected;
					this._callbacks.fulfilled = [];
					break;
				default:
					return;
			}

			try {
				while (callbacks.length) {
					callbacks.shift().apply(undefined, this._closingArguments);
				}
			}
			catch (e) {
				this.reject(e);
			}
		}.bind(this));
	};


	Deferred.prototype._setState = function(state, args) {
		if (this._state !== Deferred.State.PENDING) {
			return this;
		}

		this._state = state;
		this._closingArguments = args;
		this._drainCallbacks();
		return this;
	};


	/**
	 * @param {...Any} args
	 * @return this
	 */
	Deferred.prototype.resolve = function() {
		return this._setState(Deferred.State.FULFILLED, arguments);
	};


	/**
	 * @param {...Any} args
	 * @return this
	 */
	Deferred.prototype.reject = function() {
		return this._setState(Deferred.State.REJECTED, arguments);
	};


	/**
	 * @param {Function} doneCallback
	 * @param {Function} [failCallback]
	 * @return this
	 */
	Deferred.prototype.then = function(onFulfilled, onRejected) {
		var piped = new Deferred();

		this.done(function callFulfilled() {
			if (this._state === Deferred.State.FULFILLED && !isFunction(onFulfilled)) {
				//edge case of Promises/A+ 3.2.6.4 (that's why it looks like one)
				piped.resolve.apply(piped, this._closingArguments);
			}
			else {
				var args = [onFulfilled].concat(toArray(arguments));
				Deferred.fromAny.apply(undefined, args)
					.done(piped.resolve.bind(piped))
					.fail(piped.reject.bind(piped));
			}
		}.bind(this));

		this.fail(function callRejected() {
			if (this._state === Deferred.State.REJECTED && !isFunction(onRejected)) {
				//edge case of Promises/A+ 3.2.6.5 (that's why it looks like one)
				piped.reject.apply(piped, this._closingArguments);
			}
			else {
				var args = [onRejected].concat(toArray(arguments));
				Deferred.fromAny.apply(undefined, args)
					.done(piped.resolve.bind(piped))
					.fail(piped.reject.bind(piped));
			}
		}.bind(this));

		return piped.promise();
	};


	/**
	 * @param {Function} onFulfilled
	 * @param {Function} onRejected
	 * @return this
	 */
	Deferred.prototype._addCallbacks = function(onFulfilled, onRejected) {
		if (onFulfilled) {
			this._callbacks.fulfilled.push(onFulfilled);
		}

		if (onRejected) {
			this._callbacks.rejected.push(onRejected);
		}

		if (this._state !== Deferred.State.PENDING) {
			this._drainCallbacks();
		}

		return this;
	};


	/**
	 * @param {Function} callback
	 * @return this
	 */
	Deferred.prototype.done = function(onFulfilled) {
		return this._addCallbacks(onFulfilled);
	};


	/**
	 * @param {Function} callback
	 * @return this
	 */
	Deferred.prototype.fail = function(onRejected) {
		return this._addCallbacks(undefined, onRejected);
	};


	/**
	 * @param {Function} callback
	 * @return this
	 */
	Deferred.prototype.always = function(callback) {
		return this._addCallbacks(callback, callback);
	};


	/**
	 * @enum {String}
	 * @const
	 */
	Deferred.State = {
		PENDING: 'pending',
		FULFILLED: 'fulfilled',
		REJECTED: 'rejected'
	};


	/**
	 * Monad `return` equivalent
	 * @param {Any} obj
	 * @return {Deferred}
	 */
	Deferred.fromAny = function(obj) {
		if (isPromise(obj)) {
			if (obj instanceof Deferred || obj instanceof Promise) {
				return obj;
			}
			else {
				var deferred = new Deferred();
				obj.then(
					deferred.resolve.bind(deferred),
					deferred.reject.bind(deferred)
				);
				return deferred.promise();
			}
		}
		else if (isFunction(obj)) {
			//any arguments after obj will be passed to obj()
			var args = Array.prototype.slice.call(arguments, 1);
			var result;
			try {
				result = obj.apply(obj, args);
			}
			catch (e) {
				return new Deferred().reject(e).promise();
			}
			return Deferred.fromAny(result);
		}
		else {
			return new Deferred().resolve(obj).promise();
		}
	};


	return Deferred;

});
