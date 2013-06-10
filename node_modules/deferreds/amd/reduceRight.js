define(function(require) {

	'use strict';


	var reduce = require('./reduce');


	/**
	 * Right-associative version of reduce; eqivalent to reversing a list and
	 * then running reduce on it.
	 * @param {Array|Object} list
	 * @param {Function} iterator
	 * @param {Any} memo
	 * @return {Promise}
	 */
	var reduceRight = function(list, iterator, memo) {
		return reduce(list.slice().reverse(), iterator, memo);
	};


	return reduceRight;

});
