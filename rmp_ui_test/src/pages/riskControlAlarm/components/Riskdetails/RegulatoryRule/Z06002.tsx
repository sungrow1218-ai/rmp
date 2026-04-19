import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z06002: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          {' '}
          交易时段：{colorSpan('09:15:00~15:00:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）{colorSpan('1秒钟')}
          内在单只或多只股票上的申报、撤单的最高笔数合计大于
          {colorSpan('300笔')} <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z06002;
