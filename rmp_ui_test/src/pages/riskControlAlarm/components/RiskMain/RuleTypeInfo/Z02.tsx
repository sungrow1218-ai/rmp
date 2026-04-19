import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { warnValue, showIndexValue } from './until';

interface Props {
  data: WarnRemarkData;
}

const Z02: React.FC<Props> = ({ data }) => {
  return (
    <div>
      1分钟单向委托金额={showIndexValue(data.indexValue, 2, '万元')}
      {warnValue(data, 2, '万元')}
    </div>
  );
};

export default Z02;
