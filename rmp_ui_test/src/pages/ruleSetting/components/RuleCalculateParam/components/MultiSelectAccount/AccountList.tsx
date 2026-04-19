// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { type FC, useState, useEffect, useMemo } from 'react';
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
import { isArray } from 'lodash';
import { RolePermissonProps } from '@/pages/roleManage/contant/typing';
import useExyInfo from '@/hooks/useExyInfo';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import MultipleSelect from '@/components/MultipleSelectRebuild';

interface Props {
  mode: keyof typeof FORM_MODES;
  integrationSystemIds: number[];
  value?: any[];
  onChange?: (value: RolePermissonProps[]) => void;
  controlAcctType?: string;
  sobInfo?: SobInfo;
  extSystems: ExtSysItem[];
  controlAcctList?: AcctItem[];
  isEys?: boolean;
}

interface ItemProps {
  label: string;
  value: string;
}

const filterCommonObjects = (allList: any[], fList: any[]) => {
  const bMap = new Map();
  // 系统内全部账户-1的特殊情况
  if (fList.some((i) => i.accountCode === '-1')) {
    return allList;
  }
  // 其他
  for (const item of fList) {
    let key = '';
    if ('marketId' in item) {
      key = `${item.bookLevel}|${item.extSysId}|${item.accountCode}|${item.marketId}`;
    } else {
      key = `${item.bookLevel}|${item.extSysId}|${item.accountCode}`;
    }
    bMap.set(key, true);
  }

  return allList.filter((item) => {
    let keya = '';
    if ('marketId' in item) {
      keya = `${item.bookLevel}|${item.extSysId}|${item.acctCode}|${item.marketId}`;
    } else {
      keya = `${item.bookLevel}|${item.extSysId}|${item.acctCode}`;
    }
    return bMap.has(keya);
  });
};

const isTradingAccount = (acctType: string) =>
  acctType ===
  transformDictFeKeyToCodeHelper('BY_TRADING_ACCOUNT', RULE_CONTROL_DIM);

const isManageAccount = (acctType: string) =>
  acctType ===
  transformDictFeKeyToCodeHelper('BY_MANAGEMNT_ACCOUNT', RULE_CONTROL_DIM);

const AccountList: FC<Props> = ({
  integrationSystemIds = [],
  value = [],
  onChange = () => {},
  sobInfo,
  controlAcctType,
  extSystems,
  controlAcctList = [],
  isEys = false,
  mode,
}) => {
  const [accountList, setAccountList] = useState<
    (TradeAcctDTO | ManageAcctDTO)[]
  >([]);
  const { availabExSysInfo } = useExyInfo();
  const [exOptions, setExOptions] = useState<any[]>([]);

  // 选项数据
  const optionsFromData = useMemo(() => {
    if (!controlAcctType) return [];
    let options: { label: string; value: string }[] = [];
    const [, acctType] = controlAcctType.split('|');
    if (isEys) {
      if (isArray(integrationSystemIds) && integrationSystemIds.length > 0) {
        const aSet = new Set(integrationSystemIds);
        const list = extSystems.length > 0 ? extSystems : exOptions;
        options = list
          .filter((r) => aSet.has(r.extSysId))
          .map((item) => {
            return {
              label: `${item.extSysId} ${item.extSysName} `,
              value: item.extSysId,
            };
          });
      } else {
        options = [];
      }
    } else if (isTradingAccount(acctType)) {
      options = filterCommonObjects(accountList, controlAcctList).map(
        (item) => {
          const {
            bookLevel = 0,
            extSysId = 0,
            marketId = 0,
            acctCode = 0,
          } = item as TradeAcctDTO;
          return {
            label: `${transformDictCodeToNameHelper(
              String(marketId),
              TRADING_MARKETS
            )} ${acctCode} ${
              availabExSysInfo
                ? availabExSysInfo[Number(extSysId)].extSysName
                : ''
            } `,
            value: `${bookLevel}|${extSysId}|${marketId}|${acctCode}`,
          };
        }
      );
    } else if (isManageAccount(acctType)) {
      options = filterCommonObjects(accountList, controlAcctList).map(
        (item) => {
          const {
            bookLevel = 0,
            extSysId = 0,
            acctCode = 0,
            acctName = '',
          } = item as ManageAcctDTO;
          return {
            label: `${acctCode} ${acctName} ${
              availabExSysInfo
                ? availabExSysInfo[Number(extSysId)].extSysName
                : ''
            }
            `,
            value: `${bookLevel}|${extSysId}|${acctCode}`,
          };
        }
      );
    }
    return options;
  }, [accountList, controlAcctType, value, isEys, controlAcctList, exOptions]);

  // 从字符串转对象
  const parseOptionValue = (original: any[]) => {
    const [, acctType] = controlAcctType!.split('|');
    if (isEys) {
      return original;
    } else if (isTradingAccount(acctType)) {
      return original.map((i) => {
        const [bookLevel, extSysId, marketId, acctCode] = i.split('|');
        return {
          bookLevel: Number(bookLevel),
          extSysId: Number(extSysId),
          marketId: Number(marketId),
          acctCode,
        };
      });
    } else if (isManageAccount(acctType)) {
      return original.map((i) => {
        const [bookLevel, extSysId, acctCode] = i.split('|');
        return {
          bookLevel: Number(bookLevel),
          extSysId: Number(extSysId),
          acctCode,
        };
      });
    }
    return [];
  };

  const realValue = useMemo(() => {
    if (value.length === 0) {
      return [];
    }
    const values = value
      .map((i) => {
        if (isEys) {
          const option = optionsFromData.find((v) => v.value === i);
          return option || undefined;
        } else {
          const { bookLevel, extSysId, marketId = null, acctCode } = i;
          if (marketId) {
            const key = `${bookLevel}|${extSysId}|${marketId}|${acctCode}`;
            const option = optionsFromData.find((i) => i.value === key);
            return option || undefined;
          } else {
            const key = `${bookLevel}|${extSysId}|${acctCode}`;
            const option = optionsFromData.find((i) => i.value === key);
            return option || undefined;
          }
        }
      })
      .filter((r) => !!r);
    return values.map((i) => i.value);
  }, [value, isEys, optionsFromData]);

  useEffect(() => {
    async function fetchIntegrationSystemList() {
      // 无选中对接系统
      if (integrationSystemIds.length === 0) {
        return;
      }
      // 无选中控制账户类型
      if (!controlAcctType) return;
      // sobInfo为空
      if (!sobInfo) return;
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
          const list = response?.data?.resultList || [];
          setAccountList(list);
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
          const list = response?.data?.resultList || [];
          setAccountList(list);
        } else {
          setAccountList([]);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchIntegrationSystemList();
  }, [integrationSystemIds, controlAcctType, sobInfo]);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await queryExternSystem({
          pageId: 1,
          pageSize: 1000,
          authFlag: mode === 'PREVIEW' ? 0 : 1,
          filterCondition: { sobId: sobInfo?.sobId },
        });
        if (response.code !== 0) {
          throw Error(`查询对接系统失败 ${response.message}`);
        }
        setExOptions(response.data.resultList);
      } catch (error) {}
    }
    fetch();
  }, []);

  useEffect(() => {
    const tableBody = document.querySelector('.resised');
    const handleScroll = () => {
      // 触发 Select 组件重新计算位置
      window.dispatchEvent(new Event('resize'));
    };
    tableBody?.addEventListener('scroll', handleScroll);
    return () => tableBody?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <MultipleSelect
      options={optionsFromData}
      onChange={(values: string[] = []) =>
        onChange && onChange(isEys ? values : parseOptionValue(values))
      }
      value={realValue}
      getPopupContainer={() => document.body}
    />
  );
};

export default AccountList;
