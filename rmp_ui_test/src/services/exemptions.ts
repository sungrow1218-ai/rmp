import request from '@/utils/request';
import {
  CommonResponseWrapper,
  RequestParameterPagination,
  ResponseParameterPagination,
} from './typing';

interface queryRuleApproveExemptResponseDTO
  extends ResponseParameterPagination {
  resultList: {
    userCode: string;
    workGroupId: number;
    ruleTypeList: string[];
    updateUserCode: string;
    lastUpdateTime: string;
  }[];
}

/**
 * 规则复核豁免信息查询
 */
export const queryRuleApproveExemptOld = (
  data: { filterCondition?: { userCode: string } } & RequestParameterPagination
) =>
  request<CommonResponseWrapper<queryRuleApproveExemptResponseDTO>>(
    `/api/procedure/queryRuleApproveExemptOld`,
    {
      method: 'POST',
      data,
    }
  );

interface alterRuleApproveExemptParams {
  alterType: number;
  userCode: string;
  workGroupId: number;
  ruleTypeList: string[];
}

/**
 * 设置规则复核豁免信息
 */
export const alterRuleApproveExemptOld = (
  params: alterRuleApproveExemptParams
) =>
  request<CommonResponseWrapper<any>>(
    `/api/procedure/alterRuleApproveExemptOld`,
    {
      method: 'POST',
      data: params,
    }
  );
