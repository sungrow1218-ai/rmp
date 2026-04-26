import React, { useState, useMemo } from 'react';
import { Table, Card, Typography, Row, Col, Statistic, Tag, Button, Drawer, Timeline, DatePicker } from 'antd';
import { useData } from '../../store/DataContext';
import { DEFAULT_QUOTA, DEFAULT_PARENT_QUOTA, DEFAULT_HK_QUOTA, DEFAULT_CONNECT_QUOTA } from '../../utils/mockData';
import { SafetyCertificateOutlined, HistoryOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const QuotaManagement: React.FC = () => {
  const { data, history } = useData();

  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [historySymbol, setHistorySymbol] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const showHistory = (symbol: string) => {
    setHistorySymbol(symbol);
    setDateRange(null);
    setIsHistoryVisible(true);
  };

  const symbolHistory = useMemo(() => {
    let filtered = history.filter(h => h.symbol === historySymbol);
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].startOf('day').valueOf();
      const end = dateRange[1].endOf('day').valueOf();
      filtered = filtered.filter(h => {
        const time = dayjs(h.timestamp).valueOf();
        return time >= start && time <= end;
      });
    }
    return filtered;
  }, [history, historySymbol, dateRange]);

  // 过滤出额度与默认值不一致的证券（即已修改生效的证券）
  const modifiedData = data.filter(item => 
    item.quotaAllocation !== DEFAULT_QUOTA ||
    item.parentQuotaAllocation !== DEFAULT_PARENT_QUOTA ||
    item.hkQuotaAllocation !== DEFAULT_HK_QUOTA ||
    item.connectQuotaAllocation !== DEFAULT_CONNECT_QUOTA
  );

  const columns = [
    { 
      title: '证券代码', 
      dataIndex: 'symbol', 
      key: 'symbol', 
      width: 120, 
      render: (text: string) => <span className="text-blue-600 font-medium">{text}</span> 
    },
    { 
      title: '证券名称', 
      dataIndex: 'name', 
      key: 'name', 
      width: 120 
    },
    { 
      title: '总额度', 
      dataIndex: 'quotaAllocation', 
      key: 'quotaAllocation', 
      width: 120,
      render: (val: number) => <Tag color={val !== DEFAULT_QUOTA ? 'orange' : 'default'}>{val.toFixed(2)}%</Tag> 
    },
    { 
      title: '母公司额度', 
      dataIndex: 'parentQuotaAllocation', 
      key: 'parentQuotaAllocation', 
      width: 120,
      render: (val: number) => <Tag color={val !== DEFAULT_PARENT_QUOTA ? 'green' : 'default'}>{val.toFixed(2)}%</Tag> 
    },
    { 
      title: '香港金控额度', 
      dataIndex: 'hkQuotaAllocation', 
      key: 'hkQuotaAllocation', 
      width: 120,
      render: (val: number) => <Tag color={val !== DEFAULT_HK_QUOTA ? 'purple' : 'default'}>{val.toFixed(2)}%</Tag> 
    },
    { 
      title: '陆股通额度', 
      dataIndex: 'connectQuotaAllocation', 
      key: 'connectQuotaAllocation', 
      width: 120,
      render: (val: number) => <Tag color={val !== DEFAULT_CONNECT_QUOTA ? 'cyan' : 'default'}>{val.toFixed(2)}%</Tag> 
    },
    {
      title: '修改人',
      key: 'operator',
      width: 100,
      render: (_: any, record: any) => {
        const latestHistory = history.find(h => h.symbol === record.symbol);
        return latestHistory ? latestHistory.operator : '-';
      }
    },
    {
      title: '修改时间',
      key: 'timestamp',
      width: 160,
      render: (_: any, record: any) => {
        const latestHistory = history.find(h => h.symbol === record.symbol);
        return latestHistory ? latestHistory.timestamp : '-';
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Button type="link" size="small" icon={<HistoryOutlined />} onClick={() => showHistory(record.symbol)}>
          追溯记录
        </Button>
      )
    }
  ];

  return (
    <div className="p-6 h-full flex flex-col absolute inset-0 bg-gray-50 overflow-hidden">
      <div className="mb-4 shrink-0 flex items-center gap-2">
        <SafetyCertificateOutlined className="text-[#c27b57] text-xl" />
        <Title level={4} style={{ margin: 0 }}>额度管理</Title>
      </div>

      <Card title="全局默认额度配置" className="mb-4 shrink-0 shadow-sm border-t-4 border-t-[#c27b57]">
        <Row gutter={24}>
          <Col span={6}>
            <Statistic 
              title="默认总额度" 
              value={DEFAULT_QUOTA} 
              precision={2} 
              suffix="%" 
              valueStyle={{ color: '#c27b57', fontWeight: 'bold' }} 
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="母公司额度 (下限 ~ 上限)" 
              value={`0.00 ~ ${DEFAULT_PARENT_QUOTA.toFixed(2)}`} 
              suffix="%" 
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="香港金控额度 (下限 ~ 上限)" 
              value={`0.00 ~ ${DEFAULT_HK_QUOTA.toFixed(2)}`} 
              suffix="%" 
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="陆股通额度 (下限 ~ 上限)" 
              value={`0.00 ~ ${DEFAULT_CONNECT_QUOTA.toFixed(2)}`} 
              suffix="%" 
              valueStyle={{ color: '#13c2c2' }}
            />
          </Col>
        </Row>
      </Card>

      <Card 
        title={
          <div className="flex justify-between items-center">
            <span>已修改生效的证券列表</span>
            <Tag color="blue">共 {modifiedData.length} 条记录</Tag>
          </div>
        } 
        className="flex-1 shadow-sm flex flex-col overflow-hidden" 
        bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div className="flex-1 overflow-hidden p-4">
          <Table 
            columns={columns} 
            dataSource={modifiedData} 
            rowKey="id"
            pagination={{ 
              pageSize: 50,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            scroll={{ x: 'max-content', y: 'calc(100vh - 420px)' }}
            size="middle"
            bordered
          />
        </div>
      </Card>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <HistoryOutlined className="text-[#c27b57]" />
            <span>额度调整记录 - {historySymbol}</span>
          </div>
        }
        placement="right"
        onClose={() => setIsHistoryVisible(false)}
        open={isHistoryVisible}
        width={500}
      >
        <div className="mb-6">
          <Text className="mb-2 block text-gray-600">按时间范围筛选：</Text>
          <RangePicker 
            style={{ width: '100%' }} 
            value={dateRange as any} 
            onChange={(dates) => setDateRange(dates as any)} 
            allowClear
          />
        </div>

        {symbolHistory.length > 0 ? (
          <Timeline
            className="mt-4"
            items={symbolHistory.map(h => ({
              color: '#c27b57',
              children: (
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-gray-500 text-xs mb-3 flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="font-medium text-gray-700">{h.timestamp}</span>
                    <Tag color="default" bordered={false}>{h.operator}</Tag>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                    <div className="col-span-2 flex justify-between items-center bg-orange-50 p-2 rounded">
                      <span className="text-gray-600 font-medium">总额度</span>
                      <div className="flex items-center gap-2">
                        <Text delete className="text-gray-400">{h.oldQuota.toFixed(2)}%</Text> 
                        <span className="text-gray-300">→</span> 
                        <Text type="warning" strong>{h.newQuota.toFixed(2)}%</Text>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 bg-green-50 p-2 rounded">
                      <span className="text-gray-500 text-xs">母公司</span>
                      <div className="flex items-center gap-1">
                        <Text delete className="text-gray-400 text-xs">{h.oldParentQuota.toFixed(2)}%</Text> 
                        <span className="text-gray-300 text-xs">→</span> 
                        <Text type="success" strong>{h.newParentQuota.toFixed(2)}%</Text>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 bg-purple-50 p-2 rounded">
                      <span className="text-gray-500 text-xs">香港金控</span>
                      <div className="flex items-center gap-1">
                        <Text delete className="text-gray-400 text-xs">{h.oldHkQuota.toFixed(2)}%</Text> 
                        <span className="text-gray-300 text-xs">→</span> 
                        <span className="text-purple-600 font-bold">{h.newHkQuota.toFixed(2)}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 bg-cyan-50 p-2 rounded">
                      <span className="text-gray-500 text-xs">陆股通</span>
                      <div className="flex items-center gap-1">
                        <Text delete className="text-gray-400 text-xs">{h.oldConnectQuota.toFixed(2)}%</Text> 
                        <span className="text-gray-300 text-xs">→</span> 
                        <span className="text-cyan-600 font-bold">{h.newConnectQuota.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }))}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <HistoryOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }} />
            <div>暂无调整记录</div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
export default QuotaManagement;
