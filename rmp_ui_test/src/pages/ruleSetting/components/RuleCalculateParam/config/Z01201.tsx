import { FormSchema } from '@/components/Form';
import { CALCULATION_TIME_WINDOW } from '@/utils/dict';

export const getSchemas = (): FormSchema[] => {
  return [
    /** 1 时间窗口（47） 1-5 分钟，默认 1 分钟 */
    {
      field: '47',
      label: '时间窗口',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: CALCULATION_TIME_WINDOW.map((op: any) => {
          return {
            label: op.name,
            value: op.code,
          };
        }),
        style: { width: '240px' },
      },
    },
  ];
};
