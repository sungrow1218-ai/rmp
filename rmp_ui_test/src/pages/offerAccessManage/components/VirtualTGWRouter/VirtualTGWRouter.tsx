import { Button, Form, message, Modal } from 'antd';
import React, { Key, useEffect, useRef, useState } from 'react';
import SearchForm from './components/SearchForm';
import VirtualGateWayTable from './components/Table';
import {
  configVirtualGateWay,
  configVirtualGateWayParams,
  configVirtualTGWRouter,
  ConfigVirtualTGWRouter,
  configVirtualTGWRouterStatus,
  queryExchangeGateWayStatus,
  queryVirtualGateWayStatus,
  queryVirtualTGWRouter,
  VirtualTGWRouterCondition,
  VirtualTGWRouterDataType,
  VirtualTGWRouterParams,
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

const tranFormDT = (data: any) => {
  const result: VirtualTGWRouterCondition = {};
  if (data.virtualTgwId) {
    result.virtualTgwId = Number(data.virtualTgwId);
  }
  if (data.virtualSvrPort) {
    result.virtualSvrPort = Number(data.virtualSvrPort);
  }
  if (data.tgwId) {
    result.tgwId = Number(data.tgwId);
  }
  return result;
};
interface TableListWithStatus extends VirtualTGWRouterDataType {
  tgwLinkStatus?: number;
  tradeSysLinkStatus?: number;
  riskLinkStatus?: number;
}

const VirtualTGWRouter = () => {
  const [form] = Form.useForm();
  const [configForm] = Form.useForm();
  const [selectData, setSelectData] = useState<TableListWithStatus | undefined>(
    undefined
  );
  const [tableData, setTableData] = useState<TableListWithStatus[]>([]);
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
        const filterCondition = tranFormDT(dt);

        const params: VirtualTGWRouterParams = {
          pageId: page,
          pageSize,
          filterCondition,
        };

        const result = await queryVirtualTGWRouter(params);
        if (result.code !== 0) {
          setTableData([]);
          // message.error({ content: `${result.message}` });
          return;
        }
        if (result.data && result.data.resultList) {
          const list = result.data.resultList;
          // setTableData(list);
          let _tableList: TableListWithStatus[] = list;
          const _tgwAgentId = list.map((p) => p.tgwAgentId).filter((p) => !!p);
          const tgwAgentId = [...new Set(_tgwAgentId)];
          const res = await queryExchangeGateWayStatus({
            tgwAgentId,
          });
          if (res.code !== 0) {
            // message.error(res.message);
            return;
          }
          if (res.data && res.data.resultList) {
            _tableList = list.map((p) => {
              const tgwLinkStatus = res.data.resultList.find(
                (i) => i.tgwId === p.tgw.tgwId
              )?.tgwLinkStatus;
              if (tgwLinkStatus || tgwLinkStatus === 0) {
                return {
                  ...p,
                  tgwLinkStatus,
                };
              } else {
                return {
                  ...p,
                  tgwLinkStatus: undefined,
                };
              }
            });
          }
          const virRes = await queryVirtualGateWayStatus({
            tgwAgentId,
          });
          if (virRes.code !== 0) {
            // message.error(virRes.message);
            return;
          }
          if (virRes.data && virRes.data.resultList) {
            _tableList = _tableList.map((p) => {
              const status = virRes.data.resultList.find(
                (i) => i.virtualTgwId === p.virtualTgw.virtualTgwId
              );
              if (status) {
                return {
                  ...p,
                  tradeSysLinkStatus: status.tradeSysLinkStatus,
                  riskLinkStatus: status.riskLinkStatus,
                };
              } else {
                return {
                  ...p,
                };
              }
            });
          }

          setTableData(_tableList);
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
    let params: ConfigVirtualTGWRouter = {
      alterType: 0,
      routerId: 0,
      tgwAgentId: 0,
      tgwId: 0,
      virtualTgwId: 0,
      enableFlag: '0',
    };
    if (mode !== 3) {
      const dt = await configForm.validateFields();
      params = {
        alterType: mode,
        routerId: mode === 1 ? 0 : selectData?.routerId ?? 0,
        tgwAgentId: dt.tgwAgentId,
        tgwId: dt.tgwId,
        virtualTgwId: dt.virtualTgwId,
        enableFlag: mode === 1 ? '0' : String(selectData?.enableFlag),
        remark: dt.remark ? dt.remark.trim() : '',
      };
    }

    if (mode === 3) {
      if (!selectData) return;
      params = {
        alterType: mode,
        routerId: selectData.routerId,
        tgwAgentId: selectData.tgwAgentId,
        tgwId: selectData.tgw.tgwId,
        virtualTgwId: selectData.virtualTgw.virtualTgwId,
        enableFlag: selectData.enableFlag,
      };
    }

    try {
      const res = await configVirtualTGWRouter(params);
      if (res.code === 0) {
        message.success('操作成功');
        reFresh();
      } else {
        // message.error({ content: `${res.message}` });
        reFresh();
      }
    } catch (error) {}
  });

  const onStart = useMemoizedFn(async (flag: number) => {
    try {
      const res = await configVirtualTGWRouterStatus({
        routerId: selectData?.routerId ?? 0,
        enableFlag: String(flag),
      });
      if (res.code === 0) {
        message.success(flag === 1 ? '开启成功' : '关闭成功');
        reFresh();
      } else {
        // message.error({ content: `${res.message}` });
        reFresh();
      }
    } catch (error) {}
  });

  const carRef = useRef(null);
  const size = useRefHeightResize(carRef);
  return (
    <div
      ref={carRef}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <SearchForm form={form} onSearch={onSearch} pagination={pagination} />
      <div style={{ marginBottom: '10px' }}>
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
        <Button
          type="primary"
          disabled={!selectData}
          style={{ marginRight: '10px' }}
          onClick={() => {
            onStart(1);
          }}
        >
          开启
        </Button>
        <Button
          type="primary"
          disabled={!selectData}
          style={{ marginRight: '10px' }}
          onClick={() => {
            onStart(0);
          }}
        >
          关闭
        </Button>
      </div>
      <VirtualGateWayTable
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
            <span style={{ paddingLeft: '10px' }}>删除报盘路由</span>
          </div>
        }
        messageCont={`是否删除编号为${selectData?.routerId ?? ''}的报盘路由`}
      />
    </div>
  );
};

export default VirtualTGWRouter;
