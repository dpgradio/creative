import hybrid from "./hybrid";
import jwtDecode from "jwt-decode";

window.dataLayer = window.dataLayer || [];

let virtualPageParams = {
  ...window.location,
  platform: hybrid.appInfo.platform
}

function setVirtualPageViewParams(params) {
  virtualPageParams = {
    ...virtualPageParams,
    ...params
  }

  if (hybrid.appInfo.platform === 'browser') {
    pushVirtualPageViewEvent()
  }
}

function pushVirtualPageViewEvent() {
  window.dataLayer.push({
    event: "VirtualPageView",
    virtualPageURL: virtualPageParams
  });
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

  pushVirtualPageViewEvent()
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

export default {
  setVirtualPageViewParams
}
