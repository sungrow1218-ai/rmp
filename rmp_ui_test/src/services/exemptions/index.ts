import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import { RequestParameterPagination } from '../typing';

/**
 * 规则复核豁免信息查询
 */
export const queryRuleApproveExempt = (
  data: { filterCondition?: { userCode: string } } & RequestParameterPagination
) =>
  parseRequestByPage(
    request(`/aegis/api/procedure/queryRuleApproveExempt`, {
      method: 'POST',
      data,
    })
  );

interface alterRuleApproveExemptParams {
  modifyType: number;
  userCode: string;
  workGroupId: number;
  ruleTypeList: string[];
}

/**
 * 设置规则复核豁免信息
 */
export const alterRuleApproveExempt = (params: alterRuleApproveExemptParams) =>
  parseRequest<{ errorId: number; errorMessage: string }>(
    request(`/aegis/api/procedure/modifyRuleApproveExempt`, {
      method: 'POST',
      data: params,
    })
  );
