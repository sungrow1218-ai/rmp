import React, { useState } from 'react';
import { Button } from 'antd';
import styles from '../../EditRule/styles.less';

interface Props {
  onSubmit: () => Promise<any>;
  onClose: () => void;
}
const FooterButton: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [loading, setLoading] = useState(false);

  const doSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.footer}>
      <Button
        type="primary"
        loading={loading}
        onClick={doSubmit}
        style={{ marginLeft: '16px' }}
      >
        确认
      </Button>
      <Button onClick={onClose}>取消</Button>
    </div>
  );
};

export default FooterButton;
