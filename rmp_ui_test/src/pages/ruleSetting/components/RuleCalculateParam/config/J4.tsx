import { FormSchema } from '@/components/Form';
import { BUSINESS_PLATFORM } from '@/utils/dict';
import { transformDictToSelectOptions } from '@/utils/utils';

export const getSchemas = (param?: any): FormSchema[] => {
  return [
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
