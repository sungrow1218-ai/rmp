import { queryContract } from '@/services/securityInfo';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import { message, Select } from 'antd';
import React, { CSSProperties, useEffect, useMemo, useState } from 'react';

export interface OptionItem {
  label: string;
  value: string;
}

export interface IProps {
  value?: { securityCode: string; marketId: number; securityName: string };
  onChange?: (
    val:
      | { securityCode: string; marketId: number; securityName: string }
      | undefined
      | null
  ) => void;
  marketId?: number;
  style?: CSSProperties;
}

const ContractSelectSimple: React.FC<IProps> = ({
  value,
  onChange,
  marketId,
  style = { width: '240px' },
}) => {
  const [options, setOptions] = useState<OptionItem[]>([]);

  const onSearch = async (searchValue: string) => {
    try {
      const params = {
        pageId: 1,
        pageSize: 1000,
        filterCondition: {
          marketId: marketId ? [marketId] : undefined,
          securityCode: searchValue || undefined,
          fuzzyQueryFlag: 1,
        },
      };
      const result = await queryContract(params);
      if (result.errorId !== 0) {
        throw new Error('证券列表获取失败');
      }
      if (result.data.resultList && result.data.resultList.length > 0) {
        const list = result.data.resultList.map((item) => ({
          label: `${item.securityCode}  ${
            transformDictCodeToNameHelper(
              String(item.marketId),
              TRADING_MARKETS
            ) || '未知市场'
          } `,
          value: `${item.securityCode}|${item.marketId}`,
        }));
        setOptions(list);
      } else {
        setOptions([]);
      }
    } catch (error: any) {
      console.error(error);
      // error.message && message.error(error.message);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      onSearch('');
    }, 100);
  }, [marketId]);

  const realValue = useMemo(() => {
    if (!value) {
      return null;
    }
    let selected = '';
    const { securityCode, marketId } = value;
    const option = options.find(
      (i) => i.value === `${securityCode}|${marketId}`
    );
    if (option) {
      selected = option.value;
    }
    return selected;
  }, [value, options]);

  return (
    <Select
      allowClear={true}
      options={options}
      filterOption={false}
      onSearch={onSearch}
      value={realValue}
      style={style}
      placeholder={'请输入证券代码进行搜索'}
      showSearch={true}
      onChange={(val: string, option: any) => {
        if (val && option) {
          const [securityCode, marketId] = val.split('|');
          onChange &&
            onChange({
              securityCode,
              marketId: Number(marketId),
              securityName: option.label,
            });
        } else {
          onChange && onChange(undefined);
        }
      }}
    />
  );
};

export default ContractSelectSimple;
