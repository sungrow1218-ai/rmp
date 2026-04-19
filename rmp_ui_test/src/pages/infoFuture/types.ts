// types.ts
import type { FORM_MODE } from './data';

export type AnyRecord = Record<string, any>;

export interface IProps {
  onRefresh?: () => void | Promise<void>;
}

export interface IAction {
  open: (
    mode: FORM_MODE,
    type: 'futures' | 'futuresKind' | 'contract',
    value?: Recordable
  ) => void;
}

export type DataType = 'futures' | 'futuresKind' | 'contract';

export type FieldType = 'string' | 'number' | 'select' | 'date';

export type FilledFieldsInfo = Record<
  string,
  {
    value: any;
    type: FieldType;
  }
>;
