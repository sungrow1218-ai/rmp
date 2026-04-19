// =============================================
// File: usePrunedTreeForPage.ts
// =============================================
import { useMemo } from 'react';
import type { TreeNode } from '../components/AddAccountTree/AccountTreeTransfer';
import {
  getTopKeysInSet,
  clonePrunedByIncluded,
  computeDisabledKeys,
} from './treeHelpers';

export function usePrunedTreeForPage(
  leafKeysPage: string[],
  fullNodeMap: Map<string, TreeNode>,
  parentMap: Map<string, string | null>,
  fullTreeData: TreeNode[],
  opts: {
    applyDisable?: boolean;
    selectedLeafSet?: Set<string>; // 用于禁用（右侧已选 + 账户组已有）
    leafLevel: number;
  }
) {
  const includedKeys = useMemo(() => {
    const inc = new Set<string>();
    const addAnc = (k: string) => {
      let cur: string | null = k;
      while (cur) {
        if (!inc.has(cur)) inc.add(cur);
        cur = parentMap.get(cur) || null;
      }
    };
    (leafKeysPage || []).forEach((k) => addAnc(k));
    return inc;
  }, [leafKeysPage, parentMap]);

  const topKeys = useMemo(
    () => getTopKeysInSet(includedKeys, parentMap),
    [includedKeys, parentMap]
  );

  // 计算禁用集合（传入 clone 时会设置 disableCheckbox）
  const disabled = useMemo(() => {
    if (!opts.applyDisable) return new Set<string>();
    return computeDisabledKeys(
      fullTreeData,
      opts.selectedLeafSet || new Set(),
      opts.leafLevel
    );
  }, [opts.applyDisable, fullTreeData, opts.selectedLeafSet, opts.leafLevel]);

  const treeData = useMemo(() => {
    return topKeys
      .map((k) => fullNodeMap.get(k))
      .filter(Boolean)
      .map((n) => clonePrunedByIncluded(n as TreeNode, includedKeys, disabled))
      .filter(Boolean) as TreeNode[];
  }, [topKeys, fullNodeMap, includedKeys, disabled]);

  return { treeData, includedKeys, topKeys } as const;
}
