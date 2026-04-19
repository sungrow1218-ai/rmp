import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue, warnValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const Z06004: React.FC<Props> = ({ data }) => {
  const render = data?.factorResult
    ?.map((p) => {
      if (p.factorType === 15 && p.operation !== 0) {
        return `成交金额= ${showIndexValue(p.factorValue, 2, '万元')}
          ${warnValue(p, 2, '万元')}`;
      }
      if (p.factorType === 16 && p.operation !== 0) {
        return `成交数量=${showIndexValue(p.factorValue, 2, '万股(手)')}
          ${warnValue(p, 2, '万股(手)')}`;
      }
      if (p.factorType === 17) {
        return `当前笔1分钟内成交价格涨跌幅=${showIndexValue(
          p.factorValue,
          1,
          '%'
        )}
          ${warnValue(p, 1, '%')}`;
      }
      if (p.factorType === 18) {
        return `市场成交占比=${showIndexValue(p.factorValue, 1, '%')}
          ${warnValue(p, 1, '%')}
        `;
      }
      if (p.factorType === 50) {
        return `累计触发次数=${showIndexValue(p.factorValue, 3, '次')}
          ${factorTypeWarn(p, 3, '次', data.operation)}`;
      }
      return null;
    })
    .filter((p) => p !== null)
    .join(';');

  return <>{render}</>;
};
export default Z06004;
