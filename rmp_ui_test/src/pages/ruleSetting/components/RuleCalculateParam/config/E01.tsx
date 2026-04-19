import { FormSchema } from '@/components/Form';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      field: '5',
      label: '统计范围',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: [{ label: '1-全部持仓', value: '1' }],
        style: { width: '240px' },
      },
    },
    {
      field: '3',
      label: '持仓类型',
      component: 'Select',
      required: true,
      defaultValue: '-1',
      componentProps: {
        options: [
          { label: '不区分', value: '-1' },
          { label: '3-多仓（看涨）', value: '3' },
        ],
        style: { width: '240px' },
      },
    },
  ];
};
