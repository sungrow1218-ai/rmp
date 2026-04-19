import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { showIndexValue, factorTypeWarn, warnValue } from './until';

interface Props {
  data: WarnRemarkData;
}

const Z01302: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.factorResult?.map((p) => {
        if (p.factorType === 15 && p.operation !== 0) {
          return (
            <div>
              成交金额=
              {showIndexValue(p.factorValue, 2, '万元', p.operation !== 0)}
              {factorTypeWarn(p, 2, '万元', data.operation)}
            </div>
          );
        }
        if (p.factorType === 16 && p.operation !== 0) {
          return (
            <div>
              成交数量=
              {showIndexValue(p.factorValue, 2, '万股(手)', p.operation !== 0)}
              {factorTypeWarn(p, 2, '万股(手)', data.operation)}
            </div>
          );
        }
        if (p.factorType === 38) {
          return (
            <div>
              收盘价涨跌幅=
              {showIndexValue(p.factorValue, 1, '%')}
              {warnValue(p, 1, '%')}
            </div>
          );
        }
        if (p.factorType === 18) {
          return (
            <div>
              市场成交占比=
              {showIndexValue(p.factorValue, 1, '%')}
              {factorTypeWarn(p, 1, '%', data.operation)}
            </div>
          );
        }
        if (p.factorType === 35 && p.operation !== 0) {
          return (
            <div>
              反向成交金额=
              {showIndexValue(p.factorValue, 2, '万元', p.operation !== 0)}
              {factorTypeWarn(p, 2, '万元', data.operation)}
            </div>
          );
        }
        if (p.factorType === 36 && p.operation !== 0) {
          return (
            <div>
              反向成交数量=
              {showIndexValue(p.factorValue, 2, '万股(手)', p.operation !== 0)}
              {factorTypeWarn(p, 2, '万股(手)', data.operation)}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default Z01302;
