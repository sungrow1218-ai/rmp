import { Button, message, Pagination, Table } from 'antd';
import React, { Key, useEffect, useRef, useState } from 'react';

import { getTableColumns } from '../constant';
import { PaginationType } from '@/services/typing';
import { VirtualTGWRouterDataType } from '@/services/offerAccessMaage';

interface Props {
  pagination: PaginationType;
  setSelectData: React.Dispatch<
    React.SetStateAction<VirtualTGWRouterDataType | undefined>
  >;
  loading: boolean;
  tableData: VirtualTGWRouterDataType[];
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
  console.log('====================================');
  console.log(tableData);
  console.log('====================================');
  return (
    <div style={{ flex: 1 }}>
      <Table
        columns={getTableColumns()}
        scroll={{ y: size ? size - 190 : undefined, x: 2700 }}
        loading={loading}
        dataSource={tableData}
        pagination={false}
        rowKey={'routerId'}
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
            // onDoubleClick: () => {
            //   if (!record.tgwId) return;
            //   setSelectedRowKeys([record.tgwId]);
            //   // onEdit(record);
            // },
            onClick: () => {
              setSelectedRowKeys([record.routerId]);
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
