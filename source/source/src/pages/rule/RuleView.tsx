import React, { useState, useEffect } from 'react';
import { Button, Typography, Space, Card, Descriptions, Table, Tag, Modal, Select, message, Tabs, Tree, Collapse, Input, Empty } from 'antd';
import { ArrowLeftOutlined, AppstoreFilled, IdcardOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

interface RuleViewProps {
  embedded?: boolean;
  onClose?: () => void;
}

const { Title } = Typography;
const { Panel } = Collapse;

interface AccountGroup {
id: string;
name: string;
accountType: string;
controlType: string;
groupType: 'static' | 'dynamic';
filterConditions?: any;
}

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

// 模拟的规则配置数据
const ruleData = {
SH: {
riskWarning: { volume_t1: 10, volume_t2: 20, volume_t3: 30, amount_t1: 100, amount_t2: 200, amount_t3: 300, ratio_t1: 5, ratio_t2: 10, ratio_t3: 15, price_t1: 2, price_t2: 4, price_t3: 6 },
sz50: { volume_t1: 15, volume_t2: 25, volume_t3: 35, amount_t1: 150, amount_t2: 250, amount_t3: 350, ratio_t1: 6, ratio_t2: 12, ratio_t3: 18, price_t1: 3, price_t2: 5, price_t3: 7 },
other: { volume_t1: 20, volume_t2: 30, volume_t3: 40, amount_t1: 200, amount_t2: 300, amount_t3: 400, ratio_t1: 7, ratio_t2: 14, ratio_t3: 21, price_t1: 4, price_t2: 6, price_t3: 8 }
},
SZ: {
riskWarning: { volume_t1: 10, volume_t2: 20, volume_t3: 30, amount_t1: 100, amount_t2: 200, amount_t3: 300, ratio_t1: 5, ratio_t2: 10, ratio_t3: 15, price_t1: 2, price_t2: 4, price_t3: 6 },
other: { volume_t1: 20, volume_t2: 30, volume_t3: 40, amount_t1: 200, amount_t2: 300, amount_t3: 400, ratio_t1: 7, ratio_t2: 14, ratio_t3: 21, price_t1: 4, price_t2: 6, price_t3: 8 }
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
};

// 动态筛选条件辅助函数
const getFieldOptions = () => {
return [
{ value: 'system', label: '交易系统' },
{ value: 'shareholderAccount', label: '股东账户' },
{ value: 'productAccount', label: '产品账户' },
{ value: 'assetAccount', label: '资产账户' },
{ value: 'portfolioAccount', label: '组合账户' }
];
};

const getEnumOptions = (field: string, selectedSystems: string[]) => {
if (field === 'system') return [
{ value: 'O32', label: 'O32' },
{ value: 'O45', label: 'O45' },
{ value: '机构O32', label: '机构O32' },
{ value: '集中柜台', label: '集中柜台' },
{ value: '根网', label: '根网' },
{ value: 'GTP', label: 'GTP' },
];

const allOption = { value: 'ALL', label: '全部' };
const options: {value: string, label: string}[] = [allOption];

const systemsToUse = selectedSystems.length > 0 ? selectedSystems : ['ALL'];

systemsToUse.forEach(sys => {
const prefix = sys === 'ALL' ? 'ALL_' : `${sys}_`;
const labelPrefix = sys === 'ALL' ? '通用 ' : `${sys} `;

switch(field) {
case 'productAccount': 
options.push(
  { value: `${prefix}PA001`, label: `${labelPrefix}产品账户A` },
  { value: `${prefix}PA002`, label: `${labelPrefix}产品账户B` },
  { value: `${prefix}PA003`, label: `${labelPrefix}产品账户C` },
);
break;
case 'assetAccount':
options.push(
  { value: `${prefix}AA001`, label: `${labelPrefix}资产账户X` },
  { value: `${prefix}AA002`, label: `${labelPrefix}资产账户Y` },
  { value: `${prefix}AA003`, label: `${labelPrefix}资产账户Z` },
);
break;
case 'shareholderAccount':
options.push(
  { value: `${prefix}SA001`, label: `${labelPrefix}股东账户1` },
  { value: `${prefix}SA002`, label: `${labelPrefix}股东账户2` },
  { value: `${prefix}SA003`, label: `${labelPrefix}股东账户3` },
);
break;
case 'portfolioAccount':
options.push(
  { value: `${prefix}POA001`, label: `${labelPrefix}组合账户1` },
  { value: `${prefix}POA002`, label: `${labelPrefix}组合账户2` },
  { value: `${prefix}POA003`, label: `${labelPrefix}组合账户3` },
);
break;
}
});

return options;
};

const getSelectedSystems = (group: any): Set<string> => {
let systems = new Set<string>();
if (!group || !group.children) return systems;
group.children.forEach((child: any) => {
if (child.type === 'rule') {
if (child.field === 'system' && child.values) {
child.values.forEach((v: string) => systems.add(v));
}
} else {
const childSystems = getSelectedSystems(child);
childSystems.forEach(v => systems.add(v));
}
});
return systems;
};

// 渲染卡片式的系统条件
const renderSystemCards = (group: any, viewSelectedSystems: string[]) => {
if (!group || !group.children || group.children.length === 0) {
return <Empty description="暂无筛选条件" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
}

const systems = new Set<string>();
const rules: any[] = [];

const traverse = (node: any) => {
if (node.type === 'rule') {
if (node.field === 'system') {
if (node.values) {
  node.values.forEach((v: string) => systems.add(v));
}
} else {
rules.push(node);
}
} else {
if (node.children) {
node.children.forEach(traverse);
}
}
};

traverse(group);

const systemList = Array.from(systems);

if (systemList.length === 0) {
return (
<div className="p-6 text-center">
<Empty description="未选择任何交易系统" image={Empty.PRESENTED_IMAGE_SIMPLE} />
</div>
);
}

const result: Record<string, any[]> = {};
systemList.forEach(sys => {
result[sys] = [];
});

rules.forEach(rule => {
if (!rule.values || rule.values.length === 0) return;

const sysValues: Record<string, string[]> = {};
rule.values.forEach((v: string) => {
const parts = v.split('_');
const sys = parts[0];
if (sys === 'ALL') {
systemList.forEach(s => {
  if (!sysValues[s]) sysValues[s] = [];
  sysValues[s].push(v);
});
} else {
if (!sysValues[sys]) sysValues[sys] = [];
sysValues[sys].push(v);
}
});

Object.keys(sysValues).forEach(sys => {
if (systems.has(sys)) {
result[sys].push({
  ...rule,
  values: sysValues[sys]
});
}
});
});

const currentFieldOptions = getFieldOptions();

return (
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
{systemList.map(sys => {
const sysRules = result[sys] || [];
return (
  <div key={sys} className="bg-white border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
    <div className="bg-gradient-to-r from-blue-50 to-white px-5 py-4 border-b border-blue-100 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
        <AppstoreFilled className="text-blue-600 text-lg" />
      </div>
      <span className="font-bold text-blue-900 text-lg truncate" title={sys}>{sys}</span>
    </div>
    <div className="p-5 flex-1 flex flex-col gap-4 bg-white">
      {sysRules.length > 0 ? (
        sysRules.map((rule, idx) => {
          const fieldLabel = currentFieldOptions.find(o => o.value === rule.field)?.label || rule.field;
          return (
            <div key={idx} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <IdcardOutlined className="text-gray-400" />
                <span className="text-gray-700 font-medium text-sm">{fieldLabel}</span>
                <Tag color={rule.operator === 'in' ? 'blue' : 'red'} className="m-0 border-none px-2 py-0.5 leading-tight text-xs font-medium">
                  {rule.operator === 'in' ? '包含' : '不包含'}
                </Tag>
              </div>
              <div className="flex flex-wrap gap-2 pl-6">
                {rule.values.map((v: string) => {
                  const options = getEnumOptions(rule.field, viewSelectedSystems);
                  const label = options.find(o => o.value === v)?.label || v;
                  return (
                    <Tag key={v} className="m-0 bg-gray-50 border-gray-200 text-gray-600 text-xs px-2 py-1">
                      {label}
                    </Tag>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-6 text-gray-400">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
            <IdcardOutlined className="text-xl opacity-50" />
          </div>
          <span className="text-sm">包含该系统所有账户</span>
        </div>
      )}
    </div>
  </div>
);
})}
</div>
);
};

export const RuleView: React.FC<RuleViewProps> = ({ embedded = false, onClose }) => {
const navigate = useNavigate();
const { id } = useParams();
const [loading, setLoading] = useState(true);

const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['continuous_bidding']);
const [activeMarketTab, setActiveMarketTab] = useState<string>('SH');

// 模拟所有可用的账户组
const allGroups: AccountGroup[] = [
{ id: '191', name: '33333', accountType: '证券账户', controlType: '联合控制', groupType: 'static' },
{ 
id: '192', name: '自营A股账户组', accountType: '证券账户', controlType: '单独控制', groupType: 'dynamic',
filterConditions: {
conditionTree: {
  id: 'root',
  type: 'group',
  logicalOperator: 'AND',
  children: [
    { id: 'r1', type: 'rule', field: 'system', operator: 'in', values: ['O32', 'O45', '集中柜台'] },
    {
      id: 'g1',
      type: 'group',
      logicalOperator: 'OR',
      children: [
        { id: 'r2', type: 'rule', field: 'productAccount', operator: 'in', values: ['O32_PA001', 'O45_PA002'] },
        { id: 'r3', type: 'rule', field: 'assetAccount', operator: 'not_in', values: ['O32_AA002'] }
      ]
    }
  ]
}
}
},
{ id: '193', name: '量化高频账户组', accountType: '投资组合', controlType: '联合控制', groupType: 'static' },
{ 
id: '194', name: '做市商账户组', accountType: '证券账户', controlType: '单独控制', groupType: 'dynamic',
filterConditions: {
conditionTree: {
  id: 'root',
  type: 'group',
  logicalOperator: 'AND',
  children: [
    { id: 'r1', type: 'rule', field: 'system', operator: 'in', values: ['O45', '集中柜台'] },
    { id: 'r2', type: 'rule', field: 'shareholderAccount', operator: 'in', values: ['ALL_SA001'] }
  ]
}
}
},
{ id: '195', name: 'QFII测试账户组', accountType: '投资组合', controlType: '联合控制', groupType: 'static' },
];

// 绑定的账户组数据
const [boundGroups, setBoundGroups] = useState<AccountGroup[]>([
allGroups[0],
allGroups[1]
]);

const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
const [isModalVisible, setIsModalVisible] = useState(false);
const [selectedNewGroups, setSelectedNewGroups] = useState<string[]>([]);

// 动态筛选条件明细弹窗状态
const [detailModalVisible, setDetailModalVisible] = useState(false);
const [currentDetailGroup, setCurrentDetailGroup] = useState<AccountGroup | null>(null);

useEffect(() => {
setTimeout(() => {
setLoading(false);
}, 500);
}, [id]);

const handleBack = () => {
  // If in embedded mode, call onClose; otherwise navigate
  if (embedded && onClose) {
    onClose();
  } else {
    navigate('/rule/ruleSetting');
  }
};

const handleUnbindBatch = () => {
if (selectedRowKeys.length === 0) {
message.warning('请先选择要解除绑定的账户组');
return;
}
setBoundGroups(prev => prev.filter(g => !selectedRowKeys.includes(g.id)));
setSelectedRowKeys([]);
message.success('批量解除绑定成功');
};

const handleBind = () => {
if (selectedNewGroups.length === 0) {
message.warning('请选择要绑定的账户组');
return;
}

const newGroups = selectedNewGroups.map(gid => {
const group = allGroups.find(g => g.id === gid)!;
return {
id: group.id,
name: group.name,
accountType: group.accountType,
controlType: group.controlType,
groupType: group.groupType,
filterConditions: group.filterConditions
};
});

setBoundGroups(prev => [...prev, ...newGroups]);
setIsModalVisible(false);
setSelectedNewGroups([]);
message.success('绑定成功');
};

const handleViewDetail = (record: AccountGroup) => {
if (record.groupType === 'dynamic') {
setCurrentDetailGroup(record);
setDetailModalVisible(true);
} else {
message.info('静态账户组，暂无动态筛选条件');
}
};

const columns: ColumnsType<AccountGroup> = [
{ title: '账户组ID', dataIndex: 'id', key: 'id', align: 'center' },
{ title: '账户组名称', dataIndex: 'name', key: 'name', align: 'center' },
{
title: '更新模式',
dataIndex: 'groupType',
key: 'groupType',
align: 'center',
render: (text) => (
<Tag color={text === 'static' ? 'blue' : 'green'} className="m-0">
  {text === 'static' ? '静态账户组' : '动态账户组'}
</Tag>
)
},
{ 
title: '账户类型', 
dataIndex: 'accountType', 
key: 'accountType',
align: 'center',
render: (text) => (
<span className="inline-block px-3 py-1 rounded text-[#1890ff] bg-[#e6f7ff] border border-[#91d5ff] text-sm">
  {text}
</span>
)
},
{
title: '操作',
key: 'action',
align: 'center',
render: (_, record) => (
<Space size="middle">
  <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => handleViewDetail(record)}>查看明细</a>
  <a className="text-[#1890ff] hover:text-[#096dd9]">编辑账户组</a>
</Space>
),
},
];

// 过滤出还未绑定的账户组供选择
const availableGroups = allGroups.filter(g => !boundGroups.some(bg => bg.id === g.id));

// 渲染只读的阈值配置内容 (拉抬打压) - 显示三级阈值
const renderThresholdContent = (market: string, scope: string) => {
  const marketData = ruleData[market as keyof typeof ruleData] as any;
  if (!marketData) return null;
  const data = marketData[scope];
  if (!data) return null;

  return (
    <div className="py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100">
      {/* 条件一 */}
      <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
        <span className="font-medium">(一) 连续竞价阶段任意3分钟内，成交数量在</span>
        <Space.Compact>
          <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.volume_t1}</span>
          <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.volume_t2}</span>
          <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.volume_t3}</span>
        </Space.Compact>
        <span className="font-medium">万股 以上或成交金额在</span>
        <Space.Compact>
          <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.amount_t1}</span>
          <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.amount_t2}</span>
          <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.amount_t3}</span>
        </Space.Compact>
        <span className="font-medium">万元 以上</span>
      </div>

      {/* 条件二 */}
      <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
        <span className="font-medium">(二) 成交数量占成交期间市场成交总量的比例在</span>
        <Space.Compact>
          <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.ratio_t1}</span>
          <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.ratio_t2}</span>
          <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.ratio_t3}</span>
        </Space.Compact>
        <span className="font-medium">% 以上</span>
      </div>

      {/* 条件三 */}
      <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
        <span className="font-medium">(三) 价格涨（跌）幅</span>
        <Space.Compact>
          <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.price_t1}</span>
          <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.price_t2}</span>
          <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.price_t3}</span>
        </Space.Compact>
        <span className="font-medium">% 以上</span>
      </div>
    </div>
  );
};

// 渲染只读的阈值配置内容 (开盘集合竞价虚假申报) - 显示三级阈值
const renderFalseDeclarationThresholdContent = (market: string, scope: string) => {
const data = ruleData.false_declaration_thresholds[market as keyof typeof ruleData.false_declaration_thresholds]?.[scope as keyof typeof ruleData.false_declaration_thresholds['SH']];
if (!data) return null;

return (
<div className="py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100">
{/* 条件一 */}
<div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
  <span className="font-medium">(一) 以偏离前收盘价</span>
  <div className="flex items-center gap-1">
    <div className="px-3 py-1 bg-white border border-gray-200 rounded text-center min-w-[140px] text-[#1890ff] font-medium">
      一级:{data.price_deviation_t1}/二级:{data.price_deviation_t2}/三级:{data.price_deviation_t3}%
    </div>
  </div>
  <span className="font-medium">以上的价格申报买入或卖出</span>
</div>

{/* 条件二 */}
<div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
  <span className="font-medium">(二) 累计申报数量在</span>
  <div className="flex items-center gap-1">
    <div className="px-3 py-1 bg-white border border-gray-200 rounded text-center min-w-[140px] text-[#1890ff] font-medium">
      一级:{data.declare_volume_t1}/二级:{data.declare_volume_t2}/三级:{data.declare_volume_t3}
    </div>
    <span className="font-medium">万股</span>
  </div>
  <span className="font-medium">以上或申报金额在</span>
  <div className="flex items-center gap-1">
    <div className="px-3 py-1 bg-white border border-gray-200 rounded text-center min-w-[140px] text-[#1890ff] font-medium">
      一级:{data.declare_amount_t1}/二级:{data.declare_amount_t2}/三级:{data.declare_amount_t3}
    </div>
    <span className="font-medium">万元</span>
  </div>
  <span className="font-medium">以上</span>
</div>

{/* 条件三 */}
<div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
  <span className="font-medium">(三) 累计申报数量占市场同方向申报总量的比例在</span>
  <div className="flex items-center gap-1">
    <div className="px-3 py-1 bg-white border border-gray-200 rounded text-center min-w-[140px] text-[#1890ff] font-medium">
      一级:{data.market_declare_ratio_t1}/二级:{data.market_declare_ratio_t2}/三级:{data.market_declare_ratio_t3}%
    </div>
  </div>
  <span className="font-medium">以上</span>
</div>

{/* 条件四 */}
<div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
  <span className="font-medium">(四) 累计撤销申报数量占累计申报数量的比例在</span>
  <div className="flex items-center gap-1">
    <div className="px-3 py-1 bg-white border border-gray-200 rounded text-center min-w-[140px] text-[#1890ff] font-medium">
      一级:{data.cancel_ratio_t1}/二级:{data.cancel_ratio_t2}/三级:{data.cancel_ratio_t3}
    </div>
    <span className="font-medium">%</span>
  </div>
  <span className="font-medium">以上</span>
</div>

{/* 条件五 */}
<div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
  <span className="font-medium">(五) 以低于申报买入价格反向申报卖出 或者 以高于申报卖出价格反向申报买入的次数在</span>
  <div className="flex items-center gap-1">
    <div className="px-3 py-1 bg-white border border-gray-200 rounded text-center min-w-[140px] text-[#1890ff] font-medium">
      一级:{data.reverse_declare_count_t1}/二级:{data.reverse_declare_count_t2}/三级:{data.reverse_declare_count_t3}
    </div>
    <span className="font-medium">次</span>
  </div>
  <span className="font-medium">以上</span>
</div>
</div>
);
};

// 渲染只读的阈值配置内容 (连续竞价阶段虚假申报) - 显示三级阈值
const renderContinuousFalseDeclarationThresholdContent = (market: string, scope: string) => {
const data = ruleData.continuous_false_declaration_thresholds?.[market as keyof typeof ruleData.continuous_false_declaration_thresholds]?.[scope as keyof typeof ruleData.continuous_false_declaration_thresholds['SH']];
if (!data) return null;

return (
<div className="py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100">
{/* 条件一 */}
<div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
  <span className="font-medium">(一) 最优5档内申报买入或卖出</span>
</div>

{/* 条件二 */}
<div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
  <span className="font-medium">(二) 单笔申报后，实时最优5档内累计剩余有效申报数量在</span>
  <div className="flex items-center gap-1">
    <div className="px-3 py-1 bg-white border border-gray-200 rounded text-center min-w-[140px] text-[#1890ff] font-medium">
      一级:{data.volume_t1}/二级:{data.volume_t2}/三级:{data.volume_t3}
    </div>
    <span className="font-medium">万股</span>
  </div>
  <span className="font-medium">以上或者金额在</span>
  <div className="flex items-center gap-1">
    <div className="px-3 py-1 bg-white border border-gray-200 rounded text-center min-w-[140px] text-[#1890ff] font-medium">
      一级:{data.amount_t1}/二级:{data.amount_t2}/三级:{data.amount_t3}
    </div>
    <span className="font-medium">万元</span>
  </div>
  <span className="font-medium">以上，且占市场同方向最优5档剩余有效申报总量的比例在</span>
  <div className="flex items-center gap-1">
    <div className="px-3 py-1 bg-white border border-gray-200 rounded text-center min-w-[140px] text-[#1890ff] font-medium">
      一级:{data.ratio_t1}/二级:{data.ratio_t2}/三级:{data.ratio_t3}
    </div>
    <span className="font-medium">%</span>
  </div>
  <span className="font-medium">以上</span>
</div>

{/* 条件三 */}
<div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
  <span className="font-medium">(三) 满足上述情形的申报发生</span>
  <div className="flex items-center gap-1">
    <div className="px-3 py-1 bg-white border border-gray-200 rounded text-center min-w-[140px] text-[#1890ff] font-medium">
      一级:{data.count_t1}/二级:{data.count_t2}/三级:{data.count_t3}
    </div>
    <span className="font-medium">次</span>
  </div>
  <span className="font-medium">以上</span>
</div>

{/* 条件四 */}
<div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
  <span className="font-medium">(四) 累计撤销申报数量占累计申报数量的比例在</span>
  <div className="flex items-center gap-1">
    <div className="px-3 py-1 bg-white border border-gray-200 rounded text-center min-w-[140px] text-[#1890ff] font-medium">
      一级:{data.cancel_ratio_t1}/二级:{data.cancel_ratio_t2}/三级:{data.cancel_ratio_t3}
    </div>
    <span className="font-medium">%</span>
  </div>
  <span className="font-medium">以上</span>
</div>

{/* 条件五 */}
<div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
  <span className="font-medium">(五) 存在反向卖出（买入）的成交次数 在</span>
  <div className="flex items-center gap-1">
    <div className="px-3 py-1 bg-white border border-gray-200 rounded text-center min-w-[140px] text-[#1890ff] font-medium">
      一级:{data.reverse_trade_count_t1}/二级:{data.reverse_trade_count_t2}/三级:{data.reverse_trade_count_t3}
    </div>
    <span className="font-medium">次</span>
  </div>
  <span className="font-medium">以上</span>
</div>
</div>
);
};

if (loading) {
return <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">加载中...</div>;
}

return (
<div className="h-full flex flex-col absolute inset-0 bg-gray-50">
<style>
{`
  .view-tabs-container .ant-tabs-content-holder {
    flex: 1;
    overflow: hidden;
  }
  .view-tabs-container .ant-tabs-content {
    height: 100%;
  }
  .view-tabs-container .ant-tabs-tabpane {
    height: 100%;
    outline: none;
  }
`}
</style>

{/* 顶部导航 */}
<div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 shadow-sm z-10">
<div className="flex items-center gap-4">
  <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack} className="text-gray-500 hover:text-[#1890ff]" />
  <Title level={4} style={{ margin: 0, color: '#333' }}>查看指标组详情</Title>
</div>
<Space>
  <Button onClick={handleBack}>返回</Button>
  <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={() => navigate(`/rule-edit/${id}`)}>编辑指标</Button>
</Space>
</div>

{/* 主体内容区 */}
<div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

{/* 基本信息 */}
<Card
  title={<span className="font-bold text-gray-800 border-l-4 border-[#1890ff] pl-2">基本信息</span>}
  bordered={false}
  className="shadow-sm rounded-lg shrink-0"
  bodyStyle={{ padding: '24px' }}
>
  <Descriptions
    column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
    labelStyle={{
      fontWeight: '500',
      color: '#666',
      width: '100px',
      paddingRight: '16px'
    }}
    contentStyle={{
      fontWeight: '600',
      color: '#333',
      fontSize: '15px'
    }}
    size="middle"
  >
    <Descriptions.Item label="指标组编号">50036</Descriptions.Item>
    <Descriptions.Item label="指标组名称">UST-A-TYFXRZGB</Descriptions.Item>
    <Descriptions.Item label="启用状态"><Tag color="success" style={{ fontWeight: '500', padding: '2px 8px' }}>已启用</Tag></Descriptions.Item>
    <Descriptions.Item label="创建人">018566</Descriptions.Item>
    <Descriptions.Item label="创建时间">2026-01-26 17:32:01</Descriptions.Item>
    <Descriptions.Item label="备注说明" span={2}>
      <span style={{ color: '#666', fontSize: '14px' }}>这是一个用于监控异常交易行为的指标组模板。</span>
    </Descriptions.Item>
  </Descriptions>
</Card>

{/* Tabs 区域 */}
<Card bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }} className="shadow-sm rounded-lg flex-1 overflow-hidden min-h-[600px]">
  <Tabs 
    defaultActiveKey="account" 
    className="px-6 pt-4 flex-1 flex flex-col view-tabs-container"
    items={[
      {
        key: 'rule',
        label: <span className="text-base font-medium px-2">规则配置详情</span>,
        children: (
          <div className="flex h-full -mx-6 border-t border-gray-100">
            {/* 左侧：规则树 */}
            <div className="w-[320px] border-r border-gray-200 p-4 overflow-y-auto bg-gray-50/50 shrink-0">
              <Tree
                showLine
                defaultExpandAll
                selectedKeys={selectedKeys}
                onSelect={(keys) => setSelectedKeys(keys)}
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

                  <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                    <Tabs 
                      activeKey={activeMarketTab}
                      onChange={setActiveMarketTab}
                      className="market-tabs"
                      tabBarStyle={{ marginBottom: 0, padding: '0 16px', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
                      items={[
                        {
                          key: 'SH',
                          label: <span className="font-medium text-[#1890ff] px-2">上海证券交易所 (SH)</span>,
                          children: (
                            <div className="p-4 bg-white">
                              <Collapse defaultActiveKey={['riskWarning', 'sz50', 'other']} className="bg-white border border-gray-200 rounded-lg" expandIconPosition="end">
                                <Panel header={<span className="font-bold text-gray-800">风险警示股</span>} key="riskWarning" className="border-b border-gray-200">
                                  {renderThresholdContent('SH', 'riskWarning')}
                                </Panel>
                                <Panel header={<span className="font-bold text-gray-800">上证50成分股</span>} key="sz50" className="border-b border-gray-200">
                                  {renderThresholdContent('SH', 'sz50')}
                                </Panel>
                                <Panel header={<span className="font-bold text-gray-800">非上证50非风险警示股</span>} key="other" className="border-none">
                                  {renderThresholdContent('SH', 'other')}
                                </Panel>
                              </Collapse>
                            </div>
                          )
                        },
                        {
                          key: 'SZ',
                          label: <span className="font-medium text-[#1890ff] px-2">深圳证券交易所 (SZ)</span>,
                          children: (
                            <div className="p-4 bg-white">
                              <Collapse defaultActiveKey={['riskWarning', 'other']} className="bg-white border border-gray-200 rounded-lg" expandIconPosition="end">
                                <Panel header={<span className="font-bold text-gray-800">风险警示股</span>} key="riskWarning" className="border-b border-gray-200">
                                  {renderThresholdContent('SZ', 'riskWarning')}
                                </Panel>
                                <Panel header={<span className="font-bold text-gray-800">非风险警示股</span>} key="other" className="border-none">
                                  {renderThresholdContent('SZ', 'other')}
                                </Panel>
                              </Collapse>
                            </div>
                          )
                        }
                      ]}
                    />
                  </div>
                </div>
              ) : selectedKeys.includes('open_call_auction_false_declaration') ? (
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-1 h-4 bg-[#1890ff] rounded"></div>
                    <span className="text-lg font-bold text-gray-800">开盘集合竞价阶段虚假申报 - 参数配置</span>
                  </div>

                  <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                    <Tabs 
                      activeKey={activeMarketTab}
                      onChange={setActiveMarketTab}
                      className="market-tabs"
                      tabBarStyle={{ marginBottom: 0, padding: '0 16px', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
                      items={[
                        {
                          key: 'SH',
                          label: <span className="font-medium text-[#1890ff] px-2">上海证券交易所 (SH)</span>,
                          children: (
                            <div className="p-4 bg-white">
                              <Collapse defaultActiveKey={['riskWarning', 'other']} className="bg-white border border-gray-200 rounded-lg" expandIconPosition="end">
                                <Panel header={<span className="font-bold text-gray-800">风险警示股</span>} key="riskWarning" className="border-b border-gray-200">
                                  {renderFalseDeclarationThresholdContent('SH', 'riskWarning')}
                                </Panel>
                                <Panel header={<span className="font-bold text-gray-800">非风险警示股</span>} key="other" className="border-none">
                                  {renderFalseDeclarationThresholdContent('SH', 'other')}
                                </Panel>
                              </Collapse>
                            </div>
                          )
                        },
                        {
                          key: 'SZ',
                          label: <span className="font-medium text-[#1890ff] px-2">深圳证券交易所 (SZ)</span>,
                          children: (
                            <div className="p-4 bg-white">
                              <Collapse defaultActiveKey={['riskWarning', 'other']} className="bg-white border border-gray-200 rounded-lg" expandIconPosition="end">
                                <Panel header={<span className="font-bold text-gray-800">风险警示股</span>} key="riskWarning" className="border-b border-gray-200">
                                  {renderFalseDeclarationThresholdContent('SZ', 'riskWarning')}
                                </Panel>
                                <Panel header={<span className="font-bold text-gray-800">非风险警示股</span>} key="other" className="border-none">
                                  {renderFalseDeclarationThresholdContent('SZ', 'other')}
                                </Panel>
                              </Collapse>
                            </div>
                          )
                        }
                      ]}
                    />
                  </div>
                </div>
              ) : selectedKeys.includes('continuous_false_declaration') ? (
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-1 h-4 bg-[#1890ff] rounded"></div>
                    <span className="text-lg font-bold text-gray-800">连续竞价阶段虚假申报控制 - 参数配置</span>
                  </div>

                  <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                    <Tabs 
                      activeKey={activeMarketTab}
                      onChange={setActiveMarketTab}
                      className="market-tabs"
                      tabBarStyle={{ marginBottom: 0, padding: '0 16px', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
                      items={[
                        {
                          key: 'SH',
                          label: <span className="font-medium text-[#1890ff] px-2">上海证券交易所 (SH)</span>,
                          children: (
                            <div className="p-4 bg-white">
                              <Collapse defaultActiveKey={['riskWarning', 'other']} className="bg-white border border-gray-200 rounded-lg" expandIconPosition="end">
                                <Panel header={<span className="font-bold text-gray-800">风险警示股</span>} key="riskWarning" className="border-b border-gray-200">
                                  {renderContinuousFalseDeclarationThresholdContent('SH', 'riskWarning')}
                                </Panel>
                                <Panel header={<span className="font-bold text-gray-800">非风险警示股</span>} key="other" className="border-none">
                                  {renderContinuousFalseDeclarationThresholdContent('SH', 'other')}
                                </Panel>
                              </Collapse>
                            </div>
                          )
                        },
                        {
                          key: 'SZ',
                          label: <span className="font-medium text-[#1890ff] px-2">深圳证券交易所 (SZ)</span>,
                          children: (
                            <div className="p-4 bg-white">
                              <Collapse defaultActiveKey={['riskWarning', 'other']} className="bg-white border border-gray-200 rounded-lg" expandIconPosition="end">
                                <Panel header={<span className="font-bold text-gray-800">风险警示股</span>} key="riskWarning" className="border-b border-gray-200">
                                  {renderContinuousFalseDeclarationThresholdContent('SZ', 'riskWarning')}
                                </Panel>
                                <Panel header={<span className="font-bold text-gray-800">非风险警示股</span>} key="other" className="border-none">
                                  {renderContinuousFalseDeclarationThresholdContent('SZ', 'other')}
                                </Panel>
                              </Collapse>
                            </div>
                          )
                        }
                      ]}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <p className="text-lg">请在左侧规则树中点击具体的规则节点查看配置</p>
                </div>
              )}
            </div>
          </div>
        )
      },
      {
        key: 'account',
        label: <span className="text-base font-medium px-2">关联账户组</span>,
        children: (
          <div className="p-6 border-t border-gray-100 h-full overflow-y-auto bg-white">
            <div className="flex justify-between items-center mb-6">
              <Space size="large">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">账户组类型：</span>
                  <Select placeholder="请选择账户类型" style={{ width: 160 }} allowClear>
                    <Select.Option value="证券账户">证券账户</Select.Option>
                    <Select.Option value="投资组合">投资组合</Select.Option>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">账户组名称：</span>
                  <Input placeholder="请输入账户组名称" style={{ width: 200 }} allowClear />
                </div>
              </Space>
              <Space>
                <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={() => setIsModalVisible(true)}>
                  关联账户组
                </Button>
                <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none">
                  修改控制类型
                </Button>
                <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={handleUnbindBatch}>
                  批量解除绑定
                </Button>
              </Space>
            </div>
            
            <Table 
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              columns={columns} 
              dataSource={boundGroups} 
              rowKey="id" 
              pagination={false}
              size="middle"
              className="custom-table border border-gray-200 rounded-t-md"
            />
          </div>
        )
      }
    ]}
  />
</Card>

</div>

{/* 绑定账户组弹窗 */}
<Modal
title="新增绑定账户组"
open={isModalVisible}
onOk={handleBind}
onCancel={() => {
  setIsModalVisible(false);
  setSelectedNewGroups([]);
}}
okText="确认绑定"
cancelText="取消"
okButtonProps={{ className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none" }}
>
<div className="py-4">
  <div className="mb-2 text-gray-700">请选择要绑定的账户组：</div>
  <Select
    mode="multiple"
    style={{ width: '100%' }}
    placeholder="请选择账户组"
    value={selectedNewGroups}
    onChange={setSelectedNewGroups}
    options={availableGroups.map(g => ({ label: g.name, value: g.id }))}
    optionFilterProp="label"
  />
  {availableGroups.length === 0 && (
    <div className="text-gray-400 text-xs mt-2">所有可用账户组均已绑定。</div>
  )}
</div>
</Modal>

{/* 动态筛选条件明细弹窗 */}
<Modal
title={`动态筛选条件 - ${currentDetailGroup?.name}`}
open={detailModalVisible}
onCancel={() => setDetailModalVisible(false)}
footer={<Button type="primary" onClick={() => setDetailModalVisible(false)} className="bg-[#1890ff] border-none">关闭</Button>}
width={1000}
>
{currentDetailGroup?.filterConditions?.conditionTree ? (() => {
  const viewSelectedSystemsSet = getSelectedSystems(currentDetailGroup.filterConditions.conditionTree);
  const viewSelectedSystems = Array.from(viewSelectedSystemsSet);

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-2 py-4 bg-gray-50/50 px-4 rounded-lg">
      {renderSystemCards(currentDetailGroup.filterConditions.conditionTree, viewSelectedSystems)}
    </div>
  );
})() : (
  <div className="py-8">
    <Empty description="暂无筛选条件" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  </div>
)}
</Modal>
</div>
);
};
export default RuleView;




