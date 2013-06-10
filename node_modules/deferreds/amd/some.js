define(function(require) {

	'use strict';


	var Deferred = require('./Deferred');
	var forEach = require('./forEach');


	/**
	 * Returns `true` if any values in `list` pass `iterator` truth test
	 * @param {Array} list
	 * @param {Function} iterator
	 * @return {Promise}
	 */
	var some = function(list, iterator) {

		return forEach(list, function(item, i) {
			return Deferred.fromAny(iterator(item, i, list))
				.then(function(result) {
					if (result) {
						throw 'break';
					}
				});
		}).then(
			function() {
				return false;
			},
			function(err) {
				if (err === 'break') {
					return true;
				}
				throw err;
			}
		);

	};


	return some;

});
