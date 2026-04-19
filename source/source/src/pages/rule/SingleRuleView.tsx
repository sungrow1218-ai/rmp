import React, { useState, useEffect } from 'react';
import { Button, Typography, Space, Collapse, Descriptions, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;
const { Panel } = Collapse;

export const SingleRuleView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // 模拟从后端获取数据
    setTimeout(() => {
      setData({
        ruleName: '连续竞价阶段拉抬打压控制 - 示例',
        ruleType: '连续竞价阶段拉抬打压控制',
        priority: 5,
        status: true,
        description: '这是一个用于测试查看功能的指标',
        accountControlType: '对接系统',
        jointControlMode: '单独控制',
        dockingSystem: ['O32投资交易系统', 'PB投资交易系统'],
        excludeAccountType: [],
        excludeAccountList: [],
        securityControlMethod: '按动态维度',
        securitySummaryMethod: '单独计算',
        dynamicDimension: ['行业维度', '板块维度'],
        market: ['上海证券交易所', '深圳证券交易所'],
        timeWindow: 3,
        amount_t1: 100, amount_t2: 200, amount_t3: 300,
        volume_t1: 10, volume_t2: 20, volume_t3: 30,
        price_t1: 2, price_t2: 4, price_t3: 6,
        ratio_t1: 5, ratio_t2: 10, ratio_t3: 15,
        effectiveDate: ['2023-01-01', '2023-12-31'],
        effectiveTime: ['09:30:00', '15:00:00']
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleBack = () => {
    navigate('/rule-settings');
  };

  if (loading || !data) {
    return <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">加载中...</div>;
  }

  return (
    <div className="h-full flex flex-col absolute inset-0 bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack} className="text-gray-500 hover:text-[#1890ff]" />
          <Title level={4} style={{ margin: 0, color: '#333' }}>查看单个规则指标</Title>
        </div>
        <Space>
          <Button onClick={handleBack}>返回</Button>
          <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={() => navigate(`/single-rule-edit/${id}`)}>编辑指标</Button>
        </Space>
      </div>

      {/* 主体内容区 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="w-full">
          <Collapse 
            defaultActiveKey={['basic', 'account', 'security', 'calc', 'threshold', 'advanced']} 
            className="bg-transparent border-none flex flex-col gap-4" 
            expandIconPosition="end"
          >
            
            {/* 基本信息 */}
            <Panel 
              header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">基本信息</span>} 
              key="basic" 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="规则名称">{data.ruleName}</Descriptions.Item>
                <Descriptions.Item label="规则类型"><Tag color="blue">{data.ruleType}</Tag></Descriptions.Item>
                <Descriptions.Item label="优先级">{data.priority}</Descriptions.Item>
                <Descriptions.Item label="启用状态">
                  {data.status ? <Tag color="success">已启用</Tag> : <Tag color="error">已停用</Tag>}
                </Descriptions.Item>
                <Descriptions.Item label="规则描述" span={2}>{data.description || '-'}</Descriptions.Item>
              </Descriptions>
            </Panel>

            {/* 账户控制范围 */}
            <Panel 
              header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">账户控制范围</span>} 
              key="account" 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="账户控制类型">{data.accountControlType}</Descriptions.Item>
                <Descriptions.Item label="联合控制模式">{data.jointControlMode}</Descriptions.Item>
                
                {data.accountControlType === '对接系统' ? (
                  <>
                    <Descriptions.Item label="对接系统">{data.dockingSystem?.join(', ') || '全部'}</Descriptions.Item>
                    <Descriptions.Item label="排除账户类型">{data.excludeAccountType?.join(', ') || '无'}</Descriptions.Item>
                    <Descriptions.Item label="排除账户列表">{data.excludeAccountList?.join(', ') || '无'}</Descriptions.Item>
                  </>
                ) : (
                  <Descriptions.Item label="包含账户/系统">{data.includedAccounts?.join(', ') || '全部'}</Descriptions.Item>
                )}
              </Descriptions>
            </Panel>

            {/* 证券控制范围 */}
            <Panel 
              header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">证券控制范围</span>} 
              key="security" 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="证券控制方式">{data.securityControlMethod}</Descriptions.Item>
                <Descriptions.Item label="证券汇总方式">{data.securitySummaryMethod}</Descriptions.Item>
                <Descriptions.Item label="动态维度列表">{data.dynamicDimension?.join(', ') || '-'}</Descriptions.Item>
                <Descriptions.Item label="市场">{data.market?.join(', ') || '-'}</Descriptions.Item>
              </Descriptions>
            </Panel>

            {/* 计算参数 */}
            <Panel 
              header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">计算参数</span>} 
              key="calc" 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="时间窗口">{data.timeWindow} 分钟</Descriptions.Item>
              </Descriptions>
            </Panel>

            {/* 通用阈值 */}
            <Panel 
              header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">通用阈值</span>} 
              key="threshold" 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-4 pb-2 border-b border-gray-100 text-gray-500 font-medium text-sm">
                  <div>阈值条件</div>
                  <div>一级阈值</div>
                  <div>二级阈值</div>
                  <div>三级阈值</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="text-gray-700 font-medium">成交金额 (万元)</div>
                  <div className="text-[#1890ff] font-medium">{data.amount_t1}</div>
                  <div className="text-[#1890ff] font-medium">{data.amount_t2}</div>
                  <div className="text-[#1890ff] font-medium">{data.amount_t3}</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="text-gray-700 font-medium">成交数量 (万股)</div>
                  <div className="text-[#1890ff] font-medium">{data.volume_t1}</div>
                  <div className="text-[#1890ff] font-medium">{data.volume_t2}</div>
                  <div className="text-[#1890ff] font-medium">{data.volume_t3}</div>
                </div>

                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="text-gray-700 font-medium">成交价格涨跌幅 (%)</div>
                  <div className="text-[#1890ff] font-medium">{data.price_t1}</div>
                  <div className="text-[#1890ff] font-medium">{data.price_t2}</div>
                  <div className="text-[#1890ff] font-medium">{data.price_t3}</div>
                </div>

                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="text-gray-700 font-medium">市场成交占比 (%)</div>
                  <div className="text-[#1890ff] font-medium">{data.ratio_t1}</div>
                  <div className="text-[#1890ff] font-medium">{data.ratio_t2}</div>
                  <div className="text-[#1890ff] font-medium">{data.ratio_t3}</div>
                </div>
              </div>
            </Panel>

            {/* 高级控制 */}
            <Panel 
              header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">高级控制</span>} 
              key="advanced" 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="生效日期">
                  {data.effectiveDate ? `${data.effectiveDate[0]} 至 ${data.effectiveDate[1]}` : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="生效时间">
                  {data.effectiveTime ? `${data.effectiveTime[0]} 至 ${data.effectiveTime[1]}` : '-'}
                </Descriptions.Item>
              </Descriptions>
            </Panel>

          </Collapse>
        </div>
      </div>
    </div>
  );
};
export default SingleRuleView;
