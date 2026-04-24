import { InputNumberProps } from 'antd';
import { Rule } from 'antd/es/form';
import { InputNumber } from './components/InputNumber';
import { MultiThreshold } from './components/MultiThreshold';

export enum Mode {
  ADD = 'ADD',
  EDIT = 'EDIT',
  VIEW = 'VIEW',
  CLONE = 'CLONE',
}

export enum Status {
  ENABLE = 1, // 启用
  DISABLE = 2, // 禁用
}

export interface ComponentProps {
  InputNumber: InputNumberProps;
  MultiThreshold: InputNumberProps;
}

export const ComponentMap = {
  InputNumber,
  MultiThreshold,
};

export type ComponentType = keyof ComponentProps;

// 单条配置
export interface TemplateItem<T extends ComponentType = any> {
  template: string;
  [key: `$${number}`]: {
    component: ComponentType;
    rules: Rule[];
    defaultValue?: number;
    componentProps: ComponentProps[T];
  };
}

// 证券组
export interface SecurityGroup {
  securityGroupId: number;
  securityGroupName: string;
  securityControlType: number;
  securitySummaryType: number;
  securitySummaryCondition: number;
  secuSetIdList: number[];
  secuFilterClassList: string[];
  securityList: { securityCode: string; marketId: number }[];
  thresholdList: {
    thresholdId: number;
    warnLevel?: number;
    compareDirection: number;
    value?: number | Recordable<number>;
    setType?: number;
    factorType: number;
    defaultValue?: number | Recordable<number>;
    unit: number;
  }[];
  effectiveTimeList: { beginTime: string; endTime: string }[];
  extParameterList: {
    parameterType: number;
    parameterValue: string;
    parameterValue2: string;
  }[];
}

// 市场模板
export interface MarketTemplate {
  marketId: number;
  marketName: string;
  securityGroupList: SecurityGroup[];
}

// 规则类型模板
export interface RuleTypeTemplate {
  ruleType: string;
  ruleTemplateId: number;
  optionalMarketList: { marketId: number; marketName: string }[];
  defaultMarket: number[];
  optionalWarnLevelList: { label: string; value: RiskLevel }[];
  warnValueDefaultPercent?: number;
  defaultWarnLevel: RiskLevel[];
  marketList: MarketTemplate[];
}

// 修改标识
export enum SetType {
  DEFAULT = 1,
  SCALE = 2,
  CUSTOM = 3,
}

// 风控级别
export enum RiskLevel {
  INTERCEPT = 2,
  WARNING = 1,
  NOTIP = 3,
}

// 生效标志
export enum EffectiveFlag {
  OFF = 0,
  ON = 1,
}