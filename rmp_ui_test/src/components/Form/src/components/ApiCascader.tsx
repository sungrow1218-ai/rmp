import { Cascader, CascaderProps } from 'antd';
import { useMount } from 'ahooks';
import { get, isFunction, omit } from 'lodash';
import React, { useEffect, useState } from 'react';

interface Option {
  value?: string;
  label?: string;
  loading?: boolean;
  isLeaf?: boolean;
  children?: Option[];
  [key: string]: any;
}

export interface IProps {
  value?: any[];
  api?: (arg?: any) => Promise<Option[] | Recordable>;
  numberToString?: boolean;
  resultField?: string;
  valueField?: string;
  labelField?: string;
  childrenField?: string;
  apiParamKey?: string;
  immediate?: boolean;
  initFetchFarams?: Recordable;
  isLeaf?: (arg: Recordable) => boolean;
  beforeFetch?: Fn;
  afterFetch?: Fn;
  onChange?: (v: any) => void;
}

const ApiCascader = (props: IProps) => {
  const {
    api = null,
    numberToString,
    resultField = '',
    labelField = 'label',
    valueField = 'value',
    childrenField = 'children',
    apiParamKey = 'parentCode',
    immediate = true,
    initFetchFarams = {},
    isLeaf = null,
    beforeFetch = null,
    afterFetch = null,
    ...restProps
  } = props;

  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<any[]>([]);

  useEffect(() => {
    const opts = generatorOptions(apiData);
    setOptions(opts);
  }, [apiData]);

  useMount(() => {
    immediate && fetch();
  });

  const generatorOptions = (options: any[]): Option[] => {
    return options.reduce((prev, next: Recordable) => {
      if (next) {
        const value = next[valueField];
        const item = {
          ...omit(next, [labelField, valueField]),
          label: next[labelField],
          value: numberToString ? `${value}` : value,
          isLeaf: isFunction(isLeaf) ? isLeaf(next) : false,
        };
        const children = Reflect.get(next, childrenField);
        if (children) {
          Reflect.set(item, childrenField, generatorOptions(children));
        }
        prev.push(item);
      }
      return prev;
    }, [] as Option[]);
  };

  async function fetch() {
    if (!api || !isFunction(api)) return;
    let _apiData = [];
    setLoading(true);
    try {
      let _initFetchParams = initFetchFarams;
      if (beforeFetch && isFunction(beforeFetch)) {
        _initFetchParams =
          (await beforeFetch(initFetchFarams)) || initFetchFarams;
      }
      let res = await api(_initFetchParams);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      if (Array.isArray(res)) {
        _apiData = res;
        return;
      }
      if (resultField) {
        _apiData = get(res, resultField) || [];
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setApiData(_apiData);
      setLoading(false);
    }
  }

  const loadData: CascaderProps<Recordable>['loadData'] = async (
    selectedOptions
  ) => {
    const targetOption: any = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    if (!api || !isFunction(api)) return;
    try {
      let param = {
        [apiParamKey]: Reflect.get(targetOption, 'value'),
      };
      if (beforeFetch && isFunction(beforeFetch)) {
        param = (await beforeFetch(param)) || param;
      }
      let res = await api(param);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      if (Array.isArray(res)) {
        const children = generatorOptions(res);
        targetOption.children = children;
        return;
      }
      if (resultField) {
        const children = generatorOptions(get(res, resultField) || []);
        targetOption.children = children;
      }
    } catch (error) {
      console.error(error);
    } finally {
      targetOption.loading = false;
    }
  };

  return (
    <Cascader
      options={options}
      loadData={loadData}
      loading={loading}
      {...restProps}
    />
  );
};

export default ApiCascader;
