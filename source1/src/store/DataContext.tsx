import React, { createContext, useState, useContext, useEffect } from 'react';
import { generateMockData, HoldingRecord, DEFAULT_PARENT_QUOTA, DEFAULT_HK_QUOTA, DEFAULT_CONNECT_QUOTA } from '../utils/mockData';
import dayjs from 'dayjs';

export interface QuotaHistory {
  id: string;
  symbol: string;
  oldQuota: number;
  newQuota: number;
  oldParentQuota: number;
  newParentQuota: number;
  oldHkQuota: number;
  newHkQuota: number;
  oldConnectQuota: number;
  newConnectQuota: number;
  timestamp: string;
  operator: string;
}

export interface QuotaUpdatePayload {
  symbol: string;
  quotaAllocation: number;
  parentQuotaAllocation: number;
  hkQuotaAllocation: number;
  connectQuotaAllocation: number;
}

interface DataContextType {
  data: HoldingRecord[];
  history: QuotaHistory[];
  updateQuota: (symbol: string, newQuota: number) => void;
  updateQuotas: (updates: QuotaUpdatePayload[]) => void;
  refreshData: () => void;
  fetchDataByDate: (date: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [data, setData] = useState<HoldingRecord[]>([]);
  const [history, setHistory] = useState<QuotaHistory[]>([]);

  // 初始化生成5000+条数据
  useEffect(() => {
    setData(generateMockData(5050));

    // 为前5个被修改过额度的数据生成初始历史记录
    const initialHistory: QuotaHistory[] = [];
    for (let i = 1; i <= 5; i++) {
      const symbol = `600${i.toString().padStart(3, '0')}`;
      initialHistory.push({
        id: Math.random().toString(36).substring(2, 9),
        symbol,
        oldQuota: 4.8,
        newQuota: 5.0,
        oldParentQuota: DEFAULT_PARENT_QUOTA,
        newParentQuota: 2.5,
        oldHkQuota: DEFAULT_HK_QUOTA,
        newHkQuota: 1.5,
        oldConnectQuota: DEFAULT_CONNECT_QUOTA,
        newConnectQuota: 1.0,
        timestamp: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm:ss'),
        operator: 'System Admin'
      });
    }
    setHistory(initialHistory);
  }, []);

  const updateQuota = (symbol: string, newQuota: number) => {
    setData(prev => prev.map(item => {
      if (item.symbol === symbol) {
        // 记录历史
        setHistory(h => [{
          id: Math.random().toString(36).substring(2, 9),
          symbol,
          oldQuota: item.quotaAllocation,
          newQuota,
          oldParentQuota: item.parentQuotaAllocation,
          newParentQuota: item.parentQuotaAllocation, // 仅修改总额度时，子额度不变
          oldHkQuota: item.hkQuotaAllocation,
          newHkQuota: item.hkQuotaAllocation,
          oldConnectQuota: item.connectQuotaAllocation,
          newConnectQuota: item.connectQuotaAllocation,
          timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          operator: 'Admin (当前用户)'
        }, ...h]);
        return { ...item, quotaAllocation: newQuota };
      }
      return item;
    }));
  };

  const updateQuotas = (updates: QuotaUpdatePayload[]) => {
    setData(prev => {
      const newData = [...prev];
      updates.forEach(update => {
        const index = newData.findIndex(item => item.symbol === update.symbol);
        if (index !== -1) {
          const oldItem = newData[index];
          // 记录历史
          setHistory(h => [{
            id: Math.random().toString(36).substring(2, 9),
            symbol: update.symbol,
            oldQuota: oldItem.quotaAllocation,
            newQuota: update.quotaAllocation,
            oldParentQuota: oldItem.parentQuotaAllocation,
            newParentQuota: update.parentQuotaAllocation,
            oldHkQuota: oldItem.hkQuotaAllocation,
            newHkQuota: update.hkQuotaAllocation,
            oldConnectQuota: oldItem.connectQuotaAllocation,
            newConnectQuota: update.connectQuotaAllocation,
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            operator: 'Admin (当前用户)'
          }, ...h]);
          
          newData[index] = {
            ...oldItem,
            quotaAllocation: update.quotaAllocation,
            parentQuotaAllocation: update.parentQuotaAllocation,
            hkQuotaAllocation: update.hkQuotaAllocation,
            connectQuotaAllocation: update.connectQuotaAllocation,
          };
        }
      });
      return newData;
    });
  };

  const refreshData = () => {
    // 模拟数据刷新：持仓量产生微小波动
    setData(prev => prev.map(item => {
      const fluctuation = Math.floor(Math.random() * 100) - 50;
      return {
        ...item,
        totalHoldings: Math.max(0, item.totalHoldings + fluctuation)
      };
    }));
  };

  const fetchDataByDate = (date: string) => {
    // 模拟根据历史日期获取数据，重新生成一批随机数据
    setData(generateMockData(5050));
  };

  return (
    <DataContext.Provider value={{ data, history, updateQuota, updateQuotas, refreshData, fetchDataByDate }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};