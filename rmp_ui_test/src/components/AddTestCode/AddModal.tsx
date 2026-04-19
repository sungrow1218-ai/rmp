import React, { Key, useEffect, useState } from 'react';

import { Button, Pagination, Switch, Table } from 'antd';
import styles from './styles.less';
import { ColumnsType } from 'antd/es/table';
import { PaginationType } from '@/services/typing';
import { useMemoizedFn } from 'ahooks';
import {
  AccountGroupRelationResultList,
  queryAccountGroupRelation,
} from '@/services/accountGroup';

interface Props {
  accountGroupId?: number;
  queryPermission: boolean;
  operatePermission: boolean;
  dataPermission: boolean;
}
const mockData: AccountGroupRelationResultList[] = [
  {
    ruleTmplGroupId: 1,
    accountGroupId: 101,
    controlMode: 1,
    status: 1,
    remark: '测试数据1',
    createRoleId: 1001,
    createUserCode: 'user001',
    updateUserCode: 'user001',
    createTime: '2024-01-15 10:30:00',
    lastUpdateTime: '2024-01-15 10:30:00',
    ruleTmplGroupName: 'namne',
    accountGroupName: '',
  },
  {
    ruleTmplGroupId: 2,
    accountGroupId: 102,
    controlMode: 2,
    status: 1,
    remark: '测试数据2',
    createRoleId: 1002,
    createUserCode: 'user002',
    updateUserCode: 'user002',
    createTime: '2024-01-16 11:20:00',
    lastUpdateTime: '2024-01-16 11:20:00',
    ruleTmplGroupName: '',
    accountGroupName: '',
  },
  {
    ruleTmplGroupId: 3,
    accountGroupId: 103,
    controlMode: 1,
    status: 0,
    remark: '测试数据3',
    createRoleId: 1003,
    createUserCode: 'user003',
    updateUserCode: 'user003',
    createTime: '2024-01-17 14:15:00',
    lastUpdateTime: '2024-01-17 14:15:00',
    ruleTmplGroupName: '',
    accountGroupName: '',
  },
  {
    ruleTmplGroupId: 4,
    accountGroupId: 104,
    controlMode: 3,
    status: 1,
    remark: '测试数据4',
    createRoleId: 1004,
    createUserCode: 'user004',
    updateUserCode: 'user004',
    createTime: '2024-01-18 09:45:00',
    lastUpdateTime: '2024-01-18 09:45:00',
    ruleTmplGroupName: '',
    accountGroupName: '',
  },
  {
    ruleTmplGroupId: 5,
    accountGroupId: 105,
    controlMode: 1,
    status: 1,
    remark: '测试数据5',
    createRoleId: 1005,
    createUserCode: 'user005',
    updateUserCode: 'user005',
    createTime: '2024-01-19 16:30:00',
    lastUpdateTime: '2024-01-19 16:30:00',
    ruleTmplGroupName: '',
    accountGroupName: '',
  },
  {
    ruleTmplGroupId: 6,
    accountGroupId: 106,
    controlMode: 2,
    status: 0,
    remark: '测试数据6',
    createRoleId: 1006,
    createUserCode: 'user006',
    updateUserCode: 'user006',
    createTime: '2024-01-20 13:10:00',
    lastUpdateTime: '2024-01-20 13:10:00',
    ruleTmplGroupName: '',
    accountGroupName: '',
  },
  {
    ruleTmplGroupId: 7,
    accountGroupId: 107,
    controlMode: 1,
    status: 1,
    remark: '测试数据7',
    createRoleId: 1007,
    createUserCode: 'user007',
    updateUserCode: 'user007',
    createTime: '2024-01-21 08:20:00',
    lastUpdateTime: '2024-01-21 08:20:00',
    ruleTmplGroupName: '',
    accountGroupName: '',
  },
  {
    ruleTmplGroupId: 8,
    accountGroupId: 108,
    controlMode: 3,
    status: 1,
    remark: '测试数据8',
    createRoleId: 1008,
    createUserCode: 'user008',
    updateUserCode: 'user008',
    createTime: '2024-01-22 15:40:00',
    lastUpdateTime: '2024-01-22 15:40:00',
    ruleTmplGroupName: '',
    accountGroupName: '',
  },
  {
    ruleTmplGroupId: 9,
    accountGroupId: 109,
    controlMode: 1,
    status: 0,
    remark: '测试数据9',
    createRoleId: 1009,
    createUserCode: 'user009',
    updateUserCode: 'user009',
    createTime: '2024-01-23 12:00:00',
    lastUpdateTime: '2024-01-23 12:00:00',
    ruleTmplGroupName: '',
    accountGroupName: '',
  },
  {
    ruleTmplGroupId: 10,
    accountGroupId: 110,
    controlMode: 2,
    status: 1,
    remark: '测试数据10',
    createRoleId: 1010,
    createUserCode: 'user010',
    updateUserCode: 'user010',
    createTime: '2024-01-24 17:25:00',
    lastUpdateTime: '2024-01-24 17:25:00',
    ruleTmplGroupName: '',
    accountGroupName: '',
  },
];
const RuleGroupTable: React.FC<Props> = ({
  accountGroupId,
  queryPermission,
  operatePermission,
  dataPermission,
}) => {
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [tableData, setTableData] = useState<AccountGroupRelationResultList[]>(
    []
  );
  // const [selectItems, setSelectItems] = useState<
  //   AccountGroupRelationResultList[]
  // >([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const queryRuleModeInfo = useMemoizedFn(
    async (pageId: number, pageSize: number) => {
      try {
        setLoading(true);
        if (accountGroupId === undefined) return;
        const res = await queryAccountGroupRelation({
          pageId,
          pageSize,
          authorityFlag: 1,
          filterCondition: {
            accountGroupId: [accountGroupId],
          },
        });
        if (res.errorId !== 0) {
          setTableData([]);
          return;
        }
        const _data = res?.data?.resultList ?? [];
        setTableData(_data);
        setPagination({
          current: pageId,
          total: res.data.totalSize,
          pageSize,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  );

  useEffect(() => {
    if (queryPermission) {
      queryRuleModeInfo(1, pagination.pageSize);
    }
  }, [accountGroupId, queryPermission]);

  const ruleGroupCloums: ColumnsType<AccountGroupRelationResultList> = [
    {
      dataIndex: 'ruleTmplGroupId',
      title: '模板ID',
      render: (value) => value ?? '',
    },
    {
      dataIndex: 'ruleTmplGroupName',
      title: '规则模板名称',
      ellipsis: true,
      render: (value) => value ?? '--',
    },
    {
      dataIndex: 'status',
      title: '启用状态',
      render: (value) => {
        return (
          <Switch
            checked={!!value}
            checkedChildren="开启"
            disabled={true}
            unCheckedChildren="关闭"
          />
        );
      },
    },
    {
      dataIndex: 'opreation',
      title: '操作',
      fixed: 'right',
      width: 200,
      render: (value) => {
        return <Button type="link">查看</Button>;
      },
    },
  ];

  return (
    <div className={styles.accountGroupTable}>
      <div style={{ flex: 1 }}>
        <Table
          columns={ruleGroupCloums}
          loading={loading}
          dataSource={mockData}
          size="middle"
          rowKey={'ruleTmplGroupId'}
          pagination={false}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Pagination
          pageSizeOptions={['10', '20', '50', '100']}
          showSizeChanger={true}
          style={{
            paddingTop: '5px',
          }}
          showQuickJumper={true}
          showTotal={(total) => `总数：${total}`}
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) => {
            if (queryPermission) {
              queryRuleModeInfo(page, pageSize);
            }
          }}
        />
      </div>
    </div>
  );
};

export default RuleGroupTable;
