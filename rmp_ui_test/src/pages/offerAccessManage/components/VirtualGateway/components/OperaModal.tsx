import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  FormInstance,
  Radio,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { tranFromDataToOptionNoAll } from '@/utils/utils';
import { VirtualGateWayDataType } from '@/services/offerAccessMaage';
import type { RuleObject } from 'antd/es/form';
import TextArea from 'antd/es/input/TextArea';

interface Props {
  open: boolean;
  mode: number;
  form: FormInstance;
  onClose: () => void;
  selectData: VirtualGateWayDataType | undefined;
  onEdit: () => Promise<void>;
}
const OperaModal: React.FC<Props> = ({
  open,
  mode,
  onClose,
  form,
  selectData,
  onEdit,
}) => {
  const marketId = Form.useWatch('marketId', form);

  useEffect(() => {
    if (mode === 2 && selectData && open) {
      form.setFieldsValue({
        ...selectData,
      });
    }
  }, [selectData, mode, form, open]);
  return (
    <div>
      <Modal
        title={mode === 1 ? '新增虚拟网关' : '修改虚拟网关'}
        open={open}
        onCancel={() => {
          onClose();
        }}
        destroyOnHidden={true}
        maskClosable={false}
        onOk={onEdit}
        centered={true}
        width={600}
      >
        <Form form={form} style={{ marginTop: '16px' }} labelCol={{ span: 6 }}>
          <Form.Item label="虚拟网关编号" name="virtualTgwId">
            <Input
              autoComplete="off"
              style={{ width: '100%' }}
              disabled={true}
              placeholder={mode === 1 ? '系统自动生成' : ''}
            />
          </Form.Item>
          <Form.Item
            label="虚拟网关名称"
            name="virtualTgwName"
            rules={[{ required: true }]}
          >
            <Input autoComplete="off" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="服务端口"
            rules={[
              {
                required: true,
              },
              {
                validator: (_, value) => {
                  if (value < 0 || value > 65535) {
                    return Promise.reject(
                      new Error('端口号范围大于0且小于65535')
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            name="virtualSvrPort"
          >
            <InputNumber
              style={{ width: '100%' }}
              autoComplete="off"
              controls={false}
              precision={0}
            />
          </Form.Item>

          <Form.Item
            label="交易系统编号"
            name="extSysId"
            rules={[
              { required: true },
              { pattern: /^[0-9]*$/, message: '请输入正确格式' },
            ]}
          >
            <Input autoComplete="off" style={{ width: '100%' }} max={10} />
          </Form.Item>
          <Form.Item
            label="交易子系统编号"
            name="extSubsysId"
            rules={[{ required: true }]}
          >
            <Input autoComplete="off" style={{ width: '100%' }} max={10} />
          </Form.Item>
          <Form.Item
            label="委托起始申报号"
            name="beginOrderId"
            rules={[{ required: true }]}
          >
            <Input autoComplete="off" style={{ width: '100%' }} max={10} />
          </Form.Item>
          <Form.Item
            label="委托结束申报号"
            name="endOrderId"
            rules={[{ required: true }]}
          >
            <Input autoComplete="off" style={{ width: '100%' }} max={10} />
          </Form.Item>
          <Form.Item
            label="风控调用标志"
            name="toRiskFlag"
            rules={[{ required: true }]}
          >
            <Radio.Group
              options={[
                {
                  value: 1,
                  label: '开启',
                },
                {
                  value: 0,
                  label: '关闭',
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="tgw协议类型"
            name="tgwProtocolType"
            rules={[{ required: true }]}
          >
            <Radio.Group
              options={[
                {
                  value: 1,
                  label: 'AST标准',
                },
                {
                  value: 0,
                  label: '交易所标准',
                },
              ]}
            />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <TextArea style={{ width: '100%', marginTop: 0 }} rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OperaModal;
