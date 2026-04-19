// components/AddAccountTree/hooks/useDisabledForLeft.ts
import { useMemo } from 'react';
import {
  buildLeafDescendantsMapByLevel,
  computeDisabledParentsForLeft,
  dedupKey,
  type AccountItem,
} from '../utils/tree';
import type { TreeNode } from '../components/AddAccountTree/AccountTreeTransfer';

export default function useDisabledForLeft(params: {
  fullTreeData: TreeNode[];
  dataPool: AccountItem[];
  targetKeys: string[];
  leafLevel: number;
  leftDesiredLevel: number;
}) {
  const { fullTreeData, dataPool, targetKeys, leafLevel, leftDesiredLevel } =
    params;

  return useMemo(() => {
    const disabled = new Set<string>();
    if (!fullTreeData?.length) return disabled;

    const selectedLeaf = new Set(targetKeys);
    const leafDescMap = buildLeafDescendantsMapByLevel(fullTreeData, leafLevel);

    const fullySelectedDesiredSet = new Set<string>();
    (dataPool || [])
      .filter((it) => it.bookLevel === leftDesiredLevel)
      .forEach((it) => {
        const k = dedupKey(it);
        const leaves = leafDescMap.get(k) || [];
        if (leaves.length > 0 && leaves.every((lk) => selectedLeaf.has(lk))) {
          fullySelectedDesiredSet.add(k);
        }
      });

    fullySelectedDesiredSet.forEach((k) => disabled.add(k));

    const parentDisabled = computeDisabledParentsForLeft(
      fullTreeData,
      fullySelectedDesiredSet,
      leftDesiredLevel
    );
    parentDisabled.forEach((k) => disabled.add(k));
    return disabled;
  }, [fullTreeData, dataPool, targetKeys, leafLevel, leftDesiredLevel]);
}
