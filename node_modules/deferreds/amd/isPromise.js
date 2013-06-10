define(function() {

	'use strict';


	var isPromise = function(obj) {
		return obj && typeof obj.then === 'function';
	};


	return isPromise;

});
