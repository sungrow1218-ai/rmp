import { RuleTypeTemplate, SecurityGroup } from './ruleTemplateTypes';
import { RuleTemplateDefaultIDTO, RuleTemplateIDTO } from './ruleTemplateTypes';

/**
 * 验证规则模板数据的完整性
 */
export function validateRuleTemplateData(
  template: RuleTypeTemplate,
  ruleType: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!template) {
    errors.push('模板数据为空');
    return { isValid: false, errors };
  }

  if (!template.ruleType) {
    errors.push('规则类型为空');
  }

  if (!template.marketList || template.marketList.length === 0) {
    errors.push('市场列表为空');
  } else {
    template.marketList.forEach((market, marketIndex) => {
      if (!market.securityGroupList || market.securityGroupList.length === 0) {
        errors.push(`市场 ${market.marketName} (${market.marketId}) 的证券组列表为空`);
      } else {
        market.securityGroupList.forEach((securityGroup, groupIndex) => {
          if (!securityGroup.thresholdList || securityGroup.thresholdList.length === 0) {
            errors.push(`证券组 ${securityGroup.securityGroupName} 的阈值列表为空`);
          } else {
            securityGroup.thresholdList.forEach((threshold, thresholdIndex) => {
              if (threshold.value === undefined && threshold.defaultValue === undefined) {
                errors.push(
                  `阈值 ${threshold.factorType} 的值和默认值都未定义`
                );
              }
            });
          }
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 修复规则模板数据中的常见问题
 */
export function fixRuleTemplateData(
  template: RuleTypeTemplate,
  defaultData?: RuleTemplateDefaultIDTO
): RuleTypeTemplate {
  const fixedTemplate = { ...template };

  // 确保市场列表存在
  if (!fixedTemplate.marketList) {
    fixedTemplate.marketList = [];
  }

  // 修复每个市场的证券组数据
  fixedTemplate.marketList = fixedTemplate.marketList.map(market => {
    const fixedMarket = { ...market };

    if (!fixedMarket.securityGroupList) {
      fixedMarket.securityGroupList = [];
    }

    // 修复证券组阈值数据
    fixedMarket.securityGroupList = fixedMarket.securityGroupList.map(securityGroup => {
      const fixedGroup = { ...securityGroup };

      if (!fixedGroup.thresholdList) {
        fixedGroup.thresholdList = [];
      }

      // 为每个阈值确保有值
      fixedGroup.thresholdList = fixedGroup.thresholdList.map(threshold => {
        const fixedThreshold = { ...threshold };

        // 如果值未定义，尝试使用默认值
        if (fixedThreshold.value === undefined || fixedThreshold.value === null) {
          fixedThreshold.value = fixedThreshold.defaultValue;
        }

        // 确保有单位
        if (fixedThreshold.unit === undefined) {
          fixedThreshold.unit = 1; // 默认单位
        }

        return fixedThreshold;
      });

      return fixedGroup;
    });

    return fixedMarket;
  });

  return fixedTemplate;
}

/**
 * 创建回退数据用于调试
 */
export function createFallbackTemplateData(ruleType: string): RuleTypeTemplate {
  console.log(`为规则类型 ${ruleType} 创建回退数据`);

  return {
    ruleType,
    ruleTemplateId: 0,
    optionalMarketList: [
      { marketId: 1, marketName: '上交所' },
      { marketId: 2, marketName: '深交所' },
    ],
    defaultMarket: [1],
    optionalWarnLevelList: [
      { label: '拦截', value: 2 },
      { label: '预警', value: 1 },
    ],
    defaultWarnLevel: [2],
    warnValueDefaultPercent: 0.8,
    marketList: [
      {
        marketId: 1,
        marketName: '上交所',
        securityGroupList: [
          {
            securityGroupId: 1,
            securityGroupName: '默认证券组',
            securityControlType: 1,
            securitySummaryType: 1,
            securitySummaryCondition: 1,
            secuSetIdList: [1],
            secuFilterClassList: ['10'],
            securityList: [
              { securityCode: '000001', marketId: 1 }
            ],
            thresholdList: [
              {
                thresholdId: 1,
                factorType: 15,
                compareDirection: 1,
                value: 100,
                defaultValue: 100,
                unit: 4,
                setType: 1,
              },
              {
                thresholdId: 2,
                factorType: 16,
                compareDirection: 1,
                value: 50,
                defaultValue: 50,
                unit: 1,
                setType: 1,
              },
            ],
            effectiveTimeList: [
              { beginTime: '09:30:00', endTime: '11:30:00' },
              { beginTime: '13:00:00', endTime: '15:00:00' },
            ],
            extParameterList: [
              { parameterType: 1, parameterValue: 'default', parameterValue2: '' }
            ],
          },
        ],
      },
    ],
  };
}

/**
 * 检查接口响应数据
 */
export function checkApiResponse(response: any, apiName: string): boolean {
  if (!response) {
    console.error(`${apiName}: 响应为空`);
    return false;
  }

  if (response.errorId !== 0) {
    console.error(`${apiName}: 响应码非0`, response);
    return false;
  }

  if (!response.data) {
    console.error(`${apiName}: 响应数据为空`);
    return false;
  }

  return true;
}