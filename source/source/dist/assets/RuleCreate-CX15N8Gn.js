import { f as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-CUErrqgd.js";
import { F as Form } from "./index-CYeT6-j6.js";
import { B as Button } from "./button-DMDTHtWf.js";
import { R as RefIcon, C as Collapse } from "./ArrowLeftOutlined-Dpx_FtIN.js";
import { T as Typography } from "./index-D6bScF1D.js";
import { C as CompoundedSpace } from "./index-DMsHtZNk.js";
import { R as RefIcon$1, S as Switch } from "./SaveOutlined-BLJ2X18G.js";
import { R as RefIcon$2 } from "./CheckCircleOutlined-qQyiTVbe.js";
import { I as Input } from "./index-HqjRjDrR.js";
import { R as RefIcon$3 } from "./InfoCircleOutlined-DkqRirar.js";
import { T as Tree, C as Checkbox } from "./index-DNc7br9R.js";
import { T as Tabs } from "./index-nHZQBtRj.js";
import { M as Modal } from "./index-BO0cQK6u.js";
import { S as Select } from "./index-D37x-ts6.js";
import { s as staticMethods } from "./index-CCOmhxaD.js";
import { R as RefIcon$4, a as RefIcon$5 } from "./PlusOutlined-zS7VbAx6.js";
import { T as TypedInputNumber } from "./index-GAqaRoyL.js";
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
import "./EllipsisOutlined-BuwqaHFz.js";
import "./Overflow-DO7wolsL.js";
import "./PlusOutlined-DF-GsZDp.js";
import "./InfoCircleFilled-6TjWreYB.js";
import "./useClosable-BjqEnKhC.js";
import "./context-C5GnONAC.js";
import "./PurePanel-GUILNfpz.js";
import "./context-CN2GVsG0.js";
const { Title } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const treeData = [
  {
    title: "异常交易类",
    key: "abnormal",
    children: [
      {
        title: "拉抬打压",
        key: "manipulation",
        children: [
          { title: "连续竞价阶段拉抬打压控制", key: "continuous_bidding" }
        ]
      },
      {
        title: "虚假申报",
        key: "false_declaration",
        children: [
          { title: "开盘集合竞价阶段虚假申报", key: "open_call_auction_false_declaration" },
          { title: "连续竞价阶段虚假申报控制", key: "continuous_false_declaration" }
        ]
      }
    ]
  }
];
const defaultScopes = {
  continuous_bidding: {
    SH: [
      { id: "riskWarning", name: "风险警示股" },
      { id: "sz50", name: "上证50成分股" },
      { id: "other", name: "非上证50非风险警示股" }
    ],
    SZ: [
      { id: "riskWarning", name: "风险警示股" },
      { id: "other", name: "非风险警示股" }
    ]
  },
  open_call_auction_false_declaration: {
    SH: [
      { id: "riskWarning", name: "风险警示股" },
      { id: "other", name: "非风险警示股" }
    ],
    SZ: [
      { id: "riskWarning", name: "风险警示股" },
      { id: "other", name: "非风险警示股" }
    ]
  },
  continuous_false_declaration: {
    SH: [
      { id: "riskWarning", name: "风险警示股" },
      { id: "other", name: "非风险警示股" }
    ],
    SZ: [
      { id: "riskWarning", name: "风险警示股" },
      { id: "other", name: "非风险警示股" }
    ]
  }
};
const dynamicDimensionGroups = [
  { value: "dim_industry_a", label: "行业维度组A" },
  { value: "dim_sector_b", label: "板块维度组B" },
  { value: "dim_concept_c", label: "概念维度组C" },
  { value: "dim_custom_d", label: "自定义证券组D" },
  { value: "dim_core_assets", label: "核心资产组" }
];
const RuleCreate = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedKeys, setSelectedKeys] = reactExports.useState([]);
  const [checkedKeys, setCheckedKeys] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [selectedMarkets, setSelectedMarkets] = reactExports.useState(["SH", "SZ"]);
  const [activeMarketTab, setActiveMarketTab] = reactExports.useState("SH");
  const [scopes, setScopes] = reactExports.useState(defaultScopes);
  const [isAddScopeModalVisible, setIsAddScopeModalVisible] = reactExports.useState(false);
  const [selectedNewScopes, setSelectedNewScopes] = reactExports.useState([]);
  const [addScopeContext, setAddScopeContext] = reactExports.useState(null);
  const handleBack = () => {
    navigate("/rule-settings");
  };
  const handleSave = async (isSubmit = false) => {
    try {
      await form.validateFields();
      if (checkedKeys.length === 0) {
        staticMethods.warning("请至少勾选一个规则类型进行配置");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        staticMethods.success(isSubmit ? "提交审核成功" : "保存草稿成功");
        navigate("/rule-settings");
      }, 800);
    } catch (error) {
      console.error("Validation failed:", error);
      staticMethods.error("请检查必填项是否已填写完整");
    }
  };
  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue.checked || checkedKeysValue);
  };
  const handleMarketChange = (list) => {
    setSelectedMarkets(list);
    if (list.length > 0 && !list.includes(activeMarketTab)) {
      setActiveMarketTab(list[0]);
    }
  };
  const handleAddScopeOk = () => {
    if (selectedNewScopes.length === 0) {
      staticMethods.warning("请选择证券范围");
      return;
    }
    if (addScopeContext) {
      const { ruleKey, market } = addScopeContext;
      setScopes((prev) => {
        const currentScopes = prev[ruleKey][market];
        const combinedId = selectedNewScopes.join(",");
        const combinedName = selectedNewScopes.map((val) => {
          const option = dynamicDimensionGroups.find((g) => g.value === val);
          return (option == null ? void 0 : option.label) || val;
        }).join("、");
        if (currentScopes.some((s) => s.id === combinedId)) {
          staticMethods.warning("所选证券范围组合已存在");
          return prev;
        }
        return {
          ...prev,
          [ruleKey]: {
            ...prev[ruleKey],
            [market]: [
              ...currentScopes,
              { id: combinedId, name: combinedName }
            ]
          }
        };
      });
    }
    setIsAddScopeModalVisible(false);
    setSelectedNewScopes([]);
  };
  const handleRemoveScope = (ruleKey, market, scopeId) => {
    setScopes((prev) => {
      const list = prev[ruleKey][market];
      if (list.length <= 1) {
        staticMethods.warning("至少需要保留一个证券范围");
        return prev;
      }
      return {
        ...prev,
        [ruleKey]: {
          ...prev[ruleKey],
          [market]: list.filter((item) => item.id !== scopeId)
        }
      };
    });
  };
  const renderScopes = (ruleKey, market, renderContent) => {
    const marketScopes = scopes[ruleKey][market];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "dashed",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}),
          onClick: () => {
            setAddScopeContext({ ruleKey, market });
            setSelectedNewScopes([]);
            setIsAddScopeModalVisible(true);
          },
          children: "添加证券范围"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Collapse,
        {
          defaultActiveKey: marketScopes.map((s) => s.id),
          className: "bg-white border border-gray-200 rounded-lg",
          expandIconPosition: "end",
          children: marketScopes.map((scope) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center w-full pr-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: scope.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "text",
                    danger: true,
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}),
                    onClick: (e) => {
                      e.stopPropagation();
                      handleRemoveScope(ruleKey, market, scope.id);
                    },
                    disabled: marketScopes.length <= 1
                  }
                )
              ] }),
              className: "border-b border-gray-200",
              children: renderContent(market, scope.id)
            },
            scope.id
          ))
        }
      )
    ] });
  };
  const renderThresholdContent = (market, scope) => {
    const prefix = ["thresholds", market, scope];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(一) 连续竞价阶段任意3分钟内，成交数量在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "volume_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "volume_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "volume_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "万股 以上或成交金额在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "amount_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "amount_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "amount_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "万元 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(二) 成交数量占成交期间市场成交总量的比例在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "ratio_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "ratio_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "ratio_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(三) 价格涨（跌）幅" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "price_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "price_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "price_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上" })
      ] })
    ] });
  };
  const renderFalseDeclarationThresholdContent = (market, scope) => {
    const prefix = ["false_declaration_thresholds", market, scope];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(一) 以偏离前收盘价" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "price_deviation_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "price_deviation_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "price_deviation_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上的价格申报买入或卖出" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(二) 累计申报数量在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "declare_volume_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "declare_volume_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "declare_volume_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "万股 以上或申报金额在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "declare_amount_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "declare_amount_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "declare_amount_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "万元 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(三) 累计申报数量占市场同方向申报总量的比例在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "market_declare_ratio_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "market_declare_ratio_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "market_declare_ratio_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(四) 累计撤销申报数量占累计申报数量的比例在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "cancel_ratio_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "cancel_ratio_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "cancel_ratio_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(五) 以低于申报买入价格反向申报卖出 或者 以高于申报卖出价格反向申报买入的次数在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "reverse_declare_count_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "reverse_declare_count_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "reverse_declare_count_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "次 以上" })
      ] })
    ] });
  };
  const renderContinuousFalseDeclarationThresholdContent = (market, scope) => {
    const prefix = ["continuous_false_declaration_thresholds", market, scope];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(一) 最优5档内申报买入或卖出" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(二) 单笔申报后，实时最优5档内累计剩余有效申报数量在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "volume_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "volume_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "volume_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "万股 以上或者金额在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "amount_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "amount_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "amount_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "万元 以上，且占市场同方向最优5档剩余有效申报总量的比例在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "ratio_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "ratio_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "ratio_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(三) 满足上述情形的申报发生" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "count_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "count_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "count_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "次 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(四) 累计撤销申报数量占累计申报数量的比例在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "cancel_ratio_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "cancel_ratio_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "cancel_ratio_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(五) 存在反向卖出（买入）的成交次数 在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "reverse_trade_count_t1"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "一级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "reverse_trade_count_t2"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "二级", className: "w-20 text-center", controls: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: [...prefix, "reverse_trade_count_t3"], noStyle: true, rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "三级", className: "w-20 text-center", controls: false }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "次 以上" })
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col absolute inset-0 bg-gray-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 shadow-sm z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "text", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}), onClick: handleBack, className: "text-gray-500 hover:text-[#1890ff]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: { margin: 0, color: "#333" }, children: "创建新指标 (模板生成)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleBack, children: "取消" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}), onClick: () => handleSave(false), loading, children: "保存草稿" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}), onClick: () => handleSave(true), loading, children: "提交审核" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Form,
      {
        form,
        layout: "vertical",
        initialValues: { status: true },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Collapse,
          {
            defaultActiveKey: ["basic", "rule"],
            className: "bg-transparent border-none flex flex-col gap-4",
            expandIconPosition: "end",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Panel,
                {
                  header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "基本信息" }),
                  className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Form.Item,
                      {
                        name: "ruleName",
                        label: "指标组名称",
                        rules: [{ required: true, message: "请输入指标组名称" }],
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "请输入指标组名称，如：UST-A-TYFXRZGB" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Form.Item,
                      {
                        name: "status",
                        label: "启用状态",
                        valuePropName: "checked",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checkedChildren: "启用", unCheckedChildren: "停用" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Form.Item,
                      {
                        name: "description",
                        label: "备注说明",
                        className: "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextArea, { rows: 2, placeholder: "请输入该指标组的详细说明（选填）" })
                      }
                    )
                  ] })
                },
                "basic"
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Panel,
                {
                  header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "选择风控规则" }),
                  className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-[700px] -mx-4 -mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[320px] border-r border-gray-200 p-4 overflow-y-auto bg-gray-50/50 shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 text-sm text-gray-500 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, { className: "text-[#1890ff]" }),
                        "请勾选需要配置的规则，并点击节点进行详细设置"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Tree,
                        {
                          checkable: true,
                          showLine: true,
                          defaultExpandAll: true,
                          onSelect,
                          onCheck,
                          treeData,
                          className: "bg-transparent custom-tree"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-6 overflow-y-auto bg-white", children: selectedKeys.includes("continuous_bidding") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-gray-100", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-4 bg-[#1890ff] rounded" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-gray-800", children: "连续竞价阶段拉抬打压控制 - 参数配置" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-gray-700 mb-3", children: "交易市场选择" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Checkbox.Group,
                          {
                            options: [
                              { label: "上海证券交易所 (SH)", value: "SH" },
                              { label: "深圳证券交易所 (SZ)", value: "SZ" }
                            ],
                            value: selectedMarkets,
                            onChange: (list) => handleMarketChange(list),
                            className: "flex gap-6"
                          }
                        )
                      ] }),
                      selectedMarkets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-center py-8 bg-gray-50 rounded border border-dashed border-gray-200", children: "请至少选择一个交易市场以配置阈值" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Tabs,
                        {
                          activeKey: activeMarketTab,
                          onChange: setActiveMarketTab,
                          className: "market-tabs",
                          tabBarStyle: { marginBottom: 0, padding: "0 16px", backgroundColor: "#fafafa", borderBottom: "1px solid #f0f0f0" },
                          items: [
                            ...selectedMarkets.includes("SH") ? [{
                              key: "SH",
                              label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1890ff] px-2", children: "上海证券交易所 (SH)" }),
                              children: renderScopes("continuous_bidding", "SH", renderThresholdContent)
                            }] : [],
                            ...selectedMarkets.includes("SZ") ? [{
                              key: "SZ",
                              label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1890ff] px-2", children: "深圳证券交易所 (SZ)" }),
                              children: renderScopes("continuous_bidding", "SZ", renderThresholdContent)
                            }] : []
                          ]
                        }
                      ) })
                    ] }) : selectedKeys.includes("open_call_auction_false_declaration") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-gray-100", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-4 bg-[#1890ff] rounded" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-gray-800", children: "开盘集合竞价阶段虚假申报 - 参数配置" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-gray-700 mb-3", children: "交易市场选择" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Checkbox.Group,
                          {
                            options: [
                              { label: "上海证券交易所 (SH)", value: "SH" },
                              { label: "深圳证券交易所 (SZ)", value: "SZ" }
                            ],
                            value: selectedMarkets,
                            onChange: (list) => handleMarketChange(list),
                            className: "flex gap-6"
                          }
                        )
                      ] }),
                      selectedMarkets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-center py-8 bg-gray-50 rounded border border-dashed border-gray-200", children: "请至少选择一个交易市场以配置阈值" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Tabs,
                        {
                          activeKey: activeMarketTab,
                          onChange: setActiveMarketTab,
                          className: "market-tabs",
                          tabBarStyle: { marginBottom: 0, padding: "0 16px", backgroundColor: "#fafafa", borderBottom: "1px solid #f0f0f0" },
                          items: [
                            ...selectedMarkets.includes("SH") ? [{
                              key: "SH",
                              label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1890ff] px-2", children: "上海证券交易所 (SH)" }),
                              children: renderScopes("open_call_auction_false_declaration", "SH", renderFalseDeclarationThresholdContent)
                            }] : [],
                            ...selectedMarkets.includes("SZ") ? [{
                              key: "SZ",
                              label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1890ff] px-2", children: "深圳证券交易所 (SZ)" }),
                              children: renderScopes("open_call_auction_false_declaration", "SZ", renderFalseDeclarationThresholdContent)
                            }] : []
                          ]
                        }
                      ) })
                    ] }) : selectedKeys.includes("continuous_false_declaration") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-gray-100", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-4 bg-[#1890ff] rounded" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-gray-800", children: "连续竞价阶段虚假申报控制 - 参数配置" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-gray-700 mb-3", children: "交易市场选择" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Checkbox.Group,
                          {
                            options: [
                              { label: "上海证券交易所 (SH)", value: "SH" },
                              { label: "深圳证券交易所 (SZ)", value: "SZ" }
                            ],
                            value: selectedMarkets,
                            onChange: (list) => handleMarketChange(list),
                            className: "flex gap-6"
                          }
                        )
                      ] }),
                      selectedMarkets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-center py-8 bg-gray-50 rounded border border-dashed border-gray-200", children: "请至少选择一个交易市场以配置阈值" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Tabs,
                        {
                          activeKey: activeMarketTab,
                          onChange: setActiveMarketTab,
                          className: "market-tabs",
                          tabBarStyle: { marginBottom: 0, padding: "0 16px", backgroundColor: "#fafafa", borderBottom: "1px solid #f0f0f0" },
                          items: [
                            ...selectedMarkets.includes("SH") ? [{
                              key: "SH",
                              label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1890ff] px-2", children: "上海证券交易所 (SH)" }),
                              children: renderScopes("continuous_false_declaration", "SH", renderContinuousFalseDeclarationThresholdContent)
                            }] : [],
                            ...selectedMarkets.includes("SZ") ? [{
                              key: "SZ",
                              label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1890ff] px-2", children: "深圳证券交易所 (SZ)" }),
                              children: renderScopes("continuous_false_declaration", "SZ", renderContinuousFalseDeclarationThresholdContent)
                            }] : []
                          ]
                        }
                      ) })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col items-center justify-center text-gray-400", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "64", height: "64", viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "mb-4 opacity-20", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 10.5V40C8 41.1046 8.89543 42 10 42H38C39.1046 42 40 41.1046 40 40V10.5M8 10.5L14.5 4H33.5L40 10.5M8 10.5H40", stroke: "#1890ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 22H29", stroke: "#1890ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 30H29", stroke: "#1890ff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg", children: "请在左侧规则树中点击具体的规则节点进行配置" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-2", children: "当前支持配置：拉抬打压、虚假申报等" })
                    ] }) })
                  ] })
                },
                "rule"
              )
            ]
          }
        )
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: "添加证券范围",
        open: isAddScopeModalVisible,
        onOk: handleAddScopeOk,
        onCancel: () => {
          setIsAddScopeModalVisible(false);
          setSelectedNewScopes([]);
        },
        okText: "确定",
        cancelText: "取消",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2", children: "选择动态维度组（证券组）：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              mode: "multiple",
              style: { width: "100%" },
              placeholder: "请选择证券范围",
              value: selectedNewScopes,
              onChange: setSelectedNewScopes,
              options: dynamicDimensionGroups
            }
          )
        ] })
      }
    )
  ] });
};
export {
  RuleCreate,
  RuleCreate as default
};
