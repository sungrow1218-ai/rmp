import React, { Key, useEffect, useRef, useState } from 'react';

import { Button, Pagination, Switch, Table } from 'antd';
import styles from './styles.less';
import { ColumnsType } from 'antd/es/table';
import { PaginationType } from '@/services/typing';
import { useMemoizedFn, useSize } from 'ahooks';
import {
  AccountGroupRelationResultList,
  queryAccountGroupRelation,
} from '@/services/accountGroup';
import TemplateGroupView from '@/pages/ruleSetting/RuleTemplateGroup/TemplateGroupView';
import ViewRuleModeModal from '../ViewRuleModeModal';
import { RuleTemplateGroupIDTO } from '@/services/ruleSetting/idto';
import UnionControlTypeTag from '@/pages/ruleSetting/components/UnionControlTypeTag';

interface Props {
  accountGroupId?: number;
  queryPermission: boolean;
  operatePermission: boolean;
  dataPermission: boolean;
  isOpenRefetch: boolean;
  setIsOpenRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectItems: React.Dispatch<
    React.SetStateAction<AccountGroupRelationResultList[]>
  >;
}

const RuleGroupTable: React.FC<Props> = ({
  accountGroupId,
  queryPermission,
  operatePermission,
  dataPermission,
  isOpenRefetch,
  setIsOpenRefetch,
  setSelectItems,
}) => {
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [tableData, setTableData] = useState<AccountGroupRelationResultList[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [openRuleMode, setOpenRuleMode] = useState<boolean>(false);
  const [ruleTemplateGroupId, setRuleTemplateGroupId] = useState<
    number | undefined
  >(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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

  useEffect(() => {
    if (isOpenRefetch) {
      queryRuleModeInfo(1, pagination.pageSize);
      setSelectItems([]);
      setSelectedRowKeys([]);
      setIsOpenRefetch(false);
    }
  }, [isOpenRefetch]);

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
            checked={value === 1}
            checkedChildren="开启"
            disabled={true}
            unCheckedChildren="关闭"
          />
        );
      },
    },
    {
      dataIndex: 'controlMode',
      title: '控制方式',
      ellipsis: true,
      render: (value) => {
        return (
          <UnionControlTypeTag text={value === 0 ? '单独控制' : '联合控制'} />
        );
      },
    },
    {
      dataIndex: 'opreation',
      title: '操作',
      fixed: 'right',
      width: 200,
      render: (value, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setOpenRuleMode(true);
              setRuleTemplateGroupId(record.ruleTmplGroupId);
            }}
          >
            查看
          </Button>
        );
      },
    },
  ];
  const ref = useRef(null);
  const size = useSize(ref);

  return (
    <div className={styles.accountGroupTable}>
      <div style={{ flex: 1 }} ref={ref}>
        <Table
          columns={ruleGroupCloums}
          loading={loading}
          dataSource={tableData}
          size="middle"
          scroll={{ y: size?.height ? size.height - 60 : 400 }}
          rowKey={'ruleTmplGroupId'}
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            columnWidth: 80,
            selectedRowKeys,
            onChange: (_selectedRowKeys, _selectItems) => {
              setSelectedRowKeys(_selectedRowKeys);
              setSelectItems(_selectItems);
            },
          }}
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
      <ViewRuleModeModal
        open={openRuleMode}
        setOpen={setOpenRuleMode}
        ruleTemplateGroupId={ruleTemplateGroupId}
      />
    </div>
  );
};

export default RuleGroupTable;
