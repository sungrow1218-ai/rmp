import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const J3: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          交易时段：{colorSpan('09:15:00~15:00:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）在单个账户或者自己实际控制的账户之间交易；两个或者两个以上涉嫌关联的账户之间互为对手方交易{' '}
          <br />
          （二）成交数量占股票全天累计成交总量的{colorSpan('10%')}
          以上或者收盘集合竞价阶段成交数量占期间市场成交总量的{colorSpan('30%')}
          以上 <br />
        </>
      ) : marketId === 7 ? (
        <>
          客户单日在某一合约上的自成交次数达到{colorSpan('5次')}（
          {colorSpan('含5次')}
          ）的，构成“以自己为交易对象，大量或者多次进行自买自卖（包括一组实际控制关系账户内的客户之间的交易）”的异常交易行为。
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default J3;
