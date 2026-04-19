import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}

const F1: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 ? (
        <>
          {' '}
          风险警示板：当日通过竞价交易和大宗交易累计买入的单只风险警示股票，数量不得超过
          {colorSpan('50万股')} <br />
          主板：股票竞价交易单笔申报最大数量应当不超过{colorSpan(
            '100万股'
          )}。 <br />
          通过竞价交易卖出风险警示股票的，单笔申报最大数量应当不超过
          {colorSpan('100万股')}
          ；退市整理股票竞价交易单笔申报最大数量应当不超过{colorSpan('100万股')}
          。
          <br />
          科创板：通过限价申报买卖科创板股票的，单笔申报数量应当不超过
          {colorSpan('10万股')}
          ；通过市价申报买卖科创板股票的，单笔申报数量应当不超过
          {colorSpan('5万股')}
          ；通过收盘定价申报买卖科创板股票的，单笔申报数量应当不超过
          {colorSpan('100万股')}。
          <br />
          存托凭证交易申报上限适用股票的相关规定。
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default F1;
