import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { factorTypeWarn, showIndexValue } from './until';

interface Props {
  data: WarnRemarkData;
}

const Z06003: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.factorResult?.map((p) => {
        if (p.factorType === 64) {
          return (
            <div>
              瞬时撤单次数=
              {showIndexValue(p.factorValue, 3, '次')}
              {factorTypeWarn(p, 3, '次', data.operation)}
            </div>
          );
        }
        if (p.factorType === 65 && p.operation !== 0) {
          return (
            <div>
              当日撤单笔数占比={showIndexValue(p.factorValue, 1, '%')}
              {factorTypeWarn(p, 1, '%', data.operation)}
            </div>
          );
        }
        if (p.factorType === 66 && p.operation !== 0) {
          return (
            <div>
              瞬时撤单金额比例={showIndexValue(p.factorValue, 1, '%')}
              {factorTypeWarn(p, 1, '%', data.operation)}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default Z06003;
