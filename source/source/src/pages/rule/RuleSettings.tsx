import React, { useState } from 'react';
import { Table, Input, Select, Button, Space, Typography, Card, Tag, Tree } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined, LineChartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface RuleRecord {
  id: string;
  ruleNo: string;
  ruleName: string;
  modelType: string;
  status: 'enabled' | 'disabled' | 'pending';
  ruleCount: number;
  creator: string;
  createTime: string;
  updateTime: string;
}

// 模拟数据
const mockData: RuleRecord[] = Array.from({ length: 10 }).map((_, i) => {
  const statuses: ('enabled' | 'disabled' | 'pending')[] = ['enabled', 'disabled', 'pending'];
  const status = i === 4 ? 'pending' : (i % 3 === 0 ? 'disabled' : 'enabled');

  return {
    id: `R${10000 + i}`,
    ruleNo: '50036',
    ruleName: 'UST-A-TYFXRZGB',
    modelType: '异常交易类',
    status,
    ruleCount: 8,
    creator: '018566',
    createTime: '2026-01-26 17:32:01',
    updateTime: '2026-01-26 17:32:01',
  };
});

interface SingleRuleRecord {
  id: string;
  ruleNo: string;
  ruleType: string;
  ruleName: string;
  status: 'enabled' | 'disabled';
  priority: number;
  accountControlType: string;
  jointControlMode: string;
  securityControlMethod: string;
  securitySummaryMethod: string;
  creator: string;
  modifier: string;
  createTime: string;
  updateTime: string;
}

const mockSingleData: SingleRuleRecord[] = [
  {
    id: 'S1',
    ruleNo: '30736',
    ruleType: '连续竞价阶段拉抬打压控制',
    ruleName: 'issuer',
    status: 'enabled',
    priority: 5,
    accountControlType: '对接系统',
    jointControlMode: '单独控制',
    securityControlMethod: '证券类别',
    securitySummaryMethod: '分组计算',
    creator: '018566',
    modifier: '018566',
    createTime: '2026-02-12 12:00:00',
    updateTime: '2026-02-12 14:30:00',
  },
  {
    id: 'S2',
    ruleNo: '30721',
    ruleType: '连续竞价阶段拉抬打压控制',
    ruleName: '咨询解耦测试16',
    status: 'enabled',
    priority: 5,
    accountControlType: '证券账户',
    jointControlMode: '单独控制',
    securityControlMethod: '动态维度',
    securitySummaryMethod: '单独计算',
    creator: '018566',
    modifier: '018566',
    createTime: '2026-02-11 15:00:00',
    updateTime: '2026-02-11 16:20:00',
  },
  {
    id: 'S3',
    ruleNo: '30718',
    ruleType: '连续竞价阶段拉抬打压控制',
    ruleName: 'testA',
    status: 'enabled',
    priority: 5,
    accountControlType: '对接系统',
    jointControlMode: '单独控制',
    securityControlMethod: '证券类别',
    securitySummaryMethod: '单独计算',
    creator: '018566',
    modifier: '018566',
    createTime: '2026-02-11 13:00:00',
    updateTime: '2026-02-11 13:45:00',
  },
  {
    id: 'S4',
    ruleNo: '5341',
    ruleType: '连续竞价阶段拉抬打压控制',
    ruleName: 'test09-5',
    status: 'enabled',
    priority: 5,
    accountControlType: '对接系统',
    jointControlMode: '单独控制',
    securityControlMethod: '证券类别',
    securitySummaryMethod: '单独计算',
    creator: '019330',
    modifier: '018566',
    createTime: '2025-09-05 10:00:00',
    updateTime: '2025-09-06 09:15:00',
  }
];

// 模拟规则树数据
const treeData = [
  {
    title: '异常交易类',
    key: '0-0',
    children: [
      {
        title: '拉抬打压',
        key: '0-0-0',
        children: [
          { title: '连续竞价阶段拉抬打压控制', key: '0-0-0-0' },
        ],
      },
      {
        title: '自买自卖',
        key: '0-0-1',
        children: [
          { title: '同账户自买自卖', key: '0-0-1-0' },
          { title: '跨账户自买自卖', key: '0-0-1-1' },
        ],
      },
      {
        title: '频繁撤单',
        key: '0-0-2',
        children: [
          { title: '日内频繁撤单', key: '0-0-2-0' },
          { title: '大额频繁撤单', key: '0-0-2-1' },
        ],
      },
      {
        title: '虚假申报',
        key: '0-0-3',
        children: [
          { title: '开盘集合竞价阶段虚假申报', key: '0-0-3-0' },
        ],
      },
    ],
  },
  {
    title: '集中度类',
    key: '0-1',
    children: [
      {
        title: '个股集中度',
        key: '0-1-0',
        children: [
          { title: '单只股票持仓占比', key: '0-1-0-0' },
          { title: '单只股票流通股占比', key: '0-1-0-1' },
        ],
      },
      {
        title: '行业集中度',
        key: '0-1-1',
        children: [
          { title: '单一行业持仓占比', key: '0-1-1-0' },
        ],
      },
    ],
  },
];

export const RuleSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeCard, setActiveCard] = useState<'single' | 'template'>('single');
  const navigate = useNavigate();

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleCreate = () => {
    if (activeCard === 'single') {
      navigate('/single-rule-create');
    } else {
      navigate('/rule-create');
    }
  };

  const columns: ColumnsType<RuleRecord> = [
    { title: '指标组编号', dataIndex: 'ruleNo', width: 120 },
    { title: '指标组名称', dataIndex: 'ruleName', width: 180 },
    { 
      title: '模型类型', 
      dataIndex: 'modelType', 
      width: 120,
      render: (text) => (
        <span className="text-[#1890ff] border border-[#1890ff] px-2 py-0.5 rounded text-xs bg-[#e6f7ff]">
          {text}
        </span>
      )
    },
    { 
      title: '启用状态', 
      dataIndex: 'status', 
      width: 120,
      render: (status) => {
        if (status === 'enabled') return <span className="text-[#1890ff]"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1890ff] mr-2"></span>已启用</span>;
        if (status === 'disabled') return <span className="text-red-500"><span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>已停用</span>;
        return <span className="text-orange-500"><span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>待审核</span>;
      }
    },
    { 
      title: '包含规则类型数', 
      dataIndex: 'ruleCount', 
      width: 140,
      align: 'center',
      render: (count) => (
        <span className="text-[#1890ff] bg-[#e6f7ff] px-3 py-0.5 rounded font-medium">
          {count}
        </span>
      )
    },
    { title: '创建人', dataIndex: 'creator', width: 100 },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    { title: '更新时间', dataIndex: 'updateTime', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Space size="middle" className="text-[#1890ff]">
          <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => navigate(`/rule-view/${record.id}`)}>查看</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => navigate(`/rule-view/${record.id}`)}>绑定账户组</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">{record.status === 'enabled' ? '禁用' : '启用'}</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => navigate(`/rule-edit/${record.id}`)}>编辑</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">复制</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">删除</a>
        </Space>
      ),
    },
  ];

  const singleColumns: ColumnsType<SingleRuleRecord> = [
    { title: '规则编号', dataIndex: 'ruleNo', width: 100 },
    { 
      title: '规则类型', 
      dataIndex: 'ruleType', 
      width: 200,
      render: (text) => (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[#1890ff] bg-[#e6f7ff] border border-[#91d5ff] text-xs">
          <LineChartOutlined /> {text}
        </span>
      )
    },
    { title: '规则名称', dataIndex: 'ruleName', width: 140 },
    { 
      title: '启用状态', 
      dataIndex: 'status', 
      width: 100,
      render: (status) => (
        <span className="text-[#1890ff] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1890ff]"></span>
          已启用
        </span>
      )
    },
    { 
      title: '优先级', 
      dataIndex: 'priority', 
      width: 80,
      render: (val) => (
        <span className="inline-block px-2 py-0.5 rounded text-[#1890ff] bg-[#e6f7ff] border border-[#91d5ff] text-xs">
          {val}
        </span>
      )
    },
    { 
      title: '账户控制类型', 
      dataIndex: 'accountControlType', 
      width: 120,
      render: (text) => {
        const isSystem = text === '对接系统';
        return (
          <span className={`inline-block px-2 py-0.5 rounded text-xs border ${
            isSystem 
              ? 'text-[#eb2f96] bg-[#fff0f6] border-[#ffadd2]' 
              : 'text-[#1890ff] bg-[#e6f7ff] border-[#91d5ff]'
          }`}>
            {text}
          </span>
        );
      }
    },
    { 
      title: '联合控制模式', 
      dataIndex: 'jointControlMode', 
      width: 120,
      render: (text) => (
        <span className="inline-block px-2 py-0.5 rounded text-[#722ed1] bg-[#f9f0ff] border-[#d3adf7] text-xs">
          {text}
        </span>
      )
    },
    { title: '证券控制方式', dataIndex: 'securityControlMethod', width: 120 },
    { title: '证券汇总方式', dataIndex: 'securitySummaryMethod', width: 120 },
    { title: '创建人', dataIndex: 'creator', width: 80 },
    { title: '修改人', dataIndex: 'modifier', width: 80 },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    { title: '更新时间', dataIndex: 'updateTime', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="small" className="text-[#1890ff]">
          <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => navigate(`/single-rule-view/${record.id}`)}>查看</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">禁用</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => navigate(`/single-rule-edit/${record.id}`)}>编辑</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">复制</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">删除</a>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 h-full flex flex-col absolute inset-0 bg-white overflow-y-auto">
      {/* 顶部标题 */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <Title level={4} style={{ margin: 0, color: '#333' }}>规则设置</Title>
          <InfoCircleOutlined className="text-gray-400" />
        </div>
      </div>

      {/* 统计卡片区 */}
      <div className="flex gap-6 mb-8 shrink-0">
        <div 
          className={`w-64 h-24 bg-white rounded-lg shadow-sm p-4 relative overflow-hidden flex flex-col justify-center cursor-pointer transition-all ${activeCard === 'single' ? 'border-2 border-[#1890ff]' : 'border border-gray-200 hover:border-[#1890ff]/50'}`}
          onClick={() => setActiveCard('single')}
        >
          {activeCard === 'single' && (
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-[#1890ff] border-l-[24px] border-l-transparent">
              <CheckCircleOutlined className="absolute -top-[22px] -left-[14px] text-white text-[10px]" />
            </div>
          )}
          <div className="text-gray-800 font-medium text-sm mb-1">单个规则指标</div>
          <div className="text-3xl font-bold text-gray-800">15</div>
          <div className="absolute right-4 bottom-4 opacity-20">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-300 rounded-full"></div>
            </div>
          </div>
        </div>

        <div 
          className={`w-64 h-24 bg-white rounded-lg shadow-sm p-4 relative overflow-hidden flex flex-col justify-center cursor-pointer transition-all ${activeCard === 'template' ? 'border-2 border-[#1890ff]' : 'border border-gray-200 hover:border-[#1890ff]/50'}`}
          onClick={() => setActiveCard('template')}
        >
          {activeCard === 'template' && (
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-[#1890ff] border-l-[24px] border-l-transparent">
              <CheckCircleOutlined className="absolute -top-[22px] -left-[14px] text-white text-[10px]" />
            </div>
          )}
          <div className="text-gray-800 font-medium text-sm mb-1">模板生成指标</div>
          <div className="text-3xl font-bold text-gray-800">27</div>
          <div className="absolute right-4 bottom-4 opacity-80">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4L4 14L24 24L44 14L24 4Z" fill="#91d5ff" stroke="#1890ff" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M4 24L24 34L44 24" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 34L24 44L44 34" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* 标题和操作区 */}
      <div className="flex justify-between items-end mb-4 shrink-0">
        <div>
          <div className="text-lg font-bold text-gray-800 mb-1">
            {activeCard === 'template' ? '多个规则类型模板创建的指标组' : '单个规则创建生成的指标'}
          </div>
          <div className="text-sm text-gray-500">
            {activeCard === 'template' ? '通过恒定空模板批量创建风控指标，简化配置流程' : '通过自定义规则创建的指标，包含详细的配置信息'}
          </div>
        </div>
        <Space>
          <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={handleCreate}>创建新指标</Button>
          <Button className="text-[#1890ff] border-[#1890ff] hover:!text-[#096dd9] hover:!border-[#096dd9]">导出数据</Button>
        </Space>
      </div>

      {/* 动态内容区 */}
      {activeCard === 'template' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 搜索区 */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4 flex flex-wrap gap-4 items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">指标组编号：</span>
              <Input placeholder="请输入" style={{ width: 180 }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">指标组名称：</span>
              <Input placeholder="请输入" style={{ width: 180 }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">启用状态：</span>
              <Select placeholder="请选择" style={{ width: 150 }} options={[{value: 'enabled', label: '已启用'}, {value: 'disabled', label: '已停用'}]} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">创建人：</span>
              <Input placeholder="请输入" style={{ width: 150 }} />
            </div>
            <div className="ml-auto flex gap-2">
              <Button>重置</Button>
              <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={handleSearch}>查询</Button>
            </div>
          </div>

          {/* 表格区 */}
          <div className="flex-1 overflow-hidden">
            <Table 
              columns={columns} 
              dataSource={mockData} 
              rowKey="id"
              loading={loading}
              pagination={{ 
                pageSize: 10,
                showTotal: (total) => `共 ${total} 条记录`,
                showSizeChanger: true,
                showQuickJumper: true,
                position: ['bottomRight']
              }}
              scroll={{ x: 'max-content', y: 'calc(100vh - 480px)' }}
              size="middle"
              className="custom-rule-table"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* 左侧：规则树 */}
          <div className="w-[280px] shrink-0 border border-gray-200 rounded-lg p-4 overflow-y-auto bg-gray-50/50">
            <div className="text-sm font-medium text-gray-600 mb-4">规则类型导航</div>
            <Tree
              showLine
              defaultExpandAll
              treeData={treeData}
              className="bg-transparent"
            />
          </div>

          {/* 右侧：搜索与列表 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 紧凑型搜索区 */}
            <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4 flex flex-wrap gap-3 items-center shrink-0">
              <Input placeholder="规则编号" style={{ width: 140 }} />
              <Input placeholder="规则名称" style={{ width: 140 }} />
              <Select placeholder="启用状态" style={{ width: 120 }} options={[{value: 'enabled', label: '已启用'}, {value: 'disabled', label: '已停用'}]} />
              <Input placeholder="创建人" style={{ width: 120 }} />
              <div className="ml-auto flex gap-2">
                <Button size="small">重置</Button>
                <Button type="primary" size="small" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={handleSearch}>查询</Button>
              </div>
            </div>

            {/* 表格区 */}
            <div className="flex-1 overflow-hidden">
              <Table 
                columns={singleColumns} 
                dataSource={mockSingleData} 
                rowKey="id"
                loading={loading}
                pagination={{ 
                  pageSize: 10,
                  showTotal: (total) => `共 ${total} 条记录`,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  position: ['bottomRight']
                }}
                scroll={{ x: 'max-content', y: 'calc(100vh - 480px)' }}
                size="middle"
                className="custom-rule-table"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RuleSettings;
