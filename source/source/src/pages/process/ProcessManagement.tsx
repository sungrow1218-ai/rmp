import React, { useState } from 'react';
import { Table, Input, Select, Tabs, Button, Space, Typography, DatePicker, Tag, Drawer, Modal, Descriptions, Timeline } from 'antd';
import { SearchOutlined, SyncOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface ClusterBasis {
  maxIntradayHoldings: number;
  triggerTime: string;
  initialHoldings: number;
  cbHoldings: number;
  cbFaceValue: number;
  conversionPrice: number;
}

interface ProcessHistoryNode {
  nodeName: string;
  handler: string;
  action: 'submit' | 'approve' | 'reject' | 'pending';
  time: string;
  comment?: string;
}

interface ProcessRecord {
  id: string;
  processType: string;
  name: string;
  initiator: string;
  currentHandler: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createTime: string;
  finishTime: string | null;
  history: ProcessHistoryNode[];
  // 模拟关联的额度调整数据
  quotaDetails?: {
    symbol: string;
    name: string;
    oldQuota: number;
    newQuota: number;
    oldParentQuota: number;
    newParentQuota: number;
    oldHkQuota: number;
    newHkQuota: number;
    oldConnectQuota: number;
    newConnectQuota: number;
    // 变更依据数据
    basis: {
      parent: ClusterBasis;
      hk: ClusterBasis;
      connect: ClusterBasis;
    }
  }[];
}

// 模拟数据
const mockData: ProcessRecord[] = Array.from({ length: 50 }).map((_, i) => {
  const statuses: ('pending' | 'processing' | 'completed' | 'rejected')[] = ['pending', 'processing', 'completed', 'rejected'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  const createTime = dayjs().subtract(Math.floor(Math.random() * 10), 'day').subtract(Math.floor(Math.random() * 24), 'hour');
  const finishTime = (status === 'completed' || status === 'rejected') 
    ? createTime.add(Math.floor(Math.random() * 48), 'hour').format('YYYY-MM-DD HH:mm:ss') 
    : null;

  const processType = i % 3 === 0 ? '额度调整' : (i % 2 === 0 ? '权限申请' : '风险豁免');
  const initiator = ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)];

  // 生成模拟的流转历史
  const history: ProcessHistoryNode[] = [
    {
      nodeName: '发起申请',
      handler: initiator,
      action: 'submit',
      time: createTime.format('YYYY-MM-DD HH:mm:ss'),
      comment: '提交申请'
    }
  ];

  if (status === 'processing') {
    history.push({
      nodeName: '部门领导审批',
      handler: '王建国',
      action: 'approve',
      time: createTime.add(2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      comment: '同意'
    });
    history.push({
      nodeName: '合规专员审批',
      handler: '李合规',
      action: 'pending',
      time: '',
    });
  } else if (status === 'completed') {
    history.push({
      nodeName: '部门领导审批',
      handler: '王建国',
      action: 'approve',
      time: createTime.add(2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      comment: '同意'
    });
    history.push({
      nodeName: '合规专员审批',
      handler: '李合规',
      action: 'approve',
      time: createTime.add(5, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      comment: '符合风控要求，同意'
    });
    history.push({
      nodeName: '风控总监审批',
      handler: '赵总监',
      action: 'approve',
      time: finishTime!,
      comment: '同意执行'
    });
  } else if (status === 'rejected') {
    history.push({
      nodeName: '部门领导审批',
      handler: '王建国',
      action: 'reject',
      time: finishTime!,
      comment: '额度调整过大，请重新评估'
    });
  }

  return {
    id: `P${10000 + i}`,
    processType,
    name: processType === '额度调整' ? '集中度额度调整申请' : (processType === '权限申请' ? '投资交易权限申请' : '合规风险豁免审批'),
    initiator,
    currentHandler: status === 'completed' ? '-' : (status === 'rejected' ? '-' : ['部门领导', '合规专员', '风控总监'][Math.floor(Math.random() * 3)]),
    status,
    createTime: createTime.format('YYYY-MM-DD HH:mm:ss'),
    finishTime,
    history,
    quotaDetails: processType === '额度调整' ? [
      {
        symbol: '600031',
        name: '三一重工',
        oldQuota: 4.8, newQuota: 5.5,
        oldParentQuota: 2.4, newParentQuota: 2.8,
        oldHkQuota: 1.44, newHkQuota: 1.6,
        oldConnectQuota: 0.96, newConnectQuota: 1.1,
        basis: {
          parent: {
            maxIntradayHoldings: 5000000,
            triggerTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD 14:30:00'),
            initialHoldings: 4500000,
            cbHoldings: 200000,
            cbFaceValue: 100,
            conversionPrice: 15.5
          },
          hk: {
            maxIntradayHoldings: 4500000,
            triggerTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD 11:15:00'),
            initialHoldings: 4000000,
            cbHoldings: 150000,
            cbFaceValue: 100,
            conversionPrice: 15.5
          },
          connect: {
            maxIntradayHoldings: 3000000,
            triggerTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD 10:45:00'),
            initialHoldings: 2500000,
            cbHoldings: 150000,
            cbFaceValue: 100,
            conversionPrice: 15.5
          }
        }
      },
      {
        symbol: '600519',
        name: '贵州茅台',
        oldQuota: 4.8, newQuota: 5.0,
        oldParentQuota: 2.4, newParentQuota: 2.5,
        oldHkQuota: 1.44, newHkQuota: 1.5,
        oldConnectQuota: 0.96, newConnectQuota: 1.0,
        basis: {
          parent: {
            maxIntradayHoldings: 400000,
            triggerTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD 10:15:00'),
            initialHoldings: 380000,
            cbHoldings: 0,
            cbFaceValue: 100,
            conversionPrice: 1800
          },
          hk: {
            maxIntradayHoldings: 250000,
            triggerTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD 13:20:00'),
            initialHoldings: 240000,
            cbHoldings: 0,
            cbFaceValue: 100,
            conversionPrice: 1800
          },
          connect: {
            maxIntradayHoldings: 200000,
            triggerTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD 14:50:00'),
            initialHoldings: 180000,
            cbHoldings: 0,
            cbFaceValue: 100,
            conversionPrice: 1800
          }
        }
      }
    ] : undefined
  };
});

export const ProcessManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);

  // 办理抽屉状态
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentProcess, setCurrentProcess] = useState<ProcessRecord | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [isViewMode, setIsViewMode] = useState(false);

  // 依据弹窗状态
  const [basisModalVisible, setBasisModalVisible] = useState(false);
  const [currentBasis, setCurrentBasis] = useState<any>(null);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleProcess = (record: ProcessRecord) => {
    setCurrentProcess(record);
    setApprovalComment('');
    setIsViewMode(false);
    setDrawerVisible(true);
  };

  const handleView = (record: ProcessRecord) => {
    setCurrentProcess(record);
    setIsViewMode(true);
    setDrawerVisible(true);
  };

  const showBasis = (basis: any, symbol: string, name: string) => {
    setCurrentBasis({ ...basis, symbol, name });
    setBasisModalVisible(true);
  };

  const columns: ColumnsType<ProcessRecord> = [
    { title: '流程类型', dataIndex: 'processType', width: 120, render: text => <Tag color="blue">{text}</Tag> },
    { title: '流程名称', dataIndex: 'name', width: 200 },
    { title: '发起人', dataIndex: 'initiator', width: 100 },
    { title: '当前处理人', dataIndex: 'currentHandler', width: 120 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 100,
      render: (status: string) => {
        const config = {
          pending: { color: 'warning', text: '待处理' },
          processing: { color: 'processing', text: '审批中' },
          completed: { color: 'success', text: '已完成' },
          rejected: { color: 'error', text: '已驳回' },
        }[status] || { color: 'default', text: '未知' };
        
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    { title: '办结时间', dataIndex: 'finishTime', width: 160, render: text => text || '-' },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => handleView(record)}>查看</a>
          {(record.status === 'pending' || record.status === 'processing') && (
            <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => handleProcess(record)}>办理</a>
          )}
        </Space>
      ),
    },
  ];

  // 办理抽屉中的额度明细表格列
  const detailColumns = [
    { title: '证券代码', dataIndex: 'symbol', width: 80, fixed: 'left' as const },
    { title: '证券名称', dataIndex: 'name', width: 90, fixed: 'left' as const },
    {
      title: '总额度',
      children: [
        { title: '修改前', dataIndex: 'oldQuota', width: 70, render: (v: number) => <Text type="secondary">{v.toFixed(2)}%</Text> },
        { title: '修改后', dataIndex: 'newQuota', width: 70, render: (v: number) => <Text type="warning" strong>{v.toFixed(2)}%</Text> },
      ]
    },
    {
      title: '母公司',
      children: [
        { title: '修改前', dataIndex: 'oldParentQuota', width: 70, render: (v: number) => <Text type="secondary">{v.toFixed(2)}%</Text> },
        { title: '修改后', dataIndex: 'newParentQuota', width: 70, render: (v: number) => <Text type="success" strong>{v.toFixed(2)}%</Text> },
      ]
    },
    {
      title: '香港金控',
      children: [
        { title: '修改前', dataIndex: 'oldHkQuota', width: 70, render: (v: number) => <Text type="secondary">{v.toFixed(2)}%</Text> },
        { title: '修改后', dataIndex: 'newHkQuota', width: 70, render: (v: number) => <span className="text-purple-600 font-bold">{v.toFixed(2)}%</span> },
      ]
    },
    {
      title: '陆股通',
      children: [
        { title: '修改前', dataIndex: 'oldConnectQuota', width: 70, render: (v: number) => <Text type="secondary">{v.toFixed(2)}%</Text> },
        { title: '修改后', dataIndex: 'newConnectQuota', width: 70, render: (v: number) => <span className="text-cyan-600 font-bold">{v.toFixed(2)}%</span> },
      ]
    },
    {
      title: '操作',
      key: 'action',
      width: 90,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Button type="link" size="small" onClick={() => showBasis(record.basis, record.symbol, record.name)} className="text-[#1890ff] hover:text-[#096dd9]">
          查看依据
        </Button>
      )
    }
  ];

  // 根据Tab过滤数据
  const filteredData = mockData.filter(item => {
    if (activeTab === 'my') return item.initiator === '张三'; // 假设当前用户是张三
    if (activeTab === 'todo') return item.status === 'pending' || item.status === 'processing';
    return true;
  });

  const renderBasisDescriptions = (basisData: ClusterBasis) => (
    <Descriptions bordered column={1} size="middle" className="mt-4">
      <Descriptions.Item label="日内最大持仓数">
        <span className="text-[#1890ff] font-bold">{basisData.maxIntradayHoldings.toLocaleString()} 股</span>
      </Descriptions.Item>
      <Descriptions.Item label="触发时间">
        {basisData.triggerTime}
      </Descriptions.Item>
      <Descriptions.Item label="期初持仓数量">
        {basisData.initialHoldings.toLocaleString()} 股
      </Descriptions.Item>
      <Descriptions.Item label="可转债持仓">
        {basisData.cbHoldings.toLocaleString()} 张
      </Descriptions.Item>
      <Descriptions.Item label="可转债每手面额">
        {basisData.cbFaceValue} 元
      </Descriptions.Item>
      <Descriptions.Item label="转股价格">
        {basisData.conversionPrice.toFixed(2)} 元
      </Descriptions.Item>
    </Descriptions>
  );

  const getStatusConfig = (status: string) => {
    return {
      pending: { color: 'warning', text: '待处理' },
      processing: { color: 'processing', text: '审批中' },
      completed: { color: 'success', text: '已完成' },
      rejected: { color: 'error', text: '已驳回' },
    }[status] || { color: 'default', text: '未知' };
  };

  return (
    <div className="p-6 h-full flex flex-col absolute inset-0 bg-gray-50">
      <div className="mb-4 shrink-0 flex items-center gap-2">
        <FileTextOutlined className="text-[#1890ff] text-xl" />
        <Title level={4} style={{ margin: 0 }}>流程管理</Title>
      </div>

      {/* 搜索区 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shrink-0 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm">流程名称</span>
          <Input placeholder="请输入" style={{ width: 200 }} allowClear />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm">流程类型</span>
          <Select
            placeholder="请选择"
            style={{ width: 150 }}
            allowClear
            options={[
              { value: 'quota', label: '额度调整' },
              { value: 'auth', label: '权限申请' },
              { value: 'risk', label: '风险豁免' },
            ]}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm">发起人</span>
          <Input placeholder="请输入" style={{ width: 150 }} allowClear />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm">流程状态</span>
          <Select
            placeholder="请选择"
            style={{ width: 150 }}
            allowClear
            options={[
              { value: 'pending', label: '待处理' },
              { value: 'processing', label: '审批中' },
              { value: 'completed', label: '已完成' },
              { value: 'rejected', label: '已驳回' },
            ]}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm">创建时间</span>
          <RangePicker style={{ width: 260 }} />
        </div>
        <Space className="ml-auto">
          <Button icon={<SyncOutlined />} onClick={() => {}}>重置</Button>
          <Button type="primary" icon={<SearchOutlined />} className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={handleSearch}>
            查询
          </Button>
        </Space>
      </div>

      {/* 表格区 */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          className="px-6 pt-2 shrink-0"
          items={[
            { key: 'all', label: '全部流程' },
            { key: 'my', label: '我发起的' },
            { key: 'todo', label: '我的待办' },
          ]}
        />
        <div className="flex-1 overflow-hidden px-6 pb-6">
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            rowKey="id"
            loading={loading}
            pagination={{ 
              pageSize: 20,
              showTotal: (total) => `共 ${total} 条记录`,
              showSizeChanger: true
            }}
            scroll={{ y: 'calc(100vh - 380px)' }}
            size="middle"
            className="custom-table"
          />
        </div>
      </div>

      {/* 办理/查看抽屉 */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-[#1890ff]" />
            <span>{isViewMode ? '流程详情' : '流程办理'} - {currentProcess?.name}</span>
          </div>
        }
        placement="right"
        width={1100}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        footer={
          <div className="flex justify-end gap-3">
            {isViewMode ? (
              <Button onClick={() => setDrawerVisible(false)}>关闭</Button>
            ) : (
              <>
                <Button onClick={() => setDrawerVisible(false)}>取消</Button>
                <Button danger icon={<CloseCircleOutlined />}>驳回</Button>
                <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" icon={<CheckCircleOutlined />}>
                  同意
                </Button>
              </>
            )}
          </div>
        }
      >
        {currentProcess && (
          <div className="flex h-full gap-6">
            {/* 左侧：流程详情 */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200 pr-6">
              <Descriptions title="基本信息" bordered size="small" column={2} className="mb-6 shrink-0">
                <Descriptions.Item label="流程类型"><Tag color="blue">{currentProcess.processType}</Tag></Descriptions.Item>
                <Descriptions.Item label="发起人">{currentProcess.initiator}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{currentProcess.createTime}</Descriptions.Item>
                <Descriptions.Item label="当前状态">
                  <Tag color={getStatusConfig(currentProcess.status).color}>
                    {getStatusConfig(currentProcess.status).text}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              {currentProcess.processType === '额度调整' && currentProcess.quotaDetails && (
                <div className="flex-1 flex flex-col overflow-hidden mb-6">
                  <div className="font-bold text-base mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#1890ff] rounded"></div>
                    额度调整明细
                  </div>
                  <Table
                    columns={detailColumns}
                    dataSource={currentProcess.quotaDetails}
                    rowKey="symbol"
                    pagination={false}
                    scroll={{ x: 'max-content', y: 300 }}
                    size="small"
                    bordered
                    className="custom-table"
                  />
                </div>
              )}

              {!isViewMode && (
                <div className="shrink-0 mt-auto pt-4 border-t border-gray-200">
                  <div className="font-bold text-base mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#1890ff] rounded"></div>
                    审批意见
                  </div>
                  <TextArea 
                    rows={4} 
                    placeholder="请输入审批意见（选填）" 
                    value={approvalComment}
                    onChange={e => setApprovalComment(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* 右侧：流转历史 */}
            <div className="w-[300px] shrink-0 flex flex-col overflow-hidden">
              <div className="font-bold text-base mb-4 flex items-center gap-2 shrink-0">
                <ClockCircleOutlined className="text-[#1890ff]" />
                流转历史
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <Timeline
                  items={currentProcess.history.map((node, index) => {
                    let color = 'gray';
                    let icon = undefined;
                    
                    if (node.action === 'approve' || node.action === 'submit') {
                      color = 'green';
                      icon = <CheckCircleOutlined />;
                    } else if (node.action === 'reject') {
                      color = 'red';
                      icon = <CloseCircleOutlined />;
                    } else if (node.action === 'pending') {
                      color = 'blue';
                      icon = <ClockCircleOutlined />;
                    }

                    return {
                      color,
                      dot: icon,
                      children: (
                        <div className="mb-4">
                          <div className="font-medium text-gray-800 mb-1">{node.nodeName}</div>
                          <div className="text-sm text-gray-500 mb-1 flex justify-between">
                            <span>处理人：{node.handler}</span>
                            {node.action === 'pending' && <Tag color="processing" className="m-0">处理中</Tag>}
                          </div>
                          {node.time && <div className="text-xs text-gray-400 mb-2">{node.time}</div>}
                          {node.comment && (
                            <div className="bg-gray-50 p-2 rounded text-sm text-gray-600 border border-gray-100">
                              {node.comment}
                            </div>
                          )}
                        </div>
                      )
                    };
                  })}
                />
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* 额度变更依据弹窗 */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <InfoCircleOutlined className="text-[#1890ff]" />
            <span>额度变更依据 - {currentBasis?.symbol} ({currentBasis?.name})</span>
          </div>
        }
        open={basisModalVisible}
        onCancel={() => setBasisModalVisible(false)}
        footer={<Button type="primary" onClick={() => setBasisModalVisible(false)} className="bg-[#1890ff] hover:!bg-[#096dd9] border-none">关闭</Button>}
        width={600}
      >
        {currentBasis && (
          <Tabs
            defaultActiveKey="parent"
            items={[
              {
                key: 'parent',
                label: '母公司',
                children: renderBasisDescriptions(currentBasis.parent),
              },
              {
                key: 'hk',
                label: '香港金控',
                children: renderBasisDescriptions(currentBasis.hk),
              },
              {
                key: 'connect',
                label: '陆股通',
                children: renderBasisDescriptions(currentBasis.connect),
              },
            ]}
          />
        )}
      </Modal>
    </div>
  );
};
export default ProcessManagement;
