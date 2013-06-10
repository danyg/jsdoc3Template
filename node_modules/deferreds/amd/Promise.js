define(function() {

	'use strict';


	/**
	 * @class
	 * @param {Deferred} deferred
	 */
	var Promise = function(deferred) {
		this._deferred = deferred;
	};


	/**
	 * @return {Deferred.State}
	 */
	Promise.prototype.state = function() {
		return this._deferred._state;
	};

	/**
	 * @param {Function} doneCallback
	 * @param {Function} [failCallback]
	 * @param {Function} [progressCallback]
	 * @return this
	 */
	Promise.prototype.then = function() {
		return this._deferred.then.apply(this._deferred, arguments);
	};


	/**
	 * @param {Function} callback
	 * @return this
	 */
	Promise.prototype.done = function() {
		this._deferred.done.apply(this._deferred, arguments);
		return this;
	};


	/**
	 * @param {Function} callback
	 * @return this
	 */
	Promise.prototype.fail = function() {
		this._deferred.fail.apply(this._deferred, arguments);
		return this;
	};


	/**
	 * @param {Function} callback
	 * @return this
	 */
	Promise.prototype.always = function() {
		this._deferred.always.apply(this._deferred, arguments);
		return this;
	};


	return Promise;

});
