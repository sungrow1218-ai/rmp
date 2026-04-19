import { R as React } from "./index-CUErrqgd.js";
import { R as RefIcon } from "./useZIndex-BReSjmbj.js";
import { p as pickAttrs } from "./pickAttrs-B6Vs2P5v.js";
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function useInnerClosable(closable, closeIcon, defaultClosable) {
  if (typeof closable === "boolean") {
    return closable;
  }
  if (typeof closable === "object") {
    return true;
  }
  if (closeIcon === void 0) {
    return !!defaultClosable;
  }
  return closeIcon !== false && closeIcon !== null;
}
function useClosable(_ref) {
  let {
    closable,
    closeIcon,
    customCloseIconRender,
    defaultCloseIcon = /* @__PURE__ */ React.createElement(RefIcon, null),
    defaultClosable = false
  } = _ref;
  const mergedClosable = useInnerClosable(closable, closeIcon, defaultClosable);
  if (!mergedClosable) {
    return [false, null];
  }
  const _a = typeof closable === "object" ? closable : {}, {
    closeIcon: closableIcon
  } = _a, restProps = __rest(_a, ["closeIcon"]);
  const mergedCloseIcon = (() => {
    if (typeof closable === "object" && closableIcon !== void 0) {
      return closableIcon;
    }
    return typeof closeIcon === "boolean" || closeIcon === void 0 || closeIcon === null ? defaultCloseIcon : closeIcon;
  })();
  const ariaProps = pickAttrs(restProps, true);
  const plainCloseIcon = customCloseIconRender ? customCloseIconRender(mergedCloseIcon) : mergedCloseIcon;
  const closeIconWithAria = /* @__PURE__ */ React.isValidElement(plainCloseIcon) ? /* @__PURE__ */ React.cloneElement(plainCloseIcon, ariaProps) : /* @__PURE__ */ React.createElement("span", Object.assign({}, ariaProps), plainCloseIcon);
  return [true, closeIconWithAria];
}
export {
  useClosable as u
};
