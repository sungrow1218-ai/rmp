import { FormSchema } from '@/components/Form';
import {
  GROUP_CONTROL_TYPES__MAP,
  SECURITY_AGGREGATION__MAP,
  SECURITY_CONTROL_TYPES__MAP,
} from '@/utils/dict';
import DynamicDimensionSelect from '../component/DynamicDimensionSelect';
import React from 'react';
import FuturesSelect from '../component/FuturesSelect';
import OptionsSelect from '../component/OptionsSelect';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import SecurityTypeSelect from '@/components/SecurityTypeSelectRebuild';
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
      defaultValue: 1,
      componentProps: ({ formAction }) => {
        return {
          options: transformDictToSelectOptionsNumber([
            SECURITY_CONTROL_TYPES__MAP.KEY_1,
            SECURITY_CONTROL_TYPES__MAP.KEY_2,
            SECURITY_CONTROL_TYPES__MAP.KEY_4,
            SECURITY_CONTROL_TYPES__MAP.KEY_6,
            SECURITY_CONTROL_TYPES__MAP.KEY_8,
          ]),
          onChange(values) {
            if (values === Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code)) {
              formAction.setFieldsValue({
                securitySummaryType: null,
                securitySummaryCondition: null,
                securitySetIdList: null,
                securityList: null,
                securityFilterClassList: null,
              });
            } else {
              formAction.setFieldsValue({
                securitySummaryCondition: null,
                securitySetIdList: null,
                securityList: null,
                securityFilterClassList: null,
              });
            }
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
      componentProps: ({ formModel }) => {
        if (
          formModel.securityControlType ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code)
        ) {
          return {
            options: transformDictToSelectOptionsNumber([
              SECURITY_AGGREGATION__MAP.INDEPENDENTLY,
            ]),
            style: { width: '240px' },
          };
        } else {
          return {
            options: transformDictToSelectOptionsNumber([
              SECURITY_AGGREGATION__MAP.INDEPENDENTLY,
              SECURITY_AGGREGATION__MAP.BY_GROUP,
            ]),
            style: { width: '240px' },
          };
        }
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
      componentProps: ({ formModel }) => {
        if (
          formModel.securityControlType ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_4.code)
        ) {
          return {
            options: transformDictToSelectOptionsNumber([
              GROUP_CONTROL_TYPES__MAP.KEY_2,
              GROUP_CONTROL_TYPES__MAP.KEY_3,
              GROUP_CONTROL_TYPES__MAP.KEY_5,
            ]),
            style: { width: '240px' },
          };
        }
        if (
          formModel.securityControlType ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_6.code)
        ) {
          return {
            options: transformDictToSelectOptionsNumber([
              GROUP_CONTROL_TYPES__MAP.KEY_2,
            ]),
            style: { width: '240px' },
          };
        } else {
          return {
            options: transformDictToSelectOptionsNumber([
              GROUP_CONTROL_TYPES__MAP.KEY_3,
            ]),
            style: { width: '240px' },
          };
        }
      },
    },
    {
      field: 'securityFilterClassList',
      label: '证券类别列表',
      required: true,
      component: 'Select',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code),
      render: () => (
        <SecurityTypeSelect
          secuControl={['1701', '1702']}
          style={{ width: '360px' }}
        />
      ),
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
      field: 'securityList',
      label: '期货品种列表',
      component: 'Input',
      required: true,
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_6.code),
      render: () => <FuturesSelect style={{ width: '240px' }} />,
    },
    {
      field: 'securityList',
      label: '期权品种类别',
      component: 'Input',
      required: true,
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_8.code),
      render: () => <OptionsSelect style={{ width: '240px' }} />,
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
