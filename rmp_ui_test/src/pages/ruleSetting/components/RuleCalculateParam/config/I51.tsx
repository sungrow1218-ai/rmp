import { FormSchema } from '@/components/Form';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      field: '9',
      label: '操作类型',
      component: 'Select',
      required: true,
      defaultValue: '8',
      componentProps: {
        options: [{ label: '8-禁止买(含买开、卖开)', value: '8' }],
        style: { width: '240px' },
      },
    },
  ];
};
