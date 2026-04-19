import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import {
  QuerySecuPoolRspDto,
  QuerySecurityPoolLayerType,
  FaultListType,
  FileParmas,
} from '@/pages/securityPool/contants/tyeping';
import { type CommonResponseWrapper } from '../typing';
import {
  parseAlterSecurityPoolDetail,
  parseAlterSecurityPoolDetailParam,
  parseAlterSecurityPoolLayer,
  parseAlterSecurityPoolParam,
  parseExportSecurityPoolDetail,
  parseQuerySecurityParam,
  parseQuerySecurityPool,
  parseQuerySecurityPoolDetail,
  parseQuerySecurityPoolDetailParam,
  parseQuerySecurityPoolLayer,
} from './parse';
import {
  AlterSecurityPoolDetailRspIDTO,
  AlterSecurityPoolIParam,
  QuerySecuPoolRspIDTO,
  QuerySecurityPoolDetailRspIDTO,
  SecurityPoolResponseIDTO,
} from './Idto';
import {
  AlterSecurityPoolDetailParam,
  AlterSecurityPoolDetailRspDTO,
  AlterSecurityPoolLayerDTO,
  AlterSecurityPoolParam,
  ExportSecurityPoolDetailParam,
  QuerySecurityPoolDetailParam,
  QuerySecurityPoolDetailRspDTO,
  QuerySecurityPoolParams,
  SecurityPoolResponseDTO,
} from './dto';

/**
 * 券池管理-查询证券池层级
 */
export async function querySecurityPoolLayer(
  param: QuerySecurityPoolLayerType
) {
  return parseRequestByPage<SecurityPoolResponseIDTO, SecurityPoolResponseDTO>(
    request(`/aegis/api/ruleManager/querySecurityPoolLayer`, {
      method: 'post',
      data: param,
    }),
    parseQuerySecurityPoolLayer
  );
}

/**
 * 券池管理-设置证券池层级
 */
export async function alterSecurityPoolLayer(param: AlterSecurityPoolLayerDTO) {
  return parseRequest(
    request<CommonResponseWrapper<any>>(
      `/aegis/api/ruleManager/modifySecurityPoolLayer`,
      {
        method: 'post',
        data: parseAlterSecurityPoolLayer(param),
      }
    )
  );
}

/**
 * 券池管理-查询证券池
 */
export async function querySecurityPool(param: QuerySecurityPoolParams) {
  return parseRequestByPage<QuerySecuPoolRspIDTO, QuerySecuPoolRspDto>(
    request(`/aegis/api/ruleManager/querySecurityPool`, {
      method: 'post',
      data: parseQuerySecurityParam(param),
    }),
    parseQuerySecurityPool
  );
}

/**
 * 券池管理-设置证券池
 */
export async function alterSecurityPool(param: AlterSecurityPoolParam) {
  return parseRequest(
    request<CommonResponseWrapper<any>>(
      `/aegis/api/ruleManager/modifySecurityPool`,
      {
        method: 'post',
        data: parseAlterSecurityPoolParam(param),
      }
    )
  );
}

/**
 * 券池管理-查询证券池明细
 */
export async function querySecurityPoolDetail(
  param: QuerySecurityPoolDetailParam
) {
  return parseRequestByPage<
    QuerySecurityPoolDetailRspIDTO,
    QuerySecurityPoolDetailRspDTO
  >(
    request(`/aegis/api/ruleManager/querySecurityPoolDetail`, {
      method: 'post',
      data: parseQuerySecurityPoolDetailParam(param),
    }),
    parseQuerySecurityPoolDetail
  );
}

/**
 * 券池管理-设置证券池明细
 */
export async function alterSecurityPoolDetail(
  param: AlterSecurityPoolDetailParam
) {
  return parseRequest<
    AlterSecurityPoolDetailRspIDTO,
    AlterSecurityPoolDetailRspDTO
  >(
    request(`/aegis/api/ruleManager/modifySecurityPoolDetail`, {
      method: 'post',
      data: parseAlterSecurityPoolDetailParam(param),
    }),
    parseAlterSecurityPoolDetail
  );
}

/**
 * 券池管理-导出证券池明细
 */
export async function exportSecurityPoolDetail(
  param: ExportSecurityPoolDetailParam
) {
  return parseRequest<{
    errorId: number;
    errorMessage: string;
    fileUrl: string;
  }>(
    request(`/aegis/api/ruleManager/exportSecurityPoolDetail`, {
      method: 'post',
      data: parseExportSecurityPoolDetail(param),
    })
  );
}
