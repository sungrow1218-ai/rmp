import request from '@/utils/request';
import {
  type CommonResponseWrapper,
  type RequestParameterPagination,
  type ResponseParameterPagination,
} from './typing';

/**
 * 规则查询参数
 */
export interface RuleQueryParams extends RequestParameterPagination {
  filterCondition?: FilterCondition;
}
export type FilterCondition = Partial<{
  ruleId: number[];
  ruleName: string;
  ruleStatus: number[];
  createUserCode: string;
  updateUserCode: string;
  acctCode: string;
  acctName: string;
  workGroupList: WorkGroupList[];
  acctControlClass: {
    controlAcctType: number;
    acctLevel?: number;
  };
  createBeginDate: number;
  createEndDate: number;
  updateBeginDate: number;
  updateEndDate: number;
}>;

export interface WorkGroupList {
  workGroupId: number;
  ruleType: string[];
}

export interface TradeAcct {
  extSysId: number;
  marketId: number;
  bookLevel: number;
  acctCode: string;
}
export interface ManageAcct {
  extSysId: number;
  bookLevel: number;
  acctCode: string;
}

interface queryRuleDataType extends ResponseParameterPagination {
  resultList: ResultList[];
}

export interface GeneralThreshold {
  compareDirection: number;
  unit: number;
  thresholdList: { value: number; operation: number }[];
}

export interface SpecialThreshold {
  preConditionList?: {
    conditionId: number;
    conditionType: number;
    conditionCompareDirection: number;
    conditionValue?: number;
    unit: number;
  }[];
  thresholdConditionList?: {
    conditionId: number;
    conditionType: number;
    conditionCompareDirection: number;
    conditionWarnValue?: number;
    conditionForbidValue?: number;
    unit: number;
  }[];
}

export interface ResultList {
  ruleBaseInfo: RuleBaseInfo;
  ruleControlAcct: RuleControlAcct;
  ruleControlSecurity: RuleControlSecurity;
  generalThreshold?: GeneralThreshold;
  specialThreshold?: SpecialThreshold;
  ruleRelaList: RuleRelaList[];
  extParamList?: {
    ruleParamType: number;
    ruleParamValue: string;
    ruleParamValue2: string;
  };
  createUserCode: string;
  workGroupId: number;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
  createRoleId: number;
}

export interface RuleRelaList {
  ruleRelaType: number;
  relaRuleId: number;
  relaRuleType: string;
  relaRuleName: string;
  relaRulePriority: number;
}

interface RuleBaseInfo {
  ruleId: number;
  ruleType: string;
  ruleSummary?: string;
  ruleName: string;
  ruleStatus: number;
  rulePriority: number;
  ruleCheckPoint: number;
  beginDate?: string;
  endDate?: string;
  timeSegmentList?: { beginTime: string; endTime: string };
}

export interface AcctItem {
  extSysId: number | string;
  marketId?: number | string;
  accountCode: string | string;
  bookLevel: number | string;
}

export interface RuleControlAcct {
  controlAcctType: number | string;
  excludeAcctType: number | string;
  unionControlType: number | string;
  acctLevel?: number | string;
  excludeAcctLevel?: number | string;
  controlAcctList: Partial<AcctItem>[];
  excludeAcctList?: Partial<AcctItem>[];
}

interface SecurityItem {
  securityCode: string;
  marketId: number;
}

export interface RuleControlSecurity {
  securityControlType: number;
  securitySummaryType: number;
  marketId?: number[];
  securityList?: SecurityItem[];
  excludeSecurityList?: SecurityItem[];
  // 按照券池、动态维度、现货限仓表等证券集合类对象控制时，须填写这些集合类的id，格式：[1,2,3]
  securitySetIdList?: number[];
  // 按照证券类别 、期货品种、期权品种等控制时，须填写过滤分类标准，格式：["1","al","cu"]
  securityFilterClassList?: string[];
}

/**
 * 查询规则接口
 */
export async function queryRuleSettingOld(params: RuleQueryParams) {
  return request<CommonResponseWrapper<queryRuleDataType>>(
    `/api/ruleManager/queryRuleOld`,
    {
      method: 'POST',
      data: params,
    }
  );
}

/**
 * 规则设置接口
 */

export async function alterRuleSettingOld(params: any) {
  return request<CommonResponseWrapper<any>>(`/api/ruleManager/alterRuleOld`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 规则启动接口
 */
export interface alterRuleStatusParams {
  workGroupId: number;
  operatorCode: string;
  terminalInfo?: string;
  ruleId: number;
  ruleStatus: number;
}
type alterRuleStatusType = never;
export async function alterRuleStatusOld(params: alterRuleStatusParams) {
  return request<CommonResponseWrapper<alterRuleStatusType>>(
    `/api/ruleManager/alterRuleStatusOld`,
    {
      method: 'POST',
      data: params,
    }
  );
}

export interface QueryDynamicDimensionResponse {
  resultList: DynamicDimensionDTO[];
}

interface DynamicDimensionDTO {
  /** 动态维度序号 */
  dyndimId: number;
  /** 动态维度名称 */
  dyndimName: string;
}

// 查询风控规则
export const queryRuleBaseInfoOld = (
  data: {
    workGroupId: number;
    authFlag?: 0 | 1 | 2;
    filterCondition?: Partial<{
      ruleId: number[];
      ruleName: string;
      ruleStatus: number[];
      ruleType: string[];
    }>;
  } & RequestParameterPagination
) =>
  request<CommonResponseWrapper<queryRuleDataType>>(
    `/api/ruleManager/queryRuleBaseInfoOld`,
    {
      method: 'POST',
      data,
    }
  );

export async function exportRiskRuleOld(params: {
  filterCondition?: FilterCondition;
}) {
  return request<CommonResponseWrapper<any>>(
    `/api/ruleManager/exportRiskRuleOld`,
    {
      method: 'POST',
      data: params,
    }
  );
}
