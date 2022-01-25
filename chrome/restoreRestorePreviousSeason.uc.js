// Restore Restore Previous Session in menu
var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});

var {SessionStore} = Components.utils.import("resource:///modules/sessionstore/SessionStore.jsm", {}); 

var RestoreLastSessionMenuRestorer = {
  init: function() {

    try {

      restoresession_appmenu = document.createXULElement("toolbarbutton");
      restoresession_appmenu.setAttribute("label", "Restore Previous Session");
      restoresession_appmenu.setAttribute("id","appMenu-RestoreLastSession-button");
      restoresession_appmenu.setAttribute("class","subviewbutton");
      restoresession_appmenu.setAttribute("key", "Shift+P");
      restoresession_appmenu.setAttribute("oncommand", "RestoreLastSessionMenuRestorer.restoreAndDisable();");
      var appMenuSep = document.querySelector("#appMenu-viewCache")?.content.querySelector("#appMenu-new-private-window-button2").nextSibling || document.querySelector("#appMenu-new-private-window-button2").nextSibling;
      appMenuSep.before(restoresession_appmenu);
      
    } catch(e) {}

  },

  restoreAndDisable: function() {
    if(SessionStore.canRestoreLastSession){
      SessionStore.restoreLastSession();
    }
    let mybutt=  document.getElementById("appMenu-RestoreLastSession-button")
    mybutt.setAttribute("disabled", "true");

  }

}

RestoreLastSessionMenuRestorer.init();
