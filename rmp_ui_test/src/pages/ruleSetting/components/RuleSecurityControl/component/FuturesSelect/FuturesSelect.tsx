import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useState,
  type FC,
} from 'react';
import { queryFutures } from '@/services/securityInfo';
import MultipleSelect from '@/components/MultipleSelectRebuild';

interface Props {
  value?: { securityCode: string; marketId: number }[];
  onChange?: (value: { securityCode: string; marketId: number }[]) => void;
  marketId?: number[];
  style?: CSSProperties;
}

type OptionItem = {
  label: string;
  value: string;
};

const FuturesSelect: FC<Props> = ({
  value = [],
  onChange,
  marketId,
  style = {},
}) => {
  const [options, setOptions] = useState<OptionItem[]>([]);

  useEffect(() => {
    async function fetchIndexList() {
      try {
        const { data, code } = await queryFutures({
          pageId: 1,
          pageSize: 1000,
          filterCondition: {
            marketId,
          },
        });
        if (code !== 0) {
          throw new Error('期货品种列表获取失败');
        }
        const compOptions = (data?.resultList || []).map((li) => {
          return {
            label: `${li.kindCode} ${li.kindName}`,
            value: `${li.kindCode}|${li.marketId}`,
          };
        });
        setOptions(compOptions);
      } catch (e) {}
    }
    fetchIndexList();
  }, []);

  const realValue = useMemo(() => {
    if (!value || value.length === 0) {
      return [];
    }
    const selected: string[] = [];
    for (const { securityCode, marketId } of value) {
      const option = options.find(
        (i) => i.value === `${securityCode}|${marketId}`
      );
      if (option) {
        selected.push(option.value);
      }
    }
    return selected;
  }, [value, options]);

  return (
    <MultipleSelect
      options={options}
      value={realValue}
      style={style}
      onChange={(values: string[] = []) => {
        const data = values.map((i) => {
          const [securityCode, marketId] = i.split('|');
          return { securityCode, marketId: Number(marketId) };
        });
        onChange && onChange(data);
      }}
    />
  );
};

export default FuturesSelect;
