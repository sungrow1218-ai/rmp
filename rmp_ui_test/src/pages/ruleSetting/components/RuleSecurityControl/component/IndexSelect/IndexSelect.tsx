import React, {
  useEffect,
  useState,
  type FC,
  CSSProperties,
  useMemo,
} from 'react';
import { Select } from 'antd';
import { querySecurity } from '@/services/securityInfo';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';

interface Props {
  value?: { securityCode: string; marketId: number }[];
  onChange?: (value: [{ securityCode: string; marketId: number }]) => void;
  style?: CSSProperties;
}

type IndexOption = {
  label: string;
  value: string;
};

const IndexSelect: FC<Props> = ({ value, onChange, style = {} }) => {
  const [options, setOptions] = useState<IndexOption[]>([]);

  useEffect(() => {
    async function fetchIndexList() {
      try {
        const { data, code } = await querySecurity({
          pageId: 1,
          pageSize: 5000,
          filterCondition: {
            securityType: [1601],
          },
        });
        if (code !== 0) {
          throw new Error('指数列表获取失败');
        }
        const compOptions = (data?.resultList || []).map((li) => {
          const marketName =
            transformDictCodeToNameHelper(
              String(li.marketId),
              TRADING_MARKETS
            ) || '未知市场';
          return {
            // 证券代码  证券名称  交易所
            label: `${li.securityCode} ${li.securityName} ${marketName}`,
            /** marketId + securityCode 才是唯一性保障 */
            value: `${li.securityCode}|${li.marketId}`,
          };
        });
        setOptions(compOptions);
      } catch (e) {}
    }
    fetchIndexList();
  }, []);

  const realValue = useMemo(() => {
    if (value && value.length > 0) {
      const { securityCode, marketId } = value[0];
      return `${securityCode}|${marketId}`;
    } else {
      return undefined;
    }
  }, [value]);

  return (
    <Select
      options={options}
      value={realValue}
      onChange={(val: string) => {
        const [securityCode, marketId] = val.split('|');
        onChange && onChange([{ securityCode, marketId: Number(marketId) }]);
      }}
      showSearch={true}
      style={style}
    />
  );
};

export default IndexSelect;
