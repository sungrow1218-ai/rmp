import { Radio, RadioGroupProps } from 'antd';
import { useMount } from 'ahooks';
import { get, isFunction, omit } from 'lodash';
import React, { useMemo, useState } from 'react';

interface OptionItem {
  label?: string;
  value?: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface IProps extends RadioGroupProps {
  api?: (arg?: any) => Promise<OptionItem[] | Recordable>;
  params?: Recordable;
  value?: string | number;
  isBtn?: boolean;
  numberToString?: boolean;
  labelField?: string;
  valueField?: string;
  resultField?: string;
  immediate?: boolean;
  beforeFetch?: Fn;
  afterFetch?: Fn;
}

const ApiRadioGroup = (props: IProps) => {
  const {
    api = null,
    params = {},
    isBtn = false,
    numberToString = false,
    labelField = 'label',
    valueField = 'value',
    resultField = '',
    immediate = true,
    beforeFetch = null,
    afterFetch = null,
    ...restProps
  } = props;

  const [options, setOptions] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(false);

  useMount(() => {
    immediate && fetch();
  });

  const getOptions = useMemo(() => {
    return options.reduce((prev, next: any) => {
      if (next) {
        const value = next[valueField];
        prev.push({
          label: next[labelField],
          value: numberToString ? `${value}` : value,
          ...omit(next, [labelField, valueField]),
        });
      }
      return prev;
    }, [] as OptionItem[]);
  }, [options, labelField, numberToString, valueField]);

  async function fetch() {
    if (!api || !isFunction(api)) return;
    let _options = [];
    setLoading(true);
    try {
      let _params = params;
      if (beforeFetch && isFunction(beforeFetch)) {
        _params = (await beforeFetch(params)) || params;
      }
      let res = await api(_params);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      if (Array.isArray(res)) {
        _options = res;
        return;
      }
      if (resultField) {
        _options = get(res, resultField) || [];
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setOptions(_options);
      setLoading(false);
    }
  }

  return (
    <Radio.Group {...restProps}>
      {getOptions.map((item) => {
        if (isBtn) {
          return (
            <Radio.Button value={item.value} disabled={item.disabled}>
              {item.label}
            </Radio.Button>
          );
        } else {
          return (
            <Radio value={item.value} disabled={item.disabled}>
              {item.label}
            </Radio>
          );
        }
      })}
    </Radio.Group>
  );
};

export default ApiRadioGroup;
