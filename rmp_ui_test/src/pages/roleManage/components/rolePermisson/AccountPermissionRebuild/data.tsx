import { BookTypeEnum } from '@/pages/ruleSetting/components/RuleDimensionControl/component/ControlAcctTypeSelect';

export interface TreeNode {
  acctName: string;
  acctCode: string;
  marketId: number;
  bookLevel: number;
  children?: TreeNode[];
}

export interface AcctItem {
  acctCode: string;
  bookLevel: number;
  marketId: number;
}

export interface ExtSystemItem {
  extSysId: number;
  extSysName: string;
  bookType: BookTypeEnum;
}

export interface AcctAuthAction {
  addAcct?: { acctCode: string; bookLevel: number; marketId: number }[];
  deleteAcct?: { acctCode: string; bookLevel: number; marketId: number }[];
}

export const ALL_KEY = '-1|-1|-1';
