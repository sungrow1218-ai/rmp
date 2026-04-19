import React from 'react';
import { Button, Modal, Table, message } from '@ht/sprite-ui';
import AccountGroupSubmitButton from './AddAccountTree/AccountGroupSubmitButton';
import styles from './ImportModal/ImportModal.less';

export interface FaultItem {
  acctCode?: string;
  acctName?: string;
  errorId?: number;
  errorInfo?: string;
  extSysId?: number | string;
  marketId?: number | string;
  accountTypeName?: string;
  // 可选：如果你在上游就已经带了唯一 id，可以直接拿来做 rowKey
  __uid__?: string;
}

interface FaultListModalProps {
  topTitle: string;
  tips: string;
  faultList: FaultItem[];
  visible: boolean;
  /** 是否显示“再次提交”按钮 */
  isReSubmit?: boolean;
  onClose: () => void;
  onCloseParent?: () => void;

  acctGroupId?: number;
  unitLabel?: string;
  onResubmitSuccess?: (count: number) => void;
  onResubmitFault?: (faultList: any[]) => void;
  onRefresh: () => void;
}

const FaultListModal: React.FC<FaultListModalProps> = ({
  topTitle,
  tips,
  faultList,
  visible,
  isReSubmit = true,
  onClose,
  onCloseParent,
  onRefresh,
  acctGroupId,
  unitLabel,
  onResubmitSuccess,
  onResubmitFault,
}) => {
  const columns = React.useMemo(() => {
    if (topTitle === '账户添加失败') {
      return [
        {
          title: '账户类型',
          dataIndex: 'accountTypeName',
          key: 'accountTypeName',
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
      ];
    } else {
      return [
        {
          title: '账户类型',
          dataIndex: 'accountTypeName',
          key: 'accountTypeName',
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
    }
  }, [topTitle]);

  const dataSource = React.useMemo(() => {
    return (faultList || []).map((it, idx) => {
      const ext = String(it.extSysId ?? '');
      const mk = String(it.marketId ?? '');
      const cd = String(it.acctCode ?? '');
      const uid = it.__uid__ || `${ext}__${mk}__${cd}__${idx}`;
      return { ...it, __rowKey: uid };
    });
  }, [faultList]);

  const acctList = React.useMemo(
    () =>
      (faultList || []).map((it) => ({
        acctCode: String(it.acctCode ?? ''),
        acctName: String(it.acctName || ''),
        marketId: Number((it.marketId as any) ?? -1),
        extSysId: Number((it.extSysId as any) ?? -1),
      })),
    [faultList]
  );

  const canResubmit = Number.isFinite(acctGroupId) && acctList.length > 0;
  const closeAll = () => {
    onClose();
    onCloseParent?.();
  };

  return (
    <Modal
      className={styles.faultListModal}
      title={topTitle}
      open={visible}
      onCancel={onClose}
      width={800}
      centered={true}
      footer={[
        <Button key="close" type="primary" onClick={closeAll}>
          关闭
        </Button>,
        ...(isReSubmit
          ? [
              <AccountGroupSubmitButton
                key="resubmit"
                type="primary"
                disabled={!canResubmit}
                payload={{
                  acctGroupId: Number(acctGroupId),
                  acctList,
                  unitLabel,
                }}
                onSuccess={(n) => {
                  onResubmitSuccess?.(n);
                  onClose?.();
                  onCloseParent?.();
                  onRefresh();
                }}
                onFault={(fault) => {
                  if (onResubmitFault) onResubmitFault(fault || []);
                  else message.warning('仍有账户提交失败，请检查失败列表');
                }}
              >
                再次提交
              </AccountGroupSubmitButton>,
            ]
          : []),
      ]}
      destroyOnClose={true}
    >
      <div
        style={{
          marginBottom: '12px',
          backgroundColor: '#fffbe6',
          padding: '12px 16px',
          borderRadius: '4px',
          border: '1px solid #ffe58f',
          color: '#faad14',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        <span style={{ fontWeight: 'bold', marginRight: 4 }}>!</span>
        {tips}
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="__rowKey"
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
        }}
        scroll={{ x: true }}
        size="middle"
        locale={{ emptyText: '暂无失败记录' }}
        style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      />
    </Modal>
  );
};

export default FaultListModal;
