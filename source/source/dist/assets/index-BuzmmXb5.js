import { r as reactExports, I as Icon, j as jsxRuntimeExports } from "./index-CUErrqgd.js";
import { T as Typography } from "./index-D6bScF1D.js";
import { S as Select } from "./index-D37x-ts6.js";
import { I as Input } from "./index-HqjRjDrR.js";
import { D as DatePicker } from "./index-kyMbMI4L.js";
import { R as Radio, F as ForwardTable } from "./Table-DpJrvGn6.js";
import { C as CompoundedSpace } from "./index-DMsHtZNk.js";
import { B as Button } from "./button-DMDTHtWf.js";
import { R as RefIcon$2 } from "./SettingOutlined-D1FkhzMV.js";
import { T as Tag } from "./index-C_p_uySS.js";
import "./asyncToGenerator-Bn7YJjF8.js";
import "./index-BKheaG9T.js";
import "./compact-item-T75FitAV.js";
import "./useZIndex-BReSjmbj.js";
import "./reactNode-TfIvHo6t.js";
import "./TextArea-Cw6hnbxh.js";
import "./pickAttrs-B6Vs2P5v.js";
import "./Overflow-DO7wolsL.js";
import "./PurePanel-GUILNfpz.js";
import "./LoadingOutlined-s4PR_g90.js";
import "./index-DNc7br9R.js";
import "./responsiveObserver-ChKXsNUO.js";
import "./index-BC0QXd6g.js";
import "./RightOutlined-BAFHU4sg.js";
import "./EllipsisOutlined-BuwqaHFz.js";
import "./useBreakpoint-CZwDkAga.js";
import "./index-DpyJnIWD.js";
import "./render-uL5zGIDv.js";
import "./useClosable-BjqEnKhC.js";
var AlertOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M193 796c0 17.7 14.3 32 32 32h574c17.7 0 32-14.3 32-32V563c0-176.2-142.8-319-319-319S193 386.8 193 563v233zm72-233c0-136.4 110.6-247 247-247s247 110.6 247 247v193H404V585c0-5.5-4.5-10-10-10h-44c-5.5 0-10 4.5-10 10v171h-75V563zm-48.1-252.5l39.6-39.6c3.1-3.1 3.1-8.2 0-11.3l-67.9-67.9a8.03 8.03 0 00-11.3 0l-39.6 39.6a8.03 8.03 0 000 11.3l67.9 67.9c3.1 3.1 8.1 3.1 11.3 0zm669.6-79.2l-39.6-39.6a8.03 8.03 0 00-11.3 0l-67.9 67.9a8.03 8.03 0 000 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l67.9-67.9c3.1-3.2 3.1-8.2 0-11.3zM832 892H192c-17.7 0-32 14.3-32 32v24c0 4.4 3.6 8 8 8h688c4.4 0 8-3.6 8-8v-24c0-17.7-14.3-32-32-32zM484 180h56c4.4 0 8-3.6 8-8V76c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v96c0 4.4 3.6 8 8 8z" } }] }, "name": "alert", "theme": "outlined" };
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
const AlertOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$1({}, props, {
  ref,
  icon: AlertOutlined$1
}));
const RefIcon$1 = /* @__PURE__ */ reactExports.forwardRef(AlertOutlined);
var ExportOutlined$1 = { "icon": { "tag": "svg", "attrs": { "fill-rule": "evenodd", "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M880 912H144c-17.7 0-32-14.3-32-32V144c0-17.7 14.3-32 32-32h360c4.4 0 8 3.6 8 8v56c0 4.4-3.6 8-8 8H184v656h656V520c0-4.4 3.6-8 8-8h56c4.4 0 8 3.6 8 8v360c0 17.7-14.3 32-32 32zM770.87 199.13l-52.2-52.2a8.01 8.01 0 014.7-13.6l179.4-21c5.1-.6 9.5 3.7 8.9 8.9l-21 179.4c-.8 6.6-8.9 9.4-13.6 4.7l-52.4-52.4-256.2 256.2a8.03 8.03 0 01-11.3 0l-42.4-42.4a8.03 8.03 0 010-11.3l256.1-256.3z" } }] }, "name": "export", "theme": "outlined" };
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
const ExportOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: ExportOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(ExportOutlined);
const { Title } = Typography;
const { RangePicker } = DatePicker;
const mockData = Array.from({ length: 20 }).map((_, i) => ({
  id: `A${1e3 + i}`,
  businessDate: "2023-10-25",
  alertTime: "10:30:15",
  alertObject: "张三",
  ruleNo: `R${5e3 + i}`,
  ruleName: i % 2 === 0 ? "连续竞价阶段拉抬打压控制" : "收盘集合竞价拉抬打压",
  ruleType: "异常交易类",
  symbol: "600519",
  direction: i % 2 === 0 ? "买入" : "卖出",
  alertAction: i % 3 === 0 ? "三级预警" : i % 2 === 0 ? "二级预警" : "一级预警",
  alertDesc: "触发一级阈值",
  externalSysNo: `EXT${8e3 + i}`,
  market: "上海证券交易所",
  orderNo: `O${9e3 + i}`,
  account: "A123456789",
  grayFlag: "正式"
}));
const AlertQuery = () => {
  const [loading, setLoading] = reactExports.useState(false);
  const [alertType, setAlertType] = reactExports.useState("today");
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };
  const columns = [
    { title: "业务日期", dataIndex: "businessDate", width: 100 },
    { title: "触警时间", dataIndex: "alertTime", width: 100 },
    { title: "触警对象", dataIndex: "alertObject", width: 100 },
    { title: "所属编号", dataIndex: "ruleNo", width: 100 },
    { title: "所属名称", dataIndex: "ruleName", width: 180 },
    {
      title: "规则类型",
      dataIndex: "ruleType",
      width: 120,
      render: (text) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#1890ff] border border-[#1890ff] px-2 py-0.5 rounded text-xs bg-[#e6f7ff]", children: text })
    },
    { title: "证券代码", dataIndex: "symbol", width: 100 },
    {
      title: "委托方向",
      dataIndex: "direction",
      width: 80,
      render: (text) => {
        if (text === "买入") {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#ff4d4f] bg-[#fff1f0] border border-[#ffa39e] px-2 py-0.5 rounded text-xs", children: text });
        }
        if (text === "卖出") {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#52c41a] bg-[#f6ffed] border border-[#b7eb8f] px-2 py-0.5 rounded text-xs", children: text });
        }
        return text;
      }
    },
    {
      title: "触警操作",
      dataIndex: "alertAction",
      width: 100,
      render: (text) => {
        let color = "default";
        if (text === "三级预警") color = "error";
        if (text === "二级预警") color = "warning";
        if (text === "一级预警") color = "processing";
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color, children: text });
      }
    },
    { title: "触警说明", dataIndex: "alertDesc", width: 150 },
    { title: "外部系统号", dataIndex: "externalSysNo", width: 120 },
    { title: "交易市场", dataIndex: "market", width: 120 },
    { title: "委托编号", dataIndex: "orderNo", width: 120 },
    { title: "账户", dataIndex: "account", width: 120 },
    { title: "灰度标志", dataIndex: "grayFlag", width: 80 },
    {
      title: "操作",
      key: "action",
      width: 80,
      fixed: "right",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", children: "查看" })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 h-full flex flex-col absolute inset-0 bg-gray-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 shrink-0 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { className: "text-[#1890ff] text-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: { margin: 0 }, children: "触警信息查询" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-5 rounded-lg border border-gray-200 mb-4 shrink-0 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 w-20 text-right mr-3 shrink-0", children: "工作台:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { placeholder: "请选择工作台", className: "flex-1", allowClear: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 w-20 text-right mr-3 shrink-0", children: "规则类型:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { placeholder: "请选择", className: "flex-1", allowClear: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 w-20 text-right mr-3 shrink-0", children: "触警对象:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { placeholder: "请选择", className: "flex-1", allowClear: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 w-20 text-right mr-3 shrink-0", children: "规则编号:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { placeholder: "请选择", className: "flex-1", allowClear: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 w-20 text-right mr-3 shrink-0", children: "对接系统:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { placeholder: "请选择", className: "flex-1", allowClear: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 w-20 text-right mr-3 shrink-0", children: "交易市场:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { placeholder: "请选择", className: "flex-1", allowClear: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 w-20 text-right mr-3 shrink-0", children: "证券代码:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "请输入", className: "flex-1", allowClear: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 w-20 text-right mr-3 shrink-0", children: "委托编号:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "请输入", className: "flex-1", allowClear: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 w-20 text-right mr-3 shrink-0", children: "账户:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "请输入", className: "flex-1", allowClear: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 w-20 text-right mr-3 shrink-0", children: "委托方向:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { placeholder: "请选择委托方向", className: "flex-1", allowClear: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 w-20 text-right mr-3 shrink-0", children: "灰度标志:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { placeholder: "请选择", defaultValue: "正式", className: "flex-1", allowClear: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "正式", children: "正式" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "灰度", children: "灰度" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 w-20 text-right mr-3 shrink-0", children: "触警日期:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RangePicker, { className: "flex-1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-20 mr-3 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Radio.Group, { value: alertType, onChange: (e) => setAlertType(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { value: "today", children: "当日触警" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { value: "history", children: "历史触警" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "重置" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none", onClick: handleSearch, children: "查询" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-1.5 bg-[#ff4d4f] text-white rounded cursor-pointer hover:bg-[#ff7875] transition-colors text-sm font-medium", children: "三级预警 0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-1.5 bg-[#fff7e6] text-[#fa8c16] border border-[#ffd591] rounded cursor-pointer hover:bg-[#ffe7ba] transition-colors text-sm font-medium", children: "二级预警 0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-1.5 bg-[#e6f7ff] text-[#1890ff] border border-[#91d5ff] rounded cursor-pointer hover:bg-[#bae0ff] transition-colors text-sm font-medium", children: "一级预警 0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-gray-400" }),
            " 全部 0"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}), className: "text-[#1890ff] border-[#1890ff] hover:!text-[#096dd9] hover:!border-[#096dd9]", children: "导出" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}), className: "text-[#1890ff] border-[#1890ff] hover:!text-[#096dd9] hover:!border-[#096dd9]", children: "列管理" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ForwardTable,
        {
          columns,
          dataSource: mockData,
          rowKey: "id",
          loading,
          pagination: {
            pageSize: 20,
            showTotal: (total) => `共 ${total} 条记录`,
            showSizeChanger: true
          },
          scroll: { x: "max-content", y: "calc(100vh - 420px)" },
          size: "middle",
          className: "custom-table"
        }
      ) })
    ] })
  ] });
};
export {
  AlertQuery as default
};
