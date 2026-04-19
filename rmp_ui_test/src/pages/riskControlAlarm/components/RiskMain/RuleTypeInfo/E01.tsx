import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { warnValue, showIndexValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const RiskInfoE01: React.FC<Props> = ({ data }) => {
  return (
    <div>
      当前市值={showIndexValue(data?.indexValue, 2, '万元')}
      {warnValue(data, 2, '万元')}
    </div>
  );
};

export default RiskInfoE01;
