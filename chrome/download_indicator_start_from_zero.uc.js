  Object.defineProperty(DownloadsIndicatorView,"percentComplete",{ set(aValue) {

    if (!this._operational) {
      return;
    }
    aValue = Math.min(100, aValue);
    if (this._percentComplete !== aValue) {
      // Initial progress may fire before the start event gets to us.
      // To avoid flashing, trip the start event first.
      if (this._percentComplete < 0 && aValue >= 0) {
        this.showEventNotification("start");
      }
      this._percentComplete = aValue;
      this._refreshAttention();
      if (this._progressRaf) {
        cancelAnimationFrame(this._progressRaf);
        delete this._progressRaf;
      }
      this._progressRaf = requestAnimationFrame(() => {
        // indeterminate downloads (unknown content-length) will show up as aValue = 0
        if (this._percentComplete >= 0) {
          this.indicator.setAttribute("progress", "true");
          // For arrow type only: Set the % complete on the pie-chart.
          // We use a minimum of 5% to ensure something is always visible
          this.indicator.style.setProperty(
            "--download-progress-pcent",
            `${Math.max(0, this._percentComplete)}%`
          );
        } else {
          this.indicator.removeAttribute("progress");
          this.indicator.style.setProperty("--download-progress-pcent", "0%");
        }
      });
    }


  }})

