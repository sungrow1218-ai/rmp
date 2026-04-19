import { FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';

export const searchSchemas: FormSchema[] = [
  {
    field: 'acctGroupType',
    label: '账户组类型',
    component: 'Select',
    componentProps: {
      options: [],
      style: { width: '240px' },
      allowClear: true,
    },
  },
  {
    field: 'accountGroupName',
    label: '账户组名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入账户组名称',
      style: { width: '240px' },
      allowClear: true,
    },
  },
];

export const columns: BasicColumn[] = [
  { dataIndex: 'a', title: '账户组名称' },
  { dataIndex: 'b', title: '账户类型' },
  { dataIndex: 'c', title: '账户列表' },
  { dataIndex: 'd', title: '账户控制方式' },
];
