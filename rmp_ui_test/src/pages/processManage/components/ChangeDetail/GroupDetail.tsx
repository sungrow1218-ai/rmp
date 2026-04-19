import React, { useEffect, useState } from 'react';
import { Input, Modal, Form } from '@ht/sprite-ui';

interface Props {
  data: any;
  setOpen: (value: boolean) => void;
}

const GroupDetail = ({ data, setOpen }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue('groupId', data?.groupId);
    form.setFieldValue('groupName', data?.groupName);
  }, [data, form]);

  return (
    <Modal
      width={420}
      open={true}
      centered={true}
      onCancel={() => {
        setOpen(false);
      }}
      title={'分组详情'}
      footer={[]}
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ flex: 1 }}>
        <Form.Item label="分组序号" name="groupId">
          <Input placeholder="自动生成" disabled={true} />
        </Form.Item>
        <Form.Item
          rules={[
            { required: true },
            { max: 64, message: '名称长度不超过64个字符' },
            {
              validator: (_, _value: string) => {
                if (_value && _value.trim() === '') {
                  return Promise.reject('请输入分组名称');
                }
                return Promise.resolve();
              },
            },
          ]}
          label="分组名称"
          name="groupName"
        >
          <Input disabled={true} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GroupDetail;
