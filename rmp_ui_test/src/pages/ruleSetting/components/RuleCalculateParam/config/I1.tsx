import { FormSchema } from '@/components/Form';
import React from 'react';
import { ExtSysItem, SobInfo } from '@/services/account';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import { RULE_CONTROL_DIM, transformDictFeKeyToCodeHelper } from '@/utils/dict';
import ExcludeAcctTypeSelect from '../../RuleDimensionControl/component/ExcludeAcctTypeSelect';
import ExemptAccountSelect from '../components/ExemptAccountSelect';

const isShowExcludeType = (controlAcctType?: string) => {
  if (!controlAcctType) {
    return false;
  }
  const [, acctType] = controlAcctType.split('|');
  // 对接系统
  if (
    acctType ===
    transformDictFeKeyToCodeHelper('BY_INTERGRATE_SYSTEM', RULE_CONTROL_DIM)
  ) {
    return true;
  }
  return false;
};

const isShowExemptAccountSelect = (controlAcctType?: string) => {
  if (!controlAcctType) {
    return false;
  }
  const [, acctType] = controlAcctType.split('|');
  // 对接系统 或者 账户组
  if (
    acctType !==
      transformDictFeKeyToCodeHelper(
        'BY_INTERGRATE_SYSTEM',
        RULE_CONTROL_DIM
      ) &&
    acctType !==
      transformDictFeKeyToCodeHelper('BY_ACCT_GROUP', RULE_CONTROL_DIM)
  ) {
    return true;
  }
  return false;
};

export const getSchemas = ({
  mode,
  extSysIds = [],
  sobInfo,
  controlAcctType,
}: {
  mode: keyof typeof FORM_MODES;
  extSysIds: number[] | string[] | undefined;
  sobInfo: SobInfo | undefined;
  controlAcctType: string | undefined;
  extSystems: ExtSysItem[];
}): FormSchema[] => {
  return [
    {
      field: '9',
      label: '操作类型',
      component: 'Select',
      required: true,
      defaultValue: '4',
      componentProps: {
        options: [
          { label: '4-不控制', value: '4' },
          { label: '8-禁止买(含买开、卖开)', value: '8' },
          { label: '9-禁止卖(含买平、卖平)', value: '9' },
          { label: '10-禁止买卖', value: '10' },
        ],
        style: { width: '240px' },
      },
    },
    {
      field: '194',
      label: '赎回豁免类型',
      component: 'Input',
      ifShow: isShowExcludeType(controlAcctType),
      render: (renderCallbackParams, opts) => {
        return (
          <ExcludeAcctTypeSelect
            sobInfo={sobInfo as SobInfo}
            style={{ width: '240px' }}
          />
        );
      },
    },
    {
      field: '193',
      label: '赎回豁免账户',
      component: 'MultipleSelect',
      ifShow: isShowExcludeType(controlAcctType),
      render: ({ values }, opts) => {
        return (
          <ExemptAccountSelect
            mode={mode}
            integrationSystemIds={extSysIds}
            sobInfo={sobInfo}
            controlAcctType={values['194']}
            style={{ width: '360px' }}
          />
        );
      },
    },
    {
      field: '193',
      label: '赎回豁免账户',
      component: 'MultipleSelect',
      ifShow: isShowExemptAccountSelect(controlAcctType),
      render: ({ values }, opts) => {
        return (
          <ExemptAccountSelect
            mode={mode}
            integrationSystemIds={extSysIds}
            sobInfo={sobInfo}
            controlAcctType={controlAcctType}
            style={{ width: '360px' }}
          />
        );
      },
    },
  ];
};
