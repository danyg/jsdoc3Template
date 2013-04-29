var processTags = function(){
}

processTags.prototype = {
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
	
	getTagMethodName: function(tagName){
		tagName = tagName.toString().toLowerCase();
		return 'tag' + tagName.charAt(0).toUpperCase() + 
							tagName.substr(1);
	},
	
	isProccessableTag: function(tagName){
		var methodName = this.getTagMethodName(tagName);
		return ('function' === typeof(this[methodName]));
	},
	
	processTag: function(tagName, doclet){
		if(this.isProccessableTag(tagName)){
			var methodName = this.getTagMethodName(tagName);
			this[methodName](doclet);
		}
	}
};

module.exports = new processTags();

module.exports.containers = ['interface']; //todo mixin o borrows
module.exports.implementations = {}; //todo mixin o borrows
module.exports.ifaceDoclets = {};

module.exports.onProccessDoclet = function(doclet){
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

module.exports.onSetKinds = function(kinds){
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

module.exports.tagImplements = function(tag, i, doclet){
	// parse custom @interface tag to generate custom interface-kind doclets
	var ifaceName = tag.value;

	if(!this.ifaceNameDoclets[ifaceName]){
		// if the interface is not parsed yet

		var docletifaceName = this.publish.find({
			longname: ifaceName,
			kind: 'member'
		});

		if(docletifaceName.length > 0){
			docletifaceName = docletifaceName[0];
		}else{
			docletifaceName = null;
			if(!this.implementations[ifaceName]){
				this.log.error('Interface not found: ', ifaceName);
			}
		}
		if(docletifaceName){
	//							this.log.debug('### INTERFACE : ', ifaceName, '###########')
	//							this.log.debug(docletifaceName)
	//							this.log.debug('### END:INTERFACE ###################')

			this.publish.processDocletTags(docletifaceName);
			
		}
	}

	// add to doclet's implements array
	doclet['implements'].push(ifaceName);

	// add interface implementation to implementations hash
	if(!this.implementations[ifaceName]) {
		this.implementations[ifaceName] = [];
	}
	this.implementations[ifaceName].push(doclet);
}

module.exports.tagInterface = function(tag, i, doclet){
	// parse custom @interface tag to generate custom interface-kind doclets
	var url = this.publish.helper.createLink(doclet),
		ifaceName = doclet.longname
	;
	doclet.kind = 'interface';
	this.publish.helper.registerLink(ifaceName, url);
	this.ifaceDoclets[ifaceName] = doclet;
}
/*
module.exports.tagExtends = function(tag, i, doclet){
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
}*/

module.exports.tagListen = function(item, i, doclet){
	var r='';
	if(undefined === doclet.listen){
		doclet.listen = [];
	}

/*
 *	// TODO Mejorar esto, ver si se puede acceder al parser de eventos 
 *	// internos de jsdoc3
	var pos = item.value.lastIndexOf('#');
	if(pos === -1){ //
		var pos = item.value.lastIndexOf('.');
		if(pos === -1){
			item.value = 'event:' + item.value;
		}else{
			var eventName = item.value.substring(pos+1);
			item.value = item.value.substring(0, pos) + '.event:' + eventName;
		}
	}else{
		var eventName = item.value.substring(pos+1);
		item.value = item.value.substring(0, pos) + '#event:' + eventName;
	}
 */


	var pos = item.value.lastIndexOf('.');
	if(pos === -1){
		item.value = 'event:' + item.value;
	}else{
		var eventName = item.value.substring(pos+1);
		item.value = item.value.substring(0, pos) + '#event:' + eventName;
		
		try{
			var eventDoclet = this.publish.find({
				longname: item.value,
				kind: 'event'
			})[0];
		}catch(e){}
	}
	
	doclet.listen.push( r = this.publish.hashToLink(eventDoclet, item.value) );

	return doclet.listen;
};