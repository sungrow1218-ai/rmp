import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { showIndexValue, warnValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const Q51000: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data ? (
        <>
          {data.statisticsType === 10001 && (
            <div>
              {data.timeWind ? `${data.timeWind}秒内` : ''}申报次数=
              {showIndexValue(data.indexValue, 3, '次')}
              {warnValue(data, 3, '次')}
            </div>
          )}
          {data.statisticsType === 2 && (
            <div>
              {data.timeWind ? `${data.timeWind}秒内` : ''}申报数量=
              {showIndexValue(data.indexValue, 2, '万股(手)')}
              {warnValue(data, 2, '万股(手)')}
            </div>
          )}
          {data.statisticsType === 1 && (
            <div>
              {data.timeWind ? `${data.timeWind}秒内` : ''}申报金额=
              {showIndexValue(data.indexValue, 2, '万元')}
              {warnValue(data, 2, '万元')}
            </div>
          )}
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default Q51000;
