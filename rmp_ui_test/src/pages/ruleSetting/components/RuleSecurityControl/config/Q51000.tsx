import { FormSchema } from '@/components/Form';
import {
  GROUP_CONTROL_TYPES__MAP,
  SECURITY_AGGREGATION__MAP,
  SECURITY_CONTROL_TYPES__MAP,
} from '@/utils/dict';
import React from 'react';
import FuturesSelect from '../component/FuturesSelect';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      field: 'securityControlType',
      label: '证券控制方式',
      component: 'Select',
      required: true,
      defaultValue: 6,
      componentProps: ({ formAction }) => {
        return {
          options: transformDictToSelectOptionsNumber([
            SECURITY_CONTROL_TYPES__MAP.KEY_6,
          ]),
          onChange() {
            formAction.setFieldsValue({
              securitySummaryCondition: null,
              securitySetIdList: null,
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
      componentProps: {
        options: transformDictToSelectOptionsNumber([
          SECURITY_AGGREGATION__MAP.INDEPENDENTLY,
          SECURITY_AGGREGATION__MAP.TOGETHER,
          SECURITY_AGGREGATION__MAP.BY_GROUP,
        ]),
        style: { width: '240px' },
      },
    },
    {
      field: 'securitySummaryCondition',
      label: '证券汇总条件',
      component: 'Select',
      required: true,
      ifShow: ({ values }) =>
        values.securitySummaryType ===
        Number(SECURITY_AGGREGATION__MAP.BY_GROUP.code),
      componentProps: {
        options: transformDictToSelectOptionsNumber([
          GROUP_CONTROL_TYPES__MAP.KEY_2,
        ]),
        style: { width: '240px' },
      },
    },
    {
      field: 'securityList',
      label: '期货品种列表',
      component: 'Input',
      required: true,
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_6.code),
      render: () => <FuturesSelect marketId={[7]} style={{ width: '240px' }} />,
    },
  ];
};
