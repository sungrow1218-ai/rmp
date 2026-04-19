import { FormSchema } from '@/components/Form';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      label: '席位编码',
      field: 'seatCode',
      component: 'Input',
    },
    {
      label: '席位名称',
      field: 'seatName',
      component: 'Input',
    },
  ];
};
