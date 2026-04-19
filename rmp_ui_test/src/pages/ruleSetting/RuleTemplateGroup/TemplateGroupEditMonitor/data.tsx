import { FormSchema } from '@/components/Form';

export const formSchemas: FormSchema[] = [
  {
    field: 'ruleTmplGroupName',
    label: '规则组名称',
    labelWidth: 120,
    component: 'Input',
    rules: [
      { required: true, message: '请填写规则组名称' },
      { max: 100, message: '不能超过100字符' },
    ],
    componentProps: {
      placeholder: '请填写规则组名称',
      style: { width: '580px' },
      allowClear: true,
    },
  },
  {
    field: 'description',
    label: '描述',
    labelWidth: 120,
    component: 'InputTextArea',
    rules: [{ max: 500, message: '不能超过500字符' }],
    componentProps: {
      placeholder: '请填写描述',
      style: { width: '580px' },
      allowClear: true,
    },
  },
];
