// =============================================
// File: predicates.ts
// =============================================
import { matchesAny, dedupKey, type AccountItem } from '../utils/tree';
import type { TreeNode } from '../components/AddAccountTree/AccountTreeTransfer';
import { getAncestorKeyAtLevel } from './treeHelpers';
import { matchAcctCode } from './matchers';

export type LeafPredicate = (it: AccountItem) => boolean;

export function buildLeafPredicate(
  filter: any,
  fullNodeMap: Map<string, TreeNode>,
  parentMap: Map<string, string | null>
): LeafPredicate {
  return (it: AccountItem) => {
    if (!matchesAny((it as any).extSysId, filter?.extSysId)) return false;
    if (!matchesAny((it as any).marketId, filter?.marketId)) return false;
    if (
      filter?.acctName &&
      !String((it as any).acctName || '').includes(filter.acctName)
    )
      return false;

    const q = filter?.acctCode;
    if (q && String(q).trim()) {
      const targetLevel = Number(filter?.accountType) || 0;
      let codeToCheck: any = (it as any).acctCode;
      if (targetLevel) {
        const leafKey = String(dedupKey(it));
        const ancKey = getAncestorKeyAtLevel(
          leafKey,
          targetLevel,
          fullNodeMap,
          parentMap
        );
        if (!ancKey) return false;
        const ancNode = fullNodeMap.get(ancKey);
        codeToCheck = (ancNode?.raw as any)?.acctCode;
      }
      if (!matchAcctCode(codeToCheck, q)) return false;
    }
    return true;
  };
}
