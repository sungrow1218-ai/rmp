import { FormSchema } from '@/components/Form';
import { ENTRUST_TYPE } from '@/utils/dict';

export const getSchemas = (): FormSchema[] => {
  return [
    /** 76-委托类型 1-报单委托、2-撤单委托，多选 */
    {
      field: '76',
      label: '委托类型',
      component: 'MultipleSelect',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: ENTRUST_TYPE.map((op: any) => {
          return {
            label: `${op.code}-${op.name}`,
            value: op.code,
          };
        }),
        style: { width: '240px' },
      },
    },
  ];
};
