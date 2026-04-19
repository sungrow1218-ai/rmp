import React, { forwardRef, ForwardRefRenderFunction, useState } from 'react';
import {
  AutoComplete,
  AutoCompleteProps,
  Input,
  InputProps,
  SelectProps,
} from '@ht/sprite-ui';

import { useUserRoles } from '@/hooks';
import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { querySecurity } from '@/services/securityInfo';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import { SearchOutlined } from '@ht-icons/sprite-ui-react';

const { Option } = AutoComplete;

interface OptionProps {
  label: string;
  value: string;
}

const SecuritySingleSelect: ForwardRefRenderFunction<
  AutoCompleteProps,
  SelectProps & { [key: string]: any }
> = (props) => {
  const { activeRoleId } = useUserRoles();
  const [securityOptions, setSecurityOptions] = useState<OptionProps[]>([]);

  const onSearchSecurityCode = useMemoizedFn(async (value: string) => {
    if (activeRoleId) {
      const params = {
        pageId: 1,
        pageSize: 200,
        filterCondition: {
          securityCode: value,
          marketId: props?.marketId ? [Number(props?.marketId)] : undefined,
        },
      };
      const result = await querySecurity(params);
      if (result.code !== 0) {
        throw new Error('列表获取失败');
      }
      if (result.data.resultList && result.data.resultList.length > 0) {
        const list = result.data.resultList.map((item) => ({
          label: props.onLabelparse
            ? props.onLabelparse(item)
            : `${item.securityCode} ${item.securityName} ${
                transformDictCodeToNameHelper(
                  String(item.marketId),
                  TRADING_MARKETS
                ) || '未知市场'
              }`,
          value:
            props.valueType === 'NO_MARKETD'
              ? `${item.securityCode} ${item.securityName}`
              : `${item.securityCode} ${item.securityName} ${
                  transformDictCodeToNameHelper(
                    String(item.marketId),
                    TRADING_MARKETS
                  ) || '未知市场'
                } `,
          key: `${item.securityCode}|${item.marketId}`,
          marketIdStr: transformDictCodeToNameHelper(
            String(item.marketId),
            TRADING_MARKETS
          ),
          ...item,
        }));
        setSecurityOptions(list);
      } else {
        setSecurityOptions([]);
      }
    }
  });

  const { run: onSearchSecurity } = useDebounceFn(onSearchSecurityCode, {
    wait: 500,
  });
  return (
    <div>
      <AutoComplete
        placeholder={props.placeholder}
        onSearch={onSearchSecurity}
        allowClear={true}
        options={securityOptions}
        {...props}
      >
        {props.prefix ? (
          <Input prefix={props.prefix} placeholder="请输入证券代码进行搜索" />
        ) : (
          <></>
        )}
        {securityOptions.map((item: any) => (
          <Option
            key={item.key}
            value={item.label}
            marketId={item.marketId}
            securityCode={item.securityCode}
          >
            {item.label}
          </Option>
        ))}
      </AutoComplete>
    </div>
  );
};

export default SecuritySingleSelect;
