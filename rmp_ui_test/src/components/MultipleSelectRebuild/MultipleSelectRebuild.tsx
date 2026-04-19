// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  CSSProperties,
  MouseEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from 'react';
import {
  Divider,
  Popover,
  Select,
  SelectProps,
  Button,
  ConfigProvider,
  Dropdown,
} from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import styles from './styles.less';
import { useGetState } from 'ahooks';
import { cloneDeep, get, isArray, isEqual, isFunction, merge } from 'lodash-es';
import { FilterFunc } from 'rc-select/lib/Select';
import { CloseOutlined } from '@ant-design/icons';

type OptionItem<T = any> = {
  label: string;
  value: T;
  disabled?: boolean;
  [name: string]: any;
};

export interface IProps extends Omit<SelectProps, 'options'> {
  options?: OptionItem[];
  value?: string[] | number[];
  onChange?: ((value: string[]) => void) | ((value: number[]) => void);
  api?: (arg?: any) => Promise<any>;
  params?: Recordable;
  resultField?: string;
  labelField?: string;
  valueField?: string;
  immediate?: boolean;
  alwaysLoad?: boolean;
  beforeFetch?: Fn;
  afterFetch?: Fn;
  style?: CSSProperties;
  searchKey?: string;
  afterSelectAll?: Fn;
  afterSort?: (options: OptionItem[]) => OptionItem[];
  onListClick?: (e: MouseEvent) => void;
  showPopup?: boolean;
  customBtnDisabled?: (
    selected: OptionItem[],
    filterOptions: OptionItem[]
  ) => boolean;
  showDisabledDropdown?: boolean;
}

const MultipleSelect: FC<IProps> = (props) => {
  const {
    api,
    params = {},
    resultField = '',
    labelField = 'label',
    valueField = 'value',
    immediate = true,
    alwaysLoad = false,
    beforeFetch,
    afterFetch,
    showSearch = true,
    filterOption = (inputValue, option) => {
      if (option) {
        return (option.label as string).includes(inputValue);
      } else {
        return false;
      }
    },
    value = [],
    onChange,
    afterSelectAll,
    onListClick,
    afterSort,
    onSearch,
    customBtnDisabled,
    showDisabledDropdown = false,
    ...restProps
  } = props;

  const [tempOptions, setTempOptions] = useState<OptionItem[]>([]);
  const isFirstLoaded = useRef(false);
  const [loading, setLoding, getLoading] = useGetState(false);
  const [keyword, setKeyword] = useState('');

  const [open, setOpen] = useState(false);

  const disabled = useContext(DisabledContext);

  const getOptions = useMemo(
    () => props.options || tempOptions,
    [props.options, tempOptions]
  );

  const selectedValues = useMemo(() => {
    if (!value || value.length === 0 || !isArray(value)) {
      return [] as OptionItem[];
    }
    return value.map((key) => {
      const option = getOptions.find((i) => i.value === key);
      return option || { label: `${key}`, value: key };
    });
  }, [value, getOptions]);

  // 排序后选项
  const getSortOptions = useMemo(() => {
    const selected: OptionItem[] = [];
    const notSelected: OptionItem[] = [];
    for (const item of getOptions) {
      if (((value || []) as any).includes(item.value)) {
        selected.push(item);
      } else {
        notSelected.push(item);
      }
    }
    let result = [...selected, ...notSelected];
    if (afterSort && isFunction(afterSort)) {
      result = afterSort(result);
    }
    return result;
  }, [getOptions, value]);

  const fetch = async (opt?: Recordable) => {
    if (!api || !isFunction(api) || getLoading()) {
      return;
    }
    let _tempOptions: OptionItem[] = [];
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
      const isArrayResult = Array.isArray(res);
      const _list: Recordable[] = isArrayResult ? res : get(res, resultField);
      _tempOptions = _list.map((i) => ({
        ...i,
        label: get(i, labelField),
        value: get(i, valueField),
      }));
    } catch (error) {
      console.warn(error);
      // reset status
      isFirstLoaded.current = false;
    } finally {
      setTempOptions(_tempOptions);
      setLoding(false);
    }
  };

  // 缓存参数
  const cacheParams = useRef<any>(null);

  useEffect(() => {
    if (immediate && !isEqual(cacheParams.current, params)) {
      fetch();
      cacheParams.current = cloneDeep(params);
    }
  }, [immediate, params]);

  const renderPopoverContent = useMemo(
    () => (
      <div className={styles.previewContent}>
        {selectedValues.map((i, index: number) => (
          <div className={styles.item} key={index}>
            <div className={styles.text}>{i.label}</div>
            {!disabled && (
              <CloseOutlined
                onClick={() => {
                  const list = selectedValues.filter(
                    (o) => o.value !== i.value
                  );
                  onChange && onChange(list.map((o) => o.value));
                }}
                style={{
                  marginLeft: '4px',
                  fontSize: '10px',
                  cursor: 'pointer',
                }}
              />
            )}
          </div>
        ))}
      </div>
    ),
    [selectedValues]
  );

  // 过滤后的option
  const filterOptions = useMemo(() => {
    if (keyword) {
      const result = getOptions.filter((i) =>
        (filterOption as FilterFunc<any>)(keyword, i)
      );
      return result;
    } else {
      return getOptions;
    }
  }, [keyword, getOptions, filterOption]);

  // 全选操作
  const handleSelectAll = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    let selected = selectedValues.map((i) => i.value);
    for (const item of filterOptions) {
      if (!selected.includes(item.value)) {
        selected.push(item.value);
      }
    }
    if (afterSelectAll && isFunction(afterSelectAll)) {
      selected = (await afterSelectAll(selected)) || selected;
    }
    onChange && onChange(selected);
    setKeyword('');
  };

  // 全不选
  const handleSelectNone = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const selected = selectedValues.map((i) => i.value);
    for (const item of filterOptions) {
      const index = selected.findIndex((i) => i === item.value);
      if (index > -1) {
        selected.splice(index, 1);
      }
    }
    onChange && onChange(selected);
    setKeyword('');
  };

  // 全选/全不选-按钮状态
  const getBtnDisabled = useMemo(() => {
    if (customBtnDisabled && isFunction(customBtnDisabled)) {
      return customBtnDisabled(selectedValues, filterOptions);
    }
    return filterOptions.length === 0 || filterOptions.every((i) => i.disabled);
  }, [filterOptions]);

  // 搜索处理
  const handleSearch = (key: string) => {
    if (onSearch) {
      onSearch(key);
    }
    setKeyword(key);
  };

  const getProps = useMemo(() => {
    const defaultProps: SelectProps = {
      mode: 'multiple',
      labelInValue: true,
      placeholder: '请选择',
      maxTagCount: 'responsive',
      autoClearSearchValue: false,
      style: { width: '100%' },
      allowClear: true,
      onSearch: handleSearch,
      onChange: (values: OptionItem[] = []) => {
        onChange && onChange(values.map((i) => i.value));
      },
      onDropdownVisibleChange: async (visible: boolean) => {
        if (visible) {
          if (alwaysLoad) {
            await fetch();
          } else if (!immediate && !isFirstLoaded.current) {
            await fetch();
          }
        } else {
          setKeyword('');
        }
      },
      showSearch,
      disabled,
      searchValue: keyword,
      filterOption: onSearch ? false : filterOption,
      dropdownRender: onSearch
        ? undefined
        : (menu) => (
            <>
              <div onClick={(e) => onListClick && onListClick(e)}>{menu}</div>
              <Divider style={{ margin: '8px 0' }} />
              <div
                style={{
                  padding: '0 8px 4px',
                  display: 'flex',
                  flexDirection: 'row-reverse',
                }}
              >
                <Button
                  size="small"
                  style={{ marginLeft: '8px' }}
                  onClick={handleSelectNone}
                  disabled={getBtnDisabled}
                >
                  全不选
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={handleSelectAll}
                  disabled={getBtnDisabled}
                >
                  全选
                </Button>
              </div>
            </>
          ),
    };
    return {
      ...defaultProps,
      ...restProps,
      value: selectedValues,
      options: getSortOptions,
      showDisabledDropdown,
      loading,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    restProps,
    selectedValues,
    getSortOptions,
    loading,
    alwaysLoad,
    immediate,
    showSearch,
    keyword,
    disabled,
    showDisabledDropdown,
  ]);

  useEffect(() => {
    if (value && value.length === 0) {
      setOpen(false);
    }
  }, [value]);

  const renderViewOptionItem = (item: { label: string; value: string }) => (
    <div
      aria-selected="false"
      className="disabled-dropdown-option-item"
      title={item.label}
      key={item.value}
    >
      {item.label}
    </div>
  );

  const renderViewOptionSelectedItem = (item: {
    label: string;
    value: string;
  }) => (
    <div
      aria-selected="false"
      className="disabled-dropdown-option-item disabled-dropdown-option-selected-item"
      title={item.label}
      key={item.value}
    >
      <div>{item.label}</div>
      <span unselectable="on" aria-hidden="true" style={{ userSelect: 'none' }}>
        <span role="img" aria-label="check" className="anticon anticon-check">
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="check"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
          </svg>
        </span>
      </span>
    </div>
  );

  return (
    <ConfigProvider getPopupContainer={() => document.body}>
      {getProps.showDisabledDropdown && getProps.disabled ? (
        <Dropdown
          popupRender={() => (
            <div
              className="disabled-dropdown"
              style={{ width: getProps.style?.width || '240px' }}
            >
              {getSortOptions.map((i) => {
                if (selectedValues.find((j) => j.value === i.value)) {
                  return renderViewOptionSelectedItem(i);
                } else {
                  return renderViewOptionItem(i);
                }
              })}
            </div>
          )}
        >
          <Select {...getProps} />
        </Dropdown>
      ) : (
        <Popover
          content={renderPopoverContent}
          placement="topRight"
          getPopupContainer={() => document.body}
          open={getProps.showPopup ? false : open}
          onOpenChange={(state) => {
            if (value && value.length > 0) {
              setOpen(state);
            } else {
              setOpen(false);
            }
          }}
        >
          <Select {...getProps} />
        </Popover>
      )}
    </ConfigProvider>
  );
};

export default MultipleSelect;
