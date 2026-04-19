import { FormSchema } from '@/components/Form';
import {
  CONTROL_TYPE,
  EXEMPT_PRICE_TYPE,
  IDENTIFY_CONDITION,
  SECURITY_CONTROL_TYPES__MAP,
} from '@/utils/dict';
import { INVEST_TYPE } from '@/utils/dictEntrust';

function safePercentage(num: number, decimalPlaces = 2) {
  if (isNaN(num)) return 'Invalid Number';
  const factor = Math.pow(10, decimalPlaces);
  const value = Math.round(num * 100 * factor) / factor;
  return value.toString();
}

interface Props {
  securityControlType?: number;
}

export const getSchemas = (param: Props): FormSchema[] => {
  return [
    {
      field: '98',
      label: '控制类型',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: ({ formAction }) => {
        if (
          param.securityControlType ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code)
        ) {
          return {
            options: CONTROL_TYPE.filter((i) => i.code === '1').map((i) => ({
              label: `${i.code}-${i.name}`,
              value: i.code,
            })),
            onChange() {
              formAction.setFieldsValue({ '99': undefined, '100': undefined });
            },
            style: { width: '240px' },
          };
        } else {
          return {
            options: CONTROL_TYPE.map((i) => ({
              label: `${i.code}-${i.name}`,
              value: i.code,
            })),
            onChange() {
              formAction.setFieldsValue({ '99': undefined, '100': undefined });
            },
            style: { width: '240px' },
          };
        }
      },
    },
    {
      field: '99',
      label: '大额认定条件',
      component: 'Select',
      required: true,
      ifShow: ({ values }) => values['98'] === '2',
      componentProps: ({ formAction }) => ({
        options: IDENTIFY_CONDITION.map((i) => ({
          label: `${i.code}-${i.name}`,
          value: i.code,
        })),
        onChange() {
          formAction.setFieldsValue({ '100': undefined });
        },
        style: { width: '240px' },
      }),
    },
    {
      field: '100',
      label: '大额撤单认定阈值',
      labelWidth: 120,
      component: 'InputNumber',
      required: true,
      ifShow: ({ values }) => values['98'] === '2',
      componentProps: ({ formModel, formAction }) => {
        if (formModel['99'] === '1') {
          return {
            min: 0.0001,
            max: 100,
            precision: 4,
            step: 0.0001,
            addonAfter: '%',
            formatter: (value) => (value ? safePercentage(Number(value)) : ''),
            parser: (val) => (val ? (Number(val) * 100) / 10000 : Number(val)),
            stringMode: true,
            style: { width: '240px' },
          };
        } else {
          return {
            min: 1,
            max: 99999999,
            addonAfter: '手',
            style: { width: '240px' },
          };
        }
      },
    },
    {
      field: '81',
      label: '豁免价格类型',
      component: 'MultipleSelect',
      componentProps: {
        options: EXEMPT_PRICE_TYPE.map((i) => ({
          label: `${i.code}-${i.name}`,
          value: i.code,
          disabled: !!i.disabled,
        })),
        style: { width: '240px' },
        showDisabledDropdown: true,
      },
    },
    {
      field: '82',
      label: '豁免投资类型',
      component: 'MultipleSelect',
      componentProps: {
        options: [INVEST_TYPE[0], INVEST_TYPE[1], INVEST_TYPE[2]].map((i) => ({
          label: `${i.code}-${i.name}`,
          value: i.code,
        })),
        style: { width: '240px' },
        showDisabledDropdown: true,
      },
    },
  ];
};
