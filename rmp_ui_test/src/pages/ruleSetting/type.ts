import { QueryRuleSettingRspDTO } from '@/services/ruleSetting/dto';
import { FORM_MODES } from './constant';
import { SobInfo } from '@/services/account';

export enum ModuleType {
  INDEX = 1,
  TEMPLATE_GROUP = 2,
}

export type Mode = keyof typeof FORM_MODES;

export type TableListType = QueryRuleSettingRspDTO & { key: React.Key } & {
  sobInfo?: SobInfo;
};

export interface IRuleConfigurationItem {
  Id: string;
  Name: string;
  SubList?: IRuleConfigurationItem[];
}

export interface IRuleConfiguration {
  Id: string;
  Name: string;
  workGroupList: {
    WorkGroupId: number;
    WorkGroupName: string;
    RuleTypeList: {
      rule: IRuleConfigurationItem[];
      template: IRuleConfigurationItem[];
    };
  }[];
}
