/*global setImmediate:false */
define(function(require) {

	'use strict';


	var Signal = require('signals');
	require('setimmediate');

	var Deferred = require('./Deferred');


	/**
	 * Processes tasks in parallel up to `concurrency` limit, reporting events
	 * along the way.
	 * @param {Function} worker
	 * @param {Number} iterator
	 * @extends {Array}
	 * @constructs
	 */
	var Queue = function(worker, concurrency) {

		this._worker = worker;
		this._concurrency = concurrency;
		this._runningWorkers = 0;
		this._events = {
			saturated: new Signal(),
			emptied: new Signal(),
			drained: new Signal()
		};

	};


	Queue.prototype = Object.create(Array.prototype);
	Queue.prototype.constructor = Queue;


	Queue.prototype.clone = function() {
		var cloned = new Queue(this._worker, this._concurrency);
		cloned._events = this._events;
		return cloned;
	};


	Queue.prototype.start = function() {
		this._running = true;
		this.process();
	};


	Queue.prototype.stop = function() {
		this._running = false;
		this._stoppedDeferred = new Deferred();
		if (this._runningWorkers === 0) {
			this._stoppedDeferred.resolve();
		}
		return this._stoppedDeferred.promise();
	};


	Queue.prototype.on = function(key, callback) {
		this._events[key].add(callback);
	};


	Queue.prototype.off = function(key, callback) {
		this._events[key].remove(callback);
	};


	Queue.prototype.process = function() {
		setImmediate(function() {
			if (!this._running) {
				return;
			}

			if (!this.length) {
				return;
			}

			if (this._runningWorkers >= this._concurrency) {
				return;
			}

			var task = Array.prototype.shift.call(this);

			if (!this.length) {
				this._events.emptied.dispatch();
			}

			this._runningWorkers++;

			Deferred.fromAny(this._worker(task)).then(function() {
				this._runningWorkers--;
				if (this.length === 0 && this._runningWorkers === 0) {
					this._events.drained.dispatch();
				}
				if (this._stoppedDeferred && this._runningWorkers === 0) {
					this._stoppedDeferred.resolve();
				}
				this.process();
			}.bind(this));
		}.bind(this));
	};


	//Array mutator methods
	['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift']
		.forEach(function(key) {
			Queue.prototype[key] = function() {
				var ret = Array.prototype[key].apply(this, arguments);
				if (this.length === this._concurrency) {
					this._events.saturated.dispatch();
				}
				this.process();
				return ret;
			};
		});


	//Array methods returning new arrays
	['concat', 'slice', 'filter', 'map']
		.forEach(function(key) {
			Queue.prototype[key] = function() {
				var ret = Array.prototype[key].apply(this, arguments);
				var q = this.clone();
				q.push.apply(q, ret);
				return q;
			};
		});


	return Queue;

});
