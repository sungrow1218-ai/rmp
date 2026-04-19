import { FormSchema } from '@/components/Form';
import {
  SECURITY_AGGREGATION__MAP,
  SECURITY_CONTROL_TYPES__MAP,
} from '@/utils/dict';
import React from 'react';
import MarketSelect from '../component/MarketSelect';
import SecurityTypeSelect from '@/components/SecurityTypeSelectRebuild';
import SecuritySelect from '@/components/SecuritySelect';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';

export const getSchemas = (): FormSchema[] => {
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
            SECURITY_CONTROL_TYPES__MAP.KEY_3,
          ]),
          onChange() {
            formAction.setFieldsValue({
              securitySummaryCondition: null,
              securitySetIdList: null,
              securityList: null,
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
      defaultValue: 0,
      componentProps: {
        options: transformDictToSelectOptionsNumber([
          SECURITY_AGGREGATION__MAP.INDEPENDENTLY,
        ]),
        style: { width: '240px' },
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
          secuControl={[
            '10',
            '11',
            '1201',
            '1202',
            '1301',
            '1302',
            '1303',
            '1304',
            '1401',
            '1402',
            '1404',
            '1501',
          ]}
          style={{ width: '360px' }}
        />
      ),
    },
    {
      field: 'marketId',
      label: '市场',
      required: false,
      component: 'Input',
      render: () => (
        <MarketSelect
          marketsCodeUseForControl={[
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '9',
            '10',
            '34',
            '35',
            '36',
            '105',
            '107',
          ]}
          style={{ width: '240px' }}
        />
      ),
    },
  ];
};
