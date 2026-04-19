import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, SelectProps } from '@ht/sprite-ui';
import { queryManageAccount } from '@/services/account';
import { useMemoizedFn } from 'ahooks';
import { isArray } from 'lodash';
import { useSystemInfo } from '@/hooks';
import MultipleSelect from '@/components/MultipleSelectRebuild';

interface Props extends SelectProps {
  onChange?: (v: any) => void;
  bookLevelType: number;
  sobId: number | undefined;
  extSysIdList: any[];
  value?: string[];
}
interface TermOption {
  label: string;
  value: string;
}

const AccountAuthSelect = ({
  sobId,
  bookLevelType,
  onChange = () => {},
  extSysIdList,
  value = [],
  ...props
}: Props) => {
  const [options, setOptions] = useState<TermOption[]>([]);
  const pageSize = 5000;
  const externSystem = useSystemInfo();

  const getExtSystemMap = useCallback(
    (id: number) => {
      if (externSystem) {
        const sysItemName = externSystem.find(
          (p) => p.extSysId === id
        )?.extSysName;
        return sysItemName;
      }
      return null;
    },
    [externSystem]
  );

  const querySelect = useMemoizedFn(
    async (pageId, _sobId, _bookLevel, value) => {
      try {
        if (_sobId) {
          const result = await queryManageAccount({
            pageId,
            pageSize,
            filterCondition: {
              sobId: _sobId,
              bookLevel: bookLevelType,
              extSysId: extSysIdList,
            },
          });
          if (result.code !== 0) {
            throw new Error('获取账户信息失败');
          }
          if (isArray(result.data?.resultList)) {
            const _optins =
              result.data?.resultList.map((item) => {
                const { extSysId, acctCode, acctName } = item;
                return {
                  label: `${acctCode} ${acctName} ${
                    getExtSystemMap(extSysId) ?? '--'
                  }`,
                  value: `${extSysId}|${acctCode}`,
                };
              }) ?? [];
            setOptions(_optins ?? []);
          } else {
            setOptions([]);
          }
        }
      } catch (error) {
        //  message.error({ content: `账户层级请求失败` });
      }
    }
  );

  const realValue = useMemo(() => {
    if (value.length === 0) {
      return [];
    }
    const selected: string[] = [];
    for (const item of value) {
      const [extSysId, acctCode] = item.split('|');
      const option = options.find((i) => i.value === `${extSysId}|${acctCode}`);
      if (option) {
        selected.push(option.value);
      }
    }
    return selected;
  }, [value, options]);

  useEffect(() => {
    if (extSysIdList.length > 0) {
      querySelect(1, sobId, bookLevelType, '');
    }
  }, [querySelect, sobId, bookLevelType, extSysIdList]);

  return (
    <MultipleSelect
      options={options}
      value={realValue}
      disabled={true}
      onChange={(values: string[] = []) => {
        onChange && onChange(values);
      }}
    />
  );
};

export default AccountAuthSelect;
