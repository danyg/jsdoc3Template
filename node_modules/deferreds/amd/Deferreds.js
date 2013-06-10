define(function(require) {

	'use strict';


	/** @namespace */
	var Deferreds = {
		'every': require('./every'),
		'filter': require('./filter'),
		'filterSeries': require('./filterSeries'),
		'find': require('./find'),
		'findSeries': require('./findSeries'),
		'forEach': require('./forEach'),
		'forEachSeries': require('./forEachSeries'),
		'isDeferred': require('./isDeferred'),
		'isPromise': require('./isPromise'),
		'map': require('./map'),
		'mapSeries': require('./mapSeries'),
		'parallel': require('./parallel'),
		'pipe': require('./pipe'),
		'reduce': require('./reduce'),
		'reduceRight': require('./reduceRight'),
		'series': require('./series'),
		'some': require('./some'),
		'sortBy': require('./sortBy'),
		'whilst': require('./whilst')
	};


	return Deferreds;

});
