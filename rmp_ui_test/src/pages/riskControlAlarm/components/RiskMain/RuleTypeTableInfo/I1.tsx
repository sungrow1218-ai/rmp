import { WarnRemarkData } from '@/services/riskControlAlarm';
import React from 'react';
import { transformDictCodeToNameHelper } from '@/utils/dict';
import { OPERATION_TYPE_I1 } from '@/utils/dictRiskAlarm';

interface Props {
  data?: WarnRemarkData;
}

const I1: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data ? (
        <>
          证券代码={`${data?.securityCode ?? '未知'}`}，触发操作=
          {`${
            transformDictCodeToNameHelper(
              String(data?.operationType),
              OPERATION_TYPE_I1
            )
              ? transformDictCodeToNameHelper(
                  String(data?.operationType),
                  OPERATION_TYPE_I1
                )
              : '未知'
          }`}{' '}
          <br />
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default I1;
