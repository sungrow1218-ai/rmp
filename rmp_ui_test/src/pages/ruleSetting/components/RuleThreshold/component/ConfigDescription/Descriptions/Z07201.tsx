import React from 'react';
import { getThresholdForbidenStrs, getThresholdWarningStrs } from './common';

function getFormulaStr(arr: string[]) {
  if (!arr || arr.length !== 3) {
    return '';
  }
  // $1&$2&$3
  return `${arr[0]} 且 ${arr[1]} 且 ${arr[2]} 记触发一次`;
}

const Z07201Description = ({ thresholdConditionValues = [] }) => {
  // $1&$2&$3
  const warningStr = getFormulaStr(
    getThresholdWarningStrs(thresholdConditionValues)
  );
  const forbidenStr = getFormulaStr(
    getThresholdForbidenStrs(thresholdConditionValues)
  );

  return (
    <>
      {/* <div>{preConditionStr}</div> */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {warningStr && <div>{warningStr} 为预警</div>}
        {forbidenStr && <div>{forbidenStr} 为禁止</div>}
      </div>
    </>
  );
};

export default Z07201Description;
