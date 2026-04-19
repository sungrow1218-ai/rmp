import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Button, Typography, Tree, InputNumber, Space, message, Collapse, Checkbox, Tabs, Modal, Select } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, CheckCircleOutlined, InfoCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

// 规则树数据
const treeData = [
{
title: '异常交易类',
key: 'abnormal',
children: [
  {
    title: '拉抬打压',
    key: 'manipulation',
    children: [
      { title: '连续竞价阶段拉抬打压控制', key: 'continuous_bidding' },
    ],
  },
  {
    title: '虚假申报',
    key: 'false_declaration',
    children: [
      { title: '开盘集合竞价阶段虚假申报', key: 'open_call_auction_false_declaration' },
      { title: '连续竞价阶段虚假申报控制', key: 'continuous_false_declaration' },
    ],
  }
],
}
];

const defaultScopes = {
continuous_bidding: {
SH: [
  { id: 'riskWarning', name: '风险警示股' },
  { id: 'sz50', name: '上证50成分股' },
  { id: 'other', name: '非上证50非风险警示股' }
],
SZ: [
  { id: 'riskWarning', name: '风险警示股' },
  { id: 'other', name: '非风险警示股' }
]
},
open_call_auction_false_declaration: {
SH: [
  { id: 'riskWarning', name: '风险警示股' },
  { id: 'other', name: '非风险警示股' }
],
SZ: [
  { id: 'riskWarning', name: '风险警示股' },
  { id: 'other', name: '非风险警示股' }
]
},
continuous_false_declaration: {
SH: [
  { id: 'riskWarning', name: '风险警示股' },
  { id: 'other', name: '非风险警示股' }
],
SZ: [
  { id: 'riskWarning', name: '风险警示股' },
  { id: 'other', name: '非风险警示股' }
]
}
};

const dynamicDimensionGroups = [
{ value: 'dim_industry_a', label: '行业维度组A' },
{ value: 'dim_sector_b', label: '板块维度组B' },
{ value: 'dim_concept_c', label: '概念维度组C' },
{ value: 'dim_custom_d', label: '自定义证券组D' },
{ value: 'dim_core_assets', label: '核心资产组' },
];

export const RuleEdit: React.FC = () => {
const navigate = useNavigate();
const { id } = useParams();
const [form] = Form.useForm();
const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['continuous_bidding']);
const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['continuous_bidding']);
const [loading, setLoading] = useState(false);
const [dataLoading, setDataLoading] = useState(true);

// 选中的交易市场
const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['SH', 'SZ']);
// 激活的市场 Tab
const [activeMarketTab, setActiveMarketTab] = useState<string>('SH');

// 动态证券控制条件状态
const [scopes, setScopes] = useState(defaultScopes);
const [isAddScopeModalVisible, setIsAddScopeModalVisible] = useState(false);
const [selectedNewScopes, setSelectedNewScopes] = useState<string[]>([]);
const [addScopeContext, setAddScopeContext] = useState<{ruleKey: string, market: string} | null>(null);

useEffect(() => {
// 模拟从后端获取数据并回填表单
setTimeout(() => {
  form.setFieldsValue({
    ruleName: 'UST-A-TYFXRZGB',
    status: true,
    description: '这是一个编辑模板指标的示例',
    thresholds: {
      SH: {
        riskWarning: { volume_t1: 10, volume_t2: 20, volume_t3: 30, amount_t1: 100, amount_t2: 200, amount_t3: 300, ratio_t1: 5, ratio_t2: 10, ratio_t3: 15, price_t1: 2, price_t2: 4, price_t3: 6 },
        sz50: { volume_t1: 15, volume_t2: 25, volume_t3: 35, amount_t1: 150, amount_t2: 250, amount_t3: 350, ratio_t1: 6, ratio_t2: 12, ratio_t3: 18, price_t1: 3, price_t2: 5, price_t3: 7 },
        other: { volume_t1: 20, volume_t2: 30, volume_t3: 40, amount_t1: 200, amount_t2: 300, amount_t3: 400, ratio_t1: 7, ratio_t2: 14, ratio_t3: 21, price_t1: 4, price_t2: 6, price_t3: 8 }
      },
      SZ: {
        riskWarning: { volume_t1: 10, volume_t2: 20, volume_t3: 30, amount_t1: 100, amount_t2: 200, amount_t3: 300, ratio_t1: 5, ratio_t2: 10, ratio_t3: 15, price_t1: 2, price_t2: 4, price_t3: 6 },
        other: { volume_t1: 20, volume_t2: 30, volume_t3: 40, amount_t1: 200, amount_t2: 300, amount_t3: 400, ratio_t1: 7, ratio_t2: 14, ratio_t3: 21, price_t1: 4, price_t2: 6, price_t3: 8 }
      }
    },
    false_declaration_thresholds: {
      SH: {
        riskWarning: { 
          price_deviation_t1: 5, price_deviation_t2: 10, price_deviation_t3: 15,
          declare_volume_t1: 10, declare_volume_t2: 20, declare_volume_t3: 30, 
          declare_amount_t1: 100, declare_amount_t2: 200, declare_amount_t3: 300, 
          market_declare_ratio_t1: 10, market_declare_ratio_t2: 20, market_declare_ratio_t3: 30,
          cancel_ratio_t1: 50, cancel_ratio_t2: 60, cancel_ratio_t3: 70,
          reverse_declare_count_t1: 3, reverse_declare_count_t2: 5, reverse_declare_count_t3: 10
        },
        other: { 
          price_deviation_t1: 5, price_deviation_t2: 10, price_deviation_t3: 15,
          declare_volume_t1: 20, declare_volume_t2: 30, declare_volume_t3: 40, 
          declare_amount_t1: 200, declare_amount_t2: 300, declare_amount_t3: 400, 
          market_declare_ratio_t1: 15, market_declare_ratio_t2: 25, market_declare_ratio_t3: 35,
          cancel_ratio_t1: 60, cancel_ratio_t2: 70, cancel_ratio_t3: 80,
          reverse_declare_count_t1: 4, reverse_declare_count_t2: 6, reverse_declare_count_t3: 12
        }
      },
      SZ: {
        riskWarning: { 
          price_deviation_t1: 5, price_deviation_t2: 10, price_deviation_t3: 15,
          declare_volume_t1: 10, declare_volume_t2: 20, declare_volume_t3: 30, 
          declare_amount_t1: 100, declare_amount_t2: 200, declare_amount_t3: 300, 
          market_declare_ratio_t1: 10, market_declare_ratio_t2: 20, market_declare_ratio_t3: 30,
          cancel_ratio_t1: 50, cancel_ratio_t2: 60, cancel_ratio_t3: 70,
          reverse_declare_count_t1: 3, reverse_declare_count_t2: 5, reverse_declare_count_t3: 10
        },
        other: { 
          price_deviation_t1: 5, price_deviation_t2: 10, price_deviation_t3: 15,
          declare_volume_t1: 20, declare_volume_t2: 30, declare_volume_t3: 40, 
          declare_amount_t1: 200, declare_amount_t2: 300, declare_amount_t3: 400, 
          market_declare_ratio_t1: 15, market_declare_ratio_t2: 25, market_declare_ratio_t3: 35,
          cancel_ratio_t1: 60, cancel_ratio_t2: 70, cancel_ratio_t3: 80,
          reverse_declare_count_t1: 4, reverse_declare_count_t2: 6, reverse_declare_count_t3: 12
        }
      }
    },
    continuous_false_declaration_thresholds: {
      SH: {
        riskWarning: { 
          volume_t1: 10, volume_t2: 20, volume_t3: 30, 
          amount_t1: 100, amount_t2: 200, amount_t3: 300, 
          ratio_t1: 10, ratio_t2: 20, ratio_t3: 30,
          count_t1: 3, count_t2: 5, count_t3: 10,
          cancel_ratio_t1: 50, cancel_ratio_t2: 60, cancel_ratio_t3: 70,
          reverse_trade_count_t1: 3, reverse_trade_count_t2: 5, reverse_trade_count_t3: 10
        },
        other: { 
          volume_t1: 20, volume_t2: 30, volume_t3: 40, 
          amount_t1: 200, amount_t2: 300, amount_t3: 400, 
          ratio_t1: 15, ratio_t2: 25, ratio_t3: 35,
          count_t1: 4, count_t2: 6, count_t3: 12,
          cancel_ratio_t1: 60, cancel_ratio_t2: 70, cancel_ratio_t3: 80,
          reverse_trade_count_t1: 4, reverse_trade_count_t2: 6, reverse_trade_count_t3: 12
        }
      },
      SZ: {
        riskWarning: { 
          volume_t1: 10, volume_t2: 20, volume_t3: 30, 
          amount_t1: 100, amount_t2: 200, amount_t3: 300, 
          ratio_t1: 10, ratio_t2: 20, ratio_t3: 30,
          count_t1: 3, count_t2: 5, count_t3: 10,
          cancel_ratio_t1: 50, cancel_ratio_t2: 60, cancel_ratio_t3: 70,
          reverse_trade_count_t1: 3, reverse_trade_count_t2: 5, reverse_trade_count_t3: 10
        },
        other: { 
          volume_t1: 20, volume_t2: 30, volume_t3: 40, 
          amount_t1: 200, amount_t2: 300, amount_t3: 400, 
          ratio_t1: 15, ratio_t2: 25, ratio_t3: 35,
          count_t1: 4, count_t2: 6, count_t3: 12,
          cancel_ratio_t1: 60, cancel_ratio_t2: 70, cancel_ratio_t3: 80,
          reverse_trade_count_t1: 4, reverse_trade_count_t2: 6, reverse_trade_count_t3: 12
        }
      }
    }
  });
  setDataLoading(false);
}, 500);
}, [form, id]);

const handleBack = () => {
navigate('/rule-settings');
};

const handleSave = async (isSubmit: boolean = false) => {
try {
  await form.validateFields();
  if (checkedKeys.length === 0) {
    message.warning('请至少勾选一个规则类型进行配置');
    return;
  }

  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    message.success(isSubmit ? '提交审核成功' : '保存修改成功');
    navigate('/rule-settings');
  }, 800);
} catch (error) {
  console.error('Validation failed:', error);
  message.error('请检查必填项是否已填写完整');
}
};

const onSelect = (selectedKeysValue: React.Key[], info: any) => {
setSelectedKeys(selectedKeysValue);
};

const onCheck = (checkedKeysValue: any) => {
setCheckedKeys(checkedKeysValue.checked || checkedKeysValue);
};

const handleMarketChange = (list: string[]) => {
setSelectedMarkets(list);
// 如果当前激活的 tab 被取消勾选，则自动切换到第一个选中的 tab
if (list.length > 0 && !list.includes(activeMarketTab)) {
  setActiveMarketTab(list[0]);
}
};

const handleAddScopeOk = () => {
if (selectedNewScopes.length === 0) {
  message.warning('请选择证券范围');
  return;
}
if (addScopeContext) {
  const { ruleKey, market } = addScopeContext;
  
  setScopes(prev => {
    const currentScopes = prev[ruleKey as keyof typeof prev][market as 'SH' | 'SZ'];
    
    // 将选中的多个证券组合并为一个 scope，共用一个阈值条件
    const combinedId = selectedNewScopes.join(',');
    const combinedName = selectedNewScopes.map(val => {
      const option = dynamicDimensionGroups.find(g => g.value === val);
      return option?.label || val;
    }).join('、');

    if (currentScopes.some(s => s.id === combinedId)) {
      message.warning('所选证券范围组合已存在');
      return prev;
    }

    return {
      ...prev,
      [ruleKey]: {
        ...prev[ruleKey as keyof typeof prev],
        [market]: [
          ...currentScopes,
          { id: combinedId, name: combinedName }
        ]
      }
    };
  });
}
setIsAddScopeModalVisible(false);
setSelectedNewScopes([]);
};

const handleRemoveScope = (ruleKey: string, market: string, scopeId: string) => {
setScopes(prev => {
  const list = prev[ruleKey as keyof typeof prev][market as 'SH' | 'SZ'];
  if (list.length <= 1) {
    message.warning('至少需要保留一个证券范围');
    return prev;
  }
  return {
    ...prev,
    [ruleKey]: {
      ...prev[ruleKey as keyof typeof prev],
      [market]: list.filter(item => item.id !== scopeId)
    }
  };
});
};

const renderScopes = (ruleKey: string, market: string, renderContent: (market: string, scope: string) => React.ReactNode) => {
const marketScopes = scopes[ruleKey as keyof typeof scopes][market as 'SH' | 'SZ'];

return (
  <div className="p-4 bg-white">
    <div className="flex justify-end mb-3">
      <Button 
        type="dashed" 
        icon={<PlusOutlined />} 
        onClick={() => {
          setAddScopeContext({ ruleKey, market });
          setSelectedNewScopes([]);
          setIsAddScopeModalVisible(true);
        }}
      >
        添加证券范围
      </Button>
    </div>
    <Collapse 
      defaultActiveKey={marketScopes.map(s => s.id)} 
      className="bg-white border border-gray-200 rounded-lg" 
      expandIconPosition="end"
    >
      {marketScopes.map(scope => (
        <Panel 
          header={
            <div className="flex justify-between items-center w-full pr-4">
              <span className="font-bold text-gray-800">{scope.name}</span>
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveScope(ruleKey, market, scope.id);
                }}
                disabled={marketScopes.length <= 1}
              />
            </div>
          } 
          key={scope.id} 
          className="border-b border-gray-200"
        >
          {renderContent(market, scope.id)}
        </Panel>
      ))}
    </Collapse>
  </div>
);
};

// 渲染内联样式的阈值配置内容 (拉抬打压)
const renderThresholdContent = (market: string, scope: string) => {
const prefix = ['thresholds', market, scope];
return (
  <div className="py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100">
    {/* 条件一 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(一) 连续竞价阶段任意3分钟内，成交数量在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'volume_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'volume_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'volume_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">万股 以上或成交金额在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'amount_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'amount_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'amount_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">万元 以上</span>
    </div>

    {/* 条件二 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(二) 成交数量占成交期间市场成交总量的比例在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'ratio_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'ratio_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'ratio_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">% 以上</span>
    </div>

    {/* 条件三 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(三) 价格涨（跌）幅</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'price_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'price_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'price_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">% 以上</span>
    </div>
  </div>
);
};

// 渲染内联样式的阈值配置内容 (开盘集合竞价虚假申报)
const renderFalseDeclarationThresholdContent = (market: string, scope: string) => {
const prefix = ['false_declaration_thresholds', market, scope];
return (
  <div className="py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100">
    {/* 条件一 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(一) 以偏离前收盘价</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'price_deviation_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'price_deviation_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'price_deviation_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">% 以上的价格申报买入或卖出</span>
    </div>

    {/* 条件二 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(二) 累计申报数量在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'declare_volume_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'declare_volume_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'declare_volume_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">万股 以上或申报金额在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'declare_amount_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'declare_amount_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'declare_amount_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">万元 以上</span>
    </div>

    {/* 条件三 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(三) 累计申报数量占市场同方向申报总量的比例在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'market_declare_ratio_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'market_declare_ratio_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'market_declare_ratio_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">% 以上</span>
    </div>

    {/* 条件四 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(四) 累计撤销申报数量占累计申报数量的比例在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'cancel_ratio_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'cancel_ratio_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'cancel_ratio_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">% 以上</span>
    </div>

    {/* 条件五 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(五) 以低于申报买入价格反向申报卖出 或者 以高于申报卖出价格反向申报买入的次数在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'reverse_declare_count_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'reverse_declare_count_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'reverse_declare_count_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">次 以上</span>
    </div>
  </div>
);
};

// 渲染内联样式的阈值配置内容 (连续竞价阶段虚假申报)
const renderContinuousFalseDeclarationThresholdContent = (market: string, scope: string) => {
const prefix = ['continuous_false_declaration_thresholds', market, scope];
return (
  <div className="py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100">
    {/* 条件一 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(一) 最优5档内申报买入或卖出</span>
    </div>

    {/* 条件二 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(二) 单笔申报后，实时最优5档内累计剩余有效申报数量在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'volume_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'volume_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'volume_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">万股 以上或者金额在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'amount_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'amount_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'amount_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">万元 以上，且占市场同方向最优5档剩余有效申报总量的比例在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'ratio_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'ratio_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'ratio_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">% 以上</span>
    </div>

    {/* 条件三 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(三) 满足上述情形的申报发生</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'count_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'count_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'count_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">次 以上</span>
    </div>

    {/* 条件四 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(四) 累计撤销申报数量占累计申报数量的比例在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'cancel_ratio_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'cancel_ratio_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'cancel_ratio_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">% 以上</span>
    </div>

    {/* 条件五 */}
    <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
      <span className="font-medium">(五) 存在反向卖出（买入）的成交次数 在</span>
      <Space.Compact>
        <Form.Item name={[...prefix, 'reverse_trade_count_t1']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="一级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'reverse_trade_count_t2']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="二级" className="w-20 text-center" controls={false} />
        </Form.Item>
        <Form.Item name={[...prefix, 'reverse_trade_count_t3']} noStyle rules={[{ required: true }]}>
          <InputNumber placeholder="三级" className="w-20 text-center" controls={false} />
        </Form.Item>
      </Space.Compact>
      <span className="font-medium">次 以上</span>
    </div>
  </div>
);
};

return (
<div className="h-full flex flex-col absolute inset-0 bg-gray-50">
  {/* 顶部导航 */}
  <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 shadow-sm z-10">
    <div className="flex items-center gap-4">
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack} className="text-gray-500 hover:text-[#1890ff]" />
      <Title level={4} style={{ margin: 0, color: '#333' }}>编辑指标 (模板生成)</Title>
    </div>
    <Space>
      <Button onClick={handleBack}>取消</Button>
      <Button icon={<SaveOutlined />} onClick={() => handleSave(false)} loading={loading}>保存修改</Button>
      <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" icon={<CheckCircleOutlined />} onClick={() => handleSave(true)} loading={loading}>提交审核</Button>
    </Space>
  </div>

  {/* 主体内容区 */}
  <div className="flex-1 overflow-y-auto p-6">
    <div className="w-full">
      <Form 
        form={form} 
        layout="vertical" 
      >
        <Collapse 
          defaultActiveKey={['basic', 'rule']} 
          className="bg-transparent border-none flex flex-col gap-4" 
          expandIconPosition="end"
        >
          
          {/* 基本信息区域 */}
          <Panel 
            header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">基本信息</span>} 
            key="basic" 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
              <Form.Item 
                name="ruleName" 
                label="指标组名称" 
                rules={[{ required: true, message: '请输入指标组名称' }]}
              >
                <Input placeholder="请输入指标组名称，如：UST-A-TYFXRZGB" />
              </Form.Item>
              
              <Form.Item 
                name="status" 
                label="启用状态" 
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="停用" />
              </Form.Item>

              <Form.Item 
                name="description" 
                label="备注说明" 
                className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4"
              >
                <TextArea rows={2} placeholder="请输入该指标组的详细说明（选填）" />
              </Form.Item>
            </div>
          </Panel>

          {/* 规则配置区域 */}
          <Panel 
            header={<span className="text-base font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">选择风控规则</span>} 
            key="rule" 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="flex h-[700px] -mx-4 -mb-4">
              {/* 左侧：规则树 */}
              <div className="w-[320px] border-r border-gray-200 p-4 overflow-y-auto bg-gray-50/50 shrink-0">
                <div className="mb-4 text-sm text-gray-500 flex items-center gap-2">
                  <InfoCircleOutlined className="text-[#1890ff]" />
                  请勾选需要配置的规则，并点击节点进行详细设置
                </div>
                <Tree
                  checkable
                  showLine
                  defaultExpandAll
                  selectedKeys={selectedKeys}
                  checkedKeys={checkedKeys}
                  onSelect={onSelect}
                  onCheck={onCheck}
                  treeData={treeData}
                  className="bg-transparent custom-tree"
                />
              </div>

              {/* 右侧：配置参数区 */}
              <div className="flex-1 p-6 overflow-y-auto bg-white">
                {selectedKeys.includes('continuous_bidding') ? (
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-1 h-4 bg-[#1890ff] rounded"></div>
                      <span className="text-lg font-bold text-gray-800">连续竞价阶段拉抬打压控制 - 参数配置</span>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm font-medium text-gray-700 mb-3">交易市场选择</div>
                      <Checkbox.Group 
                        options={[
                          { label: '上海证券交易所 (SH)', value: 'SH' },
                          { label: '深圳证券交易所 (SZ)', value: 'SZ' }
                        ]} 
                        value={selectedMarkets}
                        onChange={(list) => handleMarketChange(list as string[])}
                        className="flex gap-6"
                      />
                    </div>

                    {selectedMarkets.length === 0 ? (
                      <div className="text-gray-400 text-center py-8 bg-gray-50 rounded border border-dashed border-gray-200">
                        请至少选择一个交易市场以配置阈值
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                        <Tabs 
                          activeKey={activeMarketTab}
                          onChange={setActiveMarketTab}
                          className="market-tabs"
                          tabBarStyle={{ marginBottom: 0, padding: '0 16px', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
                          items={[
                            ...(selectedMarkets.includes('SH') ? [{
                              key: 'SH',
                              label: <span className="font-medium text-[#1890ff] px-2">上海证券交易所 (SH)</span>,
                              children: renderScopes('continuous_bidding', 'SH', renderThresholdContent)
                            }] : []),
                            ...(selectedMarkets.includes('SZ') ? [{
                              key: 'SZ',
                              label: <span className="font-medium text-[#1890ff] px-2">深圳证券交易所 (SZ)</span>,
                              children: renderScopes('continuous_bidding', 'SZ', renderThresholdContent)
                            }] : [])
                          ]}
                        />
                      </div>
                    )}
                  </div>
                ) : selectedKeys.includes('open_call_auction_false_declaration') ? (
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-1 h-4 bg-[#1890ff] rounded"></div>
                      <span className="text-lg font-bold text-gray-800">开盘集合竞价阶段虚假申报 - 参数配置</span>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm font-medium text-gray-700 mb-3">交易市场选择</div>
                      <Checkbox.Group 
                        options={[
                          { label: '上海证券交易所 (SH)', value: 'SH' },
                          { label: '深圳证券交易所 (SZ)', value: 'SZ' }
                        ]} 
                        value={selectedMarkets}
                        onChange={(list) => handleMarketChange(list as string[])}
                        className="flex gap-6"
                      />
                    </div>

                    {selectedMarkets.length === 0 ? (
                      <div className="text-gray-400 text-center py-8 bg-gray-50 rounded border border-dashed border-gray-200">
                        请至少选择一个交易市场以配置阈值
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                        <Tabs 
                          activeKey={activeMarketTab}
                          onChange={setActiveMarketTab}
                          className="market-tabs"
                          tabBarStyle={{ marginBottom: 0, padding: '0 16px', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
                          items={[
                            ...(selectedMarkets.includes('SH') ? [{
                              key: 'SH',
                              label: <span className="font-medium text-[#1890ff] px-2">上海证券交易所 (SH)</span>,
                              children: renderScopes('open_call_auction_false_declaration', 'SH', renderFalseDeclarationThresholdContent)
                            }] : []),
                            ...(selectedMarkets.includes('SZ') ? [{
                              key: 'SZ',
                              label: <span className="font-medium text-[#1890ff] px-2">深圳证券交易所 (SZ)</span>,
                              children: renderScopes('open_call_auction_false_declaration', 'SZ', renderFalseDeclarationThresholdContent)
                            }] : [])
                          ]}
                        />
                      </div>
                    )}
                  </div>
                ) : selectedKeys.includes('continuous_false_declaration') ? (
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-1 h-4 bg-[#1890ff] rounded"></div>
                      <span className="text-lg font-bold text-gray-800">连续竞价阶段虚假申报控制 - 参数配置</span>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm font-medium text-gray-700 mb-3">交易市场选择</div>
                      <Checkbox.Group 
                        options={[
                          { label: '上海证券交易所 (SH)', value: 'SH' },
                          { label: '深圳证券交易所 (SZ)', value: 'SZ' }
                        ]} 
                        value={selectedMarkets}
                        onChange={(list) => handleMarketChange(list as string[])}
                        className="flex gap-6"
                      />
                    </div>

                    {selectedMarkets.length === 0 ? (
                      <div className="text-gray-400 text-center py-8 bg-gray-50 rounded border border-dashed border-gray-200">
                        请至少选择一个交易市场以配置阈值
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                        <Tabs 
                          activeKey={activeMarketTab}
                          onChange={setActiveMarketTab}
                          className="market-tabs"
                          tabBarStyle={{ marginBottom: 0, padding: '0 16px', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
                          items={[
                            ...(selectedMarkets.includes('SH') ? [{
                              key: 'SH',
                              label: <span className="font-medium text-[#1890ff] px-2">上海证券交易所 (SH)</span>,
                              children: renderScopes('continuous_false_declaration', 'SH', renderContinuousFalseDeclarationThresholdContent)
                            }] : []),
                            ...(selectedMarkets.includes('SZ') ? [{
                              key: 'SZ',
                              label: <span className="font-medium text-[#1890ff] px-2">深圳证券交易所 (SZ)</span>,
                              children: renderScopes('continuous_false_declaration', 'SZ', renderContinuousFalseDeclarationThresholdContent)
                            }] : [])
                          ]}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 opacity-20">
                      <path d="M8 10.5V40C8 41.1046 8.89543 42 10 42H38C39.1046 42 40 41.1046 40 40V10.5M8 10.5L14.5 4H33.5L40 10.5M8 10.5H40" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 22H29" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 30H29" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-lg">请在左侧规则树中点击具体的规则节点进行配置</p>
                    <p className="text-sm mt-2">当前支持配置：拉抬打压、虚假申报等</p>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </Collapse>
      </Form>
    </div>
  </div>

  <Modal
    title="添加证券范围"
    open={isAddScopeModalVisible}
    onOk={handleAddScopeOk}
    onCancel={() => {
      setIsAddScopeModalVisible(false);
      setSelectedNewScopes([]);
    }}
    okText="确定"
    cancelText="取消"
  >
    <div className="py-4">
      <div className="mb-2">选择动态维度组（证券组）：</div>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="请选择证券范围"
        value={selectedNewScopes}
        onChange={setSelectedNewScopes}
        options={dynamicDimensionGroups}
      />
    </div>
  </Modal>
</div>
);
};
export default RuleEdit;
