import React, { useEffect, useState } from 'react';
import { Form, message, Divider, Button } from '@ht/sprite-ui';
import { useLockFn, useMemoizedFn } from 'ahooks';
import { v4 as uuidv4 } from 'uuid';

import { queryNode } from '@/services/entrust';
import SearchForm from './components/SearchForm';
import TableList from './components/TableList';
import styles from './style.less';
import withKeepAlive from '@/wrappers/KeepAlive';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import {
  FilterCondition,
  PositionResultList,
  queryPosition,
  QueryPositionParams,
} from '@/services/position';
import { PaginationType } from '@/services/typing';
import OperaModal from './components/OperaModal';
import { DownOutlined, UpOutlined } from '@ht-icons/sprite-ui-react';
import { useSystemInfo } from '@/hooks';

import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';

export interface SearchProps {
  page: number;
  pageSize: number;
}

const transformDT = (data: FormDataType) => {
  const filterCondition: FilterCondition = {};
  if (data.extSysId && data.extSysId.length > 0) {
    filterCondition.extSysId = data.extSysId.map((it) => Number(it));
  }
  if (data.security && data.security.length > 0) {
    filterCondition.security = data.security.map((it) => {
      return {
        securityCode: it.securityCode,
        marketId: Number(it.marketId),
      };
    });
  }
  if (data.tradeAcctCode?.trim()) {
    filterCondition.tradeAcctCode = data.tradeAcctCode;
  }
  if (data.manageAcctCode?.trim()) {
    filterCondition.manageAcctCode = data.manageAcctCode;
  }
  return filterCondition;
};
export interface Option {
  label: string;
  value: string | number;
}

export interface FormDataType {
  nodeId: number;
  extSysId?: number[];
  security?: { securityCode: string; marketId: number }[];
  tradeAcctCode?: string;
  manageAcctCode?: string;
}

const PositionMain = () => {
  const [form] = Form.useForm<FormDataType>();
  const [positonForm] = Form.useForm();
  const [tableData, setTableData] = useState<PositionResultList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nodeOptions, setNodeOptions] = useState<Option[]>([]);
  const [isExpend, setIsExpend] = useState(true);
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(2); // 1新增 2修改 3删除
  const [selectData, setSelectData] = useState<PositionResultList | null>(null);
  const systemInfo = useSystemInfo(0);
  const onSearch = useMemoizedFn(
    useLockFn(async (props: SearchProps) => {
      try {
        const { page, pageSize } = props;
        setLoading(true);
        if (nodeOptions.length === 0) {
          return;
        }

        const dt = await form.validateFields();
        const filterCondition = transformDT(dt);
        const params: QueryPositionParams = {
          pageId: page,
          pageSize,
          nodeId: Number(dt.nodeId),
          filterCondition,
        };

        const result = await queryPosition(params);
        if (result.code !== 0) {
          setTableData([]);
          setPagination({
            current: page,
            pageSize,
            total: 0,
          });
          message.error({ content: `${result.message ?? ''}` });
          return;
        }
        if (
          result.data &&
          result.data.resultList &&
          result.data.resultList.length > 0
        ) {
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
      } finally {
        setLoading(false);
        setSelectData(null);
      }
    })
  );

  const onQueryNode = useMemoizedFn(async () => {
    try {
      setLoading(true);
      const result = await queryNode({ pageId: 1, pageSize: 1000 });
      if (result.code !== 0) {
        setNodeOptions([]);
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

  const changeExpend = () => {
    setIsExpend(!isExpend);
  };
  const resetForm = () => {
    form.resetFields();
  };
  const onClose = () => {
    setOpen(false);
    positonForm.resetFields();
  };
  const reFrech = () => {
    onSearch({ page: 1, pageSize: pagination.pageSize });
  };

  const onEdit = (record: PositionResultList | null) => {
    if (!record) return;
    setMode(2);
    setOpen(true);
    setSelectData(record);
    const tradeObj = record.tradeAcct.find((p) => p.bookLevel === 1);
    const manageObj = record.manageAcct.find((p) => p.bookLevel === 1);
    positonForm.setFieldsValue({
      nodeId: record.nodeId,
      extSysId: record.extSysId,
      baseTradeAcct: tradeObj
        ? `${tradeObj?.acctCode ?? '未知账户'}|${
            tradeObj?.marketId ?? '未知市场'
          }`
        : '',
      baseManageAcct: manageObj
        ? `${manageObj?.acctCode ?? '未知账户'} ${manageObj?.acctName ?? ''}`
        : '',
      positionType: record.positionType,
      securityCodeStr: `${record.securityCode} ${transformDictCodeToNameHelper(
        String(record.marketId),
        TRADING_MARKETS
      )}`,
    });
  };

  return (
    <div
      className={styles.Position}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minWidth: '1600px',
        overflowX: 'scroll',
      }}
    >
      <SearchForm form={form} nodeOptions={nodeOptions} isExpend={isExpend} />
      <Divider style={{ padding: '5px 24px', margin: 0 }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingRight: '10px',
          paddingBottom: '10px',
        }}
      >
        <Button
          style={{
            marginRight: '8px',
          }}
          type="link"
          onClick={changeExpend}
        >
          {isExpend ? '收起' : '展开'}
          {isExpend ? <UpOutlined /> : <DownOutlined />}
        </Button>
        <Button
          style={{
            marginRight: '15px',
          }}
          onClick={resetForm}
        >
          重置
        </Button>
        <Button
          onClick={() => {
            setOpen(true);
            setMode(1);
          }}
          style={{
            marginRight: '15px',
          }}
          type="primary"
        >
          新增
        </Button>
        <Button
          onClick={() => {
            onEdit(selectData);
          }}
          disabled={!selectData}
          style={{
            marginRight: '15px',
          }}
          type="primary"
        >
          修改
        </Button>
        <Button
          onClick={() => {
            onSearch({
              page: 1,
              pageSize: pagination.pageSize,
            });
          }}
          type="primary"
        >
          查询
        </Button>
      </div>

      <TableList
        setSelectData={setSelectData}
        selectData={selectData}
        tableData={tableData}
        loading={loading}
        pagination={pagination}
        onSearch={onSearch}
        systemInfo={systemInfo}
        onEdit={onEdit}
      />
      <OperaModal
        nodeOptions={nodeOptions}
        form={positonForm}
        open={open}
        mode={mode}
        onClose={onClose}
        reFresh={reFrech}
        systemInfo={systemInfo}
        selectData={selectData}
      />
    </div>
  );
};

export default withKeepAlive({
  cacheKey: KEEPALIVE_CACHE_KEY.POSITION,
})(PositionMain);
