var processProperties = function(){
}

processProperties.prototype = {
	publish: null,
	containers: null,
	
	init: function(publish){
		var me = this;
		this.publish = publish;
		this.log = this.publish.log;
		
		this.publish.processFiles.kindInterface = function(doclet){
			doclet.implementations = me.implementations[doclet.longname];
			return true;
		};
		
		this.containers.forEach(function(container){
			me.publish.helper.containers.push( container );
		});
	
	},
	
	/**
	 * @description methodo que sera llamado por publish al terminar de procesar
	 *				todos los doclets
	 */
	afterProccessDoclets: function(){},
	/**
	 * @description methodo que sera llamado por publish por cada doclet que 
	 *				procese. A utilizar para procesar o cambiar datos en los 
	 *				doclets.
	 */
	onProccessDoclet: function(doclet){return doclet;},
	
	onSetKinds: function(kinds){
		return kinds;
	},
	
	getProccessableProps: function(){
		var prop2Parse = [];
		for(var i in this){
			if(this.hasOwnProperty(i)){
				if(i.indexOf('prop') === 0){
					prop2Parse.push(i.substring(3).toLowerCase());
				}
			}
		}
		return prop2Parse;
	},
	
	getPropMethodName: function(propName){
		propName = propName.toString().toLowerCase();
		return 'prop' + propName.charAt(0).toUpperCase() + 
							propName.substr(1);
	},
	
	isProccessableProp: function(propName){
		var methodName = this.getPropMethodName(propName);
		return ('function' === typeof(this[methodName]));
	},
	
	processProp: function(propName, doclet){
		if(this.isProccessableProp(propName)){
			var methodName = this.getPropMethodName(propName);
			this[methodName](doclet);
		}
	}
};

module.exports = new processProperties();
module.exports.containers = [];
/**
 * TAGS!
 */

/**
 * Guarda en la propiedad see[i] el codigo html para el link.
 */
module.exports.propSee = function(item, i, doclet){
	return this.publish.hashToLink(doclet, item);
};

/**
 * Limpia el codigo proporcionado en example
 */
module.exports.propExamples = function(example, i, doclet){
	var caption = '', code = example;
	if(example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i)) {
		caption = RegExp.$1;
		code    = RegExp.$3;
	}
	return {
		caption: caption,
		code: code
	};
};