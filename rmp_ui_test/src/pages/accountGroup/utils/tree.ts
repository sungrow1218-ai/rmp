// src/utils/tree.ts
import type {
  AccountItem as TransferAccountItem,
  TreeNode,
} from '../components/AddAccountTree/AccountTreeTransfer';

export type AccountItem = TransferAccountItem;

/* ---------------- 统一规范化（唯一真理） ---------------- */
// 规则：缺省 marketId 全部视为 -1；其余统一字符串化并消除 'null'/'undefined'
const canonStr = (v: any): string => {
  if (v === null || v === undefined) return '';
  const s = String(v).trim();
  return s === 'null' || s === 'undefined' ? '' : s;
};
const canonMarket = (v: any): string => {
  if (
    v === null ||
    v === undefined ||
    v === '' ||
    v === 'null' ||
    v === 'undefined'
  )
    return '-1';
  return String(v).trim();
};
const canonExt = (v: any): string => canonStr(v);
const canonCode = (v: any): string => canonStr(v);

const eqMarket = (a: any, b: any) => canonMarket(a) === canonMarket(b);
const eqExt = (a: any, b: any) => canonExt(a) === canonExt(b);

// export const dedupKey = (
//   x: Pick<AccountItem, 'acctCode' | 'marketId' | 'extSysId'>
// ) =>
//   `${canonCode(x.acctCode)}-${canonMarket(x.marketId)}-${canonExt(x.extSysId)}`;
export const dedupKey = (
  x: Pick<AccountItem, 'acctCode' | 'marketId' | 'extSysId' | 'bookLevel'>
) =>
  `${canonCode(x.acctCode)}-${canonMarket(x.marketId)}-${canonExt(
    x.extSysId
  )}-${x.bookLevel}`;

/** （可选）过滤工具：保留你现有语义 */
export function matchesAny<T extends number | string>(
  itemVal: T,
  selected?: T | T[] | null
) {
  if (selected == null) return true;
  const toStr = (v: any) => String(v);
  if (Array.isArray(selected)) {
    if (!selected.length) return true;
    const set = new Set(selected.map(toStr));
    return set.has(toStr(itemVal));
  }
  return toStr(itemVal) === toStr(selected);
}

const toKey = (it: AccountItem) => dedupKey(it);

/* 
   条件： parent.acctCode === child.parentAcctCode
         parent.bookLevel === child.bookLevel + 1
         parent.marketId/extSysId 与 child 完全一致
*/
function findStrictParent(
  child: AccountItem,
  bucket: AccountItem[]
): AccountItem | undefined {
  const targetLevel = Number(child.bookLevel) + 1;
  const strict = bucket.filter(
    (p) =>
      eqMarket(p.marketId, child.marketId) &&
      eqExt(p.extSysId, child.extSysId) &&
      Number(p.bookLevel) === targetLevel
  );
  if (strict.length === 0) return undefined;
  if (strict.length === 1) return strict[0];
  return strict.slice().sort((a, b) => toKey(a).localeCompare(toKey(b)))[0];
}

function dedupNodes(nodes: TreeNode[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  nodes.forEach((n) => {
    const k = String(n.key);
    const exist = map.get(k);
    if (!exist) map.set(k, n);
    else {
      const seen = new Set<string>();
      const merged: TreeNode[] = [];
      (exist.children || []).forEach((c) => {
        const ck = String((c as TreeNode).key);
        if (!seen.has(ck)) {
          seen.add(ck);
          merged.push(c as TreeNode);
        }
      });
      (n.children || []).forEach((c) => {
        const ck = String((c as TreeNode).key);
        if (!seen.has(ck)) {
          seen.add(ck);
          merged.push(c as TreeNode);
        }
      });
      exist.children = merged;
    }
  });
  return Array.from(map.values());
}

export function listToTree(
  list: AccountItem[],
  disabledKeys: Set<string> = new Set(),
  renderTitle?: (it: AccountItem) => string
): TreeNode[] {
  const uniq = new Map<string, AccountItem>();
  list.forEach((it) => {
    const k = toKey(it);
    if (!uniq.has(k)) uniq.set(k, it);
  });
  const items = Array.from(uniq.values());

  const byKey = new Map<string, TreeNode>();
  const byCodeBucket = new Map<string, AccountItem[]>();

  items.forEach((it) => {
    const code = canonCode(it.acctCode);
    const arr = byCodeBucket.get(code) || [];
    arr.push(it);
    byCodeBucket.set(code, arr);
  });

  items.forEach((it) => {
    const key = toKey(it);
    byKey.set(key, {
      key,
      title: renderTitle
        ? renderTitle(it)
        : `${it.acctName ?? ''}（${it.acctCode ?? ''}）`,
      disabled: disabledKeys.has(key),
      raw: it,
      children: [],
    });
  });

  const hasParent = new Set<string>();
  items.forEach((child) => {
    const nodeKey = toKey(child);
    const node = byKey.get(nodeKey)!;
    const pCode = canonCode((child as any).parentAcctCode);
    if (pCode) {
      const candidates = byCodeBucket.get(pCode) || [];
      const parent = findStrictParent(child, candidates);
      if (parent) {
        const pk = toKey(parent);
        const pNode = byKey.get(pk);
        if (pNode) {
          (pNode.children ||= []).push(node);
          hasParent.add(nodeKey);
        }
      }
    }
  });

  let roots: TreeNode[] = [];
  items.forEach((it) => {
    const k = toKey(it);
    if (!hasParent.has(k)) roots.push(byKey.get(k)!);
  });
  roots = dedupNodes(roots);

  const sortTree = (ns: TreeNode[]) => {
    ns.sort((a, b) =>
      (a.raw.acctName || '').localeCompare(b.raw.acctName || '')
    );
    ns.forEach((n) => n.children?.length && sortTree(n.children as TreeNode[]));
  };
  sortTree(roots);

  return roots;
}

export function withAncestors(items: AccountItem[], all: AccountItem[]) {
  const res = new Map<string, AccountItem>();

  const uniq = new Map<string, AccountItem>();
  all.forEach((i) => {
    const k = toKey(i);
    if (!uniq.has(k)) uniq.set(k, i);
  });
  const allItems = Array.from(uniq.values());

  const byCode = new Map<string, AccountItem[]>();
  allItems.forEach((i) => {
    const code = canonCode(i.acctCode);
    const arr = byCode.get(code) || [];
    arr.push(i);
    byCode.set(code, arr);
  });

  const add = (it: AccountItem) => {
    const k = toKey(it);
    if (res.has(k)) return;
    res.set(k, it);
    const pCode = canonCode((it as any).parentAcctCode);
    if (pCode) {
      const cands = byCode.get(pCode) || [];
      const p = findStrictParent(it, cands);
      if (p) add(p);
    }
  };

  items.forEach(add);
  return Array.from(res.values());
}

function childrenOf(node: AccountItem, all: AccountItem[]) {
  const pCode = canonCode((node as any).acctCode);
  const mId = canonMarket(node.marketId);
  const eId = canonExt(node.extSysId);
  const childLevel = Number(node.bookLevel) - 1; // 子=父-1
  return all.filter(
    (x) =>
      canonCode((x as any).parentAcctCode) === pCode &&
      eqMarket(x.marketId, mId) &&
      eqExt(x.extSysId, eId) &&
      Number(x.bookLevel) === childLevel
  );
}

export function withDescendants(roots: AccountItem[], all: AccountItem[]) {
  const uniq = new Map<string, AccountItem>();
  all.forEach((i) => {
    const k = toKey(i);
    if (!uniq.has(k)) uniq.set(k, i);
  });
  const allItems = Array.from(uniq.values());

  const out = new Map<string, AccountItem>();
  const seen = new Set<string>();
  const stack = [...roots];
  while (stack.length) {
    const n = stack.pop()!;
    const k = toKey(n);
    if (seen.has(k)) continue;
    seen.add(k);
    out.set(k, n);
    childrenOf(n, allItems).forEach((c) => {
      const ck = toKey(c);
      if (!seen.has(ck)) stack.push(c);
    });
  }
  return Array.from(out.values());
}

export function buildLeafDescendantsMapByLevel(
  tree: TreeNode[],
  leafLevel: number
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const dfs = (n: TreeNode): string[] => {
    const cs = (n.children || []) as TreeNode[];
    const isLeafLevel = n.raw?.bookLevel === leafLevel;
    if (cs.length === 0 || isLeafLevel) {
      const arr = [String(n.key)];
      map.set(String(n.key), arr);
      return arr;
    }
    const merged: string[] = [];
    cs.forEach((c) => merged.push(...dfs(c)));
    map.set(String(n.key), merged);
    return merged;
  };
  tree.forEach(dfs);
  return map;
}

export function buildDescendantsMap(tree: TreeNode[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const dfs = (n: TreeNode): string[] => {
    const all: string[] = [];
    n.children?.forEach((c) => {
      all.push(String((c as TreeNode).key));
      all.push(...dfs(c as TreeNode));
    });
    map.set(String(n.key), all);
    return all;
  };
  tree.forEach(dfs);
  return map;
}

export function computeDisabledParentsForLeft(
  tree: TreeNode[],
  targetSet: Set<string>,
  desiredLevel: number
) {
  const disabled = new Set<string>();
  const walk = (n: TreeNode) => {
    if (n.raw.bookLevel > desiredLevel) {
      const targets: string[] = [];
      const dfs = (x: TreeNode) => {
        if (x.raw.bookLevel === desiredLevel) targets.push(String(x.key));
        x.children?.forEach((c) => dfs(c as TreeNode));
      };
      n.children?.forEach((c) => dfs(c as TreeNode));
      if (targets.length && targets.every((k) => targetSet.has(k))) {
        disabled.add(String(n.key));
      }
    }
    n.children?.forEach((c) => walk(c as TreeNode));
  };
  tree.forEach((t) => walk(t));
  return disabled;
}
