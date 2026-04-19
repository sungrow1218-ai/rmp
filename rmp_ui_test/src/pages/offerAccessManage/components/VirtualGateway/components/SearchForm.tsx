import MultipleSelect from '@/components/MultipleSelectRebuild';
import { VirtualGateWayDataType } from '@/services/offerAccessMaage';
import { PaginationType } from '@/services/typing';
import { Button, Form, FormInstance, Input, Radio, Select } from 'antd';
import React from 'react';

interface Props {
  form: FormInstance;
  openModal: (_model: 1 | 2) => void;
  openDelete: () => void;
  selectData?: VirtualGateWayDataType;
  onSearch: (page: number, pageSize: number) => Promise<void | undefined>;
  pagination: PaginationType;
}

const SearchForm: React.FC<Props> = ({
  form,
  openModal,
  openDelete,
  selectData,
  onSearch,
  pagination,
}) => {
  return (
    <div style={{ paddingBottom: '20px' }}>
      <Form form={form}>
        <div style={{ display: 'flex', gap: '35px', flexWrap: 'nowrap' }}>
          <Form.Item
            label={<span style={{ width: '127px' }}>虚拟网关编号</span>}
            name="virtualTgwId"
            style={{ flex: 1 }}
            rules={[
              { pattern: /^[0-9]*$/, message: '请输入正确格式' }, // 校验规则兜底
            ]}
          >
            <Input autoComplete="off" placeholder="请输入交易网关编号" />
          </Form.Item>
          <Form.Item
            label="虚拟网关名称"
            name="virtualTgwName"
            style={{ flex: 1 }}
          >
            <Input autoComplete="off" placeholder="请输入虚拟网关名称" />
          </Form.Item>
          <Form.Item
            label="服务端口"
            name="virtualSvrPort"
            style={{ flex: 1 }}
            rules={[
              { pattern: /^[0-9]*$/, message: '请输入正确格式' }, // 校验规则兜底
            ]}
          >
            <Input autoComplete="off" placeholder="请输入服务端口" />
          </Form.Item>
          <Form.Item
            label="交易系统编号"
            name="extSysId"
            style={{ flex: 1 }}
            rules={[{ pattern: /^[0-9]*$/, message: '请输入正确格式' }]}
          >
            <Input autoComplete="off" placeholder="请输入交易系统编号" />
          </Form.Item>
          <Form.Item
            label="交易子系统编号"
            name="extSubsysId"
            style={{ flex: 1 }}
          >
            <Input autoComplete="off" placeholder="请输入交易子系统编号" />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '35px', flexWrap: 'nowrap' }}>
          <Form.Item
            label={<span style={{ width: '127px' }}>风控调用标志</span>}
            name="toRiskFlag"
            style={{ flex: 1, marginBottom: 0 }}
          >
            <Select
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
              allowClear={true}
            />
            {/* <MultipleSelect
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
            /> */}
          </Form.Item>

          <div style={{ flex: 1, display: 'flex' }}>
            <Button
              style={{ marginRight: '10px' }}
              onClick={() => {
                form.resetFields();
              }}
            >
              重置
            </Button>
            <Button
              type="primary"
              onClick={() => {
                onSearch(1, pagination.pageSize);
              }}
            >
              查询
            </Button>
          </div>
          <div style={{ flex: 1 }}></div>
          <div style={{ flex: 1 }}></div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'end',
              flexWrap: 'nowrap',
            }}
          >
            <Button
              type="primary"
              style={{ marginRight: '10px' }}
              onClick={() => {
                openModal(1);
              }}
            >
              添加
            </Button>
            <Button
              type="primary"
              style={{ marginRight: '10px' }}
              onClick={() => {
                openModal(2);
              }}
              disabled={!selectData}
            >
              修改
            </Button>
            <Button
              type="primary"
              disabled={!selectData}
              onClick={() => {
                openDelete();
              }}
            >
              删除
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SearchForm;
