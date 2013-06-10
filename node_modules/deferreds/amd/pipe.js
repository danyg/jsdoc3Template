define(function(require) {

	'use strict';


	var partial = require('mout/function/partial');

	var Deferred = require('./Deferred');
	var toArray = require('mout/lang/toArray');


	/**
	 * Executes all passed Functions one at a time, each time passing the
	 * result to the next function in the chain.
	 * @param {Any} tasks
	 * @return {Promise}
	 */
	var pipe = function(tasks) {

		var superDeferred = new Deferred();
		var completed = 0;

		var iterate = function() {
			var args = toArray(arguments);
			var task = tasks[completed];
			args.unshift(task);
			Deferred.fromAny( partial.apply(task, args) )
				.then(
					function() {
						completed++;
						if (completed === tasks.length) {
							superDeferred.resolve.apply(superDeferred, arguments);
						}
						else {
							iterate.apply(superDeferred, arguments);
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


	return pipe;

});
