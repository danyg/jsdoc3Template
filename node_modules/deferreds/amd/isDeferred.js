define(function() {

	'use strict';


	var isDeferred = function(obj) {
		return obj && obj.promise;
	};

	return isDeferred;

});
