import { SobInfo } from '@/services/account';
import { Select } from 'antd';
import React, { CSSProperties, useMemo, type FC } from 'react';
import { BookTypeEnum, BookTypeToAcctType } from '../ControlAcctTypeSelect';
import { RULE_CONTROL_DIM, transformDictFeKeyToCodeHelper } from '@/utils/dict';

interface Props {
  sobInfo?: SobInfo;
  value?: string;
  onChange?: (value: string) => void;
  includeAcctGroup?: boolean;
  style?: CSSProperties;
}

const ExcludeAcctTypeSelect: FC<Props> = ({
  sobInfo,
  value,
  onChange,
  includeAcctGroup = false,
  style = {},
}) => {
  const options = useMemo(() => {
    let opts: { label: string; value: string }[] = [];
    if (sobInfo) {
      for (const { bookLevelList, bookType } of sobInfo.bookList) {
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
      if (includeAcctGroup) {
        opts.push({
          label: '账户组',
          value: `|${transformDictFeKeyToCodeHelper(
            'BY_ACCT_GROUP',
            RULE_CONTROL_DIM
          )}`,
        });
      }
    }
    return opts;
  }, [sobInfo]);

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder="请选择"
      allowClear={true}
      style={style}
    />
  );
};

export default ExcludeAcctTypeSelect;
