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

const Z03201: React.FC<Props> = ({ data }) => {
  const render = data?.factorResult
    ?.map((p) => {
      if (p.factorType === 44 && p.operation !== 0) {
        return `五档内挂单数量=${showIndexValue(p.factorValue, 2, '万股(手)')}
            ${warnValue(p, 2, '万股(手)')}`;
      }
      if (p.factorType === 45 && p.operation !== 0) {
        return `五档内挂单金额=${showIndexValue(p.factorValue, 2, '万元')}
            ${warnValue(p, 2, '万元')}`;
      }
      if (p.factorType === 46) {
        return `五档内挂单市场占比=${showIndexValue(p.factorValue, 1, '%')}
            ${warnValue(p, 1, '%')}`;
      }
      if (p.factorType === 29) {
        return `累计撤销占比=${showIndexValue(p.factorValue, 1, '%')}
            ${warnValue(p, 1, '%')}`;
      }
      if (p.factorType === 50) {
        return `以上条件累计已触发=${showIndexValue(p.factorValue, 3, '次')}
            ${factorTypeWarn(p, 3, '次', data.operation)}`;
      }

      return null;
    })
    .filter((p) => p !== null)
    .join(';');
  return (
    <>
      {data ? (
        <>
          当前{orderDirection(data?.orderDirection ?? 0)}
          方向委托报价在最优五档内；
        </>
      ) : (
        ''
      )}
      {render}
    </>
  );
};

export default Z03201;
