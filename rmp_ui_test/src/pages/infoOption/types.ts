// types.ts
import type { FORM_MODE } from './data';

export type AnyRecord = Record<string, any>;

export interface IProps {
  onRefresh?: () => void;
}

export type DataType = 'options' | 'optionsKind';

export interface IAction {
  open: (mode: FORM_MODE, type: DataType, value?: Recordable) => void;
}

export type FieldType = 'string' | 'number' | 'select' | 'date';

export type FilledFieldsInfo = Record<
  string,
  {
    value: any;
    type: FieldType;
  }
>;
