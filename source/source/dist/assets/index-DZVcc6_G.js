import { r as reactExports } from "./index-CUErrqgd.js";
import { g as genPurePanel } from "./PurePanel-GUILNfpz.js";
import { D as DatePicker } from "./index-kyMbMI4L.js";
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const {
  TimePicker: InternalTimePicker,
  RangePicker: InternalRangePicker
} = DatePicker;
const RangePicker = /* @__PURE__ */ reactExports.forwardRef((props, ref) => /* @__PURE__ */ reactExports.createElement(InternalRangePicker, Object.assign({}, props, {
  picker: "time",
  mode: void 0,
  ref
})));
const TimePicker = /* @__PURE__ */ reactExports.forwardRef((_a, ref) => {
  var {
    addon,
    renderExtraFooter
  } = _a, restProps = __rest(_a, ["addon", "renderExtraFooter"]);
  const internalRenderExtraFooter = reactExports.useMemo(() => {
    if (renderExtraFooter) {
      return renderExtraFooter;
    }
    if (addon) {
      return addon;
    }
    return void 0;
  }, [addon, renderExtraFooter]);
  return /* @__PURE__ */ reactExports.createElement(InternalTimePicker, Object.assign({}, restProps, {
    mode: void 0,
    ref,
    renderExtraFooter: internalRenderExtraFooter
  }));
});
const PurePanel = genPurePanel(TimePicker, "picker");
TimePicker._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
TimePicker.RangePicker = RangePicker;
TimePicker._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
export {
  TimePicker as T
};
