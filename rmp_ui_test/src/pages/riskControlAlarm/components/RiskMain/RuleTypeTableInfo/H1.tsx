import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { warnValue, showIndexValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const H1: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data ? (
        <>
          价格偏离度={' '}
          {data.calcType === 0
            ? showIndexValue(data.indexValue, 1, '%')
            : `${data.indexValue}元`}
          {data.calcType === 0
            ? warnValue(data, 1, '%')
            : warnValue(data, 3, '元')}
          ;委托价格=
          {`${data?.orderPrice ?? '--'}元`};比较价格=
          {`${data.comparePrice ?? '--'}元`};控制价格=
          {`${data.controlPrice ?? '--'}元`}
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default H1;
