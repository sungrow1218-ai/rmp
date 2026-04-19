import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const Z06003: React.FC<Props> = ({ data }) => {
  const render = data?.factorResult
    ?.map((p) => {
      if (p.factorType === 64) {
        return `瞬时撤单次数=${showIndexValue(p.factorValue, 3, '次')}
            ${factorTypeWarn(p, 3, '次', data.operation)}`;
      }
      if (p.factorType === 65 && p.operation !== 0) {
        return `当日撤单笔数占比=
            ${showIndexValue(p.factorValue, 1, '%')}
            ${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      if (p.factorType === 66 && p.operation !== 0) {
        return ` 当日撤单金额占比=
            ${showIndexValue(p.factorValue, 1, '%')}
            ${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      return null;
    })
    .filter((p) => p !== null)
    .join(';');
  return <>{render}</>;
};

export default Z06003;
