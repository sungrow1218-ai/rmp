// components/AddAccountTree/hooks/useLeftRightBase.ts
import { useMemo } from 'react';
import {
  matchesAny,
  withAncestors,
  dedupKey,
  type AccountItem,
} from '../utils/tree';

export default function useLeftRightBase(params: {
  dataPool: AccountItem[];
  leafLevel: number;
  leftDesiredLevel: number;
  rightDesiredLevel: number;
  // leftFilter: { extSysId?: any; marketId?: any; acctName: string };
  // rightFilter: { extSysId?: any; marketId?: any; acctName: string };
  leftFilter: { extSysId?: any; marketId?: any; acctCode: string };
  rightFilter: { extSysId?: any; marketId?: any; acctCode: string };
  targetKeys: string[];
}) {
  const {
    dataPool,
    leafLevel,
    leftDesiredLevel,
    rightDesiredLevel,
    leftFilter,
    rightFilter,
    targetKeys,
  } = params;

  // 存储所有符合左侧是筛选条件的数据项，过滤出bookLevel=leftDesiredLevel并满足其他指定条件的数据
  const leftBaseItems = useMemo(() => {
    const f = leftFilter;
    return (dataPool || []).filter(
      (it) =>
        it.bookLevel === leftDesiredLevel &&
        // it.bookLevel === leafLevel &&
        matchesAny(it.extSysId, f.extSysId) &&
        matchesAny(it.marketId, f.marketId) &&
        // (!f.acctName || String(it.acctName).includes(f.acctName))
        (!f.acctCode || String(it.acctCode).includes(f.acctCode))
    );
  }, [dataPool, leftDesiredLevel, leftFilter]);

  // 存储所有符合左侧是筛选条件的数据项，过滤出bookLevel=leafLevel并满足其他指定条件的数据
  const leftLeatItems = useMemo(() => {
    const f = leftFilter;
    return (dataPool || []).filter(
      (it) =>
        it.bookLevel === leafLevel &&
        matchesAny(it.extSysId, f.extSysId) &&
        matchesAny(it.marketId, f.marketId) &&
        // (!f.acctName || String(it.acctName).includes(f.acctName))
        (!f.acctCode || String(it.acctCode).includes(f.acctCode))
    );
  }, [dataPool, leafLevel, leftFilter]);

  // 存储所有已经被选择的叶子节点项，这些项的bookLevel是leafLevel，并且唯一标识符dedupKey存储在targetKeys中
  const selectedLeafItems = useMemo(
    () =>
      (dataPool || []).filter(
        (it) => it.bookLevel === leafLevel && targetKeys.includes(dedupKey(it))
      ),
    [dataPool, targetKeys, leafLevel]
  );

  // 根据rightDesiredLevel=leafLevel，直接从selectedLeafItems过滤符合条件的数据；否则使用withAncestors获取链式数据并过滤
  const rightBaseItems = useMemo(() => {
    const f = rightFilter;
    if (rightDesiredLevel === leafLevel) {
      return selectedLeafItems.filter(
        (it) =>
          matchesAny(it.extSysId, f.extSysId) &&
          matchesAny(it.marketId, f.marketId) &&
          // (!f.acctName || String(it.acctName).includes(f.acctName))
          (!f.acctCode || String(it.acctCode).includes(f.acctCode))
      );
    }
    const chain = withAncestors(selectedLeafItems, dataPool);
    const pick = new Map<string, AccountItem>();
    for (const it of chain) {
      if (it.bookLevel !== rightDesiredLevel) continue;
      if (!matchesAny(it.extSysId, f.extSysId)) continue;
      if (!matchesAny(it.marketId, f.marketId)) continue;
      // if (f.acctName && !String(it.acctName).includes(f.acctName)) continue;
      if (f.acctCode && !String(it.acctCode).includes(f.acctCode)) continue;

      pick.set(dedupKey(it), it);
    }
    return Array.from(pick.values());
  }, [rightFilter, rightDesiredLevel, leafLevel, selectedLeafItems, dataPool]);

  return { leftBaseItems, rightBaseItems, selectedLeafItems };
}
