import React, { CSSProperties, useMemo, type FC } from 'react';
import { TRADING_MARKETS } from '@/utils/dict';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import { transformDictToSelectOptions } from '@/utils/utils';

interface Props {
  value?: string[];
  onChange?: (value: string | string[]) => void;
  marketsCodeUseForControl?: string[];
  style?: CSSProperties;
}

const MarketSelect: FC<Props> = ({
  value = [],
  onChange,
  // 默认 上交所、深交所、北交所
  marketsCodeUseForControl = ['1', '2', '105'],
  style = {},
}) => {
  const options = useMemo(() => {
    return transformDictToSelectOptions(
      TRADING_MARKETS.filter((tm) => marketsCodeUseForControl.includes(tm.code))
    );
  }, [marketsCodeUseForControl]);

  return (
    <MultipleSelect
      options={options}
      value={value.map((i) => `${i}`)}
      onChange={(values: string[]) => onChange && onChange(values)}
      style={style}
    />
  );
};

export default MarketSelect;
