import React, { useState } from 'react';
import { Button, Card } from 'antd';
import RuleTemplateConfigViewNew from '@/components/RuleTemplateConfigViewNew';
import { RuleTypeTemplate, RiskLevel } from '@/services/ruleTemplateTypes';

// 测试数据 - 标准版本和监控版本
const testRuleTemplateMap: { [key: string]: RuleTypeTemplate } = {
  Z01102: {
    ruleType: 'Z01102',
    ruleTemplateId: 1,
    optionalMarketList: [
      { marketId: 1, marketName: '上海证券交易所 (SH)' },
      { marketId: 2, marketName: '深圳证券交易所 (SZ)' },
    ],
    defaultMarket: [1, 2],
    optionalWarnLevelList: [
      { label: '拦截', value: RiskLevel.INTERCEPT },
      { label: '预警', value: RiskLevel.WARNING },
    ],
    defaultWarnLevel: [RiskLevel.INTERCEPT, RiskLevel.WARNING],
    warnValueDefaultPercent: 0.8,
    marketList: [
      {
        marketId: 1,
        marketName: '上海证券交易所 (SH)',
        securityGroupList: [
          {
            securityGroupId: 1,
            securityGroupName: '风险警示股',
            securityControlType: 1,
            securitySummaryType: 1,
            securitySummaryCondition: 1,
            secuSetIdList: [],
            secuFilterClassList: [],
            thresholdList: [
              { factorType: 15, defaultValue: 100, value: 120, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 16, defaultValue: 10, value: 12, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 17, defaultValue: 5, value: 6, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 18, defaultValue: 10, value: 12, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 35, defaultValue: 50, value: 60, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 36, defaultValue: 5, value: 6, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 15, defaultValue: 100, value: 80, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.WARNING },
              { factorType: 16, defaultValue: 10, value: 8, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.WARNING },
              { factorType: 17, defaultValue: 5, value: 4, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.WARNING },
              { factorType: 18, defaultValue: 10, value: 8, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.WARNING },
              { factorType: 35, defaultValue: 50, value: 40, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.WARNING },
              { factorType: 36, defaultValue: 5, value: 4, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.WARNING },
            ],
            effectiveTimeList: [
              { beginTime: '093000', endTime: '113000' },
              { beginTime: '130000', endTime: '150000' },
            ],
            extParameterList: [],
          },
          {
            securityGroupId: 2,
            securityGroupName: '上证50成分股',
            securityControlType: 1,
            securitySummaryType: 1,
            securitySummaryCondition: 1,
            secuSetIdList: [],
            secuFilterClassList: [],
            thresholdList: [
              { factorType: 15, defaultValue: 150, value: 180, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 16, defaultValue: 15, value: 18, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 17, defaultValue: 6, value: 7, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 18, defaultValue: 12, value: 14, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 35, defaultValue: 75, value: 90, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 36, defaultValue: 8, value: 10, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
            ],
            effectiveTimeList: [
              { beginTime: '093000', endTime: '113000' },
              { beginTime: '130000', endTime: '150000' },
            ],
            extParameterList: [],
          },
        ],
      },
      {
        marketId: 2,
        marketName: '深圳证券交易所 (SZ)',
        securityGroupList: [
          {
            securityGroupId: 101,
            securityGroupName: '风险警示股',
            securityControlType: 1,
            securitySummaryType: 1,
            securitySummaryCondition: 1,
            secuSetIdList: [],
            secuFilterClassList: [],
            thresholdList: [
              { factorType: 15, defaultValue: 100, value: 110, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 16, defaultValue: 10, value: 11, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 17, defaultValue: 5, value: 6, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 18, defaultValue: 10, value: 11, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 35, defaultValue: 50, value: 55, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 36, defaultValue: 5, value: 6, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
            ],
            effectiveTimeList: [
              { beginTime: '093000', endTime: '113000' },
              { beginTime: '130000', endTime: '150000' },
            ],
            extParameterList: [],
          },
        ],
      },
    ],
  },
  Z01201: {
    ruleType: 'Z01201',
    ruleTemplateId: 2,
    optionalMarketList: [
      { marketId: 1, marketName: '上海证券交易所 (SH)' },
      { marketId: 2, marketName: '深圳证券交易所 (SZ)' },
    ],
    defaultMarket: [1, 2],
    optionalWarnLevelList: [
      { label: '拦截', value: RiskLevel.INTERCEPT },
      { label: '预警', value: RiskLevel.WARNING },
    ],
    defaultWarnLevel: [RiskLevel.INTERCEPT],
    warnValueDefaultPercent: 0.8,
    marketList: [
      {
        marketId: 1,
        marketName: '上海证券交易所 (SH)',
        securityGroupList: [
          {
            securityGroupId: 1,
            securityGroupName: '风险警示股',
            securityControlType: 1,
            securitySummaryType: 1,
            securitySummaryCondition: 1,
            secuSetIdList: [],
            secuFilterClassList: [],
            thresholdList: [
              { factorType: 15, defaultValue: 100, value: 120, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 16, defaultValue: 10, value: 12, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 18, defaultValue: 10, value: 12, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 19, defaultValue: 5, value: 6, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 20, defaultValue: 50, value: 60, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
              { factorType: 21, defaultValue: 3, value: 4, setType: 1, compareDirection: 1, unit: 1, warnLevel: RiskLevel.INTERCEPT },
            ],
            effectiveTimeList: [
              { beginTime: '093000', endTime: '113000' },
              { beginTime: '130000', endTime: '150000' },
            ],
            extParameterList: [],
          },
        ],
      },
    ],
  },
  // 监控版本示例 - Z01101（开盘集合竞价阶段拉抬打压控制）
  Z01101: {
    ruleType: 'Z01101',
    ruleTemplateId: 3,
    optionalMarketList: [
      { marketId: 1, marketName: '上海证券交易所 (SH)' },
      { marketId: 2, marketName: '深圳证券交易所 (SZ)' },
    ],
    defaultMarket: [1, 2],
    optionalWarnLevelList: [
      { label: '不提示', value: RiskLevel.NOTIP },
      { label: '预警', value: RiskLevel.WARNING },
      { label: '拦截', value: RiskLevel.INTERCEPT },
    ],
    defaultWarnLevel: [RiskLevel.NOTIP, RiskLevel.WARNING, RiskLevel.INTERCEPT],
    warnValueDefaultPercent: undefined, // 监控版本不使用百分比
    marketList: [
      {
        marketId: 1,
        marketName: '上海证券交易所 (SH)',
        securityGroupList: [
          {
            securityGroupId: 1,
            securityGroupName: '风险警示股',
            securityControlType: 1,
            securitySummaryType: 1,
            securitySummaryCondition: 1,
            secuSetIdList: [],
            secuFilterClassList: [],
            thresholdList: [
              {
                factorType: 15,
                defaultValue: { [RiskLevel.NOTIP]: 80, [RiskLevel.WARNING]: 90, [RiskLevel.INTERCEPT]: 100 },
                value: { [RiskLevel.NOTIP]: 85, [RiskLevel.WARNING]: 95, [RiskLevel.INTERCEPT]: 105 },
                setType: 1,
                compareDirection: 1,
                unit: 1
              },
              {
                factorType: 16,
                defaultValue: { [RiskLevel.NOTIP]: 8, [RiskLevel.WARNING]: 9, [RiskLevel.INTERCEPT]: 10 },
                value: { [RiskLevel.NOTIP]: 8.5, [RiskLevel.WARNING]: 9.5, [RiskLevel.INTERCEPT]: 10.5 },
                setType: 1,
                compareDirection: 1,
                unit: 1
              },
              {
                factorType: 17,
                defaultValue: { [RiskLevel.NOTIP]: 4, [RiskLevel.WARNING]: 4.5, [RiskLevel.INTERCEPT]: 5 },
                value: { [RiskLevel.NOTIP]: 4.2, [RiskLevel.WARNING]: 4.7, [RiskLevel.INTERCEPT]: 5.2 },
                setType: 1,
                compareDirection: 1,
                unit: 1
              },
              {
                factorType: 18,
                defaultValue: { [RiskLevel.NOTIP]: 8, [RiskLevel.WARNING]: 9, [RiskLevel.INTERCEPT]: 10 },
                value: { [RiskLevel.NOTIP]: 8.5, [RiskLevel.WARNING]: 9.5, [RiskLevel.INTERCEPT]: 10.5 },
                setType: 1,
                compareDirection: 1,
                unit: 1
              },
            ],
            effectiveTimeList: [
              { beginTime: '091500', endTime: '092500' },
            ],
            extParameterList: [],
          },
          {
            securityGroupId: 2,
            securityGroupName: '上证50成分股',
            securityControlType: 1,
            securitySummaryType: 1,
            securitySummaryCondition: 1,
            secuSetIdList: [],
            secuFilterClassList: [],
            thresholdList: [
              {
                factorType: 15,
                defaultValue: { [RiskLevel.NOTIP]: 120, [RiskLevel.WARNING]: 135, [RiskLevel.INTERCEPT]: 150 },
                value: { [RiskLevel.NOTIP]: 125, [RiskLevel.WARNING]: 140, [RiskLevel.INTERCEPT]: 155 },
                setType: 1,
                compareDirection: 1,
                unit: 1
              },
              {
                factorType: 16,
                defaultValue: { [RiskLevel.NOTIP]: 12, [RiskLevel.WARNING]: 13.5, [RiskLevel.INTERCEPT]: 15 },
                value: { [RiskLevel.NOTIP]: 12.5, [RiskLevel.WARNING]: 14, [RiskLevel.INTERCEPT]: 15.5 },
                setType: 1,
                compareDirection: 1,
                unit: 1
              },
              {
                factorType: 17,
                defaultValue: { [RiskLevel.NOTIP]: 5, [RiskLevel.WARNING]: 5.5, [RiskLevel.INTERCEPT]: 6 },
                value: { [RiskLevel.NOTIP]: 5.2, [RiskLevel.WARNING]: 5.7, [RiskLevel.INTERCEPT]: 6.2 },
                setType: 1,
                compareDirection: 1,
                unit: 1
              },
              {
                factorType: 18,
                defaultValue: { [RiskLevel.NOTIP]: 10, [RiskLevel.WARNING]: 11, [RiskLevel.INTERCEPT]: 12 },
                value: { [RiskLevel.NOTIP]: 10.5, [RiskLevel.WARNING]: 11.5, [RiskLevel.INTERCEPT]: 12.5 },
                setType: 1,
                compareDirection: 1,
                unit: 1
              },
            ],
            effectiveTimeList: [
              { beginTime: '091500', endTime: '092500' },
            ],
            extParameterList: [],
          },
        ],
      },
      {
        marketId: 2,
        marketName: '深圳证券交易所 (SZ)',
        securityGroupList: [
          {
            securityGroupId: 101,
            securityGroupName: '风险警示股',
            securityControlType: 1,
            securitySummaryType: 1,
            securitySummaryCondition: 1,
            secuSetIdList: [],
            secuFilterClassList: [],
            thresholdList: [
              {
                factorType: 15,
                defaultValue: { [RiskLevel.NOTIP]: 80, [RiskLevel.WARNING]: 90, [RiskLevel.INTERCEPT]: 100 },
                value: { [RiskLevel.NOTIP]: 85, [RiskLevel.WARNING]: 95, [RiskLevel.INTERCEPT]: 105 },
                setType: 1,
                compareDirection: 1,
                unit: 1
              },
              {
                factorType: 16,
                defaultValue: { [RiskLevel.NOTIP]: 8, [RiskLevel.WARNING]: 9, [RiskLevel.INTERCEPT]: 10 },
                value: { [RiskLevel.NOTIP]: 8.5, [RiskLevel.WARNING]: 9.5, [RiskLevel.INTERCEPT]: 10.5 },
                setType: 1,
                compareDirection: 1,
                unit: 1
              },
              {
                factorType: 17,
                defaultValue: { [RiskLevel.NOTIP]: 4, [RiskLevel.WARNING]: 4.5, [RiskLevel.INTERCEPT]: 5 },
                value: { [RiskLevel.NOTIP]: 4.2, [RiskLevel.WARNING]: 4.7, [RiskLevel.INTERCEPT]: 5.2 },
                setType: 1,
                compareDirection: 1,
                unit: 1
              },
              {
                factorType: 18,
                defaultValue: { [RiskLevel.NOTIP]: 8, [RiskLevel.WARNING]: 9, [RiskLevel.INTERCEPT]: 10 },
                value: { [RiskLevel.NOTIP]: 8.5, [RiskLevel.WARNING]: 9.5, [RiskLevel.INTERCEPT]: 10.5 },
                setType: 1,
                compareDirection: 1,
                unit: 1
              },
            ],
            effectiveTimeList: [
              { beginTime: '091500', endTime: '092500' },
            ],
            extParameterList: [],
          },
        ],
      },
    ],
  },
};

const testViewingRecord = {
  ruleTmplGroupId: 1001,
  ruleTmplGroupName: '测试指标组',
  status: 1,
  workGroupId: '1',
  ruleTemplateList: [
    { ruleTemplateId: 1, ruleType: 'Z01102' },
    { ruleTemplateId: 2, ruleType: 'Z01201' },
    { ruleTemplateId: 3, ruleType: 'Z01101' }, // 监控版本
  ],
  createUserCode: 'testuser',
  updateUserCode: 'testuser',
  createTime: '20240101120000',
  lastUpdateTime: '20240101150000',
};

const RuleTemplateConfigViewTest: React.FC = () => {
  const [embedded, setEmbedded] = useState(false);

  return (
    <div className="p-6 h-full">
      <h1 className="text-2xl font-bold mb-6">规则模板配置查看组件测试</h1>

      <div className="mb-6 space-x-4">
        <Button type="primary" onClick={() => setEmbedded(false)}>
          独立模式
        </Button>
        <Button onClick={() => setEmbedded(true)}>
          内嵌模式
        </Button>
      </div>

      <Card className="shadow-lg">
        <RuleTemplateConfigViewNew
          ruleTemplateMap={testRuleTemplateMap}
          viewingRecord={testViewingRecord}
          embedded={embedded}
          onClose={() => setEmbedded(false)}
        />
      </Card>

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-2">测试说明：</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>点击左侧规则树中的规则类型：
            <ul className="list-circle pl-5 mt-1">
              <li><strong>Z01102</strong> - 标准版本（只有拦截和预警两个级别）</li>
              <li><strong>Z01201</strong> - 标准版本（只有拦截级别）</li>
              <li><strong>Z01101</strong> - <strong>监控版本</strong>（包含三级阈值：不提示/预警/拦截）</li>
            </ul>
          </li>
          <li>查看右侧显示的规则配置详情</li>
          <li>切换不同的市场标签页（上海证券交易所、深圳证券交易所）</li>
          <li>展开折叠面板查看不同证券组的配置</li>
          <li>注意监控版本显示三级阈值，标准版本显示单个阈值</li>
          <li>点击"关联账户组"标签页查看账户组绑定功能</li>
        </ul>
      </div>
    </div>
  );
};

export default RuleTemplateConfigViewTest;