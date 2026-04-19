import { r as reactExports, I as Icon } from "./index-CUErrqgd.js";
import { E as EditOutlined$1 } from "./index-D6bScF1D.js";
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
const EditOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: EditOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(EditOutlined);
export {
  RefIcon as R
};
