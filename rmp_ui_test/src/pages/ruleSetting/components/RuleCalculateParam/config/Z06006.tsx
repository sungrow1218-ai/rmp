import { FormSchema } from '@/components/Form';
import { BLOCK_ORDER_TYPES } from '@/utils/dict';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      field: '10002',
      label: '拦截订单类型',
      component: 'MultipleSelect',
      required: true,
      componentProps: {
        options: BLOCK_ORDER_TYPES.map((p) => ({
          label: `${p.code}-${p.name}`,
          value: p.code,
        })),
        style: { width: '240px' },
      },
    },
  ];
};
