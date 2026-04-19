import request from '@/utils/request';
import {
  ExportSecurityPoolType,
  QuerySecuPoolDeatailType,
  QuerySecuPoolRspDTO,
  SecuPoolDTO,
  QuerySecuPoolLayerType,
  QuerySecuPoolRspDto,
  QuerySecurityPoolLayerType,
  SecurityPoolResponseDTO,
  SecuPoolLayerDTO,
  FaultListType,
  QuerySecuPoolDetailType,
  FileParmas,
} from '@/pages/securityPool/contants/tyeping';
import {
  ResponseParameterPagination,
  type CommonResponseWrapper,
} from './typing';

/**
 * 券池管理-查询证券池层级
 */
export async function querySecurityPoolLayerOld(
  param: QuerySecurityPoolLayerType
) {
  return request<
    CommonResponseWrapper<
      { resultList: SecurityPoolResponseDTO[] } & ResponseParameterPagination
    >
  >(`/api/ruleManager/querySecurityPoolLayerOld`, {
    method: 'post',
    data: param,
  });
}

/**
 * 券池管理-设置证券池层级
 */
export async function alterSecurityPoolLayerOld(
  param: QuerySecuPoolLayerType & SecuPoolLayerDTO
) {
  return request<
    CommonResponseWrapper<{ resultList: SecurityPoolResponseDTO[] }>
  >(`/api/ruleManager/alterSecurityPoolLayerOld`, {
    method: 'post',
    data: param,
  });
}

/**
 * 券池管理-查询证券池
 */
export async function querySecurityPoolOld(param: QuerySecurityPoolLayerType) {
  return request<CommonResponseWrapper<{ resultList: QuerySecuPoolRspDto[] }>>(
    `/api/ruleManager/querySecurityPoolOld`,
    {
      method: 'post',
      data: param,
    }
  );
}

/**
 * 券池管理-设置证券池
 */
export async function alterSecurityPoolOld(
  param: QuerySecuPoolLayerType & SecuPoolDTO
) {
  return request<CommonResponseWrapper<any>>(
    `/api/ruleManager/alterSecurityPoolOld`,
    {
      method: 'post',
      data: param,
    }
  );
}

/**
 * 券池管理-设置证券池层级
 */
export async function querySecurityPoolDetailOld(
  param: QuerySecuPoolDetailType
) {
  return request<
    CommonResponseWrapper<{
      resultList: QuerySecuPoolRspDTO[];
      totalSize: number;
    }>
  >(`/api/ruleManager/querySecurityPoolDetailOld`, {
    method: 'post',
    data: param,
  });
}

/**
 * 券池管理-设置证券池明细
 */
export async function alterSecurityPoolDetailOld(
  param: QuerySecuPoolDeatailType
) {
  return request<
    CommonResponseWrapper<{
      errorInfo: string;
      errorId: any;
      faultList: FaultListType[];
    }>
  >(`/api/ruleManager/alterSecurityPoolDetailOld`, {
    method: 'post',
    data: param,
  });
}

/**
 * 券池管理-导出证券池明细
 */
export async function exportSecurityPoolDetailOld(
  param: ExportSecurityPoolType
) {
  return request<CommonResponseWrapper<any>>(
    `/api/ruleManager/exportSecurityPoolDetailOld`,
    {
      method: 'post',
      data: param,
    }
  );
}
