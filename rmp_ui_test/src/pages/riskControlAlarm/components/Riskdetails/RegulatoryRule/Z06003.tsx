import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}
const Z06003: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>
          {' '}
          交易时段：{colorSpan('09:15:00~15:00:00')}
          ，交易行为出现以下情形的，予以重点关注 <br />
          （一）{colorSpan('1秒钟')}内（含）申报又撤销申报视为瞬时撤单 <br />
          （二）满足情形1的行为在单只或者多只股票上累计次数大于
          {colorSpan('500次')} <br />
          （三）全日累计撤销申报笔数占累计申报笔数的比例大于{colorSpan('50%')}
          或者全日累计撤销申报金额占累计申报金额的比例大于{colorSpan(
            '50%'
          )}{' '}
          <br />
        </>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z06003;
