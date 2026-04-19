import { Button, Form, message, Modal } from 'antd';
import React, { Key, useEffect, useRef, useState } from 'react';
import SearchForm from './components/SearchForm';
import ExchangeGateWayTable from './components/Table';
import {
  Condition,
  configExchangeGateWay,
  ConfigExchangeGateWayParams,
  ExchangeGateWayDataType,
  ExchangeGateWayParams,
  queryExchangeGateWay,
  queryExchangeGateWayStatus,
} from '@/services/offerAccessMaage';
import { PaginationType } from '@/services/typing';
import { useLockFn, useMemoizedFn } from 'ahooks';
import OperaModal from './components/OperaModal';
import {
  IAction as DeletRef,
  DeleteConfirm,
} from '@/components/DeleteConfirmModal';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useRefHeightResize from '@/hooks/useRefHeightResize';

export type Mode = 1 | 2 | 3;

export interface SearchProps {
  page: number;
  pageSize: number;
}

const ExchangeGateWay = () => {
  const [form] = Form.useForm();
  const [configForm] = Form.useForm();
  const [selectData, setSelectData] = useState<
    ExchangeGateWayDataType | undefined
  >(undefined);
  const [tableData, setTableData] = useState<ExchangeGateWayDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(2); // 1新增 2修改 3删除
  const ref = useRef<DeletRef>(null);

  const onClose = () => {
    setOpen(false);
    configForm.resetFields();
  };
  const onSearch = useMemoizedFn(
    useLockFn(async (page: number, pageSize: number) => {
      try {
        setLoading(true);

        const dt = await form.validateFields();
        const filterCondition: Condition = {};

        if (dt.tgwId) {
          filterCondition.tgwId = Number(dt.tgwId);
        }
        if (dt.marketId && dt.marketId.length > 0) {
          filterCondition.marketId = dt.marketId.map((p: any) => Number(p));
        }

        const params: ExchangeGateWayParams = {
          pageId: page,
          pageSize,
          filterCondition,
        };

        const result = await queryExchangeGateWay(params);
        if (result.code !== 0) {
          setTableData([]);
          // message.error({ content: `${result.message}` });
          return;
        }
        if (result.data && result.data.resultList) {
          const list = result.data.resultList;
          setTableData(list);
          // const _tgwAgentId = list.map((p) => p.tgwAgentId).filter((p) => !!p);
          // const tgwAgentId = [...new Set(_tgwAgentId)];
          // const res = await queryExchangeGateWayStatus({
          //   tgwAgentId,
          // });
          // if (res.code !== 0) {
          //   message.error(res.message);
          //   return;
          // }
          // if (res.data && res.data.resultList) {
          //   const list1 = list.map((p) => {
          //     const status = res.data.resultList.find(
          //       (i) => i.tgwId === p.tgwId
          //     )?.tgwStatus;
          //     if (status || status === 0) {
          //       return {
          //         ...p,
          //         status,
          //       };
          //     } else {
          //       return {
          //         ...p,
          //         status: '',
          //       };
          //     }
          //   });
          //   setTableData(list1);
          // } else {
          //   setTableData(list);
          // }
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
        setSelectData(undefined);
        setSelectedRowKeys([]);
      }
    })
  );

  useEffect(() => {
    onSearch(1, pagination.pageSize);
  }, []);
  const reFresh = () => {
    onSearch(1, pagination.pageSize);
    onClose();
  };

  const onEdit = useMemoizedFn(async () => {
    let params: ConfigExchangeGateWayParams = {
      alterType: 0,
      marketId: 0,
      offerChannelType: 0,
      tgwSvrIp: '',
      tgwSvrPort: 0,
      senderCompId: '',
      targetCompId: '',
      appVersion: '',
      heartBeatInterval: 0,
    };

    if (mode !== 3) {
      const dt = await configForm.validateFields();
      console.log('====================================');
      console.log(mode === 1 ? 0 : selectData?.tgwId);
      console.log('====================================');
      params = {
        alterType: mode,
        tgwId: mode === 1 ? 0 : selectData?.tgwId,
        marketId: Number(dt.marketId),
        offerChannelType: Number(dt.offerChannelType),
        tgwSvrIp: dt.tgwSvrIp,
        tgwSvrPort: Number(dt.tgwSvrPort),
        senderCompId: dt.senderCompId,
        targetCompId: dt.targetCompId,
        appVersion: dt.appVersion,
        loginPassword: dt.loginPassword,
        heartBeatInterval: Number(dt.heartBeatInterval),
        remark: dt.remark ? dt.remark.trim() : '',
      };
    }

    if (mode === 3) {
      if (!selectData) return;
      params = {
        alterType: mode,
        tgwId: selectData?.tgwId,
        marketId: selectData.marketId,
        offerChannelType: selectData.offerChannelType,
        tgwSvrIp: selectData.tgwSvrIp,
        tgwSvrPort: selectData.tgwSvrPort,
        senderCompId: selectData.senderCompId,
        targetCompId: selectData.targetCompId,
        appVersion: selectData.appVersion,
        loginPassword: selectData.loginPassword,
        executionReportCount: selectData.executionReportCount,
        heartBeatInterval: selectData.heartBeatInterval,
      };
    }

    try {
      const res = await configExchangeGateWay(params);
      if (res.code === 0) {
        message.success('操作成功');
      } else {
        // message.error({ content: JSON.parse(JSON.stringify(res.message)) });
      }
      reFresh();
    } catch (error) {}
  });

  const carRef = useRef(null);
  const size = useRefHeightResize(carRef);
  return (
    <div
      ref={carRef}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <SearchForm form={form} onSearch={onSearch} pagination={pagination} />
        <div>
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={() => {
              setMode(1);
              setOpen(true);
            }}
          >
            添加
          </Button>
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={() => {
              setMode(2);
              setOpen(true);
            }}
            disabled={!selectData}
          >
            修改
          </Button>
          <Button
            type="primary"
            disabled={!selectData}
            style={{ marginRight: '10px' }}
            onClick={() => {
              setMode(3);
              ref.current?.open();
            }}
          >
            删除
          </Button>
        </div>
      </div>
      <ExchangeGateWayTable
        setSelectData={setSelectData}
        pagination={pagination}
        loading={loading}
        tableData={tableData}
        onSearch={onSearch}
        size={size}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
      <OperaModal
        open={open}
        mode={mode}
        onEdit={onEdit}
        form={configForm}
        onClose={onClose}
        selectData={selectData}
      />
      <DeleteConfirm
        ref={ref}
        api={onEdit}
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ExclamationCircleOutlined
              style={{ color: 'red', fontSize: '18px' }}
            />
            <span style={{ paddingLeft: '10px' }}>删除交易所网关</span>
          </div>
        }
        messageCont={`是否删除编号为${selectData?.tgwId ?? ''}的交易网关`}
      />
    </div>
  );
};

export default ExchangeGateWay;
