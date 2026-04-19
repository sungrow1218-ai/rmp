import type { PopconfirmProps } from '@ht/sprite-ui';
import { ReactNode } from 'react';

export interface DropMenu {
  onClick?: Fn;
  to?: string;
  icon?: ReactNode;
  event: string | number;
  text: string;
  disabled?: boolean;
  divider?: boolean;
  popConfirm?: PopconfirmProps;
}
