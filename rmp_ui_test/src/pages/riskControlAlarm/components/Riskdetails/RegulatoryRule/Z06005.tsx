import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}

const Z06005: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 ? (
        <>
          {' '}
          交易时段：{colorSpan('09:30:00~15:00:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）短时间内买入（卖出）金额特别巨大，即上证综合指数
          {colorSpan('1分钟')}内涨跌幅大于
          {colorSpan('0.2%')}，或科创50指数涨跌幅大于{colorSpan('0.4%')} <br />
          （二）期间主动买入（卖出）的成交金额大于{colorSpan('10000万元')}
          _上证综指成分股（科创50指数成分股，{colorSpan('2000万元')}），
          且期间的成交金额占成交期间本方市场成交金额的比例大于{colorSpan('3%')}{' '}
          <br />
        </>
      ) : marketId === 2 ? (
        <>
          交易时段：{colorSpan('09:30:00~15:00:00')}
          ，交易行为出现以下情形的，予以重点关注
          <br />
          （一）短时间内买入（卖出）金额特别巨大，即深圳综合指数1分钟内涨跌幅大于
          {colorSpan('0.2%')}，或深成指数大于{colorSpan('0.2%')}
          ，或创业板指数大于{colorSpan('0.4%')}
          <br />
          （二）期间主动买入（卖出）的成交金额大于{colorSpan('10000万元')}
          _深综指/深成指（创业板指数成分股
          {colorSpan('3000万元')}
          ），且期间的成交金额占成交期间本方市场成交金额的比例大于
          {colorSpan('3%')} <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z06005;
