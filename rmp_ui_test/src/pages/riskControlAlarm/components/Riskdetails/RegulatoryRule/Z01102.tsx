import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z01102: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          交易时段：{colorSpan('09:15:00~10:00:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）开盘集合竞价阶段成交数量_风险警示股大于{colorSpan('30万股')}
          或者成交金额大于
          {colorSpan('100万元')}（非风险警示股为{colorSpan('30万股')}
          ，非风险警示股{colorSpan('300万元')}） <br />
          （二）开盘集合竞价阶段成交数量占期间市场成交总量的比例大于
          {colorSpan('30%')} <br />
          （三）股票开盘价涨（跌）幅大于{colorSpan('2%')} <br />
          （四）当日{colorSpan('10时')}以前反向卖出（买入）成交数量在
          {colorSpan('10万股')}
          以上或者成交金额在{colorSpan('100万元')}以上 <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z01102;
