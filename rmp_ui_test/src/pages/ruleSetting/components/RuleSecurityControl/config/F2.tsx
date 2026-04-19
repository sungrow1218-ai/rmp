import { FormSchema } from '@/components/Form';
import {
  SECURITY_AGGREGATION__MAP,
  SECURITY_CONTROL_TYPES__MAP,
} from '@/utils/dict';
import React from 'react';
import SecurityTypeSelect from '@/components/SecurityTypeSelectRebuild';
import SecuritySelect from '@/components/SecuritySelect';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';

export const getSchemas = (param?: any): FormSchema[] => {
  return [
    {
      field: 'securityControlType',
      label: '证券控制方式',
      component: 'Select',
      required: true,
      defaultValue: 1,
      componentProps: ({ formAction, formModel }) => {
        return {
          options: transformDictToSelectOptionsNumber([
            SECURITY_CONTROL_TYPES__MAP.KEY_1,
          ]),
          onChange() {
            formAction.setFieldsValue({
              securitySummaryCondition: null,
              securitySetIdList: null,
              securityList: null,
              securitySummaryType: 0,
              securityFilterClassList: null,
            });
          },
          style: { width: '240px' },
        };
      },
    },
    {
      field: 'securitySummaryType',
      label: '证券汇总方式',
      component: 'Select',
      required: true,
      defaultValue: 1,
      componentProps: ({ formAction, formModel }) => {
        return {
          options: transformDictToSelectOptionsNumber([
            SECURITY_AGGREGATION__MAP.TOGETHER,
          ]),
          style: { width: '240px' },
        };
      },
    },
    {
      field: 'securityFilterClassList',
      label: '证券类别列表',
      required: true,
      component: 'Input',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code),
      render: () => (
        <SecurityTypeSelect
          secuControl={['10', '11', '1201', '1202', '1501']}
          style={{ width: '360px' }}
        />
      ),
    },
    {
      field: 'excludeSecurityList',
      label: '排除证券列表',
      required: false,
      component: 'Input',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code),
      render: ({ values }) => {
        return (
          <SecuritySelect
            securityType={values.securityFilterClassList}
            style={{ width: '240px' }}
          />
        );
      },
    },
  ];
};
