import React, { useState } from 'react';
import { Modal, Button } from '@ht/sprite-ui';
import { ExclamationCircleOutlined } from '@ht-icons/sprite-ui-react';
import ReactDOM, { createPortal } from 'react-dom';

interface Props {
  title: string;
  content: string;
  onOk: (value?: any) => void;
}
const customWarning = ({ title, content, onOk }: Props) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
    if (onOk) {
      onOk();
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const portalRoot = document.createElement('div');
  document.body.appendChild(portalRoot);

  return createPortal(
    <div>
      <Button type="primary" onClick={showModal}>
        显示警告模态框
      </Button>
      <Modal
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="确定"
      >
        <div style={{ paddingLeft: 24 }}>
          <ExclamationCircleOutlined
            style={{ color: '#bb744a', fontSize: 20, paddingTop: 20 }}
          />
          <span style={{ fontSize: 16, paddingLeft: 10 }}>{content}</span>
        </div>
      </Modal>
    </div>,
    portalRoot
  );
};

export default customWarning;
