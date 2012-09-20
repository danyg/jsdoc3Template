var MY_PATH = 'templates/myCustom/',
	myPublisher = require(MY_PATH + 'inc/myPublisher.js').myPublisher
;
exports.publish = function(data, opts) {
	console.log('Init myPublisher');

	myPublisher.log.debugOn = true; // opts??
	myPublisher.publish(data, opts);
};