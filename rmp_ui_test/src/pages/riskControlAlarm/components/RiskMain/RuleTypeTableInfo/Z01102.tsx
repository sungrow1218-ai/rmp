import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { showIndexValue, factorTypeWarn, warnValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const Z01102: React.FC<Props> = ({ data }) => {
  const render = data?.factorResult
    ?.map((p) => {
      if (p.factorType === 15 && p.operation !== 0) {
        return `成交金额= ${showIndexValue(p.factorValue, 2, '万元')}
          ${factorTypeWarn(p, 2, '万元', data.operation)}`;
      }
      if (p.factorType === 16 && p.operation !== 0) {
        return `成交数量=${showIndexValue(p.factorValue, 2, '万股(手)')}
          ${factorTypeWarn(p, 2, '万股(手)', data.operation)}`;
      }
      if (p.factorType === 38) {
        return ` 开盘价涨跌幅=${showIndexValue(p.factorValue, 1, '%')}
          ${warnValue(p, 1, '%')}`;
      }
      if (p.factorType === 18) {
        return ` 市场成交占比=${showIndexValue(p.factorValue, 1, '%')}
          ${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      if (p.factorType === 35 && p.operation !== 0) {
        return `反向成交金额= ${showIndexValue(p.factorValue, 2, '万元')}
          ${factorTypeWarn(p, 2, '万元', data.operation)}`;
      }
      if (p.factorType === 36 && p.operation !== 0) {
        return `反向成交数量=${showIndexValue(p.factorValue, 2, '万股(手)')}
          ${factorTypeWarn(p, 2, '万股(手)', data.operation)}`;
      }
      return null;
    })
    .filter((p) => p !== null)
    .join(';');
  return <>{render}</>;
};

export default Z01102;
