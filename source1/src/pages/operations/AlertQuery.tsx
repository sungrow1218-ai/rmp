import React, { useState } from 'react';
import { Table, Input, Select, Button, Space, Typography, DatePicker, Radio, Tag } from 'antd';
import { SearchOutlined, ExportOutlined, SettingOutlined, AlertOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './style.css';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface AlertRecord {
id: string;
businessDate: string;
alertTime: string;
alertObject: string;
ruleNo: string;
ruleName: string;
ruleType: string;
symbol: string;
direction: string;
alertAction: string;
alertDesc: string;
externalSysNo: string;
market: string;
orderNo: string;
account: string;
grayFlag: string;
}

const mockData: AlertRecord[] = Array.from({ length: 20 }).map((_, i) => ({
id: `A${1000 + i}`,
businessDate: '2023-10-25',
alertTime: '10:30:15',
alertObject: '张三',
ruleNo: `R${5000 + i}`,
ruleName: i % 2 === 0 ? '连续竞价阶段拉抬打压控制' : '收盘集合竞价拉抬打压',
ruleType: '异常交易类',
symbol: '600519',
direction: i % 2 === 0 ? '买入' : '卖出',
alertAction: i % 3 === 0 ? '三级预警' : (i % 2 === 0 ? '二级预警' : '一级预警'),
alertDesc: '触发一级阈值',
externalSysNo: `EXT${8000 + i}`,
market: '上海证券交易所',
orderNo: `O${9000 + i}`,
account: 'A123456789',
grayFlag: '正式',
}));

export const AlertQuery: React.FC = () => {
const [loading, setLoading] = useState(false);
const [alertType, setAlertType] = useState('today');

const handleSearch = () => {
setLoading(true);
setTimeout(() => setLoading(false), 500);
};

const columns: ColumnsType<AlertRecord> = [
{ title: '业务日期', dataIndex: 'businessDate', width: 100 },
{ title: '触警时间', dataIndex: 'alertTime', width: 100 },
{ title: '触警对象', dataIndex: 'alertObject', width: 100 },
{ title: '所属编号', dataIndex: 'ruleNo', width: 100 },
{ title: '所属名称', dataIndex: 'ruleName', width: 180 },
{ 
  title: '规则类型', 
  dataIndex: 'ruleType', 
  width: 120,
  render: (text) => (
    <span className="text-[#1890ff] border border-[#1890ff] px-2 py-0.5 rounded text-xs bg-[#e6f7ff]">
      {text}
    </span>
  )
},
{ title: '证券代码', dataIndex: 'symbol', width: 100 },
{ 
  title: '委托方向', 
  dataIndex: 'direction', 
  width: 80,
  render: (text) => {
    if (text === '买入') {
      return <span className="text-[#ff4d4f] bg-[#fff1f0] border border-[#ffa39e] px-2 py-0.5 rounded text-xs">{text}</span>;
    }
    if (text === '卖出') {
      return <span className="text-[#52c41a] bg-[#f6ffed] border border-[#b7eb8f] px-2 py-0.5 rounded text-xs">{text}</span>;
    }
    return text;
  }
},
{ 
  title: '触警操作', 
  dataIndex: 'alertAction', 
  width: 100,
  render: (text) => {
    let color = 'default';
    if (text === '三级预警') color = 'error';
    if (text === '二级预警') color = 'warning';
    if (text === '一级预警') color = 'processing';
    return <Tag color={color}>{text}</Tag>;
  }
},
{ title: '触警说明', dataIndex: 'alertDesc', width: 150 },
{ title: '外部系统号', dataIndex: 'externalSysNo', width: 120 },
{ title: '交易市场', dataIndex: 'market', width: 120 },
{ title: '委托编号', dataIndex: 'orderNo', width: 120 },
{ title: '账户', dataIndex: 'account', width: 120 },
{ title: '灰度标志', dataIndex: 'grayFlag', width: 80 },
{
  title: '操作',
  key: 'action',
  width: 80,
  fixed: 'right',
  render: () => <a className="text-[#1890ff] hover:text-[#096dd9]">查看</a>,
},
];

return (
<div className="p-6 h-full flex flex-col absolute inset-0 bg-gray-50">
  <div className="mb-4 shrink-0 flex items-center gap-2">
    <AlertOutlined className="text-[#1890ff] text-xl" />
    <Title level={4} style={{ margin: 0 }}>触警信息查询</Title>
  </div>

  {/* 搜索区 */}
  <div className="bg-white p-5 rounded-lg border border-gray-200 mb-4 shrink-0 shadow-sm">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4 mb-4">
      <div className="flex items-center">
        <span className="text-gray-600 w-20 text-right mr-3 shrink-0">工作台:</span>
        <Select placeholder="请选择工作台" className="flex-1" allowClear />
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 w-20 text-right mr-3 shrink-0">规则类型:</span>
        <Select placeholder="请选择" className="flex-1" allowClear />
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 w-20 text-right mr-3 shrink-0">触警对象:</span>
        <Select placeholder="请选择" className="flex-1" allowClear />
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 w-20 text-right mr-3 shrink-0">规则编号:</span>
        <Select placeholder="请选择" className="flex-1" allowClear />
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 w-20 text-right mr-3 shrink-0">对接系统:</span>
        <Select placeholder="请选择" className="flex-1" allowClear />
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 w-20 text-right mr-3 shrink-0">交易市场:</span>
        <Select placeholder="请选择" className="flex-1" allowClear />
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 w-20 text-right mr-3 shrink-0">证券代码:</span>
        <Input placeholder="请输入" className="flex-1" allowClear />
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 w-20 text-right mr-3 shrink-0">委托编号:</span>
        <Input placeholder="请输入" className="flex-1" allowClear />
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 w-20 text-right mr-3 shrink-0">账户:</span>
        <Input placeholder="请输入" className="flex-1" allowClear />
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 w-20 text-right mr-3 shrink-0">委托方向:</span>
        <Select placeholder="请选择委托方向" className="flex-1" allowClear />
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 w-20 text-right mr-3 shrink-0">灰度标志:</span>
        <Select placeholder="请选择" defaultValue="正式" className="flex-1" allowClear>
          <Select.Option value="正式">正式</Select.Option>
          <Select.Option value="灰度">灰度</Select.Option>
        </Select>
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 w-20 text-right mr-3 shrink-0">触警日期:</span>
        <RangePicker className="flex-1" />
      </div>
    </div>
    
    <div className="flex justify-between items-center mt-2">
      <div className="flex items-center">
        <span className="w-20 mr-3 shrink-0"></span>
        <Radio.Group value={alertType} onChange={e => setAlertType(e.target.value)}>
          <Radio value="today">当日触警</Radio>
          <Radio value="history">历史触警</Radio>
        </Radio.Group>
      </div>
      <Space>
        <Button>重置</Button>
        <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={handleSearch}>
          查询
        </Button>
      </Space>
    </div>
  </div>

  {/* 表格区 */}
  <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden p-4">
    <div className="flex justify-between items-center mb-4 shrink-0">
      <div className="flex gap-3">
        <div className="px-4 py-1.5 bg-[#ff4d4f] text-white rounded cursor-pointer hover:bg-[#ff7875] transition-colors text-sm font-medium">三级预警 0</div>
        <div className="px-4 py-1.5 bg-[#fff7e6] text-[#fa8c16] border border-[#ffd591] rounded cursor-pointer hover:bg-[#ffe7ba] transition-colors text-sm font-medium">二级预警 0</div>
        <div className="px-4 py-1.5 bg-[#e6f7ff] text-[#1890ff] border border-[#91d5ff] rounded cursor-pointer hover:bg-[#bae0ff] transition-colors text-sm font-medium">一级预警 0</div>
        <div className="px-4 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> 全部 0
        </div>
      </div>
      <Space>
        <Button icon={<ExportOutlined />} className="text-[#1890ff] border-[#1890ff] hover:!text-[#096dd9] hover:!border-[#096dd9]">导出</Button>
        <Button icon={<SettingOutlined />} className="text-[#1890ff] border-[#1890ff] hover:!text-[#096dd9] hover:!border-[#096dd9]">列管理</Button>
      </Space>
    </div>
    
    <div className="flex-1 overflow-hidden">
      <Table 
        columns={columns} 
        dataSource={mockData} 
        rowKey="id"
        loading={loading}
        pagination={{ 
          pageSize: 20,
          showTotal: (total) => `共 ${total} 条记录`,
          showSizeChanger: true
        }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 420px)' }}
        size="middle"
        className="custom-table"
      />
    </div>
  </div>
</div>
);
};

export default AlertQuery;