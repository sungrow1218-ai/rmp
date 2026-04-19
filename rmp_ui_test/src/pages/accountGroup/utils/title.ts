import { TRADING_MARKETS } from '@/utils/dict';
import type { ExtSysItem } from '@/services/account';
import type { AccountItem } from './tree';

// 市场名映射
const MARKET_MAP: Record<string, string> = TRADING_MARKETS.reduce(
  (m: any, cur: any) => {
    m[String(cur.code)] = cur.name;
    return m;
  },
  {}
);

export const getMarketNameById = (id?: number | string, fb = '未知市场') =>
  id == null ? fb : MARKET_MAP[String(id)] ?? fb;

// const getSystemNameById = (
//   id?: number | string,
//   list?: ExtSysItem[],
//   fb = '未知系统'
// ) => {
//   if (id == null) return fb;
//   const sid = String(id);
//   const name = list?.find((x) => String(x.extSysId) === sid)?.extSysName;
//   return name ?? fb;
// };
export function getSystemNameById(systemId: number, systemInfo?: ExtSysItem[]) {
  return (
    systemInfo?.find((item) => systemId === item.extSysId)?.extSysName ??
    '未知系统'
  );
}

/** 根据 bookType 生成账户标题 */
export const getTitleByBookType = (
  item: AccountItem,
  bookType: number | string,
  extSysList?: ExtSysItem[]
): string => {
  const s = (v: unknown) => (v == null ? '' : String(v));

  const acctCode = s(item.acctCode);
  const acctName = s(item.acctName);
  const extSysName =
    item.extSysId != null
      ? getSystemNameById(Number(item.extSysId), extSysList)
      : '';

  switch (Number(bookType)) {
    case 1: {
      // bookType=1: market-acctCode-acctName-extSysName
      const market =
        item.marketId != null ? getMarketNameById(item.marketId) : '';
      return [market, acctCode, acctName, extSysName].filter(Boolean).join('-');
    }
    case 2: {
      // bookType=2: acctCode-acctName-extSysName
      return [acctCode, acctName, extSysName].filter(Boolean).join('-');
    }
    default: {
      // 兜底
      return [acctCode, acctName, item.extSysId != null ? s(item.extSysId) : '']
        .filter(Boolean)
        .join('-');
    }
  }
};
