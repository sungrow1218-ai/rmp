import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import {
  factorTypeWarn,
  orderDirection,
  showIndexValue,
  warnValue,
} from './until';

interface Props {
  data?: WarnRemarkData;
}

const Z03101: React.FC<Props> = ({ data }) => {
  const render = data?.factorResult
    ?.map((p) => {
      if (p.factorType === 49) {
        return ` ${orderDirection(data?.orderDirection ?? 0)}方向申报价格偏离度=
           ${showIndexValue(p.factorValue, 1, '%')}
            ${warnValue(p, 1, '%')}`;
      }
      if (p.factorType === 40 && p.operation !== 0) {
        return ` 累计申报数量=${showIndexValue(p.factorValue, 2, '万股(手)')}
            ${factorTypeWarn(p, 2, '万股(手)', data.operation)}`;
      }
      if (p.factorType === 41 && p.operation !== 0) {
        return ` 累计申报金额=${showIndexValue(p.factorValue, 2, '万元')}
            ${factorTypeWarn(p, 2, '万元', data.operation)}`;
      }
      if (p.factorType === 42) {
        return `同方向累计申报占比=${showIndexValue(p.factorValue, 1, '%')}
            ${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      if (p.factorType === 29) {
        return `累计撤销占比=${showIndexValue(p.factorValue, 1, '%')}
            ${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      if (p.factorType === 43) {
        return `低于申报买入/高于申报卖出次数=
            ${showIndexValue(p.factorValue, 3, '次')}
            ${factorTypeWarn(p, 3, '次', data.operation)}`;
      }
      return null;
    })
    .filter((p) => p !== null)
    .join(';');
  return <>{render}</>;
};

export default Z03101;
