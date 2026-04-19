import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z04: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 7 ? (
        <>
          股指期权
          <br />
          1．大额报撤单： <br />
          客户单日在某一合约上的撤单次数达到{colorSpan('100次')}
          （含{colorSpan('100次')}
          ），且单笔撤单量达到交易所规定的限价指令每次最大下单数量
          {colorSpan('80%')}的，构成“大额报撤单”的异常交易行为
          <br />
          2．频繁报撤单： <br />
          客户单日在某一合约上的撤单次数达到{colorSpan('500次')}
          （含{colorSpan('500次')}），构成“频繁报撤单”的异常交易行为 <br />
          股指期货 <br />
          1．客户单日在某一合约上的自成交次数达到{colorSpan('5次')}（含
          {colorSpan('5次')}
          ）的，构成“以自己为交易对象，大量或者多次进行自买自卖（包括一组实际控制关系账户内的客户之间的交易）”的异常交易行为{' '}
          <br />
          2．客户单日在某一合约上的撤单次数达到{colorSpan('400次')}
          （含{colorSpan('400次')}）的，构成“频繁报撤单”的异常交易行为 <br />
          3．客户单日在某一合约上的撤单次数达到{colorSpan('100次')}（含
          {colorSpan('100次')}
          ），且单笔撤单量达到交易所规定的限价指令每次最大下单数量
          {colorSpan('80%')}的，构成“大额报撤单”的异常交易行为 <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z04;
