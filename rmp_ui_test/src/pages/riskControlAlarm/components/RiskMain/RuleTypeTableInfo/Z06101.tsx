import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { warnValue, showIndexValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const Z06101: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data?.factorResult?.map((p) => {
        if (p.factorType === 58) {
          return (
            <>
              单日申报数量={showIndexValue(p.factorValue, 3, '笔')}
              {warnValue(p, 3, '笔')}
            </>
          );
        }
        return null;
      })}
    </>
  );
};

export default Z06101;
