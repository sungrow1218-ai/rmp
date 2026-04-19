import {
  AcctItem,
  AlterRuleSettingParam,
  ExportRiskRuleParam,
  QueryRuleSettingParam,
  QueryRuleSettingRspDTO,
  RuleRelaList,
} from './dto';
import {
  AlterRuleSettingIParam,
  ExportRiskRuleIParam,
  QueryRuleSettingIParam,
  QueryRuleSettingRspIDTO,
} from './idto';

// 规则查询-参数
export const parseQueryRuleSettingParam = (
  param: QueryRuleSettingParam
): QueryRuleSettingIParam => {
  const data: QueryRuleSettingIParam = {
    pageId: param.pageId,
    pageSize: param.pageSize,
    filterCondition: param.filterCondition
      ? {
          ruleId: param.filterCondition.ruleId,
          ruleName: param.filterCondition.ruleName,
          ruleStatus: param.filterCondition.ruleStatus,
          createUserCode: param.filterCondition.createUserCode,
          updateUserCode: param.filterCondition.updateUserCode,
          createBeginDate: param.filterCondition.createBeginDate,
          createEndDate: param.filterCondition.createEndDate,
          updateBeginDate: param.filterCondition.updateBeginDate,
          updateEndDate: param.filterCondition.updateEndDate,
          accountControlClass: param.filterCondition.acctControlClass
            ? param.filterCondition.acctControlClass.map((i) => ({
                controlAccountType: i.controlAcctType,
                accountLevel: i.acctLevel,
              }))
            : undefined,
          accountCode: param.filterCondition.acctCode,
          accountName: param.filterCondition.acctName,
          workGroupList: (param.filterCondition.workGroupList || []).map(
            (i) => ({ workGroupId: i.workGroupId, ruleType: i.ruleType })
          ),
        }
      : undefined,
  };
  return data;
};

// 规则查询-结果
export const parseQueryRuleSettingRsp = (
  idata: QueryRuleSettingRspIDTO
): QueryRuleSettingRspDTO => {
  const data: QueryRuleSettingRspDTO = {
    ruleBaseInfo: idata.ruleBaseInfo,
    ruleControlAcct: {
      controlAcctType: idata.ruleControlAccount.controlAccountType,
      excludeAcctType: idata.ruleControlAccount.excludeAccountType,
      unionControlType: idata.ruleControlAccount.unionControlType,
      acctLevel: idata.ruleControlAccount.accountLevel,
      excludeAcctLevel: idata.ruleControlAccount.excludeAccountLevel,
      controlAcctList: idata.ruleControlAccount.controlAccountList.map((i) => ({
        extSysId: i.tradeSystemId,
        marketId: i.marketId,
        accountCode: i.accountCode,
        bookLevel: i.bookLevel,
      })),
      excludeAcctList: idata.ruleControlAccount.excludeAccountList?.map(
        (i) => ({
          extSysId: i.tradeSystemId,
          marketId: i.marketId,
          accountCode: i.accountCode,
          bookLevel: i.bookLevel,
        })
      ),
    },
    ruleControlSecurity: {
      securityControlType: idata.ruleControlSecurity.securityControlType,
      securitySummaryType: idata.ruleControlSecurity.securitySummaryType,
      securitySummaryCondition:
        idata.ruleControlSecurity.securitySummaryCondition,
      marketId: idata.ruleControlSecurity.marketId,
      securityList: idata.ruleControlSecurity.securityList,
      excludeSecurityList: idata.ruleControlSecurity.excludeSecurityList,
      securitySetIdList: idata.ruleControlSecurity.secuSetIdList,
      securityFilterClassList: idata.ruleControlSecurity.secuFilterClassList,
    },
    generalThreshold: idata.generalThreshold,
    specialThreshold: idata.specialThreshold,
    ruleRelaList: idata.ruleRelationList
      ? idata.ruleRelationList.map((i) => ({
          ruleRelaType: i.ruleRelationType,
          relaRuleId: i.relatedRuleId,
          relaRuleType: i.relatedRuleType,
          relaRuleName: i.relatedRuleName,
          relaRulePriority: i.relatedRulePriority,
        }))
      : undefined,
    extParamList: idata.extendParamList
      ? idata.extendParamList.map((i) => ({
          ruleParamType: i?.ruleParameterType,
          ruleParamValue: i?.ruleParameterValue,
          ruleParamValue2: i?.ruleParameterValue2,
        }))
      : undefined,
    createUserCode: idata.createUserCode,
    updateUserCode: idata.updateUserCode,
    createDateTime: idata.createDateTime,
    lastUpdateTime: idata.lastUpdateTime,
    workGroupId: idata.workGroupId,
    createRoleId: idata.createRoleId,
  };
  return data;
};

// 规则设置-参数
export const parseAlterRuleSettingParam = (
  idata: DeepPartial<AlterRuleSettingParam>
): DeepPartial<AlterRuleSettingIParam> => {
  const data: DeepPartial<AlterRuleSettingIParam> = {
    modifyType: idata.alterType,
    ruleBaseInfo: idata.ruleBaseInfo,
    ruleControlAccount: {
      controlAccountType: idata.ruleControlAcct?.controlAcctType,
      excludeAccountType: idata.ruleControlAcct?.excludeAcctType,
      unionControlType: idata.ruleControlAcct?.unionControlType,
      accountLevel: idata.ruleControlAcct?.acctLevel,
      excludeAccountLevel: idata.ruleControlAcct?.excludeAcctLevel,
      controlAccountList:
        idata.ruleControlAcct && idata.ruleControlAcct.controlAcctList
          ? idata.ruleControlAcct.controlAcctList.map((i) => ({
              tradeSystemId: (i as Partial<AcctItem>).extSysId,
              marketId: (i as Partial<AcctItem>).marketId,
              accountCode: (i as Partial<AcctItem>).accountCode,
              bookLevel: (i as Partial<AcctItem>).bookLevel,
            }))
          : undefined,
      excludeAccountList:
        idata.ruleControlAcct && idata.ruleControlAcct.excludeAcctList
          ? idata.ruleControlAcct.excludeAcctList.map((i) => ({
              tradeSystemId: i.extSysId,
              marketId: i.marketId,
              accountCode: i.accountCode,
              bookLevel: i.bookLevel,
            }))
          : undefined,
    },
    ruleControlSecurity: {
      securityControlType: idata.ruleControlSecurity?.securityControlType,
      securitySummaryType: idata.ruleControlSecurity?.securitySummaryType,
      securitySummaryCondition:
        idata.ruleControlSecurity?.securitySummaryCondition,
      marketId: idata.ruleControlSecurity?.marketId,
      securityList: idata.ruleControlSecurity?.securityList,
      excludeSecurityList: idata.ruleControlSecurity?.excludeSecurityList,
      secuSetIdList: idata.ruleControlSecurity?.securitySetIdList,
      secuFilterClassList: idata.ruleControlSecurity?.securityFilterClassList,
    },
    generalThreshold: idata.generalThreshold,
    specialThreshold: idata.specialThreshold,
    ruleRelationList: idata.ruleRelaList
      ? idata.ruleRelaList.map((i) => ({
          ruleRelationType: (i as RuleRelaList).ruleRelaType,
          relatedRuleId: (i as RuleRelaList).relaRuleId,
          relatedRuleType: (i as RuleRelaList).relaRuleType,
          relatedRuleName: (i as RuleRelaList).relaRuleName,
          relatedRulePriority: (i as RuleRelaList).relaRulePriority,
        }))
      : undefined,
    extendParamList: idata.extParamList
      ? idata.extParamList.map((i) => ({
          ruleParameterType: i?.ruleParamType,
          ruleParameterValue: i?.ruleParamValue,
          ruleParameterValue2: i?.ruleParamValue2,
        }))
      : undefined,
    workGroupId: idata.workGroupId,
  };
  return data;
};

// 导出-参数
export const parseExportRiskRuleParam = (
  params: ExportRiskRuleParam
): DeepPartial<ExportRiskRuleIParam> => {
  const data: DeepPartial<ExportRiskRuleIParam> = {
    filterCondition: params.filterCondition
      ? {
          ruleId: params.filterCondition.ruleId,
          ruleName: params.filterCondition.ruleName,
          ruleStatus: params.filterCondition.ruleStatus,
          createUserCode: params.filterCondition.createUserCode,
          updateUserCode: params.filterCondition.updateUserCode,
          accountCode: params.filterCondition.acctCode,
          accountName: params.filterCondition.acctName,
          accountControlClass: params.filterCondition.acctControlClass
            ? params.filterCondition.acctControlClass.map((i) => ({
                controlAccountType: i.controlAcctType,
                accountLevel: i.acctLevel,
              }))
            : undefined,
          createBeginDate: params.filterCondition.createBeginDate,
          createEndDate: params.filterCondition.createEndDate,
          updateBeginDate: params.filterCondition.updateBeginDate,
          updateEndDate: params.filterCondition.updateEndDate,
          workGroupList: (params.filterCondition.workGroupList || []).map(
            (i) => ({
              workGroupId: i.workGroupId,
              ruleType: i.ruleType,
            })
          ),
        }
      : undefined,
  };
  return data;
};
