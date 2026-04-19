// =============================================
// File: treeHelpers.ts
// =============================================
import type { TreeNode } from '../components/AddAccountTree/AccountTreeTransfer';

export function buildMapsFromTree(roots: TreeNode[]) {
  const nodeMap = new Map<string, TreeNode>();
  const parentMap = new Map<string, string | null>();
  const st: Array<{ node: TreeNode; parent: string | null }> = roots.map(
    (n) => ({ node: n, parent: null })
  );
  while (st.length) {
    const { node, parent } = st.pop()!;
    const k = String(node.key);
    nodeMap.set(k, node);
    parentMap.set(k, parent);
    (node.children as TreeNode[] | undefined)?.forEach((c) =>
      st.push({ node: c, parent: k })
    );
  }
  return { nodeMap, parentMap };
}

export function getTopKeysInSet(
  keys: Set<string>,
  parentMap: Map<string, string | null>
) {
  const out = new Set<string>();
  keys.forEach((k) => {
    const p = parentMap.get(k);
    if (!p || !keys.has(p)) out.add(k);
  });
  return Array.from(out);
}

export function clonePrunedByIncluded(
  node: TreeNode,
  includedKeys: Set<string>,
  disabledSet?: Set<string>
): TreeNode | null {
  const k = String(node.key);
  if (!includedKeys.has(k)) return null;

  const kids = (node.children as TreeNode[] | undefined) || [];
  const prunedKids = kids
    .map((c) => clonePrunedByIncluded(c, includedKeys, disabledSet))
    .filter(Boolean) as TreeNode[];

  const hit = !!disabledSet?.has(k);
  const next: any = {
    ...node,
    children: prunedKids,
  };
  if (hit) {
    next.disabled = true; // 保持原有禁用
    next.disableCheckbox = true; // 关键：只禁用复选框，避免父勾选时子节点出现对号
  }
  return next as TreeNode;
}

/**
 * 计算禁用集合：若某节点整棵子树内已无“未选叶子”，则该节点禁用。
 * （选中的叶子自己也会进入禁用集合）
 */
export function computeDisabledKeys(
  roots: TreeNode[],
  selectedLeafKeys: Set<string>,
  leafLevel: number
) {
  const disabled = new Set<string>();
  const dfs = (node: TreeNode): boolean => {
    const key = String(node.key);
    const isLeafLevel = node.raw?.bookLevel === leafLevel;
    if (isLeafLevel) {
      const hasUnselected = !selectedLeafKeys.has(key);
      if (!hasUnselected) disabled.add(key);
      return hasUnselected;
    }
    let anyUnselected = false;
    const children = (node.children as TreeNode[] | undefined) || [];
    for (const c of children) if (dfs(c)) anyUnselected = true;
    if (!anyUnselected) disabled.add(key);
    return anyUnselected;
  };
  for (const r of roots) dfs(r);
  return disabled;
}

export function getAncestorKeyAtLevel(
  startKey: string,
  targetLevel: number,
  fullNodeMap: Map<string, TreeNode>,
  parentMap: Map<string, string | null>
): string | null {
  if (!startKey || !targetLevel) return null;
  let k: string | null = String(startKey);
  while (k) {
    const node = fullNodeMap.get(k);
    if (!node) return null;
    if (Number(node.raw?.bookLevel) === Number(targetLevel)) return k;
    k = parentMap.get(k) || null;
  }
  return null;
}
