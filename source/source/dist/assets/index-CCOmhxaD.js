import { a as resetComponent, r as reactExports, d as ConfigContext, e as classNames, g as devUseWarning, R as React, _ as _toConsumableArray, C as ConfigProvider, i as globalConfig } from "./index-CUErrqgd.js";
import { r as render } from "./render-uL5zGIDv.js";
import { N as Notify, u as useNotification, a as NotificationProvider, A as AppConfigContext } from "./context-CN2GVsG0.js";
import { R as RefIcon$1, a as RefIcon$3 } from "./ExclamationCircleFilled-CXyczA-G.js";
import { g as genStyleHooks, m as merge, R as RefIcon$2 } from "./asyncToGenerator-Bn7YJjF8.js";
import { R as RefIcon$4 } from "./InfoCircleFilled-6TjWreYB.js";
import { R as RefIcon } from "./LoadingOutlined-s4PR_g90.js";
import { C as CONTAINER_MAX_OFFSET, K as Keyframe, u as useCSSVarCls, R as RefIcon$5 } from "./useZIndex-BReSjmbj.js";
const genMessageStyle = (token) => {
  const {
    componentCls,
    iconCls,
    boxShadow,
    colorText,
    colorSuccess,
    colorError,
    colorWarning,
    colorInfo,
    fontSizeLG,
    motionEaseInOutCirc,
    motionDurationSlow,
    marginXS,
    paddingXS,
    borderRadiusLG,
    zIndexPopup,
    // Custom token
    contentPadding,
    contentBg
  } = token;
  const noticeCls = `${componentCls}-notice`;
  const messageMoveIn = new Keyframe("MessageMoveIn", {
    "0%": {
      padding: 0,
      transform: "translateY(-100%)",
      opacity: 0
    },
    "100%": {
      padding: paddingXS,
      transform: "translateY(0)",
      opacity: 1
    }
  });
  const messageMoveOut = new Keyframe("MessageMoveOut", {
    "0%": {
      maxHeight: token.height,
      padding: paddingXS,
      opacity: 1
    },
    "100%": {
      maxHeight: 0,
      padding: 0,
      opacity: 0
    }
  });
  const noticeStyle = {
    padding: paddingXS,
    textAlign: "center",
    [`${componentCls}-custom-content > ${iconCls}`]: {
      verticalAlign: "text-bottom",
      marginInlineEnd: marginXS,
      // affected by ltr or rtl
      fontSize: fontSizeLG
    },
    [`${noticeCls}-content`]: {
      display: "inline-block",
      padding: contentPadding,
      background: contentBg,
      borderRadius: borderRadiusLG,
      boxShadow,
      pointerEvents: "all"
    },
    [`${componentCls}-success > ${iconCls}`]: {
      color: colorSuccess
    },
    [`${componentCls}-error > ${iconCls}`]: {
      color: colorError
    },
    [`${componentCls}-warning > ${iconCls}`]: {
      color: colorWarning
    },
    [`${componentCls}-info > ${iconCls},
      ${componentCls}-loading > ${iconCls}`]: {
      color: colorInfo
    }
  };
  return [
    // ============================ Holder ============================
    {
      [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
        color: colorText,
        position: "fixed",
        top: marginXS,
        width: "100%",
        pointerEvents: "none",
        zIndex: zIndexPopup,
        [`${componentCls}-move-up`]: {
          animationFillMode: "forwards"
        },
        [`
        ${componentCls}-move-up-appear,
        ${componentCls}-move-up-enter
      `]: {
          animationName: messageMoveIn,
          animationDuration: motionDurationSlow,
          animationPlayState: "paused",
          animationTimingFunction: motionEaseInOutCirc
        },
        [`
        ${componentCls}-move-up-appear${componentCls}-move-up-appear-active,
        ${componentCls}-move-up-enter${componentCls}-move-up-enter-active
      `]: {
          animationPlayState: "running"
        },
        [`${componentCls}-move-up-leave`]: {
          animationName: messageMoveOut,
          animationDuration: motionDurationSlow,
          animationPlayState: "paused",
          animationTimingFunction: motionEaseInOutCirc
        },
        [`${componentCls}-move-up-leave${componentCls}-move-up-leave-active`]: {
          animationPlayState: "running"
        },
        "&-rtl": {
          direction: "rtl",
          span: {
            direction: "rtl"
          }
        }
      })
    },
    // ============================ Notice ============================
    {
      [componentCls]: {
        [`${noticeCls}-wrapper`]: Object.assign({}, noticeStyle)
      }
    },
    // ============================= Pure =============================
    {
      [`${componentCls}-notice-pure-panel`]: Object.assign(Object.assign({}, noticeStyle), {
        padding: 0,
        textAlign: "start"
      })
    }
  ];
};
const prepareComponentToken = (token) => ({
  zIndexPopup: token.zIndexPopupBase + CONTAINER_MAX_OFFSET + 10,
  contentBg: token.colorBgElevated,
  contentPadding: `${(token.controlHeightLG - token.fontSize * token.lineHeight) / 2}px ${token.paddingSM}px`
});
const useStyle = genStyleHooks("Message", (token) => {
  const combinedToken = merge(token, {
    height: 150
  });
  return [genMessageStyle(combinedToken)];
}, prepareComponentToken);
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const TypeIcon = {
  info: /* @__PURE__ */ reactExports.createElement(RefIcon$4, null),
  success: /* @__PURE__ */ reactExports.createElement(RefIcon$3, null),
  error: /* @__PURE__ */ reactExports.createElement(RefIcon$2, null),
  warning: /* @__PURE__ */ reactExports.createElement(RefIcon$1, null),
  loading: /* @__PURE__ */ reactExports.createElement(RefIcon, null)
};
const PureContent = (_ref) => {
  let {
    prefixCls,
    type,
    icon,
    children
  } = _ref;
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(`${prefixCls}-custom-content`, `${prefixCls}-${type}`)
  }, icon || TypeIcon[type], /* @__PURE__ */ reactExports.createElement("span", null, children));
};
const PurePanel = (props) => {
  const {
    prefixCls: staticPrefixCls,
    className,
    type,
    icon,
    content
  } = props, restProps = __rest$1(props, ["prefixCls", "className", "type", "icon", "content"]);
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = staticPrefixCls || getPrefixCls("message");
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(Notify, Object.assign({}, restProps, {
    prefixCls,
    className: classNames(className, hashId, `${prefixCls}-notice-pure-panel`, cssVarCls, rootCls),
    eventKey: "pure",
    duration: null,
    content: /* @__PURE__ */ reactExports.createElement(PureContent, {
      prefixCls,
      type,
      icon
    }, content)
  })));
};
function getMotion(prefixCls, transitionName) {
  return {
    motionName: transitionName !== null && transitionName !== void 0 ? transitionName : `${prefixCls}-move-up`
  };
}
function wrapPromiseFn(openFn) {
  let closeFn;
  const closePromise = new Promise((resolve) => {
    closeFn = openFn(() => {
      resolve(true);
    });
  });
  const result = () => {
    closeFn === null || closeFn === void 0 ? void 0 : closeFn();
  };
  result.then = (filled, rejected) => closePromise.then(filled, rejected);
  result.promise = closePromise;
  return result;
}
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const DEFAULT_OFFSET = 8;
const DEFAULT_DURATION = 3;
const Wrapper = (_ref) => {
  let {
    children,
    prefixCls
  } = _ref;
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(NotificationProvider, {
    classNames: {
      list: classNames(hashId, cssVarCls, rootCls)
    }
  }, children));
};
const renderNotifications = (node, _ref2) => {
  let {
    prefixCls,
    key
  } = _ref2;
  return /* @__PURE__ */ reactExports.createElement(Wrapper, {
    prefixCls,
    key
  }, node);
};
const Holder = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    top,
    prefixCls: staticPrefixCls,
    getContainer: staticGetContainer,
    maxCount,
    duration = DEFAULT_DURATION,
    rtl,
    transitionName,
    onAllRemoved
  } = props;
  const {
    getPrefixCls,
    getPopupContainer,
    message: message2,
    direction
  } = reactExports.useContext(ConfigContext);
  const prefixCls = staticPrefixCls || getPrefixCls("message");
  const getStyle = () => ({
    left: "50%",
    transform: "translateX(-50%)",
    top: top !== null && top !== void 0 ? top : DEFAULT_OFFSET
  });
  const getClassName = () => classNames({
    [`${prefixCls}-rtl`]: rtl !== null && rtl !== void 0 ? rtl : direction === "rtl"
  });
  const getNotificationMotion = () => getMotion(prefixCls, transitionName);
  const mergedCloseIcon = /* @__PURE__ */ reactExports.createElement("span", {
    className: `${prefixCls}-close-x`
  }, /* @__PURE__ */ reactExports.createElement(RefIcon$5, {
    className: `${prefixCls}-close-icon`
  }));
  const [api, holder] = useNotification({
    prefixCls,
    style: getStyle,
    className: getClassName,
    motion: getNotificationMotion,
    closable: false,
    closeIcon: mergedCloseIcon,
    duration,
    getContainer: () => (staticGetContainer === null || staticGetContainer === void 0 ? void 0 : staticGetContainer()) || (getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer()) || document.body,
    maxCount,
    onAllRemoved,
    renderNotifications
  });
  reactExports.useImperativeHandle(ref, () => Object.assign(Object.assign({}, api), {
    prefixCls,
    message: message2
  }));
  return holder;
});
let keyIndex = 0;
function useInternalMessage(messageConfig) {
  const holderRef = reactExports.useRef(null);
  devUseWarning();
  const wrapAPI = reactExports.useMemo(() => {
    const close = (key) => {
      var _a;
      (_a = holderRef.current) === null || _a === void 0 ? void 0 : _a.close(key);
    };
    const open2 = (config) => {
      if (!holderRef.current) {
        const fakeResult = () => {
        };
        fakeResult.then = () => {
        };
        return fakeResult;
      }
      const {
        open: originOpen,
        prefixCls,
        message: message2
      } = holderRef.current;
      const noticePrefixCls = `${prefixCls}-notice`;
      const {
        content,
        icon,
        type,
        key,
        className,
        style,
        onClose
      } = config, restConfig = __rest(config, ["content", "icon", "type", "key", "className", "style", "onClose"]);
      let mergedKey = key;
      if (mergedKey === void 0 || mergedKey === null) {
        keyIndex += 1;
        mergedKey = `antd-message-${keyIndex}`;
      }
      return wrapPromiseFn((resolve) => {
        originOpen(Object.assign(Object.assign({}, restConfig), {
          key: mergedKey,
          content: /* @__PURE__ */ reactExports.createElement(PureContent, {
            prefixCls,
            type,
            icon
          }, content),
          placement: "top",
          className: classNames(type && `${noticePrefixCls}-${type}`, className, message2 === null || message2 === void 0 ? void 0 : message2.className),
          style: Object.assign(Object.assign({}, message2 === null || message2 === void 0 ? void 0 : message2.style), style),
          onClose: () => {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            resolve();
          }
        }));
        return () => {
          close(mergedKey);
        };
      });
    };
    const destroy2 = (key) => {
      var _a;
      if (key !== void 0) {
        close(key);
      } else {
        (_a = holderRef.current) === null || _a === void 0 ? void 0 : _a.destroy();
      }
    };
    const clone = {
      open: open2,
      destroy: destroy2
    };
    const keys = ["info", "success", "warning", "error", "loading"];
    keys.forEach((type) => {
      const typeOpen2 = (jointContent, duration, onClose) => {
        let config;
        if (jointContent && typeof jointContent === "object" && "content" in jointContent) {
          config = jointContent;
        } else {
          config = {
            content: jointContent
          };
        }
        let mergedDuration;
        let mergedOnClose;
        if (typeof duration === "function") {
          mergedOnClose = duration;
        } else {
          mergedDuration = duration;
          mergedOnClose = onClose;
        }
        const mergedConfig = Object.assign(Object.assign({
          onClose: mergedOnClose,
          duration: mergedDuration
        }, config), {
          type
        });
        return open2(mergedConfig);
      };
      clone[type] = typeOpen2;
    });
    return clone;
  }, []);
  return [wrapAPI, /* @__PURE__ */ reactExports.createElement(Holder, Object.assign({
    key: "message-holder"
  }, messageConfig, {
    ref: holderRef
  }))];
}
function useMessage(messageConfig) {
  return useInternalMessage(messageConfig);
}
let message = null;
let act = (callback) => callback();
let taskQueue = [];
let defaultGlobalConfig = {};
function getGlobalContext() {
  const {
    getContainer,
    duration,
    rtl,
    maxCount,
    top
  } = defaultGlobalConfig;
  const mergedContainer = (getContainer === null || getContainer === void 0 ? void 0 : getContainer()) || document.body;
  return {
    getContainer: () => mergedContainer,
    duration,
    rtl,
    maxCount,
    top
  };
}
const GlobalHolder = /* @__PURE__ */ React.forwardRef((props, ref) => {
  const {
    messageConfig,
    sync
  } = props;
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = defaultGlobalConfig.prefixCls || getPrefixCls("message");
  const appConfig = reactExports.useContext(AppConfigContext);
  const [api, holder] = useInternalMessage(Object.assign(Object.assign(Object.assign({}, messageConfig), {
    prefixCls
  }), appConfig.message));
  React.useImperativeHandle(ref, () => {
    const instance = Object.assign({}, api);
    Object.keys(instance).forEach((method) => {
      instance[method] = function() {
        sync();
        return api[method].apply(api, arguments);
      };
    });
    return {
      instance,
      sync
    };
  });
  return holder;
});
const GlobalHolderWrapper = /* @__PURE__ */ React.forwardRef((_, ref) => {
  const [messageConfig, setMessageConfig] = React.useState(getGlobalContext);
  const sync = () => {
    setMessageConfig(getGlobalContext);
  };
  React.useEffect(sync, []);
  const global = globalConfig();
  const rootPrefixCls = global.getRootPrefixCls();
  const rootIconPrefixCls = global.getIconPrefixCls();
  const theme = global.getTheme();
  const dom = /* @__PURE__ */ React.createElement(GlobalHolder, {
    ref,
    sync,
    messageConfig
  });
  return /* @__PURE__ */ React.createElement(ConfigProvider, {
    prefixCls: rootPrefixCls,
    iconPrefixCls: rootIconPrefixCls,
    theme
  }, global.holderRender ? global.holderRender(dom) : dom);
});
function flushNotice() {
  if (!message) {
    const holderFragment = document.createDocumentFragment();
    const newMessage = {
      fragment: holderFragment
    };
    message = newMessage;
    act(() => {
      render(/* @__PURE__ */ React.createElement(GlobalHolderWrapper, {
        ref: (node) => {
          const {
            instance,
            sync
          } = node || {};
          Promise.resolve().then(() => {
            if (!newMessage.instance && instance) {
              newMessage.instance = instance;
              newMessage.sync = sync;
              flushNotice();
            }
          });
        }
      }), holderFragment);
    });
    return;
  }
  if (!message.instance) {
    return;
  }
  taskQueue.forEach((task) => {
    const {
      type,
      skipped
    } = task;
    if (!skipped) {
      switch (type) {
        case "open": {
          act(() => {
            const closeFn = message.instance.open(Object.assign(Object.assign({}, defaultGlobalConfig), task.config));
            closeFn === null || closeFn === void 0 ? void 0 : closeFn.then(task.resolve);
            task.setCloseFn(closeFn);
          });
          break;
        }
        case "destroy":
          act(() => {
            message === null || message === void 0 ? void 0 : message.instance.destroy(task.key);
          });
          break;
        // Other type open
        default: {
          act(() => {
            var _message$instance;
            const closeFn = (_message$instance = message.instance)[type].apply(_message$instance, _toConsumableArray(task.args));
            closeFn === null || closeFn === void 0 ? void 0 : closeFn.then(task.resolve);
            task.setCloseFn(closeFn);
          });
        }
      }
    }
  });
  taskQueue = [];
}
function setMessageGlobalConfig(config) {
  defaultGlobalConfig = Object.assign(Object.assign({}, defaultGlobalConfig), config);
  act(() => {
    var _a;
    (_a = message === null || message === void 0 ? void 0 : message.sync) === null || _a === void 0 ? void 0 : _a.call(message);
  });
}
function open(config) {
  const result = wrapPromiseFn((resolve) => {
    let closeFn;
    const task = {
      type: "open",
      config,
      resolve,
      setCloseFn: (fn) => {
        closeFn = fn;
      }
    };
    taskQueue.push(task);
    return () => {
      if (closeFn) {
        act(() => {
          closeFn();
        });
      } else {
        task.skipped = true;
      }
    };
  });
  flushNotice();
  return result;
}
function typeOpen(type, args) {
  const result = wrapPromiseFn((resolve) => {
    let closeFn;
    const task = {
      type,
      args,
      resolve,
      setCloseFn: (fn) => {
        closeFn = fn;
      }
    };
    taskQueue.push(task);
    return () => {
      if (closeFn) {
        act(() => {
          closeFn();
        });
      } else {
        task.skipped = true;
      }
    };
  });
  flushNotice();
  return result;
}
function destroy(key) {
  taskQueue.push({
    type: "destroy",
    key
  });
  flushNotice();
}
const methods = ["success", "info", "warning", "error", "loading"];
const baseStaticMethods = {
  open,
  destroy,
  config: setMessageGlobalConfig,
  useMessage,
  _InternalPanelDoNotUseOrYouWillBeFired: PurePanel
};
const staticMethods = baseStaticMethods;
methods.forEach((type) => {
  staticMethods[type] = function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return typeOpen(type, args);
  };
});
export {
  staticMethods as s
};
