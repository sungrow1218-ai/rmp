export function getThresholdConditionStringFromValue(
  value: Record<string, any>
) {
  const {
    conditionTypeName,
    compareOperationName = '未知操作',
    unit = '',
    warningValue = '',
    forbidenValue = '',
  } = value || {};
  const strArr = [];
  if (warningValue) {
    strArr.push(
      `${conditionTypeName} ${compareOperationName} ${warningValue}${unit} 为预警`
    );
  }
  if (forbidenValue) {
    strArr.push(
      `${conditionTypeName} ${compareOperationName} ${forbidenValue}${unit} 为禁止`
    );
  }
  return strArr;
}

export const getThresholdWarningStrs = (values: Record<string, any>[]) => {
  const strArr: any[] = [];

  values.forEach((value) => {
    const {
      conditionTypeName,
      compareOperationName = '未知操作',
      unit = '',
      warningValue = '',
    } = value || {};
    if (warningValue || warningValue === '' || warningValue === 0) {
      strArr.push(
        `${conditionTypeName} ${compareOperationName} ${warningValue}${unit}`
      );
    }
  });
  return strArr;
};

export const getThresholdForbidenStrs = (values: Record<string, any>[]) => {
  const strArr: any[] = [];

  values.forEach((value) => {
    const {
      conditionTypeName,
      compareOperationName = '未知操作',
      unit = '',
      forbidenValue = '',
    } = value || {};
    if (forbidenValue || forbidenValue === '' || forbidenValue === 0) {
      strArr.push(
        `${conditionTypeName} ${compareOperationName} ${forbidenValue}${unit}`
      );
    }
  });
  return strArr;
};

export function getPreConditionStringFromValue(value: Record<string, any>) {
  const {
    conditionTypeName,
    unit = '',
    compareOperationName = '未知操作',
    thresholdValue = '未知值',
  } = value || {};
  return `${conditionTypeName} ${compareOperationName} ${thresholdValue}${unit}`;
}
