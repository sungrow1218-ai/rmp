import React, { useState } from 'react';
import { Modal, Button } from '@ht/sprite-ui';
import { ExclamationCircleOutlined } from '@ht-icons/sprite-ui-react';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}
const goNewPage = () => {
  window.location.href = 'http://eipnew.htsc.com.cn/aegis';
};

const WarnModal: React.FC<Props> = ({ open, setOpen }) => {
  return (
    <div>
      <Modal
        open={open}
        // className={styles.confirmModal}
        centered={true}
        closable={false}
        okText={''}
        footer={
          <Button
            type="primary"
            onClick={() => {
              setOpen(false);
            }}
          >
            已知悉
          </Button>
        }
      >
        <div style={{ paddingLeft: 24 }}>
          <ExclamationCircleOutlined
            style={{ color: '#bb744a', fontSize: 20, paddingTop: 20 }}
          />
          <span style={{ fontSize: 16, paddingLeft: 10 }}>
            复核审批动作请前往堡垒机操作，操作地址为
            <Button type="link">http://eipnew.htsc.com.cn/aegis</Button>
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default WarnModal;
