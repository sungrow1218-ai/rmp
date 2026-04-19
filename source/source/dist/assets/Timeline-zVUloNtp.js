import { r as reactExports, o as _objectWithoutProperties, a1 as useComposeRef, s as _extends, e as classNames, x as warningOnce, p as _slicedToArray, w as CSSMotion, H as _objectSpread2, q as _defineProperty, P as useLayoutEffect, d as ConfigContext, b as unit, a as resetComponent, _ as _toConsumableArray } from "./index-CUErrqgd.js";
import { j as Portal, d as getTransitionName } from "./index-BKheaG9T.js";
import { a as KeyCode, b as useZIndex, z as zIndexContext, u as useCSSVarCls } from "./useZIndex-BReSjmbj.js";
import { p as pickAttrs } from "./pickAttrs-B6Vs2P5v.js";
import { N as NoFormStyle } from "./TextArea-Cw6hnbxh.js";
import { N as NoCompactStyle, t as toArray } from "./compact-item-T75FitAV.js";
import { u as usePanelRef } from "./context-C5GnONAC.js";
import { u as useClosable } from "./useClosable-BjqEnKhC.js";
import { g as genStyleHooks, m as merge } from "./asyncToGenerator-Bn7YJjF8.js";
import { R as RefIcon } from "./LoadingOutlined-s4PR_g90.js";
var DrawerContext = /* @__PURE__ */ reactExports.createContext(null);
var RefContext = /* @__PURE__ */ reactExports.createContext({});
var _excluded = ["prefixCls", "className", "containerRef"];
var DrawerPanel$1 = function DrawerPanel2(props) {
  var prefixCls = props.prefixCls, className = props.className, containerRef = props.containerRef, restProps = _objectWithoutProperties(props, _excluded);
  var _React$useContext = reactExports.useContext(RefContext), panelRef = _React$useContext.panel;
  var mergedRef = useComposeRef(panelRef, containerRef);
  return /* @__PURE__ */ reactExports.createElement("div", _extends({
    className: classNames("".concat(prefixCls, "-content"), className),
    role: "dialog",
    ref: mergedRef
  }, pickAttrs(props, {
    aria: true
  }), {
    "aria-modal": "true"
  }, restProps));
};
function parseWidthHeight(value) {
  if (typeof value === "string" && String(Number(value)) === value) {
    warningOnce(false, "Invalid value type of `width` or `height` which should be number type instead.");
    return Number(value);
  }
  return value;
}
var sentinelStyle = {
  width: 0,
  height: 0,
  overflow: "hidden",
  outline: "none",
  position: "absolute"
};
function DrawerPopup(props, ref) {
  var _ref, _pushConfig$distance, _pushConfig;
  var prefixCls = props.prefixCls, open = props.open, placement = props.placement, inline = props.inline, push = props.push, forceRender = props.forceRender, autoFocus = props.autoFocus, keyboard = props.keyboard, drawerClassNames = props.classNames, rootClassName = props.rootClassName, rootStyle = props.rootStyle, zIndex = props.zIndex, className = props.className, id = props.id, style = props.style, motion = props.motion, width = props.width, height = props.height, children = props.children, mask = props.mask, maskClosable = props.maskClosable, maskMotion = props.maskMotion, maskClassName = props.maskClassName, maskStyle = props.maskStyle, afterOpenChange = props.afterOpenChange, onClose = props.onClose, onMouseEnter = props.onMouseEnter, onMouseOver = props.onMouseOver, onMouseLeave = props.onMouseLeave, onClick = props.onClick, onKeyDown = props.onKeyDown, onKeyUp = props.onKeyUp, styles = props.styles;
  var panelRef = reactExports.useRef();
  var sentinelStartRef = reactExports.useRef();
  var sentinelEndRef = reactExports.useRef();
  reactExports.useImperativeHandle(ref, function() {
    return panelRef.current;
  });
  var onPanelKeyDown = function onPanelKeyDown2(event) {
    var keyCode = event.keyCode, shiftKey = event.shiftKey;
    switch (keyCode) {
      // Tab active
      case KeyCode.TAB: {
        if (keyCode === KeyCode.TAB) {
          if (!shiftKey && document.activeElement === sentinelEndRef.current) {
            var _sentinelStartRef$cur;
            (_sentinelStartRef$cur = sentinelStartRef.current) === null || _sentinelStartRef$cur === void 0 || _sentinelStartRef$cur.focus({
              preventScroll: true
            });
          } else if (shiftKey && document.activeElement === sentinelStartRef.current) {
            var _sentinelEndRef$curre;
            (_sentinelEndRef$curre = sentinelEndRef.current) === null || _sentinelEndRef$curre === void 0 || _sentinelEndRef$curre.focus({
              preventScroll: true
            });
          }
        }
        break;
      }
      // Close
      case KeyCode.ESC: {
        if (onClose && keyboard) {
          event.stopPropagation();
          onClose(event);
        }
        break;
      }
    }
  };
  reactExports.useEffect(function() {
    if (open && autoFocus) {
      var _panelRef$current;
      (_panelRef$current = panelRef.current) === null || _panelRef$current === void 0 || _panelRef$current.focus({
        preventScroll: true
      });
    }
  }, [open]);
  var _React$useState = reactExports.useState(false), _React$useState2 = _slicedToArray(_React$useState, 2), pushed = _React$useState2[0], setPushed = _React$useState2[1];
  var parentContext = reactExports.useContext(DrawerContext);
  var pushConfig;
  if (typeof push === "boolean") {
    pushConfig = push ? {} : {
      distance: 0
    };
  } else {
    pushConfig = push || {};
  }
  var pushDistance = (_ref = (_pushConfig$distance = (_pushConfig = pushConfig) === null || _pushConfig === void 0 ? void 0 : _pushConfig.distance) !== null && _pushConfig$distance !== void 0 ? _pushConfig$distance : parentContext === null || parentContext === void 0 ? void 0 : parentContext.pushDistance) !== null && _ref !== void 0 ? _ref : 180;
  var mergedContext = reactExports.useMemo(function() {
    return {
      pushDistance,
      push: function push2() {
        setPushed(true);
      },
      pull: function pull() {
        setPushed(false);
      }
    };
  }, [pushDistance]);
  reactExports.useEffect(function() {
    if (open) {
      var _parentContext$push;
      parentContext === null || parentContext === void 0 || (_parentContext$push = parentContext.push) === null || _parentContext$push === void 0 || _parentContext$push.call(parentContext);
    } else {
      var _parentContext$pull;
      parentContext === null || parentContext === void 0 || (_parentContext$pull = parentContext.pull) === null || _parentContext$pull === void 0 || _parentContext$pull.call(parentContext);
    }
  }, [open]);
  reactExports.useEffect(function() {
    return function() {
      var _parentContext$pull2;
      parentContext === null || parentContext === void 0 || (_parentContext$pull2 = parentContext.pull) === null || _parentContext$pull2 === void 0 || _parentContext$pull2.call(parentContext);
    };
  }, []);
  var maskNode = mask && /* @__PURE__ */ reactExports.createElement(CSSMotion, _extends({
    key: "mask"
  }, maskMotion, {
    visible: open
  }), function(_ref2, maskRef) {
    var motionMaskClassName = _ref2.className, motionMaskStyle = _ref2.style;
    return /* @__PURE__ */ reactExports.createElement("div", {
      className: classNames("".concat(prefixCls, "-mask"), motionMaskClassName, drawerClassNames === null || drawerClassNames === void 0 ? void 0 : drawerClassNames.mask, maskClassName),
      style: _objectSpread2(_objectSpread2(_objectSpread2({}, motionMaskStyle), maskStyle), styles === null || styles === void 0 ? void 0 : styles.mask),
      onClick: maskClosable && open ? onClose : void 0,
      ref: maskRef
    });
  });
  var motionProps = typeof motion === "function" ? motion(placement) : motion;
  var wrapperStyle = {};
  if (pushed && pushDistance) {
    switch (placement) {
      case "top":
        wrapperStyle.transform = "translateY(".concat(pushDistance, "px)");
        break;
      case "bottom":
        wrapperStyle.transform = "translateY(".concat(-pushDistance, "px)");
        break;
      case "left":
        wrapperStyle.transform = "translateX(".concat(pushDistance, "px)");
        break;
      default:
        wrapperStyle.transform = "translateX(".concat(-pushDistance, "px)");
        break;
    }
  }
  if (placement === "left" || placement === "right") {
    wrapperStyle.width = parseWidthHeight(width);
  } else {
    wrapperStyle.height = parseWidthHeight(height);
  }
  var eventHandlers = {
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp
  };
  var panelNode = /* @__PURE__ */ reactExports.createElement(CSSMotion, _extends({
    key: "panel"
  }, motionProps, {
    visible: open,
    forceRender,
    onVisibleChanged: function onVisibleChanged(nextVisible) {
      afterOpenChange === null || afterOpenChange === void 0 || afterOpenChange(nextVisible);
    },
    removeOnLeave: false,
    leavedClassName: "".concat(prefixCls, "-content-wrapper-hidden")
  }), function(_ref3, motionRef) {
    var motionClassName = _ref3.className, motionStyle = _ref3.style;
    return /* @__PURE__ */ reactExports.createElement("div", _extends({
      className: classNames("".concat(prefixCls, "-content-wrapper"), drawerClassNames === null || drawerClassNames === void 0 ? void 0 : drawerClassNames.wrapper, motionClassName),
      style: _objectSpread2(_objectSpread2(_objectSpread2({}, wrapperStyle), motionStyle), styles === null || styles === void 0 ? void 0 : styles.wrapper)
    }, pickAttrs(props, {
      data: true
    })), /* @__PURE__ */ reactExports.createElement(DrawerPanel$1, _extends({
      id,
      containerRef: motionRef,
      prefixCls,
      className: classNames(className, drawerClassNames === null || drawerClassNames === void 0 ? void 0 : drawerClassNames.content),
      style: _objectSpread2(_objectSpread2({}, style), styles === null || styles === void 0 ? void 0 : styles.content)
    }, pickAttrs(props, {
      aria: true
    }), eventHandlers), children));
  });
  var containerStyle = _objectSpread2({}, rootStyle);
  if (zIndex) {
    containerStyle.zIndex = zIndex;
  }
  return /* @__PURE__ */ reactExports.createElement(DrawerContext.Provider, {
    value: mergedContext
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(prefixCls, "".concat(prefixCls, "-").concat(placement), rootClassName, _defineProperty(_defineProperty({}, "".concat(prefixCls, "-open"), open), "".concat(prefixCls, "-inline"), inline)),
    style: containerStyle,
    tabIndex: -1,
    ref: panelRef,
    onKeyDown: onPanelKeyDown
  }, maskNode, /* @__PURE__ */ reactExports.createElement("div", {
    tabIndex: 0,
    ref: sentinelStartRef,
    style: sentinelStyle,
    "aria-hidden": "true",
    "data-sentinel": "start"
  }), panelNode, /* @__PURE__ */ reactExports.createElement("div", {
    tabIndex: 0,
    ref: sentinelEndRef,
    style: sentinelStyle,
    "aria-hidden": "true",
    "data-sentinel": "end"
  })));
}
var RefDrawerPopup = /* @__PURE__ */ reactExports.forwardRef(DrawerPopup);
var Drawer$1 = function Drawer2(props) {
  var _props$open = props.open, open = _props$open === void 0 ? false : _props$open, _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-drawer" : _props$prefixCls, _props$placement = props.placement, placement = _props$placement === void 0 ? "right" : _props$placement, _props$autoFocus = props.autoFocus, autoFocus = _props$autoFocus === void 0 ? true : _props$autoFocus, _props$keyboard = props.keyboard, keyboard = _props$keyboard === void 0 ? true : _props$keyboard, _props$width = props.width, width = _props$width === void 0 ? 378 : _props$width, _props$mask = props.mask, mask = _props$mask === void 0 ? true : _props$mask, _props$maskClosable = props.maskClosable, maskClosable = _props$maskClosable === void 0 ? true : _props$maskClosable, getContainer = props.getContainer, forceRender = props.forceRender, afterOpenChange = props.afterOpenChange, destroyOnClose = props.destroyOnClose, onMouseEnter = props.onMouseEnter, onMouseOver = props.onMouseOver, onMouseLeave = props.onMouseLeave, onClick = props.onClick, onKeyDown = props.onKeyDown, onKeyUp = props.onKeyUp, panelRef = props.panelRef;
  var _React$useState = reactExports.useState(false), _React$useState2 = _slicedToArray(_React$useState, 2), animatedVisible = _React$useState2[0], setAnimatedVisible = _React$useState2[1];
  var _React$useState3 = reactExports.useState(false), _React$useState4 = _slicedToArray(_React$useState3, 2), mounted = _React$useState4[0], setMounted = _React$useState4[1];
  useLayoutEffect(function() {
    setMounted(true);
  }, []);
  var mergedOpen = mounted ? open : false;
  var popupRef = reactExports.useRef();
  var lastActiveRef = reactExports.useRef();
  useLayoutEffect(function() {
    if (mergedOpen) {
      lastActiveRef.current = document.activeElement;
    }
  }, [mergedOpen]);
  var internalAfterOpenChange = function internalAfterOpenChange2(nextVisible) {
    var _popupRef$current;
    setAnimatedVisible(nextVisible);
    afterOpenChange === null || afterOpenChange === void 0 || afterOpenChange(nextVisible);
    if (!nextVisible && lastActiveRef.current && !((_popupRef$current = popupRef.current) !== null && _popupRef$current !== void 0 && _popupRef$current.contains(lastActiveRef.current))) {
      var _lastActiveRef$curren;
      (_lastActiveRef$curren = lastActiveRef.current) === null || _lastActiveRef$curren === void 0 || _lastActiveRef$curren.focus({
        preventScroll: true
      });
    }
  };
  var refContext = reactExports.useMemo(function() {
    return {
      panel: panelRef
    };
  }, [panelRef]);
  if (!forceRender && !animatedVisible && !mergedOpen && destroyOnClose) {
    return null;
  }
  var eventHandlers = {
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp
  };
  var drawerPopupProps = _objectSpread2(_objectSpread2({}, props), {}, {
    open: mergedOpen,
    prefixCls,
    placement,
    autoFocus,
    keyboard,
    width,
    mask,
    maskClosable,
    inline: getContainer === false,
    afterOpenChange: internalAfterOpenChange,
    ref: popupRef
  }, eventHandlers);
  return /* @__PURE__ */ reactExports.createElement(RefContext.Provider, {
    value: refContext
  }, /* @__PURE__ */ reactExports.createElement(Portal, {
    open: mergedOpen || forceRender || animatedVisible,
    autoDestroy: false,
    getContainer,
    autoLock: mask && (mergedOpen || animatedVisible)
  }, /* @__PURE__ */ reactExports.createElement(RefDrawerPopup, drawerPopupProps)));
};
const DrawerPanel = (props) => {
  var _a, _b;
  const {
    prefixCls,
    title,
    footer,
    extra,
    closeIcon,
    closable,
    onClose,
    headerStyle,
    bodyStyle,
    footerStyle,
    children,
    classNames: drawerClassNames,
    styles: drawerStyles
  } = props;
  const {
    drawer: drawerContext
  } = reactExports.useContext(ConfigContext);
  const customCloseIconRender = reactExports.useCallback((icon) => /* @__PURE__ */ reactExports.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Close",
    className: `${prefixCls}-close`
  }, icon), [onClose]);
  const mergedContextCloseIcon = reactExports.useMemo(() => {
    if (typeof (drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.closable) === "object" && drawerContext.closable.closeIcon) {
      return drawerContext.closable.closeIcon;
    }
    return drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.closeIcon;
  }, [drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.closable, drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.closeIcon]);
  const [mergedClosable, mergedCloseIcon] = useClosable({
    closable: closable !== null && closable !== void 0 ? closable : drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.closable,
    closeIcon: typeof closeIcon !== "undefined" ? closeIcon : mergedContextCloseIcon,
    customCloseIconRender,
    defaultClosable: true
  });
  const headerNode = reactExports.useMemo(() => {
    var _a2, _b2;
    if (!title && !mergedClosable) {
      return null;
    }
    return /* @__PURE__ */ reactExports.createElement("div", {
      style: Object.assign(Object.assign(Object.assign({}, (_a2 = drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.styles) === null || _a2 === void 0 ? void 0 : _a2.header), headerStyle), drawerStyles === null || drawerStyles === void 0 ? void 0 : drawerStyles.header),
      className: classNames(`${prefixCls}-header`, {
        [`${prefixCls}-header-close-only`]: mergedClosable && !title && !extra
      }, (_b2 = drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.classNames) === null || _b2 === void 0 ? void 0 : _b2.header, drawerClassNames === null || drawerClassNames === void 0 ? void 0 : drawerClassNames.header)
    }, /* @__PURE__ */ reactExports.createElement("div", {
      className: `${prefixCls}-header-title`
    }, mergedCloseIcon, title && /* @__PURE__ */ reactExports.createElement("div", {
      className: `${prefixCls}-title`
    }, title)), extra && /* @__PURE__ */ reactExports.createElement("div", {
      className: `${prefixCls}-extra`
    }, extra));
  }, [mergedClosable, mergedCloseIcon, extra, headerStyle, prefixCls, title]);
  const footerNode = reactExports.useMemo(() => {
    var _a2, _b2;
    if (!footer) {
      return null;
    }
    const footerClassName = `${prefixCls}-footer`;
    return /* @__PURE__ */ reactExports.createElement("div", {
      className: classNames(footerClassName, (_a2 = drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.classNames) === null || _a2 === void 0 ? void 0 : _a2.footer, drawerClassNames === null || drawerClassNames === void 0 ? void 0 : drawerClassNames.footer),
      style: Object.assign(Object.assign(Object.assign({}, (_b2 = drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.styles) === null || _b2 === void 0 ? void 0 : _b2.footer), footerStyle), drawerStyles === null || drawerStyles === void 0 ? void 0 : drawerStyles.footer)
    }, footer);
  }, [footer, footerStyle, prefixCls]);
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, headerNode, /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(`${prefixCls}-body`, drawerClassNames === null || drawerClassNames === void 0 ? void 0 : drawerClassNames.body, (_a = drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.classNames) === null || _a === void 0 ? void 0 : _a.body),
    style: Object.assign(Object.assign(Object.assign({}, (_b = drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.styles) === null || _b === void 0 ? void 0 : _b.body), bodyStyle), drawerStyles === null || drawerStyles === void 0 ? void 0 : drawerStyles.body)
  }, children), footerNode);
};
const getMoveTranslate = (direction) => {
  const value = "100%";
  return {
    left: `translateX(-${value})`,
    right: `translateX(${value})`,
    top: `translateY(-${value})`,
    bottom: `translateY(${value})`
  }[direction];
};
const getEnterLeaveStyle = (startStyle, endStyle) => ({
  "&-enter, &-appear": Object.assign(Object.assign({}, startStyle), {
    "&-active": endStyle
  }),
  "&-leave": Object.assign(Object.assign({}, endStyle), {
    "&-active": startStyle
  })
});
const getFadeStyle = (from, duration) => Object.assign({
  "&-enter, &-appear, &-leave": {
    "&-start": {
      transition: "none"
    },
    "&-active": {
      transition: `all ${duration}`
    }
  }
}, getEnterLeaveStyle({
  opacity: from
}, {
  opacity: 1
}));
const getPanelMotionStyles = (direction, duration) => [getFadeStyle(0.7, duration), getEnterLeaveStyle({
  transform: getMoveTranslate(direction)
}, {
  transform: "none"
})];
const genMotionStyle = (token) => {
  const {
    componentCls,
    motionDurationSlow
  } = token;
  return {
    [componentCls]: {
      // ======================== Mask ========================
      [`${componentCls}-mask-motion`]: getFadeStyle(0, motionDurationSlow),
      // ======================= Panel ========================
      [`${componentCls}-panel-motion`]: ["left", "right", "top", "bottom"].reduce((obj, direction) => Object.assign(Object.assign({}, obj), {
        [`&-${direction}`]: getPanelMotionStyles(direction, motionDurationSlow)
      }), {})
    }
  };
};
const genDrawerStyle = (token) => {
  const {
    componentCls,
    zIndexPopup,
    colorBgMask,
    colorBgElevated,
    motionDurationSlow,
    motionDurationMid,
    padding,
    paddingLG,
    fontSizeLG,
    lineHeightLG,
    lineWidth,
    lineType,
    colorSplit,
    marginSM,
    colorIcon,
    colorIconHover,
    colorText,
    fontWeightStrong,
    footerPaddingBlock,
    footerPaddingInline
  } = token;
  const wrapperCls = `${componentCls}-content-wrapper`;
  return {
    [componentCls]: {
      position: "fixed",
      inset: 0,
      zIndex: zIndexPopup,
      pointerEvents: "none",
      "&-pure": {
        position: "relative",
        background: colorBgElevated,
        display: "flex",
        flexDirection: "column",
        [`&${componentCls}-left`]: {
          boxShadow: token.boxShadowDrawerLeft
        },
        [`&${componentCls}-right`]: {
          boxShadow: token.boxShadowDrawerRight
        },
        [`&${componentCls}-top`]: {
          boxShadow: token.boxShadowDrawerUp
        },
        [`&${componentCls}-bottom`]: {
          boxShadow: token.boxShadowDrawerDown
        }
      },
      "&-inline": {
        position: "absolute"
      },
      // ====================== Mask ======================
      [`${componentCls}-mask`]: {
        position: "absolute",
        inset: 0,
        zIndex: zIndexPopup,
        background: colorBgMask,
        pointerEvents: "auto"
      },
      // ==================== Content =====================
      [wrapperCls]: {
        position: "absolute",
        zIndex: zIndexPopup,
        maxWidth: "100vw",
        transition: `all ${motionDurationSlow}`,
        "&-hidden": {
          display: "none"
        }
      },
      // Placement
      [`&-left > ${wrapperCls}`]: {
        top: 0,
        bottom: 0,
        left: {
          _skip_check_: true,
          value: 0
        },
        boxShadow: token.boxShadowDrawerLeft
      },
      [`&-right > ${wrapperCls}`]: {
        top: 0,
        right: {
          _skip_check_: true,
          value: 0
        },
        bottom: 0,
        boxShadow: token.boxShadowDrawerRight
      },
      [`&-top > ${wrapperCls}`]: {
        top: 0,
        insetInline: 0,
        boxShadow: token.boxShadowDrawerUp
      },
      [`&-bottom > ${wrapperCls}`]: {
        bottom: 0,
        insetInline: 0,
        boxShadow: token.boxShadowDrawerDown
      },
      [`${componentCls}-content`]: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "auto",
        background: colorBgElevated,
        pointerEvents: "auto"
      },
      // Header
      [`${componentCls}-header`]: {
        display: "flex",
        flex: 0,
        alignItems: "center",
        padding: `${unit(padding)} ${unit(paddingLG)}`,
        fontSize: fontSizeLG,
        lineHeight: lineHeightLG,
        borderBottom: `${unit(lineWidth)} ${lineType} ${colorSplit}`,
        "&-title": {
          display: "flex",
          flex: 1,
          alignItems: "center",
          minWidth: 0,
          minHeight: 0
        }
      },
      [`${componentCls}-extra`]: {
        flex: "none"
      },
      [`${componentCls}-close`]: {
        display: "inline-block",
        marginInlineEnd: marginSM,
        color: colorIcon,
        fontWeight: fontWeightStrong,
        fontSize: fontSizeLG,
        fontStyle: "normal",
        lineHeight: 1,
        textAlign: "center",
        textTransform: "none",
        textDecoration: "none",
        background: "transparent",
        border: 0,
        outline: 0,
        cursor: "pointer",
        transition: `color ${motionDurationMid}`,
        textRendering: "auto",
        "&:focus, &:hover": {
          color: colorIconHover,
          textDecoration: "none"
        }
      },
      [`${componentCls}-title`]: {
        flex: 1,
        margin: 0,
        color: colorText,
        fontWeight: token.fontWeightStrong,
        fontSize: fontSizeLG,
        lineHeight: lineHeightLG
      },
      // Body
      [`${componentCls}-body`]: {
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        padding: paddingLG,
        overflow: "auto"
      },
      // Footer
      [`${componentCls}-footer`]: {
        flexShrink: 0,
        padding: `${unit(footerPaddingBlock)} ${unit(footerPaddingInline)}`,
        borderTop: `${unit(lineWidth)} ${lineType} ${colorSplit}`
      },
      // ====================== RTL =======================
      "&-rtl": {
        direction: "rtl"
      }
    }
  };
};
const prepareComponentToken$1 = (token) => ({
  zIndexPopup: token.zIndexPopupBase,
  footerPaddingBlock: token.paddingXS,
  footerPaddingInline: token.padding
});
const useStyle$1 = genStyleHooks("Drawer", (token) => {
  const drawerToken = merge(token, {});
  return [genDrawerStyle(drawerToken), genMotionStyle(drawerToken)];
}, prepareComponentToken$1);
var __rest$3 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const defaultPushState = {
  distance: 180
};
const Drawer = (props) => {
  const {
    rootClassName,
    width,
    height,
    size = "default",
    mask = true,
    push = defaultPushState,
    open,
    afterOpenChange,
    onClose,
    prefixCls: customizePrefixCls,
    getContainer: customizeGetContainer,
    style,
    className,
    // Deprecated
    visible,
    afterVisibleChange,
    maskStyle,
    drawerStyle,
    contentWrapperStyle
  } = props, rest = __rest$3(props, ["rootClassName", "width", "height", "size", "mask", "push", "open", "afterOpenChange", "onClose", "prefixCls", "getContainer", "style", "className", "visible", "afterVisibleChange", "maskStyle", "drawerStyle", "contentWrapperStyle"]);
  const {
    getPopupContainer,
    getPrefixCls,
    direction,
    drawer
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("drawer", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle$1(prefixCls);
  const getContainer = (
    // 有可能为 false，所以不能直接判断
    customizeGetContainer === void 0 && getPopupContainer ? () => getPopupContainer(document.body) : customizeGetContainer
  );
  const drawerClassName = classNames({
    "no-mask": !mask,
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, rootClassName, hashId, cssVarCls);
  const mergedWidth = reactExports.useMemo(() => width !== null && width !== void 0 ? width : size === "large" ? 736 : 378, [width, size]);
  const mergedHeight = reactExports.useMemo(() => height !== null && height !== void 0 ? height : size === "large" ? 736 : 378, [height, size]);
  const maskMotion = {
    motionName: getTransitionName(prefixCls, "mask-motion"),
    motionAppear: true,
    motionEnter: true,
    motionLeave: true,
    motionDeadline: 500
  };
  const panelMotion = (motionPlacement) => ({
    motionName: getTransitionName(prefixCls, `panel-motion-${motionPlacement}`),
    motionAppear: true,
    motionEnter: true,
    motionLeave: true,
    motionDeadline: 500
  });
  const panelRef = usePanelRef();
  const [zIndex, contextZIndex] = useZIndex("Drawer", rest.zIndex);
  const {
    classNames: propClassNames = {},
    styles: propStyles = {}
  } = rest;
  const {
    classNames: contextClassNames = {},
    styles: contextStyles = {}
  } = drawer || {};
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(NoCompactStyle, null, /* @__PURE__ */ reactExports.createElement(NoFormStyle, {
    status: true,
    override: true
  }, /* @__PURE__ */ reactExports.createElement(zIndexContext.Provider, {
    value: contextZIndex
  }, /* @__PURE__ */ reactExports.createElement(Drawer$1, Object.assign({
    prefixCls,
    onClose,
    maskMotion,
    motion: panelMotion
  }, rest, {
    classNames: {
      mask: classNames(propClassNames.mask, contextClassNames.mask),
      content: classNames(propClassNames.content, contextClassNames.content)
    },
    styles: {
      mask: Object.assign(Object.assign(Object.assign({}, propStyles.mask), maskStyle), contextStyles.mask),
      content: Object.assign(Object.assign(Object.assign({}, propStyles.content), drawerStyle), contextStyles.content),
      wrapper: Object.assign(Object.assign(Object.assign({}, propStyles.wrapper), contentWrapperStyle), contextStyles.wrapper)
    },
    open: open !== null && open !== void 0 ? open : visible,
    mask,
    push,
    width: mergedWidth,
    height: mergedHeight,
    style: Object.assign(Object.assign({}, drawer === null || drawer === void 0 ? void 0 : drawer.style), style),
    className: classNames(drawer === null || drawer === void 0 ? void 0 : drawer.className, className),
    rootClassName: drawerClassName,
    getContainer,
    afterOpenChange: afterOpenChange !== null && afterOpenChange !== void 0 ? afterOpenChange : afterVisibleChange,
    panelRef,
    zIndex
  }), /* @__PURE__ */ reactExports.createElement(DrawerPanel, Object.assign({
    prefixCls
  }, rest, {
    onClose
  })))))));
};
const PurePanel = (props) => {
  const {
    prefixCls: customizePrefixCls,
    style,
    className,
    placement = "right"
  } = props, restProps = __rest$3(props, ["prefixCls", "style", "className", "placement"]);
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("drawer", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle$1(prefixCls);
  const cls = classNames(prefixCls, `${prefixCls}-pure`, `${prefixCls}-${placement}`, hashId, cssVarCls, className);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement("div", {
    className: cls,
    style
  }, /* @__PURE__ */ reactExports.createElement(DrawerPanel, Object.assign({
    prefixCls
  }, restProps))));
};
Drawer._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
const genTimelineStyle = (token) => {
  const {
    componentCls,
    calc
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
      margin: 0,
      padding: 0,
      listStyle: "none",
      [`${componentCls}-item`]: {
        position: "relative",
        margin: 0,
        paddingBottom: token.itemPaddingBottom,
        fontSize: token.fontSize,
        listStyle: "none",
        "&-tail": {
          position: "absolute",
          insetBlockStart: token.itemHeadSize,
          insetInlineStart: calc(calc(token.itemHeadSize).sub(token.tailWidth)).div(2).equal(),
          height: `calc(100% - ${unit(token.itemHeadSize)})`,
          borderInlineStart: `${unit(token.tailWidth)} ${token.lineType} ${token.tailColor}`
        },
        "&-pending": {
          [`${componentCls}-item-head`]: {
            fontSize: token.fontSizeSM,
            backgroundColor: "transparent"
          },
          [`${componentCls}-item-tail`]: {
            display: "none"
          }
        },
        "&-head": {
          position: "absolute",
          width: token.itemHeadSize,
          height: token.itemHeadSize,
          backgroundColor: token.dotBg,
          border: `${unit(token.dotBorderWidth)} ${token.lineType} transparent`,
          borderRadius: "50%",
          "&-blue": {
            color: token.colorPrimary,
            borderColor: token.colorPrimary
          },
          "&-red": {
            color: token.colorError,
            borderColor: token.colorError
          },
          "&-green": {
            color: token.colorSuccess,
            borderColor: token.colorSuccess
          },
          "&-gray": {
            color: token.colorTextDisabled,
            borderColor: token.colorTextDisabled
          }
        },
        "&-head-custom": {
          position: "absolute",
          insetBlockStart: calc(token.itemHeadSize).div(2).equal(),
          insetInlineStart: calc(token.itemHeadSize).div(2).equal(),
          width: "auto",
          height: "auto",
          marginBlockStart: 0,
          paddingBlock: token.customHeadPaddingVertical,
          lineHeight: 1,
          textAlign: "center",
          border: 0,
          borderRadius: 0,
          transform: `translate(-50%, -50%)`
        },
        "&-content": {
          position: "relative",
          insetBlockStart: calc(calc(token.fontSize).mul(token.lineHeight).sub(token.fontSize)).mul(-1).add(token.lineWidth).equal(),
          marginInlineStart: calc(token.margin).add(token.itemHeadSize).equal(),
          marginInlineEnd: 0,
          marginBlockStart: 0,
          marginBlockEnd: 0,
          wordBreak: "break-word"
        },
        "&-last": {
          [`> ${componentCls}-item-tail`]: {
            display: "none"
          },
          [`> ${componentCls}-item-content`]: {
            minHeight: calc(token.controlHeightLG).mul(1.2).equal()
          }
        }
      },
      [`&${componentCls}-alternate,
        &${componentCls}-right,
        &${componentCls}-label`]: {
        [`${componentCls}-item`]: {
          "&-tail, &-head, &-head-custom": {
            insetInlineStart: "50%"
          },
          "&-head": {
            marginInlineStart: calc(token.marginXXS).mul(-1).equal(),
            "&-custom": {
              marginInlineStart: calc(token.tailWidth).div(2).equal()
            }
          },
          "&-left": {
            [`${componentCls}-item-content`]: {
              insetInlineStart: `calc(50% - ${unit(token.marginXXS)})`,
              width: `calc(50% - ${unit(token.marginSM)})`,
              textAlign: "start"
            }
          },
          "&-right": {
            [`${componentCls}-item-content`]: {
              width: `calc(50% - ${unit(token.marginSM)})`,
              margin: 0,
              textAlign: "end"
            }
          }
        }
      },
      [`&${componentCls}-right`]: {
        [`${componentCls}-item-right`]: {
          [`${componentCls}-item-tail,
            ${componentCls}-item-head,
            ${componentCls}-item-head-custom`]: {
            insetInlineStart: `calc(100% - ${unit(calc(calc(token.itemHeadSize).add(token.tailWidth)).div(2).equal())})`
          },
          [`${componentCls}-item-content`]: {
            width: `calc(100% - ${unit(calc(token.itemHeadSize).add(token.marginXS).equal())})`
          }
        }
      },
      [`&${componentCls}-pending
        ${componentCls}-item-last
        ${componentCls}-item-tail`]: {
        display: "block",
        height: `calc(100% - ${unit(token.margin)})`,
        borderInlineStart: `${unit(token.tailWidth)} dotted ${token.tailColor}`
      },
      [`&${componentCls}-reverse
        ${componentCls}-item-last
        ${componentCls}-item-tail`]: {
        display: "none"
      },
      [`&${componentCls}-reverse ${componentCls}-item-pending`]: {
        [`${componentCls}-item-tail`]: {
          insetBlockStart: token.margin,
          display: "block",
          height: `calc(100% - ${unit(token.margin)})`,
          borderInlineStart: `${unit(token.tailWidth)} dotted ${token.tailColor}`
        },
        [`${componentCls}-item-content`]: {
          minHeight: calc(token.controlHeightLG).mul(1.2).equal()
        }
      },
      [`&${componentCls}-label`]: {
        [`${componentCls}-item-label`]: {
          position: "absolute",
          insetBlockStart: calc(calc(token.fontSize).mul(token.lineHeight).sub(token.fontSize)).mul(-1).add(token.tailWidth).equal(),
          width: `calc(50% - ${unit(token.marginSM)})`,
          textAlign: "end"
        },
        [`${componentCls}-item-right`]: {
          [`${componentCls}-item-label`]: {
            insetInlineStart: `calc(50% + ${unit(token.marginSM)})`,
            width: `calc(50% - ${unit(token.marginSM)})`,
            textAlign: "start"
          }
        }
      },
      // ====================== RTL =======================
      "&-rtl": {
        direction: "rtl",
        [`${componentCls}-item-head-custom`]: {
          transform: `translate(50%, -50%)`
        }
      }
    })
  };
};
const prepareComponentToken = (token) => ({
  tailColor: token.colorSplit,
  tailWidth: token.lineWidthBold,
  dotBorderWidth: token.wireframe ? token.lineWidthBold : token.lineWidth * 3,
  dotBg: token.colorBgContainer,
  itemPaddingBottom: token.padding * 1.25
});
const useStyle = genStyleHooks("Timeline", (token) => {
  const timeLineToken = merge(token, {
    itemHeadSize: 10,
    customHeadPaddingVertical: token.paddingXXS,
    paddingInlineEnd: 2
  });
  return [genTimelineStyle(timeLineToken)];
}, prepareComponentToken);
var __rest$2 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const TimelineItem = (_a) => {
  var {
    prefixCls: customizePrefixCls,
    className,
    color = "blue",
    dot,
    pending = false,
    position,
    label,
    children
  } = _a, restProps = __rest$2(_a, ["prefixCls", "className", "color", "dot", "pending", "position", "label", "children"]);
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("timeline", customizePrefixCls);
  const itemClassName = classNames(`${prefixCls}-item`, {
    [`${prefixCls}-item-pending`]: pending
  }, className);
  const customColor = /blue|red|green|gray/.test(color || "") ? void 0 : color;
  const dotClassName = classNames(`${prefixCls}-item-head`, {
    [`${prefixCls}-item-head-custom`]: !!dot,
    [`${prefixCls}-item-head-${color}`]: !customColor
  });
  return /* @__PURE__ */ reactExports.createElement("li", Object.assign({}, restProps, {
    className: itemClassName
  }), label && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-item-label`
  }, label), /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-item-tail`
  }), /* @__PURE__ */ reactExports.createElement("div", {
    className: dotClassName,
    style: {
      borderColor: customColor,
      color: customColor
    }
  }, dot), /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-item-content`
  }, children));
};
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const TimelineItemList = (_a) => {
  var {
    prefixCls,
    className,
    pending = false,
    children,
    items,
    rootClassName,
    reverse = false,
    direction,
    hashId,
    pendingDot,
    mode = ""
  } = _a, restProps = __rest$1(_a, ["prefixCls", "className", "pending", "children", "items", "rootClassName", "reverse", "direction", "hashId", "pendingDot", "mode"]);
  const getPositionCls = (position, idx) => {
    if (mode === "alternate") {
      if (position === "right") return `${prefixCls}-item-right`;
      if (position === "left") return `${prefixCls}-item-left`;
      return idx % 2 === 0 ? `${prefixCls}-item-left` : `${prefixCls}-item-right`;
    }
    if (mode === "left") return `${prefixCls}-item-left`;
    if (mode === "right") return `${prefixCls}-item-right`;
    if (position === "right") return `${prefixCls}-item-right`;
    return "";
  };
  const mergedItems = _toConsumableArray(items || []);
  const pendingNode = typeof pending === "boolean" ? null : pending;
  if (pending) {
    mergedItems.push({
      pending: !!pending,
      dot: pendingDot || /* @__PURE__ */ reactExports.createElement(RefIcon, null),
      children: pendingNode
    });
  }
  if (reverse) {
    mergedItems.reverse();
  }
  const itemsCount = mergedItems.length;
  const lastCls = `${prefixCls}-item-last`;
  const itemsList = mergedItems.filter((item) => !!item).map((item, idx) => {
    var _a2;
    const pendingClass = idx === itemsCount - 2 ? lastCls : "";
    const readyClass = idx === itemsCount - 1 ? lastCls : "";
    const {
      className: itemClassName
    } = item, itemProps = __rest$1(item, ["className"]);
    return /* @__PURE__ */ reactExports.createElement(TimelineItem, Object.assign({}, itemProps, {
      className: classNames([itemClassName, !reverse && !!pending ? pendingClass : readyClass, getPositionCls((_a2 = item === null || item === void 0 ? void 0 : item.position) !== null && _a2 !== void 0 ? _a2 : "", idx)]),
      /* eslint-disable-next-line react/no-array-index-key */
      key: (item === null || item === void 0 ? void 0 : item.key) || idx
    }));
  });
  const hasLabelItem = mergedItems.some((item) => !!(item === null || item === void 0 ? void 0 : item.label));
  const classString = classNames(prefixCls, {
    [`${prefixCls}-pending`]: !!pending,
    [`${prefixCls}-reverse`]: !!reverse,
    [`${prefixCls}-${mode}`]: !!mode && !hasLabelItem,
    [`${prefixCls}-label`]: hasLabelItem,
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, className, rootClassName, hashId);
  return /* @__PURE__ */ reactExports.createElement("ul", Object.assign({}, restProps, {
    className: classString
  }), itemsList);
};
function useItems(items, children) {
  if (items && Array.isArray(items)) {
    return items;
  }
  return toArray(children).map((ele) => {
    var _a, _b;
    return Object.assign({
      children: (_b = (_a = ele === null || ele === void 0 ? void 0 : ele.props) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : ""
    }, ele.props);
  });
}
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Timeline = (props) => {
  const {
    getPrefixCls,
    direction,
    timeline
  } = reactExports.useContext(ConfigContext);
  const {
    prefixCls: customizePrefixCls,
    children,
    items,
    className,
    style
  } = props, restProps = __rest(props, ["prefixCls", "children", "items", "className", "style"]);
  const prefixCls = getPrefixCls("timeline", customizePrefixCls);
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
  const mergedItems = useItems(items, children);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(TimelineItemList, Object.assign({}, restProps, {
    className: classNames(timeline === null || timeline === void 0 ? void 0 : timeline.className, className, cssVarCls, rootCls),
    style: Object.assign(Object.assign({}, timeline === null || timeline === void 0 ? void 0 : timeline.style), style),
    prefixCls,
    direction,
    items: mergedItems,
    hashId
  })));
};
Timeline.Item = TimelineItem;
export {
  Drawer as D,
  Timeline as T
};
