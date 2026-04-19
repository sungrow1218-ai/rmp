import { f as useNavigate, n as useParams, r as reactExports, j as jsxRuntimeExports } from "./index-CUErrqgd.js";
import { F as Form } from "./index-CYeT6-j6.js";
import { B as Button } from "./button-DMDTHtWf.js";
import { R as RefIcon, C as Collapse } from "./ArrowLeftOutlined-Dpx_FtIN.js";
import { T as Typography } from "./index-D6bScF1D.js";
import { C as CompoundedSpace } from "./index-DMsHtZNk.js";
import { R as RefIcon$1, S as Switch } from "./SaveOutlined-BLJ2X18G.js";
import { R as RefIcon$2 } from "./CheckCircleOutlined-qQyiTVbe.js";
import { I as Input } from "./index-HqjRjDrR.js";
import { S as Select } from "./index-D37x-ts6.js";
import { T as TypedInputNumber } from "./index-GAqaRoyL.js";
import { D as DatePicker } from "./index-kyMbMI4L.js";
import { T as TimePicker } from "./index-DZVcc6_G.js";
import { s as staticMethods } from "./index-CCOmhxaD.js";
import "./index-BKheaG9T.js";
import "./compact-item-T75FitAV.js";
import "./asyncToGenerator-Bn7YJjF8.js";
import "./useZIndex-BReSjmbj.js";
import "./reactNode-TfIvHo6t.js";
import "./TextArea-Cw6hnbxh.js";
import "./responsiveObserver-ChKXsNUO.js";
import "./row-B49boWar.js";
import "./ExclamationCircleFilled-CXyczA-G.js";
import "./LoadingOutlined-s4PR_g90.js";
import "./render-uL5zGIDv.js";
import "./RightOutlined-BAFHU4sg.js";
import "./pickAttrs-B6Vs2P5v.js";
import "./Overflow-DO7wolsL.js";
import "./PurePanel-GUILNfpz.js";
import "./context-CN2GVsG0.js";
import "./InfoCircleFilled-6TjWreYB.js";
const { Title } = Typography;
const { Panel } = Collapse;
const SingleRuleEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = reactExports.useState(false);
  const [dataLoading, setDataLoading] = reactExports.useState(true);
  const accountControlType = Form.useWatch("accountControlType", form);
  reactExports.useEffect(() => {
    setTimeout(() => {
      form.setFieldsValue({
        ruleName: "连续竞价阶段拉抬打压控制 - 编辑",
        ruleType: "连续竞价阶段拉抬打压控制",
        priority: 5,
        status: true,
        description: "这是一个用于测试编辑功能的指标",
        accountControlType: "对接系统",
        jointControlMode: "单独控制",
        dockingSystem: ["sys1", "sys2"],
        securityControlMethod: "按动态维度",
        securitySummaryMethod: "单独计算",
        market: ["SH", "SZ"],
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
        ratio_t3: 15
      });
      setDataLoading(false);
    }, 500);
  }, [form, id]);
  const handleBack = () => {
    navigate("/rule-settings");
  };
  const handleSave = async (isSubmit = false) => {
    try {
      await form.validateFields();
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        staticMethods.success(isSubmit ? "提交审核成功" : "保存修改成功");
        navigate("/rule-settings");
      }, 800);
    } catch (error) {
      console.error("Validation failed:", error);
      staticMethods.error("请检查必填项是否已填写完整");
    }
  };
  if (dataLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center bg-gray-50 text-gray-500", children: "加载中..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col absolute inset-0 bg-gray-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 shadow-sm z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "text", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}), onClick: handleBack, className: "text-gray-500 hover:text-[#1890ff]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: { margin: 0, color: "#333" }, children: "编辑单个规则指标" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleBack, children: "取消" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}), onClick: () => handleSave(false), loading, children: "保存修改" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}), onClick: () => handleSave(true), loading, children: "提交审核" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Form,
      {
        form,
        layout: "vertical",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "ruleName", label: "规则名称", rules: [{ required: true, message: "请输入规则名称" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "请输入规则名称" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "ruleType", label: "规则类型", rules: [{ required: true, message: "请选择规则类型" }], children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "连续竞价阶段拉抬打压控制", children: "连续竞价阶段拉抬打压控制" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "开盘集合竞价阶段虚假申报", children: "开盘集合竞价阶段虚假申报" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "连续竞价阶段虚假申报控制", children: "连续竞价阶段虚假申报控制" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "证券持仓数量控制", children: "证券持仓数量控制" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "证券持仓比例控制", children: "证券持仓比例控制" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "priority", label: "优先级", rules: [{ required: true, message: "请输入优先级" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 1, max: 10, style: { width: "100%" } }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "status", label: "启用状态", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checkedChildren: "启用", unCheckedChildren: "停用" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "description", label: "规则描述", className: "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "请输入规则描述（选填）" }) })
                  ] })
                },
                "basic"
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Panel,
                {
                  header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "账户控制范围" }),
                  className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "accountControlType", label: "账户控制类型", rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "对接系统", children: "对接系统" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "证券账户", children: "证券账户" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "投资组合", children: "投资组合" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "jointControlMode", label: "联合控制模式", rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "单独控制", children: "单独控制" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "联合控制", children: "联合控制" })
                    ] }) }),
                    accountControlType === "对接系统" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "dockingSystem", label: "对接系统", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { mode: "multiple", placeholder: "请选择对接系统（留空表示全部）", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "sys1", children: "O32投资交易系统" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "sys2", children: "PB投资交易系统" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "sys3", children: "集中交易系统" })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "excludeAccountType", label: "排除账户类型", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { mode: "multiple", placeholder: "请选择排除账户类型", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "type1", children: "信用账户" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "type2", children: "衍生品账户" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "type3", children: "期权账户" })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "excludeAccountList", label: "排除账户列表", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { mode: "multiple", placeholder: "请选择排除账户", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "acc1", children: "测试账户01" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "acc2", children: "测试账户02" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "acc3", children: "自营特殊账户" })
                      ] }) })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "includedAccounts", label: "包含账户/系统", className: "col-span-1 md:col-span-2 lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { mode: "multiple", placeholder: "请选择要控制的账户或系统（留空表示全部）", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "sys1", children: "O32投资交易系统" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "sys2", children: "PB投资交易系统" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "acc1", children: "自营账户A" })
                    ] }) })
                  ] })
                },
                "account"
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Panel,
                {
                  header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "证券控制范围" }),
                  className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "securityControlMethod", label: "证券控制方式", rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "按动态维度", children: "按动态维度" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "证券类别", children: "证券类别" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "指定证券", children: "指定证券" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "securitySummaryMethod", label: "证券汇总方式", rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "单独计算", children: "单独计算" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "分组计算", children: "分组计算" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "dynamicDimension", label: "动态维度列表", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { mode: "multiple", placeholder: "请选择动态维度", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "dim1", children: "行业维度" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "dim2", children: "板块维度" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "dim3", children: "概念维度" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "market", label: "市场", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { mode: "multiple", placeholder: "请选择市场", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "SH", children: "上海证券交易所" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "SZ", children: "深圳证券交易所" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "BJ", children: "北京证券交易所" })
                    ] }) })
                  ] })
                },
                "security"
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Panel,
                {
                  header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "计算参数" }),
                  className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "timeWindow", label: "时间窗口", rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: 1, children: "1分钟" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: 3, children: "3分钟" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: 5, children: "5分钟" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: 10, children: "10分钟" })
                  ] }) }) })
                },
                "calc"
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Panel,
                {
                  header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "通用阈值" }),
                  className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 pb-2 border-b border-gray-100 text-gray-500 font-medium text-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "阈值条件" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "一级阈值" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "二级阈值" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "三级阈值" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 items-start", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 text-gray-700 font-medium", children: "成交金额 (万元)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "amount_t1", rules: [{ required: true, message: "必填" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { className: "w-full", placeholder: "请输入" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "amount_t2", rules: [{ required: true, message: "必填" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { className: "w-full", placeholder: "请输入" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "amount_t3", rules: [{ required: true, message: "必填" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { className: "w-full", placeholder: "请输入" }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 items-start", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 text-gray-700 font-medium", children: "成交数量 (万股)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "volume_t1", rules: [{ required: true, message: "必填" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { className: "w-full", placeholder: "请输入" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "volume_t2", rules: [{ required: true, message: "必填" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { className: "w-full", placeholder: "请输入" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "volume_t3", rules: [{ required: true, message: "必填" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { className: "w-full", placeholder: "请输入" }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 items-start", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 text-gray-700 font-medium", children: "成交价格涨跌幅 (%)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "price_t1", rules: [{ required: true, message: "必填" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { className: "w-full", placeholder: "请输入" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "price_t2", rules: [{ required: true, message: "必填" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { className: "w-full", placeholder: "请输入" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "price_t3", rules: [{ required: true, message: "必填" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { className: "w-full", placeholder: "请输入" }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 items-start", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 text-gray-700 font-medium", children: "市场成交占比 (%)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "ratio_t1", rules: [{ required: true, message: "必填" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { className: "w-full", placeholder: "请输入" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "ratio_t2", rules: [{ required: true, message: "必填" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { className: "w-full", placeholder: "请输入" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "ratio_t3", rules: [{ required: true, message: "必填" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { className: "w-full", placeholder: "请输入" }) })
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
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "effectiveDate", label: "生效日期", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DatePicker.RangePicker, { className: "w-full" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "effectiveTime", label: "生效时间", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TimePicker.RangePicker, { className: "w-full", format: "HH:mm:ss" }) })
                  ] })
                },
                "advanced"
              )
            ]
          }
        )
      }
    ) }) })
  ] });
};
export {
  SingleRuleEdit,
  SingleRuleEdit as default
};
