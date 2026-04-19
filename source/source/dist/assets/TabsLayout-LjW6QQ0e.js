import { r as reactExports, a as resetComponent, b as unit, c as composeRef, d as ConfigContext, e as classNames, _ as _toConsumableArray, I as Icon, f as useNavigate, u as useLocation, j as jsxRuntimeExports, O as Outlet } from "./index-CUErrqgd.js";
import "./UserRoleContext-DMxWKclM.js";
import { u as useMenuFunc } from "./useMenuFunc-BrdSDwZ3.js";
import { f as logout } from "./utils-BVQ22sob.js";
import { S as Sider$1, L as LayoutContext, a as SiderContext, M as Menu, D as Dropdown } from "./index-BC0QXd6g.js";
import { R as RefIcon$3 } from "./SettingOutlined-D1FkhzMV.js";
import { c as cloneElement, o as omit } from "./reactNode-TfIvHo6t.js";
import { u as useSize, t as toArray } from "./compact-item-T75FitAV.js";
import { g as genStyleHooks, m as merge } from "./asyncToGenerator-Bn7YJjF8.js";
import { R as RefIcon$4 } from "./AppstoreFilled-BD0mB3dm.js";
import { R as RefResizeObserver, i as initZoomMotion, g as getArrowToken, a as getArrowOffsetToken, b as getArrowStyle, P as PresetColors, c as Popup, T as Tooltip, d as getTransitionName } from "./index-BKheaG9T.js";
import { r as responsiveArray } from "./responsiveObserver-ChKXsNUO.js";
import { u as useBreakpoint } from "./useBreakpoint-CZwDkAga.js";
import { u as useCSSVarCls } from "./useZIndex-BReSjmbj.js";
import "./MenuFuncContext-B04V1YTi.js";
import "./render-uL5zGIDv.js";
import "./context-CN2GVsG0.js";
import "./ExclamationCircleFilled-CXyczA-G.js";
import "./InfoCircleFilled-6TjWreYB.js";
import "./RightOutlined-BAFHU4sg.js";
import "./EllipsisOutlined-BuwqaHFz.js";
import "./Overflow-DO7wolsL.js";
import "./PurePanel-GUILNfpz.js";
import "./button-DMDTHtWf.js";
import "./LoadingOutlined-s4PR_g90.js";
import "./index-DMsHtZNk.js";
const AvatarContext = /* @__PURE__ */ reactExports.createContext({});
const genBaseStyle$1 = (token) => {
  const {
    antCls,
    componentCls,
    iconCls,
    avatarBg,
    avatarColor,
    containerSize,
    containerSizeLG,
    containerSizeSM,
    textFontSize,
    textFontSizeLG,
    textFontSizeSM,
    borderRadius,
    borderRadiusLG,
    borderRadiusSM,
    lineWidth,
    lineType
  } = token;
  const avatarSizeStyle = (size, fontSize, radius) => ({
    width: size,
    height: size,
    borderRadius: "50%",
    [`&${componentCls}-square`]: {
      borderRadius: radius
    },
    [`&${componentCls}-icon`]: {
      fontSize,
      [`> ${iconCls}`]: {
        margin: 0
      }
    }
  });
  return {
    [componentCls]: Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), {
      position: "relative",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      color: avatarColor,
      whiteSpace: "nowrap",
      textAlign: "center",
      verticalAlign: "middle",
      background: avatarBg,
      border: `${unit(lineWidth)} ${lineType} transparent`,
      [`&-image`]: {
        background: "transparent"
      },
      [`${antCls}-image-img`]: {
        display: "block"
      }
    }), avatarSizeStyle(containerSize, textFontSize, borderRadius)), {
      [`&-lg`]: Object.assign({}, avatarSizeStyle(containerSizeLG, textFontSizeLG, borderRadiusLG)),
      [`&-sm`]: Object.assign({}, avatarSizeStyle(containerSizeSM, textFontSizeSM, borderRadiusSM)),
      "> img": {
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    })
  };
};
const genGroupStyle = (token) => {
  const {
    componentCls,
    groupBorderColor,
    groupOverlapping,
    groupSpace
  } = token;
  return {
    [`${componentCls}-group`]: {
      display: "inline-flex",
      [`${componentCls}`]: {
        borderColor: groupBorderColor
      },
      [`> *:not(:first-child)`]: {
        marginInlineStart: groupOverlapping
      }
    },
    [`${componentCls}-group-popover`]: {
      [`${componentCls} + ${componentCls}`]: {
        marginInlineStart: groupSpace
      }
    }
  };
};
const prepareComponentToken$2 = (token) => {
  const {
    controlHeight,
    controlHeightLG,
    controlHeightSM,
    fontSize,
    fontSizeLG,
    fontSizeXL,
    fontSizeHeading3,
    marginXS,
    marginXXS,
    colorBorderBg
  } = token;
  return {
    containerSize: controlHeight,
    containerSizeLG: controlHeightLG,
    containerSizeSM: controlHeightSM,
    textFontSize: Math.round((fontSizeLG + fontSizeXL) / 2),
    textFontSizeLG: fontSizeHeading3,
    textFontSizeSM: fontSize,
    groupSpace: marginXXS,
    groupOverlapping: -marginXS,
    groupBorderColor: colorBorderBg
  };
};
const useStyle$2 = genStyleHooks("Avatar", (token) => {
  const {
    colorTextLightSolid,
    colorTextPlaceholder
  } = token;
  const avatarToken = merge(token, {
    avatarBg: colorTextPlaceholder,
    avatarColor: colorTextLightSolid
  });
  return [genBaseStyle$1(avatarToken), genGroupStyle(avatarToken)];
}, prepareComponentToken$2);
var __rest$3 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const InternalAvatar = (props, ref) => {
  const [scale, setScale] = reactExports.useState(1);
  const [mounted, setMounted] = reactExports.useState(false);
  const [isImgExist, setIsImgExist] = reactExports.useState(true);
  const avatarNodeRef = reactExports.useRef(null);
  const avatarChildrenRef = reactExports.useRef(null);
  const avatarNodeMergeRef = composeRef(ref, avatarNodeRef);
  const {
    getPrefixCls,
    avatar
  } = reactExports.useContext(ConfigContext);
  const avatarCtx = reactExports.useContext(AvatarContext);
  const setScaleParam = () => {
    if (!avatarChildrenRef.current || !avatarNodeRef.current) {
      return;
    }
    const childrenWidth = avatarChildrenRef.current.offsetWidth;
    const nodeWidth = avatarNodeRef.current.offsetWidth;
    if (childrenWidth !== 0 && nodeWidth !== 0) {
      const {
        gap = 4
      } = props;
      if (gap * 2 < nodeWidth) {
        setScale(nodeWidth - gap * 2 < childrenWidth ? (nodeWidth - gap * 2) / childrenWidth : 1);
      }
    }
  };
  reactExports.useEffect(() => {
    setMounted(true);
  }, []);
  reactExports.useEffect(() => {
    setIsImgExist(true);
    setScale(1);
  }, [props.src]);
  reactExports.useEffect(setScaleParam, [props.gap]);
  const handleImgLoadError = () => {
    const {
      onError
    } = props;
    const errorFlag = onError === null || onError === void 0 ? void 0 : onError();
    if (errorFlag !== false) {
      setIsImgExist(false);
    }
  };
  const {
    prefixCls: customizePrefixCls,
    shape,
    size: customSize,
    src,
    srcSet,
    icon,
    className,
    rootClassName,
    alt,
    draggable,
    children,
    crossOrigin
  } = props, others = __rest$3(props, ["prefixCls", "shape", "size", "src", "srcSet", "icon", "className", "rootClassName", "alt", "draggable", "children", "crossOrigin"]);
  const size = useSize((ctxSize) => {
    var _a, _b;
    return (_b = (_a = customSize !== null && customSize !== void 0 ? customSize : avatarCtx === null || avatarCtx === void 0 ? void 0 : avatarCtx.size) !== null && _a !== void 0 ? _a : ctxSize) !== null && _b !== void 0 ? _b : "default";
  });
  const needResponsive = Object.keys(typeof size === "object" ? size || {} : {}).some((key) => ["xs", "sm", "md", "lg", "xl", "xxl"].includes(key));
  const screens = useBreakpoint(needResponsive);
  const responsiveSizeStyle = reactExports.useMemo(() => {
    if (typeof size !== "object") {
      return {};
    }
    const currentBreakpoint = responsiveArray.find((screen) => screens[screen]);
    const currentSize = size[currentBreakpoint];
    return currentSize ? {
      width: currentSize,
      height: currentSize,
      fontSize: currentSize && (icon || children) ? currentSize / 2 : 18
    } : {};
  }, [screens, size]);
  const prefixCls = getPrefixCls("avatar", customizePrefixCls);
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle$2(prefixCls, rootCls);
  const sizeCls = classNames({
    [`${prefixCls}-lg`]: size === "large",
    [`${prefixCls}-sm`]: size === "small"
  });
  const hasImageElement = /* @__PURE__ */ reactExports.isValidElement(src);
  const mergedShape = shape || (avatarCtx === null || avatarCtx === void 0 ? void 0 : avatarCtx.shape) || "circle";
  const classString = classNames(prefixCls, sizeCls, avatar === null || avatar === void 0 ? void 0 : avatar.className, `${prefixCls}-${mergedShape}`, {
    [`${prefixCls}-image`]: hasImageElement || src && isImgExist,
    [`${prefixCls}-icon`]: !!icon
  }, cssVarCls, rootCls, className, rootClassName, hashId);
  const sizeStyle = typeof size === "number" ? {
    width: size,
    height: size,
    fontSize: icon ? size / 2 : 18
  } : {};
  let childrenToRender;
  if (typeof src === "string" && isImgExist) {
    childrenToRender = /* @__PURE__ */ reactExports.createElement("img", {
      src,
      draggable,
      srcSet,
      onError: handleImgLoadError,
      alt,
      crossOrigin
    });
  } else if (hasImageElement) {
    childrenToRender = src;
  } else if (icon) {
    childrenToRender = icon;
  } else if (mounted || scale !== 1) {
    const transformString = `scale(${scale})`;
    const childrenStyle = {
      msTransform: transformString,
      WebkitTransform: transformString,
      transform: transformString
    };
    childrenToRender = /* @__PURE__ */ reactExports.createElement(RefResizeObserver, {
      onResize: setScaleParam
    }, /* @__PURE__ */ reactExports.createElement("span", {
      className: `${prefixCls}-string`,
      ref: avatarChildrenRef,
      style: Object.assign({}, childrenStyle)
    }, children));
  } else {
    childrenToRender = /* @__PURE__ */ reactExports.createElement("span", {
      className: `${prefixCls}-string`,
      style: {
        opacity: 0
      },
      ref: avatarChildrenRef
    }, children);
  }
  delete others.onError;
  delete others.gap;
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement("span", Object.assign({}, others, {
    style: Object.assign(Object.assign(Object.assign(Object.assign({}, sizeStyle), responsiveSizeStyle), avatar === null || avatar === void 0 ? void 0 : avatar.style), others.style),
    className: classString,
    ref: avatarNodeMergeRef
  }), childrenToRender));
};
const Avatar$1 = /* @__PURE__ */ reactExports.forwardRef(InternalAvatar);
const getRenderPropValue = (propValue) => {
  if (!propValue) {
    return null;
  }
  return typeof propValue === "function" ? propValue() : propValue;
};
const genBaseStyle = (token) => {
  const {
    componentCls,
    popoverColor,
    titleMinWidth,
    fontWeightStrong,
    innerPadding,
    boxShadowSecondary,
    colorTextHeading,
    borderRadiusLG,
    zIndexPopup,
    titleMarginBottom,
    colorBgElevated,
    popoverBg,
    titleBorderBottom,
    innerContentPadding,
    titlePadding
  } = token;
  return [
    {
      [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
        position: "absolute",
        top: 0,
        // use `left` to fix https://github.com/ant-design/ant-design/issues/39195
        left: {
          _skip_check_: true,
          value: 0
        },
        zIndex: zIndexPopup,
        fontWeight: "normal",
        whiteSpace: "normal",
        textAlign: "start",
        cursor: "auto",
        userSelect: "text",
        transformOrigin: `var(--arrow-x, 50%) var(--arrow-y, 50%)`,
        "--antd-arrow-background-color": colorBgElevated,
        "&-rtl": {
          direction: "rtl"
        },
        "&-hidden": {
          display: "none"
        },
        [`${componentCls}-content`]: {
          position: "relative"
        },
        [`${componentCls}-inner`]: {
          backgroundColor: popoverBg,
          backgroundClip: "padding-box",
          borderRadius: borderRadiusLG,
          boxShadow: boxShadowSecondary,
          padding: innerPadding
        },
        [`${componentCls}-title`]: {
          minWidth: titleMinWidth,
          marginBottom: titleMarginBottom,
          color: colorTextHeading,
          fontWeight: fontWeightStrong,
          borderBottom: titleBorderBottom,
          padding: titlePadding
        },
        [`${componentCls}-inner-content`]: {
          color: popoverColor,
          padding: innerContentPadding
        }
      })
    },
    // Arrow Style
    getArrowStyle(token, "var(--antd-arrow-background-color)"),
    // Pure Render
    {
      [`${componentCls}-pure`]: {
        position: "relative",
        maxWidth: "none",
        margin: token.sizePopupArrow,
        display: "inline-block",
        [`${componentCls}-content`]: {
          display: "inline-block"
        }
      }
    }
  ];
};
const genColorStyle = (token) => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: PresetColors.map((colorKey) => {
      const lightColor = token[`${colorKey}6`];
      return {
        [`&${componentCls}-${colorKey}`]: {
          "--antd-arrow-background-color": lightColor,
          [`${componentCls}-inner`]: {
            backgroundColor: lightColor
          },
          [`${componentCls}-arrow`]: {
            background: "transparent"
          }
        }
      };
    })
  };
};
const prepareComponentToken$1 = (token) => {
  const {
    lineWidth,
    controlHeight,
    fontHeight,
    padding,
    wireframe,
    zIndexPopupBase,
    borderRadiusLG,
    marginXS,
    lineType,
    colorSplit,
    paddingSM
  } = token;
  const titlePaddingBlockDist = controlHeight - fontHeight;
  const popoverTitlePaddingBlockTop = titlePaddingBlockDist / 2;
  const popoverTitlePaddingBlockBottom = titlePaddingBlockDist / 2 - lineWidth;
  const popoverPaddingHorizontal = padding;
  return Object.assign(Object.assign(Object.assign({
    titleMinWidth: 177,
    zIndexPopup: zIndexPopupBase + 30
  }, getArrowToken(token)), getArrowOffsetToken({
    contentRadius: borderRadiusLG,
    limitVerticalRadius: true
  })), {
    // internal
    innerPadding: wireframe ? 0 : 12,
    titleMarginBottom: wireframe ? 0 : marginXS,
    titlePadding: wireframe ? `${popoverTitlePaddingBlockTop}px ${popoverPaddingHorizontal}px ${popoverTitlePaddingBlockBottom}px` : 0,
    titleBorderBottom: wireframe ? `${lineWidth}px ${lineType} ${colorSplit}` : "none",
    innerContentPadding: wireframe ? `${paddingSM}px ${popoverPaddingHorizontal}px` : 0
  });
};
const useStyle$1 = genStyleHooks("Popover", (token) => {
  const {
    colorBgElevated,
    colorText
  } = token;
  const popoverToken = merge(token, {
    popoverBg: colorBgElevated,
    popoverColor: colorText
  });
  return [genBaseStyle(popoverToken), genColorStyle(popoverToken), initZoomMotion(popoverToken, "zoom-big")];
}, prepareComponentToken$1, {
  resetStyle: false,
  deprecatedTokens: [["width", "titleMinWidth"], ["minWidth", "titleMinWidth"]]
});
var __rest$2 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const getOverlay = (prefixCls, title, content) => {
  if (!title && !content) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, title && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-title`
  }, getRenderPropValue(title)), /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-inner-content`
  }, getRenderPropValue(content)));
};
const RawPurePanel = (props) => {
  const {
    hashId,
    prefixCls,
    className,
    style,
    placement = "top",
    title,
    content,
    children
  } = props;
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(hashId, prefixCls, `${prefixCls}-pure`, `${prefixCls}-placement-${placement}`, className),
    style
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-arrow`
  }), /* @__PURE__ */ reactExports.createElement(Popup, Object.assign({}, props, {
    className: hashId,
    prefixCls
  }), children || getOverlay(prefixCls, title, content)));
};
const PurePanel = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className
  } = props, restProps = __rest$2(props, ["prefixCls", "className"]);
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("popover", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle$1(prefixCls);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(RawPurePanel, Object.assign({}, restProps, {
    prefixCls,
    hashId,
    className: classNames(className, cssVarCls)
  })));
};
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Overlay = (_ref) => {
  let {
    title,
    content,
    prefixCls
  } = _ref;
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, title && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-title`
  }, getRenderPropValue(title)), /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-inner-content`
  }, getRenderPropValue(content)));
};
const Popover = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    title,
    content,
    overlayClassName,
    placement = "top",
    trigger = "hover",
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    overlayStyle = {}
  } = props, otherProps = __rest$1(props, ["prefixCls", "title", "content", "overlayClassName", "placement", "trigger", "mouseEnterDelay", "mouseLeaveDelay", "overlayStyle"]);
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("popover", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle$1(prefixCls);
  const rootPrefixCls = getPrefixCls();
  const overlayCls = classNames(overlayClassName, hashId, cssVarCls);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(Tooltip, Object.assign({
    placement,
    trigger,
    mouseEnterDelay,
    mouseLeaveDelay,
    overlayStyle
  }, otherProps, {
    prefixCls,
    overlayClassName: overlayCls,
    ref,
    overlay: title || content ? /* @__PURE__ */ reactExports.createElement(Overlay, {
      prefixCls,
      title,
      content
    }) : null,
    transitionName: getTransitionName(rootPrefixCls, "zoom-big", otherProps.transitionName),
    "data-popover-inject": true
  })));
});
Popover._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
const AvatarContextProvider = (props) => {
  const {
    size,
    shape
  } = reactExports.useContext(AvatarContext);
  const avatarContextValue = reactExports.useMemo(() => ({
    size: props.size || size,
    shape: props.shape || shape
  }), [props.size, props.shape, size, shape]);
  return /* @__PURE__ */ reactExports.createElement(AvatarContext.Provider, {
    value: avatarContextValue
  }, props.children);
};
const Group = (props) => {
  const {
    getPrefixCls,
    direction
  } = reactExports.useContext(ConfigContext);
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    maxCount,
    maxStyle,
    size,
    shape,
    maxPopoverPlacement = "top",
    maxPopoverTrigger = "hover",
    children
  } = props;
  const prefixCls = getPrefixCls("avatar", customizePrefixCls);
  const groupPrefixCls = `${prefixCls}-group`;
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle$2(prefixCls, rootCls);
  const cls = classNames(groupPrefixCls, {
    [`${groupPrefixCls}-rtl`]: direction === "rtl"
  }, cssVarCls, rootCls, className, rootClassName, hashId);
  const childrenWithProps = toArray(children).map((child, index) => cloneElement(child, {
    key: `avatar-key-${index}`
  }));
  const numOfChildren = childrenWithProps.length;
  if (maxCount && maxCount < numOfChildren) {
    const childrenShow = childrenWithProps.slice(0, maxCount);
    const childrenHidden = childrenWithProps.slice(maxCount, numOfChildren);
    childrenShow.push(/* @__PURE__ */ reactExports.createElement(Popover, {
      key: "avatar-popover-key",
      content: childrenHidden,
      trigger: maxPopoverTrigger,
      placement: maxPopoverPlacement,
      overlayClassName: `${groupPrefixCls}-popover`,
      destroyTooltipOnHide: true
    }, /* @__PURE__ */ reactExports.createElement(Avatar$1, {
      style: maxStyle
    }, `+${numOfChildren - maxCount}`)));
    return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(AvatarContextProvider, {
      shape,
      size
    }, /* @__PURE__ */ reactExports.createElement("div", {
      className: cls,
      style
    }, childrenShow)));
  }
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(AvatarContextProvider, {
    shape,
    size
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: cls,
    style
  }, childrenWithProps)));
};
const Avatar = Avatar$1;
Avatar.Group = Group;
function useHasSider(siders, children, hasSider) {
  if (typeof hasSider === "boolean") {
    return hasSider;
  }
  if (siders.length) {
    return true;
  }
  const childNodes = toArray(children);
  return childNodes.some((node) => node.type === Sider$1);
}
const genLayoutLightStyle = (token) => {
  const {
    componentCls,
    bodyBg,
    lightSiderBg,
    lightTriggerBg,
    lightTriggerColor
  } = token;
  return {
    [`${componentCls}-sider-light`]: {
      background: lightSiderBg,
      [`${componentCls}-sider-trigger`]: {
        color: lightTriggerColor,
        background: lightTriggerBg
      },
      [`${componentCls}-sider-zero-width-trigger`]: {
        color: lightTriggerColor,
        background: lightTriggerBg,
        border: `1px solid ${bodyBg}`,
        // Safe to modify to any other color
        borderInlineStart: 0
      }
    }
  };
};
const genLayoutStyle = (token) => {
  const {
    antCls,
    // .ant
    componentCls,
    // .ant-layout
    colorText,
    triggerColor,
    footerBg,
    triggerBg,
    headerHeight,
    headerPadding,
    headerColor,
    footerPadding,
    triggerHeight,
    zeroTriggerHeight,
    zeroTriggerWidth,
    motionDurationMid,
    motionDurationSlow,
    fontSize,
    borderRadius,
    bodyBg,
    headerBg,
    siderBg
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign({
      display: "flex",
      flex: "auto",
      flexDirection: "column",
      /* fix firefox can't set height smaller than content on flex item */
      minHeight: 0,
      background: bodyBg,
      "&, *": {
        boxSizing: "border-box"
      },
      [`&${componentCls}-has-sider`]: {
        flexDirection: "row",
        [`> ${componentCls}, > ${componentCls}-content`]: {
          // https://segmentfault.com/a/1190000019498300
          width: 0
        }
      },
      [`${componentCls}-header, &${componentCls}-footer`]: {
        flex: "0 0 auto"
      },
      [`${componentCls}-sider`]: {
        position: "relative",
        // fix firefox can't set width smaller than content on flex item
        minWidth: 0,
        background: siderBg,
        transition: `all ${motionDurationMid}, background 0s`,
        "&-children": {
          height: "100%",
          // Hack for fixing margin collapse bug
          // https://github.com/ant-design/ant-design/issues/7967
          // solution from https://stackoverflow.com/a/33132624/3040605
          marginTop: -0.1,
          paddingTop: 0.1,
          [`${antCls}-menu${antCls}-menu-inline-collapsed`]: {
            width: "auto"
          }
        },
        "&-has-trigger": {
          paddingBottom: triggerHeight
        },
        "&-right": {
          order: 1
        },
        "&-trigger": {
          position: "fixed",
          bottom: 0,
          zIndex: 1,
          height: triggerHeight,
          color: triggerColor,
          lineHeight: unit(triggerHeight),
          textAlign: "center",
          background: triggerBg,
          cursor: "pointer",
          transition: `all ${motionDurationMid}`
        },
        "&-zero-width": {
          "> *": {
            overflow: "hidden"
          },
          "&-trigger": {
            position: "absolute",
            top: headerHeight,
            insetInlineEnd: token.calc(zeroTriggerWidth).mul(-1).equal(),
            zIndex: 1,
            width: zeroTriggerWidth,
            height: zeroTriggerHeight,
            color: triggerColor,
            fontSize: token.fontSizeXL,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: siderBg,
            borderStartStartRadius: 0,
            borderStartEndRadius: borderRadius,
            borderEndEndRadius: borderRadius,
            borderEndStartRadius: 0,
            cursor: "pointer",
            transition: `background ${motionDurationSlow} ease`,
            "&::after": {
              position: "absolute",
              inset: 0,
              background: "transparent",
              transition: `all ${motionDurationSlow}`,
              content: '""'
            },
            "&:hover::after": {
              background: `rgba(255, 255, 255, 0.2)`
            },
            "&-right": {
              insetInlineStart: token.calc(zeroTriggerWidth).mul(-1).equal(),
              borderStartStartRadius: borderRadius,
              borderStartEndRadius: 0,
              borderEndEndRadius: 0,
              borderEndStartRadius: borderRadius
            }
          }
        }
      }
    }, genLayoutLightStyle(token)), {
      // RTL
      "&-rtl": {
        direction: "rtl"
      }
    }),
    // ==================== Header ====================
    [`${componentCls}-header`]: {
      height: headerHeight,
      padding: headerPadding,
      color: headerColor,
      lineHeight: unit(headerHeight),
      background: headerBg,
      // Other components/menu/style/index.less line:686
      // Integration with header element so menu items have the same height
      [`${antCls}-menu`]: {
        lineHeight: "inherit"
      }
    },
    // ==================== Footer ====================
    [`${componentCls}-footer`]: {
      padding: footerPadding,
      color: colorText,
      fontSize,
      background: footerBg
    },
    // =================== Content ====================
    [`${componentCls}-content`]: {
      flex: "auto",
      color: colorText,
      // fix firefox can't set height smaller than content on flex item
      minHeight: 0
    }
  };
};
const prepareComponentToken = (token) => {
  const {
    colorBgLayout,
    controlHeight,
    controlHeightLG,
    colorText,
    controlHeightSM,
    marginXXS,
    colorTextLightSolid,
    colorBgContainer
  } = token;
  const paddingInline = controlHeightLG * 1.25;
  return {
    // Deprecated
    colorBgHeader: "#001529",
    colorBgBody: colorBgLayout,
    colorBgTrigger: "#002140",
    bodyBg: colorBgLayout,
    headerBg: "#001529",
    headerHeight: controlHeight * 2,
    headerPadding: `0 ${paddingInline}px`,
    headerColor: colorText,
    footerPadding: `${controlHeightSM}px ${paddingInline}px`,
    footerBg: colorBgLayout,
    siderBg: "#001529",
    triggerHeight: controlHeightLG + marginXXS * 2,
    triggerBg: "#002140",
    triggerColor: colorTextLightSolid,
    zeroTriggerWidth: controlHeightLG,
    zeroTriggerHeight: controlHeightLG,
    lightSiderBg: colorBgContainer,
    lightTriggerBg: colorBgContainer,
    lightTriggerColor: colorText
  };
};
const useStyle = genStyleHooks("Layout", (token) => [genLayoutStyle(token)], prepareComponentToken, {
  deprecatedTokens: [["colorBgBody", "bodyBg"], ["colorBgHeader", "headerBg"], ["colorBgTrigger", "triggerBg"]]
});
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function generator(_ref) {
  let {
    suffixCls,
    tagName,
    displayName
  } = _ref;
  return (BasicComponent) => {
    const Adapter = /* @__PURE__ */ reactExports.forwardRef((props, ref) => /* @__PURE__ */ reactExports.createElement(BasicComponent, Object.assign({
      ref,
      suffixCls,
      tagName
    }, props)));
    return Adapter;
  };
}
const Basic = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    suffixCls,
    className,
    tagName: TagName
  } = props, others = __rest(props, ["prefixCls", "suffixCls", "className", "tagName"]);
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("layout", customizePrefixCls);
  const [wrapSSR, hashId, cssVarCls] = useStyle(prefixCls);
  const prefixWithSuffixCls = suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
  return wrapSSR(/* @__PURE__ */ reactExports.createElement(TagName, Object.assign({
    className: classNames(customizePrefixCls || prefixWithSuffixCls, className, hashId, cssVarCls),
    ref
  }, others)));
});
const BasicLayout = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    direction
  } = reactExports.useContext(ConfigContext);
  const [siders, setSiders] = reactExports.useState([]);
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    children,
    hasSider,
    tagName: Tag,
    style
  } = props, others = __rest(props, ["prefixCls", "className", "rootClassName", "children", "hasSider", "tagName", "style"]);
  const passedProps = omit(others, ["suffixCls"]);
  const {
    getPrefixCls,
    layout
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("layout", customizePrefixCls);
  const mergedHasSider = useHasSider(siders, children, hasSider);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const classString = classNames(prefixCls, {
    [`${prefixCls}-has-sider`]: mergedHasSider,
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, layout === null || layout === void 0 ? void 0 : layout.className, className, rootClassName, hashId, cssVarCls);
  const contextValue = reactExports.useMemo(() => ({
    siderHook: {
      addSider: (id) => {
        setSiders((prev) => [].concat(_toConsumableArray(prev), [id]));
      },
      removeSider: (id) => {
        setSiders((prev) => prev.filter((currentId) => currentId !== id));
      }
    }
  }), []);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(LayoutContext.Provider, {
    value: contextValue
  }, /* @__PURE__ */ reactExports.createElement(Tag, Object.assign({
    ref,
    className: classString,
    style: Object.assign(Object.assign({}, layout === null || layout === void 0 ? void 0 : layout.style), style)
  }, passedProps), children)));
});
const Layout$1 = generator({
  tagName: "div",
  displayName: "Layout"
})(BasicLayout);
const Header$1 = generator({
  suffixCls: "header",
  tagName: "header",
  displayName: "Header"
})(Basic);
const Footer = generator({
  suffixCls: "footer",
  tagName: "footer",
  displayName: "Footer"
})(Basic);
const Content$1 = generator({
  suffixCls: "content",
  tagName: "main",
  displayName: "Content"
})(Basic);
const Layout = Layout$1;
Layout.Header = Header$1;
Layout.Footer = Footer;
Layout.Content = Content$1;
Layout.Sider = Sider$1;
Layout._InternalSiderContext = SiderContext;
var BellOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M816 768h-24V428c0-141.1-104.3-257.7-240-277.1V112c0-22.1-17.9-40-40-40s-40 17.9-40 40v38.9c-135.7 19.4-240 136-240 277.1v340h-24c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h216c0 61.8 50.2 112 112 112s112-50.2 112-112h216c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM512 888c-26.5 0-48-21.5-48-48h96c0 26.5-21.5 48-48 48zM304 768V428c0-55.6 21.6-107.8 60.9-147.1S456.4 220 512 220c55.6 0 107.8 21.6 147.1 60.9S720 372.4 720 428v340H304z" } }] }, "name": "bell", "theme": "outlined" };
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}
const BellOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$2({}, props, {
  ref,
  icon: BellOutlined$1
}));
const RefIcon$2 = /* @__PURE__ */ reactExports.forwardRef(BellOutlined);
var LogoutOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8-7 8.5-14.5 16.7-22.4 24.5a353.84 353.84 0 01-112.7 75.9A352.8 352.8 0 01512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.84 353.84 0 01-112.7-75.9 353.28 353.28 0 01-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 7.9 7.9 15.3 16.1 22.4 24.5 3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82 271.7 82.6 79.6 277.1 82 516.4 84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7 3.4-5.3-.4-12.3-6.7-12.3zm88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 000-12.6z" } }] }, "name": "logout", "theme": "outlined" };
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
const LogoutOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$1({}, props, {
  ref,
  icon: LogoutOutlined$1
}));
const RefIcon$1 = /* @__PURE__ */ reactExports.forwardRef(LogoutOutlined);
var UserOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" } }] }, "name": "user", "theme": "outlined" };
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
const UserOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: UserOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(UserOutlined);
const transformMenuData = (menuData) => {
  const topLevelMenus = menuData.filter(
    (menu) => !menu.parentMenuId || menu.parentMenuId === -1
  );
  const topMenuItems = topLevelMenus.map((menu) => ({
    key: menu.menuUrl,
    label: menu.menuName
  }));
  const sideMenuMap = {};
  const menuTitleMap = {};
  const buildMenuTree = (parentId) => {
    const children = menuData.filter((menu) => menu.parentMenuId === parentId);
    return children.map((childMenu) => {
      const grandChildren = buildMenuTree(childMenu.menuId);
      return {
        key: childMenu.menuUrl,
        label: childMenu.menuName,
        children: grandChildren.length > 0 ? grandChildren : void 0
      };
    });
  };
  topLevelMenus.forEach((topMenu) => {
    const sideMenuItems = buildMenuTree(topMenu.menuId);
    sideMenuMap[topMenu.menuUrl] = sideMenuItems;
    menuTitleMap[topMenu.menuUrl] = topMenu.menuName;
  });
  return {
    topMenuItems,
    sideMenuMap,
    menuTitleMap
  };
};
const getActiveTopMenu = (pathname, menuData) => {
  const defaultMenu = "report";
  if (!menuData || menuData.length === 0) {
    return defaultMenu;
  }
  const currentMenu = menuData.find(
    (menu) => menu.menuUrl === pathname || pathname.startsWith(menu.menuUrl) && menu.menuUrl !== "/"
  );
  if (!currentMenu) {
    return defaultMenu;
  }
  if (currentMenu.parentMenuId && currentMenu.parentMenuId !== -1) {
    const parentMenu = menuData.find((menu) => menu.menuId === currentMenu.parentMenuId);
    if (parentMenu) {
      return parentMenu.menuUrl;
    }
  }
  return currentMenu.menuUrl;
};
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  var _a;
  const navigate = useNavigate();
  const location = useLocation();
  const { flatMenuData, menuItemConfig, leafMenuIds, menuIdToPathMap, menuPathToIdMap } = useMenuFunc();
  const workGroupList = [
    { workGroupId: 1, workGroupName: "默认工作台", sobId: 1 }
  ];
  const activeWorkGroup = workGroupList[0];
  const setActiveWorkGroup = () => {
  };
  const userRoles = {
    activeRoleId: 1,
    availableRoles: [
      { roleId: 1, roleName: "默认角色" }
    ]
  };
  const setActiveRole = () => {
  };
  const [activeTopMenu, setActiveTopMenu] = reactExports.useState("report");
  const [topMenuItems, setTopMenuItems] = reactExports.useState([]);
  const [sideMenuItems, setSideMenuItems] = reactExports.useState([]);
  const [sideMenuTitle, setSideMenuTitle] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (flatMenuData) {
      const currentPath = location.pathname;
      const { topMenuItems: topMenuItems2, sideMenuMap, menuTitleMap } = transformMenuData(flatMenuData);
      setTopMenuItems(topMenuItems2);
      const activeMenu = getActiveTopMenu(currentPath, flatMenuData);
      setActiveTopMenu(activeMenu);
      setSideMenuItems(sideMenuMap[activeMenu] || []);
      setSideMenuTitle(menuTitleMap[activeMenu] || "");
    }
  }, [flatMenuData, location.pathname]);
  const handleMenuClick = (menuItem) => {
    if (menuItem.key && menuItem.key !== activeTopMenu) {
      navigate(menuItem.key);
    }
  };
  const handleSideMenuClick = (menuItem) => {
    if (menuItem.key) {
      navigate(menuItem.key);
    }
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const userMenu = /* @__PURE__ */ jsxRuntimeExports.jsxs(Menu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Menu.Item, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}), children: "个人中心" }, "profile"),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Menu.Item, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}), children: "系统设置" }, "settings"),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Menu.Divider, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Menu.Item, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}), onClick: handleLogout, children: "退出登录" }, "logout")
  ] });
  const workGroupMenu = /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { children: workGroupList.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Menu.Item,
    {
      onClick: () => setActiveWorkGroup(group.workGroupId),
      children: group.workGroupName
    },
    group.workGroupId
  )) });
  const roleMenu = /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { children: userRoles.availableRoles.map((role) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Menu.Item,
    {
      onClick: () => setActiveRole(role.roleId),
      children: role.roleName
    },
    role.roleId
  )) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { style: { height: "100vh", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Header,
      {
        style: {
          padding: "0 24px",
          height: 56,
          background: "#001529",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "white"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 20, fontWeight: "bold" }, children: "风控管理平台" }),
            topMenuItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Menu,
              {
                mode: "horizontal",
                selectedKeys: [activeTopMenu],
                onClick: handleMenuClick,
                style: {
                  background: "transparent",
                  borderBottom: "none",
                  color: "white",
                  lineHeight: "56px"
                },
                items: topMenuItems
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 24 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dropdown, { overlay: workGroupMenu, placement: "bottomRight", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, { style: { fontSize: 16 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: (activeWorkGroup == null ? void 0 : activeWorkGroup.workGroupName) || "工作台" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dropdown, { overlay: roleMenu, placement: "bottomRight", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { style: { fontSize: 16 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ((_a = userRoles.availableRoles.find((r) => r.roleId === userRoles.activeRoleId)) == null ? void 0 : _a.roleName) || "角色" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { style: { fontSize: 18, cursor: "pointer" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dropdown, { overlay: userMenu, placement: "bottomRight", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "用户" })
            ] }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
      sideMenuItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Sider,
        {
          width: 240,
          style: {
            background: "#fff",
            borderRight: "1px solid #f0f0f0",
            overflow: "auto"
          },
          children: [
            sideMenuTitle && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  padding: "16px 24px",
                  fontSize: 16,
                  fontWeight: "bold",
                  borderBottom: "1px solid #f0f0f0"
                },
                children: sideMenuTitle
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Menu,
              {
                mode: "inline",
                selectedKeys: [location.pathname],
                onClick: handleSideMenuClick,
                style: { borderRight: "none" },
                items: sideMenuItems
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Content,
        {
          style: {
            padding: 24,
            background: "#f0f2f5",
            overflow: "auto"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                background: "#fff",
                padding: 24,
                borderRadius: 4,
                minHeight: "calc(100vh - 112px)",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
            }
          )
        }
      )
    ] })
  ] });
};
const TabsLayout = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MainLayout, { children });
};
export {
  TabsLayout as default
};
