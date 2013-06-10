define(function(require) {

	'use strict';


	var Deferred = require('./Deferred');


	/**
	 * Version of forEach which is guaranteed to execute passed functions in
	 * order.
	 * @param {Array} list
	 * @param {Function} iterator
	 * @return {Promise}
	 */
	var forEachSeries = function(list, iterator) {

		var superDeferred = new Deferred();

		if (!list.length) {
			superDeferred.resolve();
			return superDeferred.promise();
		}

		var completed = 0;

		var iterate = function() {
			Deferred.fromAny(iterator(list[completed], completed, list))
				.then(
					function() {
						completed += 1;
						if (completed === list.length) {
							superDeferred.resolve();
						}
						else {
							iterate();
						}
					},
					function() {
						superDeferred.reject.apply(superDeferred, arguments);
					}
				);
		};
		iterate();

		return superDeferred.promise();

	};


	return forEachSeries;

});
