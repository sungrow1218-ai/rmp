import { FormSchema } from '@/components/Form';
import {
  SECURITY_AGGREGATION__MAP,
  SECURITY_CONTROL_TYPES__MAP,
} from '@/utils/dict';
import React from 'react';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import IndexSelect from '../component/IndexSelect';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';

interface Params {
  mode: keyof typeof FORM_MODES;
}

export const getSchemas = (param: Params): FormSchema[] => {
  return [
    {
      field: 'securityControlType',
      label: '证券控制方式',
      component: 'Select',
      required: true,
      defaultValue: 11,
      componentProps: ({ formAction }) => {
        return {
          options: transformDictToSelectOptionsNumber([
            SECURITY_CONTROL_TYPES__MAP.KEY_11,
          ]),
          onChange() {
            formAction.setFieldsValue({
              securityList: null,
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
      componentProps: {
        options: transformDictToSelectOptionsNumber([
          SECURITY_AGGREGATION__MAP.TOGETHER,
        ]),
        style: { width: '240px' },
      },
    },
    {
      field: 'securityList',
      label: '指数范围列表',
      required: true,
      component: 'Select',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_11.code),
      render: () => <IndexSelect style={{ width: '240px' }} />,
    },
  ];
};
