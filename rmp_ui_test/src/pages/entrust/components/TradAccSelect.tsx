import React, { type FC, useState, useEffect, useMemo } from 'react';
import { Select } from '@ht/sprite-ui';
import {
  queryTradeAccountByExtSysIds,
  type TradeAcctDTO,
} from '@/services/account';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';

interface Props {
  integrationSystemIds?: number[] | string[];
  value?: string[];
  onChange?: (value: string[]) => void;
}

const TradAccSelect: FC<Props> = ({
  integrationSystemIds = [],
  value = [],
  onChange = () => {},
}) => {
  const [accountList, setAccountList] = useState<TradeAcctDTO[]>([]);
  const optionsFromData = useMemo(() => {
    if (integrationSystemIds.length === 0) {
      return [];
    }
    const options = accountList.map((item) => {
      const { extSysId, marketId, acctCode, acctName, bookLevel } = item;
      return {
        label: `${transformDictCodeToNameHelper(
          String(marketId),
          TRADING_MARKETS
        )} ${acctCode} ${acctName}`,
        value: `${extSysId}|${marketId}|${acctCode}|${bookLevel}`,
      };
    });
    return options;
  }, [accountList, integrationSystemIds]);

  const realValue = useMemo(() => {
    if (value.length === 0) {
      return [];
    }
    return value;
  }, [value]);

  useEffect(() => {
    async function fetchIntegrationSystemList() {
      if (integrationSystemIds.length === 0) {
        return;
      }
      try {
        const response = await queryTradeAccountByExtSysIds(
          integrationSystemIds
        );
        if (response.code !== 0) {
          throw new Error('获取交易账户列表失败');
        }
        const list = response?.data?.resultList || [];
        setAccountList(list);
      } catch (error) {
        console.error(error);
      }
    }
    fetchIntegrationSystemList();
  }, [integrationSystemIds]);

  return (
    <Select
      placeholder="请先选择外部系统号"
      options={optionsFromData}
      onChange={(values = []) => {
        onChange(values);
      }}
      value={realValue}
      mode="multiple"
    />
  );
};

export default TradAccSelect;
