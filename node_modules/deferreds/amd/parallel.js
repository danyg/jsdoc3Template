define(function(require) {

	'use strict';


	var Deferred = require('./Deferred');
	var map = require('./map');


	/**
	 * Executes all passed Functions in parallel.
	 * @param {Array} tasks
	 * @return {Promise}
	 */
	var parallel = function(tasks) {

		return map(tasks, function(task) {
			return Deferred.fromAny(task);
		});

	};


	return parallel;

});
