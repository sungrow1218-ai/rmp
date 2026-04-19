import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z06004: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          {' '}
          交易时段：{colorSpan('09:30:00~15:00:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）全日多次出现个股{colorSpan('1分钟')}内涨（跌）幅大于
          {colorSpan('1% ')}
          <br />
          （二）期间的成交数量大于{colorSpan('10万股')}，或者成交金额大于
          {colorSpan('100万元')} <br />
          （三）期间成交数量占成交期间市场成交总量的比例大于{colorSpan(
            '10%'
          )}{' '}
          <br />
          （四）满足上述情形的次数大于{colorSpan('15次')} <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z06004;
