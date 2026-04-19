// hooks/useAccountQuery.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { message } from '@ht/sprite-ui';
import { queryTradeAccounts, queryManageAccounts } from '@/services/account';
import { queryAccountGroupDetail } from '@/services/accountGroup';
import { BookTypeEnum } from '@/pages/ruleSetting/components/RuleDimensionControl/component/ControlAcctTypeSelect';

type AccountItem = {
  acctCode: string;
  acctName: string;
  marketId?: number | string;
  extSysId: number | string;
  bookLevel: number;
  parentAcctCode: string;
};

type GroupAcctItem = {
  acctCode: string;
  acctName: string;
  extSysId: number | string;
  marketId?: number | string | null;
};

type Params = {
  sobId?: number;
  bookType: number;
  bookLevel_out: number; // 叶子层级（最小层级）
  account?: {
    acctName?: string;
    acctCode?: string;
    bookLevel_in?: number;
  };
  extSysId?: number[];
  marketId?: number[];
  pageId?: number;
  pageSize?: number;
  acctGroupId?: number; // 账户组 ID（用于生成禁用集合）
};

/** 统一：缺失/空市场 → -1 */
const normMarket = (v: any) =>
  v == null || v === '' || v === 'null' || v === 'undefined' ? -1 : v;

/** 与树节点一致的“含层级 key”：acctCode-marketId-extSysId-bookLevel */
const keyWithLevel = (x: {
  acctCode: any;
  marketId: any;
  extSysId: any;
  bookLevel: any;
}) =>
  `${String(x.acctCode ?? '')}-${String(normMarket(x.marketId))}-${String(
    x.extSysId ?? ''
  )}-${String(x.bookLevel ?? '')}`;

// 全局请求序号：用于“只认最后一次请求”
let globalReqId = 0;

export default function useAccountQuery() {
  const [data, setData] = useState<AccountItem[]>([]);
  const [preDisabledKeys, setPreDisabledKeys] = useState<Set<string>>(
    () => new Set()
  );

  // 当前最新请求 id
  const latestReqIdRef = useRef(0);

  const fetcher = useCallback(async (p: Params & { _reqId: number }) => {
    const { _reqId, ...params } = p;

    // 请求发起前：已经不是最新的就直接退出
    if (_reqId !== latestReqIdRef.current) {
      return;
    }

    const { sobId } = params;
    if (!sobId) {
      setData([]);
      setPreDisabledKeys(new Set());
      return;
    }

    try {
      const pageId = params.pageId || 1;
      const pageSize = params.pageSize || 5000;

      // 1) 拉账户
      const res =
        Number(params.bookType) === BookTypeEnum.TRADE_ACCOUNT
          ? await queryTradeAccounts({
              pageId,
              pageSize,
              filterCondition: {
                acctName: params.account?.acctName || '',
                acctCode: params.account?.acctCode || '',
                marketId: params.marketId,
                extSysId: params.extSysId,
              },
            })
          : await queryManageAccounts({
              pageId,
              pageSize,
              filterCondition: {
                bookLevel: params.bookLevel_out,
                account: {
                  acctCode: params.account?.acctCode || '',
                  acctName: params.account?.acctName || '',
                  bookLevel: params.account?.bookLevel_in,
                },
                extSysId: params.extSysId,
              },
            });

      // 返回后再判断一次
      if (_reqId !== latestReqIdRef.current) {
        return;
      }

      const rawData1: AccountItem[] = res?.data?.resultList;
      if (res?.code !== 0 || !Array.isArray(rawData1)) {
        setData([]);
        setPreDisabledKeys(new Set());
        message.warning('暂无数据');
        return;
      }

      // 统一 marketId
      const rawData: AccountItem[] = rawData1.map((item) => ({
        ...item,
        marketId: normMarket(item.marketId),
      }));
      setData(rawData);

      // 2) 拉账户组已有账户 → 禁用集合
      if (params.acctGroupId) {
        try {
          const excludeRes = await queryAccountGroupDetail({
            pageId,
            pageSize,
            filterCondition: { acctGroupId: params.acctGroupId },
          });

          if (_reqId !== latestReqIdRef.current) {
            return;
          }

          const list: GroupAcctItem[] = excludeRes?.data?.resultList || [];
          if (excludeRes?.code === 0 && list.length > 0) {
            const disabled = new Set<string>(
              list.map((it) =>
                keyWithLevel({
                  acctCode: it.acctCode,
                  marketId: it.marketId,
                  extSysId: it.extSysId,
                  bookLevel: params.bookLevel_out,
                })
              )
            );
            setPreDisabledKeys(disabled);
          } else {
            setPreDisabledKeys(new Set());
          }
        } catch (err) {
          if (_reqId !== latestReqIdRef.current) {
            return;
          }
          // console.warn('Failed to load group accounts:', err);
          setPreDisabledKeys(new Set());
        }
      } else {
        setPreDisabledKeys(new Set());
      }
    } catch (e) {
      if (_reqId !== latestReqIdRef.current) {
        return;
      }
      console.error('Failed to fetch accounts:', e);
      setData([]);
      setPreDisabledKeys(new Set());
      message.error('数据加载失败');
    }
  }, []);

  const debouncedFetcher = useMemo(() => debounce(fetcher, 300), [fetcher]);

  // 对外 run：每次调用都会生成新的请求 id
  const run = useCallback(
    (params: Params) => {
      const id = ++globalReqId;
      latestReqIdRef.current = id;
      debouncedFetcher({ ...(params as any), _reqId: id });
    },
    [debouncedFetcher]
  );

  useEffect(() => {
    return () => {
      debouncedFetcher.cancel();
    };
  }, [debouncedFetcher]);

  return { data, run, setData, preDisabledKeys };
}
