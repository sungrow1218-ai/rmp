import { InputNumber as AntdInputNumber, InputNumberProps } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { RiskLevel, SetType } from '../../type';
import { FormItemInputContext } from 'antd/es/form/context';
import styles from './styles.less';

export type IValue = {
  value: Recordable<number> | null;
  setType?: SetType; // 用来标识 显示参数：1-默认值，2-比例缩小，3-自定义值
  defaultValue?: Recordable<number>;
};

export interface IProps {
  value: IValue;
  defaultValue: Recordable<number>;
  onChange: (val: IValue) => void;
}

export const MultiThreshold: React.FC<IProps> = ({
  onChange,
  value,
  defaultValue,
  ...rest
}) => {
  // 获取 FormItem 的上下文信息
  const { status, errors } = useContext(FormItemInputContext);
  const [innerValue, setInnerValue] = useState<Recordable<number> | null>();

  useEffect(() => {
    if (value) {
      setInnerValue(value.value);
    }
  }, [value]);

  const levelLowStatus = useMemo(
    () =>
      (status === 'error' && !innerValue) ||
      (innerValue &&
        RiskLevel.NOTIP in innerValue &&
        (innerValue[RiskLevel.NOTIP] === undefined ||
          innerValue[RiskLevel.NOTIP] === null)),
    [status, innerValue]
  );

  const levelMiddleStatus = useMemo(
    () =>
      (status === 'error' && !innerValue) ||
      (innerValue &&
        RiskLevel.WARNING in innerValue &&
        (innerValue[RiskLevel.WARNING] === undefined ||
          innerValue[RiskLevel.WARNING] === null)),
    [status, innerValue]
  );

  const levelHighStatus = useMemo(
    () =>
      (status === 'error' && !innerValue) ||
      (innerValue &&
        RiskLevel.INTERCEPT in innerValue &&
        (innerValue[RiskLevel.INTERCEPT] === undefined ||
          innerValue[RiskLevel.INTERCEPT] === null)),
    [status, innerValue]
  );

  const thresholdError = useMemo(
    () => errors && errors[0] === '一级阈值<=二级阈值<=三级阈值',
    [errors]
  );

  return (
    <div className={styles.content}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={styles.item}>
          <AntdInputNumber
            {...(rest as Omit<InputNumberProps, 'value' | 'onChange'>)}
            placeholder="一级"
            suffix={undefined}
            className={
              levelLowStatus || thresholdError ? styles.customError : undefined
            }
            onChange={(val) => {
              setInnerValue((prev) => ({
                ...prev,
                [RiskLevel.NOTIP]: val as number,
              }));
              onChange &&
                onChange({
                  value: { ...innerValue, [RiskLevel.NOTIP]: val as number },
                  setType: SetType.CUSTOM,
                  defaultValue,
                });
            }}
            value={innerValue ? innerValue[RiskLevel.NOTIP] : undefined}
          />
          {/* 显示错误信息 */}
          {levelLowStatus && (
            <div className={styles.errorTip}>
              {(errors && errors[0]) || '未知错误'}
            </div>
          )}
        </div>
        <div className={styles.item}>
          <AntdInputNumber
            {...(rest as Omit<InputNumberProps, 'value' | 'onChange'>)}
            placeholder="二级"
            suffix={undefined}
            className={
              levelMiddleStatus || thresholdError
                ? styles.customError
                : undefined
            }
            onChange={(val) => {
              setInnerValue((prev) => ({
                ...prev,
                [RiskLevel.WARNING]: val as number,
              }));
              onChange &&
                onChange({
                  value: {
                    ...innerValue,
                    [RiskLevel.WARNING]: val as number,
                  },
                  setType: SetType.CUSTOM,
                  defaultValue,
                });
            }}
            value={innerValue ? innerValue[RiskLevel.WARNING] : undefined}
          />
          {/* 显示错误信息 */}
          {levelMiddleStatus && (
            <div className={styles.errorTip}>
              {(errors && errors[0]) || '未知错误'}
            </div>
          )}
        </div>
        <div className={styles.item}>
          <AntdInputNumber
            {...(rest as Omit<InputNumberProps, 'value' | 'onChange'>)}
            placeholder="三级"
            suffix={undefined}
            className={
              levelHighStatus || thresholdError ? styles.customError : undefined
            }
            onChange={(val) => {
              setInnerValue((prev) => ({
                ...prev,
                [RiskLevel.INTERCEPT]: val as number,
              }));
              onChange &&
                onChange({
                  value: {
                    ...innerValue,
                    [RiskLevel.INTERCEPT]: val as number,
                  },
                  setType: SetType.CUSTOM,
                  defaultValue,
                });
            }}
            value={innerValue ? innerValue[RiskLevel.INTERCEPT] : undefined}
          />
          {/* 显示错误信息 */}
          {levelHighStatus && (
            <div className={styles.errorTip}>
              {(errors && errors[0]) || '未知错误'}
            </div>
          )}
        </div>
        <div style={{ marginLeft: '10px' }}>{(rest as any).suffix}</div>
      </div>
      {thresholdError && (
        <div className={styles.errorTip} style={{ left: '-20px' }}>
          {(errors && errors[0]) || '未知错误'}
        </div>
      )}
    </div>
  );
};
