import React, { useState } from 'react';
import { Table, Button, Popconfirm, Badge, message } from '@ht/sprite-ui';
import {
  PagenationState,
  QuerySecuPoolRspDTO,
} from '@/pages/securityPool/contants/tyeping';
import { useUserRoles } from '@/hooks';
import { getColumns } from '@/pages/securityPool/contants/contants';

interface Props {
  tableLoading: boolean;
  tableData: QuerySecuPoolRspDTO[];
  refetch?: () => void;
  columnsDiy?: any[];
  isDiy?: boolean;
  pagination: PagenationState;
}

const PoolDetailModalTable: React.FC<Props> = ({
  tableLoading,
  tableData,
  refetch,
  columnsDiy,
  isDiy,
  pagination,
}) => {
  return (
    <div>
      <Table
        columns={isDiy ? columnsDiy : getColumns()}
        size="small"
        dataSource={tableData ?? []}
        loading={tableLoading}
        scroll={{ y: 500 }}
        pagination={pagination}
      />
    </div>
  );
};

export default PoolDetailModalTable;
