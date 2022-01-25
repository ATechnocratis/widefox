
    BrowserUIUtils.trimURL = function trimURL(aURL) {
      let urlString = this.removeSingleTrailingSlashFromURL(aURL);
      try {
        const url = new URL(urlString);
        if (/(http|https):/.test(url.protocol)) {
          if (url.host.startsWith("www")) {
            url.host = url.host.slice(4);
          }
          return url.host;
        } else {
          return urlString;
        }
      } catch (err) {
        return urlString;
      }
  }
  XULBrowserWindow.setOverLink = function setOverLink(url) {
  if (url) {
    url = Services.textToSubURI.unEscapeURIForUI(url);

    // Encode bidirectional formatting characters.
    // (RFC 3987 sections 3.2 and 4.1 paragraph 6)
    url = url.replace(
      /[\u200e\u200f\u202a\u202b\u202c\u202d\u202e]/g,
      encodeURIComponent
    );
  }

  this.overLink = url;
  LinkTargetDisplay.update();
}