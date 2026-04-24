/* eslint-disable max-lines */
import { type ValueTypeAtKey } from './typing';

// 操作类型
export const OPERATION_TYPES = [
  { code: '1', name: '新增数据', feKey: 'ADD' },
  { code: '2', name: '修改数据', feKey: 'EDIT' },
  { code: '3', name: '删除数据', feKey: 'DELETE' },
] as const;
// 数据类型
export const DATA_TYPES = [
  { code: '1', name: '风控规则', feKey: '1' },
  { code: '2', name: '证券池', feKey: '2' },
  { code: '3', name: '动态维度', feKey: '3' },
  { code: '4', name: '证券池层级', feKey: '4' },
  { code: '5', name: '期货期权限仓', feKey: '5' },
  { code: '6', name: '通用限仓', feKey: '6' },
  { code: '7', name: '席位组', feKey: '7' },
  // { code: '8', name: '账户组', feKey: '8' },
] as const;

// 比较方向
export const COMPARE_DIRECTIONS = [
  { code: '1', name: '大于', feKey: 'GT' },
  { code: '2', name: '小于', feKey: 'LT' },
  { code: '3', name: '大于等于', feKey: 'GTE' },
  { code: '4', name: '小于等于', feKey: 'LTE' },
] as const;

export const COMPARE_DIRECTIONS__MAP = {
  GT: { code: '1', name: '大于' },
  LT: { code: '2', name: '小于' },
  GTE: { code: '3', name: '大于等于' },
  LTE: { code: '4', name: '小于等于' },
  EQUAL: { code: '7', name: '等于' },
} as const;

// 触警操作
export const ALARM_REACTIONS = [
  { code: '1', name: '预警', feKey: 'WARNING' },
  { code: '2', name: '禁止', feKey: 'FORBID' },
  { code: '3', name: '不提示', feKey: 'NO_NOTICE' },
] as const;
export const GRAY_FLAG = [
  { code: '0', name: '正式', feKey: '0' },
  { code: '1', name: '灰度', feKey: '1' },
] as const;

export const ALARM_REACTIONS__MAP = {
  WARNING: { code: '1', name: '预警' },
  FORBID: { code: '2', name: '禁止' },
  NO_NOTICE: { code: '3', name: '不提示' },
};

// 单位
export const UNITS = [
  { code: '0', name: '无', feKey: 'NONE' },
  { code: '1', name: '次', feKey: 'TIMES' },
  { code: '2', name: '万元', feKey: 'TEN_THOUSAND_YUAN' },
  { code: '3', name: '万股', feKey: 'TEN_THOUSAND_SHARES' },
  { code: '4', name: '%', feKey: 'PERCENT' },
  { code: '5', name: '股', feKey: 'SHARES' },
  { code: '6', name: '元', feKey: 'YUAN' },
  { code: '7', name: '笔', feKey: 'AMOUNT' },
] as const;

export const UNITS__MAP = {
  NONE: { code: '0', name: '无' },
  TIMES: { code: '1', name: '次' },
  TEN_THOUSAND_YUAN: { code: '2', name: '万元' },
  TEN_THOUSAND_SHARES: { code: '3', name: '万股(手)' },
  PERCENT: { code: '4', name: '%' },
  SHARES: { code: '5', name: '股' },
  YUAN: { code: '6', name: '元' },
  AMOUNT: { code: '7', name: '笔' },
  MULTIPLE: { code: '8', name: '倍' },
} as const;

// 规则状态
export const RULE_STATUSES = [
  { code: '1', name: '已启用', feKey: 'ENABLED' },
  { code: '2', name: '待启用', feKey: 'DISABLED' },
] as const;

export const RULE_STATUSES__MAP = {
  ENABLED: { code: 1, name: '启动' },
  DISABLED: { code: 2, name: '关闭' },
} as const;

// 所有一级规则类型
export const RULE_TYPE_LEVEL_1 = [
  {
    code: 'A',
    name: '证券持仓数量控制（集中度控制）',
    feKey: 'A',
  },
  { code: 'B', name: '证券持仓成本控制', feKey: 'B' },
  // { code: 'C', name: '证券持仓市值控制', feKey: 'C' },
  // { code: 'D', name: '证券市值按行业控制（社保）', feKey: 'D' },
  { code: 'E', name: '资产类别市值控制', feKey: 'E' },
  { code: 'F', name: '交易额控制', feKey: 'F' },
  // { code: 'G', name: '当日交易量控制', feKey: 'G' },
  { code: 'H', name: '执行价格控制', feKey: 'H' },
  { code: 'I', name: '证券买卖控制', feKey: 'I' },
  { code: 'J', name: '同反向控制', feKey: 'J' },
  // { code: 'K', name: '剩余天数控制', feKey: 'K' },
  // { code: 'L', name: '到期回购资产控制', feKey: 'L' },
  // { code: 'M', name: '交易对手授信额度控制', feKey: 'M' },
  // { code: 'N', name: '存款控制', feKey: 'N' },
  // { code: 'P', name: '回购质押券额度控制', feKey: 'P' },
  { code: 'Q', name: '交易频率控制', feKey: 'Q' },
  // { code: 'R', name: '期货占用保证金控制', feKey: 'R' },
  // { code: 'S', name: '合同投资控制', feKey: 'S' },
  // { code: 'T', name: '资产数值控制', feKey: 'T' },
  { code: 'Z', name: '异常交易行为控制', feKey: 'Z' },
] as const;

/**
 *  所有二级规则类型（目前仅包含一期实现的部分)
 */
export const RULE_TYPE_LEVEL_2 = [
  { code: 'Z01201', name: '连续竞价阶段拉抬打压控制', feKey: 'Z01201' },
  { code: 'Z01202', name: '连续竞价阶段拉抬打压且反向控制', feKey: 'Z01202' },
  { code: 'Z01301', name: '收盘集合竞价阶段拉抬打压控制', feKey: 'Z01301' },
  {
    code: 'Z01302',
    name: '收盘集合竞价阶段拉抬打压且反向控制',
    feKey: 'Z01302',
  },
  { code: 'Z01101', name: '开盘集合竞价阶段拉抬打压控制', feKey: 'Z01101' },
  {
    code: 'Z01102',
    name: '开盘集合竞价阶段拉抬打压且反向控制',
    feKey: 'Z01102',
  },
  {
    code: 'Z02',
    name: '严重异常波动标的申报速率控制',
    feKey: 'Z02',
  },
  {
    code: 'Z03000',
    name: '连续竞价阶段虚假申报控制（简化）',
    feKey: 'Z03000',
  },
  {
    code: 'Z03101',
    name: '开盘集合竞价阶段虚假申报控制',
    feKey: 'Z03101',
  },
  {
    code: 'Z03201',
    name: '连续竞价阶段虚假申报控制(创业板)',
    feKey: 'Z03201',
  },
  {
    code: 'Z03202',
    name: '连续竞价阶段虚假申报控制',
    feKey: 'Z03202',
  },
  {
    code: 'Z03203',
    name: '涨跌幅限制价位虚假申报控制',
    feKey: 'Z03203',
  },
  {
    code: 'Z04',
    name: '异常报撤单控制',
    feKey: 'Z04',
  },
  {
    code: 'Z05201',
    name: '连续竞价阶段维持涨跌幅限制价格控制',
    feKey: 'Z05201',
  },
  {
    code: 'Z05301',
    name: '收盘集合竞价阶段维持涨跌幅限制价格控制',
    feKey: 'Z05301',
  },
  { code: 'Z06001', name: '单日申报数量控制', feKey: 'Z06001' },
  { code: 'Z06002', name: '每秒申报数量控制', feKey: 'Z06002' },
  { code: 'Z06003', name: '频繁瞬时撤单控制', feKey: 'Z06003' },
  { code: 'Z06004', name: '频繁拉抬打压控制', feKey: 'Z06004' },
  { code: 'Z06005', name: '短时间大额成交控制', feKey: 'Z06005' },
  { code: 'Z06006', name: '瞬时申报速率异常控制', feKey: 'Z06006' },
  { code: 'Z06202', name: '瞬时申报速率控制', feKey: 'Z06202' },
  { code: 'Z06101', name: '单日申报数量控制', feKey: 'Z06101' },
  { code: 'Z06102', name: '每秒申报数量控制', feKey: 'Z06102' },
  { code: 'Z07201', name: '大量频繁回转交易控制', feKey: 'Z07201' },
  { code: 'Z07301', name: '频繁日内回转控制', feKey: 'Z07301' },
  { code: 'I1', name: '证券买卖控制', feKey: 'I1' },
  { code: 'I51', name: '证券禁买控制', feKey: 'I51' },
  { code: 'Q51000', name: '期货申报速率控制', feKey: 'Q51000' },
  { code: 'H1', name: '价格偏离度控制', feKey: 'H1' },
  { code: 'E01', name: '资产市值控制', feKey: 'E01' },
  { code: 'F1', name: '交易额控制', feKey: 'F1' },
  { code: 'F2', name: '资金前端控制', feKey: 'F2' },
  { code: 'J1', name: '同反向控制', feKey: 'J1' },
  { code: 'J2', name: '同反向控制(单向豁免)', feKey: 'J2' },
  { code: 'J3', name: '自买自卖或互为对手方控制', feKey: 'J3' },
  { code: 'J4', name: '自买自卖或互为对手方控制(单向豁免)', feKey: 'J4' },
  { code: 'A1', name: '证券持仓数量控制', feKey: 'A1' },
  { code: 'O01', name: '委托撤单比控制', feKey: 'O01' },
] as const;

/**
 * 规则关系类型
 */
export const RULE_RELATION_TYPES = [
  { code: '1', name: '互斥', feKey: 'MUTEX' },
  { code: '2', name: '联合', feKey: 'UNION' },
] as const;

/**
 * 规则检查时点
 */
export const RULE_CHECK_POINT_TYPES = [
  { code: 1, name: '事前风控', feKey: 'BEFORE' },
  { code: 2, name: '事中风控', feKey: 'DURING' },
] as const;

/**
 * 计算类型（拉抬打压）
 * - ruleParamType: 130
 */
export const LIFT_AND_SUPPRESSION_CALCULATION_TYPES = [
  { code: '1', name: '单边计算拉抬或打压', feKey: 'ONE_SIDE' },
  { code: '2', name: '拉抬和打压合并计算', feKey: 'COMBINED' },
] as const;

/**
 * 时间窗口
 * - ruleParamType: 47
 */
export const CALCULATION_TIME_WINDOW = [
  { code: '1', name: '1分钟', feKey: 'ONE' },
  { code: '2', name: '2分钟', feKey: 'TWO' },
  { code: '3', name: '3分钟', feKey: 'THREE' },
  { code: '4', name: '4分钟', feKey: 'FOUR' },
  { code: '5', name: '5分钟', feKey: 'FIVE' },
] as const;

/**
 * 反向时间窗口
 * - ruleParamType: 48
 */
export const REVERSE_CALCULATION_TIME_WINDOW = new Array(30)
  .fill(1)
  .map((_, index) => ({
    code: `${index + 1}`,
    name: `${index + 1}分钟`,
    feKey: `KEY_${index + 1}`,
  }));

/**
 * 拦截订单类型
 * - ruleParamType: 10002
 */
export const BLOCK_ORDER_TYPES = [
  { code: '1', name: '买报单', feKey: 'BUY_ORDER' },
  { code: '2', name: '卖报单', feKey: 'SELL_ORDER' },
  { code: '3', name: '买撤单', feKey: 'CANCEL_BUY_ORDER' },
  { code: '4', name: '卖撤单', feKey: 'CANCEL_SELL_ORDER' },
] as const;

/**
 * 委托方向
 * -ruleParamType: 4
 */
export const ENTRUST_DIRECTION = [
  { code: '1', name: '买', feKey: 'BUY_DIRECT' },
  { code: '2', name: '卖', feKey: 'SELL_DIRECT' },
];

/**
 * 委托类型
 * -ruleParamType: 76
 */
export const ENTRUST_TYPE = [
  { code: '1', name: '报单委托', feKey: 'ORDER_ENTRUST' },
  { code: '2', name: '撤单委托', feKey: 'CANCEL_ENTRUST' },
];

/**
 * 98-控制类型 1-频繁撤单控制、2-大额撤单控制、3-涨跌停价撤单控制
 */
export const CONTROL_TYPE = [
  { code: '1', name: '频繁撤单控制', feKey: 'FREQUENCY_CANCEL' },
  { code: '2', name: '大额撤单控制', feKey: 'LARGE_CANCEL' },
  { code: '3', name: '涨跌停价撤单控制', feKey: 'PRICE_CANCEL' },
];

/**
 * 99-大额认定条件 1-单笔撤手数占合约单笔最大可下单手数比例 2-单笔撤单手数
 */
export const IDENTIFY_CONDITION = [
  {
    code: '1',
    name: '单笔撤手数占合约单笔最大可下单手数比例',
    feKey: 'PERCENT',
  },
  {
    code: '2',
    name: '单笔撤单手数',
    feKey: 'COUNT',
  },
];

/**
 * 81-豁免价格类型
 */
export const EXEMPT_PRICE_TYPE = [
  { code: '0', name: '普通限价', feKey: 'KEY_0' },
  { code: '1', name: '普通市价', feKey: 'KEY_1' },
  { code: '2', name: '限价即成转撤(限价FOK)', feKey: 'KEY_2' },
  { code: '3', name: '限价即成剩撤(限价FAK)', feKey: 'KEY_3' },
  { code: '4', name: '市价即成转撤(市价FOK)', feKey: 'KEY_4' },
  { code: '5', name: '市价即成剩撤(市价FAK)', feKey: 'KEY_5' },
  { code: '6', name: '限价止盈', feKey: 'KEY_6', disabled: true },
  { code: '7', name: '限价止损', feKey: 'KEY_7', disabled: true },
  { code: '8', name: '市价止盈', feKey: 'KEY_8', disabled: true },
  { code: '9', name: '市价止损', feKey: 'KEY_9', disabled: true },
  { code: '10', name: '市价剩转限价', feKey: 'KEY_10' },
];

/** 证券控制方式 */
export const SECURITY_CONTROL_TYPES = [
  { code: '1', name: '证券类别', feKey: 'KEY_1' },
  { code: '2', name: '证券池', feKey: 'KEY_2' },
  { code: '3', name: '证券', feKey: 'KEY_3' },
  { code: '4', name: '动态维度', feKey: 'KEY_4' },
  { code: '6', name: '期货品种', feKey: 'KEY_6' },
  { code: '8', name: '期权品种', feKey: 'KEY_8' },
  { code: '9', name: '证券池类型', feKey: 'KEY_9' },
  { code: '10', name: '通用限仓', feKey: 'KEY_10' },
  { code: '11', name: '指数', feKey: 'KEY_11' },
] as const;

export const SECURITY_CONTROL_TYPES__MAP = {
  KEY_1: { code: '1', name: '证券类别' },
  KEY_2: { code: '2', name: '证券池' },
  KEY_3: { code: '3', name: '证券' },
  KEY_4: { code: '4', name: '动态维度' },
  KEY_6: { code: '6', name: '期货品种' },
  KEY_8: { code: '8', name: '期权品种' },
  KEY_9: { code: '9', name: '证券池类型' },
  KEY_10: { code: '10', name: '通用限仓' },
  KEY_11: { code: '11', name: '指数' },
} as const;
/** 分组 */
export const GROUP_CONTROL_TYPES__MAP = {
  KEY_1: { code: '1', name: '按同一发行人' },
  KEY_2: { code: '2', name: '按期货品种' },
  KEY_3: { code: '3', name: '按期权标的品种' },
  KEY_4: { code: '4', name: '按期权标的同一月份' },
  KEY_5: { code: '5', name: '按同一期权标的' },
} as const;
/** 分母 */
export const DENOM_TYPES__MAP = {
  KEY_9: { code: '9', name: '证券总股本' },
  KEY_10: { code: '10', name: '证券流通股本' },
  KEY_19: { code: '19', name: '债券发行余量' },
  KEY_20: { code: '20', name: '期货限仓数量' },
  KEY_27: { code: '27', name: '期权限仓数量' },
} as const;
/** 证券汇总方式 */
export const SECURITY_AGGREGATION_METHODS = [
  { code: '0', name: '单独计算', feKey: 'INDEPENDENTLY' },
  { code: '1', name: '汇总计算', feKey: 'TOGETHER' },
  { code: '2', name: '分组计算', feKey: 'BY_GROUP' },
] as const;

export const SECURITY_AGGREGATION__MAP = {
  INDEPENDENTLY: { code: '0', name: '单独计算' },
  TOGETHER: { code: '1', name: '汇总计算' },
  BY_GROUP: { code: '2', name: '分组计算' },
} as const;

/**
 * 交易市场
 * - ruleParamType:33
 */
export const TRADING_MARKETS = [
  { code: '-1', name: '不区分', feKey: 'KEY_MINUS_1' },
  { code: '1', name: '上交所', feKey: 'KEY_1' },
  { code: '2', name: '深交所', feKey: 'KEY_2' },
  { code: '3', name: '上期所', feKey: 'KEY_3' },
  { code: '4', name: '郑商所', feKey: 'KEY_4' },
  { code: '5', name: '银行间', feKey: 'KEY_5' },
  { code: '6', name: '场外', feKey: 'KEY_6' },
  { code: '7', name: '中金所', feKey: 'KEY_7' },
  { code: '8', name: '境外场外', feKey: 'KEY_8' },
  { code: '9', name: '大商所', feKey: 'KEY_9' },
  { code: '10', name: '股转市场', feKey: 'KEY_10' },
  { code: '11', name: '港交所', feKey: 'KEY_11' },
  { code: '12', name: '港期所', feKey: 'KEY_12' },
  { code: '33', name: '金交所', feKey: 'KEY_33' },
  { code: '34', name: '能源交易所', feKey: 'KEY_34' },
  { code: '35', name: '港股通(沪)', feKey: 'KEY_35' },
  { code: '36', name: '港股通(深)', feKey: 'KEY_36' },
  { code: '75', name: '沪股通', feKey: 'KEY_75' },
  { code: '76', name: '深股通', feKey: 'KEY_76' },
  { code: '105', name: '北交所', feKey: 'KEY_105' },
  { code: '107', name: '广期所', feKey: 'KEY_107' },
] as const;

/**
 * 证券品种类型
 */
export const SECURITY_CATEGORY_LEVEL_1 = [
  { code: '1', name: '股票', feKey: 'KEY_1' },
  { code: '2', name: '债券', feKey: 'KEY_2' },
  { code: '3', name: '基金', feKey: 'KEY_3' },
  { code: '4', name: '回购', feKey: 'KEY_4' },
  { code: '5', name: '期货', feKey: 'KEY_5' },
  { code: '6', name: '期权', feKey: 'KEY_6' },
  { code: '7', name: '指数', feKey: 'KEY_7' },
] as const;

/**
 * 证券类别
 */
export const SECURITY_CATEGORY_LEVEL_2 = [
  { code: '-1', name: '不区分', feKey: 'KEY_MINUS_1' },
  { code: '1', name: '股票', feKey: 'KEY_1' },
  { code: '2', name: '封闭式基金', feKey: 'KEY_2' },
  { code: '3', name: '国债', feKey: 'KEY_3' },
  { code: '4', name: '企债', feKey: 'KEY_4' },
  { code: '5', name: '可转债', feKey: 'KEY_5' },
  { code: '6', name: '政策性金融债', feKey: 'KEY_6' },
  { code: '9', name: '增发', feKey: 'KEY_9' },
  { code: '11', name: '开放式基金', feKey: 'KEY_11' },
  { code: '12', name: '非政策性金融债', feKey: 'KEY_12' },
  // { code: '14', name: '买断式回购', feKey: 'KEY_14' },
  { code: '16', name: '次级债', feKey: 'KEY_16' },
  { code: '17', name: '次级债务', feKey: 'KEY_17' },
  { code: '23', name: '股指期货', feKey: 'KEY_23' },
  { code: '24', name: '公司债', feKey: 'KEY_24' },
  { code: '25', name: '地方债', feKey: 'KEY_25' },
  { code: '27', name: '存托凭证', feKey: 'KEY_27' },
  { code: '28', name: '国债期货', feKey: 'KEY_28' },
  { code: '31', name: '债券认购', feKey: 'KEY_31' },
  { code: '33', name: '新股申购', feKey: 'KEY_33' },
  { code: '34', name: '债转股', feKey: 'KEY_34' },
  { code: '35', name: '配债', feKey: 'KEY_35' },
  { code: '36', name: '央行票据', feKey: 'KEY_36' },
  { code: '39', name: '配股', feKey: 'KEY_39' },
  { code: '42', name: '债券申购', feKey: 'KEY_42' },
  { code: '50', name: '商品期货', feKey: 'KEY_50' },
  { code: '51', name: '指数', feKey: 'KEY_51' },
  { code: '55', name: '单市场股票ETF', feKey: 'KEY_55' },
  { code: '56', name: '非净额结算公司债', feKey: 'KEY_56' },
  { code: '57', name: '跨境ETF', feKey: 'KEY_57' },
  { code: '58', name: '跨市场股票ETF', feKey: 'KEY_58' },
  { code: '59', name: '跨市场股票ETF(中登)', feKey: 'KEY_59' },
  { code: '60', name: '认购期权', feKey: 'KEY_60' },
  { code: '61', name: '认沽期权', feKey: 'KEY_61' },
  { code: '62', name: '私募债/非公开发行公司债', feKey: 'KEY_62' },
  { code: '63', name: '质押式回购', feKey: 'KEY_63' },
  { code: '65', name: '中期票据', feKey: 'KEY_65' },
  { code: '74', name: '资产支持证券', feKey: 'KEY_74' },
  { code: '76', name: '实时申赎货币基金', feKey: 'KEY_76' },
  { code: '77', name: '货币ETF', feKey: 'KEY_77' },
  { code: '80', name: 'ETF认购', feKey: 'KEY_80' },
  { code: '82', name: '实物债券ETF', feKey: 'KEY_82' },
  { code: '83', name: '现金债券ETF', feKey: 'KEY_83' },
  { code: '84', name: '黄金ETF', feKey: 'KEY_84' },
  { code: '85', name: '优先股', feKey: 'KEY_85' },
  { code: '94', name: '可分离公司债', feKey: 'KEY_94' },
  { code: '95', name: '可交换公司债', feKey: 'KEY_95' },
  { code: '101', name: '短期融资券', feKey: 'KEY_101' },
  { code: '102', name: '资产支持票据', feKey: 'KEY_102' },
  { code: '103', name: '集合债', feKey: 'KEY_103' },
  { code: '104', name: '集合票据', feKey: 'KEY_104' },
  { code: '105', name: '混合资本债', feKey: 'KEY_105' },
  { code: '106', name: '超短期融资券', feKey: 'KEY_106' },
  { code: '107', name: '深港通ETF', feKey: 'KEY_107' },
  { code: '108', name: '沪港通ETF', feKey: 'KEY_108' },
  // { code: '109', name: '协议式质押回购', feKey: 'KEY_109' },
  // { code: '115', name: '同业存单', feKey: 'KEY_115' },
  { code: '118', name: '存托凭证申购', feKey: 'KEY_118' },
  { code: '120', name: '存托凭证配股', feKey: 'KEY_120' },
  { code: '121', name: '存托凭证增发', feKey: 'KEY_121' },
  { code: '124', name: '政府支持债券', feKey: 'KEY_124' },
  { code: '125', name: '商品期货ETF', feKey: 'KEY_125' },
  { code: '129', name: '创新创业可转换债', feKey: 'KEY_129' },
  { code: '137', name: '现货实盘', feKey: 'KEY_137' },
  { code: '142', name: '沪深港/深沪港ETF', feKey: 'KEY_142' },
  { code: '155', name: 'Reits基金', feKey: 'KEY_155' },
  { code: '170', name: '沪深/深沪京ETF', feKey: 'KEY_170' },
  { code: '171', name: '沪深/深沪港京ETF', feKey: 'KEY_171' },
] as const;

/**
 * 业务平台
 */
export const BUSINESS_PLATFORM = [
  { code: '-1', name: '不区分', feKey: 'KEY_MINUS_1' },
  { code: '1', name: '上海竞价', feKey: 'KEY_1' },
  { code: '2', name: '上海大宗', feKey: 'KEY_2' },
  { code: '3', name: '上海固收', feKey: 'KEY_3' },
  { code: '4', name: '深圳竞价', feKey: 'KEY_4' },
  { code: '5', name: '深圳大宗', feKey: 'KEY_5' },
  { code: '6', name: '上期竞价', feKey: 'KEY_6' },
  { code: '7', name: '郑商竞价', feKey: 'KEY_7' },
  { code: '8', name: '银行间二级', feKey: 'KEY_8' },
  { code: '11', name: '中金竞价', feKey: 'KEY_11' },
  { code: '13', name: '大商竞价', feKey: 'KEY_13' },
  { code: '14', name: '股转竞价', feKey: 'KEY_14' },
  { code: '15', name: '港交所竞价', feKey: 'KEY_15' },
  { code: '38', name: '能源竞价', feKey: 'KEY_38' },
  { code: '45', name: '深圳固收', feKey: 'KEY_45' },
  { code: '49', name: '北京竞价', feKey: 'KEY_49' },
  { code: '52', name: '广期竞价', feKey: 'KEY_52' },
  { code: '53', name: '北京固收', feKey: 'KEY_53' },
] as const;

/**
 * 规则控制维度
 */
export const RULE_CONTROL_DIM = [
  { code: '1', name: '管理账户', feKey: 'BY_MANAGEMNT_ACCOUNT' },
  { code: '2', name: '交易账户', feKey: 'BY_TRADING_ACCOUNT' },
  { code: '3', name: '对接系统', feKey: 'BY_INTERGRATE_SYSTEM' },
  { code: '4', name: '席位组', feKey: 'BY_SEAT_GROUP' },
  { code: '5', name: '账户组', feKey: 'BY_ACCT_GROUP' },
] as const;

/**
 * 维度控制类型
 */
export const DIMENSION_CONTROL_TYPES = [
  { code: '0', name: '单独控制', feKey: 'INDEPENDENT' },
  { code: '1', name: '联合控制', feKey: 'UNION' },
  { code: '2', name: '单独控制+联合控制', feKey: 'INDEPENDENT_AND_UNION' },
] as const;

/**
 * 维度控制类型
 */
export const DIMENSION_CONTROL_TYPES__MAP = {
  INDEPENDENT: { code: '0', name: '单独控制' },
  UNION: { code: '1', name: '联合控制' },
  INDEPENDENT_AND_UNION: {
    code: '2',
    name: '单独控制+联合控制',
  },
} as const;
/**
 * 证券池类型
 */
export const SECU_POOL_TYPES = [
  { code: 1, name: '投资证券池', feKey: 'INVEST_POOL' },
  { code: 2, name: '限制证券池', feKey: 'LIMIT_POOL' },
  { code: 3, name: '禁止证券池', feKey: 'BAN_POOL' },
] as const;
/** 委托方向 */
export const ENTRUST_DIRECTION_TYPES = [
  { code: '1', name: '买', feKey: 'KEY_1' },
  { code: '2', name: '卖', feKey: 'KEY_2' },
  { code: '5', name: '买入开仓', feKey: 'KEY_5' },
  { code: '8', name: '买入平仓', feKey: 'KEY_8' },
  { code: '7', name: '卖出开仓', feKey: 'KEY_7' },
  { code: '6', name: '卖出平仓', feKey: 'KEY_6' },
  {
    code: '13',
    name: '期权看涨（认购买开+认购卖平+认沽卖开+认沽买平）',
    feKey: 'KEY_13',
  },
  {
    code: '14',
    name: '期权看跌（认购买平+认购卖开+认沽买开+认沽卖平）',
    feKey: 'KEY_14',
  },
] as const;
/**
 * 流程状态
 */
export const PROCEDURE_STATUS = [
  { code: '1', name: '待审批', feKey: 'KEY_2' },
  { code: '2', name: '已办结', feKey: 'KEY_3' },
  { code: '3', name: '已终止', feKey: 'KEY_4' },
] as const;
/**
 * 流程类型参数
 */
export const PROCEDURE_TYPE = [
  { code: '1', name: '风控复核', feKey: 'KEY_1' },
] as const;

/** 持仓类型 */
export const POSITION_TYPE = [
  { code: '1', name: '多仓', feKey: '1' },
  { code: '2', name: '空仓', feKey: '2' },
  { code: 'g', name: '权利仓', feKey: 'g' },
  { code: 'h', name: '义务仓', feKey: 'h' },
] as const;

/** 调整类型 */
export const ADJUST_TYPE = [
  { code: '0', name: '持仓数量', feKey: '0' },
  { code: '1', name: '质押数量', feKey: '1' },
] as const;
/**
 * 每种字典 feKey 的枚举，前端代码中使用这个编码去获取具体字典值
 */
export interface DictFeKeyEnumType {
  /** 操作类型 */
  OPERATION_TYPES: ValueTypeAtKey<typeof OPERATION_TYPES, 'feKey'>;
  /** 比较方向 */
  COMPARE_DIRECTIONS: ValueTypeAtKey<typeof COMPARE_DIRECTIONS, 'feKey'>;
  /** 触警动作 */
  ALARM_REACTIONS: ValueTypeAtKey<typeof ALARM_REACTIONS, 'feKey'>;
  /** 单位 */
  UNITS: ValueTypeAtKey<typeof UNITS, 'feKey'>;
  /** 规则状态 */
  RULE_STATUSES: ValueTypeAtKey<typeof RULE_STATUSES, 'feKey'>;
  /** 一级规则类型 */
  RULE_TYPE_LEVEL_1: ValueTypeAtKey<typeof RULE_TYPE_LEVEL_1, 'feKey'>;
  /** 二级规则类型 */
  RULE_TYPE_LEVEL_2: ValueTypeAtKey<typeof RULE_TYPE_LEVEL_2, 'feKey'>;
  /** 规则关系类型 */
  RULE_RELATION_TYPES: ValueTypeAtKey<typeof RULE_RELATION_TYPES, 'feKey'>;
  /** 规则检查时点 */
  RULE_CHECK_POINT_TYPES: ValueTypeAtKey<
    typeof RULE_CHECK_POINT_TYPES,
    'feKey'
  >;
  /**
   * 计算类型（拉抬打压）
   * - ruleParamType: 130
   */
  LIFT_AND_SUPPRESSION_CALCULATION_TYPES: ValueTypeAtKey<
    typeof LIFT_AND_SUPPRESSION_CALCULATION_TYPES,
    'feKey'
  >;
  /**
   * 时间窗口
   * - ruleParamType: 47
   */
  CALCULATION_TIME_WINDOW: ValueTypeAtKey<
    typeof CALCULATION_TIME_WINDOW,
    'feKey'
  >;
  /**
   * 拦截订单类型
   * - ruleParamType: 10002
   */
  BLOCK_ORDER_TYPES: ValueTypeAtKey<typeof BLOCK_ORDER_TYPES, 'feKey'>;
  /**
   * 委托方向
   * - ruleParamType: 4
   */
  ENTRUST_DIRECTION: ValueTypeAtKey<typeof ENTRUST_DIRECTION, 'feKey'>;
  /**
   * 证券控制方式
   */
  SECURITY_CONTROL_TYPES: ValueTypeAtKey<
    typeof SECURITY_CONTROL_TYPES,
    'feKey'
  >;
  /**
   * 证券汇总方式
   */
  SECURITY_AGGREGATION_METHODS: ValueTypeAtKey<
    typeof SECURITY_AGGREGATION_METHODS,
    'feKey'
  >;
  /**
   * 交易市场
   */
  TRADING_MARKETS: ValueTypeAtKey<typeof TRADING_MARKETS, 'feKey'>;
  /**
   * 证券品种类型 - 一级分类
   */
  SECURITY_CATEGORY_LEVEL_1: ValueTypeAtKey<
    typeof SECURITY_CATEGORY_LEVEL_1,
    'feKey'
  >;
  /**
   * 证券类别 - 二级分类
   */
  SECURITY_CATEGORY_LEVEL_2: ValueTypeAtKey<
    typeof SECURITY_CATEGORY_LEVEL_2,
    'feKey'
  >;
  /**
   * 规则控制维度
   */
  RULE_CONTROL_DIM: ValueTypeAtKey<typeof RULE_CONTROL_DIM, 'feKey'>;
  /**
   * 维度控制类型
   */
  DIMENSION_CONTROL_TYPES: ValueTypeAtKey<
    typeof DIMENSION_CONTROL_TYPES,
    'feKey'
  >;
  /**
   *   证券池类型
   */
  SECU_POOL_TYPES: ValueTypeAtKey<typeof SECU_POOL_TYPES, 'feKey'>;
}

/**
 * 每种字典 code 的枚举，用于类型定义，不要在前端代码中直接消费
 */
export interface DictCodeEnumType {
  /** 操作类型 */
  OPERATION_TYPES: ValueTypeAtKey<typeof OPERATION_TYPES, 'code'>;
  /** 比较方向 */
  COMPARE_DIRECTIONS: ValueTypeAtKey<typeof COMPARE_DIRECTIONS, 'code'>;
  /** 触警动作 */
  ALARM_REACTIONS: ValueTypeAtKey<typeof ALARM_REACTIONS, 'code'>;
  /** 单位 */
  UNITS: ValueTypeAtKey<typeof UNITS, 'code'>;
  /** 规则状态 */
  RULE_STATUSES: ValueTypeAtKey<typeof RULE_STATUSES, 'code'>;
  /** 一级规则类型 */
  RULE_TYPE_LEVEL_1: ValueTypeAtKey<typeof RULE_TYPE_LEVEL_1, 'code'>;
  /** 二级规则类型 */
  RULE_TYPE_LEVEL_2: ValueTypeAtKey<typeof RULE_TYPE_LEVEL_2, 'code'>;
  /** 规则关系类型 */
  RULE_RELATION_TYPES: ValueTypeAtKey<typeof RULE_RELATION_TYPES, 'code'>;
  /** 规则检查时点 */
  RULE_CHECK_POINT_TYPES: ValueTypeAtKey<typeof RULE_CHECK_POINT_TYPES, 'code'>;
  /**
   * 计算类型（拉抬打压）
   * - ruleParamType: 130
   */
  LIFT_AND_SUPPRESSION_CALCULATION_TYPES: ValueTypeAtKey<
    typeof LIFT_AND_SUPPRESSION_CALCULATION_TYPES,
    'code'
  >;
  /**
   * 时间窗口
   * - ruleParamType: 47
   */
  CALCULATION_TIME_WINDOW: ValueTypeAtKey<
    typeof CALCULATION_TIME_WINDOW,
    'code'
  >;
  /**
   * 拦截订单类型
   * - ruleParamType: 10002
   */
  BLOCK_ORDER_TYPES: ValueTypeAtKey<typeof BLOCK_ORDER_TYPES, 'code'>;
  /**
   * 委托方向
   * - ruleParamType: 4
   */
  ENTRUST_DIRECTION: ValueTypeAtKey<typeof ENTRUST_DIRECTION, 'code'>;
  /**
   * 证券控制方式
   */
  SECURITY_CONTROL_TYPES: ValueTypeAtKey<typeof SECURITY_CONTROL_TYPES, 'code'>;
  /**
   * 证券汇总方式
   */
  SECURITY_AGGREGATION_METHODS: ValueTypeAtKey<
    typeof SECURITY_AGGREGATION_METHODS,
    'feKey'
  >;
  /**
   * 交易市场
   */
  TRADING_MARKETS: ValueTypeAtKey<typeof TRADING_MARKETS, 'code'>;
  /**
   * 证券品种类型 - 一级分类
   */
  SECURITY_CATEGORY_LEVEL_1: ValueTypeAtKey<
    typeof SECURITY_CATEGORY_LEVEL_1,
    'code'
  >;
  /**
   * 证券类别 - 二级分类
   */
  SECURITY_CATEGORY_LEVEL_2: ValueTypeAtKey<
    typeof SECURITY_CATEGORY_LEVEL_2,
    'code'
  >;
  /**
   * 规则控制维度
   */
  RULE_CONTROL_DIM: ValueTypeAtKey<typeof RULE_CONTROL_DIM, 'code'>;
  /**
   * 维度控制类型
   */
  DIMENSION_CONTROL_TYPES: ValueTypeAtKey<
    typeof DIMENSION_CONTROL_TYPES,
    'code'
  >;
  /**
   * 证券池类型
   */
  SECU_POOL_TYPES: ValueTypeAtKey<typeof SECU_POOL_TYPES, 'code'>;
  DATA_TYPES: ValueTypeAtKey<typeof DATA_TYPES, 'code'>;
}

export const transformDictCodeToNameHelper = (
  code: string | number,
  dict: readonly { code: string | number; name: string }[]
) => {
  return dict.find((item) => item.code === code)?.name || '';
};

export const transformDictFeKeyToCodeHelper = (
  feKey: string,
  dict: readonly { code: string; name: string; feKey: string }[]
) => {
  return dict.find((item) => item.feKey === feKey)?.code || '';
};
/* eslint-enable max-lines */

export interface SecurityCategoryItem {
  name: string;
  code: string;
  children?: SecurityCategoryItem[];
}

export const SECURITY_CATEGORY_LEVEL: SecurityCategoryItem[] = [
  {
    name: '股票',
    code: '10',
    children: [
      { name: '普通股票', code: '1001' },
      { name: '存托凭证', code: '1002' },
      { name: '优先股', code: '1003' },
      { name: '其他股票', code: '1099' },
    ],
  },
  {
    name: '债券',
    code: '11',
    children: [
      { name: '国债', code: '1101' },
      { name: '地方政府债', code: '1102' },
      { name: '央行票据', code: '1103' },
      {
        name: '金融债类',
        code: '1104',
        children: [
          { name: '政策性普通金融债', code: '110401' },
          { name: '非政策性普通金融债', code: '110402' },
          { name: '次级债', code: '110403' },
          { name: '混合资本债', code: '110404' },
        ],
      },
      {
        name: '企业债类',
        code: '1105',
        children: [
          { name: '一般企业债', code: '110501' },
          { name: '中期票据', code: '110502' },
          { name: '短期融资券', code: '110503' },
          { name: '超短期融资券', code: '110504' },
          { name: '集合企业债', code: '110505' },
          { name: '集合票据', code: '110506' },
        ],
      },
      {
        name: '公司债类',
        code: '1106',
        children: [
          { name: '一般公司债', code: '110601' },
          { name: '非公开发行公司债', code: '110602' },
        ],
      },
      {
        name: '可转债类',
        code: '1107',
        children: [
          { name: '一般可转债', code: '110701' },
          { name: '可分离债', code: '110702' },
          { name: '可交换债', code: '110703' },
        ],
      },
      {
        name: '资产支持证券类',
        code: '1108',
        children: [
          { name: '资产支持证券', code: '110801' },
          { name: '资产支持票据', code: '110802' },
        ],
      },
      {
        name: '非公开定向债务融资工具',
        code: '1109',
      },
      {
        name: '其他债券',
        code: '1199',
      },
    ],
  },
  {
    name: '基金',
    code: '12',
    children: [
      {
        name: '封闭式基金类',
        code: '1201',
        children: [
          { name: '封闭式基金', code: '120101' },
          { name: 'REITs基金', code: '120102' },
        ],
      },
      {
        name: '开放式基金',
        code: '1202',
        children: [
          { name: '普通开放式基金', code: '120201' },
          {
            name: 'ETF基金',
            code: '120202',
            children: [
              {
                name: '股票ETF',
                code: '12020201',
                children: [
                  { name: '单市场ETF', code: '1202020101' },
                  { name: '跨市场ETF', code: '1202020102' },
                ],
              },
              {
                name: '债券ETF',
                code: '12020202',
                children: [
                  { name: '实物债券ETF', code: '1202020201' },
                  { name: '现金债券ETF', code: '1202020202' },
                ],
              },
              { name: '货币ETF', code: '12020203' },
              { name: '商品ETF', code: '12020204' },
              { name: '黄金ETF', code: '12020205' },
              { name: '跨境ETF', code: '12020206' },
            ],
          },
        ],
      },
      { name: '理财产品', code: '1203' },
      { name: '信托计划', code: '1204' },
      { name: '资管计划', code: '1205' },
      { name: '其他基金', code: '1299' },
    ],
  },
  {
    name: '期货',
    code: '13',
    children: [
      { name: '股指期货', code: '1301' },
      { name: '国债期货', code: '1302' },
      { name: '商品期货', code: '1303' },
      { name: '指数期货', code: '1304' },
      { name: '外汇期货', code: '1305' },
      { name: '其他期货', code: '1399' },
    ],
  },
  {
    name: '期权',
    code: '14',
    children: [
      { name: '股指期权', code: '1401' },
      { name: '商品期权', code: '1402' },
      { name: '股票期权', code: '1403' },
      { name: 'ETF期权', code: '1404' },
      { name: '国债期权', code: '1405' },
      { name: '其他期权', code: '1499' },
    ],
  },
  {
    name: '回购',
    code: '15',
    children: [
      { name: '质押式回购', code: '1501' },
      { name: '买断式回购', code: '1502' },
      { name: '其他回购', code: '1599' },
    ],
  },
  {
    name: '指数',
    code: '16',
    children: [{ name: '指数', code: '1601' }],
  },
  {
    name: '贵金属',
    code: '17',
    children: [
      { name: '现货实盘', code: '1701' },
      { name: '现货延期', code: '1702' },
      { name: '现货即期', code: '1703' },
      { name: '其他贵金属', code: '1799' },
    ],
  },
];

// 获取下级所有节点
const getAllChildrenNodes = (
  node: SecurityCategoryItem
): SecurityCategoryItem[] => {
  let nodes: SecurityCategoryItem[] = [];
  if (node.children) {
    for (const item of node.children) {
      nodes = [...nodes, item, ...getAllChildrenNodes(item)];
    }
    return nodes;
  } else {
    return nodes;
  }
};

// 遍历叶子节点
const traversalNodes = (
  node: SecurityCategoryItem,
  refer: string[]
): SecurityCategoryItem[] => {
  if (refer.includes(node.code)) {
    if (node.children) {
      return getAllChildrenNodes(node);
    } else {
      return [node];
    }
  }
  if (node.children) {
    let nodes: SecurityCategoryItem[] = [];
    for (const item of node.children) {
      nodes = [...nodes, ...traversalNodes(item, refer)];
    }
    return nodes;
  }
  return [];
};

// 获取叶子节点
export const getReferNodes = (refer: string[]) => {
  let nodes: SecurityCategoryItem[] = [];
  for (const item of SECURITY_CATEGORY_LEVEL) {
    nodes = [...nodes, ...traversalNodes(item, refer)];
  }
  return nodes.filter((i) => !i.children);
};