import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue, warnValue } from './until';

interface Props {
  data: WarnRemarkData;
}

const Z07301: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.factorResult?.map((p) => {
        if (p.factorType === 16) {
          return (
            <div>
              成交数量={showIndexValue(p.factorValue, 2, '万股(手)')}
              {warnValue(p, 2, '万股(手)')}
            </div>
          );
        }
        if (p.factorType === 11003) {
          return (
            <div>
              累计成交量对日内最大持仓量倍数=
              {showIndexValue(p.factorValue, 3, '倍')}
              {factorTypeWarn(p, 3, '倍', data.operation)}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default Z07301;
