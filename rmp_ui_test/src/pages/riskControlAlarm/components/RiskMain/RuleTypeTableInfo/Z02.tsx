import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { colorSpan, warnValue, showWarnType, showIndexValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const Z02: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data ? (
        <>
          1分钟单向委托金额={showIndexValue(data.indexValue, 2, '万元')}
          {warnValue(data, 2, '万元')}
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default Z02;
