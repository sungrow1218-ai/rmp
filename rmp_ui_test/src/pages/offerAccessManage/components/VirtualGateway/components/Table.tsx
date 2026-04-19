import { Button, message, Pagination, Table } from 'antd';
import React, { Key, useEffect, useRef, useState } from 'react';

import { getTableColumns } from '../constant';
import { PaginationType } from '@/services/typing';
import {
  queryVirtualGateWayStatus,
  VirtualGateWayDataType,
} from '@/services/offerAccessMaage';
import useRefHeightResize from '@/hooks/useRefHeightResize';
import { useMemoizedFn, useSize } from 'ahooks';

interface Props {
  pagination: PaginationType;
  setSelectData: React.Dispatch<
    React.SetStateAction<VirtualGateWayDataType | undefined>
  >;
  loading: boolean;
  tableData: VirtualGateWayDataType[];
  onSearch: (page: number, pageSize: number) => Promise<void | undefined>;
  size: number | undefined;
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
  selectedRowKeys: React.Key[];
}

const VirtualGateWayTable: React.FC<Props> = ({
  pagination,
  setSelectData,
  loading,
  tableData,
  onSearch,
  size,
  setSelectedRowKeys,
  selectedRowKeys,
}) => {
  return (
    <div style={{ flex: 1 }}>
      <Table
        columns={getTableColumns()}
        scroll={{ y: size ? size - 200 : undefined, x: 2280 }}
        loading={loading}
        dataSource={tableData}
        pagination={false}
        rowKey={'virtualTgwId'}
        rowSelection={{
          type: 'radio',
          selectedRowKeys,
          onChange: (keys, rows) => {
            setSelectedRowKeys(keys);
            setSelectData(rows[0]);
          },
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              setSelectedRowKeys([record.virtualTgwId]);
              setSelectData(record);
            },
          };
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          pageSizeOptions={['10', '20', '50', '100', '200']}
          showSizeChanger={true}
          style={{
            paddingTop: '5px',
          }}
          showQuickJumper={true}
          showTotal={(total) => `总数：${total}`}
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={onSearch}
        />
      </div>
    </div>
  );
};

export default VirtualGateWayTable;
