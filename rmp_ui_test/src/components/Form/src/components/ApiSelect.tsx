import { LoadingOutlined } from '@ant-design/icons';
import { useCreation, useGetState } from 'ahooks';
import { Select, SelectProps } from 'antd';
import {
  cloneDeep,
  debounce,
  get,
  isEqual,
  isFunction,
  merge,
  omit,
} from 'lodash-es';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

type OptionsItem = {
  label?: string;
  value?: string;
  disabled?: boolean;
  [name: string]: any;
};

export interface IProps extends Omit<SelectProps, 'options'> {
  numberToString?: boolean;
  api?: (arg?: any) => Promise<OptionsItem[] | Recordable[]>;
  params?: any;
  resultField?: string;
  labelField?: string;
  valueField?: string;
  immediate?: boolean;
  alwaysLoad?: boolean;
  options?: OptionsItem[];
  beforeFetch?: Fn;
  afterFetch?: Fn;
  style?: CSSProperties;
  searchKey?: string;
}

const ApiSelect = (props: IProps) => {
  const {
    numberToString,
    api = null,
    params = {},
    resultField = '',
    labelField = 'label',
    valueField = 'value',
    immediate = true,
    alwaysLoad = false,
    options = [],
    beforeFetch = null,
    afterFetch = null,
    showSearch = false,
    filterOption = true,
    searchKey = null,
    ...restProps
  } = props;

  const [tempOptions, setTempOptions] = useState<OptionsItem[]>([]);
  const isFirstLoaded = useRef(false);
  const [loading, setLoding, getLoading] = useGetState(false);

  const optionsData = useCreation(() => {
    const data = tempOptions.reduce((prev, next: any) => {
      if (next) {
        const value = get(next, valueField);
        prev.push({
          ...omit(next, [labelField, valueField]),
          label: get(next, labelField),
          value: numberToString ? `${value}` : value,
        });
      }
      return prev;
    }, [] as OptionsItem[]);
    return data.length > 0 ? data : options;
  }, [tempOptions]);

  const cacheParams = useRef<any>(null);
  useEffect(() => {
    if (immediate && !isEqual(cacheParams.current, params)) {
      fetch();
      cacheParams.current = cloneDeep(params);
    }
  }, [immediate, params]);

  const handleFetch = async (visible: boolean) => {
    if (visible) {
      if (alwaysLoad) {
        await fetch();
      } else if (!immediate && !isFirstLoaded.current) {
        await fetch();
      }
    }
  };

  const handleSearch = async (value: string) => {
    if (showSearch && searchKey && !filterOption) {
      await fetch({ [searchKey]: value });
    }
    // 外部处理行为
    if (props.onSearch) {
      props.onSearch(value);
    }
  };

  async function fetch(opt?: Recordable) {
    if (!api || !isFunction(api) || getLoading()) {
      return;
    }
    let _tempOptions: OptionsItem[] = [];
    let _params = opt ? merge({}, params, opt) : params;
    try {
      setLoding(true);
      if (beforeFetch && isFunction(beforeFetch)) {
        _params = (await beforeFetch(params)) || params;
      }
      let res = await api(_params);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      isFirstLoaded.current = true;
      if (Array.isArray(res)) {
        _tempOptions = res;
        return;
      } else if (resultField) {
        _tempOptions = get(res, resultField) || [];
      }
    } catch (error) {
      console.warn(error);
      // reset status
      isFirstLoaded.current = false;
    } finally {
      setTempOptions(_tempOptions);
      setLoding(false);
    }
  }
  const loadingProps = useCreation((): SelectProps => {
    if (loading) {
      return {
        suffixIcon: <LoadingOutlined spin={true} />,
        notFoundContent: (
          <span>
            <LoadingOutlined spin={true} className="mr-1" />
            请等待数据加载完成...
          </span>
        ),
      };
    }
    return {};
  }, [loading]);
  return (
    <Select
      onDropdownVisibleChange={handleFetch}
      options={optionsData as any}
      {...(showSearch ? { onSearch: debounce(handleSearch, 500) } : {})}
      {...loadingProps}
      {...restProps}
    />
  );
};

export default ApiSelect;
