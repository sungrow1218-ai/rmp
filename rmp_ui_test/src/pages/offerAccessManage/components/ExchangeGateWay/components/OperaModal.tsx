import {
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Spin,
  FormInstance,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';

import { tranFromDataToOption, tranFromDataToOptionNoAll } from '@/utils/utils';
import {
  configExchangeGateWay,
  ConfigExchangeGateWayParams,
  ExchangeGateWayDataType,
} from '@/services/offerAccessMaage';
import type { RuleObject } from 'antd/es/form';
import TextArea from 'antd/es/input/TextArea';
import { useMemoizedFn } from 'ahooks';
import {
  OFFER_CHANNEL_tYPE,
  OFFER_TRADING_MARKETS,
} from '@/utils/offerAccseeDict';

const validateIPv4 = (_: RuleObject, value: string) => {
  if (!value) {
    return Promise.reject(new Error('请输入IPv4地址格式'));
  }
  const ipSegments = value.split('.');
  if (ipSegments.length !== 4) {
    return Promise.reject(new Error('请输入IPv4地址格式'));
  }
  for (const segment of ipSegments) {
    if (!/^\d+$/.test(segment)) {
      return Promise.reject(new Error(`请输入IPv4地址格式`));
    }
    const num = parseInt(segment, 10);
    if (num < 0 || num > 255) {
      return Promise.reject(new Error(`请输入IPv4地址格式`));
    }
    if (segment.length > 1 && segment.startsWith('0')) {
      return Promise.reject(new Error(`请输入IPv4地址格式`));
    }
  }
  return Promise.resolve();
};

interface Props {
  open: boolean;
  mode: number;
  form: FormInstance;
  onClose: () => void;
  selectData: ExchangeGateWayDataType | undefined;
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
        marketId: String(selectData.marketId),
        offerChannelType: String(selectData.offerChannelType),
      });
    } else {
      form.resetFields();
    }
  }, [selectData, mode, form, open]);
  return (
    <div>
      <Modal
        title={mode === 1 ? '新增交易所网关' : '修改交易所网关'}
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
        <Form form={form} style={{ marginTop: '16px' }} labelCol={{ span: 5 }}>
          <Form.Item label="交易网关编号" name="tgwId">
            <Input
              autoComplete="off"
              style={{ width: '100%' }}
              disabled={true}
              placeholder={mode === 1 ? '系统自动生成' : ''}
            />
          </Form.Item>

          <Form.Item
            label="交易市场"
            rules={[{ required: true }]}
            name="marketId"
          >
            <Select
              disabled={mode === 2}
              style={{ width: '100%' }}
              allowClear={true}
              options={tranFromDataToOptionNoAll({
                data: OFFER_TRADING_MARKETS,
                labelFild: 'name',
                valueFild: 'code',
              })}
            />
          </Form.Item>
          <Form.Item
            label="报盘通用类型"
            rules={[{ required: true }]}
            name="offerChannelType"
          >
            <Select
              disabled={mode === 2}
              style={{ width: '100%' }}
              allowClear={true}
              options={tranFromDataToOptionNoAll({
                data: OFFER_CHANNEL_tYPE,
                labelFild: 'name',
                valueFild: 'code',
              })}
            />
          </Form.Item>
          <Form.Item
            label="TGW地址"
            rules={[{ required: true, validator: validateIPv4 }]}
            name="tgwSvrIp"
          >
            <Input autoComplete="off" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="TGW端口"
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
            name="tgwSvrPort"
          >
            <InputNumber
              style={{ width: '100%' }}
              autoComplete="off"
              controls={false}
              precision={0}
            />
          </Form.Item>
          <Form.Item
            label="发送方标识"
            rules={[{ required: true }]}
            name="senderCompId"
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="接收方标识"
            rules={[{ required: true }]}
            name="targetCompId"
          >
            <Input autoComplete="off" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="应用版本号"
            rules={[{ required: true }]}
            name="appVersion"
            help={
              <span style={{ color: 'red' }}>注：格式1.10，最小版本号0.50</span>
            }
          >
            <Input autoComplete="off" style={{ width: '100%' }} />
          </Form.Item>
          {marketId === '2' && (
            <Form.Item
              label="登录密码"
              rules={[{ required: true }]}
              name="loginPassword"
            >
              <Input.Password
                autoComplete="new-password"
                autoCapitalize="off"
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
          <Form.Item
            label="心跳间隔"
            rules={[{ required: true }]}
            name="heartBeatInterval"
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              autoComplete="off"
              addonAfter={'秒'}
              precision={0}
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
