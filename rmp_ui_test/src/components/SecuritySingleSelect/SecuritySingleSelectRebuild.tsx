import React, { useEffect, useMemo, useState } from 'react';
import { Select, SelectProps, Spin } from 'antd';

import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { querySecurity } from '@/services/securityInfo';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';

interface OptionProps {
  label: string;
  value: string;
}

interface Props extends Omit<SelectProps, 'options'> {
  value?: any;
  onChange?: (value: any) => void;
  labelType?: 'MARKETD' | 'NO_MARKETD';
}

const SecuritySingleSelect: React.FC<Props> = ({
  value,
  onChange,
  labelType = 'MARKETD',
  disabled = false,
  ...restProps
}) => {
  const [securityOptions, setSecurityOptions] = useState<OptionProps[]>([]);
  const [load, setLoad] = useState(false);

  const onSearchSecurityCode = useMemoizedFn(async (searchValue: string) => {
    setLoad(true);
    const params = {
      pageId: 1,
      pageSize: 5000,
      filterCondition: {
        securityCode: searchValue,
      },
    };
    const result = await querySecurity(params);
    if (result.code !== 0) {
      throw new Error('证券列表获取失败');
    }
    if (result.data.resultList && result.data.resultList.length > 0) {
      const list = result.data.resultList.map((item) => ({
        label:
          labelType === 'NO_MARKETD'
            ? `${item.securityCode} ${item.securityName ?? ''}`
            : `${item.securityCode} ${item.securityName ?? ''} ${
                transformDictCodeToNameHelper(
                  String(item.marketId),
                  TRADING_MARKETS
                ) || '未知市场'
              } `,
        value: `${item.securityCode}|${item.marketId}`,
      }));
      setSecurityOptions(list);
    } else {
      setSecurityOptions([]);
    }
    setLoad(false);
  });

  useEffect(() => {
    onSearchSecurity('');
  }, []);

  const { run: onSearchSecurity } = useDebounceFn(onSearchSecurityCode, {
    wait: 500,
  });

  const realValue = useMemo(() => {
    if (!value) {
      return '';
    }
    let selected = '';
    const { securityCode, marketId } = value;
    const option = securityOptions.find(
      (i) => i.value === `${securityCode}|${marketId}`
    );
    if (option) {
      selected = option.value;
    }
    return selected;
  }, [value, securityOptions]);

  return (
    <div>
      <Select
        options={securityOptions}
        value={realValue}
        onChange={(values: string) => {
          if (!values) {
            onChange && onChange(null);
          } else {
            const [securityCode, marketId] = values.split('|');
            onChange && onChange({ securityCode, marketId: Number(marketId) });
          }
        }}
        disabled={disabled}
        allowClear={true}
        filterOption={false}
        onSearch={onSearchSecurity}
        placeholder={'请输入证券代码进行搜索'}
        dropdownRender={(menu) => (
          <div>{load ? <Spin>{menu}</Spin> : menu}</div>
        )}
        // {...restProps}
      />
    </div>
  );
};

export default SecuritySingleSelect;
