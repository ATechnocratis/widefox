// ==UserScript==
//Source from https://github.com/alice0775/userChrome.js 
//Original author Alice0775
//Updates at  https://github.com/alice0775/userChrome.js 
//  Added  +3 extra tabs and a function to control navbar  width om resize
//  switch by clicking the are above tabs or with middle click on tab
// ==/UserScript==



var navbarX = document.getElementById("nav-bar");



//Resize navbar together with resized sidebar 
function resizeUrlbar() {
  //Get sidebar width
        //35 is the width of vertical bookmark toolbar
        var sidebarWidthPlus = parseInt(document.getElementById("SM_toolbox").width) + 35; 
        this.Button = document.getElementById("SM_Button");
 //If sidebar is show  resize navbar and window maximized
        if (this.Button.hasAttribute("checked") && window.windowState === 1 ){
            navbarX.setAttribute("style", "max-width:" +sidebarWidthPlus  + "px!important;");
        }
  //else restore full width
        else{
            navbarX.setAttribute("style", "max-width:100%!important;");
        }
}


var SidebarModoki = {
  // -- config --
  SM_RIGHT: false,  // SidebarModoki position
  SM_WIDTH : 130,
  SM_AUTOHIDE : true,  //F11 Fullscreen
  TAB0_DEFAULT_WIDTH : 300,
  TAB1_DEFAULT_WIDTH : 300,
  TAB2_DEFAULT_WIDTH : 540,
  TAB0_SRC   : "chrome://browser/content/places/bookmarksSidebar.xhtml",
  TAB0_LABEL : "Bookmarks",
  TAB1_SRC   : "chrome://browser/content/downloads/contentAreaDownloadsView.xhtml?SM",
  TAB1_LABEL : "Downloads",
  TAB2_SRC   : "chrome://userchromejs/content/aboutconfig/aboutconfig.xhtml",
  TAB2_LABEL : "Config",
  TAB3_SRC   : "about:addons",
  TAB3_LABEL : "Addons",
  TAB4_SRC   : "chrome://browser/content/places/historySidebar.xhtml",
  TAB4_LABEL : "History",
  TAB5_SRC   : "about:performance",
  TAB5_LABEL : "Tasks",
  // -- config --

  kSM_Open : "userChrome.SidebarModoki.Open",
  kSM_lastSelectedTabIndex : "userChrome.SidebarModoki.lastSelectedTabIndex",
  kSM_lastSelectedTabWidth : "userChrome.SidebarModoki.lastSelectedTabWidth",
  ToolBox: null,
  Button: null,
  get prefs(){
    delete this.prefs;
    return this.prefs = Services.prefs;
  },

  jsonToDOM: function(jsonTemplate, doc, nodes) {
    jsonToDOM.namespaces = {
    html: "http://www.w3.org/1999/xhtml",
    xul: "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    };
    jsonToDOM.defaultNamespace = jsonToDOM.namespaces.xul;
    function jsonToDOM(jsonTemplate, doc, nodes) {
      function namespace(name) {
          var reElemNameParts = /^(?:(.*):)?(.*)$/.exec(name);
          return { namespace: jsonToDOM.namespaces[reElemNameParts[1]], shortName: reElemNameParts[2] };
      }

      // Note that 'elemNameOrArray' is: either the full element name (eg. [html:]div) or an array of elements in JSON notation
      function tag(elemNameOrArray, elemAttr) {
        // Array of elements?  Parse each one...
        if (Array.isArray(elemNameOrArray)) {
          var frag = doc.createDocumentFragment();
          Array.prototype.forEach.call(arguments, function(thisElem) {
            frag.appendChild(tag.apply(null, thisElem));
          });
          return frag;
        }

        // Single element? Parse element namespace prefix (if none exists, default to defaultNamespace), and create element
        var elemNs = namespace(elemNameOrArray);
        var elem = doc.createElementNS(elemNs.namespace || jsonToDOM.defaultNamespace, elemNs.shortName);

        // Set element's attributes and/or callback functions (eg. onclick)
        for (var key in elemAttr) {
          var val = elemAttr[key];
          if (nodes && key == "keyvalue") {  //for later convenient JavaScript access) by giving them a 'keyvalue' attribute; |nodes|.|keyvalue|
              nodes[val] = elem;
              continue;
          }

          var attrNs = namespace(key);
          if (typeof val == "function") {
            // Special case for function attributes; don't just add them as 'on...' attributes, but as events, using addEventListener
            elem.addEventListener(key.replace(/^on/, ""), val, false);
          } else {
            // Note that the default namespace for XML attributes is, and should be, blank (ie. they're not in any namespace)
            elem.setAttributeNS(attrNs.namespace || "", attrNs.shortName, val);
          }
        }

        // Create and append this element's children
        var childElems = Array.prototype.slice.call(arguments, 2);
        childElems.forEach(function(childElem) {
          if (childElem != null) {
            elem.appendChild(
                childElem instanceof doc.defaultView.Node ? childElem :
                    Array.isArray(childElem) ? tag.apply(null, childElem) :
                        doc.createTextNode(childElem));
          }
        });
        return elem;
      }
      return tag.apply(null, jsonTemplate);
    }

    return jsonToDOM(jsonTemplate, doc, nodes);
  },

  init: function() {
    let chromehidden = document.getElementById("main-window").hasAttribute("chromehidden");
    if (chromehidden &&
        document.getElementById("main-window").getAttribute("chromehidden").includes("extrachrome")) {      return; // do nothing
    }

 let MARGINHACK = this.SM_RIGHT ? "0 0 0 0" : "0 -5px 0 0";
 let style = `
      @namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);
      #SM_toolbox
      {
        min-width: 0;
        width: {SM_WIDTH}px;
        background-color: var(--toolbar-bgcolor);
        color: -moz-dialogtext;
        text-shadow: none;
      }
      #SM_toolbox:not(.titlebar-color) {
          width: 130px;
          min-width: 0;
          background-color: var(--toolbar-bgcolor);
          color: var(--toolbar-color);
      }
      /*visibility*/
      #SM_toolbox[collapsed],
      #SM_splitter[collapsed],
      /*フルスクリーン*/
      #SM_toolbox[moz-collapsed="true"],
      #SM_splitter[moz-collapsed="true"]
      {
        visibility:collapse;
      }
      /*ポップアップの時*/
      #main-window[chromehidden~="extrachrome"] #SM_toolbox,
      #main-window[chromehidden~="extrachrome"] #SM_splitter
      {
        visibility: collapse;
      }

      /*プリントプレビュー*/
      #print-preview-toolbar[printpreview="true"] + #navigator-toolbox + #browser #SM_toolbox,
      #print-preview-toolbar[printpreview="true"] + #navigator-toolbox + #browser #SM_splitter
      {
        visibility:collapse;
      }
      #SM_tabs{
        color-scheme: normal !important;
      }
      #SM_tabpanels
      {
        appearance: none !important;
        padding: 0;
       /*margin: {MARGINHACK};*//* hack*/
        appearance: unset;
        color-scheme: normal !important;
      }
      #SM_tabs tab {
      appearance: none !important;
      color-scheme: normal !important;
      }
      #SM_tabpanels:not(.titlebar-color) {
          background-color: var(--toolbar-bgcolor);
          color: var(--toolbar-color);
      }
      
      tab:focus-visible > .tab-middle {
      outline: none!important;
      }
      #SM_closeButton:hover{
        opacity:0;
      }
      
      #SM_Button
      {
        /* list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQ0lEQVQ4jWNgoAL4z8DA8N/AwAArTQRGFSBBI4YBDHhonC6n3AA1NTUMZ6F5gyQXYFNEsheweWnUBfRyAbmYcgMoAgBFX4a/wlDliwAAAABJRU5ErkJggg=='); */
         list-style-image: url("chrome://userchromejs/content/sidebarModoki/closed.svg");

      }
      #SM_Button[checked="true"]{
        background:none!important;

         /*list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANklEQVQ4jWP4TyFg+P///38GBgayMHUNwEdjdTrVDcDnTKJdgEsRSV5ACaBRF9DZBQObFygBAMeIxVdCQIJTAAAAAElFTkSuQmCC');*/
          list-style-image:url("chrome://userchromejs/content/sidebarModoki/opened.svg"); 
      }
      
     `;

    style = style.replace(/\s+/g, " ").replace(/\{SM_WIDTH\}/g, this.SM_WIDTH).replace(/\{MARGINHACK\}/g, MARGINHACK);
    let sspi = document.createProcessingInstruction(
      'xml-stylesheet',
      'type="text/css" href="data:text/css,' + encodeURIComponent(style) + '"'
    );
    document.insertBefore(sspi, document.documentElement);
    sspi.getAttribute = function(name) {
      return document.documentElement.getAttribute(name);
    };

    Components.utils.import("resource:///modules/CustomizableUI.jsm");
    // xxxx try-catch may need for 2nd window
    try {
      CustomizableUI.createWidget({ //must run createWidget before windowListener.register because the register function needs the button added first
        id: 'SM_Button',
        type: 'custom',
        defaultArea: CustomizableUI.AREA_NAVBAR,
        onBuild: function(aDocument) {
          var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
          var props = {
            id: "SM_Button",
            class: "toolbarbutton-1 chromeclass-toolbar-additional",
            tooltiptext: "Sidebar Modoki",
            type: "button",
            oncommand: "SidebarModoki.buttonPress();",
            label: "Sidebar Modoki",
            removable: "true"
          };
          for (var p in props) {
            toolbaritem.setAttribute(p, props[p]);
          }
          
          return toolbaritem;
        }
      });
    }catch(e){}

    // to do, replace with MozXULElement.parseXULToFragment();
    let template = ["command", {id: "cmd_SidebarModoki", oncommand: "SidebarModoki.toggle()"}];
    document.getElementById("mainCommandSet").appendChild(this.jsonToDOM(template, document, {}));

    template = ["key", {id: "key_SidebarModoki", key: "B", modifiers: "accel,alt", command: "cmd_SidebarModoki",}];
    document.getElementById("mainKeyset").appendChild(this.jsonToDOM(template, document, {}));
//to do xxx ordinal=xx shoud be replaced with style="-moz-box-ordinal-group: xx;"
    template =
      ["vbox", {id: "SM_toolbox", style: this.SM_RIGHT ? "-moz-box-ordinal-group:10" : "-moz-box-ordinal-group:0"},
      ["toolbarbutton", {id: "SM_closeButton", class: "tabbable",switcher: "1", tooltiptext: "Switch", oncommand: "SidebarModoki.switch();"}],
        ["tabbox", {id:"SM_tabbox", flex: "1", handleCtrlPageUpDown: false, handleCtrlTab: false},
          ["tabs", {id: "SM_tabs"},
            ["tab", {id: "SM_tab0", label: this.TAB0_LABEL, class: "SM_tab"}],
            ["tab", {id: "SM_tab1", label: this.TAB1_LABEL, class: "SM_tab"}],
            ["tab", {id: "SM_tab2", label: this.TAB2_LABEL, class: "SM_tab"}]
          ],
          ["tabpanels", {id: "SM_tabpanels", flex: "1", style: "border: none;"},
            ["tabpanel", {id: "SM_tab0-container", orient: "vertical", flex: "1"},
              ["browser", {id: "SM_tab0-browser", flex: "1", autoscroll: "false", src: this.TAB0_SRC}]
            ],
            ["tabpanel", {id: "SM_tab1-container", orient: "vertical", flex: "1"},
              ["browser", {id: "SM_tab1-browser", flex: "1", autoscroll: "false", src: this.TAB1_SRC}]
            ],
            ["tabpanel", {id: "SM_tab2-container", orient: "vertical", flex: "1"},
              ["browser", {id: "SM_tab2-browser", flex: "1", autoscroll: "false", src: this.TAB2_SRC}]
            ]
          ],
        ],
      ];
    let sidebar = document.getElementById("sidebar-box");
    sidebar.parentNode.insertBefore(this.jsonToDOM(template, document, {}), sidebar);

    template =
      ["splitter", {id: "SM_splitter", style: this.SM_RIGHT ? "-moz-box-ordinal-group:9" : "-moz-box-ordinal-group:0", state: "open", collapse: this.SM_RIGHT ? "after" :"before", resizebefore: "closest", resizeafter: "closest"},
        ["grippy", {}]
      ];
    sidebar.parentNode.insertBefore(this.jsonToDOM(template, document, {}), sidebar);

    //xxx 69 hack
    let tabbox = document.getElementById("SM_tabbox");
    tabbox.handleEvent = function handleEvent(event) {
      if (!event.isTrusted) {
        // Don't let untrusted events mess with tabs.
        return;
      }

      // Skip this only if something has explicitly cancelled it.
      if (event.defaultCancelled) {
        return;
      }

      // Don't check if the event was already consumed because tab
      // navigation should always work for better user experience.
      let imports = {};
      ChromeUtils.defineModuleGetter(
        imports,
        "ShortcutUtils",
        "resource://gre/modules/ShortcutUtils.jsm"
      );
      const { ShortcutUtils } = imports;

      switch (ShortcutUtils.getSystemActionForEvent(event)) {
        case ShortcutUtils.CYCLE_TABS:
          if (this.tabs && this.handleCtrlTab) {
            this.tabs.advanceSelectedTab(event.shiftKey ? -1 : 1, true);
            event.preventDefault();
          }
          break;
        case ShortcutUtils.PREVIOUS_TAB:
          if (this.tabs && this.handleCtrlPageUpDown) {
            this.tabs.advanceSelectedTab(-1, true);
            event.preventDefault();
          }
          break;
        case ShortcutUtils.NEXT_TAB:
          if (this.tabs && this.handleCtrlPageUpDown) {
            this.tabs.advanceSelectedTab(1, true);
            event.preventDefault();
          }
          break;
      }
    };

    let index = document.getElementById("SM_tabpanels").selectedIndex;
    let tb0 = document.getElementById("SM_tab0");
    let tb1 = document.getElementById("SM_tab1");
    let tb2 = document.getElementById("SM_tab2");
    tb0.parentNode.insertBefore(tb0, tb1);
    tb0.parentNode.insertBefore(tb1, tb2);
    document.getElementById("SM_tabs").selectedIndex = index;
    let closebutton = document.getElementById("SM_closeButton");
    closebutton.switcher = "1";
    setTimeout(function(){this.observe();}.bind(this), 0);

    //F11 fullscreen
    FullScreen.showNavToolbox_org = FullScreen.showNavToolbox;
    FullScreen.showNavToolbox = function(trackMouse = true) {
      FullScreen.showNavToolbox_org(trackMouse);
      if (!!SidebarModoki.ToolBox) {
        SidebarModoki.ToolBox.removeAttribute("moz-collapsed"); 
        SidebarModoki.Splitter.removeAttribute("moz-collapsed");
      }
    }
    FullScreen.hideNavToolbox_org = FullScreen.hideNavToolbox;
    FullScreen.hideNavToolbox = function(aAnimate = false) {
      FullScreen.hideNavToolbox_org(aAnimate);
      if (SidebarModoki.SM_AUTOHIDE && !!SidebarModoki.ToolBox) {
        SidebarModoki.ToolBox.setAttribute("moz-collapsed", "true");
        SidebarModoki.Splitter.setAttribute("moz-collapsed", "true");
      }
    }

    //DOM fullscreen
    window.addEventListener("MozDOMFullscreen:Entered", this,
                            /* useCapture */ true,
                            /* wantsUntrusted */ false);
    window.addEventListener("MozDOMFullscreen:Exited", this,
                            /* useCapture */ true,
                            /* wantsUntrusted */ false);
    
  },


  observe: function() {
    this.ToolBox = document.getElementById("SM_toolbox");
    this.Splitter = document.getElementById("SM_splitter");

    if (this.getPref(this.kSM_Open, "bool", true)) {
      this.toggle(true);
    } else {
      this.close();
    }
    document.getElementById("SM_tabs").addEventListener("focus", this, true);
    window.addEventListener("aftercustomization", this, false);

    // xxxx native sidebar changes ordinal when change position of the native sidebar and open/close
    this.SM_Observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        switch (mutation.attributeName) {
          case "hidden":
          case "positionend":
            setTimeout(() => {
              this.ToolBox.setAttribute("style", this.SM_RIGHT ? "-moz-box-ordinal-group:10" : "-moz-box-ordinal-group:0");
              this.Splitter.setAttribute("style", this.SM_RIGHT ? "-moz-box-ordinal-group:9" : "-moz-box-ordinal-group:0");
            }, 0);
            break;
        }
      }.bind(this));
    }.bind(this));
    // pass in the target node, as well as the observer options
    this.SM_Observer.observe(document.getElementById("sidebar-box"),
                             {attribute: true, attributeFilter: ["collapsed", "hidden", "positionend"]});
  },

  onSelect: function(event) {
    let aIndex = document.getElementById("SM_tabpanels").selectedIndex;
    this.prefs.setIntPref(this.kSM_lastSelectedTabIndex, aIndex);
    width = this.getPref(this.kSM_lastSelectedTabWidth + aIndex, "int", this.SM_WIDTH);
    document.getElementById("SM_toolbox").width = width;
    resizeUrlbar();
  },
  
  toggle: function(forceopen) {
    this.Button = document.getElementById("SM_Button");
    if (!this.Button.hasAttribute("checked") || forceopen) {
      this.Button.setAttribute("checked", true);
      this.ToolBox.collapsed= false;
      this.Splitter.collapsed= false;
      let index = this.getPref(this.kSM_lastSelectedTabIndex, "int", 0);
      document.getElementById("SM_tabs").selectedIndex = index;
      width = this.getPref(this.kSM_lastSelectedTabWidth + index, "int", this.SM_WIDTH);
      document.getElementById("SM_toolbox").width = width;
      this.prefs.setBoolPref(this.kSM_Open, true)
      addEventListener("resize", this, false);
    } else {
      this.close();
    }
  },
  buttonPress: function() {
    this.prefs.setIntPref(this.kSM_lastSelectedTabWidth + 0, this.TAB0_DEFAULT_WIDTH);
    this.prefs.setIntPref(this.kSM_lastSelectedTabWidth + 1, this.TAB1_DEFAULT_WIDTH);
    this.prefs.setIntPref(this.kSM_lastSelectedTabWidth + 2, this.TAB2_DEFAULT_WIDTH);
    this.toggle();
  },
switch: function() {
  let closebutton = document.getElementById("SM_closeButton");
            let tb0x = document.getElementById("SM_tab0");
            let tb1x = document.getElementById("SM_tab1");
            let tb2x = document.getElementById("SM_tab2");
            let tb0n = document.getElementById("SM_tab0-browser");
            let tb1n = document.getElementById("SM_tab1-browser");
            let tb2n = document.getElementById("SM_tab2-browser");
  if( closebutton.switcher === "1"){ 

    tb0n.src = this.TAB3_SRC;
    tb1n.src = this.TAB4_SRC;
    tb2n.src = this.TAB5_SRC;
    tb0x.label =  this.TAB3_LABEL;
    tb1x.label =  this.TAB4_LABEL;
    tb2x.label =  this.TAB5_LABEL;
     closebutton.switcher ="2";

  }
  else{
      tb0n.src = this.TAB0_SRC;
      tb1n.src = this.TAB1_SRC;
      tb2n.src = this.TAB2_SRC;
      tb0x.label =  this.TAB0_LABEL;
      tb1x.label =  this.TAB1_LABEL;
      tb2x.label =  this.TAB2_LABEL;
     closebutton.switcher ="1";
    }
  
  },
  close: function() {
    removeEventListener("resize", this, false);
    this.Button = document.getElementById("SM_Button");
    this.Button.removeAttribute("checked");
    this.ToolBox.collapsed = true;
    this.Splitter.collapsed = true;
    this.prefs.setBoolPref(this.kSM_Open, false)
  },


  //ここからは, 大きさの調整
  onResize: function(event) {
     let width = this.ToolBox.getBoundingClientRect().width;
     let aIndex = document.getElementById("SM_tabs").selectedIndex;
     this.prefs.setIntPref(this.kSM_lastSelectedTabWidth + aIndex, width);
     resizeUrlbar();
  },

  handleEvent: function(event) {
    switch(event.type) {
      case 'focus':
        this.onSelect(event);
        break;
      case 'resize':
        this.onResize(event);
        break;
      case 'MozDOMFullscreen:Entered':
        if (!!this.ToolBox) {
          this.ToolBox.setAttribute("moz-collapsed", "true");
          this.Splitter.setAttribute("moz-collapsed", "true");
        }
        break;
      case 'MozDOMFullscreen:Exited':
        if (!!this.ToolBox) {
          this.ToolBox.removeAttribute("moz-collapsed"); 
          this.Splitter.removeAttribute("moz-collapsed");
        }
        break;
      case 'aftercustomization':
        if (this.getPref(this.kSM_Open, "bool", true)) {
          this.Button.setAttribute("checked", true);
        }
        break;
     }
  },

  //pref読み込み
  getPref: function(aPrefString, aPrefType, aDefault) {
    try{
      switch (aPrefType){
        case "str":
          return this.prefs.getCharPref(aPrefString).toString(); break;
        case "int":
          return this.prefs.getIntPref(aPrefString); break;
        case "bool":
        default:
          return this.prefs.getBoolPref(aPrefString); break;
      }
    }catch(e){
    }
    return aDefault;
  }

}

SidebarModoki.init();


//MIDDLE CLICK switch to tab and switch
    var sidebar_tabs = document.getElementsByClassName("SM_tab");
    for (i = 0; i < sidebar_tabs.length; i++) {
      sidebar_tabs[i].addEventListener("click", function(e) {  
      if (e.which == 2) {
     this.click();
        e.preventDefault();
        SidebarModoki.switch();
      } }, true);
} 

var splitter = document.getElementById("SM_splitter");

splitter.addEventListener('mousemove', resizeUrlbar);
window.addEventListener('load',resizeUrlbar);
window.addEventListener('resize', resizeUrlbar);
setTimeout(resizeUrlbar,400);


