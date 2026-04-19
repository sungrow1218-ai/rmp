import React from 'react';
import { getThresholdForbidenStrs, getThresholdWarningStrs } from './common';

function getFormulaStr(arr: string[]) {
  if (!arr || arr.length !== 5) {
    return '';
  }
  // ($1|$2)&$3&($4|$5)
  return `(${arr[0]} 或 ${arr[1]}) 且 ${arr[2]} 且 (${arr[3]} 或 ${arr[4]})  记触发一次`;
}

const Z05301Description = ({ thresholdConditionValues = [] }) => {
  // ($1|$2)&$3&($4|$5)
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

export default Z05301Description;
