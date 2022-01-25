//Original source  https://github.com/Endor8/userChrome.js/blob/master/floatingscrollbar/FloatingScrollbar.uc.js

(function() {
    var css = `
    
    :not(select):not(hbox) > scrollbar {
        -moz-appearance: none!important;
        position: relative;
        background-color: transparent;
        background-image: none;
        z-index: 2147483647;
    }
    :not(select):not(hbox) > scrollbar[orient = "vertical"] {
        -moz-margin-start: -12px;
        min-width: 12px;
        max-width: 12px;
    }
    :not(select):not(hbox) > scrollbar[orient = "vertical"] thumb {
        border-right: 2px solid rgba(93, 72, 91, 0.5);
        border-radius: 0px;
        transition: border 0.3s ease-in;
        min-height: 9px;
        max-height: 9px;
        min-height: 20px;
    }
    :not(select):not(hbox) > scrollbar[orient = "horizontal"] {
        height: 12px!important;
        margin-top: -12px;
    }
    :not(select):not(hbox) > scrollbar[orient = "horizontal"] thumb {
        border-bottom:2px solid rgba(93, 72, 91, 0.5);
        transition: border 0.3s ease-in;
        border-radius: 0px;

    }
    :not(select):not(hbox) > scrollbar thumb {
    
        -moz-appearance: none!important;
        -webkit-transform-style: preserve-3d;
        -webkit-backface-visibility: hidden;
         pointer-events: auto;
         background-color: transparent;
    }
    :not(select):not(hbox) > scrollbar:hover thumb {
        -webkit-transform-style: preserve-3d;
        -webkit-backface-visibility: hidden;
        border-width: 13px;
        border-color:rgba(93, 72, 91, 0.8);
        transition: border 0s linear;
        border-radius: 3px!important;

    }
    :not(select):not(hbox) > scrollbar thumb:active {
                border-radius: 3px!important;
        border-width: 17px;
        border-color:rgba(103, 72, 91, 1);
        transition: border 0s linear;
        -webkit-transform-style: preserve-3d;
        -webkit-backface-visibility: hidden;

    }
    :not(select):not(hbox) > scrollbar scrollbarbutton, :not(select):not(hbox) > scrollbar gripper {
        display: none;
    }
    `,
        sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService),
        uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
})();