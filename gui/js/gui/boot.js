(function(){
	global.DEBUG_MODE = true;
	
	window.reset = function(){
		var module;
		for(module in global.require.cache){
			if(global.require.cache.hasOwnProperty(module)){
				delete global.require.cache[module];
			}
		}
		require('nw.gui').Window.get().reloadIgnoringCache();
	}
	
	require('nw.gui').Window.get().showDevTools();
	
	// fix the issue of require nw.gui from node_modules
	global.require.cache['nw.gui'] = window.require('nw.gui');
	if(!global.require._OWNED){
		var __realRequire__ = global.require;
		window.require = global.require = function (name) {
			if (name == 'nw.gui'){
				return nwDispatcher.requireNwGui();
			}
			return __realRequire__(name);
		}
		for(var i in __realRequire__){
			if(__realRequire__.hasOwnProperty(i)){
				(function(prop){
					global.require.__defineGetter__(prop, function(){
						return __realRequire__[prop];
					});
				}(i));
			}
		}
		global.require._OWNED = true;
	}
	global.nwrequire = window.require;
	
	var jsdocGUICore = require('jsdocGUI/GUI');
	
	$(document).ready(function(){
		jsdocGUICore.jsdocGUI.init();
	});

	//requirejs(['gui/keyboard', 'gui/jsdocGUI'], function(){});
}());