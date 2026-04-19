import { WarnRemarkData } from '@/services/riskControlAlarm';
import React, { useEffect } from 'react';
import { colorSpan, warnValue, showWarnType } from './until';
import { TableDataList } from '../RiskMain';

interface Props {
  data?: WarnRemarkData;
  record?: TableDataList;
}

const J2: React.FC<Props> = ({ data, record }) => {
  return (
    <>
      {data ? (
        <>
          {data?.contraMode === 1 ? (
            <div>
              <div>
                买价{`>`}=卖价：当前价格=
                {colorSpan(`${data.orderPrice ?? ''}元`)}
                ，对敲委托价格={colorSpan(`${data.bucketPrice ?? ''}元`)}
              </div>
              <div>
                对敲委托序号={colorSpan(`${data.bucketEntrustNo ?? ''}`)}
                ，对敲系统号={colorSpan(`${data.bucketSysNo ?? ''}`)}
                ，对敲子系统={colorSpan(`${data.bucketSubSysNo ?? ''}`)}
              </div>
            </div>
          ) : (
            <div>
              <div>
                当前委托编码={colorSpan(`${record?.entrustCode ?? '未知'}`)}
              </div>
            </div>
          )}
        </>
      ) : null}
    </>
  );
};

export default J2;
