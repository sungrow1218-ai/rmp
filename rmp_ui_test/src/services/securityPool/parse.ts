import {
  AlterSecurityPoolDetailParam,
  AlterSecurityPoolDetailRspDTO,
  AlterSecurityPoolLayerDTO,
  AlterSecurityPoolParam,
  ExportSecurityPoolDetailParam,
  QuerySecuPoolRspDto,
  QuerySecurityPoolDetailParam,
  QuerySecurityPoolDetailRspDTO,
  QuerySecurityPoolParams,
  SecurityPoolResponseDTO,
} from './dto';
import {
  AlterSecurityPoolDetailIParam,
  AlterSecurityPoolDetailRspIDTO,
  AlterSecurityPoolIParam,
  AlterSecurityPoolLayerIDTO,
  ExportSecurityPoolDetailIParam,
  QuerySecuPoolRspIDTO,
  QuerySecurityPoolDetailIParam,
  QuerySecurityPoolDetailRspIDTO,
  QuerySecurityPoolIParams,
  SecurityPoolResponseIDTO,
} from './Idto';

/**
 * 查询证券池层级
 */
export const parseQuerySecurityPoolLayer = (
  prev: SecurityPoolResponseIDTO
): SecurityPoolResponseDTO => {
  const data: SecurityPoolResponseDTO = {
    secuPoolLayerId: prev.secuPoolLayerId,
    secuPoolLayerName: prev.secuPoolLayerName,
    workGroupId: prev.workGroupId,
    createUserNo: prev.createUserCode,
    updateUserNo: prev.updateUserCode,
    createDateTime: prev.createTime,
    controlType: prev.controlType,
    acctLevel: prev.accountLevel,
    controlRangeList: (prev.controlRangeList || []).map((i) => ({
      extSysId: i.tradeSystemId,
      acctCode: i.accountCode,
    })),
    createRoleId: prev.createRoleId,
  };
  return data;
};

/**
 * 设置证券池层级
 */
export const parseAlterSecurityPoolLayer = (
  prev: AlterSecurityPoolLayerDTO
): AlterSecurityPoolLayerIDTO => {
  const data: AlterSecurityPoolLayerIDTO = {
    modifyType: prev.modifyType,
    controlType: prev.controlType,
    workGroupId: prev.workGroupId,
    accountLevel: prev.acctLevel,
    terminalInfo: prev.terminalInfo,
    controlRangeList: (prev.controlRangeList || []).map((i) => ({
      tradeSystemId: i.extSysId,
      accountCode: i.acctCode,
    })),
    secuPoolLayerId: prev.secuPoolLayerId,
    secuPoolLayerName: prev.secuPoolLayerName,
  };
  return data;
};

/**
 * 查询证券池
 */
export const parseQuerySecurityPool = (
  idata: QuerySecuPoolRspIDTO
): QuerySecuPoolRspDto => {
  const data: QuerySecuPoolRspDto = {
    secuPoolLayerId: idata.secuPoolLayerId,
    secuPoolId: idata.securityPoolId,
    secuPoolName: idata.securityPoolName,
    workGroupId: idata.workGroupId,
    createUserNo: idata.createUserCode,
    updateUserNo: idata.updateUserCode,
    createDateTime: idata.createTime,
    createRoleId: idata.createRoleId,
    secuPoolType: idata.securityPoolType,
    lastUpdateTime: idata.lastUpdateTime,
  };
  return data;
};

/**
 * 查询证券池-参数
 */
export const parseQuerySecurityParam = (
  params: QuerySecurityPoolParams
): QuerySecurityPoolIParams => {
  const idata: QuerySecurityPoolIParams = {
    pageId: params.pageId,
    pageSize: params.pageSize,
    authorityFlag: params.authorityFlag,
    filterCondition: params.filterCondition
      ? params.filterCondition.map((i) => ({
          secuPoolLayerId: i.secuPoolLayerId,
          securityPoolId: i.secuPoolId,
          securityPoolName: i.secuPoolName,
          securityPoolType: i.secuPoolType,
        }))
      : undefined,
  };
  return idata;
};

/**
 * 设置证券池-参数
 */
export const parseAlterSecurityPoolParam = (
  params: AlterSecurityPoolParam
): AlterSecurityPoolIParam => {
  const data: AlterSecurityPoolIParam = {
    modifyType: params.modifyType,
    terminalInfo: params.terminalInfo,
    workGroupId: params.workGroupId,
    secuPoolLayerId: params.secuPoolLayerId,
    securityPoolId: params.secuPoolId,
    securityPoolName: params.secuPoolName,
    securityPoolType: params.secuPoolType,
  };
  return data;
};

/**
 * 查询证券池明细-返回
 */
export const parseQuerySecurityPoolDetail = (
  idata: QuerySecurityPoolDetailRspIDTO
): QuerySecurityPoolDetailRspDTO => {
  const data: QuerySecurityPoolDetailRspDTO = {
    securityCode: idata.securityCode,
    securityName: idata.securityName,
    marketId: idata.marketId,
    effectBeginDate: idata.effectiveDate ? `${idata.effectiveDate}` : undefined,
    effectEndDate: idata.expireDate ? `${idata.expireDate}` : undefined,
    remark: idata.remark,
    secuPoolId: idata.securityPoolId,
    secuPoolName: idata.securityPoolName,
    createUserNo: idata.createUserCode,
    updateUserNo: idata.updateUserCode,
    lastUpdateTime: idata.lastUpdateTime,
    createDateTime: idata.createTime,
  };
  return data;
};

/**
 * 查询证券池明细-参数
 */
export const parseQuerySecurityPoolDetailParam = (
  idata: QuerySecurityPoolDetailParam
): QuerySecurityPoolDetailIParam => {
  const data: QuerySecurityPoolDetailIParam = {
    pageId: idata.pageId,
    pageSize: idata.pageSize,
    securityPoolId: idata.secuPoolId,
    filterCondition: idata.filterCondition
      ? {
          securityCode: idata.filterCondition.securityCode,
          marketId: idata.filterCondition.marketId,
        }
      : undefined,
  };
  return data;
};

/**
 * 设置证券池明细-参数
 */
export const parseAlterSecurityPoolDetailParam = (
  idata: AlterSecurityPoolDetailParam
): AlterSecurityPoolDetailIParam => {
  const data: AlterSecurityPoolDetailIParam = {
    modifyType: idata.modifyType,
    securityPoolId: idata.secuPoolId,
    terminalInfo: idata.terminalInfo,
    poolSecurityList: (idata.poolSecurityList || []).map((i) => ({
      securityCode: i.securityCode,
      marketId: i.marketId,
      effectiveDate: i.effectBeginDate,
      expireDate: i.effectEndDate,
      remark: i.remark,
    })),
  };
  return data;
};

/**
 * 设置证券池明细-结果
 */
export const parseAlterSecurityPoolDetail = (
  idata: AlterSecurityPoolDetailRspIDTO
): AlterSecurityPoolDetailRspDTO => {
  const data: AlterSecurityPoolDetailRspDTO = {
    errorId: idata.errorId,
    errorInfo: idata.errorMessage,
    faultList: (idata.faultList || []).map((i) => ({
      securityCode: i.securityCode,
      marketId: i.marketId,
      errorInfo: i.errorMessage,
    })),
  };
  return data;
};

/**
 * 导出证券池明细-参数
 */
export const parseExportSecurityPoolDetail = (
  param: ExportSecurityPoolDetailParam
): ExportSecurityPoolDetailIParam => {
  const data: ExportSecurityPoolDetailIParam = {
    securityPoolId: param.secuPoolId,
  };
  return data;
};
