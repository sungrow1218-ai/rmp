import {
  RequestParameterPagination,
  ResponseParameterPagination,
} from '../typing';

// 当日查询
export interface ConditionIDTO {
  ruleId?: number;
  tradeSystemId?: number[];
  entrustCode?: string;
  beginDate?: string;
  endDate?: string;
  accountCode?: string;
  marketId?: number[];
  securityCode?: string;
  entrustDirection?: number[];
  priceType?: number;
  ruleType?: string[];
  warningOperation?: number[];
  workGroupId?: number[];
  grayFlag?: number[];
  ruleSource?: number; // 1单规则 2规则模板
  ruleTmplGroupId?: number; //
}

export interface QueryRiskWarnningsParamsIDTO
  extends RequestParameterPagination {
  filterCondition?: ConditionIDTO;
}

export interface QueryRiskWarnningsDataIDTO
  extends ResponseParameterPagination {
  warningCount: number;
  forbidCount: number;
  noPromptCount: number;
  totalCount: number;
  resultList: SummaryRiskListIDTO[]; // 结果列表
}

export interface SummaryRiskListIDTO {
  totalSize: number;
  warningSerialCode: string; // 触警流水序号
  businessDate: number; // 业务日期
  tradeSystemId: number; // 外部系统序号,交易系统
  entrustCode: string; // 委托序号
  warningTime: number; // 触警时间
  entrustTime: number; // 委托时间
  baseManageAcctCode: string; // 管理基础账户 组合账户
  baseTradeAcctCode: string; // 交易基础账户 证券账户
  account: string; // 账户信息
  seatCode: string; // 交易席位编码
  marketId: string; // 交易市场 编号
  securityCode: string; // 证券代码
  entrustDirection: number; // 委托方向
  priceType: number; // 委托价格类型
  entrustPrice: number; // double委托价格
  entrustAmount: number; // double 委托数量
  ruleType: string; // 规则类型
  ruleId: number; // 合规规则序号 规则编号
  ruleName: string;
  warningOperation: string; // 触警操作
  warningOperationCode: number; // 触警操作code
  riskViolationOrigin: number; // 风控触警来源
  remark: string; // 触警描述
  grayFlag: number;
  lastUpdateTime: string;
  warningDetail: string;
  workGroupId: number;
  ruleTmplGroupId: number; //
  ruleTemplateId: number;
  ruleTmplGroupName: string;
  securityGroupId: number;
}

// 当日汇总明细 - 入参

export interface QueryRiskDetailParamsIDTO extends RequestParameterPagination {
  filterCondition?: SummaryDetailCondition;
}
export interface SummaryDetailCondition {
  endTime: string;
  ruleId?: number;
  tradeSystemId?: number[];
  entrustCode?: string;
  baseManageAcctCode: string;
  baseTradeAcctCode: string;
  marketId?: number[];
  securityCode: string;
  entrustDirection?: number[];
  ruleType?: string[];
  warningOperation?: number[];
  workGroupId?: number[];
  grayFlag?: number[];
  ruleSource?: number; // 1单规则 2规则模板
  ruleTmplGroupId?: number; //
  ruleTemplateId?: number;
  securityGroupId?: number;
}

export type ResultListIDTO = {
  userCode: string;
  menuId: number;
  configuration: string;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
};
