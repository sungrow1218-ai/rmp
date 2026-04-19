import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import {
  CommonResponseIWrapper,
  CommonResponseWrapper,
  RequestParameterPagination,
  RequestParameterPaginationIDTO,
  ResponseParameterPagination,
} from '../typing';
import {
  parseAlterAccountGroupDetail,
  parseAlterAccountGroupDetailParams,
  parseQueryAccountGroupData,
  parseQueryAccountGroupDetail,
  parseQueryAccountGroupDetailParams,
  parseQueryAccountGroupParams,
  parseReferenceByRiskRule,
} from './parse';
import {
  AcctItemIDTO,
  AlterAccountGroupDetailIDTO,
  QueryAccountGroupTypeIDTO,
  ReferenceItemIDTO,
} from './Idto';

export type QueryAccountGroupParams = {
  filterCondition?: {
    workGroupId?: number;
    acctGroupId?: number;
    acctGroupName?: string;
    bookType?: number;
    bookLevel?: number;
    dynamicFlag?: number;
    createUserCode?: string;
  };
} & RequestParameterPagination;

export interface AccountGroupItem {
  acctGroupId: number;
  acctGroupName: string;
  bookType: number;
  bookLevel: number;
  dynamicFlag: number;
  acctGroupRemark?: string;
  workGroupId: number;
}

export interface ResponseAccountGroupItem extends AccountGroupItem {
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
  createRoleId: number;
}

// 查询账户组列表
export const queryAccountGroup = async (params: QueryAccountGroupParams) =>
  parseRequestByPage<QueryAccountGroupTypeIDTO, ResponseAccountGroupItem>(
    request(`/aegis/api/ruleManager/queryAccountGroup`, {
      method: 'POST',
      data: parseQueryAccountGroupParams(params),
    }),
    parseQueryAccountGroupData
  );

export type QueryAccountGroupDetailParams = {
  filterCondition?: {
    acctGroupName?: any;
    acctGroupId?: number;
    acctCode?: string;
    acctName?: string;
  };
} & RequestParameterPagination;

export interface AcctItem {
  acctCode: string;
  acctName: string;
  extSysId: number;
  marketId?: number;
}

// 查询账户组明细列表
export const queryAccountGroupDetail = async (
  params: QueryAccountGroupDetailParams
) =>
  parseRequestByPage<AcctItemIDTO, AcctItem>(
    request(`/aegis/api/ruleManager/queryAccountGroupDetail`, {
      method: 'POST',
      data: parseQueryAccountGroupDetailParams(params),
    }),
    parseQueryAccountGroupDetail
  );

export type alterAccountGroupParams = {
  alterType: number;
} & Partial<AccountGroupItem>;
// 添加/编辑账户组
export const alterAccountGroup = async (data: alterAccountGroupParams) =>
  parseRequest<Recordable>(
    request(`/aegis/api/ruleManager/modifyAccountGroup`, {
      method: 'POST',
      data: {
        modifyType: data.alterType,
        accountGroupId: data.acctGroupId,
        accountGroupName: data.acctGroupName,
        bookType: data.bookType,
        bookLevel: data.bookLevel,
        workGroupId: data.workGroupId,
        remark: data.acctGroupRemark,
      },
    })
  );

export interface ReferenceItem {
  acctGroupId: number;
  acctGroupName: string;
  ruleId: number;
  status: number;
  ruleType: string;
  ruleName: string;
  approvalStatus: string;
  manageRuleType: number;
}

// 查询引用的规则列表
export const queryReferenceByRiskRule = async (acctGroupId: number) =>
  parseRequestByPage<ReferenceItemIDTO, ReferenceItem>(
    request(`/aegis/api/ruleManager/queryReferenceByRiskRule `, {
      method: 'POST',
      data: { accountGroupId: acctGroupId },
    }),
    parseReferenceByRiskRule
  );

// 导出账户明细
export const exportAccountGroupDetail = (data: { acctGroupId: number }) =>
  parseRequest<Recordable>(
    request(`/aegis/api/ruleManager/exportAccountGroupDetail `, {
      method: 'POST',
      data: { accountGroupId: data.acctGroupId },
    })
  );

export type AlterAccountGroupDetailParams = {
  alterType: number;
  acctGroupId: number;
  acctList: AcctItem[];
};

// 设置账户组明细
export const alterAccountGroupDetail = async (
  data: AlterAccountGroupDetailParams
) =>
  parseRequest<AlterAccountGroupDetailIDTO, Recordable>(
    request(`/aegis/api/ruleManager/modifyAccountGroupDetail`, {
      method: 'POST',
      data: parseAlterAccountGroupDetailParams(data),
    }),
    parseAlterAccountGroupDetail
  );

export interface AccountGroupRelationParams
  extends RequestParameterPaginationIDTO {
  filterCondition?: {
    workGroupId?: number;
    ruleTmplGroupId?: number[];
    accountGroupId?: number[];
    accountGroupName?: string;
    accountType?: { sobId: number; bookType: number; bookLevel: number };
    status?: number[];
    dataTime?: string;
  };
}
export interface AccountGroupRelation extends ResponseParameterPagination {
  resultList: AccountGroupRelationResultList[];
}
export interface AccountGroupRelationResultList {
  ruleTmplGroupId: number;
  ruleTmplGroupName: string;
  accountGroupId: number;
  accountGroupName: string;
  controlMode: number;
  status: number;
  remark: string;
  createRoleId: number;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
}

// 查询账户组关联规则模板
export const queryAccountGroupRelation = (data: AccountGroupRelationParams) =>
  request<CommonResponseIWrapper<AccountGroupRelation>>(
    `/aegis/api/ruleManager/queryRuleTemplateGroupAccountGroupRelation `,
    {
      method: 'POST',
      data,
    }
  );

export interface modifyAccountGroupRelationParams {
  modifyType: number;
  relationList: RelationList[];
}
export interface RelationList {
  ruleTmplGroupId: number;
  accountGroupId: number;
  controlMode?: number; // 新增修改时必填
  status?: number; // 新增修改时必填
  remark?: string;
}

// 设置账户组和模板绑定
export const modifyAccountGroupRelation = (
  data: modifyAccountGroupRelationParams
) =>
  request<CommonResponseIWrapper<any>>(
    `/aegis/api/ruleManager/modifyRuleTemplateGroupAccountGroupRelation`,
    {
      method: 'POST',
      data,
    }
  );
