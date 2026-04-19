import { Key } from '@ht/sprite-ui/lib/table/interface';
import { BasicTableProps } from '../types/table';
import { useCreation, useGetState } from 'ahooks';
import { parseRowKey, parseRowKeyValue } from '../helper';
import { ROW_KEY } from '../const';
import { isArray, isFunction, omit } from 'lodash-es';
import { nextTick } from '@/utils/dom';
import { findNodeAll } from '@/utils/tree';
import { useEffect } from 'react';

export const useRowSelection = (
  props: BasicTableProps,
  tableData: Recordable[],
  onSelectionChange: BasicTableProps['onSelectionChange']
) => {
  const { rowSelection, rowKey, autoCreateKey, childrenColumnName } = props;
  const [selectedRowKeys, setSelectedRowKeys, getSelectedRowKeys] = useGetState<
    Key[]
  >([]);
  const [selectedRows, setSelectedRows, getSelectedRows] = useGetState<
    Recordable[]
  >([]);

  const autoCreateKeyCreation = useCreation(() => {
    return !!autoCreateKey && !rowKey;
  }, [autoCreateKey, rowKey]);

  const rowKeyCreation = useCreation(() => {
    return autoCreateKeyCreation ? ROW_KEY : rowKey;
  }, [autoCreateKeyCreation, rowKey]);

  const rowSelectionCreation = useCreation(() => {
    if (!rowSelection) {
      return null;
    }

    return {
      selectedRowKeys,
      onChange: (
        rowKeys: Key[],
        selectedRows: any[],
        isClickCustomRow?: boolean
      ) => {
        // if (isClickCustomRow) {
        //   // 点击行触发

        //   // 维持外部定义的 onChange 回调
        //   rowSelection.onChange?.(rowKeys, selectedRows);
        // } else {
        // 点击 checkbox/radiobox 触发

        // 取出【当前页】所有 keyValues
        // const currentPageKeys = tableData.map((o) =>
        //   parseRowKeyValue(rowKeyCreation, o)
        // );

        // 从【所有分页】已选的 keyValues，且属于【当前页】的部分
        // for (const selectedKey of selectedRowKeys.filter((k: any) =>
        //   currentPageKeys.includes(k)
        // )) {
        //   // 判断是否已经不存在于【当前页】
        //   if (rowKeys.findIndex((k) => k === selectedKey) < 0) {
        //     // 不存在 = 取消勾选
        //     const removeIndex = selectedRowKeys.findIndex(
        //       (k) => k === selectedKey
        //     );
        //     console.log(removeIndex);
        //     if (removeIndex > -1) {
        //       // 取消勾选
        //       setSelectedRowKeys((pre) => [...pre.splice(removeIndex, 1)]);
        //       setSelectedRows((pre) => [...pre.splice(removeIndex, 1)]);
        //     }
        //   }
        // }

        // 存在于【当前页】，但不存在于【所有分页】，则认为是新增的
        // for (const selectedKey of rowKeys) {
        //   const existIndex = selectedRowKeys.findIndex(
        //     (k) => k === selectedKey
        //   );
        //   if (existIndex < 0) {
        //     // 新增勾选
        //     setSelectedRowKeys((pre) => [...pre, selectedKey]);
        //     const record = selectedRows.find(
        //       (o) => parseRowKeyValue(rowKeyCreation, o) === selectedKey
        //     );
        //     if (record) {
        //       console.log(record);
        //       setSelectedRows((pre) => [...pre, record]);
        //       setSelectedRowKeys((prev) => [
        //         ...prev,
        //         parseRowKeyValue(rowKeyCreation, record),
        //       ]);
        //     }
        //   }
        // }

        // 维持外部定义的onChange回调
        rowSelection.onChange?.(rowKeys, selectedRows);
        // }
      },
      ...omit(rowSelection, ['onChange']),
    };
  }, [rowSelection, selectedRowKeys, tableData, rowKeyCreation]);

  const setSelectedRowKeysFn = (keyValues: Key[]) => {
    setSelectedRowKeys(keyValues);
    const rows = [...tableData].concat([...selectedRows]);
    const allSelectedRows = findNodeAll(
      rows,
      (item: any) =>
        keyValues?.includes(parseRowKeyValue(rowKeyCreation, item)),
      {
        children: childrenColumnName ?? 'children',
      }
    );
    const trueSelectedRows: any[] = [];
    keyValues?.forEach((keyValue: Key) => {
      const found = allSelectedRows.find(
        (item: any) => parseRowKeyValue(rowKeyCreation, item) === keyValue
      );
      if (found) {
        trueSelectedRows.push(found);
      } else if (rows[0]) {
        // 跨页的时候，非本页数据无法得到，暂如此处理
        // tableData or selectedRowRef 总有数据
        trueSelectedRows.push({
          [parseRowKey(rowKeyCreation, rows[0])]: keyValue,
        });
      }
    });
    setSelectedRows(trueSelectedRows);
  };

  const setSelectedRowsFn = (rows: Recordable[]) => {
    setSelectedRows(rows);
    setSelectedRowKeys(rows.map((o) => parseRowKeyValue(rowKeyCreation, o)));
  };

  const clearSelectedRowKeys = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const deleteSelectRowByKey = (key: Key) => {
    const index = selectedRowKeys.findIndex((item) => item === key);
    if (index !== -1) {
      setSelectedRowKeysFn([...selectedRowKeys.splice(index, 1)]);
    }
  };

  useEffect(() => {
    const v = rowSelection?.selectedRowKeys;
    if (isArray(v)) {
      setSelectedRowKeysFn(v);
    }
  }, [rowSelection?.selectedRowKeys]);

  useEffect(() => {
    nextTick(() => {
      if (rowSelection) {
        const { onChange } = rowSelection;
        // if (isFunction(onChange)) {
        //   onChange(selectedRowKeys, selectedRows, true);
        // }
        onSelectionChange?.({
          keys: selectedRowKeys,
          rows: selectedRows,
        });
      }
    });
  }, [rowSelection, selectedRowKeys, selectedRows]);

  const getSelectRowKeys = () => {
    return getSelectedRowKeys();
  };

  const getSelectRows = <T = Recordable>() => {
    return getSelectedRows() as T[];
  };

  const getRowSelection = () => {
    return rowSelectionCreation!;
  };

  return {
    getRowSelection,
    rowSelection: rowSelectionCreation,
    getSelectRows,
    getSelectRowKeys,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    deleteSelectRowByKey,
    setSelectedRows: setSelectedRowsFn,
  };
};
