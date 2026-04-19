import { R as React, r as reactExports, e as classNames, a as resetComponent, b as unit, a0 as textEllipsis, d as ConfigContext } from "./index-CUErrqgd.js";
import { m as matchScreen } from "./responsiveObserver-ChKXsNUO.js";
import { t as toArray, u as useSize } from "./compact-item-T75FitAV.js";
import { u as useBreakpoint } from "./useBreakpoint-CZwDkAga.js";
import { g as genStyleHooks, m as merge } from "./asyncToGenerator-Bn7YJjF8.js";
const DEFAULT_COLUMN_MAP = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
};
const DescriptionsContext = /* @__PURE__ */ React.createContext({});
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const transChildren2Items = (childNodes) => toArray(childNodes).map((node) => Object.assign(Object.assign({}, node === null || node === void 0 ? void 0 : node.props), {
  key: node.key
}));
function useItems(screens, items, children) {
  const mergedItems = reactExports.useMemo(() => (
    // Take `items` first or convert `children` into items
    items || transChildren2Items(children)
  ), [items, children]);
  const responsiveItems = reactExports.useMemo(() => mergedItems.map((_a) => {
    var {
      span
    } = _a, restItem = __rest$1(_a, ["span"]);
    return Object.assign(Object.assign({}, restItem), {
      span: typeof span === "number" ? span : matchScreen(screens, span)
    });
  }), [mergedItems, screens]);
  return responsiveItems;
}
function getFilledItem(rowItem, rowRestCol, span) {
  let clone = rowItem;
  let exceed = false;
  if (span === void 0 || span > rowRestCol) {
    clone = Object.assign(Object.assign({}, rowItem), {
      span: rowRestCol
    });
    exceed = span !== void 0;
  }
  return [clone, exceed];
}
function getCalcRows(rowItems, mergedColumn) {
  const rows = [];
  let tmpRow = [];
  let rowRestCol = mergedColumn;
  let exceed = false;
  rowItems.filter((n) => n).forEach((rowItem, index) => {
    const span = rowItem === null || rowItem === void 0 ? void 0 : rowItem.span;
    const mergedSpan = span || 1;
    if (index === rowItems.length - 1) {
      const [item, itemExceed] = getFilledItem(rowItem, rowRestCol, span);
      exceed = exceed || itemExceed;
      tmpRow.push(item);
      rows.push(tmpRow);
      return;
    }
    if (mergedSpan < rowRestCol) {
      rowRestCol -= mergedSpan;
      tmpRow.push(rowItem);
    } else {
      const [item, itemExceed] = getFilledItem(rowItem, rowRestCol, mergedSpan);
      exceed = exceed || itemExceed;
      tmpRow.push(item);
      rows.push(tmpRow);
      rowRestCol = mergedColumn;
      tmpRow = [];
    }
  });
  return [rows, exceed];
}
const useRow = (mergedColumn, items) => {
  const [rows, exceed] = reactExports.useMemo(() => getCalcRows(items, mergedColumn), [items, mergedColumn]);
  return rows;
};
const DescriptionsItem = (_ref) => {
  let {
    children
  } = _ref;
  return children;
};
function notEmpty(val) {
  return val !== void 0 && val !== null;
}
const Cell = (props) => {
  const {
    itemPrefixCls,
    component,
    span,
    className,
    style,
    labelStyle,
    contentStyle,
    bordered,
    label,
    content,
    colon,
    type
  } = props;
  const Component = component;
  if (bordered) {
    return /* @__PURE__ */ reactExports.createElement(Component, {
      className: classNames({
        [`${itemPrefixCls}-item-label`]: type === "label",
        [`${itemPrefixCls}-item-content`]: type === "content"
      }, className),
      style,
      colSpan: span
    }, notEmpty(label) && /* @__PURE__ */ reactExports.createElement("span", {
      style: labelStyle
    }, label), notEmpty(content) && /* @__PURE__ */ reactExports.createElement("span", {
      style: contentStyle
    }, content));
  }
  return /* @__PURE__ */ reactExports.createElement(Component, {
    className: classNames(`${itemPrefixCls}-item`, className),
    style,
    colSpan: span
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: `${itemPrefixCls}-item-container`
  }, (label || label === 0) && /* @__PURE__ */ reactExports.createElement("span", {
    className: classNames(`${itemPrefixCls}-item-label`, {
      [`${itemPrefixCls}-item-no-colon`]: !colon
    }),
    style: labelStyle
  }, label), (content || content === 0) && /* @__PURE__ */ reactExports.createElement("span", {
    className: classNames(`${itemPrefixCls}-item-content`),
    style: contentStyle
  }, content)));
};
function renderCells(items, _ref, _ref2) {
  let {
    colon,
    prefixCls,
    bordered
  } = _ref;
  let {
    component,
    type,
    showLabel,
    showContent,
    labelStyle: rootLabelStyle,
    contentStyle: rootContentStyle
  } = _ref2;
  return items.map((_ref3, index) => {
    let {
      label,
      children,
      prefixCls: itemPrefixCls = prefixCls,
      className,
      style,
      labelStyle,
      contentStyle,
      span = 1,
      key
    } = _ref3;
    if (typeof component === "string") {
      return /* @__PURE__ */ reactExports.createElement(Cell, {
        key: `${type}-${key || index}`,
        className,
        style,
        labelStyle: Object.assign(Object.assign({}, rootLabelStyle), labelStyle),
        contentStyle: Object.assign(Object.assign({}, rootContentStyle), contentStyle),
        span,
        colon,
        component,
        itemPrefixCls,
        bordered,
        label: showLabel ? label : null,
        content: showContent ? children : null,
        type
      });
    }
    return [/* @__PURE__ */ reactExports.createElement(Cell, {
      key: `label-${key || index}`,
      className,
      style: Object.assign(Object.assign(Object.assign({}, rootLabelStyle), style), labelStyle),
      span: 1,
      colon,
      component: component[0],
      itemPrefixCls,
      bordered,
      label,
      type: "label"
    }), /* @__PURE__ */ reactExports.createElement(Cell, {
      key: `content-${key || index}`,
      className,
      style: Object.assign(Object.assign(Object.assign({}, rootContentStyle), style), contentStyle),
      span: span * 2 - 1,
      component: component[1],
      itemPrefixCls,
      bordered,
      content: children,
      type: "content"
    })];
  });
}
const Row = (props) => {
  const descContext = reactExports.useContext(DescriptionsContext);
  const {
    prefixCls,
    vertical,
    row,
    index,
    bordered
  } = props;
  if (vertical) {
    return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("tr", {
      key: `label-${index}`,
      className: `${prefixCls}-row`
    }, renderCells(row, props, Object.assign({
      component: "th",
      type: "label",
      showLabel: true
    }, descContext))), /* @__PURE__ */ reactExports.createElement("tr", {
      key: `content-${index}`,
      className: `${prefixCls}-row`
    }, renderCells(row, props, Object.assign({
      component: "td",
      type: "content",
      showContent: true
    }, descContext))));
  }
  return /* @__PURE__ */ reactExports.createElement("tr", {
    key: index,
    className: `${prefixCls}-row`
  }, renderCells(row, props, Object.assign({
    component: bordered ? ["th", "td"] : "td",
    type: "item",
    showLabel: true,
    showContent: true
  }, descContext)));
};
const genBorderedStyle = (token) => {
  const {
    componentCls,
    labelBg
  } = token;
  return {
    [`&${componentCls}-bordered`]: {
      [`> ${componentCls}-view`]: {
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
        "> table": {
          tableLayout: "auto",
          borderCollapse: "collapse"
        },
        [`${componentCls}-row`]: {
          borderBottom: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
          "&:last-child": {
            borderBottom: "none"
          },
          [`> ${componentCls}-item-label, > ${componentCls}-item-content`]: {
            padding: `${unit(token.padding)} ${unit(token.paddingLG)}`,
            borderInlineEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
            "&:last-child": {
              borderInlineEnd: "none"
            }
          },
          [`> ${componentCls}-item-label`]: {
            color: token.colorTextSecondary,
            backgroundColor: labelBg,
            "&::after": {
              display: "none"
            }
          }
        }
      },
      [`&${componentCls}-middle`]: {
        [`${componentCls}-row`]: {
          [`> ${componentCls}-item-label, > ${componentCls}-item-content`]: {
            padding: `${unit(token.paddingSM)} ${unit(token.paddingLG)}`
          }
        }
      },
      [`&${componentCls}-small`]: {
        [`${componentCls}-row`]: {
          [`> ${componentCls}-item-label, > ${componentCls}-item-content`]: {
            padding: `${unit(token.paddingXS)} ${unit(token.padding)}`
          }
        }
      }
    }
  };
};
const genDescriptionStyles = (token) => {
  const {
    componentCls,
    extraColor,
    itemPaddingBottom,
    colonMarginRight,
    colonMarginLeft,
    titleMarginBottom
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign(Object.assign({}, resetComponent(token)), genBorderedStyle(token)), {
      [`&-rtl`]: {
        direction: "rtl"
      },
      [`${componentCls}-header`]: {
        display: "flex",
        alignItems: "center",
        marginBottom: titleMarginBottom
      },
      [`${componentCls}-title`]: Object.assign(Object.assign({}, textEllipsis), {
        flex: "auto",
        color: token.titleColor,
        fontWeight: token.fontWeightStrong,
        fontSize: token.fontSizeLG,
        lineHeight: token.lineHeightLG
      }),
      [`${componentCls}-extra`]: {
        marginInlineStart: "auto",
        color: extraColor,
        fontSize: token.fontSize
      },
      [`${componentCls}-view`]: {
        width: "100%",
        borderRadius: token.borderRadiusLG,
        table: {
          width: "100%",
          tableLayout: "fixed"
        }
      },
      [`${componentCls}-row`]: {
        "> th, > td": {
          paddingBottom: itemPaddingBottom
        },
        "&:last-child": {
          borderBottom: "none"
        }
      },
      [`${componentCls}-item-label`]: {
        color: token.colorTextTertiary,
        fontWeight: "normal",
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        textAlign: `start`,
        "&::after": {
          content: '":"',
          position: "relative",
          top: -0.5,
          // magic for position
          marginInline: `${unit(colonMarginLeft)} ${unit(colonMarginRight)}`
        },
        [`&${componentCls}-item-no-colon::after`]: {
          content: '""'
        }
      },
      [`${componentCls}-item-no-label`]: {
        "&::after": {
          margin: 0,
          content: '""'
        }
      },
      [`${componentCls}-item-content`]: {
        display: "table-cell",
        flex: 1,
        color: token.contentColor,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        wordBreak: "break-word",
        overflowWrap: "break-word"
      },
      [`${componentCls}-item`]: {
        paddingBottom: 0,
        verticalAlign: "top",
        "&-container": {
          display: "flex",
          [`${componentCls}-item-label`]: {
            display: "inline-flex",
            alignItems: "baseline"
          },
          [`${componentCls}-item-content`]: {
            display: "inline-flex",
            alignItems: "baseline"
          }
        }
      },
      "&-middle": {
        [`${componentCls}-row`]: {
          "> th, > td": {
            paddingBottom: token.paddingSM
          }
        }
      },
      "&-small": {
        [`${componentCls}-row`]: {
          "> th, > td": {
            paddingBottom: token.paddingXS
          }
        }
      }
    })
  };
};
const prepareComponentToken = (token) => ({
  labelBg: token.colorFillAlter,
  titleColor: token.colorText,
  titleMarginBottom: token.fontSizeSM * token.lineHeightSM,
  itemPaddingBottom: token.padding,
  colonMarginRight: token.marginXS,
  colonMarginLeft: token.marginXXS / 2,
  contentColor: token.colorText,
  extraColor: token.colorText
});
const useStyle = genStyleHooks("Descriptions", (token) => {
  const descriptionToken = merge(token, {});
  return genDescriptionStyles(descriptionToken);
}, prepareComponentToken);
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Descriptions = (props) => {
  const {
    prefixCls: customizePrefixCls,
    title,
    extra,
    column,
    colon = true,
    bordered,
    layout,
    children,
    className,
    rootClassName,
    style,
    size: customizeSize,
    labelStyle,
    contentStyle,
    items
  } = props, restProps = __rest(props, ["prefixCls", "title", "extra", "column", "colon", "bordered", "layout", "children", "className", "rootClassName", "style", "size", "labelStyle", "contentStyle", "items"]);
  const {
    getPrefixCls,
    direction,
    descriptions
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("descriptions", customizePrefixCls);
  const screens = useBreakpoint();
  const mergedColumn = reactExports.useMemo(() => {
    var _a;
    if (typeof column === "number") {
      return column;
    }
    return (_a = matchScreen(screens, Object.assign(Object.assign({}, DEFAULT_COLUMN_MAP), column))) !== null && _a !== void 0 ? _a : 3;
  }, [screens, column]);
  const mergedItems = useItems(screens, items, children);
  const mergedSize = useSize(customizeSize);
  const rows = useRow(mergedColumn, mergedItems);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const contextValue = reactExports.useMemo(() => ({
    labelStyle,
    contentStyle
  }), [labelStyle, contentStyle]);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(DescriptionsContext.Provider, {
    value: contextValue
  }, /* @__PURE__ */ reactExports.createElement("div", Object.assign({
    className: classNames(prefixCls, descriptions === null || descriptions === void 0 ? void 0 : descriptions.className, {
      [`${prefixCls}-${mergedSize}`]: mergedSize && mergedSize !== "default",
      [`${prefixCls}-bordered`]: !!bordered,
      [`${prefixCls}-rtl`]: direction === "rtl"
    }, className, rootClassName, hashId, cssVarCls),
    style: Object.assign(Object.assign({}, descriptions === null || descriptions === void 0 ? void 0 : descriptions.style), style)
  }, restProps), (title || extra) && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-header`
  }, title && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-title`
  }, title), extra && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-extra`
  }, extra)), /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-view`
  }, /* @__PURE__ */ reactExports.createElement("table", null, /* @__PURE__ */ reactExports.createElement("tbody", null, rows.map((row, index) => /* @__PURE__ */ reactExports.createElement(Row, {
    key: index,
    index,
    colon,
    prefixCls,
    vertical: layout === "vertical",
    bordered,
    row
  }))))))));
};
Descriptions.Item = DescriptionsItem;
export {
  Descriptions as D
};
