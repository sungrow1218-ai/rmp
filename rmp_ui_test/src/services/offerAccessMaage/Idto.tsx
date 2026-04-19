import { RequestParameterPagination } from '../typing';

export interface ExchangeGateWayDataTypeIDTO {
  /** 交易所网关编号 */
  tgwId: number;
  tgwAgentId: number;
  marketId: number;
  /** 报盘通道类型 */
  offerChannelType: number;

  /** tgw服务ip */
  tgwServerIp: string;

  /** tgw服务端口 */
  tgwServerPort: number;

  /** 发送方标识 */
  senderId: string;

  /** 接收方标识 */
  targetId: string;

  /**  应用版本号 */
  appVersion: string;

  /** 登录密码 */
  loginPassword: string;

  /** 执行报告补缺个数 */
  executionReportCount: number;

  /** 心跳间隔 */
  heartBeatInterval: number;

  /** 备注 */
  remark: string;

  /** 创建人 */
  createUserCode: string;

  /** 修改人 */
  updateUserCode: string;
  /** 创建时间 */
  createDateTime: string;
  /** 修改时间 */
  lastUpdateTime: string;
}

export interface ConfigExchangeGateWayParamsIDTO {
  modifyType: number;
  operaterCode?: string;
  terminalInfo?: string;
  /** 交易所网关编号 */
  tgwId?: number;
  marketId: number;
  /** 报盘通道类型 */
  offerChannelType: number;

  /** tgw服务ip */
  tgwServerIp: string;

  /** tgw服务端口 */
  tgwServerPort: number;

  /** 发送方标识 */
  senderId: string;

  /** 接收方标识 */
  targetId: string;

  /**  应用版本号 */
  appVersion: string;

  /** 登录密码 */
  loginPassword?: string;

  /** 执行报告补缺个数 */
  executionReportCount?: number;

  /** 心跳间隔 */
  heartBeatInterval: number;

  /** 备注 */
  remark?: string;
}

export interface VirtualGateWayParamsIDTO extends RequestParameterPagination {
  filterCondition?: VirtualCondition;
}
export type VirtualCondition =
  | {
      virtualTgwId?: number;
      virtualTgwName?: string;
      virtualServerPort?: number;
      tradeSystemId?: number;
      tradeSubSystemId?: number;
      toRiskFlag?: number;
    }
  | undefined;

export interface VirtualGateWayDataTypeIDTO {
  tgwAgentId: number;
  /** 虚拟交易网关编号 */
  virtualTgwId: number;
  /** 虚拟交易网关名称 */
  virtualTgwName: string;
  /** 虚拟通道服务端口 */
  virtualServerPort: number;

  /** 对接系统号 */
  tradeSystemId: number;

  /** 子系统号 */
  tradeSubSystemId: number;

  /** 开始订单编号 */
  beginOrderId: string;

  /** 结束订单编号 */
  endOrderId: string;

  /**  联合风控调用标志 */
  toRiskFlag: number;

  /** tgw协议类型 */
  tgwProtocolType: number;

  /** 备注 */
  remark: string;

  /** 创建人 */
  createUserCode: string;

  /** 修改人 */
  updateUserCode: string;
  /** 创建时间 */
  createDateTime: string;
  /** 修改时间 */
  lastUpdateTime: string;
}

// 配置虚拟网关
export interface configVirtualGateWayParamsIDTO {
  modifyType: number;
  operaterCode?: string;
  terminalInfo?: string;
  virtualTgwId: number;
  /** 虚拟交易网关名称 */
  virtualTgwName: string;
  /** 虚拟通道服务端口 */
  virtualServerPort: number;
  tradeSystemId: number;
  tradeSubSystemId: number;
  beginOrderId: string;
  endOrderId: string;
  toRiskFlag: number;
  tgwProtocolType: number;
  remark?: string;
}

// 报盘路由查询

export interface VirtualTGWRouterDataTypeIDTO {
  /** 路由编号 */
  routerId: number;
  tgwAgentId: number;

  /** 是否可用标志 */
  enableFlag: string;
  /** 备注 */
  remark: string;

  /** 创建人 */
  createUserCode: string;

  /** 修改人 */
  updateUserCode: string;
  /** 创建时间 */
  createDateTime: string;
  /** 修改时间 */
  lastUpdateTime: string;
  virtualTgw: {
    virtualTgwId: number;
    /** 虚拟交易网关名称 */
    virtualTgwName: string;
    /** 虚拟通道服务端口 */
    virtualServerPort: number;
    tradeSystemId: number;
    tradeSubSystemId: number;

    /** 开始订单编号 */
    beginOrderId: string;

    /** 结束订单编号 */
    endOrderId: string;

    /**  联合风控调用标志 */
    toRiskFlag: number;

    /** tgw协议类型 */
    tgwProtocolType: number;

    /** 备注 */
    remark: string;
  };
  tgw: {
    tgwId: number;
    tgwAgentId: number;
    marketId: number;
    /** 报盘通道类型 */
    offerChannelType: number;

    /** tgw服务ip */
    tgwServerIp: string;

    /** tgw服务端口 */
    tgwServerPort: number;

    /** 发送方标识 */
    senderId: string;

    /** 接收方标识 */
    targetId: string;

    /**  应用版本号 */
    appVersion: string;

    /** 登录密码 */
    loginPassword?: string;

    /** 执行报告补缺个数 */
    executionReportCount: number;

    /** 备注 */
    remark: string;
  };
}
