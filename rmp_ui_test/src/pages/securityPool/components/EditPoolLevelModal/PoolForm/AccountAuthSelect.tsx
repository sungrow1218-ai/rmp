import React, { useEffect, useMemo, useState } from 'react';
import {
  Select,
  message,
  Spin,
  SelectProps,
  Divider,
  Space,
  Checkbox,
} from '@ht/sprite-ui';
import { queryManageAccount } from '@/services/account';
import { useMemoizedFn } from 'ahooks';
import { CheckboxChangeEvent } from '@ht/sprite-ui/lib/checkbox';
import { isArray } from 'lodash';
import { useInfoInit } from '@/pages/securityPool/contants/useInfoInit';
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
  onChange,
  extSysIdList,
  value = [],
  ...props
}: Props) => {
  const [options, setOptions] = useState<TermOption[]>([]);

  const useInfoInitFun = useInfoInit();

  const getExtSystemMap: Recordable = useMemo(() => {
    return (
      useInfoInitFun?.externSystem.reduce(
        (prev, cur) => ({ ...prev, [cur.extSysId]: cur.extSysName }),
        {}
      ) ?? {}
    );
  }, [extSysIdList]);

  const querySelect = useMemoizedFn(
    async (pageId, _sobId, _bookLevel, value) => {
      try {
        if (_sobId) {
          const result = await queryManageAccount({
            pageId,
            pageSize: 5000,
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
                    getExtSystemMap[extSysId] || '--'
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

  useEffect(() => {
    if (extSysIdList.length > 0) {
      querySelect(1, sobId, bookLevelType, '');
    }
  }, [querySelect, sobId, bookLevelType, extSysIdList]);

  return <MultipleSelect onChange={onChange} value={value} options={options} />;
};

export default AccountAuthSelect;
