import { FormSchema } from '@/components/Form';
import { BUSINESS_PLATFORM } from '@/utils/dict';
import { transformDictToSelectOptions } from '@/utils/utils';

export const getSchemas = (param?: any): FormSchema[] => {
  return [
    // 去掉：银行间二级、港交所竞价
    {
      field: '55',
      label: '业务平台',
      component: 'MultipleSelect',
      componentProps: {
        options: transformDictToSelectOptions(
          BUSINESS_PLATFORM.filter((r) => !['8', '15'].includes(r.code)).map(
            (i) => i
          )
        ),
        style: { width: '240px' },
        showDisabledDropdown: true,
      },
    },
  ];
};
