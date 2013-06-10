define(function(require) {

	'use strict';


	var Deferred = require('./Deferred');
	var forEach = require('./forEach');


	/**
	 * Returns the first value in `list` matching the `iterator` truth test
	 * @param {Array} list
	 * @param {Function} iterator
	 * @return {Promise}
	 */
	var find = function(list, iterator) {

		var found;

		return forEach(list, function(item, i) {
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


	return find;

});
