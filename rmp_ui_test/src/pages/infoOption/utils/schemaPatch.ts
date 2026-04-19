// utils/schemaPatch.ts
import type { FormSchema } from '@/components/Form';
import type { AnyRecord } from '../types';

export const mergeComponentProps = <P>(
  origin: P | undefined,
  patch: AnyRecord
): P | undefined => {
  if (!origin) return patch as unknown as P;

  if (typeof origin === 'function') {
    const fn = origin as unknown as (opt: any) => AnyRecord;

    const mergedFn = (opt: any) => {
      const base = fn(opt) || {};
      const baseStyle = base.style || {};
      const patchStyle = patch.style || {};

      return {
        ...base,
        ...patch,
        style: {
          ...baseStyle,
          ...patchStyle,
        },
      };
    };

    return mergedFn as unknown as P;
  }

  if (typeof origin === 'object') {
    const base = origin as unknown as AnyRecord;
    const baseStyle = base.style || {};
    const patchStyle = patch.style || {};

    return {
      ...base,
      ...patch,
      style: {
        ...baseStyle,
        ...patchStyle,
      },
    } as unknown as P;
  }

  return patch as unknown as P;
};

export const patchSchema = <T extends FormSchema>(
  schema: T,
  patch: AnyRecord
): T => {
  return {
    ...schema,
    componentProps: mergeComponentProps<T['componentProps']>(
      schema.componentProps,
      patch
    ),
  };
};

export const setFieldsReadonly = (
  schemas: FormSchema[],
  readonlyFields: string[]
): FormSchema[] => {
  return schemas.map((s) => {
    if (!readonlyFields.includes(String(s.field))) return s;
    return patchSchema(s, {
      disabled: true,
      style: {
        backgroundColor: '#f5f5f5',
        color: '#666666',
        cursor: 'not-allowed',
      },
    });
  });
};

export const normalizeSchemaWidthForSingleColumn = <T extends FormSchema>(
  schemas: T[],
  isSingleColumn: boolean
): T[] => {
  if (!isSingleColumn) return schemas;
  return schemas.map((s) => patchSchema(s, { style: { width: '100%' } }));
};
