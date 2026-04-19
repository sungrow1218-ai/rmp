import { BasicTableProps } from '../types/table';
import { useEffect, useState } from 'react';
import type { PaginationProps } from '../types/pagination';
import { isBoolean } from 'lodash-es';
import { useCreation } from 'ahooks';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../const';

export const usePagination = (pagination: BasicTableProps['pagination']) => {
  const [config, setConfig] = useState({} as PaginationProps);

  useEffect(() => {
    if (!isBoolean(pagination) && pagination) {
      setConfig((pre) => ({ ...pre, ...pagination }));
    }
  }, [pagination]);

  const paginationInfo = useCreation(() => {
    if (isBoolean(pagination) && !pagination) {
      return false;
    }

    return {
      current: 1,
      defaultPageSize: PAGE_SIZE,
      showSizeChanger: true,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      ...(isBoolean(pagination) ? {} : pagination),
      ...config,
    } as PaginationProps;
  }, [pagination, config]);

  const setPagination = (info: Partial<PaginationProps>) => {
    setConfig({
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    });
  };

  const getPaginationInfo = () => {
    return paginationInfo;
  };

  return {
    getPaginationInfo,
    paginationInfo,
    setPagination,
  };
};
