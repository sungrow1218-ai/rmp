import { l as useData, r as reactExports, m as dayjs, j as jsxRuntimeExports } from "./index-CUErrqgd.js";
import { F as Form } from "./index-CYeT6-j6.js";
import { T as Typography } from "./index-D6bScF1D.js";
import { C as Card } from "./index-lZ1unLVs.js";
import { I as Input } from "./index-HqjRjDrR.js";
import { R as RefIcon } from "./SearchOutlined-DjI6MF7U.js";
import { F as ForwardTable } from "./Table-DpJrvGn6.js";
import { M as Modal } from "./index-BO0cQK6u.js";
import { T as TypedInputNumber } from "./index-GAqaRoyL.js";
import { R as RefIcon$1 } from "./EditOutlined-D9EEcHWK.js";
import { D as Drawer, T as Timeline } from "./Timeline-zVUloNtp.js";
import { D as DatePicker } from "./index-kyMbMI4L.js";
import { T as Tag } from "./index-C_p_uySS.js";
import { R as RefIcon$2 } from "./HistoryOutlined-Cqo1phRd.js";
import { C as CompoundedSpace } from "./index-DMsHtZNk.js";
import { B as Button } from "./button-DMDTHtWf.js";
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
import "./index-nHZQBtRj.js";
import "./EllipsisOutlined-BuwqaHFz.js";
import "./Overflow-DO7wolsL.js";
import "./PlusOutlined-DF-GsZDp.js";
import "./pickAttrs-B6Vs2P5v.js";
import "./index-D37x-ts6.js";
import "./PurePanel-GUILNfpz.js";
import "./index-DNc7br9R.js";
import "./index-BC0QXd6g.js";
import "./RightOutlined-BAFHU4sg.js";
import "./useBreakpoint-CZwDkAga.js";
import "./index-DpyJnIWD.js";
import "./render-uL5zGIDv.js";
import "./InfoCircleFilled-6TjWreYB.js";
import "./useClosable-BjqEnKhC.js";
import "./context-C5GnONAC.js";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const QuotaAdjustment = () => {
  const { data, history, updateQuota } = useData();
  const [searchText, setSearchText] = reactExports.useState("");
  const [isModalVisible, setIsModalVisible] = reactExports.useState(false);
  const [editingRecord, setEditingRecord] = reactExports.useState(null);
  const [form] = Form.useForm();
  const [isHistoryVisible, setIsHistoryVisible] = reactExports.useState(false);
  const [historySymbol, setHistorySymbol] = reactExports.useState(null);
  const [dateRange, setDateRange] = reactExports.useState(null);
  const filteredData = data.filter(
    (item) => item.symbol.includes(searchText) || item.name.includes(searchText)
  );
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({ quota: record.quotaAllocation });
    setIsModalVisible(true);
  };
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingRecord) {
        updateQuota(editingRecord.symbol, values.quota);
      }
      setIsModalVisible(false);
    });
  };
  const showHistory = (symbol) => {
    setHistorySymbol(symbol);
    setDateRange(null);
    setIsHistoryVisible(true);
  };
  const columns = [
    { title: "证券代码", dataIndex: "symbol", key: "symbol", width: 120 },
    { title: "证券名称", dataIndex: "name", key: "name", width: 150 },
    {
      title: "当前额度配置 (%)",
      dataIndex: "quotaAllocation",
      key: "quotaAllocation",
      width: 150,
      render: (val) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: "#c27b57", className: "text-sm px-2 py-1", children: [
        val.toFixed(2),
        "%"
      ] })
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_, record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(CompoundedSpace, { size: "middle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", ghost: true, size: "small", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}), onClick: () => handleEdit(record), children: "调整额度" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "default", size: "small", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}), onClick: () => showHistory(record.symbol), children: "追溯记录" })
      ] })
    }
  ];
  const symbolHistory = reactExports.useMemo(() => {
    let filtered = history.filter((h) => h.symbol === historySymbol);
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].startOf("day").valueOf();
      const end = dateRange[1].endOf("day").valueOf();
      filtered = filtered.filter((h) => {
        const time = dayjs(h.timestamp).valueOf();
        return time >= start && time <= end;
      });
    }
    return filtered;
  }, [history, historySymbol, dateRange]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 h-full flex flex-col absolute inset-0 bg-gray-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: { margin: 0 }, children: "额度调整" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", className: "text-sm mt-1 block", children: "人工调整各个标的的分配额度，并支持历史记录追溯。" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex-1 overflow-hidden flex flex-col shadow-sm", bodyStyle: { padding: "16px", height: "100%", display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "搜索证券代码或名称",
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { className: "text-gray-400" }),
          value: searchText,
          onChange: (e) => setSearchText(e.target.value),
          style: { width: 280 },
          allowClear: true
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden border border-gray-200 rounded-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ForwardTable,
        {
          columns,
          dataSource: filteredData,
          rowKey: "id",
          scroll: { y: "calc(100vh - 300px)" },
          pagination: {
            total: filteredData.length,
            pageSize: 50,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          },
          size: "middle"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { className: "text-[#c27b57]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "调整额度 - ",
            editingRecord == null ? void 0 : editingRecord.symbol,
            " (",
            editingRecord == null ? void 0 : editingRecord.name,
            ")"
          ] })
        ] }),
        open: isModalVisible,
        onOk: handleSave,
        onCancel: () => setIsModalVisible(false),
        destroyOnClose: true,
        okText: "确认调整",
        cancelText: "取消",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { form, layout: "vertical", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Form.Item,
          {
            name: "quota",
            label: "新额度配置 (%)",
            rules: [{ required: true, message: "请输入新额度" }],
            extra: "调整后的额度将立即在集中度报表中生效。",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TypedInputNumber,
              {
                min: 0,
                max: 100,
                step: 0.1,
                style: { width: "100%" },
                size: "large",
                addonAfter: "%"
              }
            )
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Drawer,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { className: "text-[#c27b57]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "额度调整记录 - ",
            historySymbol
          ] })
        ] }),
        placement: "right",
        onClose: () => setIsHistoryVisible(false),
        open: isHistoryVisible,
        width: 500,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { className: "mb-2 block text-gray-600", children: "按时间范围筛选：" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RangePicker,
              {
                style: { width: "100%" },
                value: dateRange,
                onChange: (dates) => setDateRange(dates),
                allowClear: true
              }
            )
          ] }),
          symbolHistory.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Timeline,
            {
              className: "mt-4",
              items: symbolHistory.map((h) => ({
                color: "#c27b57",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-lg border border-gray-200 shadow-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-gray-500 text-xs mb-3 flex justify-between items-center border-b border-gray-100 pb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-700", children: h.timestamp }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "default", bordered: false, children: h.operator })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-3 gap-x-4 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex justify-between items-center bg-orange-50 p-2 rounded", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 font-medium", children: "总额度" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { delete: true, className: "text-gray-400", children: [
                          h.oldQuota.toFixed(2),
                          "%"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "→" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { type: "warning", strong: true, children: [
                          h.newQuota.toFixed(2),
                          "%"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 bg-green-50 p-2 rounded", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-xs", children: "母公司" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { delete: true, className: "text-gray-400 text-xs", children: [
                          h.oldParentQuota.toFixed(2),
                          "%"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300 text-xs", children: "→" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { type: "success", strong: true, children: [
                          h.newParentQuota.toFixed(2),
                          "%"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 bg-purple-50 p-2 rounded", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-xs", children: "香港金控" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { delete: true, className: "text-gray-400 text-xs", children: [
                          h.oldHkQuota.toFixed(2),
                          "%"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300 text-xs", children: "→" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-purple-600 font-bold", children: [
                          h.newHkQuota.toFixed(2),
                          "%"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 bg-cyan-50 p-2 rounded", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-xs", children: "陆股通" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { delete: true, className: "text-gray-400 text-xs", children: [
                          h.oldConnectQuota.toFixed(2),
                          "%"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300 text-xs", children: "→" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cyan-600 font-bold", children: [
                          h.newConnectQuota.toFixed(2),
                          "%"
                        ] })
                      ] })
                    ] })
                  ] })
                ] })
              }))
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-64 text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { style: { fontSize: 48, marginBottom: 16, opacity: 0.2 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "暂无调整记录" })
          ] })
        ]
      }
    )
  ] });
};
export {
  QuotaAdjustment,
  QuotaAdjustment as default
};
