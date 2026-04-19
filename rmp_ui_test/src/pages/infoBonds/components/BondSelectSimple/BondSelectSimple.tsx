import { queryBondInfo } from '@/services/securityInfo';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import { message, Select } from 'antd';
import { debounce } from 'lodash';
import React, {
  CSSProperties,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface OptionItem {
  label: string;
  value: string;
}

export interface IAction {
  refresh: () => void;
}

export interface IProps {
  value?: {
    securityCode: string;
    marketId: number;
    securityName: string;
    informationSystemId: number;
  };
  onChange?: (
    val:
      | {
          securityCode: string;
          marketId: number;
          securityName: string;
          informationSystemId: number;
        }
      | undefined
      | null
  ) => void;
  marketId?: number;
  style?: CSSProperties;
}

const BondSelectSimple = forwardRef<IAction, IProps>(
  ({ value, onChange, marketId, style = { width: '240px' } }, ref) => {
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
            marketId: marketId ? [marketId] : undefined,
            securityCode: searchValue || undefined,
            querySecurityRatingFlag: '0',
            fuzzyQueryFlag: 1,
          },
        };
        const result = await queryBondInfo(params);
        if (result.errorId !== 0) {
          throw new Error('证券列表获取失败');
        }
        if (reqId !== requestId.current) return;
        if (result.data.resultList && result.data.resultList.length > 0) {
          const list = result.data.resultList.map((item) => ({
            label: `${item.securityCode} ${item.securityName} ${
              transformDictCodeToNameHelper(
                String(item.marketId),
                TRADING_MARKETS
              ) || '未知市场'
            } `,
            value: `${item.securityCode}|${item.marketId}|${item.informationSystemId}`,
          }));
          setOptions(list);
        } else {
          setOptions([]);
        }
      } catch (error: any) {
        console.error(error);
        // error.message && message.error(error.message);
      }
    }, 800);

    useEffect(() => {
      onSearch('');
    }, [marketId]);

    useEffect(() => {
      if (value) {
        onSearch(value.securityCode);
      } else {
        onSearch('');
      }
    }, [value]);

    useImperativeHandle(ref, () => ({
      refresh: () => onSearch(''),
    }));

    const realValue = useMemo(() => {
      if (!value) {
        return null;
      }
      let selected = '';
      const { securityCode, marketId, informationSystemId } = value;
      const option = options.find(
        (i) => i.value === `${securityCode}|${marketId}|${informationSystemId}`
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
            const [securityCode, marketId, informationSystemId] =
              val.split('|');
            onChange &&
              onChange({
                securityCode,
                marketId: Number(marketId),
                securityName: option.label,
                informationSystemId: Number(informationSystemId),
              });
          } else {
            onChange && onChange(undefined);
          }
        }}
      />
    );
  }
);

export default BondSelectSimple;
