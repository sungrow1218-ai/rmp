import { queryPreciousMetalKind } from '@/services/securityInfo';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import { message, Select } from 'antd';
import { debounce } from 'lodash';
import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface OptionItem {
  label: string;
  value: string;
}

export interface IProps {
  value?: {
    prcsMetalKindCode: string;
    marketId: number;
    informationSystemId: number;
  };
  onChange?: (
    val:
      | {
          prcsMetalKindCode: string;
          marketId: number;
          informationSystemId: number;
        }
      | undefined
      | null
  ) => void;
  marketId?: number;
  style?: CSSProperties;
  disabled?: boolean;
}

const PreciousMetalKindSelect: React.FC<IProps> = ({
  value,
  onChange,
  marketId,
  style = { width: '240px' },
  disabled = false,
}) => {
  const requestId = useRef<number>(0);

  const [options, setOptions] = useState<OptionItem[]>([]);

  const onSearch = debounce(async (searchValue: string) => {
    const reqId = Date.now();
    requestId.current = reqId;
    try {
      const params = {
        pageId: 1,
        pageSize: 1000,
        filterCondition: {
          prcsMetalKindCode: searchValue ? [searchValue] : undefined,
          marketId: marketId ? [marketId] : undefined,
        },
      };
      const result = await queryPreciousMetalKind(params);
      if (result.errorId !== 0) {
        throw new Error('贵金属品种代码获取失败');
      }
      if (reqId !== requestId.current) return;
      if (result.data.resultList && result.data.resultList.length > 0) {
        const list = result.data.resultList.map((item) => ({
          label: `${item.prcsMetalKindCode} ${item.prcsMetalKindName} ${
            transformDictCodeToNameHelper(
              String(item.marketId),
              TRADING_MARKETS
            ) || '未知市场'
          } `,
          value: `${item.prcsMetalKindCode}|${item.marketId}|${
            item.informationSystemId || 3
          }`,
        }));
        setOptions(list);
      } else {
        setOptions([]);
      }
    } catch (error: any) {
      console.error(error);
      //  error.message && message.error(error.message);
    }
  }, 800);

  useEffect(() => {
    onSearch('');
  }, [marketId]);

  useEffect(() => {
    if (value) {
      onSearch(value.prcsMetalKindCode);
    } else {
      onSearch('');
    }
  }, [value]);

  const realValue = useMemo(() => {
    if (!value) {
      return null;
    }
    let selected = '';
    const { prcsMetalKindCode, marketId, informationSystemId } = value;
    const option = options.find(
      (i) =>
        i.value ===
        `${prcsMetalKindCode}|${marketId}|${informationSystemId || 3}`
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
      placeholder={'请输入贵金属品种代码进行搜索'}
      showSearch={true}
      disabled={disabled}
      onChange={(val: string) => {
        if (val) {
          const [prcsMetalKindCode, marketId, informationSystemId] =
            val.split('|');
          onChange &&
            onChange({
              prcsMetalKindCode,
              marketId: Number(marketId),
              informationSystemId: Number(informationSystemId),
            });
        } else {
          onChange && onChange(undefined);
        }
      }}
    />
  );
};

export default PreciousMetalKindSelect;
