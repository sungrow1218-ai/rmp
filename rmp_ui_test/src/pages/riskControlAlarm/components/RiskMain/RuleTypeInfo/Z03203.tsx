import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue, warnValue } from './until';

interface Props {
  data: WarnRemarkData;
}

const Z03203: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.factorResult?.map((p) => {
        if (p.factorType === 34 && p.operation !== 0) {
          return (
            <div>
              涨跌停价挂单数量=
              {showIndexValue(p.factorValue, 2, '万股(手)')}
              {warnValue(p, 2, '万股(手)')}
            </div>
          );
        }
        if (p.factorType === 33 && p.operation !== 0) {
          return (
            <div>
              涨跌停价挂单金额=
              {showIndexValue(p.factorValue, 2, '万元')}
              {warnValue(p, 2, '万元')}
            </div>
          );
        }
        if (p.factorType === 48) {
          return (
            <div>
              涨跌停价挂单市场占比 ={showIndexValue(p.factorValue, 1, '%')}
              {warnValue(p, 1, '%')}
            </div>
          );
        }
        if (p.factorType === 29) {
          return (
            <div>
              累计撤销占比={showIndexValue(p.factorValue, 1, '%')}
              {warnValue(p, 1, '%')}
            </div>
          );
        }
        if (p.factorType === 50) {
          return (
            <div>
              累计触发次数={showIndexValue(p.factorValue, 3, '次')}
              {factorTypeWarn(p, 3, '次', data.operation)}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default Z03203;
