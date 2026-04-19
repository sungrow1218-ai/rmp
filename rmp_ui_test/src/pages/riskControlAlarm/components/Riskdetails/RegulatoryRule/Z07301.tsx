import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}

const Z07301: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          仅限于当日报备过期权程序化交易的客户，当日单一品种的成交量达到
          {colorSpan('1000张')}后，超过{colorSpan('1000张')}
          的部分成交持仓比不可超过
          {colorSpan('300%')}
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z07301;
