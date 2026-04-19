import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { warnValue, showIndexValue } from './until';

interface Props {
  data: WarnRemarkData;
}

const Z06006: React.FC<Props> = ({ data }) => {
  return (
    <div>
      {data?.factorResult?.map((p) => {
        if (p.factorType === 57) {
          return (
            <>
              每秒申报数量={showIndexValue(p.factorValue, 3, '笔')}
              {warnValue(p, 3, '笔')}
            </>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Z06006;
