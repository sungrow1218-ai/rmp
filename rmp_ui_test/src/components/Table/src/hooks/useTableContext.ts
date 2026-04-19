import { createContext, RefObject } from 'react';
import { createProviderValue, createSelector } from '@/hooks/useContext';
import { TableActionType } from '../types/table';

type TableContextProps = TableActionType & {
  wrapRef: RefObject<Nullable<HTMLElement>>;
  allProps: Recordable;
};

export const TableContext = createContext<TableContextProps>(
  {} as TableContextProps
);

export function createTableProviderValue(state: TableContextProps) {
  // 修改类型，否则会报类型错误
  return createProviderValue(state) as unknown as TableContextProps;
}

export function useTableContextSelctor<R>(
  selector: (state: TableContextProps) => R
) {
  return createSelector(TableContext, selector);
}
