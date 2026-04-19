import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { showIndexValue, factorTypeWarn } from './until';

interface Props {
  data: WarnRemarkData;
}

const Z03000: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.factorResult?.map((p) => {
        if (p.factorType === 34000 && p.operation !== 0) {
          return (
            <div>
              剩余有效申报金额={showIndexValue(p.factorValue, 2, '万元')}
              {factorTypeWarn(p, 2, '万元', data.operation)}
            </div>
          );
        }
        if (p.factorType === 33000 && p.operation !== 0) {
          return (
            <div>
              剩余有效申报数量=
              {showIndexValue(p.factorValue, 2, '万股(手)')}
              {factorTypeWarn(p, 2, '万股(手)', data.operation)}
            </div>
          );
        }

        return null;
      })}
    </>
  );
};

export default Z03000;
