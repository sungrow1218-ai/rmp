import { FormSchema } from '@/components/Form';
import {
  GROUP_CONTROL_TYPES__MAP,
  SECURITY_AGGREGATION__MAP,
  SECURITY_CONTROL_TYPES__MAP,
} from '@/utils/dict';
import React from 'react';
import FuturesSelect from '../component/FuturesSelect';
import SecuritySelect from '@/components/SecuritySelect';
import SecurityTypeSelect from '@/components/SecurityTypeSelectRebuild';
import DynamicDimensionSelect from '../component/DynamicDimensionSelect';
import OptionsSelect from '../component/OptionsSelect';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';

interface Params {
  mode: keyof typeof FORM_MODES;
}

export const getSchemas = (param: any): FormSchema[] => {
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
            SECURITY_CONTROL_TYPES__MAP.KEY_3,
            SECURITY_CONTROL_TYPES__MAP.KEY_4,
            SECURITY_CONTROL_TYPES__MAP.KEY_6,
            SECURITY_CONTROL_TYPES__MAP.KEY_8,
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
      componentProps: ({ formAction, formModel }) => {
        if (param === '2') {
          if (formModel.securitySummaryType !== 0) {
            formAction.setFieldValue('securitySummaryType', 0);
          }
          return {
            options: transformDictToSelectOptionsNumber([
              SECURITY_AGGREGATION__MAP.INDEPENDENTLY,
            ]),
            style: { width: '240px' },
          };
        } else if (
          formModel.securityControlType ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code)
        ) {
          return {
            options: transformDictToSelectOptionsNumber([
              SECURITY_AGGREGATION__MAP.INDEPENDENTLY,
              SECURITY_AGGREGATION__MAP.TOGETHER,
            ]),
            style: { width: '240px' },
          };
        } else {
          return {
            options: transformDictToSelectOptionsNumber([
              SECURITY_AGGREGATION__MAP.INDEPENDENTLY,
              SECURITY_AGGREGATION__MAP.TOGETHER,
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
          Number(SECURITY_AGGREGATION__MAP.BY_GROUP.code) &&
        values.securityControlType !==
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code),
      componentProps: ({ formModel }) => {
        if (
          formModel.securityControlType ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_4.code)
        ) {
          return {
            options: transformDictToSelectOptionsNumber([
              GROUP_CONTROL_TYPES__MAP.KEY_2,
              GROUP_CONTROL_TYPES__MAP.KEY_3,
              GROUP_CONTROL_TYPES__MAP.KEY_4,
              GROUP_CONTROL_TYPES__MAP.KEY_5,
            ]),
            style: { width: '240px' },
          };
        }
        if (
          formModel.securityControlType ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_3.code)
        ) {
          return {
            options: transformDictToSelectOptionsNumber([
              GROUP_CONTROL_TYPES__MAP.KEY_2,
              GROUP_CONTROL_TYPES__MAP.KEY_3,
              GROUP_CONTROL_TYPES__MAP.KEY_4,
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
        } else if (
          formModel.securityControlType ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_8.code)
        ) {
          return {
            options: transformDictToSelectOptionsNumber([
              GROUP_CONTROL_TYPES__MAP.KEY_3,
              GROUP_CONTROL_TYPES__MAP.KEY_4,
            ]),
            style: { width: '240px' },
          };
        } else {
          return {
            options: [],
            style: { width: '240px' },
          };
        }
      },
    },
    {
      field: 'securityList',
      label: '证券列表',
      component: 'Input',
      required: true,
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_3.code),
      render: () => <SecuritySelect style={{ width: '240px' }} />,
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
      label: '期权品种列表',
      component: 'Input',
      required: true,
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_8.code),
      render: () => <OptionsSelect style={{ width: '240px' }} />,
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
