// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import { useDesign } from '@/hooks/useDesign';
import styles from './BasicTable.less';
import {
  // BasicColumn,
  BasicTableProps,
  ColumnChangeParam,
  InnerHandlers,
  InnerMethods,
  SizeType,
  TableActionType,
} from './types/table';
import React, {
  CSSProperties,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useCreation, useMount } from 'ahooks';
import { useLoading } from './hooks/useLoading';
import { usePagination } from './hooks/usePagination';
import { useRowSelection } from './hooks/useRowSelection';
import { useDataSource } from './hooks/useDataSource';
import { useColumns } from './hooks/useColumns';
import { useTableScrollTo } from './hooks/useScrollTo';
import { useCustomRow } from './hooks/useCustomRow';
import { useTableStyle } from './hooks/useTableStyle';
import { useTableExpand } from './hooks/useTableExpand';
import { useTableHeader } from './hooks/useTableHeader';
import { isArray, omit } from 'lodash-es';
import classNames from 'classnames';
import {
  createTableProviderValue,
  TableContext,
} from './hooks/useTableContext';
import { Table } from '@ht/sprite-ui';
import {
  DEFAULT_FILTER_FN,
  DEFAULT_SIZE,
  DEFAULT_SORT_FN,
  FETCH_SETTING,
  PAGE_SIZE,
} from './const';

const BasicTable = forwardRef<TableActionType, BasicTableProps>(
  (props, ref) => {
    const [innerProps, setInnerProps] = useState<Partial<BasicTableProps>>({});
    const wrapRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef(null);
    const [tableData, setTableDataState] = useState<any[]>([]);
    const { prefixCls } = useDesign('basic-table');

    const propsCreation = useCreation(() => {
      return {
        // 默认值
        clickToRowSelect: true,
        tableSetting: {},
        sortFn: DEFAULT_SORT_FN,
        filterFn: DEFAULT_FILTER_FN,
        autoCreateKey: true,
        striped: true,
        indentSize: 24,
        canColDrag: true,
        fetchSetting: FETCH_SETTING,
        immediate: true,
        emptyDataIsShowTable: true,
        // columns: [] as BasicColumn[],
        showIndexColumn: false,
        ellipsis: true,
        isCanResizeParent: false,
        canResize: true,
        resizeHeightOffset: 0,
        size: DEFAULT_SIZE,
        ...props,
        ...innerProps,
      } as BasicTableProps;
    }, [props, innerProps]);

    const { loading, setLoading } = useLoading(propsCreation.loading);
    const { paginationInfo, getPaginationInfo, setPagination } = usePagination(
      propsCreation.pagination
    );
    const {
      getRowSelection,
      rowSelection,
      getSelectRows,
      setSelectedRows,
      clearSelectedRowKeys,
      getSelectRowKeys,
      deleteSelectRowByKey,
      setSelectedRowKeys,
    } = useRowSelection(
      propsCreation,
      tableData,
      propsCreation.onSelectionChange
    );
    const {
      handleTableChange: onTableChange,
      dataSource,
      getDataSource,
      getRawDataSource,
      getSearchInfo,
      setTableData,
      updateTableDataRecord,
      // deleteTableDataRecord,
      insertTableDataRecord,
      findTableDataRecord,
      fetch,
      rowKey,
      reload,
      autoCreateKey,
      updateTableData,
    } = useDataSource(propsCreation, {
      setTableData: setTableDataState,
      paginationInfo,
      setLoading,
      setPagination,
      clearSelectedRowKeys,
      onFetchSuccess: propsCreation.onFetchSuccess,
      onFetchError: propsCreation.onFetchError,
    });

    const {
      visibleColumns,
      getColumns,
      setCacheColumnsByField,
      setCacheColumns,
      // TODO setColumnWidth
      // setColumnWidth,
      setColumns,
      columns,
      getCacheColumns,
    } = useColumns(propsCreation, paginationInfo);

    const { scrollTo } = useTableScrollTo(tableRef, dataSource);

    const handleTableChange = (
      pagination: any,
      filters: any,
      sorter: any,
      extra: any
    ) => {
      onTableChange(pagination, filters, sorter);
      propsCreation.onChange?.(pagination, filters, sorter, extra);
    };

    const { customRow } = useCustomRow(propsCreation, {
      setSelectedRowKeys,
      getSelectRowKeys,
      clearSelectedRowKeys,
      autoCreateKey,
    });

    const { getRowClassName } = useTableStyle(propsCreation, prefixCls);

    const {
      expandOption,
      expandAll,
      expandRows,
      collapseRows,
      collapseAll,
      handleTableExpand,
    } = useTableExpand(propsCreation, tableData);

    const handlers: InnerHandlers = {
      onColumnsChange: (data: ColumnChangeParam[]) => {
        props.onColumnsChange?.(data);
      },
    };

    const methods: InnerMethods = {
      clearSelectedRowKeys,
      getSelectRowKeys,
    };

    const { headerProps } = useTableHeader(propsCreation, handlers, methods);

    const wrapperClass = useCreation(() => {
      const { className, inset } = propsCreation;
      return classNames(prefixCls, className, {
        [`${prefixCls}--inset`]: inset,
      });
    }, [propsCreation]);

    const emptyDataIsShowTable = useCreation(() => {
      const { emptyDataIsShowTable } = propsCreation;
      if (emptyDataIsShowTable) {
        return true;
      }
      return !!dataSource.length;
    }, [propsCreation, dataSource]);

    const bindValues = useCreation(() => {
      const style: CSSProperties = emptyDataIsShowTable
        ? {}
        : { display: 'none' };
      let propsData: any = {
        onRow: customRow,
        ...propsCreation,
        ...headerProps,
        loading,
        tableLayout: 'fixed',
        rowSelection,
        rowKey,
        columns: visibleColumns,
        pagination: paginationInfo,
        dataSource,
        ...expandOption,
        style: propsCreation.style
          ? { ...propsCreation.style, ...style }
          : style,
      };

      propsData = omit(propsData, ['class', 'onChange']);
      return propsData;
    }, [
      dataSource,
      propsCreation,
      headerProps,
      loading,
      rowSelection,
      visibleColumns,
      rowKey,
      paginationInfo,
      expandOption,
      emptyDataIsShowTable,
    ]);

    const setProps = (inputProps: Partial<BasicTableProps>) => {
      setInnerProps((pre) => ({ ...pre, ...inputProps }));
    };

    const tableAction: TableActionType = {
      tableRef,
      reload,
      getSelectRows,
      setSelectedRows,
      clearSelectedRowKeys,
      getSelectRowKeys,
      deleteSelectRowByKey,
      setPagination,
      setTableData,
      updateTableDataRecord,
      // deleteTableDataRecord,
      insertTableDataRecord,
      findTableDataRecord,
      setSelectedRowKeys,
      setColumns,
      setLoading,
      getDataSource,
      getRawDataSource,
      getSearchInfo,
      setProps,
      getRowSelection,
      getPagination: getPaginationInfo,
      getColumns,
      getCacheColumns,
      updateTableData,
      setCacheColumnsByField,
      expandAll,
      collapseAll,
      expandRows,
      collapseRows,
      scrollTo,
      getSize: () => {
        return bindValues.size as SizeType;
      },
      setCacheColumns,
      clearTableData: () => {
        setTableData([]);
        setPagination({ current: 1, pageSize: PAGE_SIZE, total: 0 });
        clearSelectedRowKeys();
      },
    };

    const contextValue = createTableProviderValue(
      useCreation(
        () => ({
          ...tableAction,
          wrapRef,
          allProps: bindValues,
        }),
        [bindValues, wrapRef]
      )
    );

    useImperativeHandle(ref, () => ({
      ...tableAction,
    }));

    useEffect(() => {
      // 0：表头table；1：表格内容table
      const tableBodyDom = (
        tableRef.current! as HTMLElement
      ).getElementsByTagName('table')[1];
      if (isArray(dataSource) && tableBodyDom) {
        if (dataSource.length > 0) {
          tableBodyDom.style.height = 'auto';
        }
      }
    }, [dataSource]);

    useEffect(() => {
      if (props.onDataChange) {
        props.onDataChange(dataSource);
      }
    }, [dataSource]);

    return (
      <TableContext.Provider value={contextValue}>
        <div ref={wrapRef} className={styles[wrapperClass]}>
          <Table
            ref={tableRef}
            {...bindValues}
            onChange={handleTableChange}
            expandable={{ onExpand: handleTableExpand }}
            rowClassName={getRowClassName}
            style={{
              ...bindValues.styles,
              height: '100%',
            }}
          />
        </div>
      </TableContext.Provider>
    );
  }
);

export default BasicTable;
