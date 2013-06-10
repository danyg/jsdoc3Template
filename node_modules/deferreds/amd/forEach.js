define(function(require) {

	'use strict';


	var Deferred = require('./Deferred');


	/**
	 * Invoke `iterator` once for each function in `list`
	 * @param {Array|Object} list
	 * @param {Function} iterator
	 * @return {Promise}
	 */
	var forEach = function(list, iterator) {

		var superDeferred = new Deferred();

		if (!list.length) {
			superDeferred.resolve();
			return superDeferred.promise();
		}

		var completed = 0;
		list.forEach(function(item, i) {
			Deferred.fromAny(iterator(item, i, list))
				.then(
					function() {
						completed++;
						if (completed === list.length) {
							superDeferred.resolve();
						}
					},
					function() {
						superDeferred.reject.apply(superDeferred, arguments);
					}
				);
		});

		return superDeferred.promise();

	};


	return forEach;

});
