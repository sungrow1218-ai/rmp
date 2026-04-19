import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue, warnValue } from './until';

interface Props {
  data: WarnRemarkData;
}

const O01: React.FC<Props> = ({ data }) => {
  const render = data.factorResult
    ?.map((p) => {
      if (p.factorType === 22) {
        return `当日撤单笔数=${showIndexValue(p.factorValue, 3, '笔')}
            ${warnValue(p, 3, '笔')}`;
      }
      if (p.factorType === 23) {
        return `撤单委托比=${showIndexValue(p.factorValue, 1, '%')}
            ${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      return null;
    })
    .filter((p) => p !== null)
    .join(';');
  return <>{render}</>;
};

export default O01;
