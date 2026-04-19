import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { colorSpan, warnValue, showWarnType } from './until';

interface Props {
  data?: WarnRemarkData;
}

const I51: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data ? (
        <>
          证券代码={`${data?.securityCode ?? '未知'}`}，触发操作=
          {`禁止买(含买开、卖开)`}
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default I51;
