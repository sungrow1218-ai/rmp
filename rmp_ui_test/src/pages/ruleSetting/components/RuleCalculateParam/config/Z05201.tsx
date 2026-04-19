import { FormSchema } from '@/components/Form';
import { ENTRUST_DIRECTION } from '@/utils/dict';

export const getSchemas = (): FormSchema[] => {
  return [
    /** 4-委托方向 1-买入、2-卖出，多选 */
    {
      field: '4',
      label: '委托方向',
      component: 'MultipleSelect',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: ENTRUST_DIRECTION.map((op: any) => {
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
