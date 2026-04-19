import { r as reactExports, p as _slicedToArray, s as _extends, e as classNames, q as _defineProperty, R as React, y as _typeof, G as CSSMotionList, o as _objectWithoutProperties, H as _objectSpread2, _ as _toConsumableArray, J as reactDomExports } from "./index-CUErrqgd.js";
import { a as KeyCode } from "./useZIndex-BReSjmbj.js";
var Notify = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var prefixCls = props.prefixCls, style = props.style, className = props.className, _props$duration = props.duration, duration = _props$duration === void 0 ? 4.5 : _props$duration, eventKey = props.eventKey, content = props.content, closable = props.closable, _props$closeIcon = props.closeIcon, closeIcon = _props$closeIcon === void 0 ? "x" : _props$closeIcon, divProps = props.props, onClick = props.onClick, onNoticeClose = props.onNoticeClose, times = props.times, forcedHovering = props.hovering;
  var _React$useState = reactExports.useState(false), _React$useState2 = _slicedToArray(_React$useState, 2), hovering = _React$useState2[0], setHovering = _React$useState2[1];
  var mergedHovering = forcedHovering || hovering;
  var onInternalClose = function onInternalClose2() {
    onNoticeClose(eventKey);
  };
  var onCloseKeyDown = function onCloseKeyDown2(e) {
    if (e.key === "Enter" || e.code === "Enter" || e.keyCode === KeyCode.ENTER) {
      onInternalClose();
    }
  };
  reactExports.useEffect(function() {
    if (!mergedHovering && duration > 0) {
      var timeout = setTimeout(function() {
        onInternalClose();
      }, duration * 1e3);
      return function() {
        clearTimeout(timeout);
      };
    }
  }, [duration, mergedHovering, times]);
  var noticePrefixCls = "".concat(prefixCls, "-notice");
  return /* @__PURE__ */ reactExports.createElement("div", _extends({}, divProps, {
    ref,
    className: classNames(noticePrefixCls, className, _defineProperty({}, "".concat(noticePrefixCls, "-closable"), closable)),
    style,
    onMouseEnter: function onMouseEnter(e) {
      var _divProps$onMouseEnte;
      setHovering(true);
      divProps === null || divProps === void 0 || (_divProps$onMouseEnte = divProps.onMouseEnter) === null || _divProps$onMouseEnte === void 0 || _divProps$onMouseEnte.call(divProps, e);
    },
    onMouseLeave: function onMouseLeave(e) {
      var _divProps$onMouseLeav;
      setHovering(false);
      divProps === null || divProps === void 0 || (_divProps$onMouseLeav = divProps.onMouseLeave) === null || _divProps$onMouseLeav === void 0 || _divProps$onMouseLeav.call(divProps, e);
    },
    onClick
  }), /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(noticePrefixCls, "-content")
  }, content), closable && /* @__PURE__ */ reactExports.createElement("a", {
    tabIndex: 0,
    className: "".concat(noticePrefixCls, "-close"),
    onKeyDown: onCloseKeyDown,
    onClick: function onClick2(e) {
      e.preventDefault();
      e.stopPropagation();
      onInternalClose();
    }
  }, closeIcon));
});
var NotificationContext = /* @__PURE__ */ React.createContext({});
var NotificationProvider = function NotificationProvider2(_ref) {
  var children = _ref.children, classNames2 = _ref.classNames;
  return /* @__PURE__ */ React.createElement(NotificationContext.Provider, {
    value: {
      classNames: classNames2
    }
  }, children);
};
var DEFAULT_OFFSET = 8;
var DEFAULT_THRESHOLD = 3;
var DEFAULT_GAP = 16;
var useStack = function useStack2(config) {
  var result = {
    offset: DEFAULT_OFFSET,
    threshold: DEFAULT_THRESHOLD,
    gap: DEFAULT_GAP
  };
  if (config && _typeof(config) === "object") {
    var _config$offset, _config$threshold, _config$gap;
    result.offset = (_config$offset = config.offset) !== null && _config$offset !== void 0 ? _config$offset : DEFAULT_OFFSET;
    result.threshold = (_config$threshold = config.threshold) !== null && _config$threshold !== void 0 ? _config$threshold : DEFAULT_THRESHOLD;
    result.gap = (_config$gap = config.gap) !== null && _config$gap !== void 0 ? _config$gap : DEFAULT_GAP;
  }
  return [!!config, result];
};
var _excluded$1 = ["className", "style", "classNames", "styles"];
var NoticeList = function NoticeList2(props) {
  var _clsx;
  var configList = props.configList, placement = props.placement, prefixCls = props.prefixCls, className = props.className, style = props.style, motion = props.motion, onAllNoticeRemoved = props.onAllNoticeRemoved, onNoticeClose = props.onNoticeClose, stackConfig = props.stack;
  var _useContext = reactExports.useContext(NotificationContext), ctxCls = _useContext.classNames;
  var dictRef = reactExports.useRef({});
  var _useState = reactExports.useState(null), _useState2 = _slicedToArray(_useState, 2), latestNotice = _useState2[0], setLatestNotice = _useState2[1];
  var _useState3 = reactExports.useState([]), _useState4 = _slicedToArray(_useState3, 2), hoverKeys = _useState4[0], setHoverKeys = _useState4[1];
  var keys = configList.map(function(config) {
    return {
      config,
      key: String(config.key)
    };
  });
  var _useStack = useStack(stackConfig), _useStack2 = _slicedToArray(_useStack, 2), stack = _useStack2[0], _useStack2$ = _useStack2[1], offset = _useStack2$.offset, threshold = _useStack2$.threshold, gap = _useStack2$.gap;
  var expanded = stack && (hoverKeys.length > 0 || keys.length <= threshold);
  var placementMotion = typeof motion === "function" ? motion(placement) : motion;
  reactExports.useEffect(function() {
    if (stack && hoverKeys.length > 1) {
      setHoverKeys(function(prev) {
        return prev.filter(function(key) {
          return keys.some(function(_ref) {
            var dataKey = _ref.key;
            return key === dataKey;
          });
        });
      });
    }
  }, [hoverKeys, keys, stack]);
  reactExports.useEffect(function() {
    var _keys;
    if (stack && dictRef.current[(_keys = keys[keys.length - 1]) === null || _keys === void 0 ? void 0 : _keys.key]) {
      var _keys2;
      setLatestNotice(dictRef.current[(_keys2 = keys[keys.length - 1]) === null || _keys2 === void 0 ? void 0 : _keys2.key]);
    }
  }, [keys, stack]);
  return /* @__PURE__ */ React.createElement(CSSMotionList, _extends({
    key: placement,
    className: classNames(prefixCls, "".concat(prefixCls, "-").concat(placement), ctxCls === null || ctxCls === void 0 ? void 0 : ctxCls.list, className, (_clsx = {}, _defineProperty(_clsx, "".concat(prefixCls, "-stack"), !!stack), _defineProperty(_clsx, "".concat(prefixCls, "-stack-expanded"), expanded), _clsx)),
    style,
    keys,
    motionAppear: true
  }, placementMotion, {
    onAllRemoved: function onAllRemoved() {
      onAllNoticeRemoved(placement);
    }
  }), function(_ref2, nodeRef) {
    var config = _ref2.config, motionClassName = _ref2.className, motionStyle = _ref2.style, motionIndex = _ref2.index;
    var _ref3 = config, key = _ref3.key, times = _ref3.times;
    var strKey = String(key);
    var _ref4 = config, configClassName = _ref4.className, configStyle = _ref4.style, configClassNames = _ref4.classNames, configStyles = _ref4.styles, restConfig = _objectWithoutProperties(_ref4, _excluded$1);
    var dataIndex = keys.findIndex(function(item) {
      return item.key === strKey;
    });
    var stackStyle = {};
    if (stack) {
      var index = keys.length - 1 - (dataIndex > -1 ? dataIndex : motionIndex - 1);
      var transformX = placement === "top" || placement === "bottom" ? "-50%" : "0";
      if (index > 0) {
        var _dictRef$current$strK, _dictRef$current$strK2, _dictRef$current$strK3;
        stackStyle.height = expanded ? (_dictRef$current$strK = dictRef.current[strKey]) === null || _dictRef$current$strK === void 0 ? void 0 : _dictRef$current$strK.offsetHeight : latestNotice === null || latestNotice === void 0 ? void 0 : latestNotice.offsetHeight;
        var verticalOffset = 0;
        for (var i = 0; i < index; i++) {
          var _dictRef$current$keys;
          verticalOffset += ((_dictRef$current$keys = dictRef.current[keys[keys.length - 1 - i].key]) === null || _dictRef$current$keys === void 0 ? void 0 : _dictRef$current$keys.offsetHeight) + gap;
        }
        var transformY = (expanded ? verticalOffset : index * offset) * (placement.startsWith("top") ? 1 : -1);
        var scaleX = !expanded && latestNotice !== null && latestNotice !== void 0 && latestNotice.offsetWidth && (_dictRef$current$strK2 = dictRef.current[strKey]) !== null && _dictRef$current$strK2 !== void 0 && _dictRef$current$strK2.offsetWidth ? ((latestNotice === null || latestNotice === void 0 ? void 0 : latestNotice.offsetWidth) - offset * 2 * (index < 3 ? index : 3)) / ((_dictRef$current$strK3 = dictRef.current[strKey]) === null || _dictRef$current$strK3 === void 0 ? void 0 : _dictRef$current$strK3.offsetWidth) : 1;
        stackStyle.transform = "translate3d(".concat(transformX, ", ").concat(transformY, "px, 0) scaleX(").concat(scaleX, ")");
      } else {
        stackStyle.transform = "translate3d(".concat(transformX, ", 0, 0)");
      }
    }
    return /* @__PURE__ */ React.createElement("div", {
      ref: nodeRef,
      className: classNames("".concat(prefixCls, "-notice-wrapper"), motionClassName, configClassNames === null || configClassNames === void 0 ? void 0 : configClassNames.wrapper),
      style: _objectSpread2(_objectSpread2(_objectSpread2({}, motionStyle), stackStyle), configStyles === null || configStyles === void 0 ? void 0 : configStyles.wrapper),
      onMouseEnter: function onMouseEnter() {
        return setHoverKeys(function(prev) {
          return prev.includes(strKey) ? prev : [].concat(_toConsumableArray(prev), [strKey]);
        });
      },
      onMouseLeave: function onMouseLeave() {
        return setHoverKeys(function(prev) {
          return prev.filter(function(k) {
            return k !== strKey;
          });
        });
      }
    }, /* @__PURE__ */ React.createElement(Notify, _extends({}, restConfig, {
      ref: function ref(node) {
        if (dataIndex > -1) {
          dictRef.current[strKey] = node;
        } else {
          delete dictRef.current[strKey];
        }
      },
      prefixCls,
      classNames: configClassNames,
      styles: configStyles,
      className: classNames(configClassName, ctxCls === null || ctxCls === void 0 ? void 0 : ctxCls.notice),
      style: configStyle,
      times,
      key,
      eventKey: key,
      onNoticeClose,
      hovering: stack && hoverKeys.length > 0
    })));
  });
};
var Notifications = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-notification" : _props$prefixCls, container = props.container, motion = props.motion, maxCount = props.maxCount, className = props.className, style = props.style, onAllRemoved = props.onAllRemoved, stack = props.stack, renderNotifications = props.renderNotifications;
  var _React$useState = reactExports.useState([]), _React$useState2 = _slicedToArray(_React$useState, 2), configList = _React$useState2[0], setConfigList = _React$useState2[1];
  var onNoticeClose = function onNoticeClose2(key) {
    var _config$onClose;
    var config = configList.find(function(item) {
      return item.key === key;
    });
    config === null || config === void 0 || (_config$onClose = config.onClose) === null || _config$onClose === void 0 || _config$onClose.call(config);
    setConfigList(function(list) {
      return list.filter(function(item) {
        return item.key !== key;
      });
    });
  };
  reactExports.useImperativeHandle(ref, function() {
    return {
      open: function open(config) {
        setConfigList(function(list) {
          var clone = _toConsumableArray(list);
          var index = clone.findIndex(function(item) {
            return item.key === config.key;
          });
          var innerConfig = _objectSpread2({}, config);
          if (index >= 0) {
            var _list$index;
            innerConfig.times = (((_list$index = list[index]) === null || _list$index === void 0 ? void 0 : _list$index.times) || 0) + 1;
            clone[index] = innerConfig;
          } else {
            innerConfig.times = 0;
            clone.push(innerConfig);
          }
          if (maxCount > 0 && clone.length > maxCount) {
            clone = clone.slice(-maxCount);
          }
          return clone;
        });
      },
      close: function close(key) {
        onNoticeClose(key);
      },
      destroy: function destroy() {
        setConfigList([]);
      }
    };
  });
  var _React$useState3 = reactExports.useState({}), _React$useState4 = _slicedToArray(_React$useState3, 2), placements = _React$useState4[0], setPlacements = _React$useState4[1];
  reactExports.useEffect(function() {
    var nextPlacements = {};
    configList.forEach(function(config) {
      var _config$placement = config.placement, placement = _config$placement === void 0 ? "topRight" : _config$placement;
      if (placement) {
        nextPlacements[placement] = nextPlacements[placement] || [];
        nextPlacements[placement].push(config);
      }
    });
    Object.keys(placements).forEach(function(placement) {
      nextPlacements[placement] = nextPlacements[placement] || [];
    });
    setPlacements(nextPlacements);
  }, [configList]);
  var onAllNoticeRemoved = function onAllNoticeRemoved2(placement) {
    setPlacements(function(originPlacements) {
      var clone = _objectSpread2({}, originPlacements);
      var list = clone[placement] || [];
      if (!list.length) {
        delete clone[placement];
      }
      return clone;
    });
  };
  var emptyRef = reactExports.useRef(false);
  reactExports.useEffect(function() {
    if (Object.keys(placements).length > 0) {
      emptyRef.current = true;
    } else if (emptyRef.current) {
      onAllRemoved === null || onAllRemoved === void 0 || onAllRemoved();
      emptyRef.current = false;
    }
  }, [placements]);
  if (!container) {
    return null;
  }
  var placementList = Object.keys(placements);
  return /* @__PURE__ */ reactDomExports.createPortal(/* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, placementList.map(function(placement) {
    var placementConfigList = placements[placement];
    var list = /* @__PURE__ */ reactExports.createElement(NoticeList, {
      key: placement,
      configList: placementConfigList,
      placement,
      prefixCls,
      className: className === null || className === void 0 ? void 0 : className(placement),
      style: style === null || style === void 0 ? void 0 : style(placement),
      motion,
      onNoticeClose,
      onAllNoticeRemoved,
      stack
    });
    return renderNotifications ? renderNotifications(list, {
      prefixCls,
      key: placement
    }) : list;
  })), container);
});
var _excluded = ["getContainer", "motion", "prefixCls", "maxCount", "className", "style", "onAllRemoved", "stack", "renderNotifications"];
var defaultGetContainer = function defaultGetContainer2() {
  return document.body;
};
var uniqueKey = 0;
function mergeConfig() {
  var clone = {};
  for (var _len = arguments.length, objList = new Array(_len), _key = 0; _key < _len; _key++) {
    objList[_key] = arguments[_key];
  }
  objList.forEach(function(obj) {
    if (obj) {
      Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        if (val !== void 0) {
          clone[key] = val;
        }
      });
    }
  });
  return clone;
}
function useNotification() {
  var rootConfig = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var _rootConfig$getContai = rootConfig.getContainer, getContainer = _rootConfig$getContai === void 0 ? defaultGetContainer : _rootConfig$getContai, motion = rootConfig.motion, prefixCls = rootConfig.prefixCls, maxCount = rootConfig.maxCount, className = rootConfig.className, style = rootConfig.style, onAllRemoved = rootConfig.onAllRemoved, stack = rootConfig.stack, renderNotifications = rootConfig.renderNotifications, shareConfig = _objectWithoutProperties(rootConfig, _excluded);
  var _React$useState = reactExports.useState(), _React$useState2 = _slicedToArray(_React$useState, 2), container = _React$useState2[0], setContainer = _React$useState2[1];
  var notificationsRef = reactExports.useRef();
  var contextHolder = /* @__PURE__ */ reactExports.createElement(Notifications, {
    container,
    ref: notificationsRef,
    prefixCls,
    motion,
    maxCount,
    className,
    style,
    onAllRemoved,
    stack,
    renderNotifications
  });
  var _React$useState3 = reactExports.useState([]), _React$useState4 = _slicedToArray(_React$useState3, 2), taskQueue = _React$useState4[0], setTaskQueue = _React$useState4[1];
  var api = reactExports.useMemo(function() {
    return {
      open: function open(config) {
        var mergedConfig = mergeConfig(shareConfig, config);
        if (mergedConfig.key === null || mergedConfig.key === void 0) {
          mergedConfig.key = "rc-notification-".concat(uniqueKey);
          uniqueKey += 1;
        }
        setTaskQueue(function(queue) {
          return [].concat(_toConsumableArray(queue), [{
            type: "open",
            config: mergedConfig
          }]);
        });
      },
      close: function close(key) {
        setTaskQueue(function(queue) {
          return [].concat(_toConsumableArray(queue), [{
            type: "close",
            key
          }]);
        });
      },
      destroy: function destroy() {
        setTaskQueue(function(queue) {
          return [].concat(_toConsumableArray(queue), [{
            type: "destroy"
          }]);
        });
      }
    };
  }, []);
  reactExports.useEffect(function() {
    setContainer(getContainer());
  });
  reactExports.useEffect(function() {
    if (notificationsRef.current && taskQueue.length) {
      taskQueue.forEach(function(task) {
        switch (task.type) {
          case "open":
            notificationsRef.current.open(task.config);
            break;
          case "close":
            notificationsRef.current.close(task.key);
            break;
          case "destroy":
            notificationsRef.current.destroy();
            break;
        }
      });
      setTaskQueue(function(oriQueue) {
        return oriQueue.filter(function(task) {
          return !taskQueue.includes(task);
        });
      });
    }
  }, [taskQueue]);
  return [api, contextHolder];
}
const AppConfigContext = /* @__PURE__ */ React.createContext({});
export {
  AppConfigContext as A,
  Notify as N,
  NotificationProvider as a,
  useNotification as u
};
