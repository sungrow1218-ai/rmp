// 规则模板工具函数
import { RuleTypeTemplate, SecurityGroup, ThresholdItem } from '@/services/ruleTemplateTypes';
import { RiskLevel } from '@/services/ruleTemplateTypes';
import ruleTemplates from './index';

// 获取规则模板配置
export function getRuleTemplateConfig(ruleType: string) {
  return ruleTemplates[ruleType] || [];
}

// 根据因子类型获取阈值项
export function getThresholdByFactorType(
  securityGroup: SecurityGroup,
  factorType: number,
  riskLevel: RiskLevel = RiskLevel.INTERCEPT
): ThresholdItem | undefined {
  return securityGroup.thresholdList.find(
    item => item.factorType === factorType && item.warnLevel === riskLevel
  );
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

// 渲染模板字符串
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
    const threshold = getThresholdByFactorType(securityGroup, factorType, riskLevel);

    if (threshold) {
      // 根据因子类型确定后缀
      let suffix = '';
      if (factorType === 15 || factorType === 35) suffix = '万元';
      if (factorType === 16 || factorType === 36) suffix = '万股';
      if (factorType === 17 || factorType === 18 || factorType === 19 || factorType === 20 || factorType === 38) suffix = '%';
      if (factorType === 21 || factorType === 22) suffix = '次';

      // 使用实际值，如果没有则使用默认值
      const value = threshold.value !== undefined ? threshold.value : threshold.defaultValue;
      return `<span class="threshold-value">${value}</span><span class="unit-suffix">${suffix}</span>`;
    }

    return match;
  });
}

// 获取所有市场ID
export function getAllMarketIds(ruleTemplate: RuleTypeTemplate): number[] {
  return ruleTemplate.marketList.map(market => market.marketId);
}

// 获取市场数据
export function getMarketData(ruleTemplate: RuleTypeTemplate, marketId: number) {
  return ruleTemplate.marketList.find(market => market.marketId === marketId);
}

// 检查是否包含预警级别
export function hasWarningLevel(ruleTemplate: RuleTypeTemplate): boolean {
  return ruleTemplate.defaultWarnLevel.includes(RiskLevel.WARNING);
}