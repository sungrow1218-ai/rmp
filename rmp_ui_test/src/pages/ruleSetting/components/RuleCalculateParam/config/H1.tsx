import { FormSchema } from '@/components/Form';
import { BUSINESS_PLATFORM } from '@/utils/dict';
import { transformDictToSelectOptions } from '@/utils/utils';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      field: '7',
      label: '控制价格',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: [
          { label: '1-指令、委托价格', value: '1' },
          { label: '2-最新价', value: '2' },
        ],
        style: { width: '240px' },
      },
    },
    {
      field: '8',
      label: '比较价格',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: [
          { label: '1-最新价', value: '1' },
          { label: '3-昨收盘', value: '3' },
          { label: '4-科创板买入基准价', value: '4' },
          { label: '5-科创板卖出基准价', value: '5' },
          { label: '6-涨停价', value: '6' },
          { label: '7-跌停价', value: '7' },
        ],
        style: { width: '240px' },
      },
    },
    {
      field: '29',
      label: '价格类型',
      component: 'Select',
      required: true,
      defaultValue: '-1',
      componentProps: {
        options: [
          { label: '不区分', value: '-1' },
          { label: '1-限价', value: '1' },
          { label: '2-市价', value: '2' },
        ],
        style: { width: '240px' },
      },
    },
    {
      field: '117',
      label: '委托方向',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: [
          { label: '1-买', value: '1' },
          { label: '2-卖', value: '2' },
          { label: '3-买+卖', value: '3' },
        ],
        style: { width: '240px' },
      },
    },
    {
      field: '15',
      label: '计算模式',
      component: 'Select',
      required: true,
      defaultValue: '0',
      componentProps: {
        options: [
          { label: '0-除法', value: '0' },
          { label: '1-减法', value: '1' },
        ],
        style: { width: '240px' },
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
