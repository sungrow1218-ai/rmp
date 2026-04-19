import { Button, Form, FormInstance, Input } from 'antd';
import React from 'react';

import { PaginationType } from '@/services/typing';

interface Props {
  form: FormInstance;
  onSearch: (page: number, pageSize: number) => Promise<void | undefined>;
  pagination: PaginationType;
}

const SearchForm: React.FC<Props> = ({ form, onSearch, pagination }) => {
  return (
    <div style={{ paddingBottom: '20px' }}>
      <Form form={form} layout="inline">
        <Form.Item
          label="虚拟网关编号"
          name="virtualTgwId"
          rules={[
            { pattern: /^[0-9]*$/, message: '请输入正确格式' }, // 校验规则兜底
          ]}
        >
          <Input
            autoComplete="off"
            style={{ width: '260px' }}
            placeholder="请输入交易网关编号"
          />
        </Form.Item>
        <Form.Item
          label="服务端口"
          name="virtualSvrPort"
          rules={[
            { pattern: /^[0-9]*$/, message: '请输入正确格式' }, // 校验规则兜底
          ]}
        >
          <Input
            autoComplete="off"
            style={{ width: '260px' }}
            placeholder="请输入服务端口"
          />
        </Form.Item>
        <Form.Item
          label="交易网关编号"
          name="tgwId"
          rules={[
            { pattern: /^[0-9]*$/, message: '请输入正确格式' }, // 校验规则兜底
          ]}
        >
          <Input
            autoComplete="off"
            style={{ width: '260px' }}
            placeholder="请输入交易网关编号"
          />
        </Form.Item>
        <Form.Item>
          <Button
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              onSearch(1, pagination.pageSize);
            }}
          >
            查询
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchForm;
