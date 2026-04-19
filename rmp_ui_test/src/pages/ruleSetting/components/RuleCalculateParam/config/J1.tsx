import { FormSchema } from '@/components/Form';
import { BUSINESS_PLATFORM, EXEMPT_PRICE_TYPE } from '@/utils/dict';
import { INVEST_TYPE } from '@/utils/dictEntrust';
import { transformDictToSelectOptions } from '@/utils/utils';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      field: '10',
      label: '对敲方式',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: [
          { label: '1-未成部分不允许买价>=卖价', value: '1' },
          // { label: '2-不能有买有卖（废单、已成除外）', value: '2' },
        ],
        style: { width: '240px' },
      },
    },
    {
      field: '59',
      label: '人员控制',
      component: 'Select',
      required: true,
      defaultValue: '2',
      componentProps: {
        options: [{ label: '2-单人员、多人员联合控制', value: '2' }],
        style: { width: '240px' },
      },
    },
    {
      field: '60',
      label: '反向信息',
      component: 'MultipleSelect',
      componentProps: {
        options: [
          { label: '显示层次信息', value: '1' },
          { label: '显示价格', value: '2' },
          { label: '显示数量', value: '3' },
        ],
        style: { width: '240px' },
      },
    },
    {
      field: '81',
      label: '豁免价格类型',
      component: 'MultipleSelect',
      componentProps: {
        options: EXEMPT_PRICE_TYPE.map((i) => ({
          label: `${i.code}-${i.name}`,
          value: i.code,
          disabled: !!i.disabled,
        })),
        style: { width: '240px' },
        showDisabledDropdown: true,
      },
    },
    {
      field: '82',
      label: '豁免投资类型',
      component: 'MultipleSelect',
      componentProps: {
        options: [INVEST_TYPE[0], INVEST_TYPE[1], INVEST_TYPE[2]].map((i) => ({
          label: `${i.code}-${i.name}`,
          value: i.code,
        })),
        style: { width: '240px' },
        showDisabledDropdown: true,
      },
    },
    {
      field: '55',
      label: '业务平台',
      component: 'MultipleSelect',
      componentProps: {
        options: transformDictToSelectOptions(
          BUSINESS_PLATFORM.filter((r) => r.code !== '-1').map((i) => i)
        ),
        style: { width: '240px' },
        showDisabledDropdown: true,
      },
    },
  ];
};
