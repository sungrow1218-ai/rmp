import { FormSchema } from '@/components/Form';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      field: '14',
      label: '额度方式',
      component: 'Select',
      required: true,
      defaultValue: '9',
      componentProps: {
        options: [{ label: '9-按分钟控制', value: '9' }],
        style: { width: '240px' },
      },
    },
    {
      field: '6',
      label: '计算方式',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: [{ label: '1-按金额计算', value: '1' }],
        style: { width: '240px' },
      },
    },
    {
      field: '80',
      label: '时间类型',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: [{ label: '1-平滑分钟', value: '1' }],
        style: { width: '240px' },
      },
    },
    {
      field: '47',
      label: '控制时间',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: [
          { label: '1分钟', value: '1' },
          { label: '2分钟', value: '2' },
          { label: '3分钟', value: '3' },
          { label: '4分钟', value: '4' },
          { label: '5分钟', value: '5' },
        ],
        style: { width: '240px' },
      },
    },
    {
      field: '4',
      label: '委托方向',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: [
          { label: '1-买', value: '1' },
          { label: '2-卖', value: '2' },
        ],
        style: { width: '240px' },
      },
    },
  ];
};
