define(function(require) {

	'use strict';


	var Deferred = require('./Deferred');
	var mapSeries = require('./mapSeries');


	/**
	 * Executes all passed Functions one at a time.
	 * @param {Array} tasks
	 * @return {Promise}
	 */
	var series = function(tasks) {

		return mapSeries(tasks, function(task) {
			return Deferred.fromAny(task);
		});

	};


	return series;

});
