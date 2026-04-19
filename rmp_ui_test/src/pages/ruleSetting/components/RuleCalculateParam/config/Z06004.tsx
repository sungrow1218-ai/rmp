import { FormSchema } from '@/components/Form';
import {
  CALCULATION_TIME_WINDOW,
  LIFT_AND_SUPPRESSION_CALCULATION_TYPES,
} from '@/utils/dict';

export const getSchemas = (): FormSchema[] => {
  return [
    /** 1 时间窗口（47） 1分钟，默认 1 分钟 */
    {
      field: '47',
      label: '时间窗口',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: [CALCULATION_TIME_WINDOW[0]].map((op: any) => {
          return {
            label: op.name,
            value: op.code,
          };
        }),
        style: { width: '240px' },
      },
    },
    /** 2 计算方式（130） 1-单边计算拉抬或打压 or 2-拉抬和打压合并计算 单选 */
    {
      field: '130',
      label: '计算方式',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: {
        options: LIFT_AND_SUPPRESSION_CALCULATION_TYPES.map((op: any) => {
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
