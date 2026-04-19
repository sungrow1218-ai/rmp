import { FormSchema } from '@/components/Form';
import {
  GROUP_CONTROL_TYPES__MAP,
  SECURITY_AGGREGATION__MAP,
  SECURITY_CONTROL_TYPES__MAP,
} from '@/utils/dict';
import DynamicDimensionSelect from '../component/DynamicDimensionSelect';
import React from 'react';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';
import SecurityPoolSelect from '../component/SecurityPoolSelect';

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
      defaultValue: 2,
      componentProps: ({ formAction }) => {
        return {
          options: transformDictToSelectOptionsNumber([
            SECURITY_CONTROL_TYPES__MAP.KEY_2,
            SECURITY_CONTROL_TYPES__MAP.KEY_4,
          ]),
          onChange() {
            formAction.setFieldsValue({
              securitySetIdList: null,
              securityList: null,
              securityFilterClassList: null,
              excludeSecurityList: null,
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
      defaultValue: 0,
      componentProps: {
        options: transformDictToSelectOptionsNumber([
          SECURITY_AGGREGATION__MAP.INDEPENDENTLY,
          SECURITY_AGGREGATION__MAP.BY_GROUP,
        ]),
        style: { width: '240px' },
      },
    },
    {
      field: 'securitySummaryCondition',
      label: '分组汇总条件',
      component: 'Select',
      required: true,
      ifShow: ({ values }) =>
        values.securitySummaryType ===
        Number(SECURITY_AGGREGATION__MAP.BY_GROUP.code),
      componentProps: {
        options: transformDictToSelectOptionsNumber([
          GROUP_CONTROL_TYPES__MAP.KEY_5,
        ]),
        style: { width: '240px' },
      },
    },
    {
      field: 'securitySetIdList',
      label: '动态维度列表',
      required: true,
      component: 'Input',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_4.code),
      render: () => (
        <DynamicDimensionSelect mode={param.mode} style={{ width: '240px' }} />
      ),
    },
    {
      field: 'securitySetIdList',
      label: '证券池列表',
      required: true,
      component: 'Input',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_2.code),
      render: () => (
        <SecurityPoolSelect mode={param.mode} style={{ width: '240px' }} />
      ),
    },
  ];
};
