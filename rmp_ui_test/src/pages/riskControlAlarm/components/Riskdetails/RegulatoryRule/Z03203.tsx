import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z03203: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          {' '}
          交易时段：{colorSpan('09:30:00~14:57:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）股票交易价格处于涨（跌）幅限制状态
          <br />
          （二）单笔以涨（跌）幅限制价格申报后，在该价格剩余有效申报数量_风险警示股大于
          {colorSpan('50万股')}（非风险警示股 {colorSpan('100万股')}
          ），或者金额_风险警示股大于
          {colorSpan('200万元')}
          （非风险警示股{colorSpan('1000万元')}
          ）。且占市场该价格剩余有效申报总量的比例大于{colorSpan('30%')} <br />
          （三）单笔撤销以涨（跌）幅限制价格的申报后，在涨（跌）幅限制价格的累计撤销申报数量占以该价格累计申报数量的
          {colorSpan('50%')}以上 <br />
          （四）上述情形触发{colorSpan('2次')}以上
          <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z03203;
