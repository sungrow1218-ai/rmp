// =============================================
// File: useStrictLeafPaging.ts
// =============================================
import { useEffect, useMemo, useState } from 'react';
import type { AccountItem } from '../utils/tree';
import type { TreeNode } from '../components/AddAccountTree/AccountTreeTransfer';
import { collectOrderedLeafKeys, chunk } from './leafPaging';

export default function useStrictLeafPaging(
  roots: AccountItem[],
  fullNodeMap: Map<string, TreeNode>,
  leafLevel: number,
  leafPredicate: (it: AccountItem) => boolean,
  pageSize: number,
  selectedLeafSet?: Set<string>
) {
  const { pages, total } = useMemo(() => {
    const ordered = collectOrderedLeafKeys(
      roots,
      fullNodeMap,
      leafLevel,
      leafPredicate,
      selectedLeafSet
    );
    return { pages: chunk(ordered, pageSize), total: ordered.length };
  }, [roots, fullNodeMap, leafLevel, leafPredicate, pageSize, selectedLeafSet]);

  const [page, setPage] = useState(1);
  useEffect(() => {
    const tp = Math.max(1, pages.length || 1);
    setPage((p) => Math.min(Math.max(1, p), tp));
  }, [pages]);

  return { pages, total, page, setPage } as const;
}
