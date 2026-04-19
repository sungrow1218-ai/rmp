import React from 'react';

import { getThresholdWarningStrs, getThresholdForbidenStrs } from './common';

const Z06006Description = ({ thresholdConditionValues = [] }) => {
  const warningStr = getThresholdWarningStrs(thresholdConditionValues).join(
    ' 且 '
  );
  const forbidenStr = getThresholdForbidenStrs(thresholdConditionValues).join(
    ' 且 '
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {warningStr && <div>{warningStr} 为预警</div>}
      {forbidenStr && <div>{forbidenStr} 为禁止</div>}
    </div>
  );
};

export default Z06006Description;
