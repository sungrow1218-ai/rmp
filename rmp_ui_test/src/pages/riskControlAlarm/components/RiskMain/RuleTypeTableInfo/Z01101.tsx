import { WarnRemarkData } from '@/services/riskControlAlarm';
import React, { useMemo } from 'react';
import { showIndexValue, factorTypeWarn, warnValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const Z01101: React.FC<Props> = ({ data }) => {
  const isShowFirst = useMemo(() => {
    if (!data || !data.factorResult) return false;
    const firstArry = data.factorResult.find((p) => p.factorType === 48);
    if (firstArry?.operation !== 0) {
      return true;
    }
    return false;
  }, [data]);
  const render = data?.factorResult
    ?.map((p) => {
      if (p.factorType === 15 && p.operation !== 0 && !isShowFirst) {
        return `成交金额=${showIndexValue(
          p.factorValue,
          2,
          '万元'
        )}${factorTypeWarn(p, 2, '万元', data.operation)}`;
      }
      if (p.factorType === 16 && p.operation !== 0 && !isShowFirst) {
        return `成交数量=${showIndexValue(
          p.factorValue,
          2,
          '万股(手)'
        )}${factorTypeWarn(p, 2, '万股(手)', data.operation)}`;
      }
      if (p.factorType === 17 && !isShowFirst) {
        return `价格涨跌幅=${showIndexValue(p.factorValue, 1, '%')}${warnValue(
          p,
          1,
          '%'
        )}`;
      }
      if (p.factorType === 18 && !isShowFirst) {
        return `市场成交占比=${showIndexValue(
          p.factorValue,
          1,
          '%'
        )}${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      if (p.factorType === 48 && isShowFirst) {
        return `涨跌停价挂单市场占比=${showIndexValue(
          p.factorValue,
          1,
          '%'
        )}${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      return null;
    })
    .filter((p) => p !== null)
    .join(';');
  return <>{render}</>;
};

export default Z01101;
