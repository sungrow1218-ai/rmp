import { FormSchema } from '@/components/Form';

export const getSchemas = (): FormSchema[] => {
  return [
    {
      field: 'procedureName',
      label: '流程名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入流程名称',
      },
    },
    {
      field: 'creator',
      label: '发起人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发起人',
      },
    },
    {
      field: 'createBetween',
      label: '发起日期',
      component: 'RangePicker',
    },
    {
      field: 'procedureCode',
      label: '流程编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入流程编号',
      },
    },
    {
      field: 'currenProcessor',
      label: '审批人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入审批人',
      },
    },
    {
      field: 'finishTime',
      label: '办结日期',
      component: 'RangePicker',
    },
    {
      field: 'fileds',
      label: '查询条件',
      component: 'ApiRadioGroup',
      itemProps: {
        wrapperCol: {
          // span: 16,
        },
        style: {
          display: 'flex',
        },
      },
      componentProps: {
        optionType: 'button',
        options: [
          {
            label: '全部流程',
            value: '',
          },
          {
            label: '我发起的',
            value: 1,
          },
          {
            label: '我审批的',
            value: 2,
          },
          {
            label: '通知阅读',
            value: 3,
          },
          {
            label: '我的待办',
            value: 4,
          },
        ],
        style: {
          width: '588px',
        },
      },
    },
  ];
};
