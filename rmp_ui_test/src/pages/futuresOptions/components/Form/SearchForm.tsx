import React, { useEffect, useMemo, useState } from 'react';
import { FormInstance, Form, Select, message } from '@ht/sprite-ui';
import { TRADING_MARKETS } from '@/utils/dictFutures';
import {
  FutureKindParams,
  FutureOptionList,
  queryFutureKind,
  queryOptionKind,
  ResultList,
} from '@/services/FutureOption';
import { useMemoizedFn } from 'ahooks';

interface Props {
  form: FormInstance;
  buttonType: string;
  selectItems: FutureOptionList[];
  tabKey: string;
}

const SearchForm: React.FC<Props> = ({
  form,
  buttonType = false,
  selectItems = [],
  tabKey,
}) => {
  const watchMarket = Form.useWatch('marketId', form);
  const [kindLoading, setKindLoading] = useState(false);
  const [kindList, setKindList] = useState<ResultList[]>([]);

  useEffect(() => {
    const marketId = selectItems[0]?.marketId.toString() ?? null;
    const kindCode = selectItems[0]?.kindCode.toString() ?? null;

    if (
      buttonType === 'Edit' ||
      buttonType === 'Add' ||
      buttonType === 'Copy'
    ) {
      form.setFieldsValue({
        marketId,
        kindCode,
      });
    }
  }, [form, buttonType, selectItems]);

  const queryKind = useMemoizedFn(async () => {
    try {
      if (!watchMarket) {
        setKindList([]);
        return;
      }
      setKindLoading(true);
      const params: FutureKindParams = {
        pageId: 1,
        pageSize: 1000,
        filterCondition: {
          marketId: [Number(watchMarket)],
        },
      };
      let result: any;
      if (tabKey === '1') {
        result = await queryFutureKind(params);
      } else {
        result = await queryOptionKind(params);
      }
      if (result.code !== 0) {
        // message.error({
        //   content: `${result.message}`,
        // });
        return;
      }
      if (result.data?.resultList) {
        setKindList(result.data?.resultList);
      } else {
        setKindList([]);
      }
    } catch (error) {
      //  message.error({ content: `${JSON.stringify(error)}` });
    } finally {
      setKindLoading(false);
    }
  });
  useEffect(() => {
    queryKind();
  }, [buttonType, queryKind, selectItems.length, tabKey, watchMarket]);

  const marketOptions = TRADING_MARKETS.map((item1) => {
    return {
      label: item1.name,
      value: item1.code,
    };
  });
  const kindCodeOptions = useMemo(() => {
    const options = kindList?.map((item) => {
      return {
        label: `${item.kindCode}  ${item.kindName}`,
        value: item.kindCode,
      };
    });
    if (options?.length) {
      return options;
    }
    return [];
  }, [kindList]);
  return (
    <div style={{ paddingBottom: '20px', minWidth: '520px' }}>
      <Form form={form} name="search_futures" layout="inline">
        <Form.Item label="交易所" name="marketId">
          <Select
            loading={kindLoading}
            disabled={buttonType === 'Edit'}
            allowClear={true}
            onChange={() => {
              form.setFieldsValue({ kindCode: null });
            }}
            style={{ width: '150px' }}
            options={marketOptions}
          />
        </Form.Item>

        <Form.Item
          label={tabKey === '1' ? '期货品种' : '期权品种'}
          name="kindCode"
        >
          <Select
            allowClear={true}
            disabled={buttonType === 'Edit'}
            style={{ width: '200px' }}
            options={kindCodeOptions}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
export default SearchForm;
