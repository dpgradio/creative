import {detectApp} from "./hybrid";
import {hybrid} from "../index";
import jwtDecode from "jwt-decode";

window.dataLayer = window.dataLayer || [];

let virtualPageParams = {
  ...window.location,
  platform: detectApp(window.appVersion || navigator.userAgent).platform
}

export function setVirtualPageViewParams(params) {
  virtualPageParams = {
    ...virtualPageParams,
    ...params
  }
}

hybrid.on("appLoad", ({ radioToken }) => {
  if (radioToken) {
    const { uid } = jwtDecode(radioToken);

    setVirtualPageViewParams({
      user: {
        account_id: uid,
        loggedIn: true
      }
    })
  }

  window.dataLayer.push({
    event: "VirtualPageView",
    virtualPageURL: virtualPageParams
  });
});

hybrid.on("authenticated", ({ radioToken }) => {
  if (radioToken) {
    const { uid } = jwtDecode(radioToken);

    window.dataLayer.push({
      event: "account_id",
      user: {
        account_id: uid,
        loggedIn: true
      }
    });
  }
});
