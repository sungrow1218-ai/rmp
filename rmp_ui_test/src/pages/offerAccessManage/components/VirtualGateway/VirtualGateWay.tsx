import { Button, Form, message, Modal } from 'antd';
import React, { Key, useEffect, useRef, useState } from 'react';
import SearchForm from './components/SearchForm';
import VirtualGateWayTable from './components/Table';
import {
  configVirtualGateWay,
  configVirtualGateWayParams,
  VirtualGateWayDataType,
  VirtualGateWayParams,
  queryVirtualGateWay,
  VirtualCondition,
  queryVirtualGateWayStatus,
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
  const result: VirtualCondition = {};
  if (data.virtualTgwId || data.virtualTgwId === 0) {
    result.virtualTgwId = Number(data.virtualTgwId);
  }
  if (data.virtualTgwName && data.virtualTgwName.trim()) {
    result.virtualTgwName = data.virtualTgwName.trim();
  }
  if (data.virtualSvrPort || data.virtualSvrPort === 0) {
    result.virtualSvrPort = Number(data.virtualSvrPort.trim());
  }
  if (data.extSysId || data.extSysId) {
    result.extSysId = data.extSysId;
  }
  if (data.extSubsysId || data.extSubsysId === 0) {
    result.extSubsysId = Number(data.extSubsysId);
  }
  if (data.toRiskFlag || data.toRiskFlag === 0) {
    result.toRiskFlag = data.toRiskFlag;
  }
  return result;
};

const VirtualGateWay = () => {
  const [form] = Form.useForm();
  const [configForm] = Form.useForm();
  const [selectData, setSelectData] = useState<
    VirtualGateWayDataType | undefined
  >(undefined);
  const [tableData, setTableData] = useState<VirtualGateWayDataType[]>([]);
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

        const params: VirtualGateWayParams = {
          pageId: page,
          pageSize,
          filterCondition,
        };

        const result = await queryVirtualGateWay(params);
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
          // const res = await queryVirtualGateWayStatus({
          //   tgwAgentId,
          // });
          // if (res.code !== 0) {
          //   message.error(res.message);
          //   return;
          // }
          // if (res.data && res.data.resultList) {
          //   const list1 = list.map((p) => {
          //     const status = res.data.resultList.find(
          //       (i) => i.virtualTgwId === p.virtualTgwId
          //     );
          //     if (status) {
          //       return {
          //         ...p,
          //         ...status,
          //       };
          //     } else {
          //       return {
          //         ...p,
          //         virtualTgwStatus: '',
          //         riskStatus: '',
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
    let params: configVirtualGateWayParams = {
      alterType: 0,
      virtualTgwId: 0,
      virtualTgwName: '',
      virtualSvrPort: 0,
      extSysId: 0,
      extSubsysId: 0,
      beginOrderId: '',
      endOrderId: '',
      toRiskFlag: 0,
      tgwProtocolType: 0,
    };
    if (mode !== 3) {
      const dt = await configForm.validateFields();
      params = {
        alterType: mode,
        virtualTgwId: mode === 1 ? 0 : Number(dt.virtualTgwId),
        virtualTgwName: dt.virtualTgwName.trim(),
        virtualSvrPort: Number(dt.virtualSvrPort),
        extSysId: Number(dt.extSysId),
        extSubsysId: Number(dt.extSubsysId),
        beginOrderId: dt.beginOrderId.trim(),
        endOrderId: dt.endOrderId.trim(),
        toRiskFlag: Number(dt.toRiskFlag),
        tgwProtocolType: Number(dt.tgwProtocolType),
        remark: dt.remark ? dt.remark.trim() : '',
      };
    }

    if (mode === 3) {
      if (!selectData) return;
      params = {
        alterType: mode,
        virtualTgwId: selectData.virtualTgwId,
        virtualTgwName: selectData.virtualTgwName,
        virtualSvrPort: selectData.virtualSvrPort,
        extSysId: selectData.extSysId,
        extSubsysId: selectData.extSubsysId,
        beginOrderId: selectData.beginOrderId,
        endOrderId: selectData.endOrderId,
        toRiskFlag: selectData.toRiskFlag,
        tgwProtocolType: selectData.tgwProtocolType,
      };
    }

    try {
      const res = await configVirtualGateWay(params);
      if (res.code === 0) {
        message.success('操作成功');
      } else {
        // message.error({ content: `${res.message}` });
      }
      reFresh();
    } catch (error) {}
  });

  const carRef = useRef(null);
  const size = useRefHeightResize(carRef);
  const openModal = (_model: 1 | 2) => {
    setMode(_model);
    setOpen(true);
  };
  const openDelete = () => {
    setMode(3);
    ref.current?.open();
  };
  return (
    <div
      ref={carRef}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <SearchForm
        form={form}
        openModal={openModal}
        openDelete={openDelete}
        selectData={selectData}
        onSearch={onSearch}
        pagination={pagination}
      />

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
            <span style={{ paddingLeft: '10px' }}>删除虚拟网关</span>
          </div>
        }
        messageCont={`是否删除编号为${
          selectData?.virtualTgwId ?? ''
        }的虚拟网关`}
      />
    </div>
  );
};

export default VirtualGateWay;
