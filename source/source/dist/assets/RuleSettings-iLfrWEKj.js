import { r as reactExports, I as Icon, f as useNavigate, j as jsxRuntimeExports } from "./index-CUErrqgd.js";
import { T as Typography } from "./index-D6bScF1D.js";
import { R as RefIcon$1 } from "./InfoCircleOutlined-DkqRirar.js";
import { R as RefIcon$2 } from "./CheckCircleOutlined-qQyiTVbe.js";
import { C as CompoundedSpace } from "./index-DMsHtZNk.js";
import { B as Button } from "./button-DMDTHtWf.js";
import { I as Input } from "./index-HqjRjDrR.js";
import { S as Select } from "./index-D37x-ts6.js";
import { F as ForwardTable } from "./Table-DpJrvGn6.js";
import { T as Tree } from "./index-DNc7br9R.js";
import "./asyncToGenerator-Bn7YJjF8.js";
import "./index-BKheaG9T.js";
import "./compact-item-T75FitAV.js";
import "./useZIndex-BReSjmbj.js";
import "./reactNode-TfIvHo6t.js";
import "./TextArea-Cw6hnbxh.js";
import "./render-uL5zGIDv.js";
import "./LoadingOutlined-s4PR_g90.js";
import "./pickAttrs-B6Vs2P5v.js";
import "./Overflow-DO7wolsL.js";
import "./PurePanel-GUILNfpz.js";
import "./index-BC0QXd6g.js";
import "./RightOutlined-BAFHU4sg.js";
import "./EllipsisOutlined-BuwqaHFz.js";
import "./responsiveObserver-ChKXsNUO.js";
import "./useBreakpoint-CZwDkAga.js";
import "./index-DpyJnIWD.js";
var LineChartOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 628.5c3.1 3.1 8.2 3.1 11.3 0l275.4-275.3c3.1-3.1 3.1-8.2 0-11.3l-39.6-39.6a8.03 8.03 0 00-11.3 0l-230 229.9L461.4 404a8.03 8.03 0 00-11.3 0L266.3 586.7a8.03 8.03 0 000 11.3l39.5 39.7z" } }] }, "name": "line-chart", "theme": "outlined" };
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
const LineChartOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: LineChartOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(LineChartOutlined);
const { Title, Text } = Typography;
const mockData = Array.from({ length: 10 }).map((_, i) => {
  const status = i === 4 ? "pending" : i % 3 === 0 ? "disabled" : "enabled";
  return {
    id: `R${1e4 + i}`,
    ruleNo: "50036",
    ruleName: "UST-A-TYFXRZGB",
    modelType: "异常交易类",
    status,
    ruleCount: 8,
    creator: "018566",
    createTime: "2026-01-26 17:32:01",
    updateTime: "2026-01-26 17:32:01"
  };
});
const mockSingleData = [
  {
    id: "S1",
    ruleNo: "30736",
    ruleType: "连续竞价阶段拉抬打压控制",
    ruleName: "issuer",
    status: "enabled",
    priority: 5,
    accountControlType: "对接系统",
    jointControlMode: "单独控制",
    securityControlMethod: "证券类别",
    securitySummaryMethod: "分组计算",
    creator: "018566",
    modifier: "018566",
    createTime: "2026-02-12 12:00:00",
    updateTime: "2026-02-12 14:30:00"
  },
  {
    id: "S2",
    ruleNo: "30721",
    ruleType: "连续竞价阶段拉抬打压控制",
    ruleName: "咨询解耦测试16",
    status: "enabled",
    priority: 5,
    accountControlType: "证券账户",
    jointControlMode: "单独控制",
    securityControlMethod: "动态维度",
    securitySummaryMethod: "单独计算",
    creator: "018566",
    modifier: "018566",
    createTime: "2026-02-11 15:00:00",
    updateTime: "2026-02-11 16:20:00"
  },
  {
    id: "S3",
    ruleNo: "30718",
    ruleType: "连续竞价阶段拉抬打压控制",
    ruleName: "testA",
    status: "enabled",
    priority: 5,
    accountControlType: "对接系统",
    jointControlMode: "单独控制",
    securityControlMethod: "证券类别",
    securitySummaryMethod: "单独计算",
    creator: "018566",
    modifier: "018566",
    createTime: "2026-02-11 13:00:00",
    updateTime: "2026-02-11 13:45:00"
  },
  {
    id: "S4",
    ruleNo: "5341",
    ruleType: "连续竞价阶段拉抬打压控制",
    ruleName: "test09-5",
    status: "enabled",
    priority: 5,
    accountControlType: "对接系统",
    jointControlMode: "单独控制",
    securityControlMethod: "证券类别",
    securitySummaryMethod: "单独计算",
    creator: "019330",
    modifier: "018566",
    createTime: "2025-09-05 10:00:00",
    updateTime: "2025-09-06 09:15:00"
  }
];
const treeData = [
  {
    title: "异常交易类",
    key: "0-0",
    children: [
      {
        title: "拉抬打压",
        key: "0-0-0",
        children: [
          { title: "连续竞价阶段拉抬打压控制", key: "0-0-0-0" }
        ]
      },
      {
        title: "自买自卖",
        key: "0-0-1",
        children: [
          { title: "同账户自买自卖", key: "0-0-1-0" },
          { title: "跨账户自买自卖", key: "0-0-1-1" }
        ]
      },
      {
        title: "频繁撤单",
        key: "0-0-2",
        children: [
          { title: "日内频繁撤单", key: "0-0-2-0" },
          { title: "大额频繁撤单", key: "0-0-2-1" }
        ]
      },
      {
        title: "虚假申报",
        key: "0-0-3",
        children: [
          { title: "开盘集合竞价阶段虚假申报", key: "0-0-3-0" }
        ]
      }
    ]
  },
  {
    title: "集中度类",
    key: "0-1",
    children: [
      {
        title: "个股集中度",
        key: "0-1-0",
        children: [
          { title: "单只股票持仓占比", key: "0-1-0-0" },
          { title: "单只股票流通股占比", key: "0-1-0-1" }
        ]
      },
      {
        title: "行业集中度",
        key: "0-1-1",
        children: [
          { title: "单一行业持仓占比", key: "0-1-1-0" }
        ]
      }
    ]
  }
];
const RuleSettings = () => {
  const [loading, setLoading] = reactExports.useState(false);
  const [activeCard, setActiveCard] = reactExports.useState("single");
  const navigate = useNavigate();
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };
  const handleCreate = () => {
    if (activeCard === "single") {
      navigate("/single-rule-create");
    } else {
      navigate("/rule-create");
    }
  };
  const columns = [
    { title: "指标组编号", dataIndex: "ruleNo", width: 120 },
    { title: "指标组名称", dataIndex: "ruleName", width: 180 },
    {
      title: "模型类型",
      dataIndex: "modelType",
      width: 120,
      render: (text) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#1890ff] border border-[#1890ff] px-2 py-0.5 rounded text-xs bg-[#e6f7ff]", children: text })
    },
    {
      title: "启用状态",
      dataIndex: "status",
      width: 120,
      render: (status) => {
        if (status === "enabled") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#1890ff]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-1.5 h-1.5 rounded-full bg-[#1890ff] mr-2" }),
          "已启用"
        ] });
        if (status === "disabled") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2" }),
          "已停用"
        ] });
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-orange-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mr-2" }),
          "待审核"
        ] });
      }
    },
    {
      title: "包含规则类型数",
      dataIndex: "ruleCount",
      width: 140,
      align: "center",
      render: (count) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#1890ff] bg-[#e6f7ff] px-3 py-0.5 rounded font-medium", children: count })
    },
    { title: "创建人", dataIndex: "creator", width: 100 },
    { title: "创建时间", dataIndex: "createTime", width: 160 },
    { title: "更新时间", dataIndex: "updateTime", width: 160 },
    {
      title: "操作",
      key: "action",
      width: 300,
      render: (_, record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { size: "middle", className: "text-[#1890ff]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", onClick: () => navigate(`/rule-view/${record.id}`), children: "查看" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", onClick: () => navigate(`/rule-view/${record.id}`), children: "绑定账户组" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", children: record.status === "enabled" ? "禁用" : "启用" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", onClick: () => navigate(`/rule-edit/${record.id}`), children: "编辑" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", children: "复制" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", children: "删除" })
      ] })
    }
  ];
  const singleColumns = [
    { title: "规则编号", dataIndex: "ruleNo", width: 100 },
    {
      title: "规则类型",
      dataIndex: "ruleType",
      width: 200,
      render: (text) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-1 rounded text-[#1890ff] bg-[#e6f7ff] border border-[#91d5ff] text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
        " ",
        text
      ] })
    },
    { title: "规则名称", dataIndex: "ruleName", width: 140 },
    {
      title: "启用状态",
      dataIndex: "status",
      width: 100,
      render: (status) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#1890ff] flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#1890ff]" }),
        "已启用"
      ] })
    },
    {
      title: "优先级",
      dataIndex: "priority",
      width: 80,
      render: (val) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-2 py-0.5 rounded text-[#1890ff] bg-[#e6f7ff] border border-[#91d5ff] text-xs", children: val })
    },
    {
      title: "账户控制类型",
      dataIndex: "accountControlType",
      width: 120,
      render: (text) => {
        const isSystem = text === "对接系统";
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2 py-0.5 rounded text-xs border ${isSystem ? "text-[#eb2f96] bg-[#fff0f6] border-[#ffadd2]" : "text-[#1890ff] bg-[#e6f7ff] border-[#91d5ff]"}`, children: text });
      }
    },
    {
      title: "联合控制模式",
      dataIndex: "jointControlMode",
      width: 120,
      render: (text) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-2 py-0.5 rounded text-[#722ed1] bg-[#f9f0ff] border-[#d3adf7] text-xs", children: text })
    },
    { title: "证券控制方式", dataIndex: "securityControlMethod", width: 120 },
    { title: "证券汇总方式", dataIndex: "securitySummaryMethod", width: 120 },
    { title: "创建人", dataIndex: "creator", width: 80 },
    { title: "修改人", dataIndex: "modifier", width: 80 },
    { title: "创建时间", dataIndex: "createTime", width: 160 },
    { title: "更新时间", dataIndex: "updateTime", width: 160 },
    {
      title: "操作",
      key: "action",
      width: 220,
      render: (_, record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { size: "small", className: "text-[#1890ff]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", onClick: () => navigate(`/single-rule-view/${record.id}`), children: "查看" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", children: "禁用" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", onClick: () => navigate(`/single-rule-edit/${record.id}`), children: "编辑" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", children: "复制" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", children: "删除" })
      ] })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 h-full flex flex-col absolute inset-0 bg-white overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-center mb-6 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: { margin: 0, color: "#333" }, children: "规则设置" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { className: "text-gray-400" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 mb-8 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `w-64 h-24 bg-white rounded-lg shadow-sm p-4 relative overflow-hidden flex flex-col justify-center cursor-pointer transition-all ${activeCard === "single" ? "border-2 border-[#1890ff]" : "border border-gray-200 hover:border-[#1890ff]/50"}`,
          onClick: () => setActiveCard("single"),
          children: [
            activeCard === "single" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-[#1890ff] border-l-[24px] border-l-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { className: "absolute -top-[22px] -left-[14px] text-white text-[10px]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-800 font-medium text-sm mb-1", children: "单个规则指标" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-gray-800", children: "15" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-4 bottom-4 opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-blue-300 rounded-full" }) }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `w-64 h-24 bg-white rounded-lg shadow-sm p-4 relative overflow-hidden flex flex-col justify-center cursor-pointer transition-all ${activeCard === "template" ? "border-2 border-[#1890ff]" : "border border-gray-200 hover:border-[#1890ff]/50"}`,
          onClick: () => setActiveCard("template"),
          children: [
            activeCard === "template" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-[#1890ff] border-l-[24px] border-l-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { className: "absolute -top-[22px] -left-[14px] text-white text-[10px]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-800 font-medium text-sm mb-1", children: "模板生成指标" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-gray-800", children: "27" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-4 bottom-4 opacity-80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "40", height: "40", viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M24 4L4 14L24 24L44 14L24 4Z", fill: "#91d5ff", stroke: "#1890ff", strokeWidth: "2", strokeLinejoin: "round" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 24L24 34L44 24", stroke: "#1890ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 34L24 44L44 34", stroke: "#1890ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
            ] }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end mb-4 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-gray-800 mb-1", children: activeCard === "template" ? "多个规则类型模板创建的指标组" : "单个规则创建生成的指标" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-500", children: activeCard === "template" ? "通过恒定空模板批量创建风控指标，简化配置流程" : "通过自定义规则创建的指标，包含详细的配置信息" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none", onClick: handleCreate, children: "创建新指标" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "text-[#1890ff] border-[#1890ff] hover:!text-[#096dd9] hover:!border-[#096dd9]", children: "导出数据" })
      ] })
    ] }),
    activeCard === "template" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 p-4 rounded border border-gray-200 mb-4 flex flex-wrap gap-4 items-center shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "指标组编号：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "请输入", style: { width: 180 } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "指标组名称：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "请输入", style: { width: 180 } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "启用状态：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { placeholder: "请选择", style: { width: 150 }, options: [{ value: "enabled", label: "已启用" }, { value: "disabled", label: "已停用" }] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "创建人：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "请输入", style: { width: 150 } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "重置" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none", onClick: handleSearch, children: "查询" })
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
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
            showSizeChanger: true,
            showQuickJumper: true,
            position: ["bottomRight"]
          },
          scroll: { x: "max-content", y: "calc(100vh - 480px)" },
          size: "middle",
          className: "custom-rule-table"
        }
      ) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-6 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[280px] shrink-0 border border-gray-200 rounded-lg p-4 overflow-y-auto bg-gray-50/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-gray-600 mb-4", children: "规则类型导航" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tree,
          {
            showLine: true,
            defaultExpandAll: true,
            treeData,
            className: "bg-transparent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 p-3 rounded border border-gray-200 mb-4 flex flex-wrap gap-3 items-center shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "规则编号", style: { width: 140 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "规则名称", style: { width: 140 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { placeholder: "启用状态", style: { width: 120 }, options: [{ value: "enabled", label: "已启用" }, { value: "disabled", label: "已停用" }] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "创建人", style: { width: 120 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", children: "重置" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", size: "small", className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none", onClick: handleSearch, children: "查询" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            columns: singleColumns,
            dataSource: mockSingleData,
            rowKey: "id",
            loading,
            pagination: {
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条记录`,
              showSizeChanger: true,
              showQuickJumper: true,
              position: ["bottomRight"]
            },
            scroll: { x: "max-content", y: "calc(100vh - 480px)" },
            size: "middle",
            className: "custom-rule-table"
          }
        ) })
      ] })
    ] })
  ] });
};
export {
  RuleSettings,
  RuleSettings as default
};
