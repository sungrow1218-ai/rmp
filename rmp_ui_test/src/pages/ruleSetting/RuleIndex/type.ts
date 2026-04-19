export interface TreeKeyType {
  type: string;
  key: string[];
}

export interface WorkGroupList {
  workGroupId: number;
  ruleType: string[];
}

export interface RuleTypeItem {
  ruleTypeId: string;
  ruleTypeName: string;
  typeId: string;
  typeName: string;
  subTypeId?: string;
  subTypeName?: string;
  workGroupId: number;
  workGroupName: string;
}
