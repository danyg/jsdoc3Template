var THEME = 'myCustom';
(function() {

	// theme name

	var
		_ = require('underscore/underscore'),
		template = require('underscore/template'),
		fs = require('fs'),
		helper = require('jsdoc/util/templateHelper'),
		myPublisher = require('templates/myCustom/inc/myPublisher.js').myPublisher
	;
	publish = function(data, opts) {
		console.log('Init myPublisher');
		myPublisher.log.debugOn = true; // opts??
		myPublisher.publish(data, opts);
	};
}());