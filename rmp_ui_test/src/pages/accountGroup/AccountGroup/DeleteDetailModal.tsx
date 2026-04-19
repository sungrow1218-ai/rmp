import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Modal, Table } from '@ht/sprite-ui';

interface FaultItem {
  acctCode: string;
  acctName: string;
  errorId: number;
  errorInfo: string;
  extSysId: number;
  marketId: number;
  accountTypeName?: string;
}

export interface IAction {
  open: (faultList: FaultItem[]) => void;
}

const DeleteDetailModal = forwardRef<IAction>((_, ref) => {
  const [open, setOpen] = useState(false);

  const [faultList, setFaultList] = useState<FaultItem[]>([]);

  const columns = [
    {
      title: '账户类型',
      dataIndex: 'acctTypeName',
      key: 'acctTypeName',
      width: 100,
    },
    {
      title: '账户编码',
      dataIndex: 'acctCode',
      key: 'acctCode',
      width: 100,
    },
    {
      title: '账户名称',
      dataIndex: 'acctName',
      key: 'acctName',
      width: 150,
    },
    {
      title: '失败原因',
      dataIndex: 'errorInfo',
      key: 'errorInfo',
      width: 300,
    },
  ];

  useImperativeHandle(ref, () => ({
    open: (faultList: FaultItem[]) => {
      setOpen(true);
      setFaultList(faultList);
    },
  }));

  return (
    <Modal
      title={'账号删除失败'}
      open={open}
      onCancel={() => setOpen(false)}
      width={800}
      centered={true}
      footer={[
        <Button key="close" type="primary" onClick={() => setOpen(false)}>
          关闭
        </Button>,
      ]}
      bodyStyle={{ padding: '24px 24px 16px' }}
    >
      <Table
        dataSource={faultList}
        columns={columns}
        rowKey={(r: FaultItem) => `${r.extSysId}-${r.marketId}-${r.acctCode}`}
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
        size="middle"
        locale={{ emptyText: '暂无失败记录' }}
        style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      />
    </Modal>
  );
});

export default DeleteDetailModal;
