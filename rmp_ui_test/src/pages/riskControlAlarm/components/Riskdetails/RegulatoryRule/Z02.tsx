import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z02: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          交易时段：{colorSpan('09:30:00~14:57:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）连续竞价阶段{colorSpan('1分钟内')}
          ，单向申报买入（卖出）单只严重异常波动股票金额大于
          {colorSpan('200万元')}（风险警示股），{colorSpan('1000万元')}
          （非风险警示股） <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z02;
