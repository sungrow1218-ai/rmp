import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { Form, Modal, Input } from '@ht/sprite-ui';
import { RoleBaseInfoResState } from '../roleManage/contant/typing';
import MultipleSelect from '@/components/MultipleSelectRebuild';

interface IProps {
  onConfirm: (value: { [x: string]: any; roleId: any[] }) => Promise<void>;
  roleData: RoleBaseInfoResState[];
}

export interface IAction {
  open: () => void;
}

const UserModal = forwardRef<IAction, IProps>(
  ({ roleData, onConfirm }, ref) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOk = async () => {
      try {
        setLoading(true);
        const values = await form.validateFields();
        await onConfirm(values);
        form.resetFields();
        setOpen(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const getOptions = useMemo(
      () =>
        roleData.map((a) => {
          return {
            label: a.roleName,
            value: a.roleId,
          };
        }),
      [roleData]
    );

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
    }));

    return (
      <Modal
        title="新建用户"
        open={open}
        width={440}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        onOk={handleOk}
        confirmLoading={loading}
        maskClosable={false}
        bodyStyle={{ minHeight: '160px' }}
        destroyOnClose={true}
        centered={true}
      >
        <Form
          name="form"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ flex: 1 }}
        >
          <Form.Item
            name={'userCode'}
            label={'用户编码'}
            rules={[{ required: true, message: '请输入用户编码' }]}
          >
            <Input
              placeholder="请输入用户编码"
              autoComplete="off"
              allowClear={true}
            />
          </Form.Item>
          <Form.Item
            name={'roleId'}
            label={'角色'}
            rules={[{ required: true, message: '请选择角色', type: 'array' }]}
          >
            <MultipleSelect
              placeholder="请选择角色"
              style={{ width: '100%' }}
              options={getOptions}
              allowClear={true}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

export default UserModal;
