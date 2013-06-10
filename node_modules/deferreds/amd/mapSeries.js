define(function(require) {

	'use strict';


	var Deferred = require('./Deferred');
	var forEachSeries = require('./forEachSeries');


	/**
	 * Version of map which is guaranteed to process items in order
	 * @param {Array|Object} list
	 * @param {Function} iterator
	 * @return {Promise}
	 */
	var mapSeries = function(list, iterator) {

		var superDeferred = new Deferred();
		var results = [];

		forEachSeries(list, function(item, i) {
			return Deferred.fromAny(iterator(item, i, list))
				.then(
					function(transformed) {
						results[i] = transformed;
					}
				);
		}).then(
			function() {
				superDeferred.resolve(results);
			},
			function() {
				superDeferred.reject.apply(superDeferred, arguments);
			}
		);

		return superDeferred.promise();

	};


	return mapSeries;

});
