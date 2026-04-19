import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z03202: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          {' '}
          交易时段：{colorSpan('09:30:00~14:57:00')}
          ，交易行为出现以下情形的，予以重点关注
          <br />
          （一）最优5档内申报买入或卖出 <br />
          （二）单笔申报后，实时最优5档内累计剩余有效申报数量_风险警示股大于
          {colorSpan('50万股')}（非风险警示股
          {colorSpan('100万股')}），或者金额_风险警示股大于{' '}
          {colorSpan('200万元')}
          （非风险警示股{colorSpan('1000万元')}
          ）。且占市场同方向最优5档剩余有效申报总量的比例大于
          {colorSpan('30%')} <br />
          （三）满足上述情形的申报大于{colorSpan('3次')} <br />
          （四）累计撤销申报数量占累计申报数量的{colorSpan('50%')}以上 <br />
          （五）存在反向卖出（买入）成交 <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z03202;
