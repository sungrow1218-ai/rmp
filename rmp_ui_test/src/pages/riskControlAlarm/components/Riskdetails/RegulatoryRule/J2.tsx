import { WarnRemarkData } from '@/services/riskControlAlarm';
import React, { useEffect } from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}

const J2: React.FC<Props> = ({ marketId }) => {
  // useEffect(() => {}, [data]);
  return <>未找到对应规则类型的监督规则</>;
};

export default J2;
