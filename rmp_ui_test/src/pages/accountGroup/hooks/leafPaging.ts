// =============================================
// File: leafPaging.ts
// =============================================
import type { TreeNode } from '../components/AddAccountTree/AccountTreeTransfer';
import type { AccountItem } from '../utils/tree';
import { dedupKey } from '../utils/tree';

export function dfsCollectLeafKeys(
  node: TreeNode,
  leafLevel: number,
  predicate: (it: AccountItem) => boolean,
  selectedLeafKeys?: Set<string>,
  out?: string[]
) {
  const list = out || [];
  const isLeaf = node.raw?.bookLevel === leafLevel;
  if (isLeaf) {
    const okByFilter = predicate(node.raw as any);
    const okBySelected = selectedLeafKeys
      ? selectedLeafKeys.has(String(node.key))
      : true;
    if (okByFilter && okBySelected) list.push(String(node.key));
    return list;
  }
  const kids = (node.children as TreeNode[] | undefined) || [];
  for (const k of kids)
    dfsCollectLeafKeys(k, leafLevel, predicate, selectedLeafKeys, list);
  return list;
}

export function collectOrderedLeafKeys(
  roots: AccountItem[],
  fullNodeMap: Map<string, TreeNode>,
  leafLevel: number,
  predicate: (it: AccountItem) => boolean,
  selectedLeafKeys?: Set<string>
): string[] {
  const ordered: string[] = [];
  for (const r of roots) {
    const nk = String(dedupKey(r));
    const n = fullNodeMap.get(nk);
    if (!n) continue;
    dfsCollectLeafKeys(n, leafLevel, predicate, selectedLeafKeys, ordered);
  }
  return ordered;
}

export function chunk<T>(arr: T[], size: number): T[][] {
  if (!size || size <= 0) return [arr.slice()];
  const pages: T[][] = [];
  for (let i = 0; i < arr.length; i += size) pages.push(arr.slice(i, i + size));
  return pages;
}
