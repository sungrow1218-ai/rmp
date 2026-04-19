import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const Z06005: React.FC<Props> = ({ data }) => {
  const render = data?.factorResult
    ?.map((p) => {
      if (p.factorType === 68) {
        return `指数成分股成交金额=${showIndexValue(p.factorValue, 2, '万元')}
          ${factorTypeWarn(p, 2, '万元', data.operation)}`;
      }
      if (p.factorType === 67) {
        return `指数波动率=${showIndexValue(p.factorValue, 1, '%')}
          ${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      if (p.factorType === 69) {
        return `本方成交金额市场占比=${showIndexValue(p.factorValue, 1, '%')}
          ${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      return null;
    })
    .filter((p) => p !== null)
    .join(';');
  return <>{render}</>;
};

export default Z06005;
