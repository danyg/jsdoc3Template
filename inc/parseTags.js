var parseTags = function(){
}

parseTags.prototype = {
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
	
	getProccessableTags: function(){
		var tag2Parse = [];
		for(var i in this){
			if(this.hasOwnProperty(i)){
				if(i.indexOf('tag') === 0){
					tag2Parse.push(i.substring(3).toLowerCase());
				}
			}
		}
		return tag2Parse;
	},
	
	_getMethodName: function(tagName){
		tagName = tagName.toString().toLowerCase();
		return 'tag' + tagName.charAt(0).toUpperCase() + 
							tagName.substr(1);
	},
	
	isProccessableTag: function(tagName){
		var methodName = this._getMethodName(tagName);
		return ('function' === typeof(this[methodName]));
	},
	
	processTag: function(tagName, doclet){
		if(this.isProccessableTag(tagName)){
			var methodName = this._getMethodName(tagName);
			this[methodName](doclet);
		}
	}
};

exports.parseTags = new parseTags();
exports.parseTags.containers = ['interface']; //todo mixin o borrows
exports.parseTags.implementations = {}; //todo mixin o borrows
exports.parseTags.ifaceDoclets = {};

exports.parseTags.onProccessDoclet = function(doclet){
	// parse custom @implements tag to generate implements
	// and fill implementations hash
	if(doclet.kind === 'class' || doclet.kind === 'namespace') {
		if(doclet.tags && doclet.tags.length) {
			doclet['implements'] = [];
			for(var i = 0, n = doclet.tags.length; i < n; ++i) {
				if(doclet.tags[i].title === 'implements') {
					var iface = doclet.tags[i].value;

					if(!this.ifaceDoclets[iface]){
						var docletiface = this.publish.find({
							longname: iface,
							kind: 'member'
						});
						if(docletiface.length > 0){
							docletiface = docletiface[0];
						}else{
							docletiface = null;
							if(!this.implementations[iface]){
								this.log.error('Interface no encontrada', iface);
							}
						}
						if(docletiface){
//							this.log.debug('### INTERFACE : ', iface, '###########')
//							this.log.debug(docletiface)
//							this.log.debug('### END:INTERFACE ###################')

							this.tagImplements(undefined, undefined, docletiface);
							this.ifaceDoclets[iface] = docletiface;
						}
					}

					// add to doclet's implements array
					doclet['implements'].push(iface);

					// add interface implementation to implementations hash
					if(!this.implementations[iface]) {
						this.implementations[iface] = [];
					}
					this.implementations[iface].push(doclet);
				}
			}
		}
	}
	return doclet;
};

exports.parseTags.onSetKinds = function(kinds){
	kinds['interface'] = {
		once: true,
		data: this.publish.find({
			kind: 'interface'
		})
	};
	return kinds;
};

/**
 * TAGS!
 */

exports.parseTags.tagSee = function(item, i, doclet){
	return this.publish.hashToLink(doclet, item);
};
exports.parseTags.tagExamples = function(example, i, doclet){
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

exports.parseTags.tagImplements = function(tag, i, doclet){
	// parse custom @interface tag to generate custom interface-kind doclets
		if(doclet.kind === 'member') {
			if(doclet.tags && doclet.tags.length) {
				for(var i = 0, n = doclet.tags.length; i < n; ++i) {
					if(doclet.tags[i].title === 'interface') {
						doclet.kind = 'interface';
						var url = this.publish.helper.createLink(doclet);
						this.publish.helper.registerLink(doclet.longname, url);
//						this.log.dbg('Creando link a interface: ', doclet.longname, url);
					}
				}
			}
		}
}

exports.parseTags.tagExtends = function(tag, i, doclet){
	var parent,
		classes = this.publish.find({
		longname: tag,
		kind: 'class'
	});
	if(classes.length === 1){
		parent = classes[0];
	}
	doclet.parentClass = parent;
	
	this.log.dbg('## FOUND EXTENDS ##');
	this.log.dbg(doclet);
	this.log.dbg('## !FOUND EXTENDS ##');

	return doclet;
}