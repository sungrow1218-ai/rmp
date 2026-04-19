import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const Z05201: React.FC<Props> = ({ data }) => {
  const render = data?.factorResult
    ?.map((p) => {
      if (p.factorType === 33 && p.operation !== 0) {
        return `涨跌停价挂单金额=${showIndexValue(p.factorValue, 2, '万元')}
           ${factorTypeWarn(p, 2, '万元', data.operation)}`;
      }
      if (p.factorType === 34 && p.operation !== 0) {
        return `涨跌停价挂单数量=${showIndexValue(p.factorValue, 2, '万股(手)')}
            ${factorTypeWarn(p, 2, '万股(手)', data.operation)}`;
      }
      if (p.factorType === 48) {
        return ` 涨跌停价挂单市场占比=${showIndexValue(p.factorValue, 1, '%')}
            ${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      return null;
    })
    .filter((p) => p !== null)
    .join(';');
  return <>{render}</>;
};

export default Z05201;
