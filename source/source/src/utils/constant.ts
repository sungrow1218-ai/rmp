export const COOKIE_TOKEN_KEY = 'risk-manage-token';

/**
 * HTTP 状态码对应的错误消息
 */
export const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 自定义错误码
 */
export enum CustomCode {
  NO_AUTH = 30000,
  TOKEN_EXPIRED = 90005,
}

/**
 * 自定义错误码对应的消息
 */
export const customCodeMessage: Record<number, string> = {
  [CustomCode.NO_AUTH]: '无操作权限',
  [CustomCode.TOKEN_EXPIRED]: 'token过期，请重新登录',
};

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
  // '/operations/riskControlAlarm/:workGroupId':
  // KEEPALIVE_CACHE_KEY_PREFIX.RISK_CONTROL_ALARM,
};

/**
 * 固定 menuPath 功能对应的 cachekey 映射
 */
export const FIXED_MENU_PATH_TO_CACHE_KEY_MAP = {
  /**
   * 规则管理 | 动态维度
   */
  '/rule/dynamicDimension': KEEPALIVE_CACHE_KEY.DYNAMIC_DIMENSION,
  /**
   * 规则管理 | 证券池管理
   */
  '/rule/securityPool': KEEPALIVE_CACHE_KEY.SECURITY_POOL,
  /**
   * 综合查询 | 监控触警查询
   */
  '/operations/riskControlAlarm': KEEPALIVE_CACHE_KEY.RISK_CONTROL_ALARM,
  /**
   * 运维管理 | 委托查询
   */
  '/inquiry/entrustInquiry': KEEPALIVE_CACHE_KEY.ENTRUST,
  /**
   * 运维管理 | 挂单查询
   */
  '/inquiry/pendingEntrust': KEEPALIVE_CACHE_KEY.PENDING_ENTRUST,
  /**
   * 运维管理 | 持仓查询
   */
  '/inquiry/position': KEEPALIVE_CACHE_KEY.POSITION,
  /**
   * 运维管理 | 报盘端接入管理
   */
  '/inquiry/offerAccessManage': KEEPALIVE_CACHE_KEY.POSITION,

  /**
   *  规则管理 | 规则配置
   */
  '/rule/ruleSetting': KEEPALIVE_CACHE_KEY.RULE_SETTING,
  /**
   *  规则设置 | 期货期权设置
   */
  '/rule/futureOptionLImit': KEEPALIVE_CACHE_KEY.FUTURES_OPTIONS,
  /**
   *  规则设置 | 通用限仓设置
   */
  '/rule/generalLimit': KEEPALIVE_CACHE_KEY.GENERAL_LIMIT,
  /**
   *  规则设置 | 席位组管理
   */
  '/rule/seatGroup': KEEPALIVE_CACHE_KEY.SEAT_GROUP,
  /**
   * 事务管理 | 流程管理
   */
  '/affairs/processManage': KEEPALIVE_CACHE_KEY.PROCESS_MANAGE,
  /**
   * 事务管理 | 规则豁免管理
   */
  '/affairs/ruleApproveExempt': KEEPALIVE_CACHE_KEY.RULE_EXEMPTIONS,
};
