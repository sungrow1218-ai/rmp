import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const Z06002: React.FC<Props> = ({ data }) => {
  const render = data?.factorResult
    ?.map((p) => {
      if (p.factorType === 57) {
        return ` 当前秒申报数量=${showIndexValue(p.factorValue, 3, '笔')}
          ${factorTypeWarn(p, 3, '笔', data.operation)}`;
      }
      if (p.factorType === 50) {
        return `累计触发次数=${showIndexValue(p.factorValue, 3, '次')}
          ${factorTypeWarn(p, 3, '次', data.operation)}`;
      }
      return null;
    })
    .filter((p) => p !== null)
    .join(';');
  return <>{render}</>;
};

export default Z06002;
