import { RolePermissonProps } from '@/pages/roleManage/contant/typing';
import { Table, Transfer } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import type { TransferItem, TransferProps } from 'antd/es/transfer';
import difference from 'lodash/difference';
import React from 'react';

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: RolePermissonProps[];
  leftColumns: ColumnsType<any>;
  rightColumns: ColumnsType<any>;
  loaded: boolean;
  initData: RolePermissonProps[];
}
const TableTransfer = ({
  leftColumns,
  rightColumns,
  loaded,
  initData,
  ...restProps
}: TableTransferProps) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection: TableRowSelection<TransferItem> = {
        getCheckboxProps: (item) => ({
          disabled: listDisabled || item.disabled,
        }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys as string[], selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key as string, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };
      let data: RolePermissonProps[] = [];
      if (direction === 'right') {
        data = initData.filter((r) => restProps.targetKeys?.includes(r.key));
      }

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={direction === 'right' ? data : filteredItems}
          size="small"
          loading={direction === 'left' ? loaded : false}
          style={{ pointerEvents: listDisabled ? 'none' : undefined }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(
                key as string,
                !listSelectedKeys.includes(key as string)
              );
            },
          })}
          pagination={{
            defaultPageSize: 20,
            showTotal: (total) => `共${total}条`,
            showSizeChanger: true,
          }}
          // pagination={false}
          scroll={{ y: 368 }}
        />
      );
    }}
  </Transfer>
);
export default TableTransfer;
