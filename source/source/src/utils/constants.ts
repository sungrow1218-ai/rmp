// 向后兼容的常量导出文件
// 这个文件重新导出所有字典，同时保留原有的常量定义

// 导出所有字典
export * from './dicts';

// 保留原有的常量定义
export const COOKIE_TOKEN_KEY = 'risk-manage-token';

export const RULE_CODE_NAME_MAP_Z06 = {
  Z06001: '单日申报数量控制',
  Z06002: '每秒申报数量控制',
  Z06003: '频繁瞬时撤单控制',
  Z06004: '频繁拉抬打压控制',
  Z06005: '短时间大额成交控制',
  Z06006: '瞬时申报速率异常控制',
} as const;

export const RULE_CODE_NAME_MAP_MAIN = {
  Z06: '程序化监管新规',
} as const;

export const KEEPALIVE_CACHE_KEY = {
  /**
   * 风控触警查询
   */
  RISK_CONTROL_ALARM: 'riskControlAlarm',
  /**
   * 委托查询
   */
  ENTRUST: 'entrust',
  /**
   * 动态维度
   */
  DYNAMIC_DIMENSION: 'dynamicDimension',
  /**
   * 证券池管理
   */
  SECURITY_POOL: 'securityPool',
  /**
   * 角色管理
   */
  ROLE_MANAGE: 'roleManage',
  /**
   * 规则设置
   */
  RULE_SETTING: 'ruleSetting',
  /**
   * 期货期权设置
   */
  FUTURES_OPTIONS: 'futuresOption',
  /**
   * 通用限仓
   */
  GENERAL_LIMIT: 'generalLimit',
  /**
   * 流程管理
   */
  PROCESS_MANAGE: 'processManage',
  /**
   * 席位组管理
   */
  SEAT_GROUP: 'seatGroup',
  /**
   * 规则豁免管理
   */
  RULE_EXEMPTIONS: 'ruleExemptions',
  /**
   * 挂单查询
   */
  PENDING_ENTRUST: 'pendingEntrust',
  /**
   * 持仓查询
   */
  POSITION: 'position',
  /**
   * 账户组
   */
  ACCOUNT_GROUP: 'accountGroup',
  /**
   * 报盘段接入管理
   */
  OFFER_ACCESS_MANAGE: 'offerAccessManage',
} as const;

// 这部分 CacheKey 是动态的，需要根据 workGroupId 来动态拼接生成
export const KEEPALIVE_CACHE_KEY_PREFIX = {
  /**
   * 规则设置
   */
  // RULE_SETTING: 'ruleSetting',
  /**
   * 风控触警
   */
  // RISK_CONTROL_ALARM: 'riskControlAlarm',
  NONE: 'none',
} as const;

/**
 * 非固定 menuPath，而只是前缀固定功能对应的 cachekey 映射，规则为 /menuPathPrefix/xxx
 */
export const DYNAMIC_MENU_PATH_PREFIX_TO_CACHE_KEY = {
  /**
   * 规则管理 | 规则配置
   */
  // '/rule/ruleSetting/:workGroupId': KEEPALIVE_CACHE_KEY_PREFIX.RULE_SETTING,
  /**
   * 风控触警
   */
  // '/operations/riskControlAlarm/:workGroup':
  // KEEPALIVE_CACHE_KEY_PREFIX.RISK_CONTROL_ALARM,
};

/**
 * 固定 menuPath 功能对应的 cachekey 映射
 */
export const FIXED_MENU_PATH_TO_CACHE_KEY_MAP = {
  /**
   * 规则管理 | 动态维度
   */
  '/rule/dynamicDimension': 'dynamicDimension',
  /**
   * 规则管理 | 证券池管理
   */
  '/rule/securityPool': 'securityPool',
  /**
   * 综合查询 | 监控触警查询
   */
  '/operations/riskControlAlarm': 'riskControlAlarm',
  /**
   * 运维管理 | 委托查询
   */
  '/inquiry/entrustInquiry': 'entrust',
  /**
   * 运维管理 | 挂单查询
   */
  '/inquiry/pendingEntrust': 'pendingEntrust',
  /**
   * 运维管理 | 持仓查询
   */
  '/inquiry/position': 'position',
  /**
   * 运维管理 | 报盘端接入管理
   */
  '/inquiry/offerAccessManage': 'position',

  /**
   *  规则管理 | 规则配置
   */
  '/rule/ruleSetting': 'ruleSetting',
  /**
   *  规则设置 | 期货期权设置
   */
  '/rule/futureOptionLImit': 'futuresOption',
  /**
   *  规则设置 | 通用限仓设置
   */
  '/rule/generalLimit': 'generalLimit',
  /**
   *  规则设置 | 席位组管理
   */
  '/rule/seatGroup': 'seatGroup',
  /**
   * 事务管理 | 流程管理
   */
  '/affairs/processManage': 'processManage',
  /**
   * 事务管理 | 规则豁免管理
   */
  '/affairs/ruleApproveExempt': 'ruleExemptions',
};