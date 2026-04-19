import { SobInfo } from '@/services/account';
import { RULE_CONTROL_DIM, transformDictFeKeyToCodeHelper } from '@/utils/dict';
import { Select } from 'antd';
import React, { useMemo, type FC } from 'react';

interface Props {
  sobInfo?: SobInfo;
  value?: string;
  onChange?: (value: string) => void;
  includeExtSystem?: boolean;
  onlyTradeAccount?: boolean;
  onlyManageAccount?: boolean;
  includeAcctGroup?: boolean;
}

export enum BookTypeEnum {
  TRADE_ACCOUNT = 1,
  MANAGE_ACCOUNT = 2,
}

export const BookTypeToAcctType = {
  [BookTypeEnum.TRADE_ACCOUNT]: transformDictFeKeyToCodeHelper(
    'BY_TRADING_ACCOUNT',
    RULE_CONTROL_DIM
  ),
  [BookTypeEnum.MANAGE_ACCOUNT]: transformDictFeKeyToCodeHelper(
    'BY_MANAGEMNT_ACCOUNT',
    RULE_CONTROL_DIM
  ),
};

const ControlAcctTypeSelect: FC<Props> = ({
  sobInfo,
  value,
  onChange,
  includeExtSystem = false,
  includeAcctGroup = false,
  onlyTradeAccount = false,
  onlyManageAccount = false,
}) => {
  const options = useMemo(() => {
    let opts: { label: string; value: string }[] = [];
    if (sobInfo) {
      for (const { bookLevelList, bookType } of sobInfo.bookList) {
        if (onlyTradeAccount) {
          if (bookType === BookTypeEnum.TRADE_ACCOUNT) {
            opts = [
              ...opts,
              ...bookLevelList.map((i) => ({
                label: i.bookLevelName,
                value: `${i.bookLevel}|${
                  BookTypeToAcctType[bookType as BookTypeEnum]
                }`,
              })),
            ];
          }
        } else if (onlyManageAccount) {
          if (bookType === BookTypeEnum.MANAGE_ACCOUNT) {
            opts = [
              ...opts,
              ...bookLevelList.map((i) => ({
                label: i.bookLevelName,
                value: `${i.bookLevel}|${
                  BookTypeToAcctType[bookType as BookTypeEnum]
                }`,
              })),
            ];
          }
        } else {
          opts = [
            ...opts,
            ...bookLevelList.map((i) => ({
              label: i.bookLevelName,
              value: `${i.bookLevel}|${
                BookTypeToAcctType[bookType as BookTypeEnum]
              }`,
            })),
          ];
        }
      }
    }
    // 对接系统
    if (includeExtSystem) {
      opts.push({
        label: '对接系统',
        value: `|${transformDictFeKeyToCodeHelper(
          'BY_INTERGRATE_SYSTEM',
          RULE_CONTROL_DIM
        )}`,
      });
    }
    // 账户组
    if (includeAcctGroup) {
      opts.push({
        label: '账户组',
        value: `|${transformDictFeKeyToCodeHelper(
          'BY_ACCT_GROUP',
          RULE_CONTROL_DIM
        )}`,
      });
    }
    return opts;
  }, [sobInfo, includeExtSystem, includeAcctGroup]);

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder="请选择"
      style={{ width: '240px' }}
    />
  );
};

export default ControlAcctTypeSelect;
