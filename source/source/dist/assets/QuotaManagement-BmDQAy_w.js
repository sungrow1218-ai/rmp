import { r as reactExports, a as resetComponent, d as ConfigContext, e as classNames, l as useData, m as dayjs, K as DEFAULT_QUOTA, L as DEFAULT_PARENT_QUOTA, M as DEFAULT_HK_QUOTA, N as DEFAULT_CONNECT_QUOTA, j as jsxRuntimeExports } from "./index-CUErrqgd.js";
import { R as RefIcon } from "./SafetyCertificateOutlined-C1BP17mi.js";
import { T as Typography } from "./index-D6bScF1D.js";
import { S as Skeleton, C as Card } from "./index-lZ1unLVs.js";
import { R as Row, C as Col } from "./row-B49boWar.js";
import { a as useForceUpdate } from "./useBreakpoint-CZwDkAga.js";
import { c as cloneElement } from "./reactNode-TfIvHo6t.js";
import { p as pickAttrs } from "./pickAttrs-B6Vs2P5v.js";
import { g as genStyleHooks, m as merge } from "./asyncToGenerator-Bn7YJjF8.js";
import { F as ForwardTable } from "./Table-DpJrvGn6.js";
import { T as Tag } from "./index-C_p_uySS.js";
import { D as Drawer, T as Timeline } from "./Timeline-zVUloNtp.js";
import { D as DatePicker } from "./index-kyMbMI4L.js";
import { R as RefIcon$1 } from "./HistoryOutlined-Cqo1phRd.js";
import { B as Button } from "./button-DMDTHtWf.js";
import "./index-BKheaG9T.js";
import "./compact-item-T75FitAV.js";
import "./useZIndex-BReSjmbj.js";
import "./TextArea-Cw6hnbxh.js";
import "./index-nHZQBtRj.js";
import "./EllipsisOutlined-BuwqaHFz.js";
import "./Overflow-DO7wolsL.js";
import "./PlusOutlined-DF-GsZDp.js";
import "./responsiveObserver-ChKXsNUO.js";
import "./index-D37x-ts6.js";
import "./PurePanel-GUILNfpz.js";
import "./LoadingOutlined-s4PR_g90.js";
import "./index-HqjRjDrR.js";
import "./index-DNc7br9R.js";
import "./index-BC0QXd6g.js";
import "./RightOutlined-BAFHU4sg.js";
import "./index-DMsHtZNk.js";
import "./index-DpyJnIWD.js";
import "./useClosable-BjqEnKhC.js";
import "./context-C5GnONAC.js";
import "./render-uL5zGIDv.js";
const StatisticNumber = (props) => {
  const {
    value,
    formatter,
    precision,
    decimalSeparator,
    groupSeparator = "",
    prefixCls
  } = props;
  let valueNode;
  if (typeof formatter === "function") {
    valueNode = formatter(value);
  } else {
    const val = String(value);
    const cells = val.match(/^(-?)(\d*)(\.(\d+))?$/);
    if (!cells || val === "-") {
      valueNode = val;
    } else {
      const negative = cells[1];
      let int = cells[2] || "0";
      let decimal = cells[4] || "";
      int = int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
      if (typeof precision === "number") {
        decimal = decimal.padEnd(precision, "0").slice(0, precision > 0 ? precision : 0);
      }
      if (decimal) {
        decimal = `${decimalSeparator}${decimal}`;
      }
      valueNode = [/* @__PURE__ */ reactExports.createElement("span", {
        key: "int",
        className: `${prefixCls}-content-value-int`
      }, negative, int), decimal && /* @__PURE__ */ reactExports.createElement("span", {
        key: "decimal",
        className: `${prefixCls}-content-value-decimal`
      }, decimal)];
    }
  }
  return /* @__PURE__ */ reactExports.createElement("span", {
    className: `${prefixCls}-content-value`
  }, valueNode);
};
const genStatisticStyle = (token) => {
  const {
    componentCls,
    marginXXS,
    padding,
    colorTextDescription,
    titleFontSize,
    colorTextHeading,
    contentFontSize,
    fontFamily
  } = token;
  return {
    [`${componentCls}`]: Object.assign(Object.assign({}, resetComponent(token)), {
      [`${componentCls}-title`]: {
        marginBottom: marginXXS,
        color: colorTextDescription,
        fontSize: titleFontSize
      },
      [`${componentCls}-skeleton`]: {
        paddingTop: padding
      },
      [`${componentCls}-content`]: {
        color: colorTextHeading,
        fontSize: contentFontSize,
        fontFamily,
        [`${componentCls}-content-value`]: {
          display: "inline-block",
          direction: "ltr"
        },
        [`${componentCls}-content-prefix, ${componentCls}-content-suffix`]: {
          display: "inline-block"
        },
        [`${componentCls}-content-prefix`]: {
          marginInlineEnd: marginXXS
        },
        [`${componentCls}-content-suffix`]: {
          marginInlineStart: marginXXS
        }
      }
    })
  };
};
const prepareComponentToken = (token) => {
  const {
    fontSizeHeading3,
    fontSize
  } = token;
  return {
    titleFontSize: fontSize,
    contentFontSize: fontSizeHeading3
  };
};
const useStyle = genStyleHooks("Statistic", (token) => {
  const statisticToken = merge(token, {});
  return [genStatisticStyle(statisticToken)];
}, prepareComponentToken);
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Statistic = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    valueStyle,
    value = 0,
    title,
    valueRender,
    prefix,
    suffix,
    loading = false,
    /* --- FormatConfig starts --- */
    formatter,
    precision,
    decimalSeparator = ".",
    groupSeparator = ",",
    /* --- FormatConfig starts --- */
    onMouseEnter,
    onMouseLeave
  } = props, rest = __rest$1(props, ["prefixCls", "className", "rootClassName", "style", "valueStyle", "value", "title", "valueRender", "prefix", "suffix", "loading", "formatter", "precision", "decimalSeparator", "groupSeparator", "onMouseEnter", "onMouseLeave"]);
  const {
    getPrefixCls,
    direction,
    statistic
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("statistic", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const valueNode = /* @__PURE__ */ reactExports.createElement(StatisticNumber, {
    decimalSeparator,
    groupSeparator,
    prefixCls,
    formatter,
    precision,
    value
  });
  const cls = classNames(prefixCls, {
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, statistic === null || statistic === void 0 ? void 0 : statistic.className, className, rootClassName, hashId, cssVarCls);
  const restProps = pickAttrs(rest, {
    aria: true,
    data: true
  });
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement("div", Object.assign({}, restProps, {
    className: cls,
    style: Object.assign(Object.assign({}, statistic === null || statistic === void 0 ? void 0 : statistic.style), style),
    onMouseEnter,
    onMouseLeave
  }), title && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-title`
  }, title), /* @__PURE__ */ reactExports.createElement(Skeleton, {
    paragraph: false,
    loading,
    className: `${prefixCls}-skeleton`
  }, /* @__PURE__ */ reactExports.createElement("div", {
    style: valueStyle,
    className: `${prefixCls}-content`
  }, prefix && /* @__PURE__ */ reactExports.createElement("span", {
    className: `${prefixCls}-content-prefix`
  }, prefix), valueRender ? valueRender(valueNode) : valueNode, suffix && /* @__PURE__ */ reactExports.createElement("span", {
    className: `${prefixCls}-content-suffix`
  }, suffix)))));
};
const timeUnits = [
  ["Y", 1e3 * 60 * 60 * 24 * 365],
  // years
  ["M", 1e3 * 60 * 60 * 24 * 30],
  // months
  ["D", 1e3 * 60 * 60 * 24],
  // days
  ["H", 1e3 * 60 * 60],
  // hours
  ["m", 1e3 * 60],
  // minutes
  ["s", 1e3],
  // seconds
  ["S", 1]
  // million seconds
];
function formatTimeStr(duration, format) {
  let leftDuration = duration;
  const escapeRegex = /\[[^\]]*]/g;
  const keepList = (format.match(escapeRegex) || []).map((str) => str.slice(1, -1));
  const templateText = format.replace(escapeRegex, "[]");
  const replacedText = timeUnits.reduce((current, _ref) => {
    let [name, unit] = _ref;
    if (current.includes(name)) {
      const value = Math.floor(leftDuration / unit);
      leftDuration -= value * unit;
      return current.replace(new RegExp(`${name}+`, "g"), (match) => {
        const len = match.length;
        return value.toString().padStart(len, "0");
      });
    }
    return current;
  }, templateText);
  let index = 0;
  return replacedText.replace(escapeRegex, () => {
    const match = keepList[index];
    index += 1;
    return match;
  });
}
function formatCountdown(value, config) {
  const {
    format = ""
  } = config;
  const target = new Date(value).getTime();
  const current = Date.now();
  const diff = Math.max(target - current, 0);
  return formatTimeStr(diff, format);
}
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const REFRESH_INTERVAL = 1e3 / 30;
function getTime(value) {
  return new Date(value).getTime();
}
const Countdown = (props) => {
  const {
    value,
    format = "HH:mm:ss",
    onChange,
    onFinish
  } = props, rest = __rest(props, ["value", "format", "onChange", "onFinish"]);
  const forceUpdate = useForceUpdate();
  const countdown = reactExports.useRef(null);
  const stopTimer = () => {
    onFinish === null || onFinish === void 0 ? void 0 : onFinish();
    if (countdown.current) {
      clearInterval(countdown.current);
      countdown.current = null;
    }
  };
  const syncTimer = () => {
    const timestamp = getTime(value);
    if (timestamp >= Date.now()) {
      countdown.current = setInterval(() => {
        forceUpdate();
        onChange === null || onChange === void 0 ? void 0 : onChange(timestamp - Date.now());
        if (timestamp < Date.now()) {
          stopTimer();
        }
      }, REFRESH_INTERVAL);
    }
  };
  reactExports.useEffect(() => {
    syncTimer();
    return () => {
      if (countdown.current) {
        clearInterval(countdown.current);
        countdown.current = null;
      }
    };
  }, [value]);
  const formatter = (formatValue, config) => formatCountdown(formatValue, Object.assign(Object.assign({}, config), {
    format
  }));
  const valueRender = (node) => cloneElement(node, {
    title: void 0
  });
  return /* @__PURE__ */ reactExports.createElement(Statistic, Object.assign({}, rest, {
    value,
    valueRender,
    formatter
  }));
};
const Countdown$1 = /* @__PURE__ */ reactExports.memo(Countdown);
Statistic.Countdown = Countdown$1;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const QuotaManagement = () => {
  const { data, history } = useData();
  const [isHistoryVisible, setIsHistoryVisible] = reactExports.useState(false);
  const [historySymbol, setHistorySymbol] = reactExports.useState(null);
  const [dateRange, setDateRange] = reactExports.useState(null);
  const showHistory = (symbol) => {
    setHistorySymbol(symbol);
    setDateRange(null);
    setIsHistoryVisible(true);
  };
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
  const modifiedData = data.filter(
    (item) => item.quotaAllocation !== DEFAULT_QUOTA || item.parentQuotaAllocation !== DEFAULT_PARENT_QUOTA || item.hkQuotaAllocation !== DEFAULT_HK_QUOTA || item.connectQuotaAllocation !== DEFAULT_CONNECT_QUOTA
  );
  const columns = [
    {
      title: "证券代码",
      dataIndex: "symbol",
      key: "symbol",
      width: 120,
      render: (text) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-600 font-medium", children: text })
    },
    {
      title: "证券名称",
      dataIndex: "name",
      key: "name",
      width: 120
    },
    {
      title: "总额度",
      dataIndex: "quotaAllocation",
      key: "quotaAllocation",
      width: 120,
      render: (val) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: val !== DEFAULT_QUOTA ? "orange" : "default", children: [
        val.toFixed(2),
        "%"
      ] })
    },
    {
      title: "母公司额度",
      dataIndex: "parentQuotaAllocation",
      key: "parentQuotaAllocation",
      width: 120,
      render: (val) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: val !== DEFAULT_PARENT_QUOTA ? "green" : "default", children: [
        val.toFixed(2),
        "%"
      ] })
    },
    {
      title: "香港金控额度",
      dataIndex: "hkQuotaAllocation",
      key: "hkQuotaAllocation",
      width: 120,
      render: (val) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: val !== DEFAULT_HK_QUOTA ? "purple" : "default", children: [
        val.toFixed(2),
        "%"
      ] })
    },
    {
      title: "陆股通额度",
      dataIndex: "connectQuotaAllocation",
      key: "connectQuotaAllocation",
      width: 120,
      render: (val) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: val !== DEFAULT_CONNECT_QUOTA ? "cyan" : "default", children: [
        val.toFixed(2),
        "%"
      ] })
    },
    {
      title: "修改人",
      key: "operator",
      width: 100,
      render: (_, record) => {
        const latestHistory = history.find((h) => h.symbol === record.symbol);
        return latestHistory ? latestHistory.operator : "-";
      }
    },
    {
      title: "修改时间",
      key: "timestamp",
      width: 160,
      render: (_, record) => {
        const latestHistory = history.find((h) => h.symbol === record.symbol);
        return latestHistory ? latestHistory.timestamp : "-";
      }
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "link", size: "small", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}), onClick: () => showHistory(record.symbol), children: "追溯记录" })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 h-full flex flex-col absolute inset-0 bg-gray-50 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 shrink-0 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { className: "text-[#c27b57] text-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: { margin: 0 }, children: "额度管理" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "全局默认额度配置", className: "mb-4 shrink-0 shadow-sm border-t-4 border-t-[#c27b57]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 24, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "默认总额度",
          value: DEFAULT_QUOTA,
          precision: 2,
          suffix: "%",
          valueStyle: { color: "#c27b57", fontWeight: "bold" }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "母公司额度 (下限 ~ 上限)",
          value: `0.00 ~ ${DEFAULT_PARENT_QUOTA.toFixed(2)}`,
          suffix: "%",
          valueStyle: { color: "#52c41a" }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "香港金控额度 (下限 ~ 上限)",
          value: `0.00 ~ ${DEFAULT_HK_QUOTA.toFixed(2)}`,
          suffix: "%",
          valueStyle: { color: "#722ed1" }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "陆股通额度 (下限 ~ 上限)",
          value: `0.00 ~ ${DEFAULT_CONNECT_QUOTA.toFixed(2)}`,
          suffix: "%",
          valueStyle: { color: "#13c2c2" }
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "已修改生效的证券列表" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: "blue", children: [
            "共 ",
            modifiedData.length,
            " 条记录"
          ] })
        ] }),
        className: "flex-1 shadow-sm flex flex-col overflow-hidden",
        bodyStyle: { padding: 0, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            columns,
            dataSource: modifiedData,
            rowKey: "id",
            pagination: {
              pageSize: 50,
              showTotal: (total) => `共 ${total} 条记录`
            },
            scroll: { x: "max-content", y: "calc(100vh - 420px)" },
            size: "middle",
            bordered: true
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Drawer,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { className: "text-[#c27b57]" }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { style: { fontSize: 48, marginBottom: 16, opacity: 0.2 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "暂无调整记录" })
          ] })
        ]
      }
    )
  ] });
};
export {
  QuotaManagement,
  QuotaManagement as default
};
