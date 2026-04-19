import React, { useState, useMemo, useEffect } from 'react';
import { Table, Input, Select, Tabs, Button, Space, Typography, DatePicker, message, Modal, Form, InputNumber } from 'antd';
import { EnvironmentFilled, AppstoreFilled, InfoCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { useData } from '../../store/DataContext';
import type { ColumnsType } from 'antd/es/table';
import type { HoldingRecord } from '../../utils/mockData';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const { Title } = Typography;

export const ReportView: React.FC = () => {
  const { data, fetchDataByDate, updateQuotas, refreshData } = useData();
  const [searchText, setSearchText] = useState('');
  const [exceedFilter, setExceedFilter] = useState<string>('all');
  const [queryDate, setQueryDate] = useState<dayjs.Dayjs>(dayjs());
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(dayjs().format('HH:mm:ss'));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 自动刷新逻辑
  useEffect(() => {
    const isToday = queryDate.isSame(dayjs(), 'day');
    let intervalId: NodeJS.Timeout;
    
    if (isToday) {
      intervalId = setInterval(() => {
        refreshData();
        setLastUpdateTime(dayjs().format('HH:mm:ss'));
        message.success('数据已自动刷新', 1);
      }, 60000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [queryDate, refreshData]);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      fetchDataByDate(queryDate.format('YYYY-MM-DD'));
      setLastUpdateTime(dayjs().format('HH:mm:ss'));
      setLoading(false);
      message.success(`已加载 ${queryDate.format('YYYY-MM-DD')} 的数据`);
    }, 500);
  };

  const handleOpenModal = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要修改额度的证券');
      return;
    }
    
    const selectedRecords = data.filter(item => selectedRowKeys.includes(item.id));
    form.setFieldsValue({
      items: selectedRecords.map(record => ({
        symbol: record.symbol,
        quotaAllocation: record.quotaAllocation,
        parentQuotaAllocation: record.parentQuotaAllocation,
        hkQuotaAllocation: record.hkQuotaAllocation,
        connectQuotaAllocation: record.connectQuotaAllocation,
      }))
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      updateQuotas(values.items);
      message.success('额度修改成功');
      setIsModalVisible(false);
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleExport = () => {
    const header = [
      [
        '证券代码', '证券名称', '证券总股本(万股)', '持仓数量汇总(万股)', '持仓占比汇总(不含债转股)', '持仓占比汇总(含债转股)', '额度配置',
        '母公司', '', '', '', '', '', '', '', '',
        '香港金控 (EQD+EST+PWM)', '', '', '', '', '', '', '', '',
        '陆股通', '', '', '', '', '', '', '', ''
      ],
      [
        '', '', '', '', '', '', '',
        '不含债转股', '', '', '', '含债转股', '', '', '', '额度配置',
        '不含债转股', '', '', '', '含债转股', '', '', '', '额度配置',
        '不含债转股', '', '', '', '含债转股', '', '', '', '额度配置'
      ],
      [
        '', '', '', '', '', '', '',
        '期初持仓数量', '日内最大持仓量', '当前持仓量', '持仓占比', '期初持仓数量', '日内最大持仓量', '当前持仓量', '持仓占比', '',
        '期初持仓数量', '日内最大持仓量', '当前持仓量', '持仓占比', '期初持仓数量', '日内最大持仓量', '当前持仓量', '持仓占比', '',
        '期初持仓数量', '日内最大持仓量', '当前持仓量', '持仓占比', '期初持仓数量', '日内最大持仓量', '当前持仓量', '持仓占比', ''
      ]
    ];

    const rows = filteredData.map(item => [
      item.symbol, item.name, (item.totalShares || 0) / 10000, (item.totalHoldings || 0) / 10000,
      `${(item.holdingsRatioExclCB || 0).toFixed(2)}%`, `${(item.holdingsRatioInclCB || 0).toFixed(2)}%`, `${(item.quotaAllocation || 0).toFixed(2)}%`,
      
      item.parentInitialHoldingsExclCB || 0, item.parentMaxIntradayHoldingsExclCB || 0, item.parentCurrentHoldingsExclCB || 0, `${(item.parentHoldingsRatioExclCB || 0).toFixed(2)}%`,
      item.parentInitialHoldingsInclCB || 0, item.parentMaxIntradayHoldingsInclCB || 0, item.parentCurrentHoldingsInclCB || 0, `${(item.parentHoldingsRatioInclCB || 0).toFixed(2)}%`,
      `${(item.parentQuotaAllocation || 0).toFixed(2)}%`,

      item.hkInitialHoldingsExclCB || 0, item.hkMaxIntradayHoldingsExclCB || 0, item.hkCurrentHoldingsExclCB || 0, `${(item.hkHoldingsRatioExclCB || 0).toFixed(2)}%`,
      item.hkInitialHoldingsInclCB || 0, item.hkMaxIntradayHoldingsInclCB || 0, item.hkCurrentHoldingsInclCB || 0, `${(item.hkHoldingsRatioInclCB || 0).toFixed(2)}%`,
      `${(item.hkQuotaAllocation || 0).toFixed(2)}%`,

      item.connectInitialHoldingsExclCB || 0, item.connectMaxIntradayHoldingsExclCB || 0, item.connectCurrentHoldingsExclCB || 0, `${(item.connectHoldingsRatioExclCB || 0).toFixed(2)}%`,
      item.connectInitialHoldingsInclCB || 0, item.connectMaxIntradayHoldingsInclCB || 0, item.connectCurrentHoldingsInclCB || 0, `${(item.connectHoldingsRatioInclCB || 0).toFixed(2)}%`,
      `${(item.connectQuotaAllocation || 0).toFixed(2)}%`,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([...header, ...rows]);

    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 2, c: 0 } }, { s: { r: 0, c: 1 }, e: { r: 2, c: 1 } },
      { s: { r: 0, c: 2 }, e: { r: 2, c: 2 } }, { s: { r: 0, c: 3 }, e: { r: 2, c: 3 } },
      { s: { r: 0, c: 4 }, e: { r: 2, c: 4 } }, { s: { r: 0, c: 5 }, e: { r: 2, c: 5 } },
      { s: { r: 0, c: 6 }, e: { r: 2, c: 6 } },
      
      { s: { r: 0, c: 7 }, e: { r: 0, c: 15 } }, // 母公司
      { s: { r: 1, c: 7 }, e: { r: 1, c: 10 } }, // 不含债转股
      { s: { r: 1, c: 11 }, e: { r: 1, c: 14 } }, // 含债转股
      { s: { r: 1, c: 15 }, e: { r: 2, c: 15 } }, // 额度配置

      { s: { r: 0, c: 16 }, e: { r: 0, c: 24 } }, // 香港金控
      { s: { r: 1, c: 16 }, e: { r: 1, c: 19 } }, // 不含债转股
      { s: { r: 1, c: 20 }, e: { r: 1, c: 23 } }, // 含债转股
      { s: { r: 1, c: 24 }, e: { r: 2, c: 24 } }, // 额度配置

      { s: { r: 0, c: 25 }, e: { r: 0, c: 33 } }, // 陆股通
      { s: { r: 1, c: 25 }, e: { r: 1, c: 28 } }, // 不含债转股
      { s: { r: 1, c: 29 }, e: { r: 1, c: 32 } }, // 含债转股
      { s: { r: 1, c: 33 }, e: { r: 2, c: 33 } }, // 额度配置
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '集中度报表');
    XLSX.writeFile(workbook, `股票集中度监控大盘_${queryDate.format('YYYYMMDD')}.xlsx`);
    message.success('导出成功');
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSymbol = item.symbol.includes(searchText) || item.name.includes(searchText);
      const isExceed = (item.holdingsRatioInclCB || 0) > (item.quotaAllocation || 0);
      const matchExceed = exceedFilter === 'all' ? true : (exceedFilter === 'exceed' ? isExceed : !isExceed);
      return matchSymbol && matchExceed;
    });
  }, [data, searchText, exceedFilter]);

  const parentClass = 'col-parent';
  const hkClass = 'col-hk';
  const connectClass = 'col-connect';

  const renderHoldings = (val: number | undefined, colorClass: string = 'font-medium text-gray-700', unit: string = '') => {
    const safeVal = val || 0;
    return (
      <div className="flex flex-col items-end">
        <span className={colorClass}>{safeVal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        {unit && <span className="text-[10px] text-gray-400 leading-none mt-0.5">{unit}</span>}
      </div>
    );
  };

  const renderRatio = (val: number | undefined, colorClass: string = 'font-medium text-gray-700') => {
    const safeVal = val || 0;
    return (
      <div className="flex justify-end">
        <span className={colorClass}>{safeVal.toFixed(2)}%</span>
      </div>
    );
  };

  const renderExceed = (val: number | undefined, limit: number | undefined, defaultClass: string = 'font-medium text-gray-700') => {
    const safeVal = val || 0;
    const safeLimit = limit || 0;
    const isExceed = safeVal > safeLimit;
    return (
      <div className="flex justify-end">
        <span className={`${isExceed ? 'text-red-500 font-bold bg-red-50 px-1 rounded' : defaultClass}`}>
          {safeVal.toFixed(2)}%
        </span>
      </div>
    );
  };

  const columns: ColumnsType<HoldingRecord> = [
    { title: '证券代码', dataIndex: 'symbol', width: 80, render: text => <a className="text-blue-600 font-medium">{text}</a>, fixed: 'left', align: 'center' },
    { title: '证券名称', dataIndex: 'name', width: 90, fixed: 'left', align: 'center', render: text => <span className="font-medium text-gray-800">{text}</span> },
    { title: '总股本(万股)', dataIndex: 'totalShares', width: 100, align: 'right', render: val => renderHoldings((val || 0) / 10000) },
    { title: '汇总持仓(万股)', dataIndex: 'totalHoldings', width: 110, align: 'right', render: val => renderHoldings((val || 0) / 10000, 'text-blue-600 font-semibold') },
    { title: '汇总占比(不含)', dataIndex: 'holdingsRatioExclCB', width: 110, align: 'right', render: val => renderRatio(val, 'text-blue-600 font-semibold') },
    { title: '汇总占比(含)', dataIndex: 'holdingsRatioInclCB', width: 110, align: 'right', render: (val, record) => renderExceed(val, record.quotaAllocation, 'text-blue-600 font-semibold') },
    { title: <span className="flex items-center justify-center gap-1">总额度 <EnvironmentFilled className="text-[#c27b57]" /></span>, dataIndex: 'quotaAllocation', width: 90, align: 'center', render: val => <span className="text-[#c27b57] font-bold bg-[#fff7e6] px-2 py-0.5 rounded border border-[#ffd8bf]">{(val || 0).toFixed(2)}%</span> },

    // 母公司
    {
      title: '母公司',
      className: parentClass,
      children: [
        {
          title: '不含债转股',
          className: parentClass,
          children: [
            { title: '期初持仓', dataIndex: 'parentInitialHoldingsExclCB', width: 100, align: 'right', className: parentClass, render: val => renderHoldings(val) },
            { title: '日内最大', dataIndex: 'parentMaxIntradayHoldingsExclCB', width: 100, align: 'right', className: parentClass, render: val => renderHoldings(val) },
            { title: '当前持仓', dataIndex: 'parentCurrentHoldingsExclCB', width: 100, align: 'right', className: parentClass, render: val => renderHoldings(val, 'text-green-700 font-semibold') },
            { title: '持仓占比', dataIndex: 'parentHoldingsRatioExclCB', width: 90, align: 'right', className: parentClass, render: val => renderRatio(val, 'text-green-700 font-semibold') },
          ]
        },
        {
          title: '含债转股',
          className: parentClass,
          children: [
            { title: '期初持仓', dataIndex: 'parentInitialHoldingsInclCB', width: 100, align: 'right', className: parentClass, render: val => renderHoldings(val) },
            { title: '日内最大', dataIndex: 'parentMaxIntradayHoldingsInclCB', width: 100, align: 'right', className: parentClass, render: val => renderHoldings(val) },
            { title: '当前持仓', dataIndex: 'parentCurrentHoldingsInclCB', width: 100, align: 'right', className: parentClass, render: val => renderHoldings(val, 'text-green-700 font-semibold') },
            { title: '持仓占比', dataIndex: 'parentHoldingsRatioInclCB', width: 90, align: 'right', className: parentClass, render: (val, record) => renderExceed(val, record.parentQuotaAllocation, 'text-green-700 font-semibold') },
          ]
        },
        { title: '额度', dataIndex: 'parentQuotaAllocation', width: 70, align: 'center', className: parentClass, render: val => <span className="text-green-700 font-bold">{(val || 0).toFixed(2)}%</span> },
      ]
    },

    // 香港金控
    {
      title: '香港金控 (EQD+EST+PWM)',
      className: hkClass,
      children: [
        {
          title: '不含债转股',
          className: hkClass,
          children: [
            { title: '期初持仓', dataIndex: 'hkInitialHoldingsExclCB', width: 100, align: 'right', className: hkClass, render: val => renderHoldings(val) },
            { title: '日内最大', dataIndex: 'hkMaxIntradayHoldingsExclCB', width: 100, align: 'right', className: hkClass, render: val => renderHoldings(val) },
            { title: '当前持仓', dataIndex: 'hkCurrentHoldingsExclCB', width: 100, align: 'right', className: hkClass, render: val => renderHoldings(val, 'text-purple-700 font-semibold') },
            { title: '持仓占比', dataIndex: 'hkHoldingsRatioExclCB', width: 90, align: 'right', className: hkClass, render: val => renderRatio(val, 'text-purple-700 font-semibold') },
          ]
        },
        {
          title: '含债转股',
          className: hkClass,
          children: [
            { title: '期初持仓', dataIndex: 'hkInitialHoldingsInclCB', width: 100, align: 'right', className: hkClass, render: val => renderHoldings(val) },
            { title: '日内最大', dataIndex: 'hkMaxIntradayHoldingsInclCB', width: 100, align: 'right', className: hkClass, render: val => renderHoldings(val) },
            { title: '当前持仓', dataIndex: 'hkCurrentHoldingsInclCB', width: 100, align: 'right', className: hkClass, render: val => renderHoldings(val, 'text-purple-700 font-semibold') },
            { title: '持仓占比', dataIndex: 'hkHoldingsRatioInclCB', width: 90, align: 'right', className: hkClass, render: (val, record) => renderExceed(val, record.hkQuotaAllocation, 'text-purple-700 font-semibold') },
          ]
        },
        { title: '额度', dataIndex: 'hkQuotaAllocation', width: 70, align: 'center', className: hkClass, render: val => <span className="text-purple-700 font-bold">{(val || 0).toFixed(2)}%</span> },
      ]
    },

    // 陆股通
    {
      title: '陆股通',
      className: connectClass,
      children: [
        {
          title: '不含债转股',
          className: connectClass,
          children: [
            { title: '期初持仓', dataIndex: 'connectInitialHoldingsExclCB', width: 100, align: 'right', className: connectClass, render: val => renderHoldings(val) },
            { title: '日内最大', dataIndex: 'connectMaxIntradayHoldingsExclCB', width: 100, align: 'right', className: connectClass, render: val => renderHoldings(val) },
            { title: '当前持仓', dataIndex: 'connectCurrentHoldingsExclCB', width: 100, align: 'right', className: connectClass, render: val => renderHoldings(val, 'text-orange-700 font-semibold') },
            { title: '持仓占比', dataIndex: 'connectHoldingsRatioExclCB', width: 90, align: 'right', className: connectClass, render: val => renderRatio(val, 'text-orange-700 font-semibold') },
          ]
        },
        {
          title: '含债转股',
          className: connectClass,
          children: [
            { title: '期初持仓', dataIndex: 'connectInitialHoldingsInclCB', width: 100, align: 'right', className: connectClass, render: val => renderHoldings(val) },
            { title: '日内最大', dataIndex: 'connectMaxIntradayHoldingsInclCB', width: 100, align: 'right', className: connectClass, render: val => renderHoldings(val) },
            { title: '当前持仓', dataIndex: 'connectCurrentHoldingsInclCB', width: 100, align: 'right', className: connectClass, render: val => renderHoldings(val, 'text-orange-700 font-semibold') },
            { title: '持仓占比', dataIndex: 'connectHoldingsRatioInclCB', width: 90, align: 'right', className: connectClass, render: (val, record) => renderExceed(val, record.connectQuotaAllocation, 'text-orange-700 font-semibold') },
          ]
        },
        { title: '额度', dataIndex: 'connectQuotaAllocation', width: 70, align: 'center', className: connectClass, render: val => <span className="text-orange-700 font-bold">{(val || 0).toFixed(2)}%</span> },
      ]
    }
  ];

  const modalColumns = [
    {
      title: '修改前信息',
      children: [
        { title: '证券代码', dataIndex: 'symbol', width: 90 },
        { title: '证券名称', dataIndex: 'name', width: 90 },
        { title: '总额度', dataIndex: 'quotaAllocation', width: 80, render: (val: number) => `${(val || 0).toFixed(2)}%` },
        { title: '母公司', dataIndex: 'parentQuotaAllocation', width: 80, render: (val: number) => `${(val || 0).toFixed(2)}%` },
        { title: '香港金控', dataIndex: 'hkQuotaAllocation', width: 80, render: (val: number) => `${(val || 0).toFixed(2)}%` },
        { title: '陆股通', dataIndex: 'connectQuotaAllocation', width: 80, render: (val: number) => `${(val || 0).toFixed(2)}%` },
      ]
    },
    {
      title: '修改后信息',
      children: [
        { 
          title: '证券代码', 
          dataIndex: 'symbol', 
          width: 90,
          render: (text: string, _: any, index: number) => (
            <>
              <span className="text-blue-600 font-medium">{text}</span>
              <Form.Item name={['items', index, 'symbol']} hidden>
                <Input />
              </Form.Item>
            </>
          )
        },
        { 
          title: '总额度', 
          width: 110,
          render: (_: any, __: any, index: number) => (
            <Form.Item name={['items', index, 'quotaAllocation']} rules={[{required: true, message: '必填'}]} style={{margin: 0}}>
              <InputNumber min={0} max={100} step={0.1} addonAfter="%" size="small" style={{width: '100%'}} />
            </Form.Item>
          )
        },
        { 
          title: '母公司', 
          width: 110,
          render: (_: any, __: any, index: number) => (
            <Form.Item name={['items', index, 'parentQuotaAllocation']} rules={[{required: true, message: '必填'}]} style={{margin: 0}}>
              <InputNumber min={0} max={100} step={0.1} addonAfter="%" size="small" style={{width: '100%'}} />
            </Form.Item>
          )
        },
        { 
          title: '香港金控', 
          width: 110,
          render: (_: any, __: any, index: number) => (
            <Form.Item name={['items', index, 'hkQuotaAllocation']} rules={[{required: true, message: '必填'}]} style={{margin: 0}}>
              <InputNumber min={0} max={100} step={0.1} addonAfter="%" size="small" style={{width: '100%'}} />
            </Form.Item>
          )
        },
        { 
          title: '陆股通', 
          width: 110,
          render: (_: any, __: any, index: number) => (
            <Form.Item name={['items', index, 'connectQuotaAllocation']} rules={[{required: true, message: '必填'}]} style={{margin: 0}}>
              <InputNumber min={0} max={100} step={0.1} addonAfter="%" size="small" style={{width: '100%'}} />
            </Form.Item>
          )
        },
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col absolute inset-0 bg-white">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Title level={4} style={{ margin: 0, color: '#1f2937' }}>股票集中度监控大盘</Title>
            <InfoCircleOutlined className="text-gray-400 text-base cursor-pointer hover:text-[#c27b57] transition-colors" />
          </div>
          <Space>
            <div className="text-xs text-gray-500 flex items-center gap-1.5 mr-4 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              {queryDate.isSame(dayjs(), 'day') ? (
                <>
                  <SyncOutlined spin className="text-[#c27b57]" />
                  <span>最后更新：<span className="font-medium text-gray-700">{lastUpdateTime}</span></span>
                </>
              ) : (
                <span className="text-gray-400">历史数据（不刷新）</span>
              )}
            </div>
            <Button className="bg-white text-[#c27b57] border-[#c27b57] hover:!bg-[#fff7e6] hover:!text-[#a66544] hover:!border-[#a66544]" onClick={handleExport}>导出数据</Button>
            <Button type="primary" className="bg-[#c27b57] hover:!bg-[#a66544] border-none shadow-sm" onClick={handleOpenModal}>批量修改额度</Button>
          </Space>
        </div>

        <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm font-medium">查询日期</span>
            <DatePicker 
              value={queryDate}
              onChange={(date) => setQueryDate(date || dayjs())}
              disabledDate={(current) => current && current > dayjs().endOf('day')}
              style={{ width: 130 }}
              allowClear={false}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm font-medium">证券代码</span>
            <Input 
              placeholder="输入代码或名称" 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 180 }}
              allowClear
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm font-medium">额度状态</span>
            <Select
              value={exceedFilter}
              onChange={setExceedFilter}
              style={{ width: 120 }}
              options={[
                { value: 'all', label: '全部' },
                { value: 'exceed', label: '已超额' },
                { value: 'normal', label: '正常' },
              ]}
            />
          </div>
          <Button 
            type="primary" 
            className="bg-[#1f2937] hover:!bg-[#374151] border-none px-6 shadow-sm" 
            onClick={handleSearch}
            loading={loading}
          >
            查询
          </Button>
        </div>
      </div>

      <div className="px-6 pt-2 shrink-0">
        <Tabs defaultActiveKey="A" className="custom-tabs">
          <Tabs.TabPane tab="A+H股" key="AH" />
          <Tabs.TabPane tab="A股" key="A" />
          <Tabs.TabPane tab="H股" key="H" />
        </Tabs>
      </div>
      
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <Table 
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          scroll={{ x: 3800, y: 'calc(100vh - 360px)' }}
          pagination={{ 
            total: filteredData.length, 
            pageSize: 50, 
            showSizeChanger: true, 
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          size="small"
          bordered={true}
          loading={loading}
          className="custom-table shadow-sm border border-gray-200 rounded-lg overflow-hidden"
        />
      </div>

      <Modal
        title={<div className="text-lg font-bold text-gray-800">批量修改额度配置</div>}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={1200}
        destroyOnClose
        okText="确认修改"
        cancelText="取消"
        okButtonProps={{ className: "bg-[#c27b57] hover:!bg-[#a66544] border-none" }}
      >
        <div className="mt-4 mb-2 text-gray-500">
          <InfoCircleOutlined className="mr-2 text-[#c27b57]" />
          请在右侧“修改后信息”区域输入新的额度配置。
        </div>
        <Form form={form}>
          <Table
            dataSource={data.filter(item => selectedRowKeys.includes(item.id))}
            columns={modalColumns}
            rowKey="id"
            pagination={false}
            scroll={{ x: 'max-content', y: 400 }}
            size="small"
            bordered
          />
        </Form>
      </Modal>
    </div>
  );
};
export default ReportView;
