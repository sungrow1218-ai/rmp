import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { warnValue, showIndexValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const F1: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data ? (
        <>
          {data?.calcMode === 1 ? '当前交易额' : '当前交易量'}=
          {showIndexValue(
            data.indexValue,
            2,
            data?.calcMode === 1 ? '万元' : '万手'
          )}
          {warnValue(data, 2, data?.calcMode === 1 ? '万元' : '万手')}
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default F1;
