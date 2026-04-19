// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
import { UNITS__MAP } from "@/utils/dict";

export const conditionTypeNameMap = {
  "15": "成交金额",
  "16": "成交数量",
  "17": "成交价格涨跌幅",
  "18": "市场成交占比",
  "29": "累计撤销占比",
  "22": "撤单笔数",
  "23": "撤单委托比",
  "33": "涨跌停价挂单金额",
  "34": "涨跌停价挂单数量",
  "35": "反向成交金额",
  "36": "反向成交数量",
  "38": "开（收）盘价涨跌幅",
  "40": "累计申报数量",
  "41": "累计申报金额",
  "42": "同方向累计申报占比",
  "43": "低于申报买入/高于申报卖出次数",
  "44": "五档内挂单数量",
  "45": "五档内挂单金额",
  "46": "五档内挂单市场占比",
  "47": "反向卖出/买入成交次数",
  "48": "涨跌停价挂单市场占比",
  "49": "申报价格偏离度",
  "50": "累计触发次数",
  "51": "市场涨跌停价剩余申报数量",
  "52": "市场涨跌停价剩余申报金额",
  "57": "每秒申报数量",
  "58": "单日申报数量",
  "64": "瞬时撤单次数",
  "65": "当日撤单笔数占比",
  "66": "当日撤单金额占比",
  "67": "指数波动率",
  "68": "指数成分股成交金额",
  "69": "本方成交金额市场占比",
  "34000": "剩余有效申报金额",
  "33000": "剩余有效申报数量",
  "11000": "自成交比例",
  "11004": "自成交次数",
  "11005": "自成交金额",
} as const;

/**
 * 单位字典 code 到单位对应配置的映射，主要包含，max，min，precision
 */
export const unitCodeToConfigMap = {
  /**
   * 笔
   */
  AMOUNT: {
    name: UNITS__MAP.AMOUNT.name,
    code: UNITS__MAP.AMOUNT.code,
    min: 0,
    max: 99999999,
    precision: 0,
  },
  /**
   * %
   */
  PERCENT: {
    name: UNITS__MAP.PERCENT.name,
    code: UNITS__MAP.PERCENT.code,
    min: 0,
    max: 100,
    precision: 2,
  },
  /**
   * 股
   */
  SHARES: {
    name: UNITS__MAP.SHARES.name,
    code: UNITS__MAP.SHARES.code,
    min: 0,
    max: 99999999,
    precision: 0,
  },
  /**
   * 万股
   */
  TEN_THOUSAND_SHARES: {
    name: UNITS__MAP.TEN_THOUSAND_SHARES.name,
    code: UNITS__MAP.TEN_THOUSAND_SHARES.code,
    min: 0.0,
    max: 99999999.9999,
    precision: 4,
  },
  /**
   * 元
   */
  YUAN: {
    name: UNITS__MAP.YUAN.name,
    code: UNITS__MAP.YUAN.code,
    min: 0.0,
    max: 99999999.9999,
    precision: 4,
  },
  /**
   * 万元
   */
  TEN_THOUSAND_YUAN: {
    name: UNITS__MAP.TEN_THOUSAND_YUAN.name,
    code: UNITS__MAP.TEN_THOUSAND_YUAN.code,
    min: 0.0,
    max: 99999999.9999,
    precision: 4,
  },
  /**
   * 次
   */
  TIMES: {
    name: UNITS__MAP.TIMES.name,
    code: UNITS__MAP.TIMES.code,
    min: 0,
    max: 99999999,
    precision: 0,
  },
  /**
   * 倍
   */
  MULTIPLE: {
    name: UNITS__MAP.MULTIPLE.name,
    code: UNITS__MAP.MULTIPLE.code,
    min: 0.0,
    max: 99999999.9999,
    precision: 4,
  },
} as const;
