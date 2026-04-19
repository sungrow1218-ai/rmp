import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { showIndexValue, factorTypeWarn } from './until';

interface Props {
  data?: WarnRemarkData;
}

const RiskInfoJ3: React.FC<Props> = ({ data }) => {
  return (
    <div>
      {data?.factorResult?.map((p) => {
        if (p.factorType === 11000 && p.operation !== 0) {
          return (
            <div>
              自成交比例=
              {showIndexValue(p.factorValue, 1, '%')}
              {factorTypeWarn(p, 1, '%', data.operation)}
            </div>
          );
        }
        if (p.factorType === 11004 && p.operation !== 0) {
          return (
            <div>
              自成交次数=
              {showIndexValue(p.factorValue, 3, '次')}
              {factorTypeWarn(p, 3, '次', data.operation)}
            </div>
          );
        }
        if (p.factorType === 11005 && p.operation !== 0) {
          return (
            <div>
              自成交金额=
              {showIndexValue(p.factorValue, 2, '万元')}
              {factorTypeWarn(p, 2, '万元', data.operation)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default RiskInfoJ3;
