import { InputNumber, Select } from 'antd';
import React, { useState } from 'react';

interface ThresholdValue {
  inputValue?: number;
  operation?: string;
}

interface ThresholdItemProps {
  value?: ThresholdValue;
  onChange?: (value: ThresholdValue) => void;
  inputProps: Recordable;
  options: { label: string; value: string }[];
}

const ThresholdItem: React.FC<ThresholdItemProps> = ({
  value = {},
  onChange,
  inputProps,
  options,
}) => {
  const [inputValue, setInputValue] = useState(
    value.inputValue || inputProps.min
  );
  const [operation, setOperation] = useState<string | undefined>(
    value.operation || undefined
  );

  const triggerChange = (changedValue: {
    inputValue?: number;
    operation?: string;
  }) => {
    onChange?.({ inputValue, operation, ...value, ...changedValue });
  };

  const onInputValueChange = (changeValue: number | null) => {
    const newNumber = changeValue;
    if (Number.isNaN(inputValue)) {
      return;
    }
    setInputValue(newNumber);
    triggerChange({ inputValue: newNumber! });
  };

  const onOperationChange = (newOperation: string | undefined) => {
    setOperation(newOperation);
    triggerChange({ operation: newOperation });
  };

  return (
    <div>
      <InputNumber
        value={inputValue}
        onChange={onInputValueChange}
        style={{ width: 210 }}
        {...inputProps}
        addonAfter={inputProps.name}
      />
      <span style={{ marginLeft: '8px' }}>操作&#160;:</span>
      <Select
        value={operation}
        style={{ width: 100, marginLeft: '8px' }}
        onChange={onOperationChange}
        options={options}
        allowClear={true}
      />
    </div>
  );
};

export default ThresholdItem;
