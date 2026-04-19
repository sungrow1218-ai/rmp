import { f as useNavigate, n as useParams, r as reactExports, j as jsxRuntimeExports } from "./index-CUErrqgd.js";
import { B as Button } from "./button-DMDTHtWf.js";
import { R as RefIcon, C as Collapse } from "./ArrowLeftOutlined-Dpx_FtIN.js";
import { T as Typography } from "./index-D6bScF1D.js";
import { C as CompoundedSpace } from "./index-DMsHtZNk.js";
import { D as Descriptions } from "./index-DEBjrD9B.js";
import { T as Tag } from "./index-C_p_uySS.js";
import "./reactNode-TfIvHo6t.js";
import "./compact-item-T75FitAV.js";
import "./asyncToGenerator-Bn7YJjF8.js";
import "./render-uL5zGIDv.js";
import "./LoadingOutlined-s4PR_g90.js";
import "./RightOutlined-BAFHU4sg.js";
import "./index-BKheaG9T.js";
import "./useZIndex-BReSjmbj.js";
import "./pickAttrs-B6Vs2P5v.js";
import "./responsiveObserver-ChKXsNUO.js";
import "./TextArea-Cw6hnbxh.js";
import "./useBreakpoint-CZwDkAga.js";
import "./useClosable-BjqEnKhC.js";
const { Title } = Typography;
const { Panel } = Collapse;
const SingleRuleView = () => {
  var _a, _b, _c, _d, _e, _f;
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = reactExports.useState(true);
  const [data, setData] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setTimeout(() => {
      setData({
        ruleName: "连续竞价阶段拉抬打压控制 - 示例",
        ruleType: "连续竞价阶段拉抬打压控制",
        priority: 5,
        status: true,
        description: "这是一个用于测试查看功能的指标",
        accountControlType: "对接系统",
        jointControlMode: "单独控制",
        dockingSystem: ["O32投资交易系统", "PB投资交易系统"],
        excludeAccountType: [],
        excludeAccountList: [],
        securityControlMethod: "按动态维度",
        securitySummaryMethod: "单独计算",
        dynamicDimension: ["行业维度", "板块维度"],
        market: ["上海证券交易所", "深圳证券交易所"],
        timeWindow: 3,
        amount_t1: 100,
        amount_t2: 200,
        amount_t3: 300,
        volume_t1: 10,
        volume_t2: 20,
        volume_t3: 30,
        price_t1: 2,
        price_t2: 4,
        price_t3: 6,
        ratio_t1: 5,
        ratio_t2: 10,
        ratio_t3: 15,
        effectiveDate: ["2023-01-01", "2023-12-31"],
        effectiveTime: ["09:30:00", "15:00:00"]
      });
      setLoading(false);
    }, 500);
  }, [id]);
  const handleBack = () => {
    navigate("/rule-settings");
  };
  if (loading || !data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center bg-gray-50 text-gray-500", children: "加载中..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col absolute inset-0 bg-gray-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 shadow-sm z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "text", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}), onClick: handleBack, className: "text-gray-500 hover:text-[#1890ff]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: { margin: 0, color: "#333" }, children: "查看单个规则指标" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleBack, children: "返回" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none", onClick: () => navigate(`/single-rule-edit/${id}`), children: "编辑指标" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Collapse,
      {
        defaultActiveKey: ["basic", "account", "security", "calc", "threshold", "advanced"],
        className: "bg-transparent border-none flex flex-col gap-4",
        expandIconPosition: "end",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "基本信息" }),
              className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { column: { xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "规则名称", children: data.ruleName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "规则类型", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", children: data.ruleType }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "优先级", children: data.priority }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "启用状态", children: data.status ? /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "success", children: "已启用" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "error", children: "已停用" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "规则描述", span: 2, children: data.description || "-" })
              ] })
            },
            "basic"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "账户控制范围" }),
              className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { column: { xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "账户控制类型", children: data.accountControlType }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "联合控制模式", children: data.jointControlMode }),
                data.accountControlType === "对接系统" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "对接系统", children: ((_a = data.dockingSystem) == null ? void 0 : _a.join(", ")) || "全部" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "排除账户类型", children: ((_b = data.excludeAccountType) == null ? void 0 : _b.join(", ")) || "无" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "排除账户列表", children: ((_c = data.excludeAccountList) == null ? void 0 : _c.join(", ")) || "无" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "包含账户/系统", children: ((_d = data.includedAccounts) == null ? void 0 : _d.join(", ")) || "全部" })
              ] })
            },
            "account"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "证券控制范围" }),
              className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { column: { xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "证券控制方式", children: data.securityControlMethod }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "证券汇总方式", children: data.securitySummaryMethod }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "动态维度列表", children: ((_e = data.dynamicDimension) == null ? void 0 : _e.join(", ")) || "-" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "市场", children: ((_f = data.market) == null ? void 0 : _f.join(", ")) || "-" })
              ] })
            },
            "security"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "计算参数" }),
              className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions, { column: { xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions.Item, { label: "时间窗口", children: [
                data.timeWindow,
                " 分钟"
              ] }) })
            },
            "calc"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "通用阈值" }),
              className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 pb-2 border-b border-gray-100 text-gray-500 font-medium text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "阈值条件" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "一级阈值" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "二级阈值" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "三级阈值" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-700 font-medium", children: "成交金额 (万元)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] font-medium", children: data.amount_t1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] font-medium", children: data.amount_t2 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] font-medium", children: data.amount_t3 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-700 font-medium", children: "成交数量 (万股)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] font-medium", children: data.volume_t1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] font-medium", children: data.volume_t2 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] font-medium", children: data.volume_t3 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-700 font-medium", children: "成交价格涨跌幅 (%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] font-medium", children: data.price_t1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] font-medium", children: data.price_t2 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] font-medium", children: data.price_t3 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-700 font-medium", children: "市场成交占比 (%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] font-medium", children: data.ratio_t1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] font-medium", children: data.ratio_t2 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] font-medium", children: data.ratio_t3 })
                ] })
              ] })
            },
            "threshold"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "高级控制" }),
              className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { column: { xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "生效日期", children: data.effectiveDate ? `${data.effectiveDate[0]} 至 ${data.effectiveDate[1]}` : "-" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "生效时间", children: data.effectiveTime ? `${data.effectiveTime[0]} 至 ${data.effectiveTime[1]}` : "-" })
              ] })
            },
            "advanced"
          )
        ]
      }
    ) }) })
  ] });
};
export {
  SingleRuleView,
  SingleRuleView as default
};
