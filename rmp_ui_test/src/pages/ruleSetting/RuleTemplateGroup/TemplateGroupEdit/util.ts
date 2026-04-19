import {
  RuleTemplateIDTO,
  RuleTemplateDefaultIDTO,
  ModRuleTmpList,
  SecurityGroupList,
} from '@/services/ruleSetting/idto';
import {
  EffectiveFlag,
  RiskLevel,
  RuleTypeTemplate,
  SecurityGroup,
  SetType,
} from '../type';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import Bigjs from 'big.js';

/**
 * 广度优先遍历树结构
 * @param data 树形数据数组
 * @param childrenKey 子节点对应的属性名（如 'children' | 'subNodes'）
 * @returns 扁平化后的所有节点数组
 */
export const getAllNodesBFS = <T, K extends keyof T>(
  data: T[],
  childrenKey: K
): T[] => {
  const result: T[] = [];
  const queue: T[] = [...data];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node) {
      result.push(node);
      const children = node[childrenKey] as unknown as T[] | undefined;
      if (children && Array.isArray(children) && children.length > 0) {
        queue.push(...children);
      }
    }
  }
  return result;
};

/**
 * 遍历树结构获取所有叶子节点
 * @param data 树形数据数组
 * @param childrenKey 子节点对应的属性名（如 'children' | 'subNodes'）
 * @returns 扁平化后的所有节点数组
 */
export const getLeafNodesAdvanced = <T>(
  data: T[],
  childrenKey: keyof T = 'children' as keyof T
): T[] => {
  let leaves: T[] = [];
  data.forEach((node) => {
    const children = node[childrenKey] as unknown as T[];
    if (!children || children.length === 0) {
      leaves.push(node);
    } else {
      leaves = leaves.concat(getLeafNodesAdvanced(children, childrenKey));
    }
  });
  return leaves;
};

/**
 * 合并默认参数和设置值
 * @param defaultParams 默认参数模板
 * @param values 值
 * @return 模板
 */
export const mergeDefaultParamAndValue = (
  defaultParams: RuleTemplateDefaultIDTO,
  values: RuleTemplateIDTO | undefined
): RuleTypeTemplate => {
  const ruleTypeTemplate: RuleTypeTemplate = {
    ruleType: defaultParams.rule_type,
    ruleTemplateId: values ? values.ruleTemplateId : 0,
    optionalMarketList: defaultParams.optional_market_list.map((i) => ({
      marketId: i,
      marketName: transformDictCodeToNameHelper(`${i}`, TRADING_MARKETS),
    })),
    defaultMarket: values
      ? values.securityGroupList[0].marketId
      : defaultParams.optional_market_list,
    optionalWarnLevelList: [
      { label: '拦截', value: RiskLevel.INTERCEPT },
      { label: '预警', value: RiskLevel.WARNING },
    ],
    defaultWarnLevel: [RiskLevel.INTERCEPT, RiskLevel.WARNING],
    warnValueDefaultPercent:
      values?.securityGroupList[0].extraParameterList?.find(
        (e) => e.parameterType === 19996
      )?.parameterValue2
        ? Number(
            values?.securityGroupList[0].extraParameterList?.find(
              (e) => e.parameterType === 19996
            )?.parameterValue2
          )
        : defaultParams.warn_value_percent,
    marketList: defaultParams.market_list.map((m) => ({
      marketId: m.market_id,
      marketName: transformDictCodeToNameHelper(
        `${m.market_id}`,
        TRADING_MARKETS
      ),
      securityGroupList: m.security_group_list.map((s) => {
        const sValue = values
          ? values.securityGroupList.find(
              (i) => i.securityGroupId === s.security_group_id
            )
          : undefined;
        return {
          securityGroupId: s.security_group_id,
          securityGroupName: s.security_group_name,
          securityControlType: sValue
            ? sValue.securityControlType
            : s.security_range.security_control_type,
          securitySummaryType: sValue
            ? sValue.securitySummaryType
            : s.security_range.security_summary_type,
          securitySummaryCondition: sValue
            ? sValue.securitySummaryCondition
            : s.security_range.security_summary_condition,
          secuSetIdList: sValue
            ? sValue.secuSetIdList
            : s.security_range.secu_set_id_list,
          secuFilterClassList: sValue
            ? sValue.secuFilterClassList
            : s.security_range.secu_filter_class_list,
          securityList: sValue
            ? sValue.securityList
            : s.security_range.security_list?.map((i) => ({
                securityCode: i.security_code,
                marketId: i.market_id,
              })),
          thresholdList: s.forbid_threshold_list.map((i) => {
            const tValue = sValue?.thresholdList.find(
              (t) =>
                t.factorType === i.factor_type &&
                t.warnLevel === RiskLevel.INTERCEPT
            );
            return {
              thresholdId: tValue ? tValue.thresholdId : undefined,
              warnLevel: tValue ? tValue.warnLevel : undefined,
              compareDirection: tValue
                ? tValue.compareDirection
                : i.compare_direction,
              value: tValue ? tValue.value : undefined,
              setType: tValue ? tValue.setType : SetType.DEFAULT,
              factorType: tValue ? tValue.factorType : i.factor_type,
              defaultValue: i.default_value,
              unit: tValue ? tValue.unit : i.unit,
            };
          }),
          effectiveTimeList: sValue
            ? sValue.effectiveTimeList
            : s.effective_time_list.map((i) => ({
                beginTime: i.begin_time,
                endTime: i.end_time,
              })),
          extParameterList: sValue
            ? sValue.excludeSecurityList
            : s.ext_parameter_list.map((i) => ({
                parameterType: i.parameter_type,
                parameterValue: i.parameter_value,
              })),
        } as SecurityGroup;
      }),
    })),
  };
  // 设置警告级别
  if (values && values.securityGroupList.length > 0) {
    const warnLevel: RiskLevel[] = [];
    const securityGroup = values.securityGroupList[0];
    // 预警
    if (
      securityGroup.thresholdList &&
      securityGroup.thresholdList.some((i) => i.warnLevel === RiskLevel.WARNING)
    ) {
      warnLevel.push(RiskLevel.WARNING);
    }
    // 禁止
    if (
      securityGroup.thresholdList &&
      securityGroup.thresholdList.some(
        (i) =>
          i.warnLevel === RiskLevel.INTERCEPT &&
          i.effectiveFlag === EffectiveFlag.ON
      )
    ) {
      warnLevel.push(RiskLevel.INTERCEPT);
    }
    ruleTypeTemplate.defaultWarnLevel = warnLevel;
  }
  return ruleTypeTemplate;
};

/**
 * 转换模板数据为参数
 * @param tmpl 模板数据
 * @return 请求参数
 */
export const parseRuleTypeTemplateToModRuleTmpList = (
  tmpl: RuleTypeTemplate
): ModRuleTmpList => {
  const result: ModRuleTmpList = {
    ruleTemplateId: tmpl.ruleTemplateId,
    ruleType: tmpl.ruleType,
    securityGroupList: [],
  };
  for (const market of tmpl.marketList.filter((i) =>
    tmpl.defaultMarket.includes(i.marketId)
  ) || []) {
    for (const securityGroup of market.securityGroupList) {
      const item: SecurityGroupList = {
        securityGroupId: securityGroup.securityGroupId,
        securityGroupName: securityGroup.securityGroupName,
        securityControlType: securityGroup.securityControlType,
        securitySummaryType: securityGroup.securitySummaryType,
        securitySummaryCondition: securityGroup.securitySummaryCondition,
        secuSetIdList: securityGroup.secuSetIdList,
        secuFilterClassList: securityGroup.secuFilterClassList,
        securityList: securityGroup.securityList,
        marketId: tmpl.defaultMarket,
        extraParameterList: securityGroup.extParameterList,
        effectiveTimeList: securityGroup.effectiveTimeList,
        thresholdList: [],
      };
      // 阈值转换
      for (const thresholdItem of securityGroup.thresholdList) {
        const effectiveFlag = tmpl.defaultWarnLevel.includes(
          RiskLevel.INTERCEPT
        )
          ? EffectiveFlag.ON
          : EffectiveFlag.OFF;
        // 预警值
        if (tmpl.defaultWarnLevel.includes(RiskLevel.WARNING)) {
          item.thresholdList.push({
            thresholdId: thresholdItem.thresholdId,
            warnLevel: RiskLevel.WARNING,
            compareDirection: thresholdItem.compareDirection,
            value:
              /**
               * 单位为次的时候向上取整
               * 按比例调整后，2以下的数字向上取整数；2以上的数字向下取整
               */
              thresholdItem.unit === 1
                ? Number(
                    new Bigjs(
                      (thresholdItem.value as number) ??
                        thresholdItem.defaultValue
                    )
                      .times(tmpl.warnValueDefaultPercent as number)
                      .gt(new Bigjs(2))
                      ? new Bigjs(
                          (thresholdItem.value as number) ??
                            thresholdItem.defaultValue
                        )
                          .times(tmpl.warnValueDefaultPercent as number)
                          .round(0, 0)
                      : new Bigjs(
                          (thresholdItem.value as number) ??
                            thresholdItem.defaultValue
                        )
                          .times(tmpl.warnValueDefaultPercent as number)
                          .round(0, 3)
                  )
                : Number(
                    new Bigjs(
                      (thresholdItem.value as number) ??
                        thresholdItem.defaultValue
                    )
                      .times(tmpl.warnValueDefaultPercent as number)
                      .toFixed(2)
                  ),
            unit: thresholdItem.unit,
            factorType: thresholdItem.factorType,
          });
        }
        item.thresholdList.push({
          thresholdId: thresholdItem.thresholdId,
          warnLevel: RiskLevel.INTERCEPT,
          compareDirection: thresholdItem.compareDirection,
          value: (thresholdItem.value as number) ?? thresholdItem.defaultValue,
          unit: thresholdItem.unit,
          factorType: thresholdItem.factorType,
          setType: thresholdItem.setType,
          effectiveFlag,
        });
      }
      // 特殊处理是否预警
      const target = item.extraParameterList?.find(
        (i) => i.parameterType === 19996
      );
      if (target) {
        target.parameterValue = tmpl.defaultWarnLevel.includes(
          RiskLevel.WARNING
        )
          ? '1'
          : '0';
        target.parameterValue2 = tmpl.defaultWarnLevel.includes(
          RiskLevel.WARNING
        )
          ? `${tmpl.warnValueDefaultPercent as number}`
          : undefined;
      } else if (item.extraParameterList) {
        item.extraParameterList.push({
          parameterType: 19996,
          parameterValue: tmpl.defaultWarnLevel.includes(RiskLevel.WARNING)
            ? '1'
            : '0',
          parameterValue2: tmpl.defaultWarnLevel.includes(RiskLevel.WARNING)
            ? `${tmpl.warnValueDefaultPercent as number}`
            : undefined,
        });
      } else {
        item.extraParameterList = [
          {
            parameterType: 19996,
            parameterValue: tmpl.defaultWarnLevel.includes(RiskLevel.WARNING)
              ? '1'
              : '0',
            parameterValue2: tmpl.defaultWarnLevel.includes(RiskLevel.WARNING)
              ? `${tmpl.warnValueDefaultPercent as number}`
              : undefined,
          },
        ];
      }
      result.securityGroupList.push(item);
    }
  }
  return result;
};
