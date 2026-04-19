import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import {
  factorTypeWarn,
  orderDirection,
  showIndexValue,
  warnValue,
} from './until';

interface Props {
  data: WarnRemarkData;
}

const Z03101: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.factorResult?.map((p) => {
        if (p.factorType === 49) {
          return (
            <div>
              {orderDirection(data.orderDirection ?? 0)}方向申报价格偏离度=
              {showIndexValue(p.factorValue, 1, '%')}
              {warnValue(p, 1, '%')}
            </div>
          );
        }
        if (p.factorType === 40 && p.operation !== 0) {
          return (
            <div>
              累计申报数量=
              {showIndexValue(p.factorValue, 2, '万股(手)', p.operation !== 0)}
              {factorTypeWarn(p, 2, '万股(手)', data.operation)}
            </div>
          );
        }
        if (p.factorType === 41 && p.operation !== 0) {
          return (
            <div>
              累计申报金额=
              {showIndexValue(p.factorValue, 2, '万元', p.operation !== 0)}
              {factorTypeWarn(p, 2, '万元', data.operation)}
            </div>
          );
        }
        if (p.factorType === 42) {
          return (
            <div>
              同方向累计申报占比=
              {showIndexValue(p.factorValue, 1, '%')}
              {factorTypeWarn(p, 1, '%', data.operation)}
            </div>
          );
        }
        if (p.factorType === 29) {
          return (
            <div>
              累计撤销占比=
              {showIndexValue(p.factorValue, 1, '%')}
              {factorTypeWarn(p, 1, '%', data.operation)}
            </div>
          );
        }
        if (p.factorType === 43) {
          return (
            <div>
              低于申报买入/高于申报卖出次数=
              {showIndexValue(p.factorValue, 3, '次')}
              {factorTypeWarn(p, 3, '次', data.operation)}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default Z03101;
