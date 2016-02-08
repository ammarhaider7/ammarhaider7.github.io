!function(e) {
  "use strict";
  e.module("angulartics.adobe.analytics", ["angulartics"]).config(["$analyticsProvider", function(e) {
    e.settings.trackRelativePath = !0, e.registerPageTrackAdobe(function(e) {
      window.s_ce && s_ce.t({
        pageName: e
      })
    }), e.registerEventTrackAdobe(function(e) {
      window.s_ce && e && ("DOWNLOAD" === e.toUpperCase() ? s_ce.tl(this, "d", e) : "EXIT" === e.toUpperCase() ? s_ce.tl(this, "e", e) : s_ce.tl(this, "o", e))
    })
  }])
}(angular);
