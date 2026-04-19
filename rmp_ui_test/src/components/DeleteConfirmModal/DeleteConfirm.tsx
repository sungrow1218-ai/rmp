import { Alert, message, Modal } from 'antd';
import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState,
} from 'react';

export interface IProps {
  api: () => Promise<void>;
  messageCont?: string | ReactNode;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onFinish?: () => void;
  title?: string | ReactNode;
  width?: number;
}

export interface IAction {
  open: () => void;
}

const DeleteConfirm = forwardRef<IAction, IProps>(
  ({ onSuccess, onError, onFinish, api, messageCont, title, width }, ref) => {
    const [open, setOpen] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => {
        setOpen(true);
      },
    }));

    return (
      <Modal
        title={title}
        open={open}
        width={width ? width : 500}
        centered={true}
        onCancel={() => setOpen(false)}
        okButtonProps={{ loading: btnLoading }}
        onOk={async () => {
          try {
            setBtnLoading(true);
            await api();
            onSuccess && onSuccess();
            setOpen(false);
          } catch (error: any) {
            console.error(error);
            onError && onError(error);
          } finally {
            setBtnLoading(false);
            onFinish && onFinish();
          }
        }}
      >
        <div style={{ padding: '16px 0' }}> {messageCont}</div>
      </Modal>
    );
  }
);

export default DeleteConfirm;
