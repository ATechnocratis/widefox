// ==UserScript==
//Source from https://github.com/alice0775/userChrome.js 
//Original author Alice0775
//Updates at  https://github.com/alice0775/userChrome.js 
//  Added  +3 extra tabs and a function to control navbar  width om resize
//  switch by clicking the are above tabs or with middle click on tab
// ==/UserScript==


var appcontent = document.getElementById("appcontent");
var navbarX = document.getElementById("nav-bar");
var mainWindow  = document.getElementById("main-window");

var sheetX = document.createElement('style');
document.body.appendChild(sheetX);

sheetX.innerHTML ='  #main-window[sizemode="maximized"] #nav-bar {max-width:300px!important;}';



//Resize navbar together with resized sidebar 
function resizeUrlbar() {
    //Get sidebar width
        //35 is the width of vertical bookmark toolbar
  var sidebarWidthPlus = parseInt(getComputedStyle(document.getElementById("SM_toolbox")).width) + 35; 
  sheetX.innerHTML ='  #main-window[sizemode="maximized"] #nav-bar {max-width:' + sidebarWidthPlus + 'px!important;}';
}

var SidebarModoki = {
  // -- config --
  SM_RIGHT: false,  // SidebarModoki position
  SM_WIDTH : 300,
  SM_AUTOHIDE : true,  //F11 Fullscreen
  TAB_SMALL_DEFAULT_WIDTH : 300,
  TAB_BIG_DEFAULT_WIDTH : 420,

  //chrome://browser/content/places/places.xhtml
  TAB0_SRC   : "chrome://browser/content/places/bookmarksSidebar.xhtml",
  TAB0_LABEL : "Bookmarks",
  TAB1_SRC   : "chrome://browser/content/downloads/contentAreaDownloadsView.xhtml?SM",
  TAB1_LABEL : "Downloads",
  TAB2_SRC   : "chrome://browser/content/places/historySidebar.xhtml",
  TAB2_LABEL : "History",
  TAB3_SRC   : "about:addons",
  TAB3_LABEL : "Addons",
  TAB4_SRC   : "chrome://userchromejs/content/aboutconfig/aboutconfig.xhtml",
  TAB4_LABEL : "Config",
  TAB5_SRC   : "about:processes",
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
      #SM_tabpanels
      {
        appearance: none !important;
        padding: 0;
       /*margin: {MARGINHACK};*//* hack*/
        appearance: unset;
      }

      #SM_tabs tab {
      appearance: none !important;
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

      /*Sidebar panel windows controls and indicator*/
      #nav_button_container {
          position:fixed;
          display:inline-flex;
          z-index:9999;
          width: 70px;
          margin-left: -140px;
          transition: 0.3s ease-in;
          transition-property: width, height, opacity, margin;
          transform-origin: center;
          height: 3px;
          padding: 1px;
          opacity: 0.9;
          margin-top: 17px;
          border: 2px solid var(--arrowpanel-border-color);
          border-top-color: var(--toolbar-bgcolor);
          border-bottom-right-radius: 15px;
          border-bottom-left-radius: 15px;
          transition: all 0.15s ease-in-out;
      }
      .nav_button {
          opacity: 0;
      }
      #SM_tabbox[selectedIndex="0"] #SM_tabs>#nav_button_container {
          margin-left: 0px!important;
      }
      #SM_tabbox[selectedIndex="1"] #SM_tabs>#nav_button_container {
          margin-left: calc( 1*42px);
      }
      #SM_tabbox[selectedIndex="2"] #SM_tabs>#nav_button_container {
          margin-left: calc( 2*42px);
      }
      #SM_tabbox[selectedIndex="3"] #SM_tabs>#nav_button_container {
          margin-left: calc( 3*42px);
      }
      #SM_tabbox[selectedIndex="4"] #SM_tabs>#nav_button_container {
          margin-left: calc( 4*42px);
      }
      #SM_tabbox[selectedIndex="5"] #SM_tabs>#nav_button_container {
          margin-left: calc( 5*42px);
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

   
    ChromeUtils.import("resource:///modules/CustomizableUI.jsm");
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
    template =
      ["vbox", {id: "SM_toolbox", class: "chromeclass-extrachrome", customizable:"true", style: this.SM_RIGHT ? "-moz-box-ordinal-group:10" : "-moz-box-ordinal-group:0"},
      ["toolbarbutton", {id: "SM_closeButton", class: "tabbable", tooltiptext: "Switch"}],
        ["tabbox", {id:"SM_tabbox", flex: "1", handleCtrlPageUpDown: false, handleCtrlTab: false},
          ["tabs", {id: "SM_tabs" , index: this.selectedIndex},
            ["tab", {id: "SM_tab0", label: this.TAB0_LABEL, class: "SM_tab"}],
            ["tab", {id: "SM_tab1", label: this.TAB1_LABEL, class: "SM_tab"}],
            ["tab", {id: "SM_tab2", label: this.TAB2_LABEL, class: "SM_tab"}],
            ["tab", {id: "SM_tab3", label: this.TAB3_LABEL, class: "SM_tab"}],
            ["tab", {id: "SM_tab4", label: this.TAB4_LABEL, class: "SM_tab"}],
            ["tab", {id: "SM_tab5", label: this.TAB5_LABEL, class: "SM_tab"}],
            ["hbox", {id: "nav_button_container"}],
            ["toolbarbutton", {id:"downloads-button", class:"toolbarbutton-1 chromeclass-toolbar-additional", badged:"true", key:"key_openDownloads", onmousedown:"DownloadsIndicatorView.onCommand(event);", onkeypress:"DownloadsIndicatorView.onCommand(event);", ondrop:"DownloadsIndicatorView.onDrop(event);", ondragover:"DownloadsIndicatorView.onDragOver(event);", ondragenter:"DownloadsIndicatorView.onDragOver(event);", removable:"true", overflows:"false", tooltip:"dynamic-shortcut-tooltip", indicator:"true"} ,
                ["box", {id:"downloads-indicator-anchor", consumeanchor:"downloads-button"},
                  ["image", {id:"downloads-indicator-icon"}]],
                ["box", {id:"downloads-indicator-progress-outer", class:"toolbarbutton-animatable-box"},
                  ["box", {id:"downloads-indicator-progress-inner"}]],
                ["box" , {id:"downloads-indicator-start-box", class:"toolbarbutton-animatable-box" },
                  ["image", {id:"downloads-indicator-start-image" , class:"toolbarbutton-animatable-image"}]],
                ["box", {id:"downloads-indicator-finish-box" , class:"toolbarbutton-animatable-box" },
                  ["image", {id:"downloads-indicator-finish-image", class:"toolbarbutton-animatable-image"}]]
              
            ]
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
            ],
            ["tabpanel", {id: "SM_tab3-container", orient: "vertical", flex: "1"},
              ["browser", {id: "SM_tab3-browser", flex: "1", autoscroll: "false", src: this.TAB3_SRC}]
            ],
            ["tabpanel", {id: "SM_tab4-container", orient: "vertical", flex: "1"},
              ["browser", {id: "SM_tab4-browser", flex: "1", autoscroll: "false", src: this.TAB4_SRC}]
            ],
            ["tabpanel", {id: "SM_tab5-container", orient: "vertical", flex: "1"},
            ["browser", {id: "SM_tab5-browser", flex: "1", autoscroll: "false", src: this.TAB5_SRC}]
            ]
          ],
        ],
      ];
    let sidebar = document.getElementById("sidebar-box");
    sidebar.parentNode.insertBefore(this.jsonToDOM(template, document, {}), sidebar);

    template =
      ["splitter", {id: "SM_splitter", state: "open", collapse: this.SM_RIGHT ? "after" :"before", resizebefore:"sibling", resizeafter:"none"},
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
    let tb3 = document.getElementById("SM_tab3");
    let tb4 = document.getElementById("SM_tab4");
    let tb5 = document.getElementById("SM_tab5");

    tb0.parentNode.insertBefore(tb0, tb1);
    tb0.parentNode.insertBefore(tb1, tb2);
    tb0.parentNode.insertBefore(tb2, tb3);
    tb0.parentNode.insertBefore(tb3, tb4);
    tb0.parentNode.insertBefore(tb4, tb5);

    document.getElementById("SM_tabs").selectedIndex = index;
    let closebutton = document.getElementById("SM_closeButton");
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

  },

  onSelect: function(event) {
    let aIndex = document.getElementById("SM_tabpanels").selectedIndex;
    this.prefs.setIntPref(this.kSM_lastSelectedTabIndex, aIndex);
    width = this.getPref(this.kSM_lastSelectedTabWidth + aIndex, "int", this.SM_WIDTH);
    document.getElementById("SM_toolbox").setAttribute("style", "width:" + width + "px");
    resizeUrlbar();
  },
  
  toggle: function(forceopen) {
    this.Button = document.getElementById("SM_Button");
    this.ToolBox = document.getElementById("SM_toolbox")
    if(this.Button){
      if (!this.Button.hasAttribute("checked") || forceopen) {
        this.Button.setAttribute("checked", true);
        this.ToolBox.collapsed = false;
        this.Splitter.collapsed= false;
        let index = this.getPref(this.kSM_lastSelectedTabIndex, "int", 0);
        document.getElementById("SM_tabs").selectedIndex = index;
        width = this.getPref(this.kSM_lastSelectedTabWidth + index, "int", this.SM_WIDTH);
        document.getElementById("SM_toolbox").setAttribute("style", "width:" + width + "px");
        this.prefs.setBoolPref(this.kSM_Open, true)
        addEventListener("resize", this, false);
      } else {
        this.close();
      }
    }
  },
  buttonPress: function() {
    this.prefs.setIntPref(this.kSM_lastSelectedTabWidth + 0, this.TAB_SMALL_DEFAULT_WIDTH);
    this.prefs.setIntPref(this.kSM_lastSelectedTabWidth + 1, this.TAB_SMALL_DEFAULT_WIDTH);
    this.prefs.setIntPref(this.kSM_lastSelectedTabWidth + 3, this.TAB_SMALL_DEFAULT_WIDTH);
    this.prefs.setIntPref(this.kSM_lastSelectedTabWidth + 2, this.TAB_SMALL_DEFAULT_WIDTH);
    this.prefs.setIntPref(this.kSM_lastSelectedTabWidth + 4, this.TAB_BIG_DEFAULT_WIDTH);
    this.prefs.setIntPref(this.kSM_lastSelectedTabWidth + 5, this.TAB_BIG_DEFAULT_WIDTH);
    this.toggle();
  },
  close: function() {
    removeEventListener("resize", this, false);
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

 // wait until components are initialized so we can access SidebarUI
 if (gBrowserInit.delayedStartupFinished) {
    initAll();
    } else {
        let delayedListener = (subject, topic) => {
            if (topic == "browser-delayed-startup-finished" && subject == window) {
                Services.obs.removeObserver(delayedListener, topic);
                initAll();
            }
        };
        Services.obs.addObserver(delayedListener, "browser-delayed-startup-finished");
}

function initAll(){
    SidebarModoki.init();
     allowAddonsPageOpen();
     var splitter = document.getElementById("SM_splitter");
     // splitter.addEventListener('drag', resizeUrlbar);
     window.addEventListener('load',resizeUrlbar);
     // window.addEventListener('resize', resizeUrlbar);
     setTimeout(resizeUrlbar,1400);
}

function  removeEMping(){
  Services.obs.removeObserver(document.getElementById("SM_tab3-browser").contentWindow.gViewController, "EM-ping"); 
  Services.obs.removeObserver(removeEMping, "EM-loaded");

}
function allowAddonsPageOpen() {
   Services.obs.addObserver(removeEMping, "EM-loaded");
}