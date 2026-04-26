import { InputNumber as AntdInputNumber, InputNumberProps } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { SetType } from '../../type';
import { FormItemInputContext } from 'antd/es/form/context';

export type IValue = {
  value: number | null;
  setType?: SetType; // 用来标识 显示参数：1-默认值，2-比例缩小，3-自定义值
  defaultValue?: number;
};

export interface IProps {
  value: IValue;
  defaultValue: number;
  onChange: (val: IValue) => void;
}

export const InputNumber: React.FC<IProps> = ({
  onChange,
  value,
  defaultValue,
  ...rest
}) => {
  // 获取 FormItem 的上下文信息
  const { status, errors } = useContext(FormItemInputContext);
  const [innerValue, setInnerValue] = useState<number | null>(defaultValue);

  useEffect(() => {
    if (value) {
      setInnerValue(value.value);
    }
  }, [value]);

  return (
    <div style={{ position: 'relative' }}>
      <AntdInputNumber
        {...(rest as Omit<InputNumberProps, 'value' | 'onChange'>)}
        onChange={(val) => {
          setInnerValue(val as number);
          onChange &&
            onChange({
              value: val as number,
              setType: SetType.CUSTOM,
              defaultValue,
            });
        }}
        value={innerValue}
      />
      {defaultValue && innerValue !== defaultValue
        ? `（默认值：${defaultValue}）`
        : null}
      {/* 显示错误信息 */}
      {status === 'error' && (
        <div style={{
          position: 'absolute',
          bottom: '-28px',
          left: '30px',
          color: '#ff4d4f',
        }}>
          {(errors && errors[0]) || '未知错误'}
        </div>
      )}
    </div>
  );
};