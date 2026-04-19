import {
  ConfigExchangeGateWayParams,
  configVirtualGateWayParams,
  ExchangeGateWayDataType,
  ExchangeGateWayParams,
  VirtualGateWayDataType,
  VirtualGateWayParams,
  VirtualTGWRouterDataType,
} from '.';
import {
  ConfigExchangeGateWayParamsIDTO,
  configVirtualGateWayParamsIDTO,
  ExchangeGateWayDataTypeIDTO,
  VirtualGateWayDataTypeIDTO,
  VirtualGateWayParamsIDTO,
  VirtualTGWRouterDataTypeIDTO,
} from './Idto';

export const parseExchangeGateWay = (
  prev: ExchangeGateWayDataTypeIDTO
): ExchangeGateWayDataType => {
  const data: ExchangeGateWayDataType = {
    tgwId: prev.tgwId,
    tgwAgentId: prev.tgwAgentId,
    marketId: prev.marketId,
    offerChannelType: prev.offerChannelType,
    tgwSvrIp: prev.tgwServerIp,
    tgwSvrPort: prev.tgwServerPort,
    senderCompId: prev.senderId,
    targetCompId: prev.targetId,
    appVersion: prev.appVersion,
    loginPassword: prev.loginPassword,
    executionReportCount: prev.executionReportCount,
    heartBeatInterval: prev.heartBeatInterval,
    remark: prev.remark ?? '',
    createUserCode: prev.createUserCode,
    updateUserCode: prev.updateUserCode,
    createDateTime: prev.createDateTime,
    lastUpdateTime: prev.lastUpdateTime,
  };
  return data;
};
export const parseConfigExchangeGateWayParams = (
  prev: ConfigExchangeGateWayParams
): ConfigExchangeGateWayParamsIDTO => {
  const data: ConfigExchangeGateWayParamsIDTO = {
    modifyType: prev.alterType,
    tgwId: prev.tgwId,
    marketId: prev.marketId,
    offerChannelType: prev.offerChannelType,
    tgwServerIp: prev.tgwSvrIp,
    tgwServerPort: prev.tgwSvrPort,
    senderId: prev.senderCompId,
    targetId: prev.targetCompId,
    appVersion: prev.appVersion,
    loginPassword: prev.loginPassword,
    executionReportCount: prev.executionReportCount,
    heartBeatInterval: prev.heartBeatInterval,
    remark: prev.remark ?? '',
  };
  return data;
};

export const parseQueryVirtualGateWayParams = (
  prev: VirtualGateWayParams
): VirtualGateWayParamsIDTO => {
  const data: VirtualGateWayParamsIDTO = {
    pageId: prev.pageId,
    pageSize: prev.pageSize,
    filterCondition: prev.filterCondition
      ? {
          virtualTgwId: prev.filterCondition?.virtualTgwId,
          virtualTgwName: prev.filterCondition?.virtualTgwName,
          virtualServerPort: prev.filterCondition.virtualSvrPort,
          tradeSystemId: prev.filterCondition.extSysId,
          tradeSubSystemId: prev.filterCondition.extSubsysId,
          toRiskFlag: prev.filterCondition.toRiskFlag,
        }
      : undefined,
  };
  return data;
};

export const parseVirtualGateWay = (
  prev: VirtualGateWayDataTypeIDTO
): VirtualGateWayDataType => {
  const data: VirtualGateWayDataType = {
    tgwAgentId: prev.tgwAgentId,
    remark: prev.remark,
    createUserCode: prev.createUserCode,
    updateUserCode: prev.updateUserCode,
    createDateTime: prev.createDateTime,
    lastUpdateTime: prev.lastUpdateTime,
    virtualTgwId: prev?.virtualTgwId,
    virtualTgwName: prev?.virtualTgwName,
    virtualSvrPort: prev?.virtualServerPort,
    extSysId: prev?.tradeSystemId,
    extSubsysId: prev?.tradeSubSystemId,
    beginOrderId: prev?.beginOrderId,
    endOrderId: prev?.endOrderId,
    toRiskFlag: prev?.toRiskFlag,
    tgwProtocolType: prev?.tgwProtocolType,
  };
  return data;
};

export const parseConfigVirtualGateWay = (
  prev: configVirtualGateWayParams
): configVirtualGateWayParamsIDTO => {
  const data: configVirtualGateWayParamsIDTO = {
    modifyType: prev.alterType,
    virtualTgwId: prev.virtualTgwId,
    virtualTgwName: prev.virtualTgwName,
    virtualServerPort: prev.virtualSvrPort,
    tradeSystemId: prev.extSubsysId,
    tradeSubSystemId: prev.extSubsysId,
    beginOrderId: prev.beginOrderId,
    endOrderId: prev.endOrderId,
    toRiskFlag: prev.toRiskFlag,
    tgwProtocolType: prev.tgwProtocolType,
    remark: prev.remark,
  };
  return data;
};

export const parseVirtualTGWRoute = (
  prev: VirtualTGWRouterDataTypeIDTO
): VirtualTGWRouterDataType => {
  const data: VirtualTGWRouterDataType = {
    routerId: prev.routerId,
    tgwAgentId: prev.tgwAgentId,
    enableFlag: prev.enableFlag,
    remark: prev.remark,
    createUserCode: prev.createUserCode,
    updateUserCode: prev.updateUserCode,
    createDateTime: prev.createDateTime,
    lastUpdateTime: prev.lastUpdateTime,
    virtualTgw: {
      virtualTgwId: prev?.virtualTgw?.virtualTgwId,
      virtualTgwName: prev?.virtualTgw?.virtualTgwName,
      virtualSvrPort: prev?.virtualTgw?.virtualServerPort,
      extSysId: prev?.virtualTgw?.tradeSystemId,
      extSubsysId: prev?.virtualTgw?.tradeSubSystemId,
      beginOrderId: prev?.virtualTgw?.beginOrderId,
      endOrderId: prev?.virtualTgw?.endOrderId,
      toRiskFlag: prev?.virtualTgw?.toRiskFlag,
      tgwProtocolType: prev?.virtualTgw?.tgwProtocolType,
      remark: prev?.virtualTgw?.remark,
    },
    tgw: {
      tgwId: prev?.tgw?.tgwId,
      tgwAgentId: prev?.tgw?.tgwAgentId,
      marketId: prev?.tgw?.marketId,
      offerChannelType: prev?.tgw?.offerChannelType,
      tgwSvrIp: prev?.tgw?.tgwServerIp,
      tgwSvrPort: prev?.tgw?.tgwServerPort,
      senderCompId: prev?.tgw?.senderId,
      targetCompId: prev?.tgw?.targetId,
      appVersion: prev?.tgw?.appVersion,
      loginPassword: prev?.tgw?.loginPassword,
      executionReportCount: prev?.tgw?.executionReportCount,
      remark: prev?.tgw?.remark,
    },
  };
  return data;
};
