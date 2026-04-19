import React from 'react';
import { FormSchema } from '@/components/Form';
import MultiSelectAutoComplete from '../components/MultiSelectAutoComplete';

interface Props {
  unionControlType?: number;
  securityControlType?: number;
}
export const getSchemas = (param?: Props): FormSchema[] => {
  return [
    {
      field: '14',
      label: '额度方式',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: ({ formAction, formModel }) => {
        return {
          options: [{ label: '1-当日合计控制', value: '1' }],
          style: { width: '240px' },
        };
      },
    },
    {
      field: '6',
      label: '计算方式',
      component: 'Select',
      required: true,
      defaultValue: '1',
      componentProps: ({ formModel, formAction }) => {
        return {
          options: [{ label: '1-按金额计算', value: '1' }],
          style: { width: '240px' },
        };
      },
    },
    {
      field: '102',
      component: 'MultipleSelect',
      ifShow: false,
    },
    {
      field: '103',
      component: 'MultipleSelect',
      ifShow: false,
    },
    {
      field: '102|103',
      label: '委托方向',
      component: 'Input',
      required: true,
      dynamicRules({ values, field }) {
        return [
          {
            required: true,
            message: '请选择委托方向',
            validateTrigger: 'change',
            validator: (rule, value, callback) => {
              if (values[field]?.validate) {
                throw new Error('请选择委托方向');
              } else {
                callback();
              }
            },
          },
        ];
      },
      render: ({ schema, values }) => (
        <MultiSelectAutoComplete
          values={values}
          disabled={true}
          style={{ width: '240px' }}
        />
      ),
    },
  ];
};
