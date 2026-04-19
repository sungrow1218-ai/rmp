import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FC } from 'react';
import { Pagination, Table } from 'antd';

import { PaginationType } from '@/services/typing';
import { GeneraList } from '../../RightTable';

import { getColumns } from '../../untils';

interface Props {
  tableLoading: boolean;
  tableData: GeneraList[];
  setPagination: (pageProps: any) => void;
  pagination: PaginationType;
  getSelectItems: (recordList: GeneraList[]) => void;
  size: number;
  checkable: boolean;
}

const TableColunms: FC<Props> = ({
  setPagination,
  tableLoading,
  tableData,
  pagination,
  getSelectItems,
  checkable,
  size,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    newSelectedRow: GeneraList[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    getSelectItems(newSelectedRow);
  };
  const rowSelection = useMemo(() => {
    return {
      selectedRowKeys,
      onChange: onSelectChange,
    };
  }, [selectedRowKeys]);
  return (
    <div style={{ flex: '1 auto', overflow: 'auto' }}>
      <Table
        columns={getColumns()}
        size="middle"
        dataSource={tableData}
        rowKey={'key'}
        loading={tableLoading}
        rowSelection={
          checkable ? { ...rowSelection, type: 'checkbox' } : undefined
        }
        pagination={false}
        tableLayout="fixed"
        scroll={{
          y: size ? size - 200 : undefined,
          x: 'max-content',
        }}
      />
    </div>
  );
};

export default TableColunms;
