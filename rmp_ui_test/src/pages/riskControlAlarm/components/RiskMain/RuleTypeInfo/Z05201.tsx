import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue } from './until';

interface Props {
  data: WarnRemarkData;
}

const Z05201: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.factorResult?.map((p) => {
        if (p.factorType === 33 && p.operation !== 0) {
          return (
            <div>
              涨跌停价挂单金额=
              {showIndexValue(p.factorValue, 2, '万元', p.operation !== 0)}
              {factorTypeWarn(p, 2, '万元', data.operation)}
            </div>
          );
        }
        if (p.factorType === 34 && p.operation !== 0) {
          return (
            <div>
              涨跌停价挂单数量=
              {showIndexValue(p.factorValue, 2, '万股(手)', p.operation !== 0)}
              {factorTypeWarn(p, 2, '万股(手)', data.operation)}
            </div>
          );
        }
        if (p.factorType === 48) {
          return (
            <div>
              涨跌停价挂单市场占比 ={showIndexValue(p.factorValue, 1, '%')}
              {factorTypeWarn(p, 1, '%', data.operation)}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default Z05201;
