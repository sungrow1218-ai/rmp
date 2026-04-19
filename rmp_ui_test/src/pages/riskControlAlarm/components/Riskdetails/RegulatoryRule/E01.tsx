import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}

const RiskInfoE01: React.FC<Props> = ({ marketId }) => {
  return <>未找到对应规则类型的监督规则</>;
};

export default RiskInfoE01;
