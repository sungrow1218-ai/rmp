import { WarnRemarkData } from '@/services/riskControlAlarm';
import React, { useMemo } from 'react';
import { warnValue, showIndexValue } from './until';

interface Props {
  data?: WarnRemarkData;
}

const RiskInfoA1: React.FC<Props> = ({ data }) => {
  const isPren = useMemo(() => {
    if (data && data.factorResult && data.factorResult.length > 1) {
      return true;
    }
    return false;
  }, [data]);
  const string = data?.factorResult
    ?.map((p) => {
      if (p.factorType === 1) {
        return `证券持仓数量=${showIndexValue(p.factorValue, 2, '万股(手)')}${
          !isPren ? warnValue(data, 2, '万股(手)') : ''
        }`;
      }
      // if (p.factorType === 9) {
      //   return `证券总股本=${showIndexValue(p.factorValue, 2, '万股(手)')}${
      //     !isPren ? warnValue(data, 2, '万股(手)') : ''
      //   }`;
      // }
      // if (p.factorType === 10) {
      //   return `证券流通股本=${showIndexValue(p.factorValue, 2, '万股(手)')}${
      //     !isPren ? warnValue(data, 2, '万股(手)') : ''
      //   }`;
      // }
      // if (p.factorType === 19) {
      //   return `债券发行余额=${showIndexValue(p.factorValue, 2, '万股(手)')}${
      //     !isPren ? warnValue(data, 2, '万股(手)') : ''
      //   }`;
      // }
      // if (p.factorType === 20) {
      //   return `期货持仓限额=${showIndexValue(p.factorValue, 2, '万股(手)')}${
      //     !isPren ? warnValue(data, 2, '万股(手)') : ''
      //   }`;
      // }
      // if (p.factorType === 27) {
      //   return `期权持仓限额=${showIndexValue(p.factorValue, 2, '万股(手)')}${
      //     !isPren ? warnValue(data, 2, '万股(手)') : ''
      //   }`;
      // }
      return null;
    })
    .filter((p) => p !== null)
    .join(';');

  return (
    <>
      {string}
      {data && data.factorResult?.length === 2 ? (
        <>
          ;证券持仓占比=
          {showIndexValue(data.indexValue, 1, '%')}
          {warnValue(data, 1, '%')}
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default RiskInfoA1;
