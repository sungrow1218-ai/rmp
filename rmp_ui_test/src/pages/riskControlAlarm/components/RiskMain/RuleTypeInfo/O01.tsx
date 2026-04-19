import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue, warnValue } from './until';

interface Props {
  data: WarnRemarkData;
}

const O01: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.factorResult?.map((p) => {
        if (p.factorType === 22) {
          return (
            <div>
              当日撤单笔数={showIndexValue(p.factorValue, 3, '笔')}
              {warnValue(p, 3, '笔')}
            </div>
          );
        }
        if (p.factorType === 23) {
          return (
            <div>
              撤单委托比={showIndexValue(p.factorValue, 1, '%')}
              {factorTypeWarn(p, 1, '%', data.operation)}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default O01;
