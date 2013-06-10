define(function(require) {

	'use strict';


	var pluck = require('mout/collection/pluck');

	var Deferred = require('./Deferred');
	var map = require('./map');


	/**
	 * Produces a sorted copy of `list`, ranked by the results of running each
	 * item through `iterator`
	 * @param {Array} list
	 * @param {Function} iterator
	 * @return {Promise}
	 */
	var sortBy = function(list, iterator) {

		return map(list, function(item, i) {
			return Deferred.fromAny(iterator(item, i, list))
				.then(function(criteria) {
					return {
						index: i,
						value: item,
						criteria: criteria
					};
				});
		}).then(
			function(result) {
				result = result.sort(function(left, right) {
					var a = left.criteria;
					var b = right.criteria;

					if (a !== b) {
						if (a > b || a === undefined) {
							return 1;
						}
						if (a < b || b === undefined) {
							return -1;
						}
					}

					if (left.index < right.index) {
						return -1;
					}

					return 1;
				});

				return pluck(result, 'value');
			}
		);

	};


	return sortBy;

});
