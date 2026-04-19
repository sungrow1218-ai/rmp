import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z06001: React.FC<Props> = ({ marketId }) => {
  return (
    <div>
      {marketId === 1 || marketId === 2 ? (
        <>
          {' '}
          交易时段：{colorSpan('09:15:00~15:00:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）单只或多只股票上的单日申报、撤单笔数合计大于{colorSpan('2万笔')}
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </div>
  );
};

export default Z06001;
