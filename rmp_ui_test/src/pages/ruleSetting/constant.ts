import { Moment } from 'moment';
import { WorkGroupList } from './RuleIndex/type';

export const FORM_MODES = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  ADD_VIA_COPY: 'ADD_VIA_COPY',
  PREVIEW: 'PREVIEW',
} as const;

export interface HightFormDataType {
  acctCode?: string;
  acctName?: string;
  controlType?: string[];
  createDate?: Moment[];
  updateDate?: Moment[];
  createUserCode?: string;
  ruleType?: string[];
  ruleName?: string;
}

export const transHighFormData = (
  data: HightFormDataType,
  workGroupId: number,
  workGroupRuleType?: WorkGroupList[]
) => {
  const _data: any = {};
  if (data.ruleName?.trim()) {
    _data.ruleName = data.ruleName;
  }
  if (data.createUserCode?.trim()) {
    _data.createUserCode = data.createUserCode;
  }
  if (data.controlType && data.controlType.length > 0) {
    _data.acctControlClass = data.controlType.map((p) => {
      const _controlAcctType = p.split('|');
      const type = _controlAcctType.length;
      if (type === 1) {
        return {
          controlAcctType: Number(_controlAcctType[0]),
        };
      } else if (Number(_controlAcctType[1]) === 1) {
        const acctLevel = _controlAcctType[0];
        return {
          controlAcctType: 2,
          acctLevel,
        };
      } else {
        const acctLevel = _controlAcctType[0];
        return {
          controlAcctType: 1,
          acctLevel,
        };
      }
    });
  }
  if (data.acctCode?.trim()) {
    _data.acctCode = data.acctCode.trim();
  }
  if (data.acctName?.trim()) {
    _data.acctName = data.acctName?.trim();
  }
  if (data.createDate && data.createDate.length > 0) {
    _data.createBeginDate = Number(data.createDate[0].format('YYYYMMDD'));
    _data.createEndDate = Number(data.createDate[1].format('YYYYMMDD'));
  }
  if (data.updateDate && data.updateDate.length > 0) {
    _data.updateBeginDate = Number(data.updateDate[0].format('YYYYMMDD'));
    _data.updateEndDate = Number(data.updateDate[1].format('YYYYMMDD'));
  }
  if (data.ruleType && data.ruleType.length > 0) {
    _data.workGroupList = [
      {
        workGroupId,
        ruleType: data.ruleType,
      },
    ];
  } else {
    _data.workGroupList = [
      {
        workGroupId,
        ruleType: workGroupRuleType?.find((p) => p.workGroupId === workGroupId)
          ?.ruleType,
      },
    ];
  }
  return _data;
};
