export type ExtractUnion<T extends Record<string, any>> = T[keyof T][number];

export interface SpecialThresholdValueSingle {
  /**
   * 阈值条件 id，新增时填写 0
   */
  thresholdCondId: number;
  /**
   * 阈值条件类型
   */
  thresholdCondType: string;
  /**
   * 当前 type 类型阈值或前置条件的参数
   */
  thresholdParamList: ThresholdParamList[];
}

export interface ThresholdParamList {
  /**
   * 一期支持：43-比较方向、72-预警值、19999-单位和73-禁止值，特别的：前置条件的阈值填写到禁止值
   */
  ruleParamType: string;
  /**
   * 阈值参数值1
   */
  ruleParamValue: string;
  /**
   * 阈值参数值2
   */
  rule_param_value2?: string;
}
