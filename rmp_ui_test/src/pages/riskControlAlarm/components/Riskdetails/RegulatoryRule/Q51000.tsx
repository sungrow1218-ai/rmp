import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { colorSpan } from './until';

interface Props {
  data?: WarnRemarkData;
}

const Q51000: React.FC<Props> = ({ data }) => {
  return <>未找到对应规则类型的监督规则</>;
};

export default Q51000;
