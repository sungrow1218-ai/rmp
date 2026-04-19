import React from 'react';
import { FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';

export enum FORM_MODE {
  ADD = 1,
  EDIT = 2,
}
export const getColumns = (
  ratingClick: (value: any) => void
): BasicColumn[] => [
  { title: '交易市场', dataIndex: '1' },
  { title: '证券代码', dataIndex: '2' },
];
