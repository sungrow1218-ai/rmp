import { R as React } from "./index-CUErrqgd.js";
function omit(obj, fields) {
  var clone = Object.assign({}, obj);
  if (Array.isArray(fields)) {
    fields.forEach(function(key) {
      delete clone[key];
    });
  }
  return clone;
}
function isFragment(child) {
  return child && /* @__PURE__ */ React.isValidElement(child) && child.type === React.Fragment;
}
const replaceElement = (element, replacement, props) => {
  if (!/* @__PURE__ */ React.isValidElement(element)) {
    return replacement;
  }
  return /* @__PURE__ */ React.cloneElement(element, typeof props === "function" ? props(element.props || {}) : props);
};
function cloneElement(element, props) {
  return replaceElement(element, element, props);
}
export {
  cloneElement as c,
  isFragment as i,
  omit as o,
  replaceElement as r
};
