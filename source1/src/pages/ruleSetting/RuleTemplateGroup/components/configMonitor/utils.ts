// 监控版本规则模板工具函数
import { SecurityGroup, RiskLevel } from '../../type';
import ruleTemplates from './index';

// 获取规则模板配置
export function getRuleTemplateConfig(ruleType: string) {
  return ruleTemplates[ruleType] || [];
}

// 根据因子类型获取阈值项（监控版本）
export function getThresholdByFactorType(
  securityGroup: SecurityGroup,
  factorType: number
) {
  return securityGroup.thresholdList.find(
    item => item.factorType === factorType
  );
}

// 获取三级阈值中的特定级别值
export function getThresholdValueByLevel(
  thresholdValue: number | Recordable<number> | undefined,
  riskLevel: RiskLevel
): number | undefined {
  if (thresholdValue === undefined || thresholdValue === null) {
    return undefined;
  }

  if (typeof thresholdValue === 'number') {
    // 如果是数字，直接返回（兼容旧版本）
    return thresholdValue;
  }

  // 如果是对象，获取对应级别的值
  return thresholdValue[riskLevel];
}

// 格式化阈值值
export function formatThresholdValue(value: number | undefined, suffix: string): string {
  if (value === undefined || value === null) return '-';
  return `${value}${suffix}`;
}

// 获取市场名称
export function getMarketName(marketId: number): string {
  const marketMap: Record<number, string> = {
    1: '上海证券交易所 (SH)',
    2: '深圳证券交易所 (SZ)',
    3: '上期所',
    4: '大商所',
    5: '郑商所',
    6: '中金所',
    7: '能源中心',
    8: '广期所',
  };
  return marketMap[marketId] || `市场${marketId}`;
}

// 获取证券组名称
export function getSecurityGroupName(securityGroupId: number): string {
  const groupMap: Record<number, string> = {
    1: '风险警示股',
    2: '上证50成分股',
    3: '非上证50非风险警示股',
    101: '风险警示股',
    102: '非风险警示股',
  };
  return groupMap[securityGroupId] || `证券组${securityGroupId}`;
}

// 渲染模板字符串（监控版本）
export function renderTemplate(
  template: string,
  securityGroup: SecurityGroup,
  riskLevel: RiskLevel = RiskLevel.INTERCEPT
): string {
  if (!securityGroup || !securityGroup.thresholdList) {
    return template;
  }

  // 匹配模板中的$参数，如$15, $16等
  return template.replace(/\$(\d+)/g, (match, factorTypeStr) => {
    const factorType = parseInt(factorTypeStr, 10);
    const threshold = getThresholdByFactorType(securityGroup, factorType);

    if (threshold) {
      // 根据因子类型确定后缀
      let suffix = '';
      if (factorType === 15 || factorType === 35) suffix = '万元';
      if (factorType === 16 || factorType === 36) suffix = '万股';
      if (factorType === 17 || factorType === 18 || factorType === 19 || factorType === 20 || factorType === 38) suffix = '%';
      if (factorType === 21 || factorType === 22) suffix = '次';

      // 获取对应级别的值
      const value = getThresholdValueByLevel(threshold.value, riskLevel);
      const defaultValue = getThresholdValueByLevel(threshold.defaultValue, riskLevel);

      // 使用实际值，如果没有则使用默认值
      const displayValue = value !== undefined ? value : defaultValue;
      return `<span class="threshold-value">${displayValue !== undefined ? displayValue : '-'}</span><span class="unit-suffix">${suffix}</span>`;
    }

    return match;
  });
}

// 渲染三级阈值显示
export function renderMultiThreshold(
  template: string,
  securityGroup: SecurityGroup
): string {
  if (!securityGroup || !securityGroup.thresholdList) {
    return template;
  }

  // 匹配模板中的$参数
  return template.replace(/\$(\d+)/g, (match, factorTypeStr) => {
    const factorType = parseInt(factorTypeStr, 10);
    const threshold = getThresholdByFactorType(securityGroup, factorType);

    if (threshold) {
      // 根据因子类型确定后缀
      let suffix = '';
      if (factorType === 15 || factorType === 35) suffix = '万元';
      if (factorType === 16 || factorType === 36) suffix = '万股';
      if (factorType === 17 || factorType === 18 || factorType === 19 || factorType === 20 || factorType === 38) suffix = '%';
      if (factorType === 21 || factorType === 22) suffix = '次';

      const value = threshold.value !== undefined ? threshold.value : threshold.defaultValue;

      if (value !== undefined && typeof value === 'object') {
        // 获取三级值
        const notipValue = value[RiskLevel.NOTIP];
        const warningValue = value[RiskLevel.WARNING];
        const interceptValue = value[RiskLevel.INTERCEPT];

        // 显示三级阈值（单位在数字框外面）
        return `<span class="multi-threshold">不提示:${notipValue !== undefined ? notipValue : '-'}/预警:${warningValue !== undefined ? warningValue : '-'}/拦截:${interceptValue !== undefined ? interceptValue : '-'}</span><span class="unit-suffix">${suffix}</span>`;
      } else {
        // 如果是单值，显示为拦截级别，其他级别为-
        return `<span class="multi-threshold">不提示:-/预警:-/拦截:${value !== undefined ? value : '-'}</span><span class="unit-suffix">${suffix}</span>`;
      }
    }

    return match;
  });
}

// 获取所有市场ID
export function getAllMarketIds(ruleTemplate: any): number[] {
  return ruleTemplate.marketList ? ruleTemplate.marketList.map((market: any) => market.marketId) : [];
}

// 获取市场数据
export function getMarketData(ruleTemplate: any, marketId: number) {
  return ruleTemplate.marketList ? ruleTemplate.marketList.find((market: any) => market.marketId === marketId) : null;
}

// 检查是否包含预警级别
export function hasWarningLevel(ruleTemplate: any): boolean {
  return ruleTemplate.defaultWarnLevel ? ruleTemplate.defaultWarnLevel.includes(RiskLevel.WARNING) : false;
}