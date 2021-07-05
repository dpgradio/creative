const eventSubscriptions = {};
const eventSingleRunSubscriptions = {};

export default {
  install(Vue) {
    const hybrid = this;

    Vue.directive("external", {
      bind(el, { modifiers: { inApp } }) {
        inApp = !!inApp; // Force false / true

        el.addEventListener("click", function(e) {
          const url = el.getAttribute("href");
          hybrid.call("navigateTo", { url, inApp });
          e.preventDefault();
        });
      }
    });
  },
  on(method, callback) {
    if (!eventSubscriptions[method]) {
      eventSubscriptions[method] = [];
    }
    eventSubscriptions[method].push(callback);
  },
  one(method, callback) {
    if (!eventSingleRunSubscriptions[method]) {
      eventSingleRunSubscriptions[method] = [];
    }
    eventSingleRunSubscriptions[method].push(callback);
  },
  createTrigger(method) {
    return args => {
      if (eventSubscriptions[method]) {
        eventSubscriptions[method].forEach(callback => {
          callback(args);
        });
      }

      if (eventSingleRunSubscriptions[method]) {
        var callback;
        while ((callback = eventSingleRunSubscriptions[method].pop())) {
          callback(args);
        }
      }
    };
  },
  call(method, options = {}) {
    if (window.webkit && window.webkit.messageHandlers) {
      const handler = window.webkit.messageHandlers[method];
      handler && handler.postMessage(options);
    } else if (window.Android) {
      // Note: It's important to either directly call window.Android[method], or bind it with
      //   const ref = window.android[method].bind(Android)
      //   ref()
      // ref: https://bugs.chromium.org/p/chromium/issues/detail?id=514628
      window.Android[method](JSON.stringify(options));
    } else {
      console.log(method, options);
      // Do nothing for now
    }
  }
};