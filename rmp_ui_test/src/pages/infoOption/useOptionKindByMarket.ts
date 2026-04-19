import { useState, useCallback } from 'react';
import { message } from 'antd';
import { queryOptionKind } from '@/services/securityInfo';

/**
 * 使用市场获取期权品种的自定义Hook
 * @param onMarketChange 市场变化回调（可选）
 * @returns
 *  - optionKindOptions: 期权品种选项
 *  - optionKindLoading: 加载状态
 *  - fetchOptionKinds: 获取期权品种的方法
 *  - resetOptionKinds: 重置期权品种的方法
 */
export const useOptionKindByMarket = (
  onMarketChange?: (marketId: number) => void
) => {
  const [optionKindOptions, setOptionKindOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [optionKindLoading, setOptionKindLoading] = useState(false);

  const fetchOptionKinds = useCallback(
    async (mkt?: number, formRef?: any) => {
      if (!mkt) {
        setOptionKindOptions([]);
        formRef?.current?.setFieldsValue({ optionsKind: undefined });
        return;
      }

      setOptionKindLoading(true);
      try {
        const res = await queryOptionKind({
          pageId: 1,
          pageSize: 500,
          filterCondition: {
            marketId: [mkt],
          },
        });

        if (res?.errorId !== 0) {
          // message.error(res?.errorMessage || '期权品种查询失败');
          setOptionKindOptions([]);
          return;
        }

        const list = res?.data?.resultList ?? [];

        setOptionKindOptions(
          list.map((i: any) => ({
            label: `${i.optionKindCode}-${i.optionKindName}`,
            value: i.optionKindCode,
          }))
        );

        // market 变更：清空已选品种
        formRef?.current?.setFieldsValue({ optionsKind: undefined });
      } catch (e: any) {
        console.error(e);
        // message.error(e?.message || '期权品种查询失败');
        setOptionKindOptions([]);
      } finally {
        setOptionKindLoading(false);
      }

      onMarketChange?.(mkt);
    },
    [onMarketChange]
  );

  const resetOptionKinds = useCallback(() => {
    setOptionKindOptions([]);
  }, []);

  return {
    optionKindOptions,
    optionKindLoading,
    fetchOptionKinds,
    resetOptionKinds,
  };
};
