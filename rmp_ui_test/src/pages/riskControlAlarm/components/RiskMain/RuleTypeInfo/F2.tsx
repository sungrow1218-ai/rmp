import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { warnValue, showIndexValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const RiskInfoF2: React.FC<Props> = ({ data }) => {
  return (
    <div>
      {data ? (
        <>
          {' '}
          累计净买入金额={showIndexValue(data.indexValue, 2, '万元')}
          {warnValue(data, 2, '万元')}
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default RiskInfoF2;
