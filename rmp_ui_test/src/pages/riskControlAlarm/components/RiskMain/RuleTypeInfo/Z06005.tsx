import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue } from './until';

interface Props {
  data: WarnRemarkData;
}

const Z06005: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.factorResult?.map((p) => {
        if (p.factorType === 68) {
          return (
            <div>
              指数成分股成交金额={showIndexValue(p.factorValue, 2, '万元')}
              {factorTypeWarn(p, 2, '万元', data.operation)}
            </div>
          );
        }
        if (p.factorType === 67) {
          return (
            <div>
              指数波动率={showIndexValue(p.factorValue, 1, '%')}
              {factorTypeWarn(p, 1, '%', data.operation)}
            </div>
          );
        }
        if (p.factorType === 69) {
          return (
            <div>
              本方成交金额市场占比={showIndexValue(p.factorValue, 1, '%')}
              {factorTypeWarn(p, 1, '%', data.operation)}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default Z06005;
