import React from 'react';
import { FormSchema } from '@/components/Form';
import { SECURITY_CONTROL_TYPES__MAP } from '@/utils/dict';
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
        if (
          formModel['14'] === '9' &&
          param?.securityControlType &&
          param?.securityControlType !== 1
        ) {
          formAction.setFieldValue('14', null);
        }
        if (
          formModel['14'] === '10' &&
          param?.securityControlType &&
          param?.securityControlType === 1
        ) {
          formAction.setFieldValue('14', null);
        }
        if (
          Number(param?.securityControlType) ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code)
        ) {
          return {
            options: [
              { label: '1-当日合计控制', value: '1' },
              { label: '2-单笔委托控制', value: '2' },
              { label: '9-按分钟控制', value: '9' },
            ],
            onChange(value, option) {
              formAction.setFieldValue('6', null);
              if (
                formModel['14'] === '2' &&
                param?.unionControlType &&
                param?.unionControlType.toString() === '1'
              ) {
                formAction.setFieldValue('14', null);
              }
            },
            style: { width: '240px' },
          };
        } else {
          return {
            options: [
              { label: '1-当日合计控制', value: '1' },
              {
                label: '2-单笔委托控制',
                value: '2',
              },
              { label: '10-按自然周控制', value: '10' },
            ],
            onChange(value, option) {
              formAction.setFieldValue('6', null);
              if (
                formModel['14'] === '2' &&
                param?.unionControlType &&
                param?.unionControlType.toString() === '1'
              ) {
                formAction.setFieldValue('14', null);
              }
            },
            style: { width: '240px' },
          };
        }
      },
    },
    {
      field: '6',
      label: '计算方式',
      component: 'Select',
      required: true,
      componentProps: ({ formModel, formAction }) => {
        if (formModel['14'] === '9') {
          return {
            options: [{ label: '1-按金额计算', value: '1' }],
            style: { width: '240px' },
          };
        }
        if (
          param?.securityControlType &&
          [
            Number(SECURITY_CONTROL_TYPES__MAP.KEY_6.code),
            Number(SECURITY_CONTROL_TYPES__MAP.KEY_8.code),
          ].includes(param?.securityControlType)
        ) {
          if (formModel['6'] === '1') {
            formAction.setFieldValue('6', null);
          }
          return {
            options: [{ label: '2-按数量计算', value: '2' }],
            style: { width: '240px' },
          };
        } else {
          return {
            options: [
              { label: '1-按金额计算', value: '1' },
              { label: '2-按数量计算', value: '2' },
            ],
            style: { width: '240px' },
          };
        }
      },
    },
    {
      field: '80',
      label: '时间类型',
      component: 'Select',
      required: true,
      ifShow: ({ values }) => values['14'] === '9',
      defaultValue: '1',
      componentProps: {
        options: [
          { label: '1-滑动分钟', value: '1' },
          { label: '2-机械分钟', value: '2' },
        ],
        style: { width: '240px' },
      },
    },
    {
      field: '47',
      label: '控制时间',
      component: 'InputNumber',
      required: true,
      ifShow: ({ values }) => values['14'] === '9',
      itemProps: {
        wrapperCol: {
          prefixCls: 'inputNumber100',
        },
      },
      componentProps: {
        min: 1,
        max: 5,
        addonAfter: '分钟',
        step: 1,
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
      dynamicRules({ values, field }) {
        return [
          {
            required: true,
            message: '请选择委托方向',
            validateTrigger: 'change',
            validateFirst: true,
            type: 'object',
          },
          {
            message: '委托增加方向为必选项',
            validateTrigger: 'change',
            validateFirst: true,
            validator: (rule, value, callback) => {
              if (!value['102'] || value['102'].length === 0) {
                throw new Error('委托增加方向为必选项');
              } else {
                callback();
              }
            },
          },
        ];
      },
      render: ({ schema, values }) => (
        <MultiSelectAutoComplete values={values} style={{ width: '240px' }} />
      ),
    },
  ];
};
