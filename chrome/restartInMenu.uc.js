// Restart item script for Firefox 60+ by Aris
//
// left-click on restart item: normal restart
// middle-click on restart item: restart + clear caches
// right-click on restart item: no special function
//
// based on 'addRestartButton.uc.js' script by Alice0775
//  https://github.com/alice0775/userChrome.js/
// restart code from Classic Theme Restorer add-on
// invalidate caches from Session Saver add-on

var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var appversion = parseInt(Services.appinfo.version);

var RestartMenuFileAppItems = {
  init: function() {

    var button_label = "Restart";
    
    try {
      switch (document.getElementById("nav-bar").getAttribute("aria-label")) {
        case "Navigations-Symbolleiste": button_label = "Neustarten"; break;
        case "Панель навигации": button_label = "Перезапустить"; break;
      }
    } catch(e) {}



    try {
      if(appversion <= 62) restartitem_appmenu = document.createElement("toolbarbutton");
      else restartitem_appmenu = document.createXULElement("toolbarbutton");
      restartitem_appmenu.setAttribute("label", button_label);
      restartitem_appmenu.setAttribute("id","appMenu-restart-button");
      restartitem_appmenu.setAttribute("class","subviewbutton subviewbutton-nav");
      restartitem_appmenu.setAttribute("key", "R");
      restartitem_appmenu.setAttribute("insertbefore", "appMenu-quit-button");
      restartitem_appmenu.setAttribute("onclick", "if (event.button == 0) {RestartMenuFileAppItems.restartApp(false);} else if (event.button == 1) {RestartMenuFileAppItems.restartApp(true)};");
      restartitem_appmenu.setAttribute("oncommand", "RestartMenuFileAppItems.restartApp(false);");
      
      var appMenuquitbutton = document.querySelector("#appMenu-viewCache")?.content.querySelector("#appMenu-quit-button2") || document.querySelector("#appMenu-quit-button2");
      appMenuquitbutton.before(restartitem_appmenu);
      
      /*if(document.getElementById("appMenu-quit-button").previousSibling.id != "appMenu-restart-button" )
        document.getElementById("appMenu-quit-button").parentNode.insertBefore(restartitem_appmenu,document.getElementById("appMenu-quit-button"));*/
    } catch(e) {}

    var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

    // Style the icons (button/menu)
    var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
      \
      #fileMenu-restart-item { \
         list-style-image: url("chrome://global/skin/icons/reload.svg") !important; /* File Menu Entry */ \
      } \
      #fileMenu-restart-item > hbox > image.menu-iconic-icon { /* Style the menuItem */ \
         margin-inline-start: 2px; \
         margin-top: 2px; \
        -moz-context-properties: fill; \
         transform: scaleX(-1); \
      } \
      #appMenu-restart-button { \
        list-style-image: url("chrome://global/skin/icons/reload.svg"); /* Button in appMenu */ \
      } \
      #appMenu-restart-button .toolbarbutton-icon { /* Style the Button */ \
        transform: scaleX(-1); /* Icon mirroring */ \
        color: red; /* Icon color name */ \
      } \
      #main-window:-moz-lwtheme:-moz-lwtheme-brighttext #appMenu-restart-button .toolbarbutton-icon { \
        color: unset; /* in dark mode do not color the icon in the hamburger menu as red does not look very good over dark grey */ \
      } \
      \
    '), null, null);

    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
    
  },

  restartApp: function(clearcaches) {

    var cancelQuit = Components.classes["@mozilla.org/supports-PRBool;1"].createInstance(Components.interfaces.nsISupportsPRBool);
    var observerSvc = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);

    if(clearcaches) {
      Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).invalidateCachesOnRestart();
    }

    observerSvc.notifyObservers(cancelQuit, "quit-application-requested", "restart");

    if(cancelQuit.data) return false;

    Services.startup.quit(Services.startup.eRestart | Services.startup.eAttemptQuit);

  }

}

RestartMenuFileAppItems.init();