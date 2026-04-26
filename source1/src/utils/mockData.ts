export interface HoldingRecord {
  id: string;
  symbol: string;
  name: string;
  totalShares: number;
  totalHoldings: number;
  holdingsRatioExclCB: number;
  holdingsRatioInclCB: number;
  quotaAllocation: number;

  parentInitialHoldingsExclCB: number;
  parentInitialHoldingsInclCB: number;
  parentMaxIntradayHoldingsExclCB: number;
  parentMaxIntradayHoldingsInclCB: number;
  parentCurrentHoldingsExclCB: number;
  parentCurrentHoldingsInclCB: number;
  parentHoldingsRatioExclCB: number;
  parentHoldingsRatioInclCB: number;
  parentQuotaAllocation: number;

  hkInitialHoldingsExclCB: number;
  hkInitialHoldingsInclCB: number;
  hkMaxIntradayHoldingsExclCB: number;
  hkMaxIntradayHoldingsInclCB: number;
  hkCurrentHoldingsExclCB: number;
  hkCurrentHoldingsInclCB: number;
  hkHoldingsRatioExclCB: number;
  hkHoldingsRatioInclCB: number;
  hkQuotaAllocation: number;

  connectInitialHoldingsExclCB: number;
  connectInitialHoldingsInclCB: number;
  connectMaxIntradayHoldingsExclCB: number;
  connectMaxIntradayHoldingsInclCB: number;
  connectCurrentHoldingsExclCB: number;
  connectCurrentHoldingsInclCB: number;
  connectHoldingsRatioExclCB: number;
  connectHoldingsRatioInclCB: number;
  connectQuotaAllocation: number;
}

export const DEFAULT_QUOTA = 4.8;
export const DEFAULT_PARENT_QUOTA = 2.4;
export const DEFAULT_HK_QUOTA = 1.44;
export const DEFAULT_CONNECT_QUOTA = 0.96;

export const generateMockData = (count: number): HoldingRecord[] => {
  const data: HoldingRecord[] = [];
  const names = ['三一重工', '贵州茅台', '招商银行', '中国平安', '五粮液', '美的集团', '恒瑞医药', '中信证券', '万科A', '比亚迪'];

  for (let i = 1; i <= count; i++) {
    const symbol = `600${i.toString().padStart(3, '0')}`;
    const name = i <= names.length ? names[i-1] : `测试股票${i}`;

    // 模拟约5%的数据超出额度
    const isExceed = Math.random() > 0.95; 
    
    let quota = DEFAULT_QUOTA;
    let parentQuotaAllocation = DEFAULT_PARENT_QUOTA;
    let hkQuotaAllocation = DEFAULT_HK_QUOTA;
    let connectQuotaAllocation = DEFAULT_CONNECT_QUOTA;

    // 模拟前5个数据被修改过额度
    if (i <= 5) {
      quota = 5.0;
      parentQuotaAllocation = 2.5;
      hkQuotaAllocation = 1.5;
      connectQuotaAllocation = 1.0;
    }

    const ratio = isExceed ? (quota + Math.random() * 1.5) : (Math.random() * (quota - 0.5));

    const totalShares = 1000000 + Math.floor(Math.random() * 5000000);
    const totalHoldings = Math.floor(totalShares * (ratio / 100));

    data.push({
      id: symbol,
      symbol,
      name,
      totalShares,
      totalHoldings,
      holdingsRatioExclCB: Math.max(0, ratio - 0.01),
      holdingsRatioInclCB: ratio,
      quotaAllocation: quota,

      parentInitialHoldingsExclCB: Math.floor(totalHoldings * 0.4 * 0.9),
      parentInitialHoldingsInclCB: Math.floor(totalHoldings * 0.4),
      parentMaxIntradayHoldingsExclCB: Math.floor(totalHoldings * 0.45 * 0.9),
      parentMaxIntradayHoldingsInclCB: Math.floor(totalHoldings * 0.45),
      parentCurrentHoldingsExclCB: Math.floor(totalHoldings * 0.42 * 0.9),
      parentCurrentHoldingsInclCB: Math.floor(totalHoldings * 0.42),
      parentHoldingsRatioExclCB: Math.max(0, ratio * 0.4 - 0.01),
      parentHoldingsRatioInclCB: ratio * 0.4 + 0.01,
      parentQuotaAllocation: parentQuotaAllocation,

      hkInitialHoldingsExclCB: Math.floor(totalHoldings * 0.3 * 0.9),
      hkInitialHoldingsInclCB: Math.floor(totalHoldings * 0.3),
      hkMaxIntradayHoldingsExclCB: Math.floor(totalHoldings * 0.35 * 0.9),
      hkMaxIntradayHoldingsInclCB: Math.floor(totalHoldings * 0.35),
      hkCurrentHoldingsExclCB: Math.floor(totalHoldings * 0.32 * 0.9),
      hkCurrentHoldingsInclCB: Math.floor(totalHoldings * 0.32),
      hkHoldingsRatioExclCB: Math.max(0, ratio * 0.3 - 0.01),
      hkHoldingsRatioInclCB: ratio * 0.3 + 0.01,
      hkQuotaAllocation: hkQuotaAllocation,

      connectInitialHoldingsExclCB: Math.floor(totalHoldings * 0.2 * 0.9),
      connectInitialHoldingsInclCB: Math.floor(totalHoldings * 0.2),
      connectMaxIntradayHoldingsExclCB: Math.floor(totalHoldings * 0.25 * 0.9),
      connectMaxIntradayHoldingsInclCB: Math.floor(totalHoldings * 0.25),
      connectCurrentHoldingsExclCB: Math.floor(totalHoldings * 0.22 * 0.9),
      connectCurrentHoldingsInclCB: Math.floor(totalHoldings * 0.22),
      connectHoldingsRatioExclCB: Math.max(0, ratio * 0.2 - 0.01),
      connectHoldingsRatioInclCB: ratio * 0.2 + 0.01,
      connectQuotaAllocation: connectQuotaAllocation,
    });
  }
  return data;
};