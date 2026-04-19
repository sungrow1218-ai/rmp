import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue, warnValue } from './until';

interface Props {
  data: WarnRemarkData;
}

const Z06004: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.factorResult?.map((p) => {
        if (p.factorType === 15 && p.operation !== 0) {
          return (
            <div>
              成交金额=
              {showIndexValue(p.factorValue, 2, '万元', p.operation !== 0)}
              {warnValue(p, 2, '万元')}
            </div>
          );
        }
        if (p.factorType === 16 && p.operation !== 0) {
          return (
            <div>
              成交数量=
              {showIndexValue(p.factorValue, 2, '万股(手)', p.operation !== 0)}
              {warnValue(p, 2, '万股(手)')}
            </div>
          );
        }
        if (p.factorType === 17) {
          return (
            <div>
              当前笔1分钟内成交价格涨跌幅=
              {showIndexValue(p.factorValue, 1, '%')}
              {warnValue(p, 1, '%')}
            </div>
          );
        }
        if (p.factorType === 18) {
          return (
            <div>
              市场成交占比={showIndexValue(p.factorValue, 1, '%')}
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

export default Z06004;
