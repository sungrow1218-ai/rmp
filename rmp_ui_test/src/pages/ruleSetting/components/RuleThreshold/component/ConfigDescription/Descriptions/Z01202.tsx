import React from 'react';
import { getThresholdForbidenStrs, getThresholdWarningStrs } from './common';

function getFormulaStr(arr: string[]) {
  if (!arr || arr.length !== 6) {
    return '';
  }
  // ($1|$2)&$3&$4&($5|$6)
  return `(${arr[0]} 或 ${arr[1]}) 且 ${arr[2]} 且 ${arr[3]} 且 (${arr[4]} 或 ${arr[5]}) 记触发一次`;
}

const Z06004Description = ({ thresholdConditionValues = [] }) => {
  // ($1|$2)&$3&$4&($5|$6)
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

export default Z06004Description;
