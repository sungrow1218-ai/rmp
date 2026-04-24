import React, { useState } from 'react';
import { Form, Input, Select, Switch, Button, Typography, InputNumber, Space, message, Collapse, DatePicker, TimePicker, Card } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, CheckCircleOutlined, ShopOutlined, BankOutlined, GlobalOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const businessLines = [
{ id: 'brokerage', name: '经纪业务', icon: <ShopOutlined />, desc: '适用于普通经纪业务客户的交易行为监控' },
{ id: 'proprietary', name: '自营业务', icon: <BankOutlined />, desc: '适用于公司自营盘的交易行为监控' },
{ id: 'qfii', name: 'QFII业务', icon: <GlobalOutlined />, desc: '适用于合格境外机构投资者的交易行为监控' },
];

interface SingleRuleCreateProps {
  /** 是否为内嵌模式（从规则设置页面内嵌显示） */
  embedded?: boolean;
  /** 内嵌模式下的关闭回调 */
  onClose?: () => void;
}

export const SingleRuleCreate: React.FC<SingleRuleCreateProps> = ({ embedded = false, onClose }) => {
const navigate = useNavigate();
const [form] = Form.useForm();
const [loading, setLoading] = useState(false);

// 步骤控制：0 - 选择业务线，1 - 填写表单
const [step, setStep] = useState<0 | 1>(0);
const [selectedLine, setSelectedLine] = useState<string | null>(null);

// 监听账户控制类型，用于动态渲染表单项
const accountControlType = Form.useWatch('accountControlType', form);

const handleBack = () => {
  if (step === 1) {
    setStep(0);
  } else {
    // 如果为内嵌模式，调用 onClose；否则导航
    if (embedded && onClose) {
      onClose();
    } else {
      navigate('/rule/ruleSetting');
    }
  }
};

const handleSave = async (isSubmit: boolean = false) => {
  try {
    await form.validateFields();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success(isSubmit ? '提交审核成功' : '保存草稿成功');
      // 保存成功后，内嵌模式调用 onClose，否则导航
      if (embedded && onClose) {
        onClose();
      } else {
        navigate('/rule/ruleSetting');
      }
    }, 800);
  } catch (error) {
    console.error('Validation failed:', error);
    message.error('请检查必填项是否已填写完整');
  }
};

const currentBusinessLineName = businessLines.find(b => b.id === selectedLine)?.name;

return (
<div className="h-full flex flex-col absolute inset-0 bg-gray-50">
  {/* 顶部导航 */}
  <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 shadow-sm z-10">
    <div className="flex items-center gap-4">
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack} className="text-gray-500 hover:text-[#1890ff]" />
      <Title level={4} style={{ margin: 0, color: '#333' }}>
        {step === 0 ? '创建单个规则指标' : `创建单个规则指标 - ${currentBusinessLineName}`}
      </Title>
    </div>
    {step === 1 && (
      <Space>
        <Button onClick={() => embedded && onClose ? onClose() : navigate('/rule/ruleSetting')}>取消</Button>
        <Button icon={<SaveOutlined />} onClick={() => handleSave(false)} loading={loading}>保存草稿</Button>
        <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" icon={<CheckCircleOutlined />} onClick={() => handleSave(true)} loading={loading}>提交审核</Button>
      </Space>
    )}
  </div>

  {/* 主体内容区 */}
  <div className="flex-1 overflow-y-auto">
    {step === 0 ? (
      // 步骤 1：选择业务线
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="text-center mb-10">
          <Title level={2} className="text-gray-800 mb-4">请选择业务线</Title>
          <Text className="text-gray-500 text-base">不同业务线的指标将分开独立设置与管理</Text>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {businessLines.map((item) => (
            <Card
              key={item.id}
              hoverable
              className={`w-72 h-56 flex flex-col transition-all duration-300 ${
                selectedLine === item.id 
                  ? 'border-2 border-[#1890ff] bg-[#e6f7ff] shadow-md transform -translate-y-1' 
                  : 'border border-gray-200 hover:border-[#1890ff]/50 hover:shadow-sm'
              }`}
              bodyStyle={{ padding: '32px 24px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
              onClick={() => setSelectedLine(item.id)}
            >
              <div className={`text-5xl mb-4 transition-colors ${selectedLine === item.id ? 'text-[#1890ff]' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              <div className={`text-xl font-bold mb-2 transition-colors ${selectedLine === item.id ? 'text-[#1890ff]' : 'text-gray-700'}`}>
                {item.name}
              </div>
              <div className="text-sm text-gray-500 line-clamp-2">
                {item.desc}
              </div>
              
              {selectedLine === item.id && (
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-t-[#1890ff] border-l-[32px] border-l-transparent">
                  <CheckCircleOutlined className="absolute -top-[28px] -left-[18px] text-white text-sm" />
                </div>
              )}
            </Card>
          ))}
        </div>

        <Button 
          type="primary" 
          size="large"
          className={`w-48 h-12 text-lg rounded-full flex items-center justify-center gap-2 ${selectedLine ? 'bg-[#1890ff] hover:!bg-[#096dd9] border-none shadow-md' : 'bg-gray-300 border-none text-gray-500'}`}
          disabled={!selectedLine}
          onClick={() => setStep(1)}
        >
          开始创建指标 <ArrowRightOutlined />
        </Button>
      </div>
    ) : (
      // 步骤 2：填写表单
      <div className="p-6 w-full">
        <Form 
          form={form} 
          layout="vertical" 
          initialValues={{ 
            status: true,
            priority: 5,
            ruleType: '连续竞价阶段拉抬打压控制',
            accountControlType: '对接系统',
            jointControlMode: '单独控制',
            securityControlMethod: '按动态维度',
            securitySummaryMethod: '单独计算',
            timeWindow: 3
          }}
        >
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
                <Form.Item name="ruleName" label="规则名称" rules={[{ required: true, message: '请输入规则名称' }]}>
                  <Input placeholder="请输入规则名称" />
                </Form.Item>
                <Form.Item name="ruleType" label="规则类型" rules={[{ required: true, message: '请选择规则类型' }]}>
                  <Select>
                    <Select.Option value="连续竞价阶段拉抬打压控制">连续竞价阶段拉抬打压控制</Select.Option>
                    <Select.Option value="开盘集合竞价阶段虚假申报">开盘集合竞价阶段虚假申报</Select.Option>
                    <Select.Option value="连续竞价阶段虚假申报控制">连续竞价阶段虚假申报控制</Select.Option>
                    <Select.Option value="证券持仓数量控制">证券持仓数量控制</Select.Option>
                    <Select.Option value="证券持仓比例控制">证券持仓比例控制</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请输入优先级' }]}>
                  <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="status" label="启用状态" valuePropName="checked">
                  <Switch checkedChildren="启用" unCheckedChildren="停用" />
                </Form.Item>
                <Form.Item name="description" label="规则描述" className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                  <Input placeholder="请输入规则描述（选填）" />
                </Form.Item>
              </div>
            </Panel>

            {/* 账户控制范围 */}
            <Panel 
              header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">账户控制范围</span>} 
              key="account" 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
                <Form.Item name="accountControlType" label="账户控制类型" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="对接系统">对接系统</Select.Option>
                    <Select.Option value="证券账户">证券账户</Select.Option>
                    <Select.Option value="投资组合">投资组合</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="jointControlMode" label="联合控制模式" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="单独控制">单独控制</Select.Option>
                    <Select.Option value="联合控制">联合控制</Select.Option>
                  </Select>
                </Form.Item>
                
                {/* 动态渲染对接系统相关字段 */}
                {accountControlType === '对接系统' ? (
                  <>
                    <Form.Item name="dockingSystem" label="对接系统">
                      <Select mode="multiple" placeholder="请选择对接系统（留空表示全部）">
                        <Select.Option value="sys1">O32投资交易系统</Select.Option>
                        <Select.Option value="sys2">PB投资交易系统</Select.Option>
                        <Select.Option value="sys3">集中交易系统</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="excludeAccountType" label="排除账户类型">
                      <Select mode="multiple" placeholder="请选择排除账户类型">
                        <Select.Option value="type1">信用账户</Select.Option>
                        <Select.Option value="type2">衍生品账户</Select.Option>
                        <Select.Option value="type3">期权账户</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="excludeAccountList" label="排除账户列表">
                      <Select mode="multiple" placeholder="请选择排除账户">
                        <Select.Option value="acc1">测试账户01</Select.Option>
                        <Select.Option value="acc2">测试账户02</Select.Option>
                        <Select.Option value="acc3">自营特殊账户</Select.Option>
                      </Select>
                    </Form.Item>
                  </>
                ) : (
                  <Form.Item name="includedAccounts" label="包含账户/系统" className="col-span-1 md:col-span-2 lg:col-span-2">
                    <Select mode="multiple" placeholder="请选择要控制的账户或系统（留空表示全部）">
                      <Select.Option value="sys1">O32投资交易系统</Select.Option>
                      <Select.Option value="sys2">PB投资交易系统</Select.Option>
                      <Select.Option value="acc1">自营账户A</Select.Option>
                    </Select>
                  </Form.Item>
                )}
              </div>
            </Panel>

            {/* 证券控制范围 */}
            <Panel 
              header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">证券控制范围</span>} 
              key="security" 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
                <Form.Item name="securityControlMethod" label="证券控制方式" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="按动态维度">按动态维度</Select.Option>
                    <Select.Option value="证券类别">证券类别</Select.Option>
                    <Select.Option value="指定证券">指定证券</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="securitySummaryMethod" label="证券汇总方式" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="单独计算">单独计算</Select.Option>
                    <Select.Option value="分组计算">分组计算</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="dynamicDimension" label="动态维度列表">
                  <Select mode="multiple" placeholder="请选择动态维度">
                    <Select.Option value="dim1">行业维度</Select.Option>
                    <Select.Option value="dim2">板块维度</Select.Option>
                    <Select.Option value="dim3">概念维度</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="market" label="市场">
                  <Select mode="multiple" placeholder="请选择市场">
                    <Select.Option value="SH">上海证券交易所</Select.Option>
                    <Select.Option value="SZ">深圳证券交易所</Select.Option>
                    <Select.Option value="BJ">北京证券交易所</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </Panel>

            {/* 计算参数 */}
            <Panel 
              header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">计算参数</span>} 
              key="calc" 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
                <Form.Item name="timeWindow" label="时间窗口" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value={1}>1分钟</Select.Option>
                    <Select.Option value={3}>3分钟</Select.Option>
                    <Select.Option value={5}>5分钟</Select.Option>
                    <Select.Option value={10}>10分钟</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </Panel>

            {/* 通用阈值 */}
            <Panel 
              header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">通用阈值</span>} 
              key="threshold" 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="flex flex-col gap-6">
                {/* 表头 */}
                <div className="grid grid-cols-4 gap-4 pb-2 border-b border-gray-100 text-gray-500 font-medium text-sm">
                  <div>阈值条件</div>
                  <div>一级阈值</div>
                  <div>二级阈值</div>
                  <div>三级阈值</div>
                </div>
                
                {/* 成交金额 */}
                <div className="grid grid-cols-4 gap-4 items-start">
                  <div className="pt-2 text-gray-700 font-medium">成交金额 (万元)</div>
                  <Form.Item name="amount_t1" rules={[{ required: true, message: '必填' }]}><InputNumber className="w-full" placeholder="请输入" /></Form.Item>
                  <Form.Item name="amount_t2" rules={[{ required: true, message: '必填' }]}><InputNumber className="w-full" placeholder="请输入" /></Form.Item>
                  <Form.Item name="amount_t3" rules={[{ required: true, message: '必填' }]}><InputNumber className="w-full" placeholder="请输入" /></Form.Item>
                </div>
                
                {/* 成交数量 */}
                <div className="grid grid-cols-4 gap-4 items-start">
                  <div className="pt-2 text-gray-700 font-medium">成交数量 (万股)</div>
                  <Form.Item name="volume_t1" rules={[{ required: true, message: '必填' }]}><InputNumber className="w-full" placeholder="请输入" /></Form.Item>
                  <Form.Item name="volume_t2" rules={[{ required: true, message: '必填' }]}><InputNumber className="w-full" placeholder="请输入" /></Form.Item>
                  <Form.Item name="volume_t3" rules={[{ required: true, message: '必填' }]}><InputNumber className="w-full" placeholder="请输入" /></Form.Item>
                </div>

                {/* 成交价格涨跌幅 */}
                <div className="grid grid-cols-4 gap-4 items-start">
                  <div className="pt-2 text-gray-700 font-medium">成交价格涨跌幅 (%)</div>
                  <Form.Item name="price_t1" rules={[{ required: true, message: '必填' }]}><InputNumber className="w-full" placeholder="请输入" /></Form.Item>
                  <Form.Item name="price_t2" rules={[{ required: true, message: '必填' }]}><InputNumber className="w-full" placeholder="请输入" /></Form.Item>
                  <Form.Item name="price_t3" rules={[{ required: true, message: '必填' }]}><InputNumber className="w-full" placeholder="请输入" /></Form.Item>
                </div>

                {/* 市场成交占比 */}
                <div className="grid grid-cols-4 gap-4 items-start">
                  <div className="pt-2 text-gray-700 font-medium">市场成交占比 (%)</div>
                  <Form.Item name="ratio_t1" rules={[{ required: true, message: '必填' }]}><InputNumber className="w-full" placeholder="请输入" /></Form.Item>
                  <Form.Item name="ratio_t2" rules={[{ required: true, message: '必填' }]}><InputNumber className="w-full" placeholder="请输入" /></Form.Item>
                  <Form.Item name="ratio_t3" rules={[{ required: true, message: '必填' }]}><InputNumber className="w-full" placeholder="请输入" /></Form.Item>
                </div>
              </div>
            </Panel>

            {/* 高级控制 */}
            <Panel 
              header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">高级控制</span>} 
              key="advanced" 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
                <Form.Item name="effectiveDate" label="生效日期">
                  <DatePicker.RangePicker className="w-full" />
                </Form.Item>
                <Form.Item name="effectiveTime" label="生效时间">
                  <TimePicker.RangePicker className="w-full" format="HH:mm:ss" />
                </Form.Item>
              </div>
            </Panel>

          </Collapse>
        </Form>
      </div>
    )}
  </div>
</div>
);
};
export default SingleRuleCreate;



