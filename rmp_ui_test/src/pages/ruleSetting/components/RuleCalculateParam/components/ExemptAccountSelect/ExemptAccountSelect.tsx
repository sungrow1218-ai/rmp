/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable max-lines */
import React, {
  type FC,
  useState,
  useEffect,
  useMemo,
  CSSProperties,
  useContext,
} from 'react';
import { Dropdown, Empty, Input, message } from 'antd';
import {
  ExtSysItem,
  ManageAcctDTO,
  queryExternSystem,
  queryManageAccount,
  queryTradeAccount,
  SobInfo,
  type TradeAcctDTO,
} from '@/services/account';
import {
  RULE_CONTROL_DIM,
  TRADING_MARKETS,
  transformDictCodeToNameHelper,
  transformDictFeKeyToCodeHelper,
} from '@/utils/dict';
import { AcctItem } from '@/services/rule';
import { isArray, isEmpty, uniqBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import { useUpdateEffect } from 'ahooks';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import { SearchOutlined } from '@ant-design/icons';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import Highlighter from 'react-highlight-words';

interface Props {
  integrationSystemIds?: number[] | string[];
  value?: AcctItem[];
  onChange?: (value: AcctItem[]) => void;
  controlAcctType?: string;
  sobInfo?: SobInfo;
  mode: keyof typeof FORM_MODES;
  showAllOption?: boolean;
  style?: CSSProperties;
}

const ALL_OPTION = {
  label: '系统内全部账户',
  value: 'ALL',
};

export const isTradingAccount = (acctType: string) =>
  acctType ===
  transformDictFeKeyToCodeHelper('BY_TRADING_ACCOUNT', RULE_CONTROL_DIM);

export const isManageAccount = (acctType: string) =>
  acctType ===
  transformDictFeKeyToCodeHelper('BY_MANAGEMNT_ACCOUNT', RULE_CONTROL_DIM);

const ExemptAccountSelect: FC<Props> = ({
  integrationSystemIds = [],
  value = [],
  onChange,
  sobInfo,
  controlAcctType,
  mode,
  showAllOption = false,
  style = {},
}) => {
  const [accountList, setAccountList] = useState<
    (TradeAcctDTO | ManageAcctDTO)[]
  >([]);

  const disabled = useContext(DisabledContext);

  const [extSystems, setExtSystems] = useState<ExtSysItem[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (!sobInfo || !sobInfo.sobId) {
          return;
        }
        const response = await queryExternSystem({
          pageId: 1,
          pageSize: 5000,
          authFlag: mode === 'PREVIEW' ? 0 : 1,
          filterCondition: { sobId: sobInfo.sobId },
        });
        if (response.code !== 0) {
          message.error(`查询对接系统失败 ${response.message}`);
        }
        setExtSystems(response.data.resultList);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOptions();
  }, [sobInfo?.sobId]);

  // 对接系统
  const getExtSystemMap: Recordable = useMemo(() => {
    return extSystems.reduce(
      (prev, cur) => ({ ...prev, [cur.extSysId]: cur.extSysName }),
      {}
    );
  }, [extSystems]);

  // 选项数据
  const optionsFromData = useMemo(() => {
    if (!controlAcctType) return [];
    let options: { label: string; value: string; disabled?: boolean }[] = [];
    const [, acctType] = controlAcctType.split('|');
    if (isTradingAccount(acctType)) {
      options = accountList.map((item) => {
        const { bookLevel, extSysId, marketId, acctCode, acctName } =
          item as TradeAcctDTO;
        return {
          label: `${transformDictCodeToNameHelper(
            String(marketId),
            TRADING_MARKETS
          )} ${acctCode} ${acctName} ${getExtSystemMap[extSysId] || '--'}`,
          value: `${bookLevel}|${extSysId}|${marketId}|${acctCode}`,
        };
      });
    } else if (isManageAccount(acctType)) {
      options = accountList.map((item) => {
        const { bookLevel, extSysId, acctCode, acctName } =
          item as ManageAcctDTO;
        return {
          label: `${acctCode} ${acctName} ${getExtSystemMap[extSysId] || '--'}`,
          value: `${bookLevel}|${extSysId}|${acctCode}`,
        };
      });
    }
    if (options.length === 0) return options;
    // 权限-1项
    if (showAllOption) {
      // 选中-1的情况
      if (value && value.some((v) => `${v.accountCode}` === '-1')) {
        return [ALL_OPTION, ...options.map((i) => ({ ...i, disabled: true }))];
      }
      return [ALL_OPTION, ...options];
    } else {
      return options;
    }
  }, [accountList, controlAcctType, getExtSystemMap, value, showAllOption]);

  // 修改账户控制类型，清空选择账户（通过useUpdateEffect规避回显问题）
  useUpdateEffect(() => {
    if (value && value.length > 0) {
      onChange && onChange([]);
    }
  }, [controlAcctType]);

  // 全选值
  const getAllValues = () => {
    if (!controlAcctType) return [];
    const [bookLevel, _] = controlAcctType.split('|');
    return integrationSystemIds.map((i) => `${bookLevel}|${i}|-1|-1`);
  };

  // 从字符串转对象
  const parseOptionValue = (original: string[]) => {
    const [, acctType] = controlAcctType!.split('|');
    if (isTradingAccount(acctType)) {
      return original.map((i) => {
        const [bookLevel, extSysId, marketId, accountCode] = i.split('|');
        return {
          bookLevel: Number(bookLevel),
          extSysId: Number(extSysId),
          marketId: Number(marketId),
          accountCode,
        };
      });
    } else if (isManageAccount(acctType)) {
      return original.map((i) => {
        const [bookLevel, extSysId, accountCode] = i.split('|');
        return {
          bookLevel: Number(bookLevel),
          extSysId: Number(extSysId),
          accountCode,
        };
      });
    }
    return [];
  };

  useEffect(() => {
    async function fetchIntegrationSystemList() {
      // 无选中对接系统
      if (integrationSystemIds.length === 0) {
        setAccountList([]);
        return;
      }
      // 无选中控制账户类型
      if (!controlAcctType) return;
      // sobInfo为空
      if (!sobInfo || isEmpty(sobInfo)) return;
      try {
        const [bookLevel, acctType] = controlAcctType.split('|');
        if (isManageAccount(acctType)) {
          const response = await queryManageAccount({
            pageId: 1,
            pageSize: 10000,
            authFlag: mode === 'PREVIEW' ? 0 : 1,
            filterCondition: {
              sobId: sobInfo.sobId,
              bookLevel: Number(bookLevel),
              extSysId: integrationSystemIds.map((i) => Number(i)),
            },
          });
          if (response.code !== 0) {
            throw new Error('获取管理账户列表失败');
          }
          if (
            response.data &&
            isArray(response?.data?.resultList) &&
            response?.data?.resultList.length > 0
          ) {
            const list = response?.data?.resultList.map((p) => {
              return {
                ...p,
                key: uuidv4(),
                uniqById: `${p.bookLevel}|${p.extSysId}|${p.acctCode}`,
              };
            });
            setAccountList(uniqBy(list, 'uniqById'));
          } else {
            setAccountList([]);
          }
        } else if (isTradingAccount(acctType)) {
          const response = await queryTradeAccount({
            pageId: 1,
            pageSize: 10000,
            authFlag: mode === 'PREVIEW' ? 0 : 1,
            filterCondition: {
              sobId: sobInfo.sobId,
              bookLevel: Number(bookLevel),
              extSysId: integrationSystemIds.map((i) => Number(i)),
            },
          });
          if (response.code !== 0) {
            throw new Error('获取交易账户列表失败');
          }
          // 加唯一key
          if (
            response.data &&
            isArray(response?.data?.resultList) &&
            response?.data?.resultList.length > 0
          ) {
            const list = response?.data?.resultList.map((p) => {
              return {
                ...p,
                key: uuidv4(),
                uniqById: `${p.bookLevel}|${p.extSysId}|${p.marketId}|${p.acctCode}`,
              };
            });
            setAccountList(uniqBy(list, 'uniqById'));
          } else {
            setAccountList([]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchIntegrationSystemList();
  }, [integrationSystemIds, controlAcctType, sobInfo]);

  // 修改对接系统，过滤选择账户
  useEffect(() => {
    if (value && value.length > 0) {
      // 全选特殊项-1
      if (showAllOption && value.some((v) => `${v.accountCode}` === '-1')) {
        onChange && onChange(parseOptionValue(getAllValues()));
      } else {
        onChange &&
          onChange(
            value.filter((i) =>
              integrationSystemIds.includes(i.extSysId as never)
            )
          );
      }
    }
  }, [integrationSystemIds, showAllOption]);

  const realValues = useMemo(() => {
    if (value && value.length > 0) {
      // 全选特殊项-1
      if (showAllOption && value.some((v) => `${v.accountCode}` === '-1')) {
        return [ALL_OPTION.value];
      } else {
        return value.map((i) => {
          const { bookLevel, extSysId, marketId, accountCode } = i;
          if (marketId) {
            return `${bookLevel}|${extSysId}|${marketId}|${accountCode}`;
          } else {
            return `${bookLevel}|${extSysId}|${accountCode}`;
          }
        });
      }
    } else {
      return [];
    }
  }, [value]);

  const renderSelect = () => (
    <MultipleSelect
      options={optionsFromData}
      onChange={(values: string[]) => {
        // 全选特殊项-1
        if (showAllOption && values.includes(ALL_OPTION.value)) {
          onChange && onChange(parseOptionValue(getAllValues()));
        } else {
          onChange && onChange(parseOptionValue(values));
        }
      }}
      showPopup={disabled}
      value={realValues}
      filterOption={(inputValue, option) => {
        if (option) {
          if (option.value === ALL_OPTION.value) return false;
          return (option.label as string).includes(inputValue);
        } else {
          return false;
        }
      }}
      afterSort={(options) => {
        const allIndex = options.findIndex((i) => i.value === ALL_OPTION.value);
        if (allIndex > -1) {
          const tmp = { ...options[allIndex] };
          return [tmp, ...options.filter((i) => i.value !== ALL_OPTION.value)];
        } else {
          return options;
        }
      }}
      onListClick={(e) => {
        if (
          value &&
          value.some((v) => `${v.accountCode}` === '-1') &&
          !((e.target as any).innerHTML as string).includes('系统内全部账户')
        ) {
          message.error('该选项为互斥选项，请先取消系统内全部账户');
        }
      }}
      afterSelectAll={(selected) =>
        selected.filter((i: any) => i !== ALL_OPTION.value)
      }
      customBtnDisabled={(selected, filters) => {
        if (
          selected.find((i) => i.value === ALL_OPTION.value) ||
          filters.length === 0
        ) {
          return true;
        } else {
          return false;
        }
      }}
      style={style}
    />
  );

  // 静态展示
  const [keyword, setKeyword] = useState<string>();

  // 过滤选中(优化性能)
  const getRealValuesOptions = useMemo(
    () => optionsFromData.filter((i) => realValues.includes(i.value)),
    [realValues, optionsFromData]
  );

  // 搜索过滤
  const getFilterOptions = useMemo(() => {
    if (keyword) {
      return getRealValuesOptions.filter((i) => i.label.includes(keyword));
    } else {
      return getRealValuesOptions;
    }
  }, [getRealValuesOptions, keyword]);

  const renderOptionItem = (item: { label: string; value: string }) => (
    <div
      aria-selected="false"
      className="disabled-dropdown-option-item"
      title={item.label}
      key={item.value}
    >
      <Highlighter
        searchWords={[keyword as string]}
        textToHighlight={item.label}
        highlightStyle={{ color: '#1890ff', background: 'transparent' }}
      />
    </div>
  );

  if (disabled) {
    return (
      <Dropdown
        onOpenChange={() => setKeyword('')}
        popupRender={() => (
          <div
            className="disabled-dropdown"
            style={{ width: style.width || '240px' }}
          >
            {getRealValuesOptions.length >= 2 ? (
              <div>
                <Input
                  value={keyword}
                  placeholder="请输入"
                  style={{ width: '100%' }}
                  disabled={false}
                  onChange={(e) => setKeyword(e.target.value)}
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
                  getFilterOptions.map((item) => renderOptionItem(item))
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

export default ExemptAccountSelect;
