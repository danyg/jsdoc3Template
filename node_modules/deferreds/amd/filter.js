define(function(require) {

	'use strict';


	var Deferred = require('./Deferred');
	var forEach = require('./forEach');


	/**
	 * Returns an array of all values in `list` which pass `iterator` truth
	 * test
	 * @param {Array} list
	 * @param {Function} iterator
	 * @return {Promise}
	 */
	var filter = function(list, iterator) {

		var results = [];

		return forEach(list, function(item, i) {
			return Deferred.fromAny(iterator(item, i, list))
				.then(function(result) {
					if (result === true) {
						results.splice(i, 0, item);
					}
				});
		}).then(function() {
			return results;
		});

	};


	return filter;

});
