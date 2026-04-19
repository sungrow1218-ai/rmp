import { FormSchema } from '@/components/Form';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      field: '35',
      label: '是否统计交易所废单',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: [
          { label: '1-统计', value: '1' },
          { label: '2-不统计', value: '2' },
        ],
        style: { width: '240px' },
      },
    },
  ];
};
