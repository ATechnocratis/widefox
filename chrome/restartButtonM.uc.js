//Restart button on toolbar //

(function() {

   if (location != 'chrome://browser/content/browser.xhtml') return;
	
	try {
		CustomizableUI.createWidget({
			id: 'restart-button2a',
			type: 'custom',
			defaultArea: CustomizableUI.AREA_NAVBAR,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'restart-button2a',
					class: 'toolbarbutton-1',
					label: 'Restart',
					tooltiptext: 'Restart',
					style: 'list-style-image: url("chrome://global/skin/icons/reload.svg");transform: rotateY(180deg);',
					onclick: 'if (event.button == 0) { \
                                  Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit); \
                              }; \
                              if (event.button == 1 || event.button == 2) { \
                                  Services.appinfo.invalidateCachesOnRestart(); \
                                  Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit); \
                              };'
				};				
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);				
				return toolbaritem;
			}		
		});
	} catch(e) { };		
   
})();