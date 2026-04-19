import { useState, useCallback } from 'react';
import { message } from 'antd';
import { queryFutureKindInfo } from '@/services/securityInfo';

/**
 * 使用市场获取期货品种的自定义Hook
 * @param onMarketChange 市场变化回调
 * @returns
 *  - futuresKindOptions: 期货品种选项
 *  - futuresKindLoading: 加载状态
 *  - fetchFuturesKinds: 获取期货品种的方法
 *  - resetFuturesKinds: 重置期货品种的方法
 */
export const useFuturesKindByMarket = (
  onMarketChange?: (marketId: number) => void
) => {
  const [futuresKindOptions, setFuturesKindOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [futuresKindLoading, setFuturesKindLoading] = useState(false);

  const fetchFuturesKinds = useCallback(
    async (mkt?: number, formRef?: any) => {
      if (!mkt) {
        setFuturesKindOptions([]);
        // 清空已选期货品种
        formRef?.current?.setFieldsValue({ futuresKindCode: undefined });
        return;
      }

      setFuturesKindLoading(true);
      try {
        const res = await queryFutureKindInfo({
          pageId: 1,
          pageSize: 500,
          filterCondition: {
            marketId: [mkt],
          },
        });
        console.log('=== 期货品种 ===', res);

        if (res?.errorId !== 0) {
          // message.error(res?.errorMessage || '期货品种查询失败');
          setFuturesKindOptions([]);
          return;
        }

        const list = res?.data?.resultList ?? [];

        setFuturesKindOptions(
          list.map((i: any) => ({
            label: `${i.futuresKindCode}-${i.futuresKindName}`,
            value: i.futuresKindCode,
          }))
        );

        // 清空已选期货品种
        formRef?.current?.setFieldsValue({ futuresKindCode: undefined });
      } catch (e: any) {
        console.error(e);
        // message.error(e?.message || '期货品种查询失败');
        setFuturesKindOptions([]);
      } finally {
        setFuturesKindLoading(false);
      }

      // 调用外部回调
      onMarketChange?.(mkt);
    },
    [onMarketChange]
  );

  const resetFuturesKinds = useCallback(() => {
    setFuturesKindOptions([]);
  }, []);

  return {
    futuresKindOptions,
    futuresKindLoading,
    fetchFuturesKinds,
    resetFuturesKinds,
  };
};
