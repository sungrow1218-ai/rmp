import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z03101: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          {' '}
          交易时段：{colorSpan('09:15:00~09:25:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）主板风险警示股票以偏离前收盘价{colorSpan('3%')}
          以上的价格，或者其他股票以偏离前收盘价{colorSpan('5%')}
          以上的价格申报买入或卖出；
          <br />
          （二）主板风险警示股累计申报数量大于{colorSpan('30万股')}
          或者申报金额大于{colorSpan('100万元')}（其他股票累计申报数量大于
          {colorSpan('30万股')}
          或者申报金额大于{colorSpan('300万元')}） <br />
          （三）累计申报数量占市场同方向申报总量的{colorSpan('30%')}以上
          <br />
          （四）累计撤销申报数量占累计申报数量的{colorSpan('50%')}以上
          <br />
          （五）以低于申报买入价格反向申报卖出或者
          以高于申报卖出价格反向申报买入
          <br />
          （六）主板风险警示股票开盘竞价阶段虚拟参考价涨跌幅{colorSpan('3%')}
          以上，或者其他股票开盘竞价阶段虚拟参考价涨跌幅{colorSpan('5%')}以上
          <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z03101;
