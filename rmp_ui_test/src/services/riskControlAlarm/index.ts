import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import {
  CommonResponseIWrapper,
  type CommonResponseWrapper,
  type RequestParameterPagination,
  type ResponseParameterPagination,
} from '../typing';
import {
  parseConfigurationData,
  parseExportWarningsParams,
  parseHistoryRiskWarningsData,
  parseSummaryRiskWarningsData,
  parseSummaryRiskWarningsParams,
  parseSummaryWarnDetailParams,
} from './parse';
import {
  QueryRiskWarnningsDataIDTO,
  ResultListIDTO,
  SummaryRiskListIDTO,
} from './Idto';

type TradeAcct = {
  bookLevel: number;
  acctCode: string;
  extSysId: number;
  marketId: number;
  acctName?: string;
};

export interface Condition {
  ruleId?: number;
  extSysId?: number[];
  extSubsysId?: number[];
  entrustCode?: string;
  beginDate?: string;
  endDate?: string;
  tradeAcct?: TradeAcct[];
  acctCode?: string;
  marketId?: number[];
  securityCode?: string;
  entrustDirection?: number[];
  priceType?: number;
  ruleType?: string[];
  warnOperation?: number[];
  workGroupId?: number[];
  grayFlag?: number[];
  ruleSource?: number; // 1单规则 2规则模板
  ruleTmplGroupId?: number; //
}

export interface QueryRiskWarnningsParams extends RequestParameterPagination {
  filterCondition?: Condition;
}

export interface SummaryRiskList {
  totalSize: number;
  warnSerialCode: string; // 触警流水序号
  businessDate: number; // 业务日期
  extSysId: number; // 外部系统序号,交易系统
  entrustCode: string; // 委托序号
  warnTime: number; // 触警时间
  entrustTime: number; // 委托时间
  baseManageAcctCode: string; // 管理基础账户 组合账户
  baseTradeAcctCode: string; // 交易基础账户 证券账户
  account: string; // 账户信息
  tradeSeatCode: string; // 交易席位编码
  marketId: string; // 交易市场 编号
  securityCode: string; // 证券代码
  entrustDirection: number; // 委托方向
  priceType: number; // 委托价格类型
  entrustPrice: number; // double委托价格
  entrustAmount: number; // double 委托数量
  ruleType: string; // 规则类型
  ruleId: number; // 合规规则序号 规则编号
  ruleName: string;
  warnOperation: string; // 触警操作
  warningOperationCode: number; // 触警操作code
  riskViolationOrigin: number; // 风控触警来源
  remark: string; // 触警描述
  grayFlag: number;
  lastUpdateTime: string;
  warnDetail: string;
  workGroupId: number;
  ruleTmplGroupId: number; //
  ruleTemplateId: number;
  ruleTmplGroupName: string;
  securityGroupId: number;
}

export interface QueryRiskDetailParams extends RequestParameterPagination {
  filterCondition?: SummaryDetailCondition;
}
export interface SummaryDetailCondition {
  endTime: string;
  ruleId?: number;
  extSysId?: number[];
  extSubsysId?: number[];
  entrustCode?: string;
  baseManageAcctCode: string;
  baseTradeAcctCode: string;
  marketId?: number[];
  securityCode: string;
  entrustDirection?: number[];
  priceType?: number;
  ruleType?: string[];
  warnOperation?: number[];
  workGroupId?: number[];
  grayFlag?: number[];
  ruleSource?: number; // 1单规则 2规则模板
  ruleTmplGroupId?: number; //
  ruleTemplateId?: number;
  securityGroupId?: number;
}

export interface QueryRiskWarnningsData extends ResponseParameterPagination {
  warnCount: number;
  forbidCount: number;
  noPromptCount: number;
  totalCount: number;
  resultList: SummaryRiskList[]; // 结果列表
}

/**
 *
 * @param 当日查询
 * @returns
 */
export async function querySummaryRiskWarnings(
  params: QueryRiskWarnningsParams
) {
  return parseRequest<QueryRiskWarnningsDataIDTO, QueryRiskWarnningsData>(
    request(`/aegis/api/ruleManager/querySummaryRiskWarnings`, {
      method: 'POST',
      data: parseSummaryRiskWarningsParams(params),
    }),
    parseSummaryRiskWarningsData
  );
}

/**
 * 当日汇总信息
 */

export async function querySummaryRiskDetail(params: QueryRiskDetailParams) {
  return parseRequest<QueryRiskWarnningsDataIDTO, QueryRiskWarnningsData>(
    request(`/aegis/api/ruleManager/querySummaryRiskWarningDetail`, {
      method: 'POST',
      data: parseSummaryWarnDetailParams(params),
    }),
    parseSummaryRiskWarningsData
  );
}

/**
 *
 * 历史查询
 * @returns
 */
export async function queryHistRiskWarnnings(params: QueryRiskWarnningsParams) {
  return parseRequestByPage<SummaryRiskListIDTO, SummaryRiskList>(
    request(`/aegis/api/ruleManager/queryHisRiskWarnings`, {
      method: 'POST',
      data: parseSummaryRiskWarningsParams(params),
    }),
    parseHistoryRiskWarningsData
  );
}

export async function exportRiskWarnings(params: QueryRiskWarnningsParams) {
  return parseRequest<{ fileId: string }>(
    request(`/aegis/api/ruleManager/exportRiskWarnings`, {
      method: 'POST',
      data: parseExportWarningsParams(params),
    })
  );
}

export async function exportHisRiskWarnings(params: QueryRiskWarnningsParams) {
  return parseRequest<{ fileId: string }>(
    request(`/aegis/api/ruleManager/exportHisRiskWarnings`, {
      method: 'POST',
      data: parseExportWarningsParams(params),
    })
  );
}

// 获取导出文件的下载地址
export async function queryFileExportUrl(params: { fileId: string }) {
  return request<
    CommonResponseIWrapper<{
      fileUrl: string;
      totalSize: number;
      progressPercentage: string;
    }>
  >(`/aegis/api/ruleManager/queryFileExportUrl`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 个性化配置
 */

interface ConfigurationParams extends RequestParameterPagination {
  filterCondition?: {
    userCode?: string;
    menuId?: number;
  };
}

export interface ConfigurationData extends ResponseParameterPagination {
  resultList: ResultList[];
}

export type ResultList = {
  userCode: string;
  menuId: number;
  configuration: string;
  createUserNo: string;
  updateUserNo: string;
  createDateTime: string;
  lastUpdateTime: string;
};

export async function queryUserMenuConfiguration(params: ConfigurationParams) {
  return parseRequestByPage<ResultListIDTO, ResultList>(
    request(`/aegis/api/ops/queryUserMenuConfiguration`, {
      method: 'POST',
      data: params,
    }),
    parseConfigurationData
  );
}

export async function alterUserMenuConfiguration(params: {
  userCode: string;
  menuId: number;
  configuration: string;
}) {
  return parseRequest<any>(
    request(`/aegis/api/ops/modifyUserMenuConfiguration`, {
      method: 'POST',
      data: params,
    })
  );
}

export interface ColumnConfig {
  colName: string;
  show: number;
  key: string;
}

export interface WarnRemarkData {
  indexName: string;
  indexValue: number;
  operation: number;
  warnThreshold: number | 'inf' | '-inf' | 'NAN';
  banThreshold: number | 'inf' | '-inf' | 'NAN';
  ignoreThreshold: number | 'inf' | '-inf' | 'NAN';
  orderPrice?: number;
  orderDirection?: number;
  statisticsType?: number; // Q5专用 1-金额，2-数量，10001-次数
  timeWind?: string; // 时间窗口 Q5专用
  contraMode?: number; // 1 买》 卖  2 有买有卖
  comparePrice?: number; // H类比较价格
  controlPrice?: number; // H类控制价格
  calcType?: number; // H类价格偏离度
  marketId?: number;
  calcMode?: number; // 1-按金额计算，2-按数量计算 f1 专用
  operationType?: number; // 4-不控制，8-控制买，9-控制卖，10-控制买卖  I1类专用
  precondition?: string; // 前置条件 Z4类专用
  securityCode?: string;
  timeInterval?: string;
  bucketPrice?: number;
  bucketSysNo?: number;
  bucketSubSysNo?: number;
  bucketAcctCode?: number;
  bucketAcctLevel?: number;
  bucketAcctType?: number; // 1-交易 2-管理
  bucketEntrustNo?: number;
  factorResult?: FactorResult[];
}

export interface FactorResult {
  factorType: number;
  factorValue: number;
  operation?: number;
  warnThreshold?: 'inf' | '-inf' | 'NAN';
  banThreshold?: 'inf' | '-inf' | 'NAN';
  ignoreThreshold?: number | 'inf' | '-inf' | 'NAN';
}
