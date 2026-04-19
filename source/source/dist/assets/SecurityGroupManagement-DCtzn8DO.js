import { r as reactExports, I as Icon, j as jsxRuntimeExports, m as dayjs, R as React } from "./index-CUErrqgd.js";
import { F as Form } from "./index-CYeT6-j6.js";
import { R as RefIcon$1 } from "./SafetyCertificateOutlined-C1BP17mi.js";
import { T as Typography } from "./index-D6bScF1D.js";
import { B as Button } from "./button-DMDTHtWf.js";
import { R as RefIcon$2, a as RefIcon$6 } from "./PlusOutlined-zS7VbAx6.js";
import { I as Input } from "./index-HqjRjDrR.js";
import { R as RefIcon$3 } from "./SearchOutlined-DjI6MF7U.js";
import { F as ForwardTable, R as Radio } from "./Table-DpJrvGn6.js";
import { M as Modal } from "./index-BO0cQK6u.js";
import { R as RefIcon$4 } from "./InfoCircleOutlined-DkqRirar.js";
import { A as Alert, R as RefIcon$7 } from "./PlusSquareOutlined-DFpj6It9.js";
import { E as Empty, S as Select } from "./index-D37x-ts6.js";
import { T as Tag } from "./index-C_p_uySS.js";
import { C as CompoundedSpace } from "./index-DMsHtZNk.js";
import { R as RefIcon$5 } from "./EditOutlined-D9EEcHWK.js";
import { s as staticMethods } from "./index-CCOmhxaD.js";
import { R as RefIcon$8 } from "./AppstoreFilled-BD0mB3dm.js";
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
import "./PlusOutlined-DF-GsZDp.js";
import "./pickAttrs-B6Vs2P5v.js";
import "./index-DNc7br9R.js";
import "./index-BC0QXd6g.js";
import "./RightOutlined-BAFHU4sg.js";
import "./EllipsisOutlined-BuwqaHFz.js";
import "./Overflow-DO7wolsL.js";
import "./PurePanel-GUILNfpz.js";
import "./useBreakpoint-CZwDkAga.js";
import "./index-DpyJnIWD.js";
import "./InfoCircleFilled-6TjWreYB.js";
import "./useClosable-BjqEnKhC.js";
import "./context-C5GnONAC.js";
import "./context-CN2GVsG0.js";
var TagsOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M483.2 790.3L861.4 412c1.7-1.7 2.5-4 2.3-6.3l-25.5-301.4c-.7-7.8-6.8-13.9-14.6-14.6L522.2 64.3c-2.3-.2-4.7.6-6.3 2.3L137.7 444.8a8.03 8.03 0 000 11.3l334.2 334.2c3.1 3.2 8.2 3.2 11.3 0zm62.6-651.7l224.6 19 19 224.6L477.5 694 233.9 450.5l311.9-311.9zm60.16 186.23a48 48 0 1067.88-67.89 48 48 0 10-67.88 67.89zM889.7 539.8l-39.6-39.5a8.03 8.03 0 00-11.3 0l-362 361.3-237.6-237a8.03 8.03 0 00-11.3 0l-39.6 39.5a8.03 8.03 0 000 11.3l243.2 242.8 39.6 39.5c3.1 3.1 8.2 3.1 11.3 0l407.3-406.6c3.1-3.1 3.1-8.2 0-11.3z" } }] }, "name": "tags", "theme": "outlined" };
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
const TagsOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: TagsOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(TagsOutlined);
const { Title } = Typography;
const { TextArea } = Input;
const generateId = () => Math.random().toString(36).substring(2, 9);
const initialData = [
  {
    id: "S001",
    name: "核心资产池",
    groupType: "static",
    description: "公司核心关注的蓝筹股",
    createTime: "2023-10-01 10:00:00",
    securityList: [
      { symbol: "600519", name: "贵州茅台", market: "上海证券交易所", type: "股票", validStartDate: "2023-01-01", validEndDate: "2099-12-31", creator: "018566", createTime: "2023-10-01 10:00:00", modifier: "018566", updateTime: "2023-10-01 10:00:00" },
      { symbol: "000858", name: "五粮液", market: "深圳证券交易所", type: "股票", validStartDate: "2023-01-01", validEndDate: "2099-12-31", creator: "018566", createTime: "2023-10-01 10:00:00", modifier: "018566", updateTime: "2023-10-01 10:00:00" }
    ]
  },
  {
    id: "S002",
    name: "科创板医药股",
    groupType: "dynamic",
    description: "科创板上市的医药生物企业",
    createTime: "2023-10-02 11:30:00",
    filterConditions: {
      conditionTree: {
        id: "root",
        type: "group",
        logicalOperator: "AND",
        children: [
          { id: "r1", type: "rule", field: "market", operator: "in", values: ["SH"] },
          { id: "r2", type: "rule", field: "sector", operator: "in", values: ["star"] },
          { id: "r3", type: "rule", field: "industry", operator: "in", values: ["medical"] }
        ]
      }
    }
  },
  {
    id: "S003",
    name: "风险警示股",
    groupType: "dynamic",
    description: "全市场风险警示股票",
    createTime: "2023-10-05 09:15:00",
    filterConditions: {
      conditionTree: {
        id: "root",
        type: "group",
        logicalOperator: "AND",
        children: [
          { id: "r1", type: "rule", field: "isRiskWarning", operator: "in", values: ["yes"] }
        ]
      }
    }
  }
];
const mockAllSecurities = [
  { symbol: "600519", name: "贵州茅台", market: "SH", type: "stock", industry: "consumer", sector: "main", isRiskWarning: "no" },
  { symbol: "000858", name: "五粮液", market: "SZ", type: "stock", industry: "consumer", sector: "main", isRiskWarning: "no" },
  { symbol: "688981", name: "中芯国际", market: "SH", type: "stock", industry: "tech", sector: "star", isRiskWarning: "no" },
  { symbol: "300750", name: "宁德时代", market: "SZ", type: "stock", industry: "tech", sector: "gem", isRiskWarning: "no" },
  { symbol: "600036", name: "招商银行", market: "SH", type: "stock", industry: "finance", sector: "main", isRiskWarning: "no" },
  { symbol: "000001", name: "平安银行", market: "SZ", type: "stock", industry: "finance", sector: "main", isRiskWarning: "no" },
  { symbol: "600276", name: "恒瑞医药", market: "SH", type: "stock", industry: "medical", sector: "main", isRiskWarning: "no" },
  { symbol: "300015", name: "爱尔眼科", market: "SZ", type: "stock", industry: "medical", sector: "gem", isRiskWarning: "no" },
  { symbol: "600000", name: "浦发银行", market: "SH", type: "stock", industry: "finance", sector: "main", isRiskWarning: "no" },
  { symbol: "000002", name: "万科A", market: "SZ", type: "stock", industry: "realestate", sector: "main", isRiskWarning: "no" },
  { symbol: "600123", name: "ST明诚", market: "SH", type: "stock", industry: "consumer", sector: "main", isRiskWarning: "yes" },
  { symbol: "000456", name: "ST国药", market: "SZ", type: "stock", industry: "medical", sector: "main", isRiskWarning: "yes" }
];
const evaluateRule = (item, rule) => {
  const itemValue = item[rule.field];
  if (!rule.values || rule.values.length === 0) return true;
  const isIn = rule.values.includes(itemValue);
  return rule.operator === "in" ? isIn : !isIn;
};
const evaluateGroup = (item, group) => {
  if (!group.children || group.children.length === 0) return true;
  if (group.logicalOperator === "AND") {
    return group.children.every((child) => {
      if (child.type === "rule") return evaluateRule(item, child);
      return evaluateGroup(item, child);
    });
  } else {
    return group.children.some((child) => {
      if (child.type === "rule") return evaluateRule(item, child);
      return evaluateGroup(item, child);
    });
  }
};
const getFieldOptions = () => {
  return [
    { value: "market", label: "交易市场" },
    { value: "securityType", label: "证券类别" },
    { value: "industry", label: "所属行业" },
    { value: "sector", label: "所属板块" },
    { value: "isRiskWarning", label: "是否风险警示" }
  ];
};
const getEnumOptions = (field) => {
  switch (field) {
    case "market":
      return [
        { value: "SH", label: "上海证券交易所" },
        { value: "SZ", label: "深圳证券交易所" },
        { value: "BJ", label: "北京证券交易所" }
      ];
    case "securityType":
      return [
        { value: "stock", label: "股票" },
        { value: "bond", label: "债券" },
        { value: "fund", label: "基金" }
      ];
    case "industry":
      return [
        { value: "finance", label: "金融" },
        { value: "realestate", label: "房地产" },
        { value: "medical", label: "医药" },
        { value: "tech", label: "科技" },
        { value: "consumer", label: "消费" }
      ];
    case "sector":
      return [
        { value: "main", label: "主板" },
        { value: "gem", label: "创业板" },
        { value: "star", label: "科创板" }
      ];
    case "isRiskWarning":
      return [
        { value: "yes", label: "是" },
        { value: "no", label: "否" }
      ];
    default:
      return [];
  }
};
const operatorOptions = [
  { value: "in", label: "包含" },
  { value: "not_in", label: "不包含" }
];
const RuleNode = ({ rule, onChange, onRemove }) => {
  const currentFieldOptions = getFieldOptions();
  const currentEnumOptions = getEnumOptions(rule.field);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 bg-white p-3 rounded border border-gray-200 hover:border-blue-300 transition-colors shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Select,
      {
        value: rule.field,
        onChange: (val) => onChange({ ...rule, field: val, values: [] }),
        options: currentFieldOptions,
        style: { width: 140 }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Select,
      {
        value: rule.operator,
        onChange: (val) => onChange({ ...rule, operator: val }),
        options: operatorOptions,
        style: { width: 100 }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Select,
      {
        mode: "multiple",
        value: rule.values,
        onChange: (val) => onChange({ ...rule, values: val }),
        options: currentEnumOptions,
        placeholder: "请选择",
        style: { flex: 1 },
        maxTagCount: "responsive"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "text", danger: true, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {}), onClick: onRemove })
  ] });
};
const RuleGroupNode = ({ group, onChange, onRemove, isRoot }) => {
  const handleAddRule = () => {
    onChange({
      ...group,
      children: [
        ...group.children,
        { id: generateId(), type: "rule", field: "market", operator: "in", values: [] }
      ]
    });
  };
  const handleAddGroup = () => {
    onChange({
      ...group,
      children: [
        ...group.children,
        { id: generateId(), type: "group", logicalOperator: "AND", children: [{ id: generateId(), type: "rule", field: "market", operator: "in", values: [] }] }
      ]
    });
  };
  const handleChildChange = (index, newChild) => {
    const newChildren = [...group.children];
    newChildren[index] = newChild;
    onChange({ ...group, children: newChildren });
  };
  const handleChildRemove = (index) => {
    const newChildren = [...group.children];
    newChildren.splice(index, 1);
    onChange({ ...group, children: newChildren });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-4 rounded-lg border ${isRoot ? "border-transparent bg-transparent p-0" : "border-blue-300 bg-blue-50/40 shadow-sm mt-2 relative"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", type: "dashed", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}), onClick: handleAddRule, children: "添加条件" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", type: "dashed", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$7, {}), onClick: handleAddGroup, children: "添加条件组" })
      ] }),
      !isRoot && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", type: "text", danger: true, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {}), onClick: onRemove, children: "删除组" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col ${isRoot ? "pl-4 border-l-2 border-blue-200 ml-2" : ""}`, children: [
      group.children.map((child, index) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
          index > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center my-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute w-full h-px bg-blue-200" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 bg-white px-2 ml-8 rounded border border-blue-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Radio.Group,
              {
                value: group.logicalOperator,
                onChange: (e) => onChange({ ...group, logicalOperator: e.target.value }),
                size: "small",
                buttonStyle: "solid",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio.Button, { value: "AND", children: "且" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio.Button, { value: "OR", children: "或" })
                ]
              }
            ) })
          ] }),
          child.type === "rule" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            RuleNode,
            {
              rule: child,
              onChange: (newRule) => handleChildChange(index, newRule),
              onRemove: () => handleChildRemove(index)
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            RuleGroupNode,
            {
              group: child,
              onChange: (newGroup) => handleChildChange(index, newGroup),
              onRemove: () => handleChildRemove(index),
              isRoot: false
            }
          )
        ] }, child.id);
      }),
      group.children.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-sm py-2", children: "暂无条件，请点击上方按钮添加" })
    ] })
  ] });
};
const SecurityGroupManagement = () => {
  const [data, setData] = reactExports.useState(initialData);
  const [selectedGroup, setSelectedGroup] = reactExports.useState(null);
  const [isModalVisible, setIsModalVisible] = reactExports.useState(false);
  const [editingRecord, setEditingRecord] = reactExports.useState(null);
  const [form] = Form.useForm();
  const [formGroupType, setFormGroupType] = reactExports.useState("static");
  const [searchName, setSearchName] = reactExports.useState("");
  const [isDynamicFilterModalVisible, setIsDynamicFilterModalVisible] = reactExports.useState(false);
  const [conditionTree, setConditionTree] = reactExports.useState({
    id: "root",
    type: "group",
    logicalOperator: "AND",
    children: []
  });
  const [isPreviewVisible, setIsPreviewVisible] = reactExports.useState(false);
  const [previewData, setPreviewData] = reactExports.useState([]);
  const [isViewPreviewModalVisible, setIsViewPreviewModalVisible] = reactExports.useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = reactExports.useState(false);
  const [groupToDelete, setGroupToDelete] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (data.length > 0 && !selectedGroup) {
      setSelectedGroup(data[0]);
    }
  }, [data, selectedGroup]);
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setFormGroupType("static");
    form.setFieldsValue({ groupType: "static" });
    setIsModalVisible(true);
  };
  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormGroupType(record.groupType);
    form.setFieldsValue({
      ...record
    });
    setIsModalVisible(true);
  };
  const confirmDelete = () => {
    if (groupToDelete) {
      setData((prev) => prev.filter((item) => item.id !== groupToDelete.id));
      if ((selectedGroup == null ? void 0 : selectedGroup.id) === groupToDelete.id) {
        setSelectedGroup(null);
      }
      staticMethods.success("删除成功");
      setIsDeleteModalVisible(false);
      setGroupToDelete(null);
    }
  };
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let newSecurityList = (editingRecord == null ? void 0 : editingRecord.securityList) || [];
      let newFilterConditions = void 0;
      if (values.groupType === "dynamic") {
        newFilterConditions = {
          conditionTree: {
            id: "root",
            type: "group",
            logicalOperator: "AND",
            children: [{ id: generateId(), type: "rule", field: "market", operator: "in", values: [] }]
          }
        };
      }
      const newRecordData = {
        name: values.name,
        groupType: values.groupType,
        description: values.description,
        securityList: newSecurityList,
        filterConditions: newFilterConditions
      };
      if (editingRecord) {
        const updatedRecord = { ...editingRecord, ...newRecordData };
        if (values.groupType === "dynamic" && editingRecord.groupType === "dynamic") {
          updatedRecord.filterConditions = editingRecord.filterConditions;
        }
        setData((prev) => prev.map((item) => item.id === editingRecord.id ? updatedRecord : item));
        if ((selectedGroup == null ? void 0 : selectedGroup.id) === editingRecord.id) {
          setSelectedGroup(updatedRecord);
        }
        staticMethods.success("修改成功");
      } else {
        const newRecord = {
          ...newRecordData,
          id: `S${Math.floor(Math.random() * 1e4).toString().padStart(3, "0")}`,
          createTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
        };
        setData((prev) => [newRecord, ...prev]);
        setSelectedGroup(newRecord);
        staticMethods.success("新增成功");
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };
  const handleEditDynamicFilter = () => {
    var _a;
    let initialTree = (_a = selectedGroup == null ? void 0 : selectedGroup.filterConditions) == null ? void 0 : _a.conditionTree;
    if (!initialTree) {
      initialTree = {
        id: "root",
        type: "group",
        logicalOperator: "AND",
        children: [{ id: generateId(), type: "rule", field: "market", operator: "in", values: [] }]
      };
    }
    setConditionTree(initialTree);
    setIsPreviewVisible(false);
    setIsDynamicFilterModalVisible(true);
  };
  const handleDynamicFilterModalOk = () => {
    if (selectedGroup) {
      const updatedGroup = {
        ...selectedGroup,
        filterConditions: {
          conditionTree
        }
      };
      setData((prev) => prev.map((item) => item.id === updatedGroup.id ? updatedGroup : item));
      setSelectedGroup(updatedGroup);
      setIsDynamicFilterModalVisible(false);
      staticMethods.success("筛选条件更新成功");
    }
  };
  const handleViewPreview = (tree) => {
    const filtered = mockAllSecurities.filter((item) => evaluateGroup(item, tree));
    setPreviewData(filtered);
    setIsViewPreviewModalVisible(true);
  };
  const filteredData = data.filter((item) => {
    return item.name.toLowerCase().includes(searchName.toLowerCase());
  });
  const leftColumns = [
    {
      title: "证券组名称",
      dataIndex: "name",
      render: (text, record) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", title: text, children: text }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: record.groupType === "static" ? "blue" : "green", className: "ml-2 shrink-0 m-0", children: record.groupType === "static" ? "静态" : "动态" })
      ] })
    }
  ];
  const securityColumns = [
    { title: "证券代码", dataIndex: "symbol", width: 100 },
    { title: "证券名称", dataIndex: "name", width: 100 },
    { title: "交易市场", dataIndex: "market", width: 120 },
    { title: "有效开始日期", dataIndex: "validStartDate", width: 120 },
    { title: "有效截止日期", dataIndex: "validEndDate", width: 120 },
    { title: "添加人", dataIndex: "creator", width: 80 },
    { title: "添加时间", dataIndex: "createTime", width: 160 },
    { title: "修改人", dataIndex: "modifier", width: 80 },
    { title: "修改时间", dataIndex: "updateTime", width: 160 },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { size: "small", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", children: "编辑" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-[#1890ff] hover:text-[#096dd9]", children: "移除" })
      ] })
    }
  ];
  const renderMarketCards = (group) => {
    if (!group || !group.children || group.children.length === 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { description: "暂无筛选条件", image: Empty.PRESENTED_IMAGE_SIMPLE });
    }
    const markets = /* @__PURE__ */ new Set();
    const rules = [];
    const traverse = (node) => {
      if (node.type === "rule") {
        if (node.field === "market") {
          if (node.values) {
            node.values.forEach((v) => markets.add(v));
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
    const marketList = Array.from(markets);
    const marketOptions = getEnumOptions("market");
    if (marketList.length === 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-white px-5 py-4 border-b border-blue-100 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$8, { className: "text-blue-600 text-lg" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-blue-900 text-lg", children: "全部市场" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 flex-1 flex flex-col gap-4 bg-white", children: rules.length > 0 ? rules.map((rule, idx) => {
          var _a;
          const fieldLabel = ((_a = getFieldOptions().find((o) => o.value === rule.field)) == null ? void 0 : _a.label) || rule.field;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { className: "text-gray-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700 font-medium text-sm", children: fieldLabel }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: rule.operator === "in" ? "blue" : "red", className: "m-0 border-none px-2 py-0.5 leading-tight text-xs font-medium", children: rule.operator === "in" ? "包含" : "不包含" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 pl-6", children: rule.values.map((v) => {
              var _a2;
              const options = getEnumOptions(rule.field);
              const label = ((_a2 = options.find((o) => o.value === v)) == null ? void 0 : _a2.label) || v;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "m-0 bg-gray-50 border-gray-200 text-gray-600 text-xs px-2 py-1", children: label }, v);
            }) })
          ] }, idx);
        }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center h-full py-6 text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "包含所有证券" }) }) })
      ] }) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5", children: marketList.map((mkt) => {
      var _a;
      const marketLabel = ((_a = marketOptions.find((o) => o.value === mkt)) == null ? void 0 : _a.label) || mkt;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-white px-5 py-4 border-b border-blue-100 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$8, { className: "text-blue-600 text-lg" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-blue-900 text-lg truncate", title: marketLabel, children: marketLabel })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 flex-1 flex flex-col gap-4 bg-white", children: rules.length > 0 ? rules.map((rule, idx) => {
          var _a2;
          const fieldLabel = ((_a2 = getFieldOptions().find((o) => o.value === rule.field)) == null ? void 0 : _a2.label) || rule.field;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { className: "text-gray-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700 font-medium text-sm", children: fieldLabel }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: rule.operator === "in" ? "blue" : "red", className: "m-0 border-none px-2 py-0.5 leading-tight text-xs font-medium", children: rule.operator === "in" ? "包含" : "不包含" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 pl-6", children: rule.values.map((v) => {
              var _a3;
              const options = getEnumOptions(rule.field);
              const label = ((_a3 = options.find((o) => o.value === v)) == null ? void 0 : _a3.label) || v;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "m-0 bg-gray-50 border-gray-200 text-gray-600 text-xs px-2 py-1", children: label }, v);
            }) })
          ] }, idx);
        }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full py-6 text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { className: "text-xl opacity-50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "包含该市场所有证券" })
        ] }) })
      ] }, mkt);
    }) });
  };
  const renderDetails = () => {
    var _a;
    if (!selectedGroup) return /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { description: "请在左侧选择证券组", className: "mt-32" });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] text-lg flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-base text-gray-800", children: "基本信息" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}), onClick: () => handleEdit(selectedGroup), children: "编辑" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { danger: true, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {}), onClick: () => {
            setGroupToDelete(selectedGroup);
            setIsDeleteModalVisible(true);
          }, children: "删除" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 shrink-0 border-b border-gray-100 pb-8 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-y-6 gap-x-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 shrink-0 w-24 text-right", children: "证券组ID：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-800 truncate pl-2", children: selectedGroup.id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 shrink-0 w-24 text-right", children: "证券组名称：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-800 truncate pl-2", children: selectedGroup.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 shrink-0 w-24 text-right", children: "更新模式：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-800 truncate pl-2", children: selectedGroup.groupType === "static" ? "静态证券组" : "动态证券组" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 shrink-0 w-24 text-right", children: "创建人：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-800 truncate pl-2", children: "018566" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 shrink-0 w-24 text-right", children: "创建日期：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-800 truncate pl-2", children: selectedGroup.createTime })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 shrink-0 w-24 text-right", children: "描述：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-800 truncate pl-2", title: selectedGroup.description || "--", children: selectedGroup.description || "--" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col overflow-hidden", children: selectedGroup.groupType === "static" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] text-lg flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-base text-gray-800", children: "证券列表" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "bg-[#1890ff] text-white hover:!bg-[#096dd9] hover:!text-white border-none", children: "导出" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "bg-[#1890ff] text-white hover:!bg-[#096dd9] hover:!text-white border-none", children: "添加" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "批量移除" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "text-[#1890ff] border-[#1890ff] hover:!text-[#096dd9] hover:!border-[#096dd9]", children: "批量导入" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden border border-gray-200 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            size: "middle",
            rowSelection: { type: "checkbox" },
            columns: securityColumns,
            dataSource: selectedGroup.securityList || [],
            rowKey: "symbol",
            pagination: false,
            scroll: { x: "max-content", y: "calc(100vh - 420px)" },
            locale: {
              emptyText: /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE, description: "暂无数据" })
            },
            className: "custom-table"
          }
        ) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#1890ff] text-lg flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-base text-gray-800", children: "动态筛选条件" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handleViewPreview(selectedGroup.filterConditions.conditionTree), children: "预览证券列表" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "bg-[#1890ff] text-white hover:!bg-[#096dd9] hover:!text-white border-none", onClick: handleEditDynamicFilter, children: "编辑条件" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 rounded-lg border border-gray-200 flex-1 overflow-y-auto bg-gray-50/50", children: ((_a = selectedGroup.filterConditions) == null ? void 0 : _a.conditionTree) ? renderMarketCards(selectedGroup.filterConditions.conditionTree) : /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { description: "暂无筛选条件", image: Empty.PRESENTED_IMAGE_SIMPLE }) })
      ] }) })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 h-full flex flex-col absolute inset-0 bg-gray-50 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { className: "text-[#1890ff] text-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: { margin: 0, color: "#333" }, children: "证券组管理" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}), className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none", onClick: handleAdd, children: "新增证券组" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-4 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[320px] bg-white border border-gray-200 rounded-md flex flex-col overflow-hidden shadow-sm shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-b border-gray-200 flex flex-col gap-2 shrink-0 bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "搜索证券组名称",
            prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, { className: "text-gray-400" }),
            value: searchName,
            onChange: (e) => setSearchName(e.target.value),
            allowClear: true
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            columns: leftColumns,
            dataSource: filteredData,
            rowKey: "id",
            pagination: {
              pageSize: 20,
              size: "small",
              showSizeChanger: false,
              showTotal: (total) => `共 ${total} 条`
            },
            size: "small",
            scroll: { y: "calc(100vh - 260px)" },
            onRow: (record) => ({
              onClick: () => setSelectedGroup(record),
              className: "cursor-pointer transition-colors hover:bg-gray-50"
            }),
            rowClassName: (record) => (selectedGroup == null ? void 0 : selectedGroup.id) === record.id ? "!bg-[#e6f7ff]" : ""
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-white border border-gray-200 rounded-md p-6 overflow-hidden flex flex-col shadow-sm", children: renderDetails() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: editingRecord ? "编辑证券组" : "新增证券组",
        open: isModalVisible,
        onOk: handleModalOk,
        onCancel: () => setIsModalVisible(false),
        destroyOnClose: true,
        width: 520,
        okText: "确定",
        cancelText: "取消",
        okButtonProps: { className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { form, layout: "vertical", className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "name", label: "证券组名称", rules: [{ required: true, message: "请输入证券组名称" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "请输入证券组名称" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "description", label: "描述", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextArea, { rows: 3, placeholder: "请输入描述" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form.Item,
            {
              name: "groupType",
              label: "证券组更新模式",
              rules: [{ required: true, message: "请选择更新模式" }],
              tooltip: "静态证券组需手动维护证券列表；动态证券组通过设置条件自动筛选证券。",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Radio.Group, { onChange: (e) => setFormGroupType(e.target.value), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { value: "static", children: "静态证券组" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { value: "dynamic", children: "动态证券组" })
              ] })
            }
          ),
          formGroupType === "dynamic" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50/50 p-3 rounded border border-blue-100 mb-4 text-gray-500 text-sm flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, { className: "text-[#1890ff] mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "动态证券组的筛选条件请在创建完成后，在右侧详情面板中点击“编辑条件”进行配置。" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: "编辑动态筛选条件",
        open: isDynamicFilterModalVisible,
        onOk: handleDynamicFilterModalOk,
        onCancel: () => setIsDynamicFilterModalVisible(false),
        destroyOnClose: true,
        width: 850,
        okText: "确定",
        cancelText: "取消",
        okButtonProps: { className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 max-h-[60vh] overflow-y-auto pr-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RuleGroupNode,
            {
              group: conditionTree,
              onChange: setConditionTree,
              isRoot: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", ghost: true, onClick: () => {
            const filtered = mockAllSecurities.filter((item) => evaluateGroup(item, conditionTree));
            setPreviewData(filtered);
            setIsPreviewVisible(true);
          }, children: "预览证券列表" }) }),
          isPreviewVisible && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border-t border-gray-200 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold mb-2", children: [
              "预览结果 (",
              previewData.length,
              "条)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ForwardTable,
              {
                size: "small",
                columns: [
                  { title: "证券代码", dataIndex: "symbol" },
                  { title: "证券名称", dataIndex: "name" },
                  { title: "交易市场", dataIndex: "market", render: (v) => {
                    var _a;
                    return ((_a = getEnumOptions("market").find((o) => o.value === v)) == null ? void 0 : _a.label) || v;
                  } }
                ],
                dataSource: previewData,
                rowKey: "symbol",
                pagination: { pageSize: 5 }
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Modal,
      {
        title: "预览证券列表",
        open: isViewPreviewModalVisible,
        onCancel: () => setIsViewPreviewModalVisible(false),
        footer: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setIsViewPreviewModalVisible(false), children: "关闭" }, "close")
        ],
        width: 800,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
            "共匹配到 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#1890ff] font-bold", children: previewData.length }),
            " 条证券"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ForwardTable,
            {
              size: "middle",
              columns: [
                { title: "证券代码", dataIndex: "symbol" },
                { title: "证券名称", dataIndex: "name" },
                { title: "交易市场", dataIndex: "market", render: (v) => {
                  var _a;
                  return ((_a = getEnumOptions("market").find((o) => o.value === v)) == null ? void 0 : _a.label) || v;
                } }
              ],
              dataSource: previewData,
              rowKey: "symbol",
              pagination: { pageSize: 10 }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Modal,
      {
        title: "删除证券组",
        open: isDeleteModalVisible,
        onOk: confirmDelete,
        onCancel: () => setIsDeleteModalVisible(false),
        width: 800,
        okText: "确定",
        cancelText: "取消",
        okButtonProps: { danger: true },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Alert,
            {
              message: "删除证券组前，请先解除关联规则中绑定的证券组，否则风控规则将失效",
              type: "warning",
              showIcon: true,
              closable: true,
              className: "mb-4"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ForwardTable,
            {
              columns: [
                { title: "证券组ID", dataIndex: "groupId" },
                { title: "证券组名称", dataIndex: "groupName" },
                { title: "关联的规则编号", dataIndex: "ruleNo" },
                { title: "关联的规则名称", dataIndex: "ruleName" },
                { title: "规则状态", dataIndex: "ruleStatus" },
                { title: "审批状态", dataIndex: "approvalStatus" }
              ],
              dataSource: [],
              pagination: false,
              locale: {
                emptyText: /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE, description: "暂无数据" })
              },
              size: "middle",
              className: "custom-table"
            }
          )
        ]
      }
    )
  ] });
};
export {
  SecurityGroupManagement,
  SecurityGroupManagement as default
};
