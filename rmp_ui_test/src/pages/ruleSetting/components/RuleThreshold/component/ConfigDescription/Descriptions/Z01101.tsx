import React from 'react';
import {
  getPreConditionStringFromValue,
  getThresholdForbidenStrs,
  getThresholdWarningStrs,
} from './common';

function getFormulaStr(arr: string[]) {
  if (!arr || arr.length !== 4) {
    return '';
  }
  // ((15||16)&18)||48
  return `((${arr[0]} 或 ${arr[1]}) 且 ${arr[2]}) 或 ${arr[3]} 记触发一次`;
}

const Z01101Description = ({
  preConditionValues = [],
  thresholdConditionValues = [],
}) => {
  // $1
  const [$1] = preConditionValues;

  const preConditionStr = `${getPreConditionStringFromValue($1)} 记触发一次`;

  const warningStr = getFormulaStr(
    getThresholdWarningStrs(thresholdConditionValues)
  );
  const forbidenStr = getFormulaStr(
    getThresholdForbidenStrs(thresholdConditionValues)
  );

  return (
    <>
      <div>{preConditionStr}</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {warningStr && <div>{warningStr} 为预警</div>}
        {forbidenStr && <div>{forbidenStr} 为禁止</div>}
      </div>
    </>
  );
};

export default Z01101Description;
