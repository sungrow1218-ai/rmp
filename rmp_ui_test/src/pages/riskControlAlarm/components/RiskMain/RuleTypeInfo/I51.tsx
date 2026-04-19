import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { colorSpan, warnValue, showWarnType } from './until';

interface Props {
  data: WarnRemarkData;
}

const I51: React.FC<Props> = ({ data }) => {
  return (
    <div>
      证券代码={colorSpan(`${data.securityCode ?? ''}`)}，触发操作=
      {colorSpan(`禁止买(含买开、卖开)`)} <br />
    </div>
  );
};

export default I51;
