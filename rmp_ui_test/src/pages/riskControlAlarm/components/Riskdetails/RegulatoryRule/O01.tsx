import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}

const O01: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          股票期权：
          <br />
          仅限于当日报备过期权程序化交易的客户，当日撤单笔数达到
          {colorSpan('20000笔')}，超过部分的撤单比不可超过{colorSpan('80%')}{' '}
          <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default O01;
