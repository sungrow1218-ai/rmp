import React from 'react';
import { colorSpan } from './until';

interface Props {
  marketId?: number;
}

const Z07201: React.FC<Props> = ({ marketId }) => {
  return (
    <>
      {marketId === 1 || marketId === 2 ? (
        <>可转债交易行为中，大量或者频繁进行日内回转交易，予以重点关注</>
      ) : (
        '未找到对应规则类型的监督规则'
      )}
    </>
  );
};

export default Z07201;
