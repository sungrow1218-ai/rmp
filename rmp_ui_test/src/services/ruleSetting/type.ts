export interface RuleBaseInfo {
  ruleId: number;
  ruleType: string;
  ruleSummary?: string;
  ruleName: string;
  ruleStatus: number;
  rulePriority: number;
  ruleCheckPoint: number;
  beginDate?: string;
  endDate?: string;
  timeSegmentList?: { beginTime: string; endTime: string };
}

export interface SecurityItem {
  securityCode: string;
  marketId: number;
}

export interface GeneralThreshold {
  compareDirection: number;
  unit: number;
  thresholdList: { value: number; operation: number }[];
}

export interface SpecialThreshold {
  preConditionList?: {
    conditionId: number;
    conditionType: number;
    conditionCompareDirection: number;
    conditionValue?: number;
    unit: number;
  }[];
  thresholdConditionList?: {
    conditionId: number;
    conditionType: number;
    conditionCompareDirection: number;
    conditionWarnValue?: number;
    conditionForbidValue?: number;
    unit: number;
  }[];
}
