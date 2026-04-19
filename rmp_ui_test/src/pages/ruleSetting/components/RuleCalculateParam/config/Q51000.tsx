import { FormSchema } from '@/components/Form';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      field: '10001',
      label: '委托类型',
      component: 'Select',
      required: true,
      defaultValue: '-1',
      componentProps: {
        options: [
          { label: '不区分', value: '-1' },
          { label: '1-报单委托', value: '1' },
          { label: '2-撤单委托', value: '2' },
        ],
        style: { width: '240px' },
      },
    },
    {
      field: '6',
      label: '计算方式',
      component: 'Select',
      required: true,
      defaultValue: '2',
      componentProps: {
        options: [
          { label: '2-按数量计算', value: '2' },
          { label: '10001-按次数计算', value: '10001' },
        ],
        style: { width: '240px' },
      },
    },
    {
      field: '47',
      label: '控制时间',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 1,
        max: 36000,
        addonAfter: '秒',
        step: 1,
        style: { width: '240px' },
      },
    },
    {
      field: '58',
      label: '特殊控制',
      component: 'Select',
      componentProps: {
        options: [{ label: '10001-废单时不回滚', value: '10001' }],
        style: { width: '240px' },
      },
    },
  ];
};
