import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FC } from 'react';
import { Pagination, Table } from '@ht/sprite-ui';
import { QuerySecuPoolRspDTO } from '@/pages/securityPool/contants/tyeping';
import { getColumns } from '@/pages/securityPool/contants/contants';
import { useSize } from 'ahooks';
import { PaginationType } from '@/services/typing';
import { PaginationProps } from '@ht/sprite-ui/es/pagination';
import styles from './style.less';

interface Props {
  tableLoading: boolean;
  visible: boolean;
  tableData: QuerySecuPoolRspDTO[];
  setPagination: (pageProps: any) => void;
  pagination: PaginationProps;
  getRowData: (p: any) => void;
  getTableData: (P: PaginationType) => void;
}

const PoolDetailTable: FC<Props> = ({
  setPagination,
  tableLoading,
  tableData,
  getRowData,
  pagination,
  visible,
  getTableData,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    newSelectedRow: { [key: string]: any }
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    getRowData(newSelectedRow);
  };
  const rowSelection = useMemo(() => {
    return {
      selectedRowKeys,
      onChange: onSelectChange,
    };
  }, [selectedRowKeys]);
  const carRef = useRef(null);
  const sizes = useSize(carRef);
  useEffect(() => {
    setSelectedRowKeys([]);
    getRowData([]);
  }, [visible]);
  return (
    <div
      ref={carRef}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'flex-end',
        overflow: 'hidden',
      }}
    >
      <div className={styles.poolDetailtableBase}>
        <Table
          columns={getColumns()}
          dataSource={tableData ?? []}
          loading={tableLoading}
          rowSelection={{ ...rowSelection, type: 'checkbox' }}
          pagination={false}
          tableLayout="fixed"
          scroll={{
            y: tableData.length > 0 && sizes ? sizes.height - 110 : undefined,
            x: 1400,
          }}
        />
      </div>

      {
        <Pagination
          pageSizeOptions={['10', '20', '50', '100']}
          showSizeChanger={true}
          style={{
            paddingTop: '5px',
            textAlign: 'right',
          }}
          showTotal={(total) => `总数：${total}`}
          current={pagination.current}
          pageSize={pagination.pageSize}
          showQuickJumper={true}
          total={pagination.total}
          onChange={(page, pageSize) =>
            getTableData({ current: page, pageSize })
          }
        />
      }
    </div>
  );
};

export default PoolDetailTable;
