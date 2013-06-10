define(function(require) {

	'use strict';


	var Deferred = require('./Deferred');
	var forEachSeries = require('./forEachSeries');


	/**
	 * Version of find which is guaranteed to process items in order
	 * @param {Array} list
	 * @param {Function} iterator
	 * @return {Promise}
	 */
	var findSeries = function(list, iterator) {

		var found;

		return forEachSeries(list, function(item, i) {
			return Deferred.fromAny(iterator(item, i, list))
				.then(function(result) {
					if (result) {
						found = item;
						throw 'break';
					}
				});
		}).then(
			function() {
				return found;
			},
			function(err) {
				if (err === 'break') {
					return found;
				}
				throw err;
			}
		);

	};


	return findSeries;

});
