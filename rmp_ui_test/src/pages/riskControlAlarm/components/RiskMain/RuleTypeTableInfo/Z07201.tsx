import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const Z07201: React.FC<Props> = ({ data }) => {
  const render = data?.factorResult
    ?.map((p) => {
      if (p.factorType === 11001) {
        return `买入金额= ${showIndexValue(p.factorValue, 2, '万元')}
          ${factorTypeWarn(p, 2, '万元', data.operation)}`;
      }
      if (p.factorType === 11002) {
        return `卖出金额= ${showIndexValue(p.factorValue, 2, '万元')}
          ${factorTypeWarn(p, 2, '万元', data.operation)}`;
      }
      if (p.factorType === 11003) {
        return `累计成交量对日内最大持仓量倍数=
          ${showIndexValue(p.factorValue, 3, '倍')}
          ${factorTypeWarn(p, 3, '倍', data.operation)}`;
      }
      return null;
    })
    .filter((p) => p !== null)
    .join(';');
  return <>{render}</>;
};

export default Z07201;
