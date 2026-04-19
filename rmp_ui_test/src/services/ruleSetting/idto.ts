import { EffectiveFlag } from '@/pages/ruleSetting/RuleTemplateGroup/type';
import {
  GeneralThreshold,
  RuleBaseInfo,
  SecurityItem,
  SpecialThreshold,
} from './type';

export interface AcctItem {
  tradeSystemId: number | string;
  marketId?: number | string;
  accountCode: string | string;
  bookLevel: number | string;
}

export interface RuleControlAccount {
  controlAccountType: number | string;
  excludeAccountType: number | string;
  unionControlType: number | string;
  accountLevel?: number | string;
  excludeAccountLevel?: number | string;
  controlAccountList: Partial<AcctItem>[];
  excludeAccountList?: Partial<AcctItem>[];
}

// 查询规则-参数
export interface QueryRuleSettingIParam {
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
    accountControlClass?: {
      controlAccountType: number;
      accountLevel?: number;
    }[];
    accountCode?: string;
    accountName?: string;
    workGroupList: { workGroupId: number; ruleType: string[] }[];
  };
}

export interface RuleControlSecurity {
  securityControlType: number;
  securitySummaryType: number;
  securitySummaryCondition: number;
  marketId?: number[];
  securityList?: SecurityItem[];
  excludeSecurityList?: SecurityItem[];
  secuSetIdList?: number[];
  secuFilterClassList?: string[];
}

export interface RuleRelaList {
  ruleRelationType: number;
  relatedRuleId: number;
  relatedRuleType: string;
  relatedRuleName: string;
  relatedRulePriority: number;
}

// 查询规则-结果
export interface QueryRuleSettingRspIDTO {
  ruleBaseInfo: RuleBaseInfo;
  ruleControlAccount: RuleControlAccount;
  ruleControlSecurity: RuleControlSecurity;
  generalThreshold?: GeneralThreshold;
  specialThreshold?: SpecialThreshold;
  ruleRelationList?: RuleRelaList[];
  extendParamList?: {
    ruleParameterType: number;
    ruleParameterValue: string;
    ruleParameterValue2: string;
  }[];
  workGroupId: number;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
  createRoleId: number;
}

// 设置规则-参数
export interface AlterRuleSettingIParam {
  modifyType: number;
  workGroupId: number;
  ruleBaseInfo: RuleBaseInfo;
  ruleControlAccount: RuleControlAccount;
  ruleControlSecurity: RuleControlSecurity;
  generalThreshold?: GeneralThreshold;
  specialThreshold?: SpecialThreshold;
  ruleRelationList: RuleRelaList[];
  extendParamList: {
    ruleParameterType: number;
    ruleParameterValue: string;
    ruleParameterValue2: string;
  }[];
}

// 导出参数
export interface ExportRiskRuleIParam {
  filterCondition: {
    ruleId: number[];
    ruleName: string;
    ruleStatus: number[];
    createUserCode: string;
    updateUserCode: string;
    accountCode: string;
    accountName: string;
    accountControlClass: {
      controlAccountType: number;
      accountLevel: number;
    }[];
    createBeginDate: number;
    createEndDate: number;
    updateBeginDate: number;
    updateEndDate: number;
    workGroupList: { workGroupId: number; ruleType: string[] }[];
  };
}

// 规则模板组
export interface RuleTemplateGroupIDTO {
  ruleTmplGroupId: number;
  ruleTmplGroupName: string;
  description?: string;
  workGroupId: number;
  status: number;
  ruleTemplateList: { ruleTemplateId: number; ruleType: string }[];
  createRoleId: number;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
}

// 配置模板组入参
export interface ModifyRuleTemplateGroupParams {
  modifyType: number;
  ruleTmplGroupId: number;
  ruleTmplGroupName: string;
  description?: string;
  workGroupId: number;
  status: number;
  modRuleTmplList?: ModRuleTmpList[];
  delRuleTmplList?: {
    ruleTemplateId: number;
  }[];
}

// 单个模板配置

export interface ModRuleTmpList {
  ruleTemplateId: number;
  ruleType: string;
  securityGroupList: SecurityGroupList[];
}

export interface SecurityGroupList {
  securityGroupId: number;
  securityGroupName: string;
  securityControlType: number;
  securitySummaryType: number;
  securitySummaryCondition: number;
  secuSetIdList: number[];
  secuFilterClassList: string[];
  securityList: {
    securityCode: string;
    marketId: number;
  }[];
  excludeSecurityList?: {
    securityCode: string;
    marketId: number;
  }[];
  marketId: number[];
  thresholdList: {
    thresholdId?: number;
    warnLevel: number;
    compareDirection: number;
    value?: number;
    unit: number;
    factorType?: number;
    setType?: number;
    effectiveFlag?: EffectiveFlag;
  }[];
  extraParameterList?: {
    parameterType: number;
    parameterValue: string;
    parameterValue2?: string;
  }[];
  effectiveTimeList?: {
    beginTime: string;
    endTime: string;
  }[];
}

/**
 * 规则模板配置
 */
export interface modifyRuleTemplate {
  modifyType: number;
  ruleTmplGroupId: number;
  ruleTemplateId: number;
  ruleType: string;
  securityGroupList: SecurityGroupList[];
}

/**
 * 规则模板查询出参
 */
export interface RuleTemplateIDTO {
  ruleType: string;
  ruleTemplateId: number;
  securityGroupList: SecurityGroupList[];
  ruleTmplGroupId: number;
  workGroupId: number;
  createRoleId: number;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
}

// 规则模板默认配置
export interface RuleTemplateDefaultIDTO {
  rule_type: string;
  optional_market_list: number[];
  warn_value_percent: number;
  market_list: {
    market_id: number;
    security_group_list: {
      security_group_id: number;
      security_group_name: string;
      security_range: {
        security_control_type: number;
        security_summary_type: number;
        security_summary_condition: number;
        secu_set_id_list: number[];
        secu_filter_class_list: string[];
        security_list?: { security_code: string; market_id: number }[];
      };
      forbid_threshold_list: {
        factor_type: number;
        compare_direction: number;
        default_value: number;
        unit: number;
      }[];
      effective_time_list: { begin_time: string; end_time: string }[];
      ext_parameter_list: { parameter_type: number; parameter_value: string }[];
    }[];
  }[];
}

// 查询未绑定账户组列表 出 参

export interface UnBondAccountGroupData {
  accountGroupId: number;
  accountGroupName: string;
  bookType: number;
  bookLevel: number;
}
export interface UnBondTemplateGroupData {
  ruleTmplGroupId: number;
  ruleTmplGroupName: string;
  status: number;
}
