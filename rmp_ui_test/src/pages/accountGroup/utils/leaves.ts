import { matchesAny, dedupKey, type AccountItem } from './tree';

export type LeafFilter = {
  extSysId?: any;
  marketId?: any;
  accountType?: number;
  acctCode?: string;
};

export const makeLeafFilter =
  (bookLevel: number) => (flt: LeafFilter) => (it: AccountItem) =>
    it.bookLevel === bookLevel &&
    matchesAny(it.extSysId, flt.extSysId) &&
    matchesAny(it.marketId, flt.marketId) &&
    (!flt.acctCode || String(it.acctCode).includes(flt.acctCode));

export function countLeaves(
  all: AccountItem[],
  bookLevel: number,
  flt: LeafFilter,
  pickedKeys: string[],
  picked: boolean
) {
  const pass = makeLeafFilter(bookLevel)(flt);

  return all
    .filter(pass)
    .filter((it) =>
      picked
        ? pickedKeys.includes(dedupKey(it))
        : !pickedKeys.includes(dedupKey(it))
    ).length;
}
