import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z05301: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          {' '}
          交易时段：{colorSpan('14:57:00~15:00:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）连续竞价结束时股票交易价格处于涨（跌）幅限制状态 <br />
          （二）连续竞价结束时和收盘集合竞价结束时，市场涨（跌）幅限制价格剩余有效申报数量_风险警示股大于
          {colorSpan('50万股')}或者申报金额大于
          {colorSpan('200万元')}（非风险警示股{colorSpan('100万股')}，
          {colorSpan('1000万元')}） <br />
          （三）收盘集合竞价结束时，收盘集合竞价阶段新增涨（跌）幅限制价格申报的剩余有效申报数量_风险警示股大于
          {colorSpan('30万股')}或者申报金额大于
          {colorSpan('100万元')}（非风险警示股{colorSpan('30万股')}，
          {colorSpan('300万元')}） <br />
          （四）收盘集合竞价结束时，涨（跌）幅限制价格剩余有效申报数量占市场该价格剩余有效申报总量的比例大于
          {colorSpan('30%')} <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z05301;
