// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import type {
  BasicTableProps,
  FetchParams,
  SorterResult,
} from '../types/table';
import type { PaginationProps } from '../types/pagination';
import { useCreation, useGetState, useMount, useReactive } from 'ahooks';
import { useEffect } from 'react';
import { get, isBoolean, isFunction, isPlainObject, merge } from 'lodash-es';
import { FETCH_SETTING, PAGE_SIZE, ROW_KEY } from '../const';
import { buildUUID } from '@/utils/uuid';
import { Key } from '@ht/sprite-ui/lib/table/interface';
import { parseRowKeyValue } from '../helper';
import { nextTick } from '@/utils/dom';

interface ActionType {
  paginationInfo: boolean | PaginationProps;
  setPagination: (info: Partial<PaginationProps>) => void;
  setLoading: (loading: boolean) => void;
  clearSelectedRowKeys: () => void;
  setTableData: (data: Recordable[]) => void;
  onFetchSuccess: BasicTableProps['onFetchSuccess'];
  onFetchError?: BasicTableProps['onFetchError'];
}

interface SearchState {
  sortInfo: Recordable;
  filterInfo: Record<string, string[]>;
}

export const useDataSource = (
  props: BasicTableProps,
  {
    paginationInfo,
    setPagination,
    setLoading,
    clearSelectedRowKeys,
    setTableData: inputSetTableData,
    onFetchError,
    onFetchSuccess,
  }: ActionType
) => {
  const searchState = useReactive<SearchState>({
    sortInfo: {},
    filterInfo: {},
  });
  const {
    dataSource: propsDataSource,
    api,
    clearSelectOnPageChange,
    sortFn,
    filterFn,
    searchInfo: propsSearchInfo,
    defSort,
    fetchSetting,
    beforeFetch,
    afterFetch,
    pagination,
    autoCreateKey,
    rowKey,
    childrenColumnName = 'children',
  } = props;
  const [dataSource, setDataSource, getDataSource] = useGetState<Recordable[]>(
    []
  );
  const [, setRawDataSource, getRawDataSource] = useGetState<Recordable>({});
  const [searchInfo, setSearchInfo, getSearchInfo] = useGetState<Recordable>(
    {}
  );

  useEffect(() => {
    inputSetTableData([...dataSource]);
  }, [dataSource]);

  useEffect(() => {
    if (!api && propsDataSource) {
      setDataSource([...propsDataSource]);
    }
  }, [propsDataSource, api]);

  const autoCreateKeyCreation = useCreation(() => {
    return !!autoCreateKey && !rowKey;
  }, [autoCreateKey, rowKey]);

  const rowKeyCreation = useCreation(() => {
    return autoCreateKeyCreation ? ROW_KEY : rowKey;
  }, [autoCreateKeyCreation, rowKey]);

  useEffect(() => {
    if (autoCreateKeyCreation) {
      const firstItem = dataSource[0];
      const lastItem = dataSource[dataSource.length - 1];

      if (firstItem && lastItem) {
        if (!firstItem[ROW_KEY] || !lastItem[ROW_KEY]) {
          const data = [...dataSource];
          data.forEach((item) => {
            if (!item[ROW_KEY]) {
              item[ROW_KEY] = buildUUID();
            }
            if (item.children && item.children.length) {
              setTableKey(item.children);
            }
          });
          setDataSource(data);
        }
      }
    }
  }, [autoCreateKeyCreation, dataSource]);

  const handleTableChange = (
    pagination: PaginationProps,
    filters: Partial<Recordable<string[]>>,
    sorter: SorterResult
  ) => {
    if (clearSelectOnPageChange) {
      clearSelectedRowKeys();
    }

    const params: Recordable = { pagination };
    if (sorter && isFunction(sortFn)) {
      const sortInfo = sortFn(sorter);
      searchState.sortInfo = sortInfo;
      params.sortInfo = sortInfo;
    }

    if (filters && isFunction(filterFn)) {
      const filterInfo = filterFn(filters);
      searchState.filterInfo = filterInfo;
      params.filterInfo = filterInfo;
    }
    fetch(params);
  };

  const setTableKey = (items: any[]) => {
    if (!items || !Array.isArray(items)) {
      return;
    }
    items.forEach((item) => {
      if (!item[ROW_KEY]) {
        item[ROW_KEY] = buildUUID();
      }
      if (item.children && item.children.length) {
        setTableKey(item.children);
      }
    });
  };

  const updateTableData = async (index: number, key: Key, value: any) => {
    const record = dataSource[index];
    if (record) {
      record[key as string] = value;
      setDataSource([...dataSource]);
    }
    return record;
  };

  const updateTableDataRecord = async (
    keyValue: Key,
    record: Recordable
  ): Promise<Recordable | undefined> => {
    const row: any = findTableDataRecord(keyValue);

    if (row) {
      for (const field in row) {
        if (Reflect.has(record, field)) {
          row[field] = record[field];
        }
      }
      setDataSource([...dataSource]);
      return row;
    }
  };

  // const deleteTableDataRecord = (keyValues: Key | Key[]) => {
  //   if (!dataSource || dataSource.length === 0) {
  //     return;
  //   }
  //   const delKeyValues = !Array.isArray(keyValues) ? [keyValues] : keyValues;

  //   function deleteRow(data, keyValue) {
  //     const row: { index: number; data: [] } = findRow(data, keyValue);
  //     if (row === null || row.index === -1) {
  //       return;
  //     }
  //     row.data.splice(row.index, 1);

  //     function findRow(data, keyValue) {
  //       if (data === null || data === undefined) {
  //         return null;
  //       }
  //       for (let i = 0; i < data.length; i++) {
  //         const row = data[i];
  //         if (parseRowKeyValue(rowKeyCreation, row) === keyValue) {
  //           return { index: i, data };
  //         }
  //         if (row.children?.length > 0) {
  //           const result = findRow(row.children, keyValue);
  //           if (result != null) {
  //             return result;
  //           }
  //         }
  //       }
  //       return null;
  //     }
  //   }

  //   for (const keyValue of delKeyValues) {
  //     deleteRow(dataSource, keyValue);
  //   }
  //   setDataSource([...dataSource]);
  //   setPagination({
  //     total: dataSource?.length,
  //   });
  // };

  function insertTableDataRecord(
    record: Recordable | Recordable[],
    index?: number
  ): Recordable[] | undefined {
    // if (!dataSource || dataSource.length == 0) return;
    index = index ?? dataSource?.length;
    const _record = isPlainObject(record)
      ? [record as Recordable]
      : (record as Recordable[]);
    dataSource.splice(index, 0, ..._record);
    setDataSource([...dataSource]);
    return getDataSource();
  }

  function findTableDataRecord(keyValue: Key) {
    if (!dataSource || dataSource.length === 0) {
      return;
    }

    const findRow = (array: any[]) => {
      let ret;
      array.some(function iter(r) {
        if (parseRowKeyValue(rowKeyCreation, r) === keyValue) {
          ret = r;
          return true;
        }
        return r[childrenColumnName] && r[childrenColumnName].some(iter);
      });
      return ret;
    };

    return findRow(dataSource);
  }

  const fetch = async (opt?: FetchParams) => {
    if (!api || !isFunction(api)) {
      return;
    }
    try {
      setLoading(true);
      const { pageField, sizeField, listField, totalField } = {
        ...FETCH_SETTING,
        ...fetchSetting,
      };
      let pageParams: Recordable = {};

      let { current = 1, pageSize = PAGE_SIZE } =
        paginationInfo as PaginationProps;

      if (opt?.pagination) {
        // eslint-disable-next-line prefer-destructuring
        current = opt.pagination.current || current;
        // eslint-disable-next-line prefer-destructuring
        pageSize = opt.pagination.pageSize || pageSize;
      }

      if ((isBoolean(pagination) && !pagination) || isBoolean(paginationInfo)) {
        pageParams = {};
      } else {
        pageParams[pageField] = current;
        pageParams[sizeField] = pageSize;
      }

      const { sortInfo = {}, filterInfo } = searchState;

      let params: Recordable = merge(
        {},
        propsSearchInfo,
        getSearchInfo(),
        pageParams,
        opt?.searchInfo ?? {},
        defSort,
        sortInfo,
        filterInfo,
        opt?.sortInfo ?? {},
        opt?.filterInfo ?? {}
      );
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params;
      }
      setSearchInfo(params);
      const res = await api(params);
      setRawDataSource(res);

      const isArrayResult = Array.isArray(res);

      let resultItems: Recordable[] = isArrayResult
        ? res
        : get(res, listField) || [];
      const resultTotal: number = isArrayResult
        ? res.length
        : get(res, totalField) || 0;
      // 空页跳转至第一页
      if (resultTotal > 0 && current > 1 && resultItems.length === 0) {
        fetch({ pagination: { current: current - 1 } });
        return;
      }
      if (afterFetch && isFunction(afterFetch)) {
        resultItems = (await afterFetch(resultItems)) || resultItems;
      }
      setDataSource(resultItems || []);
      setPagination({ current, pageSize, total: resultTotal });
      // if (opt && opt.pagination) {
      //   setPagination({
      //     current: opt.pagination.current || 1,
      //     pageSize: opt.pagination.pageSize || 10,
      //   });
      // }
      onFetchSuccess?.({
        items: resultItems,
        total: resultTotal,
      });
      return resultItems;
    } catch (error) {
      onFetchError?.(error);
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  const setTableData = <T = Recordable>(values: T[]) => {
    setDataSource(values as Recordable[]);
  };

  function getDataSourceFn<T = Recordable>() {
    return getDataSource() as T[];
  }

  function getRawDataSourceFn<T = Recordable>() {
    return getRawDataSource() as T;
  }

  async function reload(opt?: FetchParams) {
    return fetch(opt);
  }

  function getSearchInfoFn<T = Recordable>() {
    return getSearchInfo() as T;
  }

  useMount(() => {
    nextTick(() => {
      props.immediate && fetch();
    });
  });

  return {
    dataSource,
    getDataSource: getDataSourceFn,
    getRawDataSource: getRawDataSourceFn,
    searchInfo,
    getSearchInfo: getSearchInfoFn,
    rowKey: rowKeyCreation,
    setTableData,
    autoCreateKey: autoCreateKeyCreation,
    fetch,
    reload,
    updateTableData,
    updateTableDataRecord,
    // deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    handleTableChange,
  };
};
