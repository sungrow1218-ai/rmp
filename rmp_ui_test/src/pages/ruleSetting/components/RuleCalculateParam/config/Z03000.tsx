import { FormSchema } from '@/components/Form';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      field: '55',
      label: '业务平台',
      component: 'MultipleSelect',
      componentProps: {
        options: [
          { label: '1-上海竞价', value: '1' },
          { label: '4-深圳竞价', value: '4' },
        ],
        style: { width: '240px' },
        showDisabledDropdown: true,
      },
    },
  ];
};
