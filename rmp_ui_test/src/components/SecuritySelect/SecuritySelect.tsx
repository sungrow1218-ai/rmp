// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import { querySecurity } from '@/services/securityInfo';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import { Empty, Spin } from '@ht/sprite-ui';
import { useGetState } from 'ahooks';
import { cloneDeep, debounce } from 'lodash';
import React, {
  CSSProperties,
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
} from 'react';
import MultipleSelect from '../MultipleSelectRebuild';
import './style.less';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import { Dropdown, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

interface IProps {
  value?: { securityCode: string; marketId: number }[];
  onChange?: (value: { securityCode: string; marketId: number }[]) => void;
  securityType?: string[] | number[];
  style?: CSSProperties;
}

interface OptionItem {
  label: string;
  value: string;
  selected?: boolean;
}

const SecuritySelect: FC<IProps> = ({
  onChange,
  value = [],
  securityType,
  style = { width: '100%' },
}) => {
  const [options, setOptions, getOptions] = useGetState<OptionItem[]>([]);
  const [keyword, setKeyword] = useState<string>();
  const [loading, setLoading] = useState(false);
  const firstLoaded = useRef(true);
  const optionsRef = useRef<any>(null);
  const scrollTop = useRef(0);

  const disabled = useContext(DisabledContext);

  useEffect(() => {
    const fetchDefaultOptions = async () => {
      setLoading(true);
      try {
        const {
          data: { resultList = [] },
          code,
        } = await querySecurity({
          pageId: 1,
          pageSize: 1000,
          filterCondition:
            securityType && securityType.length > 0
              ? {
                  securityList: value || [],
                  securityType,
                }
              : { securityList: value || [] },
        });
        if (code !== 0) {
          throw Error('证券列表获取失败');
        }
        setOptions(
          resultList.map((i) => ({
            label: `${i.securityCode} ${
              i.securityName
            } ${transformDictCodeToNameHelper(
              `${i.marketId}`,
              TRADING_MARKETS
            )}`,
            // securityCode + marketId 唯一确定
            value: `${i.securityCode}|${i.marketId}`,
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        fetch();
      }
    };
    if (!firstLoaded.current) {
      return;
    }
    // 获取默认
    if (value && value.length > 0) {
      fetchDefaultOptions();
    } else {
      fetch();
    }
    firstLoaded.current = false;
  }, [value]);

  const fetch = async (search?: string) => {
    setLoading(true);
    try {
      const {
        data: { resultList = [] },
        code,
      } = await querySecurity({
        pageId: 1,
        pageSize: 1000,
        filterCondition:
          securityType && securityType.length > 0
            ? {
                securityCode: search,
                securityType,
              }
            : { securityCode: search },
      });
      if (code !== 0) {
        throw Error('证券列表获取失败');
      }
      const resOptions = resultList.map((i) => ({
        label: `${i.securityCode} ${
          i.securityName
        } ${transformDictCodeToNameHelper(`${i.marketId}`, TRADING_MARKETS)}`,
        // securityCode + marketId 唯一确定
        value: `${i.securityCode}|${i.marketId}`,
      }));
      // 已选中的保留
      const selected: OptionItem[] = [];
      if (value && value.length !== 0) {
        for (const { securityCode, marketId } of value) {
          const option = getOptions().find(
            (i) => i.value === `${securityCode}|${marketId}`
          );
          if (option) {
            selected.push(option);
          }
        }
      }
      const filterOptions = [...selected];
      const selectedValues = selected.map((i) => i.value);
      for (const item of resOptions) {
        if (!selectedValues.includes(item.value)) {
          filterOptions.push(item);
        }
      }
      setOptions(filterOptions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (securityType && securityType.length === 0) {
      onChange && onChange([]);
    }
    fetch(keyword);
  }, [securityType]);

  const handleSearch = debounce(async (search: string) => {
    await fetch(search);
    if (optionsRef.current) {
      scrollTop.current = 0;
      optionsRef.current.scrollTop = 0;
    }
  }, 200);

  useEffect(() => {
    handleSearch(keyword!);
  }, [keyword]);

  const realValue = useMemo(() => {
    if (!value || value.length === 0) {
      return [];
    }
    const selected: string[] = [];
    for (const { securityCode, marketId } of value) {
      const option = options.find(
        (i) => i.value === `${securityCode}|${marketId}`
      );
      if (option) {
        selected.push(option.value);
      }
    }
    return selected;
  }, [value, options]);

  const viewOptions = useMemo<OptionItem[]>(() => {
    const cloneOptions = cloneDeep(options);
    const selected: OptionItem[] = [];
    const notSelected: OptionItem[] = [];
    for (const item of cloneOptions) {
      if (realValue.includes(item.value)) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      if (keyword) {
        if (item.value.includes(keyword)) {
          if (item.selected) {
            selected.push(item);
          } else {
            notSelected.push(item);
          }
        }
      } else if (item.selected) {
        selected.push(item);
      } else {
        notSelected.push(item);
      }
    }
    return [...selected, ...notSelected];
  }, [options, realValue, keyword]);

  const renderDropOptions = (options: OptionItem[]) => (
    <div
      className="security-select-dropdown"
      style={{ maxHeight: 256, overflow: 'auto' }}
      onScroll={(e: any) => (scrollTop.current = e.target.scrollTop)}
      ref={(el) => (optionsRef.current = el)}
    >
      {options.length === 0 ? (
        <Empty image={NoDataSimpleSvg} description={'暂无数据'} />
      ) : (
        <>
          {options.map((item) => {
            if (item.selected) {
              return renderSelectedOptionItem(item);
            } else {
              return renderOptionItem(item);
            }
          })}
        </>
      )}
    </div>
  );

  const handleSelect = (selected: boolean, item: OptionItem) => {
    if (selected) {
      onChange &&
        onChange(
          [...realValue, item.value].map((i) => {
            const [securityCode, marketId] = i.split('|');
            return { securityCode, marketId: Number(marketId) };
          })
        );
    } else {
      onChange &&
        onChange(
          [...realValue.filter((i) => i !== item.value)].map((i) => {
            const [securityCode, marketId] = i.split('|');
            return { securityCode, marketId: Number(marketId) };
          })
        );
    }
  };

  const renderSelectedOptionItem = (item: OptionItem) => (
    <div
      aria-selected="true"
      className="riskControlPlatformAntd-select-item riskControlPlatformAntd-select-item-option riskControlPlatformAntd-select-item-option-selected custom-option"
      title={item.label}
      onClick={() => handleSelect(false, item)}
      key={item.value}
    >
      <div className="riskControlPlatformAntd-select-item-option-content">
        {item.label}
      </div>
      <span
        className="riskControlPlatformAntd-select-item-option-state"
        unselectable="on"
        aria-hidden="true"
        style={{ userSelect: 'none' }}
      >
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

  const renderOptionItem = (item: OptionItem) => (
    <div
      aria-selected="false"
      className="riskControlPlatformAntd-select-item riskControlPlatformAntd-select-item-option custom-option"
      title={item.label}
      onClick={() => handleSelect(true, item)}
      key={item.value}
    >
      <div className="riskControlPlatformAntd-select-item-option-content">
        {item.label}
      </div>
    </div>
  );

  useEffect(() => {
    if (optionsRef.current) {
      optionsRef.current.scrollTop = scrollTop.current || 0;
    }
  }, [viewOptions]);

  const renderSelect = () => (
    <MultipleSelect
      options={options}
      value={realValue}
      searchValue={keyword}
      onSearch={(search) => setKeyword(search)}
      onClear={() => setKeyword('')}
      showPopup={disabled}
      onDropdownVisibleChange={(open) => {
        if (!open) {
          setKeyword('');
          scrollTop.current = 0;
        }
      }}
      placeholder={'请输入证券代码进行搜索'}
      onChange={(values: string[]) => {
        onChange &&
          onChange(
            values.map((i) => {
              const [securityCode, marketId] = i.split('|');
              return { securityCode, marketId: Number(marketId) };
            })
          );
      }}
      dropdownRender={() => {
        if (loading) {
          return <Spin>{renderDropOptions(viewOptions)}</Spin>;
        } else {
          return renderDropOptions(viewOptions);
        }
      }}
      style={style}
    />
  );

  // 静态展示
  const [searchKeyword, setSearchKeyword] = useState<string>();

  // 过滤选中(优化性能)
  const getRealValuesOptions = useMemo(
    () => options.filter((i) => realValue.includes(i.value)),
    [realValue, options]
  );

  // 搜索过滤
  const getFilterOptions = useMemo(() => {
    if (searchKeyword) {
      return getRealValuesOptions.filter((i) =>
        i.label.includes(searchKeyword)
      );
    } else {
      return getRealValuesOptions;
    }
  }, [getRealValuesOptions, searchKeyword]);

  const renderViewOptionItem = (item: { label: string; value: string }) => (
    <div
      aria-selected="false"
      className="disabled-dropdown-option-item"
      title={item.label}
      key={item.value}
    >
      <Highlighter
        searchWords={[searchKeyword as string]}
        textToHighlight={item.label}
        highlightStyle={{ color: '#bb744a', background: 'transparent' }}
      />
    </div>
  );

  if (disabled) {
    return (
      <Dropdown
        onOpenChange={() => setSearchKeyword('')}
        popupRender={() => (
          <div
            className="disabled-dropdown"
            style={{ width: style.width || '240px' }}
          >
            {getRealValuesOptions.length >= 2 ? (
              <div>
                <Input
                  value={searchKeyword}
                  placeholder="请输入"
                  style={{ width: '100%' }}
                  disabled={false}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  suffix={<SearchOutlined />}
                  allowClear={true}
                />
              </div>
            ) : null}
            <div>
              <div style={{ maxHeight: 256, overflow: 'auto' }}>
                {getFilterOptions.length === 0 ? (
                  <Empty
                    style={{ margin: '16px 0' }}
                    image={NoDataSimpleSvg}
                    description={'暂无数据'}
                  />
                ) : (
                  getFilterOptions.map((item) => renderViewOptionItem(item))
                )}
              </div>
            </div>
          </div>
        )}
      >
        {renderSelect()}
      </Dropdown>
    );
  } else {
    return renderSelect();
  }
};

export default SecuritySelect;
