import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import {
  type CommonResponseWrapper,
  type RequestParameterPagination,
  type ResponseParameterPagination,
} from '../typing';
import {
  ExchangeGateWayDataTypeIDTO,
  VirtualGateWayDataTypeIDTO,
  VirtualTGWRouterDataTypeIDTO,
} from './Idto';
import {
  parseConfigExchangeGateWayParams,
  parseConfigVirtualGateWay,
  parseExchangeGateWay,
  parseQueryVirtualGateWayParams,
  parseVirtualGateWay,
  parseVirtualTGWRoute,
} from './parse';

export interface ExchangeGateWayParams extends RequestParameterPagination {
  filterCondition?: Condition;
}
export type Condition =
  | {
      tgwId?: number;
      marketId?: number[];
    }
  | undefined;
interface ExchangeGateWayResponse extends ResponseParameterPagination {
  resultList: ExchangeGateWayDataType[];
}

export interface ExchangeGateWayDataType {
  /** 交易所网关编号 */
  tgwId: number;
  tgwAgentId: number;
  marketId: number;
  /** 报盘通道类型 */
  offerChannelType: number;

  /** tgw服务ip */
  tgwSvrIp: string;

  /** tgw服务端口 */
  tgwSvrPort: number;

  /** 发送方标识 */
  senderCompId: string;

  /** 接收方标识 */
  targetCompId: string;

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

/**
  交易所网关信息查询
 */
export async function queryExchangeGateWay(params: ExchangeGateWayParams) {
  return parseRequestByPage<
    ExchangeGateWayDataTypeIDTO,
    ExchangeGateWayDataType
  >(
    request(`/aegis/api/tgwAgentManager/queryExchangeGateWay`, {
      method: 'POST',
      data: params,
    }),
    parseExchangeGateWay
  );
}

/** 交易所网关配置 */
export async function configExchangeGateWay(
  params: ConfigExchangeGateWayParams
) {
  return parseRequest<any>(
    request(`/aegis/api/tgwAgentManager/configExchangeGateWay`, {
      method: 'POST',
      data: parseConfigExchangeGateWayParams(params),
    })
  );
}

export interface ConfigExchangeGateWayParams {
  alterType: number;
  operaterCode?: string;
  terminalInfo?: string;
  /** 交易所网关编号 */
  tgwId?: number;
  marketId: number;
  /** 报盘通道类型 */
  offerChannelType: number;

  /** tgw服务ip */
  tgwSvrIp: string;

  /** tgw服务端口 */
  tgwSvrPort: number;

  /** 发送方标识 */
  senderCompId: string;

  /** 接收方标识 */
  targetCompId: string;

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

/** 交易所网关状态查询 */
export async function queryExchangeGateWayStatus(params: {
  tgwAgentId: number[];
}) {
  return parseRequest<ExchangeGateWayStatusResponse>(
    request(`/aegis/api/tgwAgentManager/queryExchangeGateWayLinkStatus`, {
      method: 'POST',
      data: params,
    })
  );
}

interface ExchangeGateWayStatusResponse extends ResponseParameterPagination {
  resultList: ExchangeGateWayStatusDataType[];
}
export interface ExchangeGateWayStatusDataType {
  tgwId: number;
  tgwLinkStatus: number;
}

/* 虚拟网关查询 */
export interface VirtualGateWayParams extends RequestParameterPagination {
  filterCondition?: VirtualCondition;
}
export type VirtualCondition =
  | {
      virtualTgwId?: number;
      virtualTgwName?: string;
      virtualSvrPort?: number;
      extSysId?: number;
      extSubsysId?: number;
      toRiskFlag?: number;
    }
  | undefined;
interface VirtualGateWayResponse extends ResponseParameterPagination {
  resultList: VirtualGateWayDataType[];
}

export interface VirtualGateWayDataType {
  tgwAgentId: number;
  /** 虚拟交易网关编号 */
  virtualTgwId: number;
  /** 虚拟交易网关名称 */
  virtualTgwName: string;
  /** 虚拟通道服务端口 */
  virtualSvrPort: number;

  /** 对接系统号 */
  extSysId: number;

  /** 子系统号 */
  extSubsysId: number;

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
/**
 * 虚拟网关信息查询
 */

export async function queryVirtualGateWay(params: VirtualGateWayParams) {
  return parseRequestByPage<VirtualGateWayDataTypeIDTO, VirtualGateWayDataType>(
    request(`/aegis/api/tgwAgentManager/queryVirtualGateWay`, {
      method: 'POST',
      data: parseQueryVirtualGateWayParams(params),
    }),
    parseVirtualGateWay
  );
}

/** 虚拟网关配置 */
export async function configVirtualGateWay(params: configVirtualGateWayParams) {
  return parseRequest<any>(
    request(`/aegis/api/tgwAgentManager/configVirtualGateWay`, {
      method: 'POST',
      data: parseConfigVirtualGateWay(params),
    })
  );
}

export interface configVirtualGateWayParams {
  alterType: number;
  operaterCode?: string;
  terminalInfo?: string;
  virtualTgwId: number;
  /** 虚拟交易网关名称 */
  virtualTgwName: string;
  /** 虚拟通道服务端口 */
  virtualSvrPort: number;
  extSysId: number;
  extSubsysId: number;
  beginOrderId: string;
  endOrderId: string;
  toRiskFlag: number;
  tgwProtocolType: number;
  remark?: string;
}

/** 网关状态查询 */
export async function queryVirtualGateWayStatus(params: {
  tgwAgentId: number[];
}) {
  return parseRequest<VirtualGateWayStatusResponse>(
    request(`/aegis/api/tgwAgentManager/queryVirtualGateWayLinkStatus`, {
      method: 'POST',
      data: params,
    })
  );
}

interface VirtualGateWayStatusResponse extends ResponseParameterPagination {
  resultList: VirtualGateWayStatusDataType[];
}
export interface VirtualGateWayStatusDataType {
  virtualTgwId: number;
  /** 交易系统连接状态 */
  tradeSysLinkStatus: number;
  /** 联合风控连接状态 */
  riskLinkStatus: number;
}

/* 报盘路由查询 */
export interface VirtualTGWRouterParams extends RequestParameterPagination {
  filterCondition?: VirtualTGWRouterCondition;
}
export type VirtualTGWRouterCondition =
  | {
      virtualTgwId?: number;
      tgwId?: number;
      virtualSvrPort?: number;
      tgwAgentId?: number;
      enableFlag?: string;
    }
  | undefined;
interface VirtualTGWRouterResponse extends ResponseParameterPagination {
  resultList: VirtualTGWRouterDataType[];
}

export interface VirtualTGWRouterDataType {
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
    virtualSvrPort: number;

    /** 对接系统号 */
    extSysId: number;

    /** 子系统号 */
    extSubsysId: number;

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
    tgwSvrIp: string;

    /** tgw服务端口 */
    tgwSvrPort: number;

    /** 发送方标识 */
    senderCompId: string;

    /** 接收方标识 */
    targetCompId: string;

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
// 报盘路由查询
export async function queryVirtualTGWRouter(params: VirtualTGWRouterParams) {
  return parseRequestByPage<
    VirtualTGWRouterDataTypeIDTO,
    VirtualTGWRouterDataType
  >(
    request(`/aegis/api/tgwAgentManager/queryVirtualTGWRouter`, {
      method: 'POST',
      data: {
        pageId: params.pageId,
        pageSize: params.pageSize,
        filterCondition: params.filterCondition
          ? {
              virtualTgwId: params.filterCondition.virtualTgwId,
              tgwAgentId: params.filterCondition.tgwAgentId,
              virtualServerPort: params.filterCondition.virtualSvrPort,
              tgwId: params.filterCondition.tgwId,
              enableFlag: params.filterCondition.enableFlag,
            }
          : undefined,
      },
    }),
    parseVirtualTGWRoute
  );
}

/** 报盘网关配置 */
export async function configVirtualTGWRouter(params: ConfigVirtualTGWRouter) {
  return parseRequest<any>(
    request(`/aegis/api/tgwAgentManager/configVirtualTGWRouter`, {
      method: 'POST',
      data: {
        modifyType: params?.alterType,
        routerId: params?.routerId,
        tgwAgentId: params?.tgwAgentId,
        tgwId: params?.tgwId,
        virtualTgwId: params?.virtualTgwId,
        enableFlag: params?.enableFlag,
        remark: params?.remark,
      },
    })
  );
}

export interface ConfigVirtualTGWRouter {
  alterType: number;
  operaterCode?: string;
  terminalInfo?: string;
  routerId: number;
  tgwAgentId: number;
  tgwId: number;
  virtualTgwId: number;
  enableFlag: string;
  remark?: string;
}
// 报盘网关状态配置
export async function configVirtualTGWRouterStatus(params: {
  routerId: number;
  enableFlag: string;
}) {
  return parseRequest<never>(
    request(`/aegis/api/tgwAgentManager/configVirtualTGWRouterStatus`, {
      method: 'POST',
      data: params,
    })
  );
}
