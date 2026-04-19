import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';

interface Props {
  marketId?: number;
}

const RiskInfoA1: React.FC<Props> = ({ marketId }) => {
  return <>未找到对应规则类型的监督规则</>;
};

export default RiskInfoA1;
