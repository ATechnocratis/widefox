// Open sidebarModoki download panel instead of default panel

(async function () {

    async function init() {
    DownloadsCommon.getData(window)._notifyDownloadEvent = function (aType) {
    DownloadsCommon.log(
      "Attempting to notify that a new download has started or finished."
    );

    // Show the panel in the most recent browser window, if present.
    let browserWin = BrowserWindowTracker.getTopWindow({
      private: this._isPrivate,
    });
    if (!browserWin) {
      return;
    }

    let shouldOpenDownloadsPanel =
      aType == "start" &&
      Services.prefs.getBoolPref(
        "browser.download.improvements_to_download_panel"
      ) &&
      DownloadsCommon.summarizeDownloads(this._downloads).numDownloading <= 1;

    if (
      this.panelHasShownBefore &&
      aType != "error" &&
      !shouldOpenDownloadsPanel
    ) {
      // For new downloads after the first one, don't show the panel
      // automatically, but provide a visible notification in the topmost
      // browser window, if the status indicator is already visible.
      DownloadsCommon.log("Showing new download notification.");
      browserWin.DownloadsIndicatorView.showEventNotification(aType);
      return;
    }
    this.panelHasShownBefore = true;
    // browserWin.DownloadsPanel.showPanel();
    width = SidebarModoki.getPref(SidebarModoki.kSM_lastSelectedTabWidth + 1, "int", SidebarModoki.SM_WIDTH);
    document.getElementById("SM_toolbox").width = width;
    document.getElementById("SM_tabs").selectedIndex = 1;
    document.getElementById("SM_tab1-browser").contentDocument.getElementById("downloadsListBox").firstChild.click();
    };

       
    }

    if (gBrowserInit.delayedStartupFinished) {
        init();
    } else {
        let delayedListener = (subject, topic) => {
            if (topic == "browser-delayed-startup-finished" && subject == window) {
                Services.obs.removeObserver(delayedListener, topic);
                init();
            }
        };
        Services.obs.addObserver(delayedListener, "browser-delayed-startup-finished");
    }
})();
