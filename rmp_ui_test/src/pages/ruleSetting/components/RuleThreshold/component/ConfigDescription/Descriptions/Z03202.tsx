import React from 'react';
import {
  getPreConditionStringFromValue,
  getThresholdForbidenStrs,
  getThresholdWarningStrs,
} from './common';

const Z03202Description = ({
  preConditionValues = [],
  thresholdConditionValues = [],
}) => {
  // ($1|$2)&$3
  const [$1, $2, $3] = preConditionValues;
  // console.log(preConditionValues);

  const preConditionStr = `(${getPreConditionStringFromValue(
    $1
  )} 或 ${getPreConditionStringFromValue(
    $2
  )}) 且 ${getPreConditionStringFromValue($3)} 记触发一次`;

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

export default Z03202Description;
