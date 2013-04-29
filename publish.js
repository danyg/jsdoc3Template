

exports.publish = function(data, opts) {
	require.paths.push(opts.template + '/node_modules');
	var myPublisher = require('jd3t/myPublisher.js');

	console.log('Init jsdoc3Template');

	myPublisher.log.debugOn = true; // opts??
	myPublisher.publish(data, opts);
};