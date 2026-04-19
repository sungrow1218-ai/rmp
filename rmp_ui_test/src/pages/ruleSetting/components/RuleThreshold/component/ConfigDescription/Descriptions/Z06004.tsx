import React from 'react';
import {
  getPreConditionStringFromValue,
  getThresholdForbidenStrs,
  getThresholdWarningStrs,
} from './common';

const Z06004Description = ({
  preConditionValues = [],
  thresholdConditionValues = [],
}) => {
  // ($1|$2)&$3&$4
  const [$1, $2, $3, $4] = preConditionValues;
  // console.log(preConditionValues);

  const preConditionStr = `(${getPreConditionStringFromValue(
    $1
  )} 或 ${getPreConditionStringFromValue(
    $2
  )}) 且 ${getPreConditionStringFromValue(
    $3
  )} 且 ${getPreConditionStringFromValue($4)} 记触发一次`;

  const warningStr = getThresholdWarningStrs(thresholdConditionValues).join('');
  const forbidenStr = getThresholdForbidenStrs(thresholdConditionValues).join(
    ''
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

export default Z06004Description;
