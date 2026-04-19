import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z01202: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          {' '}
          交易时段：{colorSpan('09:30:00~14:57:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）连续竞价阶段任意{colorSpan('3分钟')}内，风险警示股成交数量大于
          {colorSpan('30万股')}或成交金额大于
          {colorSpan('100万元')}
          （非风险警示股为{colorSpan('30万股')}，{colorSpan('300万元')}） <br />
          （二）成交数量占成交期间市场成交总量的比例大于{colorSpan('30% ')}
          <br />
          （三）期间股票涨跌幅{colorSpan('2%')}以上 <br />
          （四）期间及其后{colorSpan('30分钟')}内累计反向卖出（买入）成交数量在
          {colorSpan('10万股')}以上，或者金额在{colorSpan('100万元')}以上 <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z01202;
