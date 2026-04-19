import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z01301: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          交易时段：{colorSpan('14:57:00~15:00:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）成交数量_风险警示股大于{colorSpan('30万股')}或成交金额大于
          {colorSpan('100万元')}（非风险警示股为{colorSpan('30万股')}，
          {colorSpan('300万元')}） <br />
          （二）成交数量占期间市场成交总量的比例大于{colorSpan('30%')} <br />
          （三）上证50指数的成分股涨跌幅{colorSpan('2%')}
          以上，或者其他股票涨跌幅{colorSpan('3%')}以上 <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z01301;
