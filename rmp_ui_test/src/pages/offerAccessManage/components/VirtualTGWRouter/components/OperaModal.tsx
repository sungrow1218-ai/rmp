import { Form, Input, Modal, Select, FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';

import {
  queryExchangeGateWay,
  queryVirtualGateWay,
  VirtualTGWRouterDataType,
} from '@/services/offerAccessMaage';
import TextArea from 'antd/es/input/TextArea';

interface Props {
  open: boolean;
  mode: number;
  form: FormInstance;
  onClose: () => void;
  selectData: VirtualTGWRouterDataType | undefined;
  onEdit: () => Promise<void>;
}
type Options = {
  label: string;
  value: number;
}[];
const OperaModal: React.FC<Props> = ({
  open,
  mode,
  onClose,
  form,
  selectData,
  onEdit,
}) => {
  const [tgwOptin, setTgwOption] = useState<Options>([]);
  const [virtualTgwOptin, setVirtualTgwOption] = useState<Options>([]);
  useEffect(() => {
    if (mode === 2 && selectData && open) {
      form.setFieldsValue({
        ...selectData,
        virtualTgwId: selectData.virtualTgw.virtualTgwId,
        tgwId: selectData.tgw.tgwId,
      });
    }
  }, [selectData, mode, form, open]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await queryExchangeGateWay({
          pageId: 1,
          pageSize: 5000,
        });
        if (res.code !== 0) {
          throw new Error('获取交易网关失败');
        }
        if (res.data && res.data.resultList) {
          const list = res.data.resultList.map((p) => {
            return {
              label: `网关编号[${p.tgwId}] 地址[${p.tgwSvrIp}]`,
              value: p.tgwId,
            };
          });
          setTgwOption(list);
        }
      } catch (error) {}
    };
    const fetch1 = async () => {
      try {
        const res = await queryVirtualGateWay({
          pageId: 1,
          pageSize: 5000,
        });
        if (res.code !== 0) {
          throw new Error('获取虚拟网关失败');
        }
        if (res.data && res.data.resultList) {
          const list = res.data.resultList.map((p) => {
            return {
              label: `${p.virtualTgwId}.${p.virtualTgwName}`,
              value: p.virtualTgwId,
            };
          });
          setVirtualTgwOption(list);
        }
      } catch (error) {}
    };
    if (open) {
      fetch();
      fetch1();
    }
  }, [open]);
  return (
    <div>
      <Modal
        title={mode === 1 ? '新增报盘路由' : '修改报盘路由'}
        open={open}
        onCancel={() => {
          onClose();
        }}
        destroyOnHidden={true}
        maskClosable={false}
        onOk={onEdit}
        centered={true}
        width={650}
      >
        <Form form={form} style={{ marginTop: '16px' }} labelCol={{ span: 5 }}>
          <Form.Item
            label="虚拟网关"
            rules={[{ required: true }]}
            name="virtualTgwId"
          >
            <Select
              options={virtualTgwOptin}
              allowClear={true}
              showSearch={true}
              filterOption={(value, option) => {
                if (option) {
                  return option.label.includes(value);
                } else {
                  return false;
                }
              }}
            />
          </Form.Item>
          <Form.Item label="交易网关" rules={[{ required: true }]} name="tgwId">
            <Select
              options={tgwOptin}
              allowClear={true}
              showSearch={true}
              filterOption={(value, option) => {
                if (option) {
                  return option.label.includes(value);
                } else {
                  return false;
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="报盘代理节点号"
            name="tgwAgentId"
            rules={[
              { required: true },
              { pattern: /^[0-9]*$/, message: '请输入正确格式' }, // 校验规则兜底
            ]}
          >
            <Input
              autoComplete="off"
              style={{ width: '260px' }}
              placeholder="请输入分片序号"
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
