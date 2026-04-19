import {
  GeneralThreshold,
  RuleBaseInfo,
  SecurityItem,
  SpecialThreshold,
} from './type';

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

export interface RuleControlSecurity {
  securityControlType: number;
  securitySummaryType: number;
  securitySummaryCondition: number;
  marketId?: number[];
  securityList?: SecurityItem[];
  excludeSecurityList?: SecurityItem[];
  // 按照券池、动态维度、现货限仓表等证券集合类对象控制时，须填写这些集合类的id，格式：[1,2,3]
  securitySetIdList?: number[];
  // 按照证券类别 、期货品种、期权品种等控制时，须填写过滤分类标准，格式：["1","al","cu"]
  securityFilterClassList?: string[];
}

export interface RuleRelaList {
  ruleRelaType: number;
  relaRuleId: number;
  relaRuleType: string;
  relaRuleName: string;
  relaRulePriority: number;
}

// 查询规则-参数
export interface QueryRuleSettingParam {
  pageId: number;
  pageSize: number;
  filterCondition?: {
    ruleId?: number[];
    ruleName?: string;
    ruleStatus?: number[];
    createUserCode?: string;
    updateUserCode?: string;
    createBeginDate?: number;
    createEndDate?: number;
    updateBeginDate?: number;
    updateEndDate?: number;
    acctControlClass?: {
      controlAcctType: number;
      acctLevel?: number;
    }[];
    acctCode?: string;
    acctName?: string;
    workGroupList: { workGroupId: number; ruleType: string[] }[];
  };
}

// 查询规则-结果
export interface QueryRuleSettingRspDTO {
  ruleBaseInfo: RuleBaseInfo;
  ruleControlAcct: RuleControlAcct;
  ruleControlSecurity: RuleControlSecurity;
  generalThreshold?: GeneralThreshold;
  specialThreshold?: SpecialThreshold;
  ruleRelaList?: RuleRelaList[];
  extParamList?: {
    ruleParamType: number;
    ruleParamValue: string;
    ruleParamValue2: string;
  }[];
  createUserCode: string;
  workGroupId: number;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
  createRoleId: number;
}

// 设置规则-参数
export interface AlterRuleSettingParam {
  alterType: number;
  workGroupId: number;
  ruleBaseInfo: RuleBaseInfo;
  ruleControlAcct: RuleControlAcct;
  ruleControlSecurity: RuleControlSecurity;
  generalThreshold?: GeneralThreshold;
  specialThreshold?: SpecialThreshold;
  ruleRelaList: RuleRelaList[];
  extParamList: {
    ruleParamType: number;
    ruleParamValue: string;
    ruleParamValue2: string;
  }[];
}

// 导出参数
export interface ExportRiskRuleParam {
  filterCondition: {
    ruleId: number[];
    ruleName: string;
    ruleStatus: number[];
    createUserCode: string;
    updateUserCode: string;
    acctCode: string;
    acctName: string;
    acctControlClass: {
      controlAcctType: number;
      acctLevel: number;
    }[];
    createBeginDate: number;
    createEndDate: number;
    updateBeginDate: number;
    updateEndDate: number;
    workGroupList: { workGroupId: number; ruleType: string[] }[];
  };
}
