import { f as useNavigate, n as useParams, r as reactExports, j as jsxRuntimeExports } from "./index-CUErrqgd.js";
import { B as Button } from "./button-DMDTHtWf.js";
import { R as RefIcon, C as Collapse } from "./ArrowLeftOutlined-Dpx_FtIN.js";
import { T as Typography } from "./index-D6bScF1D.js";
import { C as CompoundedSpace } from "./index-DMsHtZNk.js";
import { C as Card } from "./index-lZ1unLVs.js";
import { D as Descriptions } from "./index-DEBjrD9B.js";
import { T as Tag } from "./index-C_p_uySS.js";
import { T as Tabs } from "./index-nHZQBtRj.js";
import { T as Tree } from "./index-DNc7br9R.js";
import { S as Select, E as Empty } from "./index-D37x-ts6.js";
import { I as Input } from "./index-HqjRjDrR.js";
import { F as ForwardTable } from "./Table-DpJrvGn6.js";
import { M as Modal } from "./index-BO0cQK6u.js";
import { s as staticMethods } from "./index-CCOmhxaD.js";
import { R as RefIcon$1 } from "./AppstoreFilled-BD0mB3dm.js";
import { R as RefIcon$2 } from "./IdcardOutlined-DnFxe23V.js";
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
import "./EllipsisOutlined-BuwqaHFz.js";
import "./Overflow-DO7wolsL.js";
import "./PlusOutlined-DF-GsZDp.js";
import "./PurePanel-GUILNfpz.js";
import "./index-BC0QXd6g.js";
import "./index-DpyJnIWD.js";
import "./ExclamationCircleFilled-CXyczA-G.js";
import "./InfoCircleFilled-6TjWreYB.js";
import "./context-C5GnONAC.js";
import "./context-CN2GVsG0.js";
const { Title } = Typography;
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
const ruleData = {
  SH: {
    riskWarning: { volume_t1: 10, volume_t2: 20, volume_t3: 30, amount_t1: 100, amount_t2: 200, amount_t3: 300, ratio_t1: 5, ratio_t2: 10, ratio_t3: 15, price_t1: 2, price_t2: 4, price_t3: 6 },
    sz50: { volume_t1: 15, volume_t2: 25, volume_t3: 35, amount_t1: 150, amount_t2: 250, amount_t3: 350, ratio_t1: 6, ratio_t2: 12, ratio_t3: 18, price_t1: 3, price_t2: 5, price_t3: 7 },
    other: { volume_t1: 20, volume_t2: 30, volume_t3: 40, amount_t1: 200, amount_t2: 300, amount_t3: 400, ratio_t1: 7, ratio_t2: 14, ratio_t3: 21, price_t1: 4, price_t2: 6, price_t3: 8 }
  },
  SZ: {
    riskWarning: { volume_t1: 10, volume_t2: 20, volume_t3: 30, amount_t1: 100, amount_t2: 200, amount_t3: 300, ratio_t1: 5, ratio_t2: 10, ratio_t3: 15, price_t1: 2, price_t2: 4, price_t3: 6 },
    other: { volume_t1: 20, volume_t2: 30, volume_t3: 40, amount_t1: 200, amount_t2: 300, amount_t3: 400, ratio_t1: 7, ratio_t2: 14, ratio_t3: 21, price_t1: 4, price_t2: 6, price_t3: 8 }
  },
  false_declaration_thresholds: {
    SH: {
      riskWarning: {
        price_deviation_t1: 5,
        price_deviation_t2: 10,
        price_deviation_t3: 15,
        declare_volume_t1: 10,
        declare_volume_t2: 20,
        declare_volume_t3: 30,
        declare_amount_t1: 100,
        declare_amount_t2: 200,
        declare_amount_t3: 300,
        market_declare_ratio_t1: 10,
        market_declare_ratio_t2: 20,
        market_declare_ratio_t3: 30,
        cancel_ratio_t1: 50,
        cancel_ratio_t2: 60,
        cancel_ratio_t3: 70,
        reverse_declare_count_t1: 3,
        reverse_declare_count_t2: 5,
        reverse_declare_count_t3: 10
      },
      other: {
        price_deviation_t1: 5,
        price_deviation_t2: 10,
        price_deviation_t3: 15,
        declare_volume_t1: 20,
        declare_volume_t2: 30,
        declare_volume_t3: 40,
        declare_amount_t1: 200,
        declare_amount_t2: 300,
        declare_amount_t3: 400,
        market_declare_ratio_t1: 15,
        market_declare_ratio_t2: 25,
        market_declare_ratio_t3: 35,
        cancel_ratio_t1: 60,
        cancel_ratio_t2: 70,
        cancel_ratio_t3: 80,
        reverse_declare_count_t1: 4,
        reverse_declare_count_t2: 6,
        reverse_declare_count_t3: 12
      }
    },
    SZ: {
      riskWarning: {
        price_deviation_t1: 5,
        price_deviation_t2: 10,
        price_deviation_t3: 15,
        declare_volume_t1: 10,
        declare_volume_t2: 20,
        declare_volume_t3: 30,
        declare_amount_t1: 100,
        declare_amount_t2: 200,
        declare_amount_t3: 300,
        market_declare_ratio_t1: 10,
        market_declare_ratio_t2: 20,
        market_declare_ratio_t3: 30,
        cancel_ratio_t1: 50,
        cancel_ratio_t2: 60,
        cancel_ratio_t3: 70,
        reverse_declare_count_t1: 3,
        reverse_declare_count_t2: 5,
        reverse_declare_count_t3: 10
      },
      other: {
        price_deviation_t1: 5,
        price_deviation_t2: 10,
        price_deviation_t3: 15,
        declare_volume_t1: 20,
        declare_volume_t2: 30,
        declare_volume_t3: 40,
        declare_amount_t1: 200,
        declare_amount_t2: 300,
        declare_amount_t3: 400,
        market_declare_ratio_t1: 15,
        market_declare_ratio_t2: 25,
        market_declare_ratio_t3: 35,
        cancel_ratio_t1: 60,
        cancel_ratio_t2: 70,
        cancel_ratio_t3: 80,
        reverse_declare_count_t1: 4,
        reverse_declare_count_t2: 6,
        reverse_declare_count_t3: 12
      }
    }
  },
  continuous_false_declaration_thresholds: {
    SH: {
      riskWarning: {
        volume_t1: 10,
        volume_t2: 20,
        volume_t3: 30,
        amount_t1: 100,
        amount_t2: 200,
        amount_t3: 300,
        ratio_t1: 10,
        ratio_t2: 20,
        ratio_t3: 30,
        count_t1: 3,
        count_t2: 5,
        count_t3: 10,
        cancel_ratio_t1: 50,
        cancel_ratio_t2: 60,
        cancel_ratio_t3: 70,
        reverse_trade_count_t1: 3,
        reverse_trade_count_t2: 5,
        reverse_trade_count_t3: 10
      },
      other: {
        volume_t1: 20,
        volume_t2: 30,
        volume_t3: 40,
        amount_t1: 200,
        amount_t2: 300,
        amount_t3: 400,
        ratio_t1: 15,
        ratio_t2: 25,
        ratio_t3: 35,
        count_t1: 4,
        count_t2: 6,
        count_t3: 12,
        cancel_ratio_t1: 60,
        cancel_ratio_t2: 70,
        cancel_ratio_t3: 80,
        reverse_trade_count_t1: 4,
        reverse_trade_count_t2: 6,
        reverse_trade_count_t3: 12
      }
    },
    SZ: {
      riskWarning: {
        volume_t1: 10,
        volume_t2: 20,
        volume_t3: 30,
        amount_t1: 100,
        amount_t2: 200,
        amount_t3: 300,
        ratio_t1: 10,
        ratio_t2: 20,
        ratio_t3: 30,
        count_t1: 3,
        count_t2: 5,
        count_t3: 10,
        cancel_ratio_t1: 50,
        cancel_ratio_t2: 60,
        cancel_ratio_t3: 70,
        reverse_trade_count_t1: 3,
        reverse_trade_count_t2: 5,
        reverse_trade_count_t3: 10
      },
      other: {
        volume_t1: 20,
        volume_t2: 30,
        volume_t3: 40,
        amount_t1: 200,
        amount_t2: 300,
        amount_t3: 400,
        ratio_t1: 15,
        ratio_t2: 25,
        ratio_t3: 35,
        count_t1: 4,
        count_t2: 6,
        count_t3: 12,
        cancel_ratio_t1: 60,
        cancel_ratio_t2: 70,
        cancel_ratio_t3: 80,
        reverse_trade_count_t1: 4,
        reverse_trade_count_t2: 6,
        reverse_trade_count_t3: 12
      }
    }
  }
};
const getFieldOptions = () => {
  return [
    { value: "system", label: "交易系统" },
    { value: "shareholderAccount", label: "股东账户" },
    { value: "productAccount", label: "产品账户" },
    { value: "assetAccount", label: "资产账户" },
    { value: "portfolioAccount", label: "组合账户" }
  ];
};
const getEnumOptions = (field, selectedSystems) => {
  if (field === "system") return [
    { value: "O32", label: "O32" },
    { value: "O45", label: "O45" },
    { value: "机构O32", label: "机构O32" },
    { value: "集中柜台", label: "集中柜台" },
    { value: "根网", label: "根网" },
    { value: "GTP", label: "GTP" }
  ];
  const allOption = { value: "ALL", label: "全部" };
  const options = [allOption];
  const systemsToUse = selectedSystems.length > 0 ? selectedSystems : ["ALL"];
  systemsToUse.forEach((sys) => {
    const prefix = sys === "ALL" ? "ALL_" : `${sys}_`;
    const labelPrefix = sys === "ALL" ? "通用 " : `${sys} `;
    switch (field) {
      case "productAccount":
        options.push(
          { value: `${prefix}PA001`, label: `${labelPrefix}产品账户A` },
          { value: `${prefix}PA002`, label: `${labelPrefix}产品账户B` },
          { value: `${prefix}PA003`, label: `${labelPrefix}产品账户C` }
        );
        break;
      case "assetAccount":
        options.push(
          { value: `${prefix}AA001`, label: `${labelPrefix}资产账户X` },
          { value: `${prefix}AA002`, label: `${labelPrefix}资产账户Y` },
          { value: `${prefix}AA003`, label: `${labelPrefix}资产账户Z` }
        );
        break;
      case "shareholderAccount":
        options.push(
          { value: `${prefix}SA001`, label: `${labelPrefix}股东账户1` },
          { value: `${prefix}SA002`, label: `${labelPrefix}股东账户2` },
          { value: `${prefix}SA003`, label: `${labelPrefix}股东账户3` }
        );
        break;
      case "portfolioAccount":
        options.push(
          { value: `${prefix}POA001`, label: `${labelPrefix}组合账户1` },
          { value: `${prefix}POA002`, label: `${labelPrefix}组合账户2` },
          { value: `${prefix}POA003`, label: `${labelPrefix}组合账户3` }
        );
        break;
    }
  });
  return options;
};
const getSelectedSystems = (group) => {
  let systems = /* @__PURE__ */ new Set();
  if (!group || !group.children) return systems;
  group.children.forEach((child) => {
    if (child.type === "rule") {
      if (child.field === "system" && child.values) {
        child.values.forEach((v) => systems.add(v));
      }
    } else {
      const childSystems = getSelectedSystems(child);
      childSystems.forEach((v) => systems.add(v));
    }
  });
  return systems;
};
const renderSystemCards = (group, viewSelectedSystems) => {
  if (!group || !group.children || group.children.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { description: "暂无筛选条件", image: Empty.PRESENTED_IMAGE_SIMPLE });
  }
  const systems = /* @__PURE__ */ new Set();
  const rules = [];
  const traverse = (node) => {
    if (node.type === "rule") {
      if (node.field === "system") {
        if (node.values) {
          node.values.forEach((v) => systems.add(v));
        }
      } else {
        rules.push(node);
      }
    } else {
      if (node.children) {
        node.children.forEach(traverse);
      }
    }
  };
  traverse(group);
  const systemList = Array.from(systems);
  if (systemList.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { description: "未选择任何交易系统", image: Empty.PRESENTED_IMAGE_SIMPLE }) });
  }
  const result = {};
  systemList.forEach((sys) => {
    result[sys] = [];
  });
  rules.forEach((rule) => {
    if (!rule.values || rule.values.length === 0) return;
    const sysValues = {};
    rule.values.forEach((v) => {
      const parts = v.split("_");
      const sys = parts[0];
      if (sys === "ALL") {
        systemList.forEach((s) => {
          if (!sysValues[s]) sysValues[s] = [];
          sysValues[s].push(v);
        });
      } else {
        if (!sysValues[sys]) sysValues[sys] = [];
        sysValues[sys].push(v);
      }
    });
    Object.keys(sysValues).forEach((sys) => {
      if (systems.has(sys)) {
        result[sys].push({
          ...rule,
          values: sysValues[sys]
        });
      }
    });
  });
  const currentFieldOptions = getFieldOptions();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5", children: systemList.map((sys) => {
    const sysRules = result[sys] || [];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-white px-5 py-4 border-b border-blue-100 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { className: "text-blue-600 text-lg" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-blue-900 text-lg truncate", title: sys, children: sys })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 flex-1 flex flex-col gap-4 bg-white", children: sysRules.length > 0 ? sysRules.map((rule, idx) => {
        var _a;
        const fieldLabel = ((_a = currentFieldOptions.find((o) => o.value === rule.field)) == null ? void 0 : _a.label) || rule.field;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { className: "text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700 font-medium text-sm", children: fieldLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: rule.operator === "in" ? "blue" : "red", className: "m-0 border-none px-2 py-0.5 leading-tight text-xs font-medium", children: rule.operator === "in" ? "包含" : "不包含" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 pl-6", children: rule.values.map((v) => {
            var _a2;
            const options = getEnumOptions(rule.field, viewSelectedSystems);
            const label = ((_a2 = options.find((o) => o.value === v)) == null ? void 0 : _a2.label) || v;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "m-0 bg-gray-50 border-gray-200 text-gray-600 text-xs px-2 py-1", children: label }, v);
          }) })
        ] }, idx);
      }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full py-6 text-gray-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { className: "text-xl opacity-50" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "包含该系统所有账户" })
      ] }) })
    ] }, sys);
  }) });
};
const RuleView = () => {
  var _a;
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = reactExports.useState(true);
  const [selectedKeys, setSelectedKeys] = reactExports.useState(["continuous_bidding"]);
  const [activeMarketTab, setActiveMarketTab] = reactExports.useState("SH");
  const allGroups = [
    { id: "191", name: "33333", accountType: "证券账户", controlType: "联合控制", groupType: "static" },
    {
      id: "192",
      name: "自营A股账户组",
      accountType: "证券账户",
      controlType: "单独控制",
      groupType: "dynamic",
      filterConditions: {
        conditionTree: {
          id: "root",
          type: "group",
          logicalOperator: "AND",
          children: [
            { id: "r1", type: "rule", field: "system", operator: "in", values: ["O32", "O45", "集中柜台"] },
            {
              id: "g1",
              type: "group",
              logicalOperator: "OR",
              children: [
                { id: "r2", type: "rule", field: "productAccount", operator: "in", values: ["O32_PA001", "O45_PA002"] },
                { id: "r3", type: "rule", field: "assetAccount", operator: "not_in", values: ["O32_AA002"] }
              ]
            }
          ]
        }
      }
    },
    { id: "193", name: "量化高频账户组", accountType: "投资组合", controlType: "联合控制", groupType: "static" },
    {
      id: "194",
      name: "做市商账户组",
      accountType: "证券账户",
      controlType: "单独控制",
      groupType: "dynamic",
      filterConditions: {
        conditionTree: {
          id: "root",
          type: "group",
          logicalOperator: "AND",
          children: [
            { id: "r1", type: "rule", field: "system", operator: "in", values: ["O45", "集中柜台"] },
            { id: "r2", type: "rule", field: "shareholderAccount", operator: "in", values: ["ALL_SA001"] }
          ]
        }
      }
    },
    { id: "195", name: "QFII测试账户组", accountType: "投资组合", controlType: "联合控制", groupType: "static" }
  ];
  const [boundGroups, setBoundGroups] = reactExports.useState([
    allGroups[0],
    allGroups[1]
  ]);
  const [selectedRowKeys, setSelectedRowKeys] = reactExports.useState([]);
  const [isModalVisible, setIsModalVisible] = reactExports.useState(false);
  const [selectedNewGroups, setSelectedNewGroups] = reactExports.useState([]);
  const [detailModalVisible, setDetailModalVisible] = reactExports.useState(false);
  const [currentDetailGroup, setCurrentDetailGroup] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id]);
  const handleBack = () => {
    navigate("/rule-settings");
  };
  const handleUnbindBatch = () => {
    if (selectedRowKeys.length === 0) {
      staticMethods.warning("请先选择要解除绑定的账户组");
      return;
    }
    setBoundGroups((prev) => prev.filter((g) => !selectedRowKeys.includes(g.id)));
    setSelectedRowKeys([]);
    staticMethods.success("批量解除绑定成功");
  };
  const handleBind = () => {
    if (selectedNewGroups.length === 0) {
      staticMethods.warning("请选择要绑定的账户组");
      return;
    }
    const newGroups = selectedNewGroups.map((gid) => {
      const group = allGroups.find((g) => g.id === gid);
      return {
        id: group.id,
        name: group.name,
        accountType: group.accountType,
        controlType: group.controlType,
        groupType: group.groupType,
        filterConditions: group.filterConditions
      };
    });
    setBoundGroups((prev) => [...prev, ...newGroups]);
    setIsModalVisible(false);
    setSelectedNewGroups([]);
    staticMethods.success("绑定成功");
  };
  const handleViewDetail = (record) => {
    if (record.groupType === "dynamic") {
      setCurrentDetailGroup(record);
      setDetailModalVisible(true);
    } else {
      staticMethods.info("静态账户组，暂无动态筛选条件");
    }
  };
  const columns = [
    { title: "账户组ID", dataIndex: "id", key: "id", align: "center" },
    { title: "账户组名称", dataIndex: "name", key: "name", align: "center" },
    {
      title: "更新模式",
      dataIndex: "groupType",
      key: "groupType",
      align: "center",
      render: (text) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: text === "static" ? "blue" : "green", className: "m-0", children: text === "static" ? "静态账户组" : "动态账户组" })
    },
    {
      title: "账户类型",
      dataIndex: "accountType",
      key: "accountType",
      align: "center",
      render: (text) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-3 py-1 rounded text-[#1890ff] bg-[#e6f7ff] border border-[#91d5ff] text-sm", children: text })
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      render: (_, record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { size: "middle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", onClick: () => handleViewDetail(record), children: "查看明细" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", children: "编辑账户组" })
      ] })
    }
  ];
  const availableGroups = allGroups.filter((g) => !boundGroups.some((bg) => bg.id === g.id));
  const renderThresholdContent = (market, scope) => {
    var _a2;
    const data = (_a2 = ruleData[market]) == null ? void 0 : _a2[scope];
    if (!data) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(一) 连续竞价阶段任意3分钟内，成交数量在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.volume_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.volume_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.volume_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "万股 以上或成交金额在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.amount_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.amount_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.amount_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "万元 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(二) 成交数量占成交期间市场成交总量的比例在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.ratio_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.ratio_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.ratio_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(三) 价格涨（跌）幅" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.price_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.price_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.price_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上" })
      ] })
    ] });
  };
  const renderFalseDeclarationThresholdContent = (market, scope) => {
    var _a2;
    const data = (_a2 = ruleData.false_declaration_thresholds[market]) == null ? void 0 : _a2[scope];
    if (!data) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(一) 以偏离前收盘价" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.price_deviation_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.price_deviation_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.price_deviation_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上的价格申报买入或卖出" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(二) 累计申报数量在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.declare_volume_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.declare_volume_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.declare_volume_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "万股 以上或申报金额在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.declare_amount_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.declare_amount_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.declare_amount_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "万元 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(三) 累计申报数量占市场同方向申报总量的比例在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.market_declare_ratio_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.market_declare_ratio_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.market_declare_ratio_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(四) 累计撤销申报数量占累计申报数量的比例在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.cancel_ratio_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.cancel_ratio_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.cancel_ratio_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(五) 以低于申报买入价格反向申报卖出 或者 以高于申报卖出价格反向申报买入的次数在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.reverse_declare_count_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.reverse_declare_count_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.reverse_declare_count_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "次 以上" })
      ] })
    ] });
  };
  const renderContinuousFalseDeclarationThresholdContent = (market, scope) => {
    var _a2, _b;
    const data = (_b = (_a2 = ruleData.continuous_false_declaration_thresholds) == null ? void 0 : _a2[market]) == null ? void 0 : _b[scope];
    if (!data) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(一) 最优5档内申报买入或卖出" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(二) 单笔申报后，实时最优5档内累计剩余有效申报数量在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.volume_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.volume_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.volume_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "万股 以上或者金额在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.amount_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.amount_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.amount_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "万元 以上，且占市场同方向最优5档剩余有效申报总量的比例在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.ratio_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.ratio_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.ratio_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(三) 满足上述情形的申报发生" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.count_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.count_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.count_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "次 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(四) 累计撤销申报数量占累计申报数量的比例在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.cancel_ratio_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.cancel_ratio_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.cancel_ratio_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "% 以上" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-700 flex-wrap leading-loose", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(五) 存在反向卖出（买入）的成交次数 在" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace.Compact, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium", children: data.reverse_trade_count_t1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium", children: data.reverse_trade_count_t2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium", children: data.reverse_trade_count_t3 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "次 以上" })
      ] })
    ] });
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center bg-gray-50 text-gray-500", children: "加载中..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col absolute inset-0 bg-gray-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
  .view-tabs-container .ant-tabs-content-holder {
    flex: 1;
    overflow: hidden;
  }
  .view-tabs-container .ant-tabs-content {
    height: 100%;
  }
  .view-tabs-container .ant-tabs-tabpane {
    height: 100%;
    outline: none;
  }
` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 shadow-sm z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "text", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}), onClick: handleBack, className: "text-gray-500 hover:text-[#1890ff]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: { margin: 0, color: "#333" }, children: "查看指标组详情" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleBack, children: "返回" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none", onClick: () => navigate(`/rule-edit/${id}`), children: "编辑指标" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-6 flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2", children: "基本信息" }), bordered: false, className: "shadow-sm rounded-lg shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { column: { xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "指标组编号", children: "50036" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "指标组名称", children: "UST-A-TYFXRZGB" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "启用状态", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "success", children: "已启用" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "创建人", children: "018566" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "创建时间", children: "2026-01-26 17:32:01" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "备注说明", span: 2, children: "这是一个用于监控异常交易行为的指标组模板。" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { bodyStyle: { padding: 0, display: "flex", flexDirection: "column", height: "100%" }, className: "shadow-sm rounded-lg flex-1 overflow-hidden min-h-[600px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Tabs,
        {
          defaultActiveKey: "account",
          className: "px-6 pt-4 flex-1 flex flex-col view-tabs-container",
          items: [
            {
              key: "rule",
              label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-medium px-2", children: "规则配置详情" }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full -mx-6 border-t border-gray-100", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[320px] border-r border-gray-200 p-4 overflow-y-auto bg-gray-50/50 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Tree,
                  {
                    showLine: true,
                    defaultExpandAll: true,
                    selectedKeys,
                    onSelect: (keys) => setSelectedKeys(keys),
                    treeData,
                    className: "bg-transparent custom-tree"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-6 overflow-y-auto bg-white", children: selectedKeys.includes("continuous_bidding") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-gray-100", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-4 bg-[#1890ff] rounded" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-gray-800", children: "连续竞价阶段拉抬打压控制 - 参数配置" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tabs,
                    {
                      activeKey: activeMarketTab,
                      onChange: setActiveMarketTab,
                      className: "market-tabs",
                      tabBarStyle: { marginBottom: 0, padding: "0 16px", backgroundColor: "#fafafa", borderBottom: "1px solid #f0f0f0" },
                      items: [
                        {
                          key: "SH",
                          label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1890ff] px-2", children: "上海证券交易所 (SH)" }),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Collapse, { defaultActiveKey: ["riskWarning", "sz50", "other"], className: "bg-white border border-gray-200 rounded-lg", expandIconPosition: "end", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "风险警示股" }), className: "border-b border-gray-200", children: renderThresholdContent("SH", "riskWarning") }, "riskWarning"),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "上证50成分股" }), className: "border-b border-gray-200", children: renderThresholdContent("SH", "sz50") }, "sz50"),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "非上证50非风险警示股" }), className: "border-none", children: renderThresholdContent("SH", "other") }, "other")
                          ] }) })
                        },
                        {
                          key: "SZ",
                          label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1890ff] px-2", children: "深圳证券交易所 (SZ)" }),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Collapse, { defaultActiveKey: ["riskWarning", "other"], className: "bg-white border border-gray-200 rounded-lg", expandIconPosition: "end", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "风险警示股" }), className: "border-b border-gray-200", children: renderThresholdContent("SZ", "riskWarning") }, "riskWarning"),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "非风险警示股" }), className: "border-none", children: renderThresholdContent("SZ", "other") }, "other")
                          ] }) })
                        }
                      ]
                    }
                  ) })
                ] }) : selectedKeys.includes("open_call_auction_false_declaration") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-gray-100", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-4 bg-[#1890ff] rounded" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-gray-800", children: "开盘集合竞价阶段虚假申报 - 参数配置" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tabs,
                    {
                      activeKey: activeMarketTab,
                      onChange: setActiveMarketTab,
                      className: "market-tabs",
                      tabBarStyle: { marginBottom: 0, padding: "0 16px", backgroundColor: "#fafafa", borderBottom: "1px solid #f0f0f0" },
                      items: [
                        {
                          key: "SH",
                          label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1890ff] px-2", children: "上海证券交易所 (SH)" }),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Collapse, { defaultActiveKey: ["riskWarning", "other"], className: "bg-white border border-gray-200 rounded-lg", expandIconPosition: "end", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "风险警示股" }), className: "border-b border-gray-200", children: renderFalseDeclarationThresholdContent("SH", "riskWarning") }, "riskWarning"),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "非风险警示股" }), className: "border-none", children: renderFalseDeclarationThresholdContent("SH", "other") }, "other")
                          ] }) })
                        },
                        {
                          key: "SZ",
                          label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1890ff] px-2", children: "深圳证券交易所 (SZ)" }),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Collapse, { defaultActiveKey: ["riskWarning", "other"], className: "bg-white border border-gray-200 rounded-lg", expandIconPosition: "end", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "风险警示股" }), className: "border-b border-gray-200", children: renderFalseDeclarationThresholdContent("SZ", "riskWarning") }, "riskWarning"),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "非风险警示股" }), className: "border-none", children: renderFalseDeclarationThresholdContent("SZ", "other") }, "other")
                          ] }) })
                        }
                      ]
                    }
                  ) })
                ] }) : selectedKeys.includes("continuous_false_declaration") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-gray-100", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-4 bg-[#1890ff] rounded" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-gray-800", children: "连续竞价阶段虚假申报控制 - 参数配置" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tabs,
                    {
                      activeKey: activeMarketTab,
                      onChange: setActiveMarketTab,
                      className: "market-tabs",
                      tabBarStyle: { marginBottom: 0, padding: "0 16px", backgroundColor: "#fafafa", borderBottom: "1px solid #f0f0f0" },
                      items: [
                        {
                          key: "SH",
                          label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1890ff] px-2", children: "上海证券交易所 (SH)" }),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Collapse, { defaultActiveKey: ["riskWarning", "other"], className: "bg-white border border-gray-200 rounded-lg", expandIconPosition: "end", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "风险警示股" }), className: "border-b border-gray-200", children: renderContinuousFalseDeclarationThresholdContent("SH", "riskWarning") }, "riskWarning"),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "非风险警示股" }), className: "border-none", children: renderContinuousFalseDeclarationThresholdContent("SH", "other") }, "other")
                          ] }) })
                        },
                        {
                          key: "SZ",
                          label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1890ff] px-2", children: "深圳证券交易所 (SZ)" }),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Collapse, { defaultActiveKey: ["riskWarning", "other"], className: "bg-white border border-gray-200 rounded-lg", expandIconPosition: "end", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "风险警示股" }), className: "border-b border-gray-200", children: renderContinuousFalseDeclarationThresholdContent("SZ", "riskWarning") }, "riskWarning"),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { header: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: "非风险警示股" }), className: "border-none", children: renderContinuousFalseDeclarationThresholdContent("SZ", "other") }, "other")
                          ] }) })
                        }
                      ]
                    }
                  ) })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex flex-col items-center justify-center text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg", children: "请在左侧规则树中点击具体的规则节点查看配置" }) }) })
              ] })
            },
            {
              key: "account",
              label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-medium px-2", children: "关联账户组" }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-t border-gray-100 h-full overflow-y-auto bg-white", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { size: "large", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "账户组类型：" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { placeholder: "请选择账户类型", style: { width: 160 }, allowClear: true, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "证券账户", children: "证券账户" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "投资组合", children: "投资组合" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "账户组名称：" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "请输入账户组名称", style: { width: 200 }, allowClear: true })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none", onClick: () => setIsModalVisible(true), children: "关联账户组" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none", children: "修改控制类型" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none", onClick: handleUnbindBatch, children: "批量解除绑定" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ForwardTable,
                  {
                    rowSelection: {
                      selectedRowKeys,
                      onChange: setSelectedRowKeys
                    },
                    columns,
                    dataSource: boundGroups,
                    rowKey: "id",
                    pagination: false,
                    size: "middle",
                    className: "custom-table border border-gray-200 rounded-t-md"
                  }
                )
              ] })
            }
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: "新增绑定账户组",
        open: isModalVisible,
        onOk: handleBind,
        onCancel: () => {
          setIsModalVisible(false);
          setSelectedNewGroups([]);
        },
        okText: "确认绑定",
        cancelText: "取消",
        okButtonProps: { className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-gray-700", children: "请选择要绑定的账户组：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              mode: "multiple",
              style: { width: "100%" },
              placeholder: "请选择账户组",
              value: selectedNewGroups,
              onChange: setSelectedNewGroups,
              options: availableGroups.map((g) => ({ label: g.name, value: g.id })),
              optionFilterProp: "label"
            }
          ),
          availableGroups.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-xs mt-2", children: "所有可用账户组均已绑定。" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: `动态筛选条件 - ${currentDetailGroup == null ? void 0 : currentDetailGroup.name}`,
        open: detailModalVisible,
        onCancel: () => setDetailModalVisible(false),
        footer: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => setDetailModalVisible(false), className: "bg-[#1890ff] border-none", children: "关闭" }),
        width: 1e3,
        children: ((_a = currentDetailGroup == null ? void 0 : currentDetailGroup.filterConditions) == null ? void 0 : _a.conditionTree) ? (() => {
          const viewSelectedSystemsSet = getSelectedSystems(currentDetailGroup.filterConditions.conditionTree);
          const viewSelectedSystems = Array.from(viewSelectedSystemsSet);
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[60vh] overflow-y-auto pr-2 py-4 bg-gray-50/50 px-4 rounded-lg", children: renderSystemCards(currentDetailGroup.filterConditions.conditionTree, viewSelectedSystems) });
        })() : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { description: "暂无筛选条件", image: Empty.PRESENTED_IMAGE_SIMPLE }) })
      }
    )
  ] });
};
export {
  RuleView,
  RuleView as default
};
