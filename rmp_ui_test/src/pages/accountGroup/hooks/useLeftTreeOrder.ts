// components/AddAccountTree/hooks/useLeftTreeOrder.ts
import { useMemo } from 'react';
import {
  listToTree,
  withAncestors,
  dedupKey,
  type AccountItem,
} from '../utils/tree';
import type { TreeNode } from '../components/AddAccountTree/AccountTreeTransfer';

export default function useLeftTreeOrder(params: {
  leftBaseItems: AccountItem[];
  dataPool: AccountItem[];
  renderTitle: (it: AccountItem) => string;
  leftDesiredLevel: number;
}) {
  const { leftBaseItems, dataPool, renderTitle, leftDesiredLevel } = params;

  const leftAllWithAncestors = useMemo(
    () => withAncestors(leftBaseItems, dataPool),
    [leftBaseItems, dataPool]
  );
  const leftFullTreeForOrder = useMemo<TreeNode[]>(
    () => listToTree(leftAllWithAncestors, new Set(), renderTitle),
    [leftAllWithAncestors, renderTitle]
  );
  const leftOrderIndex = useMemo(() => {
    const seq: string[] = [];
    const dfs = (n: TreeNode) => {
      if (n.raw?.bookLevel === leftDesiredLevel) seq.push(String(n.key));
      (n.children as TreeNode[] | undefined)?.forEach(dfs);
    };
    leftFullTreeForOrder.forEach(dfs);
    return new Map(seq.map((k, i) => [k, i]));
  }, [leftFullTreeForOrder, leftDesiredLevel]);

  const leftBaseItemsSorted = useMemo(() => {
    const idx = leftOrderIndex;
    return leftBaseItems.slice().sort((a, b) => {
      const ia = idx.get(dedupKey(a));
      const ib = idx.get(dedupKey(b));
      if (ia != null && ib != null) return ia - ib;
      if (ia != null) return -1;
      if (ib != null) return 1;
      return (a.acctName || '').localeCompare(b.acctName || '');
    });
  }, [leftBaseItems, leftOrderIndex]);

  return { leftBaseItemsSorted, leftFullTreeForOrder };
}
