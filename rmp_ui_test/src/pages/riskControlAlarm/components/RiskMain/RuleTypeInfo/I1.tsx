import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { colorSpan } from './until';
import { transformDictCodeToNameHelper } from '@/utils/dict';
import { OPERATION_TYPE_I1 } from '@/utils/dictRiskAlarm';

interface Props {
  data?: WarnRemarkData;
}

const I1: React.FC<Props> = ({ data }) => {
  const isOprea = transformDictCodeToNameHelper(
    String(data?.operationType),
    OPERATION_TYPE_I1
  );
  return (
    <div>
      {data ? (
        <>
          证券代码={colorSpan(`${data?.securityCode ?? ''}`)}，触发操作=
          {colorSpan(
            `${
              transformDictCodeToNameHelper(
                String(data.operationType),
                OPERATION_TYPE_I1
              )
                ? transformDictCodeToNameHelper(
                    String(data.operationType),
                    OPERATION_TYPE_I1
                  )
                : '未知'
            }`
          )}
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default I1;
