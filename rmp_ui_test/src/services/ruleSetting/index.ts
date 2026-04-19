import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import {
  AlterRuleSettingParam,
  ExportRiskRuleParam,
  QueryRuleSettingParam,
  QueryRuleSettingRspDTO,
} from './dto';
import {
  parseAlterRuleSettingParam,
  parseExportRiskRuleParam,
  parseQueryRuleSettingParam,
  parseQueryRuleSettingRsp,
} from './parse';
import {
  ModifyRuleTemplateGroupParams,
  QueryRuleSettingRspIDTO,
  RuleTemplateGroupIDTO,
  RuleTemplateIDTO,
  UnBondAccountGroupData,
  UnBondTemplateGroupData,
} from './idto';
import {
  CommonResponseIWrapper,
  RequestParameterPagination,
  RequestParameterPaginationIDTO,
  ResponseParameterPagination,
} from '../typing';
import { RuleBaseInfo } from './type';

/**
 * 查询规则接口
 */
export const queryRuleSetting = async (params: QueryRuleSettingParam) =>
  parseRequestByPage<QueryRuleSettingRspIDTO, QueryRuleSettingRspDTO>(
    request(`/aegis/api/ruleManager/queryRule`, {
      method: 'POST',
      data: parseQueryRuleSettingParam(params),
    }),
    parseQueryRuleSettingRsp
  );

/**
 * 设置规则接口
 */
export const alterRuleSetting = async (
  params: DeepPartial<AlterRuleSettingParam>
) =>
  parseRequest<{ errorId: number; errorMessage: string; ruleId: number }>(
    request(`/aegis/api/ruleManager/modifyRule`, {
      method: 'POST',
      data: parseAlterRuleSettingParam(params as AlterRuleSettingParam),
    })
  );

/**
 * 设置规则状态
 */
export interface alterRuleStatusParams {
  workGroupId: number;
  operatorCode: string;
  terminalInfo?: string;
  ruleId: number;
  ruleStatus: number;
}

export const alterRuleStatus = async (params: alterRuleStatusParams) =>
  parseRequest<{ errorId: number; errorMessage: string }>(
    request(`/aegis/api/ruleManager/modifyRuleStatus`, {
      method: 'POST',
      data: params,
    })
  );

/**
 * 查询规则信息
 */
export const queryRuleBaseInfo = (
  data: {
    workGroupId: number;
    authorityFlag?: 0 | 1 | 2;
    filterCondition?: Partial<{
      ruleId: number[];
      ruleName: string;
      ruleStatus: number[];
      ruleType: string[];
    }>;
  } & RequestParameterPagination
) =>
  parseRequestByPage<RuleBaseInfo & { createRoleId: number }>(
    request(`/aegis/api/ruleManager/queryRuleBaseInfo`, {
      method: 'POST',
      data,
    })
  );

/**
 * 导出功能
 */
export const exportRiskRule = async (
  params: DeepPartial<ExportRiskRuleParam>
) =>
  parseRequest<{ errorId: number; errorMessage: string; fileUrl: string }>(
    request(`/aegis/api/ruleManager/exportRiskRule `, {
      method: 'POST',
      data: parseExportRiskRuleParam(params as ExportRiskRuleParam),
    })
  );

/**
 * 查询规则模板配置
 */
export const queryRuleTemplateDefaultConfiguration = async (
  ruleType: string[]
) =>
  request<
    CommonResponseIWrapper<{
      resultList: { configuration: string; ruleType: string }[];
    }>
  >(`/aegis/api/ruleManager/queryRuleTemplateDefaultConfiguration`, {
    method: 'POST',
    data: { ruleType },
  });

/**
 * 查询规则模板组列表
 */
export const queryRuleTemplateGroup = async (
  data: {
    authorityFlag?: number;
    filterCondition?: {
      workGroupId?: number;
      ruleTmplGroupId?: number;
      ruleTmplGroupName?: string;
      status?: number;
      createUserCode?: string;
    }[];
  } & RequestParameterPagination
) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: RuleTemplateGroupIDTO[] }
    >
  >(`/aegis/api/ruleManager/queryRuleTemplateGroup`, {
    method: 'POST',
    data,
  });

/**
 * 模板组配置接口
 */
export const modifyRuleTemplateGroup = async (
  data: ModifyRuleTemplateGroupParams
) =>
  request<CommonResponseIWrapper<any>>(
    `/aegis/api/ruleManager/modifyRuleTemplateGroup`,
    {
      method: 'POST',
      data,
    }
  );
/**
 * 模板配置接口
 */
export const modifyRuleTemplate = async (
  data: RequestParameterPaginationIDTO & {
    filterCondition: {
      ruleTmplGroupId: number;
      ruleType: string[];
      ruleTemplateId: number[];
    };
  }
) =>
  request<CommonResponseIWrapper<any>>(
    `/aegis/api/ruleManager/modifyRuleTemplate`,
    {
      method: 'POST',
      data,
    }
  );

/**
 * 模板查询
 */
export const queryRuleTemplate = async (data: {
  pageId: number;
  pageSize: number;
  authorityFlag: 0 | 1;
  filterCondition?: [
    {
      ruleTmplGroupId?: number;
      ruleType?: string[];
      ruleTemplateId?: number[];
    }
  ];
}) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: RuleTemplateIDTO[] }
    >
  >(`/aegis/api/ruleManager/queryRuleTemplate`, {
    method: 'POST',
    data,
  });

// 模板组未绑定的账户组

export const queryUnBondAccountGroup = async (data: {
  pageId: number;
  pageSize: number;
  authorityFlag: 0 | 1;
  filterCondition: {
    ruleTmplGroupId: number;
  };
}) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: UnBondAccountGroupData[] }
    >
  >(`/aegis/api//ruleManager/queryUnBondAccountGroup`, {
    method: 'POST',
    data,
  });

// 查询未绑定模板组列表
export const queryUnBondTemplateGroup = async (data: {
  pageId: number;
  pageSize: number;
  authorityFlag: 0 | 1;
  filterCondition: {
    accountGroupId: number;
  };
}) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: UnBondTemplateGroupData[] }
    >
  >(`/aegis/api/ruleManager/queryUnBondTemplateGroup`, {
    method: 'POST',
    data,
  });
