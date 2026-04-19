import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useState,
  type FC,
} from 'react';
import { queryOptions } from '@/services/securityInfo';
import MultipleSelect from '@/components/MultipleSelectRebuild';

interface Props {
  value?: { securityCode: string; marketId: number }[];
  onChange?: (value: { securityCode: string; marketId: number }[]) => void;
  style?: CSSProperties;
}

type OptionItem = {
  label: string;
  value: string;
};

const OptionsSelect: FC<Props> = ({ value = [], onChange, style = {} }) => {
  const [options, setOptions] = useState<OptionItem[]>([]);

  useEffect(() => {
    async function fetchIndexList() {
      try {
        const { data, code } = await queryOptions({
          pageId: 1,
          pageSize: 1000,
        });
        if (code !== 0) {
          throw new Error('期权品种列表获取失败');
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
      onChange={(values: string[] = []) => {
        const data = values.map((i) => {
          const [securityCode, marketId] = i.split('|');
          return { securityCode, marketId: Number(marketId) };
        });
        onChange && onChange(data);
      }}
      style={style}
    />
  );
};

export default OptionsSelect;
