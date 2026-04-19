import { a3 as canUseDom, r as reactExports, s as _extends, a6 as getDefaultExportFromCjs, al as gold, b as unit, e as classNames, d as ConfigContext, c as composeRef, P as useLayoutEffect, _ as _toConsumableArray } from "./index-CUErrqgd.js";
import { I as Icon, g as genStyleHooks } from "./asyncToGenerator-Bn7YJjF8.js";
import { T as Tooltip, u as useMergedState, R as RefResizeObserver } from "./index-BKheaG9T.js";
import { t as toArray } from "./compact-item-T75FitAV.js";
import { c as cloneElement, o as omit } from "./reactNode-TfIvHo6t.js";
import { a as KeyCode } from "./useZIndex-BReSjmbj.js";
import { T as TextArea, q as useLocale } from "./TextArea-Cw6hnbxh.js";
const operationUnit = (token) => ({
  // FIXME: This use link but is a operation unit. Seems should be a colorPrimary.
  // And Typography use this to generate link style which should not do this.
  color: token.colorLink,
  textDecoration: "none",
  outline: "none",
  cursor: "pointer",
  transition: `color ${token.motionDurationSlow}`,
  "&:focus, &:hover": {
    color: token.colorLinkHover
  },
  "&:active": {
    color: token.colorLinkActive
  }
});
var isStyleNameSupport = function isStyleNameSupport2(styleName) {
  if (canUseDom() && window.document.documentElement) {
    var styleNameList = Array.isArray(styleName) ? styleName : [styleName];
    var documentElement = window.document.documentElement;
    return styleNameList.some(function(name) {
      return name in documentElement.style;
    });
  }
  return false;
};
var isStyleValueSupport = function isStyleValueSupport2(styleName, value) {
  if (!isStyleNameSupport(styleName)) {
    return false;
  }
  var ele = document.createElement("div");
  var origin = ele.style[styleName];
  ele.style[styleName] = value;
  return ele.style[styleName] !== origin;
};
function isStyleSupport(styleName, styleValue) {
  if (!Array.isArray(styleName) && styleValue !== void 0) {
    return isStyleValueSupport(styleName, styleValue);
  }
  return isStyleNameSupport(styleName);
}
var CheckOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" } }] }, "name": "check", "theme": "outlined" };
var CheckOutlined = function CheckOutlined2(props, ref) {
  return /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
    ref,
    icon: CheckOutlined$1
  }));
};
var RefIcon$3 = /* @__PURE__ */ reactExports.forwardRef(CheckOutlined);
var __rest$5 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const inlineStyle = {
  border: 0,
  background: "transparent",
  padding: 0,
  lineHeight: "inherit",
  display: "inline-block"
};
const TransButton = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const onKeyDown = (event) => {
    const {
      keyCode
    } = event;
    if (keyCode === KeyCode.ENTER) {
      event.preventDefault();
    }
  };
  const onKeyUp = (event) => {
    const {
      keyCode
    } = event;
    const {
      onClick
    } = props;
    if (keyCode === KeyCode.ENTER && onClick) {
      onClick();
    }
  };
  const {
    style,
    noStyle,
    disabled
  } = props, restProps = __rest$5(props, ["style", "noStyle", "disabled"]);
  let mergedStyle = {};
  if (!noStyle) {
    mergedStyle = Object.assign({}, inlineStyle);
  }
  if (disabled) {
    mergedStyle.pointerEvents = "none";
  }
  mergedStyle = Object.assign(Object.assign({}, mergedStyle), style);
  return /* @__PURE__ */ reactExports.createElement("div", Object.assign({
    role: "button",
    tabIndex: 0,
    ref
  }, restProps, {
    onKeyDown,
    onKeyUp,
    style: mergedStyle
  }));
});
var EditOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" } }] }, "name": "edit", "theme": "outlined" };
var EditOutlined = function EditOutlined2(props, ref) {
  return /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
    ref,
    icon: EditOutlined$1
  }));
};
var RefIcon$2 = /* @__PURE__ */ reactExports.forwardRef(EditOutlined);
var toggleSelection;
var hasRequiredToggleSelection;
function requireToggleSelection() {
  if (hasRequiredToggleSelection) return toggleSelection;
  hasRequiredToggleSelection = 1;
  toggleSelection = function() {
    var selection = document.getSelection();
    if (!selection.rangeCount) {
      return function() {
      };
    }
    var active = document.activeElement;
    var ranges = [];
    for (var i = 0; i < selection.rangeCount; i++) {
      ranges.push(selection.getRangeAt(i));
    }
    switch (active.tagName.toUpperCase()) {
      // .toUpperCase handles XHTML
      case "INPUT":
      case "TEXTAREA":
        active.blur();
        break;
      default:
        active = null;
        break;
    }
    selection.removeAllRanges();
    return function() {
      selection.type === "Caret" && selection.removeAllRanges();
      if (!selection.rangeCount) {
        ranges.forEach(function(range) {
          selection.addRange(range);
        });
      }
      active && active.focus();
    };
  };
  return toggleSelection;
}
var copyToClipboard;
var hasRequiredCopyToClipboard;
function requireCopyToClipboard() {
  if (hasRequiredCopyToClipboard) return copyToClipboard;
  hasRequiredCopyToClipboard = 1;
  var deselectCurrent = requireToggleSelection();
  var clipboardToIE11Formatting = {
    "text/plain": "Text",
    "text/html": "Url",
    "default": "Text"
  };
  var defaultMessage = "Copy to clipboard: #{key}, Enter";
  function format(message) {
    var copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
    return message.replace(/#{\s*key\s*}/g, copyKey);
  }
  function copy2(text, options) {
    var debug, message, reselectPrevious, range, selection, mark, success = false;
    if (!options) {
      options = {};
    }
    debug = options.debug || false;
    try {
      reselectPrevious = deselectCurrent();
      range = document.createRange();
      selection = document.getSelection();
      mark = document.createElement("span");
      mark.textContent = text;
      mark.ariaHidden = "true";
      mark.style.all = "unset";
      mark.style.position = "fixed";
      mark.style.top = 0;
      mark.style.clip = "rect(0, 0, 0, 0)";
      mark.style.whiteSpace = "pre";
      mark.style.webkitUserSelect = "text";
      mark.style.MozUserSelect = "text";
      mark.style.msUserSelect = "text";
      mark.style.userSelect = "text";
      mark.addEventListener("copy", function(e) {
        e.stopPropagation();
        if (options.format) {
          e.preventDefault();
          if (typeof e.clipboardData === "undefined") {
            debug && console.warn("unable to use e.clipboardData");
            debug && console.warn("trying IE specific stuff");
            window.clipboardData.clearData();
            var format2 = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting["default"];
            window.clipboardData.setData(format2, text);
          } else {
            e.clipboardData.clearData();
            e.clipboardData.setData(options.format, text);
          }
        }
        if (options.onCopy) {
          e.preventDefault();
          options.onCopy(e.clipboardData);
        }
      });
      document.body.appendChild(mark);
      range.selectNodeContents(mark);
      selection.addRange(range);
      var successful = document.execCommand("copy");
      if (!successful) {
        throw new Error("copy command was unsuccessful");
      }
      success = true;
    } catch (err) {
      debug && console.error("unable to copy using execCommand: ", err);
      debug && console.warn("trying IE specific stuff");
      try {
        window.clipboardData.setData(options.format || "text", text);
        options.onCopy && options.onCopy(window.clipboardData);
        success = true;
      } catch (err2) {
        debug && console.error("unable to copy using clipboardData: ", err2);
        debug && console.error("falling back to prompt");
        message = format("message" in options ? options.message : defaultMessage);
        window.prompt(message, text);
      }
    } finally {
      if (selection) {
        if (typeof selection.removeRange == "function") {
          selection.removeRange(range);
        } else {
          selection.removeAllRanges();
        }
      }
      if (mark) {
        document.body.removeChild(mark);
      }
      reselectPrevious();
    }
    return success;
  }
  copyToClipboard = copy2;
  return copyToClipboard;
}
var copyToClipboardExports = requireCopyToClipboard();
const copy = /* @__PURE__ */ getDefaultExportFromCjs(copyToClipboardExports);
var EnterOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M864 170h-60c-4.4 0-8 3.6-8 8v518H310v-73c0-6.7-7.8-10.5-13-6.3l-141.9 112a8 8 0 000 12.6l141.9 112c5.3 4.2 13 .4 13-6.3v-75h498c35.3 0 64-28.7 64-64V178c0-4.4-3.6-8-8-8z" } }] }, "name": "enter", "theme": "outlined" };
var EnterOutlined = function EnterOutlined2(props, ref) {
  return /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
    ref,
    icon: EnterOutlined$1
  }));
};
var RefIcon$1 = /* @__PURE__ */ reactExports.forwardRef(EnterOutlined);
const getTitleStyle = (fontSize, lineHeight, color, token) => {
  const {
    titleMarginBottom,
    fontWeightStrong
  } = token;
  return {
    marginBottom: titleMarginBottom,
    color,
    fontWeight: fontWeightStrong,
    fontSize,
    lineHeight
  };
};
const getTitleStyles = (token) => {
  const headings = [1, 2, 3, 4, 5];
  const styles = {};
  headings.forEach((headingLevel) => {
    styles[`
      h${headingLevel}&,
      div&-h${headingLevel},
      div&-h${headingLevel} > textarea,
      h${headingLevel}
    `] = getTitleStyle(token[`fontSizeHeading${headingLevel}`], token[`lineHeightHeading${headingLevel}`], token.colorTextHeading, token);
  });
  return styles;
};
const getLinkStyles = (token) => {
  const {
    componentCls
  } = token;
  return {
    "a&, a": Object.assign(Object.assign({}, operationUnit(token)), {
      textDecoration: token.linkDecoration,
      "&:active, &:hover": {
        textDecoration: token.linkHoverDecoration
      },
      [`&[disabled], &${componentCls}-disabled`]: {
        color: token.colorTextDisabled,
        cursor: "not-allowed",
        "&:active, &:hover": {
          color: token.colorTextDisabled
        },
        "&:active": {
          pointerEvents: "none"
        }
      }
    })
  };
};
const getResetStyles = (token) => ({
  code: {
    margin: "0 0.2em",
    paddingInline: "0.4em",
    paddingBlock: "0.2em 0.1em",
    fontSize: "85%",
    fontFamily: token.fontFamilyCode,
    background: "rgba(150, 150, 150, 0.1)",
    border: "1px solid rgba(100, 100, 100, 0.2)",
    borderRadius: 3
  },
  kbd: {
    margin: "0 0.2em",
    paddingInline: "0.4em",
    paddingBlock: "0.15em 0.1em",
    fontSize: "90%",
    fontFamily: token.fontFamilyCode,
    background: "rgba(150, 150, 150, 0.06)",
    border: "1px solid rgba(100, 100, 100, 0.2)",
    borderBottomWidth: 2,
    borderRadius: 3
  },
  mark: {
    padding: 0,
    // FIXME hardcode in v4
    backgroundColor: gold[2]
  },
  "u, ins": {
    textDecoration: "underline",
    textDecorationSkipInk: "auto"
  },
  "s, del": {
    textDecoration: "line-through"
  },
  strong: {
    fontWeight: 600
  },
  // list
  "ul, ol": {
    marginInline: 0,
    marginBlock: "0 1em",
    padding: 0,
    li: {
      marginInline: "20px 0",
      marginBlock: 0,
      paddingInline: "4px 0",
      paddingBlock: 0
    }
  },
  ul: {
    listStyleType: "circle",
    ul: {
      listStyleType: "disc"
    }
  },
  ol: {
    listStyleType: "decimal"
  },
  // pre & block
  "pre, blockquote": {
    margin: "1em 0"
  },
  pre: {
    padding: "0.4em 0.6em",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    background: "rgba(150, 150, 150, 0.1)",
    border: "1px solid rgba(100, 100, 100, 0.2)",
    borderRadius: 3,
    fontFamily: token.fontFamilyCode,
    // Compatible for marked
    code: {
      display: "inline",
      margin: 0,
      padding: 0,
      fontSize: "inherit",
      fontFamily: "inherit",
      background: "transparent",
      border: 0
    }
  },
  blockquote: {
    paddingInline: "0.6em 0",
    paddingBlock: 0,
    borderInlineStart: "4px solid rgba(100, 100, 100, 0.2)",
    opacity: 0.85
  }
});
const getEditableStyles = (token) => {
  const {
    componentCls,
    paddingSM
  } = token;
  const inputShift = paddingSM;
  return {
    "&-edit-content": {
      position: "relative",
      "div&": {
        insetInlineStart: token.calc(token.paddingSM).mul(-1).equal(),
        marginTop: token.calc(inputShift).mul(-1).equal(),
        marginBottom: `calc(1em - ${unit(inputShift)})`
      },
      [`${componentCls}-edit-content-confirm`]: {
        position: "absolute",
        insetInlineEnd: token.calc(token.marginXS).add(2).equal(),
        insetBlockEnd: token.marginXS,
        color: token.colorTextDescription,
        // default style
        fontWeight: "normal",
        fontSize: token.fontSize,
        fontStyle: "normal",
        pointerEvents: "none"
      },
      textarea: {
        margin: "0!important",
        // Fix Editable Textarea flash in Firefox
        MozTransition: "none",
        height: "1em"
      }
    }
  };
};
const getCopyableStyles = (token) => ({
  [`${token.componentCls}-copy-success`]: {
    [`
    &,
    &:hover,
    &:focus`]: {
      color: token.colorSuccess
    }
  },
  [`${token.componentCls}-copy-icon-only`]: {
    marginInlineStart: 0
  }
});
const getEllipsisStyles = () => ({
  [`
  a&-ellipsis,
  span&-ellipsis
  `]: {
    display: "inline-block",
    maxWidth: "100%"
  },
  "&-single-line": {
    whiteSpace: "nowrap"
  },
  "&-ellipsis-single-line": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    // https://blog.csdn.net/iefreer/article/details/50421025
    "a&, span&": {
      verticalAlign: "bottom"
    },
    "> code": {
      paddingBlock: 0,
      maxWidth: "calc(100% - 1.2em)",
      display: "inline-block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      verticalAlign: "bottom",
      // https://github.com/ant-design/ant-design/issues/45953
      boxSizing: "content-box"
    }
  },
  "&-ellipsis-multiple-line": {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical"
  }
});
const genTypographyStyle = (token) => {
  const {
    componentCls,
    titleMarginTop
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
      color: token.colorText,
      wordBreak: "break-word",
      lineHeight: token.lineHeight,
      [`&${componentCls}-secondary`]: {
        color: token.colorTextDescription
      },
      [`&${componentCls}-success`]: {
        color: token.colorSuccess
      },
      [`&${componentCls}-warning`]: {
        color: token.colorWarning
      },
      [`&${componentCls}-danger`]: {
        color: token.colorError,
        "a&:active, a&:focus": {
          color: token.colorErrorActive
        },
        "a&:hover": {
          color: token.colorErrorHover
        }
      },
      [`&${componentCls}-disabled`]: {
        color: token.colorTextDisabled,
        cursor: "not-allowed",
        userSelect: "none"
      },
      [`
        div&,
        p
      `]: {
        marginBottom: "1em"
      }
    }, getTitleStyles(token)), {
      [`
      & + h1${componentCls},
      & + h2${componentCls},
      & + h3${componentCls},
      & + h4${componentCls},
      & + h5${componentCls}
      `]: {
        marginTop: titleMarginTop
      },
      [`
      div,
      ul,
      li,
      p,
      h1,
      h2,
      h3,
      h4,
      h5`]: {
        [`
        + h1,
        + h2,
        + h3,
        + h4,
        + h5
        `]: {
          marginTop: titleMarginTop
        }
      }
    }), getResetStyles(token)), getLinkStyles(token)), {
      // Operation
      [`
        ${componentCls}-expand,
        ${componentCls}-edit,
        ${componentCls}-copy
      `]: Object.assign(Object.assign({}, operationUnit(token)), {
        marginInlineStart: token.marginXXS
      })
    }), getEditableStyles(token)), getCopyableStyles(token)), getEllipsisStyles()), {
      "&-rtl": {
        direction: "rtl"
      }
    })
  };
};
const prepareComponentToken = () => ({
  titleMarginTop: "1.2em",
  titleMarginBottom: "0.5em"
});
const useStyle = genStyleHooks("Typography", (token) => [genTypographyStyle(token)], prepareComponentToken);
const Editable = (props) => {
  const {
    prefixCls,
    "aria-label": ariaLabel,
    className,
    style,
    direction,
    maxLength,
    autoSize = true,
    value,
    onSave,
    onCancel,
    onEnd,
    component,
    enterIcon = /* @__PURE__ */ reactExports.createElement(RefIcon$1, null)
  } = props;
  const ref = reactExports.useRef(null);
  const inComposition = reactExports.useRef(false);
  const lastKeyCode = reactExports.useRef();
  const [current, setCurrent] = reactExports.useState(value);
  reactExports.useEffect(() => {
    setCurrent(value);
  }, [value]);
  reactExports.useEffect(() => {
    if (ref.current && ref.current.resizableTextArea) {
      const {
        textArea
      } = ref.current.resizableTextArea;
      textArea.focus();
      const {
        length
      } = textArea.value;
      textArea.setSelectionRange(length, length);
    }
  }, []);
  const onChange = (_ref) => {
    let {
      target
    } = _ref;
    setCurrent(target.value.replace(/[\n\r]/g, ""));
  };
  const onCompositionStart = () => {
    inComposition.current = true;
  };
  const onCompositionEnd = () => {
    inComposition.current = false;
  };
  const onKeyDown = (_ref2) => {
    let {
      keyCode
    } = _ref2;
    if (inComposition.current) return;
    lastKeyCode.current = keyCode;
  };
  const confirmChange = () => {
    onSave(current.trim());
  };
  const onKeyUp = (_ref3) => {
    let {
      keyCode,
      ctrlKey,
      altKey,
      metaKey,
      shiftKey
    } = _ref3;
    if (lastKeyCode.current === keyCode && !inComposition.current && !ctrlKey && !altKey && !metaKey && !shiftKey) {
      if (keyCode === KeyCode.ENTER) {
        confirmChange();
        onEnd === null || onEnd === void 0 ? void 0 : onEnd();
      } else if (keyCode === KeyCode.ESC) {
        onCancel();
      }
    }
  };
  const onBlur = () => {
    confirmChange();
  };
  const textClassName = component ? `${prefixCls}-${component}` : "";
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const textAreaClassName = classNames(prefixCls, `${prefixCls}-edit-content`, {
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, className, textClassName, hashId, cssVarCls);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement("div", {
    className: textAreaClassName,
    style
  }, /* @__PURE__ */ reactExports.createElement(TextArea, {
    ref,
    maxLength,
    value: current,
    onChange,
    onKeyDown,
    onKeyUp,
    onCompositionStart,
    onCompositionEnd,
    onBlur,
    "aria-label": ariaLabel,
    rows: 1,
    autoSize
  }), enterIcon !== null ? cloneElement(enterIcon, {
    className: `${prefixCls}-edit-content-confirm`
  }) : null));
};
function useMergedConfig(propConfig, templateConfig) {
  return reactExports.useMemo(() => {
    const support = !!propConfig;
    return [support, Object.assign(Object.assign({}, templateConfig), support && typeof propConfig === "object" ? propConfig : null)];
  }, [propConfig]);
}
const useUpdatedEffect = (callback, conditions) => {
  const mountRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (mountRef.current) {
      callback();
    } else {
      mountRef.current = true;
    }
  }, conditions);
};
var __rest$4 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Typography$1 = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    component: Component = "article",
    className,
    rootClassName,
    setContentRef,
    children,
    direction: typographyDirection,
    style
  } = props, restProps = __rest$4(props, ["prefixCls", "component", "className", "rootClassName", "setContentRef", "children", "direction", "style"]);
  const {
    getPrefixCls,
    direction: contextDirection,
    typography
  } = reactExports.useContext(ConfigContext);
  const direction = typographyDirection !== null && typographyDirection !== void 0 ? typographyDirection : contextDirection;
  let mergedRef = ref;
  if (setContentRef) {
    mergedRef = composeRef(ref, setContentRef);
  }
  const prefixCls = getPrefixCls("typography", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const componentClassName = classNames(prefixCls, typography === null || typography === void 0 ? void 0 : typography.className, {
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, className, rootClassName, hashId, cssVarCls);
  const mergedStyle = Object.assign(Object.assign({}, typography === null || typography === void 0 ? void 0 : typography.style), style);
  return wrapCSSVar(
    // @ts-expect-error: Expression produces a union type that is too complex to represent.
    /* @__PURE__ */ reactExports.createElement(Component, Object.assign({
      className: componentClassName,
      style: mergedStyle,
      ref: mergedRef
    }, restProps), children)
  );
});
var CopyOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z" } }] }, "name": "copy", "theme": "outlined" };
var CopyOutlined = function CopyOutlined2(props, ref) {
  return /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
    ref,
    icon: CopyOutlined$1
  }));
};
var RefIcon = /* @__PURE__ */ reactExports.forwardRef(CopyOutlined);
function toList(val) {
  if (val === false) {
    return [false, false];
  }
  return Array.isArray(val) ? val : [val];
}
function getNode(dom, defaultNode, needDom) {
  if (dom === true || dom === void 0) {
    return defaultNode;
  }
  return dom || needDom && defaultNode;
}
function CopyBtn(props) {
  const {
    prefixCls,
    copied,
    locale = {},
    onCopy,
    iconOnly,
    tooltips,
    icon
  } = props;
  const tooltipNodes = toList(tooltips);
  const iconNodes = toList(icon);
  const {
    copied: copiedText,
    copy: copyText
  } = locale;
  const copyTitle = copied ? getNode(tooltipNodes[1], copiedText) : getNode(tooltipNodes[0], copyText);
  const systemStr = copied ? copiedText : copyText;
  const ariaLabel = typeof copyTitle === "string" ? copyTitle : systemStr;
  return /* @__PURE__ */ reactExports.createElement(Tooltip, {
    key: "copy",
    title: copyTitle
  }, /* @__PURE__ */ reactExports.createElement(TransButton, {
    className: classNames(`${prefixCls}-copy`, {
      [`${prefixCls}-copy-success`]: copied,
      [`${prefixCls}-copy-icon-only`]: iconOnly
    }),
    onClick: onCopy,
    "aria-label": ariaLabel
  }, copied ? getNode(iconNodes[1], /* @__PURE__ */ reactExports.createElement(RefIcon$3, null), true) : getNode(iconNodes[0], /* @__PURE__ */ reactExports.createElement(RefIcon, null), true)));
}
const MeasureText = /* @__PURE__ */ reactExports.forwardRef((_ref, ref) => {
  let {
    style,
    children
  } = _ref;
  const spanRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => ({
    isExceed: () => {
      const span = spanRef.current;
      return span.scrollHeight > span.clientHeight;
    },
    getHeight: () => spanRef.current.clientHeight
  }));
  return /* @__PURE__ */ reactExports.createElement("span", {
    "aria-hidden": true,
    ref: spanRef,
    style: Object.assign({
      position: "fixed",
      display: "block",
      left: 0,
      top: 0,
      // zIndex: -9999,
      // visibility: 'hidden',
      pointerEvents: "none",
      backgroundColor: "rgba(255, 0, 0, 0.65)"
    }, style)
  }, children);
});
function cuttable(node) {
  const type = typeof node;
  return type === "string" || type === "number";
}
function getNodesLen(nodeList) {
  let totalLen = 0;
  nodeList.forEach((node) => {
    if (cuttable(node)) {
      totalLen += String(node).length;
    } else {
      totalLen += 1;
    }
  });
  return totalLen;
}
function sliceNodes(nodeList, len) {
  let currLen = 0;
  const currentNodeList = [];
  for (let i = 0; i < nodeList.length; i += 1) {
    if (currLen === len) {
      return currentNodeList;
    }
    const node = nodeList[i];
    const canCut = cuttable(node);
    const nodeLen = canCut ? String(node).length : 1;
    const nextLen = currLen + nodeLen;
    if (nextLen > len) {
      const restLen = len - currLen;
      currentNodeList.push(String(node).slice(0, restLen));
      return currentNodeList;
    }
    currentNodeList.push(node);
    currLen = nextLen;
  }
  return nodeList;
}
const STATUS_MEASURE_NONE = 0;
const STATUS_MEASURE_START = 1;
const STATUS_MEASURE_NEED_ELLIPSIS = 2;
const STATUS_MEASURE_NO_NEED_ELLIPSIS = 3;
const lineClipStyle = {
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical"
};
function EllipsisMeasure(props) {
  const {
    enabledMeasure,
    width,
    text,
    children,
    rows,
    miscDeps,
    onEllipsis
  } = props;
  const nodeList = reactExports.useMemo(() => toArray(text), [text]);
  const nodeLen = reactExports.useMemo(() => getNodesLen(nodeList), [text]);
  const fullContent = reactExports.useMemo(() => children(nodeList, false, false), [text]);
  const [ellipsisCutIndex, setEllipsisCutIndex] = reactExports.useState(null);
  const cutMidRef = reactExports.useRef(null);
  const needEllipsisRef = reactExports.useRef(null);
  const [needEllipsis, setNeedEllipsis] = reactExports.useState(STATUS_MEASURE_NONE);
  const [ellipsisHeight, setEllipsisHeight] = reactExports.useState(0);
  useLayoutEffect(() => {
    if (enabledMeasure && width && nodeLen) {
      setNeedEllipsis(STATUS_MEASURE_START);
    } else {
      setNeedEllipsis(STATUS_MEASURE_NONE);
    }
  }, [width, text, rows, enabledMeasure, nodeList]);
  useLayoutEffect(() => {
    var _a, _b;
    if (needEllipsis === STATUS_MEASURE_START) {
      const isOverflow = !!((_a = needEllipsisRef.current) === null || _a === void 0 ? void 0 : _a.isExceed());
      setNeedEllipsis(isOverflow ? STATUS_MEASURE_NEED_ELLIPSIS : STATUS_MEASURE_NO_NEED_ELLIPSIS);
      setEllipsisCutIndex(isOverflow ? [0, nodeLen] : null);
      setEllipsisHeight((((_b = needEllipsisRef.current) === null || _b === void 0 ? void 0 : _b.getHeight()) || 0) + 1);
      onEllipsis(isOverflow);
    }
  }, [needEllipsis]);
  const cutMidIndex = ellipsisCutIndex ? Math.ceil((ellipsisCutIndex[0] + ellipsisCutIndex[1]) / 2) : 0;
  useLayoutEffect(() => {
    var _a;
    const [minIndex, maxIndex] = ellipsisCutIndex || [0, 0];
    if (minIndex !== maxIndex) {
      const midHeight = ((_a = cutMidRef.current) === null || _a === void 0 ? void 0 : _a.getHeight()) || 0;
      const isOverflow = midHeight > ellipsisHeight;
      let targetMidIndex = cutMidIndex;
      if (maxIndex - minIndex === 1) {
        targetMidIndex = isOverflow ? minIndex : maxIndex;
      }
      if (isOverflow) {
        setEllipsisCutIndex([minIndex, targetMidIndex]);
      } else {
        setEllipsisCutIndex([targetMidIndex, maxIndex]);
      }
    }
  }, [ellipsisCutIndex, cutMidIndex]);
  const finalContent = reactExports.useMemo(() => {
    if (needEllipsis !== STATUS_MEASURE_NEED_ELLIPSIS || !ellipsisCutIndex || ellipsisCutIndex[0] !== ellipsisCutIndex[1]) {
      const content = children(nodeList, false, false);
      if (needEllipsis !== STATUS_MEASURE_NO_NEED_ELLIPSIS && needEllipsis !== STATUS_MEASURE_NONE) {
        return /* @__PURE__ */ reactExports.createElement("span", {
          style: Object.assign(Object.assign({}, lineClipStyle), {
            WebkitLineClamp: rows
          })
        }, content);
      }
      return content;
    }
    return children(sliceNodes(nodeList, ellipsisCutIndex[0]), true, true);
  }, [needEllipsis, ellipsisCutIndex, nodeList].concat(_toConsumableArray(miscDeps)));
  const measureStyle = {
    width,
    whiteSpace: "normal",
    margin: 0,
    padding: 0
  };
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, finalContent, needEllipsis === STATUS_MEASURE_START && /* @__PURE__ */ reactExports.createElement(MeasureText, {
    style: Object.assign(Object.assign(Object.assign({}, measureStyle), lineClipStyle), {
      WebkitLineClamp: rows
    }),
    ref: needEllipsisRef
  }, fullContent), needEllipsis === STATUS_MEASURE_NEED_ELLIPSIS && ellipsisCutIndex && ellipsisCutIndex[0] !== ellipsisCutIndex[1] && /* @__PURE__ */ reactExports.createElement(MeasureText, {
    style: Object.assign(Object.assign({}, measureStyle), {
      top: 400
    }),
    ref: cutMidRef
  }, children(sliceNodes(nodeList, cutMidIndex), true, true)));
}
const EllipsisTooltip = (_ref) => {
  let {
    enabledEllipsis,
    isEllipsis,
    children,
    tooltipProps
  } = _ref;
  if (!(tooltipProps === null || tooltipProps === void 0 ? void 0 : tooltipProps.title) || !enabledEllipsis) {
    return children;
  }
  return /* @__PURE__ */ reactExports.createElement(Tooltip, Object.assign({
    open: isEllipsis ? void 0 : false
  }, tooltipProps), children);
};
var __rest$3 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function wrapperDecorations(_ref, content) {
  let {
    mark,
    code,
    underline,
    delete: del,
    strong,
    keyboard,
    italic
  } = _ref;
  let currentContent = content;
  function wrap(tag, needed) {
    if (!needed) {
      return;
    }
    currentContent = /* @__PURE__ */ reactExports.createElement(tag, {}, currentContent);
  }
  wrap("strong", strong);
  wrap("u", underline);
  wrap("del", del);
  wrap("code", code);
  wrap("mark", mark);
  wrap("kbd", keyboard);
  wrap("i", italic);
  return currentContent;
}
const ELLIPSIS_STR = "...";
const Base = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  var _a, _b, _c;
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    type,
    disabled,
    children,
    ellipsis,
    editable,
    copyable,
    component,
    title
  } = props, restProps = __rest$3(props, ["prefixCls", "className", "style", "type", "disabled", "children", "ellipsis", "editable", "copyable", "component", "title"]);
  const {
    getPrefixCls,
    direction
  } = reactExports.useContext(ConfigContext);
  const [textLocale] = useLocale("Text");
  const typographyRef = reactExports.useRef(null);
  const editIconRef = reactExports.useRef(null);
  const prefixCls = getPrefixCls("typography", customizePrefixCls);
  const textProps = omit(restProps, ["mark", "code", "delete", "underline", "strong", "keyboard", "italic"]);
  const [enableEdit, editConfig] = useMergedConfig(editable);
  const [editing, setEditing] = useMergedState(false, {
    value: editConfig.editing
  });
  const {
    triggerType = ["icon"]
  } = editConfig;
  const triggerEdit = (edit) => {
    var _a2;
    if (edit) {
      (_a2 = editConfig.onStart) === null || _a2 === void 0 ? void 0 : _a2.call(editConfig);
    }
    setEditing(edit);
  };
  useUpdatedEffect(() => {
    var _a2;
    if (!editing) {
      (_a2 = editIconRef.current) === null || _a2 === void 0 ? void 0 : _a2.focus();
    }
  }, [editing]);
  const onEditClick = (e) => {
    e === null || e === void 0 ? void 0 : e.preventDefault();
    triggerEdit(true);
  };
  const onEditChange = (value) => {
    var _a2;
    (_a2 = editConfig.onChange) === null || _a2 === void 0 ? void 0 : _a2.call(editConfig, value);
    triggerEdit(false);
  };
  const onEditCancel = () => {
    var _a2;
    (_a2 = editConfig.onCancel) === null || _a2 === void 0 ? void 0 : _a2.call(editConfig);
    triggerEdit(false);
  };
  const [enableCopy, copyConfig] = useMergedConfig(copyable);
  const [copied, setCopied] = reactExports.useState(false);
  const copyIdRef = reactExports.useRef(null);
  const copyOptions = {};
  if (copyConfig.format) {
    copyOptions.format = copyConfig.format;
  }
  const cleanCopyId = () => {
    if (copyIdRef.current) {
      clearTimeout(copyIdRef.current);
    }
  };
  const onCopyClick = (e) => {
    var _a2;
    e === null || e === void 0 ? void 0 : e.preventDefault();
    e === null || e === void 0 ? void 0 : e.stopPropagation();
    copy(copyConfig.text || String(children) || "", copyOptions);
    setCopied(true);
    cleanCopyId();
    copyIdRef.current = setTimeout(() => {
      setCopied(false);
    }, 3e3);
    (_a2 = copyConfig.onCopy) === null || _a2 === void 0 ? void 0 : _a2.call(copyConfig, e);
  };
  reactExports.useEffect(() => cleanCopyId, []);
  const [isLineClampSupport, setIsLineClampSupport] = reactExports.useState(false);
  const [isTextOverflowSupport, setIsTextOverflowSupport] = reactExports.useState(false);
  const [expanded, setExpanded] = reactExports.useState(false);
  const [isJsEllipsis, setIsJsEllipsis] = reactExports.useState(false);
  const [isNativeEllipsis, setIsNativeEllipsis] = reactExports.useState(false);
  const [isNativeVisible, setIsNativeVisible] = reactExports.useState(true);
  const [enableEllipsis, ellipsisConfig] = useMergedConfig(ellipsis, {
    expandable: false
  });
  const mergedEnableEllipsis = enableEllipsis && !expanded;
  const {
    rows = 1
  } = ellipsisConfig;
  const needMeasureEllipsis = reactExports.useMemo(() => (
    // Disable ellipsis
    !mergedEnableEllipsis || // Provide suffix
    ellipsisConfig.suffix !== void 0 || ellipsisConfig.onEllipsis || // Can't use css ellipsis since we need to provide the place for button
    ellipsisConfig.expandable || enableEdit || enableCopy
  ), [mergedEnableEllipsis, ellipsisConfig, enableEdit, enableCopy]);
  useLayoutEffect(() => {
    if (enableEllipsis && !needMeasureEllipsis) {
      setIsLineClampSupport(isStyleSupport("webkitLineClamp"));
      setIsTextOverflowSupport(isStyleSupport("textOverflow"));
    }
  }, [needMeasureEllipsis, enableEllipsis]);
  const cssEllipsis = reactExports.useMemo(() => {
    if (needMeasureEllipsis) {
      return false;
    }
    if (rows === 1) {
      return isTextOverflowSupport;
    }
    return isLineClampSupport;
  }, [needMeasureEllipsis, isTextOverflowSupport, isLineClampSupport]);
  const isMergedEllipsis = mergedEnableEllipsis && (cssEllipsis ? isNativeEllipsis : isJsEllipsis);
  const cssTextOverflow = mergedEnableEllipsis && rows === 1 && cssEllipsis;
  const cssLineClamp = mergedEnableEllipsis && rows > 1 && cssEllipsis;
  const onExpandClick = (e) => {
    var _a2;
    setExpanded(true);
    (_a2 = ellipsisConfig.onExpand) === null || _a2 === void 0 ? void 0 : _a2.call(ellipsisConfig, e);
  };
  const [ellipsisWidth, setEllipsisWidth] = reactExports.useState(0);
  const onResize = (_ref2) => {
    let {
      offsetWidth
    } = _ref2;
    setEllipsisWidth(offsetWidth);
  };
  const onJsEllipsis = (jsEllipsis) => {
    var _a2;
    setIsJsEllipsis(jsEllipsis);
    if (isJsEllipsis !== jsEllipsis) {
      (_a2 = ellipsisConfig.onEllipsis) === null || _a2 === void 0 ? void 0 : _a2.call(ellipsisConfig, jsEllipsis);
    }
  };
  reactExports.useEffect(() => {
    const textEle = typographyRef.current;
    if (enableEllipsis && cssEllipsis && textEle) {
      const currentEllipsis = cssLineClamp ? textEle.offsetHeight < textEle.scrollHeight : textEle.offsetWidth < textEle.scrollWidth;
      if (isNativeEllipsis !== currentEllipsis) {
        setIsNativeEllipsis(currentEllipsis);
      }
    }
  }, [enableEllipsis, cssEllipsis, children, cssLineClamp, isNativeVisible, ellipsisWidth]);
  reactExports.useEffect(() => {
    const textEle = typographyRef.current;
    if (typeof IntersectionObserver === "undefined" || !textEle || !cssEllipsis || !mergedEnableEllipsis) {
      return;
    }
    const observer = new IntersectionObserver(() => {
      setIsNativeVisible(!!textEle.offsetParent);
    });
    observer.observe(textEle);
    return () => {
      observer.disconnect();
    };
  }, [cssEllipsis, mergedEnableEllipsis]);
  let tooltipProps = {};
  if (ellipsisConfig.tooltip === true) {
    tooltipProps = {
      title: (_a = editConfig.text) !== null && _a !== void 0 ? _a : children
    };
  } else if (/* @__PURE__ */ reactExports.isValidElement(ellipsisConfig.tooltip)) {
    tooltipProps = {
      title: ellipsisConfig.tooltip
    };
  } else if (typeof ellipsisConfig.tooltip === "object") {
    tooltipProps = Object.assign({
      title: (_b = editConfig.text) !== null && _b !== void 0 ? _b : children
    }, ellipsisConfig.tooltip);
  } else {
    tooltipProps = {
      title: ellipsisConfig.tooltip
    };
  }
  const topAriaLabel = reactExports.useMemo(() => {
    const isValid = (val) => ["string", "number"].includes(typeof val);
    if (!enableEllipsis || cssEllipsis) {
      return void 0;
    }
    if (isValid(editConfig.text)) {
      return editConfig.text;
    }
    if (isValid(children)) {
      return children;
    }
    if (isValid(title)) {
      return title;
    }
    if (isValid(tooltipProps.title)) {
      return tooltipProps.title;
    }
    return void 0;
  }, [enableEllipsis, cssEllipsis, title, tooltipProps.title, isMergedEllipsis]);
  if (editing) {
    return /* @__PURE__ */ reactExports.createElement(Editable, {
      value: (_c = editConfig.text) !== null && _c !== void 0 ? _c : typeof children === "string" ? children : "",
      onSave: onEditChange,
      onCancel: onEditCancel,
      onEnd: editConfig.onEnd,
      prefixCls,
      className,
      style,
      direction,
      component,
      maxLength: editConfig.maxLength,
      autoSize: editConfig.autoSize,
      enterIcon: editConfig.enterIcon
    });
  }
  const renderExpand = () => {
    const {
      expandable,
      symbol
    } = ellipsisConfig;
    if (!expandable) return null;
    let expandContent;
    if (symbol) {
      expandContent = symbol;
    } else {
      expandContent = textLocale === null || textLocale === void 0 ? void 0 : textLocale.expand;
    }
    return /* @__PURE__ */ reactExports.createElement("a", {
      key: "expand",
      className: `${prefixCls}-expand`,
      onClick: onExpandClick,
      "aria-label": textLocale === null || textLocale === void 0 ? void 0 : textLocale.expand
    }, expandContent);
  };
  const renderEdit = () => {
    if (!enableEdit) return;
    const {
      icon,
      tooltip
    } = editConfig;
    const editTitle = toArray(tooltip)[0] || (textLocale === null || textLocale === void 0 ? void 0 : textLocale.edit);
    const ariaLabel = typeof editTitle === "string" ? editTitle : "";
    return triggerType.includes("icon") ? /* @__PURE__ */ reactExports.createElement(Tooltip, {
      key: "edit",
      title: tooltip === false ? "" : editTitle
    }, /* @__PURE__ */ reactExports.createElement(TransButton, {
      ref: editIconRef,
      className: `${prefixCls}-edit`,
      onClick: onEditClick,
      "aria-label": ariaLabel
    }, icon || /* @__PURE__ */ reactExports.createElement(RefIcon$2, {
      role: "button"
    }))) : null;
  };
  const renderCopy = () => {
    if (!enableCopy) {
      return null;
    }
    return /* @__PURE__ */ reactExports.createElement(CopyBtn, Object.assign({
      key: "copy"
    }, copyConfig, {
      prefixCls,
      copied,
      locale: textLocale,
      onCopy: onCopyClick,
      iconOnly: children === null || children === void 0
    }));
  };
  const renderOperations = (renderExpanded) => [renderExpanded && renderExpand(), renderEdit(), renderCopy()];
  const renderEllipsis = (needEllipsis) => [needEllipsis && /* @__PURE__ */ reactExports.createElement("span", {
    "aria-hidden": true,
    key: "ellipsis"
  }, ELLIPSIS_STR), ellipsisConfig.suffix, renderOperations(needEllipsis)];
  return /* @__PURE__ */ reactExports.createElement(RefResizeObserver, {
    onResize,
    disabled: !mergedEnableEllipsis
  }, (resizeRef) => /* @__PURE__ */ reactExports.createElement(EllipsisTooltip, {
    tooltipProps,
    enabledEllipsis: mergedEnableEllipsis,
    isEllipsis: isMergedEllipsis
  }, /* @__PURE__ */ reactExports.createElement(Typography$1, Object.assign({
    className: classNames({
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-ellipsis`]: enableEllipsis,
      [`${prefixCls}-single-line`]: mergedEnableEllipsis && rows === 1,
      [`${prefixCls}-ellipsis-single-line`]: cssTextOverflow,
      [`${prefixCls}-ellipsis-multiple-line`]: cssLineClamp
    }, className),
    prefixCls: customizePrefixCls,
    style: Object.assign(Object.assign({}, style), {
      WebkitLineClamp: cssLineClamp ? rows : void 0
    }),
    component,
    ref: composeRef(resizeRef, typographyRef, ref),
    direction,
    onClick: triggerType.includes("text") ? onEditClick : void 0,
    "aria-label": topAriaLabel === null || topAriaLabel === void 0 ? void 0 : topAriaLabel.toString(),
    title
  }, textProps), /* @__PURE__ */ reactExports.createElement(EllipsisMeasure, {
    enabledMeasure: mergedEnableEllipsis && !cssEllipsis,
    text: children,
    rows,
    width: ellipsisWidth,
    onEllipsis: onJsEllipsis,
    miscDeps: [copied, expanded]
  }, (node, needEllipsis) => {
    let renderNode = node;
    if (node.length && needEllipsis && topAriaLabel) {
      renderNode = /* @__PURE__ */ reactExports.createElement("span", {
        key: "show-content",
        "aria-hidden": true
      }, renderNode);
    }
    const wrappedContext = wrapperDecorations(props, /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, renderNode, renderEllipsis(needEllipsis)));
    return wrappedContext;
  }))));
});
var __rest$2 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Link = /* @__PURE__ */ reactExports.forwardRef((_a, ref) => {
  var {
    ellipsis,
    rel
  } = _a, restProps = __rest$2(_a, ["ellipsis", "rel"]);
  const mergedProps = Object.assign(Object.assign({}, restProps), {
    rel: rel === void 0 && restProps.target === "_blank" ? "noopener noreferrer" : rel
  });
  delete mergedProps.navigate;
  return /* @__PURE__ */ reactExports.createElement(Base, Object.assign({}, mergedProps, {
    ref,
    ellipsis: !!ellipsis,
    component: "a"
  }));
});
const Paragraph = /* @__PURE__ */ reactExports.forwardRef((props, ref) => /* @__PURE__ */ reactExports.createElement(Base, Object.assign({
  ref
}, props, {
  component: "div"
})));
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Text = (_a, ref) => {
  var {
    ellipsis
  } = _a, restProps = __rest$1(_a, ["ellipsis"]);
  const mergedEllipsis = reactExports.useMemo(() => {
    if (ellipsis && typeof ellipsis === "object") {
      return omit(ellipsis, ["expandable", "rows"]);
    }
    return ellipsis;
  }, [ellipsis]);
  return /* @__PURE__ */ reactExports.createElement(Base, Object.assign({
    ref
  }, restProps, {
    ellipsis: mergedEllipsis,
    component: "span"
  }));
};
const Text$1 = /* @__PURE__ */ reactExports.forwardRef(Text);
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const TITLE_ELE_LIST = [1, 2, 3, 4, 5];
const Title = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    level = 1
  } = props, restProps = __rest(props, ["level"]);
  let component;
  if (TITLE_ELE_LIST.includes(level)) {
    component = `h${level}`;
  } else {
    component = "h1";
  }
  return /* @__PURE__ */ reactExports.createElement(Base, Object.assign({
    ref
  }, restProps, {
    component
  }));
});
const Typography = Typography$1;
Typography.Text = Text$1;
Typography.Link = Link;
Typography.Title = Title;
Typography.Paragraph = Paragraph;
export {
  EditOutlined$1 as E,
  RefIcon$3 as R,
  Typography as T,
  isStyleSupport as i,
  operationUnit as o
};
