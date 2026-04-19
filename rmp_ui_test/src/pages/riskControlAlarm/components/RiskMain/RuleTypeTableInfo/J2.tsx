import { WarnRemarkData } from '@/services/riskControlAlarm';
import React, { useEffect } from 'react';
import { TableDataList } from '../RiskMain';

interface Props {
  data?: WarnRemarkData;
  record?: TableDataList;
}

const J2: React.FC<Props> = ({ data, record }) => {
  // useEffect(() => {}, [data?]);
  return (
    <>
      {data && data.contraMode === 1 ? (
        <>
          <>
            买价{`>`}=卖价：当前价格={`${data?.orderPrice ?? ''}元`}
            ，对敲委托价格={`${data?.bucketPrice ?? ''}元`}；
          </>
          <>
            对敲委托序号={`${data?.bucketEntrustNo ?? ''}`}
            ，对敲系统号={`${data?.bucketSysNo ?? ''}`}
            ，对敲子系统={`${data?.bucketSubSysNo ?? ''}`}
          </>
        </>
      ) : (
        <>当前委托编码={`${record?.entrustCode ?? ''}`}</>
      )}
    </>
  );
};

export default J2;
