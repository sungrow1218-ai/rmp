import React, { useState, useMemo } from 'react';
import { Table, Input, Button, Card, Typography, Modal, Form, InputNumber, Drawer, Timeline, Space, Tag, DatePicker } from 'antd';
import { SearchOutlined, EditOutlined, HistoryOutlined } from '@ant-design/icons';
import { useData } from '../../store/DataContext';
import type { ColumnsType } from 'antd/es/table';
import type { HoldingRecord } from '../../utils/mockData';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const QuotaAdjustment: React.FC = () => {
  const { data, history, updateQuota } = useData();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HoldingRecord | null>(null);
  const [form] = Form.useForm();

  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [historySymbol, setHistorySymbol] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const filteredData = data.filter(item => 
    item.symbol.includes(searchText) || item.name.includes(searchText)
  );

  const handleEdit = (record: HoldingRecord) => {
    setEditingRecord(record);
    form.setFieldsValue({ quota: record.quotaAllocation });
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        updateQuota(editingRecord.symbol, values.quota);
      }
      setIsModalVisible(false);
    });
  };

  const showHistory = (symbol: string) => {
    setHistorySymbol(symbol);
    setDateRange(null);
    setIsHistoryVisible(true);
  };

  const columns: ColumnsType<HoldingRecord> = [
    { title: '证券代码', dataIndex: 'symbol', key: 'symbol', width: 120 },
    { title: '证券名称', dataIndex: 'name', key: 'name', width: 150 },
    { 
      title: '当前额度配置 (%)', 
      dataIndex: 'quotaAllocation', 
      key: 'quotaAllocation', 
      width: 150,
      render: (val) => <Tag color="#c27b57" className="text-sm px-2 py-1">{val.toFixed(2)}%</Tag>
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" ghost size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            调整额度
          </Button>
          <Button type="default" size="small" icon={<HistoryOutlined />} onClick={() => showHistory(record.symbol)}>
            追溯记录
          </Button>
        </Space>
      ),
    },
  ];

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

  return (
    <div className="p-6 h-full flex flex-col absolute inset-0 bg-gray-50">
      <div className="mb-4 shrink-0">
        <Title level={4} style={{ margin: 0 }}>额度调整</Title>
        <Text type="secondary" className="text-sm mt-1 block">人工调整各个标的的分配额度，并支持历史记录追溯。</Text>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col shadow-sm" bodyStyle={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="mb-4 shrink-0">
          <Input 
            placeholder="搜索证券代码或名称" 
            prefix={<SearchOutlined className="text-gray-400" />} 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
        </div>
        
        <div className="flex-1 overflow-hidden border border-gray-200 rounded-md">
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            rowKey="id"
            scroll={{ y: 'calc(100vh - 300px)' }}
            pagination={{ 
              total: filteredData.length, 
              pageSize: 50, 
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            size="middle"
          />
        </div>
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <EditOutlined className="text-[#c27b57]" />
            <span>调整额度 - {editingRecord?.symbol} ({editingRecord?.name})</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
        okText="确认调整"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Form.Item 
            name="quota" 
            label="新额度配置 (%)" 
            rules={[{ required: true, message: '请输入新额度' }]}
            extra="调整后的额度将立即在集中度报表中生效。"
          >
            <InputNumber 
              min={0} 
              max={100} 
              step={0.1} 
              style={{ width: '100%' }} 
              size="large"
              addonAfter="%"
            />
          </Form.Item>
        </Form>
      </Modal>

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
export default QuotaAdjustment;
