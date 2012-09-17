var THEME = 'myCustom',
	MY_PATH = 'templates/myCustom/'
;
(function() {

	"use strict";

	// theme name
	
	var
		_ = require(MY_PATH + 'lib/underscore/underscore.js'),
		template = require(MY_PATH + 'lib/underscore/template.js'),
		fs = require('fs'),
		helper = require('jsdoc/util/templateHelper'),
		myPublisher = require(MY_PATH + 'inc/myPublisher.js').myPublisher
	;
	publish = function(data, opts) {
		console.log('Init myPublisher');
		
		myPublisher.log.debugOn = true; // opts??
				
		myPublisher.publish(data, opts);
	};
}());