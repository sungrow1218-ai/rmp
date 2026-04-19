export enum Operator {
  EQUAL = 1,
  NOT_EQUAL = 2,
  LTE = 3,
  LT = 4,
  GTE = 5,
  GT = 6,
  IN = 7,
  NOT_IN = 8,
  LIKE = 9,
  NOT_LIKE = 10,
}

export const OperatorView = {
  [Operator.EQUAL]: '=',
  [Operator.NOT_EQUAL]: '!=',
  [Operator.LTE]: '<=',
  [Operator.LT]: '<',
  [Operator.GTE]: '>=',
  [Operator.GT]: '>',
  [Operator.IN]: '属于',
  [Operator.NOT_IN]: '不属于',
  [Operator.LIKE]: '包含',
  [Operator.NOT_LIKE]: '不包含',
};

export enum CompareType {
  VALUE = 1,
  SCOPE = 3,
  INCLUDE = 2,
}

// 数值比较
export const ValueCompare = [
  Operator.EQUAL,
  Operator.NOT_EQUAL,
  Operator.LTE,
  Operator.LT,
  Operator.GTE,
  Operator.GT,
].map((i) => ({ label: OperatorView[i], value: i }));

// 范围比较
export const ScopeCompare = [Operator.IN, Operator.NOT_IN].map((i) => ({
  label: OperatorView[i],
  value: i,
}));

// 包含比较
export const IncludeCompare = [Operator.LIKE, Operator.NOT_LIKE].map((i) => ({
  label: OperatorView[i],
  value: i,
}));

// 运算符选项
export const OperatorOptions = {
  [CompareType.VALUE]: ValueCompare,
  [CompareType.SCOPE]: ScopeCompare,
  [CompareType.INCLUDE]: IncludeCompare,
};

// 条件值类型
export enum ValueType {
  INTERFACE = 1,
  INPUT = 2,
}

// 单位类型（仅数值）
export enum UnitType {
  NONE = 0,
  YUAN = 1,
  SHARE = 2,
  PERCENT = 3,
  DAY = 4,
}

// 单位-显示
export const UnitView = {
  [UnitType.NONE]: '无',
  [UnitType.YUAN]: '元',
  [UnitType.SHARE]: '股',
  [UnitType.PERCENT]: '%',
  [UnitType.DAY]: '天',
};

export interface DynamicDimCondition {
  conditionCode: string;
  conditionName: string;
  conditionType: number;
  conditionTypeName: string;
  conditionValue: string[] | number[];
  conditionValueType: number;
  conditionValueUnit: number;
  conditionOperation: number;
  conditionOperationType: number;
  conditionOrderId: number;
}

// 动态维度
export interface DynamicDim {
  dyndimId: number;
  dyndimName: string;
  dyndimFormula: string;
  systemFlag: DynamicDimType;
  dyndimConditionList: DynamicDimCondition[];
  createRoleId: number;
  createUserNo: string;
  updateUserNo: string;
  createDateTime: string;
  lastUpdateTime: string;
}

// 动态维度-条件
export interface DynamicDimConditionItem {
  conditionCode: string;
  conditionName: string;
  conditionType: number;
  conditionTypeName: string;
  conditionValueType: number;
  conditionValueUnit: number;
  conditionOperationType: number;
}

// 修改类型
export enum AlterType {
  ADD = 1,
  EDIT = 2,
  DELETE = 3,
  VIEW = 4,
}

export enum DynamicDimType {
  CUSTOM = 0,
  SYSTEM = 1,
}
