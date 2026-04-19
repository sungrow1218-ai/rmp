import { BasicColumn, BasicTable } from '@/components/Table';
import { Alert, message, Modal } from 'antd';
import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState,
} from 'react';

export interface IProps {
  columns: BasicColumn[];
  api: (tableData: Recordable[]) => Promise<void>;
  alertMessage?: string | ReactNode;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onFinish?: () => void;
  title?: string;
  width?: number;
}

export interface IAction {
  open: (tableData: Recordable[]) => void;
}

const DeleteConfirm = forwardRef<IAction, IProps>(
  (
    {
      onSuccess,
      onError,
      onFinish,
      api,
      columns = [],
      alertMessage,
      title,
      width,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [tableData, setTableData] = useState<Recordable[]>([]);
    const [btnLoading, setBtnLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      open: async (record) => {
        setOpen(true);
        setTableData(record);
      },
    }));

    return (
      <Modal
        title={title}
        open={open}
        width={width ? width : 1000}
        onCancel={() => setOpen(false)}
        okButtonProps={{ loading: btnLoading }}
        onOk={async () => {
          try {
            setBtnLoading(true);
            await api(tableData);
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
        <div style={{ padding: '16px 0' }}>
          {alertMessage ? (
            <Alert
              message={alertMessage}
              type="warning"
              // showIcon={true}
              // closable={true}
              style={{ marginBottom: '16px' }}
              banner={true}
            />
          ) : null}
          <BasicTable
            columns={columns}
            dataSource={tableData}
            pagination={false}
          />
        </div>
      </Modal>
    );
  }
);

export default DeleteConfirm;
