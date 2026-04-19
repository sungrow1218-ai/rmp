import { FormSchema } from '@/components/Form';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      field: '10003',
      label: '仅控制瞬时撤单',
      component: 'Select',
      labelWidth: 130,
      required: true,
      defaultValue: '0',
      componentProps: {
        options: [
          { label: '0-否', value: '0' },
          { label: '1-是', value: '1' },
        ],
        style: {
          width: '240px',
        },
      },
    },
  ];
};
