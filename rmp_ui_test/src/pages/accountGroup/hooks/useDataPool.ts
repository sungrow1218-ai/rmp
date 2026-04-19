// hooks/useDataPool.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import type { AccountItem } from '../utils/tree';
import { dedupKey } from '../utils/tree';
import useExternSystems from './useExternSystems';

const keyOf = (it: AccountItem) => dedupKey(it);
const oldKeyVariants = (code: any, ext: any) => {
  const c = String(code ?? '').trim();
  const e = String(ext ?? '').trim();
  return [`${c}--${e}`, `${c}-null-${e}`, `${c}-undefined-${e}`];
};
const mergeByDedup = (prev: AccountItem[], incoming: AccountItem[]) => {
  if (!incoming?.length) return prev;
  const map = new Map(prev.map((x) => [keyOf(x), x]));
  for (const it of incoming) {
    if (
      it.marketId == null ||
      it.marketId === '' ||
      it.marketId === 'null' ||
      it.marketId === 'undefined'
    ) {
      (it as any).marketId = -1;
    }
    for (const old of oldKeyVariants(it.acctCode, it.extSysId)) {
      if (map.has(old)) map.delete(old);
    }
    map.set(keyOf(it), it);
  }
  return Array.from(map.values());
};

type Args = {
  open: boolean;
  queryResult: AccountItem[];
  query: (p: any) => void;
  sobId?: number | string;
  bookType: number;
  bookLevel: number; // leafLevel
  leftFilter: {
    accountType: number;
    acctName: string;
    acctCode?: string;
    extSysId?: any;
    marketId?: any;
  };
  acctGroupId?: number;
  bookLevels: Array<{ label: string; value: number }>;
  /** 上下文 key（sobId|bookType|bookLevel） */
  ctxKey: string;
};

export default function useDataPool({
  open,
  queryResult,
  query,
  sobId,
  bookType,
  bookLevel,
  leftFilter,
  acctGroupId,
  bookLevels, // 目前没用到，但保留参数以兼容调用方
  ctxKey,
}: Args) {
  const [dataPool, setDataPool] = useState<AccountItem[]>([]);
  const lastCtxKeyRef = useRef<string>('');

  // 1. sobId → 交易系统列表
  const extSystems = useExternSystems(sobId);

  const extSysIdList = useMemo(
    () =>
      (extSystems || [])
        .map((sys) => {
          const id = sys.extSysId;
          return typeof id === 'string' ? Number(id) : id;
        })
        .filter((id) => id > 0),
    [extSystems]
  );

  // 2. 计算本次查询真正要用的 extSysId
  const effectiveExtSysId = useMemo(() => {
    const f = leftFilter.extSysId;

    // 没选交易系统：用 sobId 下所有交易系统
    if (f == null || f === '' || (Array.isArray(f) && f.length === 0)) {
      return extSysIdList.length ? extSysIdList : undefined;
    }

    // 选了交易系统：兼容单选/多选
    if (Array.isArray(f)) {
      return f.map((x) => Number(x));
    }
    return [Number(f)];
  }, [leftFilter.extSysId, extSysIdList]);

  // 3. 打开弹窗 & 上下文变化时，清空 dataPool（防止串数据）
  useEffect(() => {
    if (!open) return;
    if (lastCtxKeyRef.current !== ctxKey) {
      lastCtxKeyRef.current = ctxKey;
    }
    setDataPool([]);
  }, [open, ctxKey]);

  // 4. 合并查询结果（规范 + 去重）
  useEffect(() => {
    setDataPool((prev) => mergeByDedup(prev, queryResult || []));
  }, [queryResult]);

  // 5. 统一入口：只在必要参数变化时发一次查询
  useEffect(() => {
    if (!open || !sobId) return;

    query({
      sobId,
      bookType,
      bookLevel_out: bookLevel,
      account: {
        bookLevel_in: leftFilter.accountType,
        acctName: leftFilter.acctName,
        acctCode: leftFilter.acctCode,
      },
      extSysId: effectiveExtSysId,
      marketId: leftFilter.marketId,
      acctGroupId,
      pageId: 1,
      pageSize: 5000,
    });
  }, [
    open,
    sobId,
    bookType,
    bookLevel,
    leftFilter.accountType,
    leftFilter.acctName,
    leftFilter.acctCode,
    leftFilter.marketId,
    effectiveExtSysId,
    acctGroupId,
    query,
  ]);

  return { dataPool };
}
