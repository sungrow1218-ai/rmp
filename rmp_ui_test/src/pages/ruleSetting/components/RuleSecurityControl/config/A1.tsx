import { FormSchema } from '@/components/Form';
import {
  GROUP_CONTROL_TYPES__MAP,
  SECURITY_AGGREGATION__MAP,
  SECURITY_CONTROL_TYPES__MAP,
} from '@/utils/dict';
import DynamicDimensionSelect from '../component/DynamicDimensionSelect';
import React from 'react';
import SecuritySelect from '@/components/SecuritySelect';
import SecurityTypeSelect from '@/components/SecurityTypeSelectRebuild';
import SecurityPoolSelect from '../component/SecurityPoolSelect';
import FuturesSelect from '../component/FuturesSelect';
import OptionsSelect from '../component/OptionsSelect';
import { queryGeneralLimitGroup } from '@/services/generalLimit';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';

interface Params {
  mode: keyof typeof FORM_MODES;
  calParam192Values?: any;
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
            SECURITY_CONTROL_TYPES__MAP.KEY_3,
            SECURITY_CONTROL_TYPES__MAP.KEY_4,
            SECURITY_CONTROL_TYPES__MAP.KEY_6,
            SECURITY_CONTROL_TYPES__MAP.KEY_8,
            SECURITY_CONTROL_TYPES__MAP.KEY_10,
          ]),
          onChange() {
            formAction.setFieldsValue({
              securitySetIdList: null,
              securityList: null,
              securityFilterClassList: null,
              excludeSecurityList: null,
              securitySummaryType: 0,
              securitySummaryCondition: null,
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
        if (
          param?.calParam192Values === '1' &&
          formModel.securitySummaryType === 2
        ) {
          formAction.setFieldValue('securitySummaryType', undefined);
        }
        if (
          formModel.securityControlType !==
            Number(SECURITY_CONTROL_TYPES__MAP.KEY_10.code) &&
          param?.calParam192Values !== '1'
        ) {
          return {
            options: transformDictToSelectOptionsNumber([
              SECURITY_AGGREGATION__MAP.INDEPENDENTLY,
              SECURITY_AGGREGATION__MAP.BY_GROUP,
            ]),
            style: { width: '240px' },
          };
        } else {
          return {
            options: transformDictToSelectOptionsNumber([
              SECURITY_AGGREGATION__MAP.INDEPENDENTLY,
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
              GROUP_CONTROL_TYPES__MAP.KEY_1,
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
              GROUP_CONTROL_TYPES__MAP.KEY_1,
            ]),
            style: { width: '240px' },
          };
        }
        if (
          formModel.securityControlType ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code)
        ) {
          return {
            options: transformDictToSelectOptionsNumber([
              GROUP_CONTROL_TYPES__MAP.KEY_1,
            ]),
            style: { width: '240px' },
          };
        }
        if (
          formModel.securityControlType ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_2.code)
        ) {
          return {
            options: transformDictToSelectOptionsNumber([
              GROUP_CONTROL_TYPES__MAP.KEY_1,
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
          style={{ width: '360px' }}
          secuControl={[
            '10',
            '11',
            '1201',
            '1202',
            '1203',
            '1301',
            '1302',
            '1303',
            '1304',
            '1401',
            '1402',
            '1404',
          ]}
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
      field: 'securitySetIdList',
      label: '限仓分组列表',
      required: true,
      component: 'ApiSelect',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_10.code),
      componentProps: {
        api: async (params: any) => {
          const {
            data: { resultList },
          } = await queryGeneralLimitGroup(params);
          return resultList.map((i: any) => ({
            label: `${i.groupId}-${i.groupName}`,
            value: i.groupId,
            ...i,
          }));
        },
        params: { pageId: 1, pageSize: 5000 },
        style: { width: '240px' },
      },
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
      field: 'excludeSecurityList',
      label: '排除证券列表',
      required: false,
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code),
      component: 'Input',
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
