import { WarnRemarkData } from '@/services/riskControlAlarm';
import React, { useMemo } from 'react';
import { showIndexValue, factorTypeWarn } from './until';
import moment from 'moment';

interface Props {
  data?: WarnRemarkData;
}

const Z01201: React.FC<Props> = ({ data }) => {
  const timeShow = useMemo(() => {
    if (!data) return '时间格式不正确';
    if (data?.timeInterval) {
      const [time1, time2] = data.timeInterval.split('-');
      if (time1.length === 9) {
        const tranTime1 = moment(time1, 'HHmmssSSS').format('HH:mm:ss:SSS');
        const tranTime2 = moment(time2, 'HHmmssSSS').format('HH:mm:ss:SSS');
        return `${tranTime1} - ${tranTime2}`;
      } else if (time1.length === 6) {
        const tranTime1 = moment(time1, 'HHmmss').format('HH:mm:ss');
        const tranTime2 = moment(time2, 'HHmmss').format('HH:mm:ss');
        return `${tranTime1} - ${tranTime2}`;
      } else {
        return '时间格式不正确';
      }
    } else {
      return '时间格式不正确';
    }
  }, [data]);

  const render = data?.factorResult
    ?.map((p) => {
      if (p.factorType === 15 && p.operation !== 0) {
        return `区间成交金额=${showIndexValue(p.factorValue, 2, '万元')}
          ${factorTypeWarn(p, 2, '万元', data.operation)}`;
      }
      if (p.factorType === 16 && p.operation !== 0) {
        return `区间成交数量=${showIndexValue(p.factorValue, 2, '万股(手)')}
          ${factorTypeWarn(p, 2, '万股(手)', data.operation)}`;
      }
      if (p.factorType === 17) {
        return `区间价格涨跌幅=${showIndexValue(p.factorValue, 1, '%')}
          ${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      if (p.factorType === 18) {
        return `区间市场成交占比=
          ${showIndexValue(p.factorValue, 1, '%')}
          ${factorTypeWarn(p, 1, '%', data.operation)}`;
      }
      return null;
    })
    .filter((p) => p !== null)
    .join(';');

  return (
    <>
      {data?.timeInterval ? <>时间区间：{data?.timeInterval};</> : ''} {render}
    </>
  );
};

export default Z01201;
