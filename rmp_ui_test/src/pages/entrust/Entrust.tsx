import React, { useEffect, useState } from 'react';
import { Form, message, Card } from '@ht/sprite-ui';
import { useLockFn, useMemoizedFn } from 'ahooks';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import {
  type QueryEntrustParams,
  type FilterCondition,
  queryEntrust,
  queryNode,
  type ResultList,
} from '@/services/entrust';
import SearchForm from './components/SearchForm';
import TableList from './components/TableList';
import styles from './style.less';
import withKeepAlive from '@/wrappers/KeepAlive';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
// import { PaginationType } from '@/services/typing';

export interface PaginationType {
  current: number;
  pageSize: number;
  total?: number;
}
export interface SearchProps {
  page: number;
  pageSize: number;
  type?: boolean;
}

const transformDT = (data: FormDataType) => {
  const filterCondition: FilterCondition = {};
  if (data.extSysId && data.extSysId.length > 0) {
    filterCondition.extSysId = data.extSysId.map((it) => Number(it));
  }
  if (data.entrustCode?.trim()) {
    filterCondition.entrustCode = [data.entrustCode.trim()];
  }
  if (data.marketId && data.marketId.length > 0) {
    filterCondition.marketId = data.marketId.map((it) => Number(it));
  }
  if (data.securityCode && data.securityCode.length > 0) {
    filterCondition.security = data.securityCode.map((it) => {
      const { securityCode, marketId } = it;
      return {
        securityCode,
        marketId: Number(marketId),
      };
    });
  }
  if (data.entrustType && data.entrustType.length > 0) {
    filterCondition.entrustType = data.entrustType.map((it) => Number(it));
  }
  if (data.entrustDirection && data.entrustDirection.length > 0) {
    filterCondition.entrustDirection = data.entrustDirection.map((it) =>
      Number(it)
    );
  }
  if (data.entrustStatus && data.entrustStatus.length > 0) {
    filterCondition.entrustStatus = data.entrustStatus.map((it) => it);
  }
  if (data.tradeAcctCode?.trim()) {
    filterCondition.tradeAcctCode = data.tradeAcctCode;
  }
  if (data.manageAcctCode?.trim()) {
    filterCondition.manageAcctCode = data.manageAcctCode;
  }
  if (data.timeSeg && data.timeSeg.length > 0) {
    filterCondition.timeSeg = {
      beginTime: data.timeSeg[0].format('HHmmss'),
      endTime: data.timeSeg[1].format('HHmmss'),
    };
  }
  return filterCondition;
};
export interface Option {
  label: string;
  value: string | number;
}

export interface FormDataType {
  nodeId: number;
  extSysId: string[];
  entrustType: string[];
  marketId: string[];
  securityCode: {
    securityCode: string;
    marketId: number;
  }[];
  entrustDirection: string[];
  entrustStatus: string[];
  tradeAcctCode?: string;
  manageAcctCode?: string;
  entrustCode: string;
  timeSeg: moment.Moment[];
  primaryFlag: number;
}

const EntrustMain = () => {
  const [form] = Form.useForm<FormDataType>();
  const [tableData, setTableData] = useState<ResultList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nodeOptions, setNodeOptions] = useState<Option[]>([]);
  const [isExpend, setIsExpend] = useState(true);
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const onSearch = useMemoizedFn(
    useLockFn(async (props: SearchProps) => {
      try {
        const { page, pageSize, type = false } = props;
        setLoading(true);
        if (nodeOptions.length === 0) {
          return;
        }
        const dt = await form.validateFields();

        const filterCondition = transformDT(dt);
        const params: QueryEntrustParams = {
          pageId: page,
          pageSize,
          nodeId: Number(dt.nodeId),
          primaryFlag: dt.primaryFlag,
          filterCondition,
        };

        const result = await queryEntrust(params);
        if (result.code !== 0) {
          setTableData([]);
          setPagination({
            current: page,
            pageSize,
            total: 0,
          });
          // message.error({ content: `${result.message}` });
          return;
        }
        if (result.data && result.data.resultList) {
          const list = result.data.resultList.map((item) => ({
            ...item,
            key: uuidv4(),
          }));
          setTableData(list);
        } else {
          setTableData([]);
        }

        setPagination({
          current: page,
          pageSize,
          total: result.data?.totalSize,
        });
      } catch (error) {
        // message.error({ content: `${JSON.stringify(error)}` });
      } finally {
        setLoading(false);
      }
    })
  );

  const onQueryNode = useMemoizedFn(async () => {
    try {
      setLoading(true);
      const result = await queryNode({ pageId: 1, pageSize: 1000 });
      if (result.code !== 0) {
        throw new Error('节点获取失败');
      }
      if (result.data.resultList?.length > 0) {
        const list = result.data.resultList;
        const options = list.map((item) => {
          return {
            label: `${item.nodeId} ${item.nodeName}`,
            value: item.nodeId,
          };
        });
        setNodeOptions(options);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    onQueryNode();
  }, [onQueryNode]);

  useEffect(() => {
    if (nodeOptions.length > 0) {
      form.setFieldValue('nodeId', nodeOptions[0].value);
      onSearch({ page: 1, pageSize: pagination.pageSize });
    }
  }, [onSearch, nodeOptions, form]);
  const changeExpend = () => {
    setIsExpend(!isExpend);
  };
  const resetForm = () => {
    form.resetFields();
  };

  return (
    <div
      className={styles.entrust}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minWidth: '1600px',
        overflowX: 'auto',
      }}
    >
      <SearchForm form={form} nodeOptions={nodeOptions} isExpend={isExpend} />

      <TableList
        isExpend={isExpend}
        tableData={tableData}
        loading={loading}
        pagination={pagination}
        resetForm={resetForm}
        onSearch={onSearch}
        changeExpend={changeExpend}
      />
    </div>
  );
};

export default withKeepAlive({
  cacheKey: KEEPALIVE_CACHE_KEY.ENTRUST,
})(EntrustMain);
