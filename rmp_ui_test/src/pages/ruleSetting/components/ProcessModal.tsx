import React, { useState } from 'react';
import { Button, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ht-icons/sprite-ui-react';
import { queryProcess } from '@/services/process';
import { useMemoizedFn } from 'ahooks';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  onProcessResult: (value: number) => void;
  alterType: number;
  procedureCode: string;
}

const ProcessModal: React.FC<Props> = ({
  open,
  setOpen,
  onProcessResult,
  alterType,
  procedureCode,
}) => {
  const [secondModal, setSecondModal] = useState(false);

  const handleSecondModalCancel = () => {
    setSecondModal(false);
    onProcessResult(3);
  };

  const queryisProcess = useMemoizedFn(async () => {
    try {
      if (!procedureCode) {
        return;
      }

      const res = await queryProcess({
        procedureCode,
        approval: 3,
      });
      if (res.code !== 0) {
        // message.error(res.message);
        setOpen(false);
        onProcessResult(5);
        return;
      }
      message.success('终止流程成功');
      if (alterType === 3) {
        setOpen(false);
        onProcessResult(4);
      } else {
        setOpen(false);
        setSecondModal(true);
      }
    } catch (error) {
      // message.error({ content: `终止流程失败` });
    }
  });
  return (
    <div>
      <Modal
        open={open}
        // className={styles.confirmModal}
        centered={true}
        onCancel={() => {
          setOpen(false);
        }}
        maskClosable={false}
        okText={'是'}
        cancelText={'否'}
        closable={false}
        onOk={() => {
          queryisProcess();
        }}
      >
        <div style={{ paddingLeft: 24 }}>
          <ExclamationCircleOutlined
            style={{ color: '#1890ff', fontSize: 20, paddingTop: 20 }}
          />
          <span style={{ fontSize: 16, paddingLeft: 10 }}>
            已有在途流程，是否继续编辑?
          </span>
        </div>
      </Modal>
      <Modal
        open={secondModal}
        // className={styles.confirmModal}
        centered={true}
        onCancel={() => {
          setSecondModal(false);
          onProcessResult(2);
        }}
        maskClosable={false}
        okText={'继续编辑'}
        cancelText={'重新开始'}
        closable={false}
        onOk={handleSecondModalCancel}
      >
        <div style={{ paddingLeft: 24 }}>
          <ExclamationCircleOutlined
            style={{ color: '#1890ff', fontSize: 20, paddingTop: 20 }}
          />
          <span style={{ fontSize: 16, paddingLeft: 10 }}>
            是否继续上次的编辑？
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default ProcessModal;
