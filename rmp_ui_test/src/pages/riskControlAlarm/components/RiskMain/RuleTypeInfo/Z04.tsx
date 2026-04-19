import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { warnValue, showIndexValue } from './until';

interface Props {
  data: WarnRemarkData;
}

const Z04: React.FC<Props> = ({ data }) => {
  return (
    <div>
      {data ? (
        <>
          {data?.indexName ? `${data?.indexName}，` : ''}
          {data.precondition ? `${data.precondition}，` : ''}
          符合条件的撤单次数=
          {showIndexValue(data.indexValue, 3, '次')}
          {warnValue(data, 3, '次')}
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default Z04;
