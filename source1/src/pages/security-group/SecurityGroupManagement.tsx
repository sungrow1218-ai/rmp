import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Space, Typography, Modal, Form, message, Tag, Empty, Radio, Alert } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, PlusSquareOutlined, AppstoreFilled, TagsOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

type RuleCondition = {
  id: string;
  type: 'rule';
  field: string;
  operator: 'in' | 'not_in';
  values: string[];
};

type RuleGroup = {
  id: string;
  type: 'group';
  logicalOperator: 'AND' | 'OR';
  children: (RuleCondition | RuleGroup)[];
};

interface SecurityGroup {
  id: string;
  name: string;
  groupType: 'static' | 'dynamic';
  description: string;
  createTime: string;
  securityList?: { 
    symbol: string; 
    name: string; 
    market: string; 
    type?: string;
    validStartDate?: string;
    validEndDate?: string;
    creator?: string;
    createTime?: string;
    modifier?: string;
    updateTime?: string;
  }[];
  filterConditions?: {
    conditionTree?: RuleGroup;
  };
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// 初始模拟数据
const initialData: SecurityGroup[] = [
  { 
    id: 'S001', name: '核心资产池', groupType: 'static', description: '公司核心关注的蓝筹股', createTime: '2023-10-01 10:00:00',
    securityList: [
      { symbol: '600519', name: '贵州茅台', market: '上海证券交易所', type: '股票', validStartDate: '2023-01-01', validEndDate: '2099-12-31', creator: '018566', createTime: '2023-10-01 10:00:00', modifier: '018566', updateTime: '2023-10-01 10:00:00' },
      { symbol: '000858', name: '五粮液', market: '深圳证券交易所', type: '股票', validStartDate: '2023-01-01', validEndDate: '2099-12-31', creator: '018566', createTime: '2023-10-01 10:00:00', modifier: '018566', updateTime: '2023-10-01 10:00:00' }
    ]
  },
  { 
    id: 'S002', name: '科创板医药股', groupType: 'dynamic', description: '科创板上市的医药生物企业', createTime: '2023-10-02 11:30:00',
    filterConditions: {
      conditionTree: {
        id: 'root',
        type: 'group',
        logicalOperator: 'AND',
        children: [
          { id: 'r1', type: 'rule', field: 'market', operator: 'in', values: ['SH'] },
          { id: 'r2', type: 'rule', field: 'sector', operator: 'in', values: ['star'] },
          { id: 'r3', type: 'rule', field: 'industry', operator: 'in', values: ['medical'] }
        ]
      }
    }
  },
  { 
    id: 'S003', name: '风险警示股', groupType: 'dynamic', description: '全市场风险警示股票', createTime: '2023-10-05 09:15:00',
    filterConditions: {
      conditionTree: {
        id: 'root',
        type: 'group',
        logicalOperator: 'AND',
        children: [
          { id: 'r1', type: 'rule', field: 'isRiskWarning', operator: 'in', values: ['yes'] }
        ]
      }
    }
  },
];

// 模拟全量证券数据用于预览
const mockAllSecurities = [
  { symbol: '600519', name: '贵州茅台', market: 'SH', type: 'stock', industry: 'consumer', sector: 'main', isRiskWarning: 'no' },
  { symbol: '000858', name: '五粮液', market: 'SZ', type: 'stock', industry: 'consumer', sector: 'main', isRiskWarning: 'no' },
  { symbol: '688981', name: '中芯国际', market: 'SH', type: 'stock', industry: 'tech', sector: 'star', isRiskWarning: 'no' },
  { symbol: '300750', name: '宁德时代', market: 'SZ', type: 'stock', industry: 'tech', sector: 'gem', isRiskWarning: 'no' },
  { symbol: '600036', name: '招商银行', market: 'SH', type: 'stock', industry: 'finance', sector: 'main', isRiskWarning: 'no' },
  { symbol: '000001', name: '平安银行', market: 'SZ', type: 'stock', industry: 'finance', sector: 'main', isRiskWarning: 'no' },
  { symbol: '600276', name: '恒瑞医药', market: 'SH', type: 'stock', industry: 'medical', sector: 'main', isRiskWarning: 'no' },
  { symbol: '300015', name: '爱尔眼科', market: 'SZ', type: 'stock', industry: 'medical', sector: 'gem', isRiskWarning: 'no' },
  { symbol: '600000', name: '浦发银行', market: 'SH', type: 'stock', industry: 'finance', sector: 'main', isRiskWarning: 'no' },
  { symbol: '000002', name: '万科A', market: 'SZ', type: 'stock', industry: 'realestate', sector: 'main', isRiskWarning: 'no' },
  { symbol: '600123', name: 'ST明诚', market: 'SH', type: 'stock', industry: 'consumer', sector: 'main', isRiskWarning: 'yes' },
  { symbol: '000456', name: 'ST国药', market: 'SZ', type: 'stock', industry: 'medical', sector: 'main', isRiskWarning: 'yes' },
];

const evaluateRule = (item: any, rule: RuleCondition) => {
  const itemValue = item[rule.field as keyof typeof item];
  if (!rule.values || rule.values.length === 0) return true;
  const isIn = rule.values.includes(itemValue);
  return rule.operator === 'in' ? isIn : !isIn;
};

const evaluateGroup = (item: any, group: RuleGroup): boolean => {
  if (!group.children || group.children.length === 0) return true;

  if (group.logicalOperator === 'AND') {
    return group.children.every(child => {
      if (child.type === 'rule') return evaluateRule(item, child as RuleCondition);
      return evaluateGroup(item, child as RuleGroup);
    });
  } else {
    return group.children.some(child => {
      if (child.type === 'rule') return evaluateRule(item, child as RuleCondition);
      return evaluateGroup(item, child as RuleGroup);
    });
  }
};

const getFieldOptions = () => {
  return [
    { value: 'market', label: '交易市场' },
    { value: 'securityType', label: '证券类别' },
    { value: 'industry', label: '所属行业' },
    { value: 'sector', label: '所属板块' },
    { value: 'isRiskWarning', label: '是否风险警示' }
  ];
};

const getEnumOptions = (field: string) => {
  switch(field) {
    case 'market':
      return [
        { value: 'SH', label: '上海证券交易所' },
        { value: 'SZ', label: '深圳证券交易所' },
        { value: 'BJ', label: '北京证券交易所' }
      ];
    case 'securityType':
      return [
        { value: 'stock', label: '股票' },
        { value: 'bond', label: '债券' },
        { value: 'fund', label: '基金' }
      ];
    case 'industry':
      return [
        { value: 'finance', label: '金融' },
        { value: 'realestate', label: '房地产' },
        { value: 'medical', label: '医药' },
        { value: 'tech', label: '科技' },
        { value: 'consumer', label: '消费' }
      ];
    case 'sector':
      return [
        { value: 'main', label: '主板' },
        { value: 'gem', label: '创业板' },
        { value: 'star', label: '科创板' }
      ];
    case 'isRiskWarning':
      return [
        { value: 'yes', label: '是' },
        { value: 'no', label: '否' }
      ];
    default:
      return [];
  }
};

const operatorOptions = [
  { value: 'in', label: '包含' },
  { value: 'not_in', label: '不包含' },
];

// 规则节点组件
const RuleNode: React.FC<{
  rule: RuleCondition;
  onChange: (rule: RuleCondition) => void;
  onRemove: () => void;
}> = ({ rule, onChange, onRemove }) => {
  const currentFieldOptions = getFieldOptions();
  const currentEnumOptions = getEnumOptions(rule.field);

  return (
    <div className="flex items-start gap-3 bg-white p-3 rounded border border-gray-200 hover:border-blue-300 transition-colors shadow-sm">
      <Select 
        value={rule.field}
        onChange={(val) => onChange({ ...rule, field: val, values: [] })}
        options={currentFieldOptions}
        style={{ width: 140 }}
      />
      <Select 
        value={rule.operator}
        onChange={(val) => onChange({ ...rule, operator: val })}
        options={operatorOptions}
        style={{ width: 100 }}
      />
      <Select 
        mode="multiple"
        value={rule.values}
        onChange={(val) => onChange({ ...rule, values: val })}
        options={currentEnumOptions}
        placeholder="请选择"
        style={{ flex: 1 }}
        maxTagCount="responsive"
      />
      <Button type="text" danger icon={<DeleteOutlined />} onClick={onRemove} />
    </div>
  );
};

// 规则组节点组件
const RuleGroupNode: React.FC<{
  group: RuleGroup;
  onChange: (group: RuleGroup) => void;
  onRemove?: () => void;
  isRoot?: boolean;
}> = ({ group, onChange, onRemove, isRoot }) => {
  const handleAddRule = () => {
    onChange({
      ...group,
      children: [
        ...group.children,
        { id: generateId(), type: 'rule', field: 'market', operator: 'in', values: [] }
      ]
    });
  };

  const handleAddGroup = () => {
    onChange({
      ...group,
      children: [
        ...group.children,
        { id: generateId(), type: 'group', logicalOperator: 'AND', children: [{ id: generateId(), type: 'rule', field: 'market', operator: 'in', values: [] }] }
      ]
    });
  };

  const handleChildChange = (index: number, newChild: RuleCondition | RuleGroup) => {
    const newChildren = [...group.children];
    newChildren[index] = newChild;
    onChange({ ...group, children: newChildren });
  };

  const handleChildRemove = (index: number) => {
    const newChildren = [...group.children];
    newChildren.splice(index, 1);
    onChange({ ...group, children: newChildren });
  };

  return (
    <div className={`p-4 rounded-lg border ${isRoot ? 'border-transparent bg-transparent p-0' : 'border-blue-300 bg-blue-50/40 shadow-sm mt-2 relative'}`}>
      <div className="flex items-center justify-between mb-3">
        <Space>
          <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={handleAddRule}>添加条件</Button>
          <Button size="small" type="dashed" icon={<PlusSquareOutlined />} onClick={handleAddGroup}>添加条件组</Button>
        </Space>

        {!isRoot && (
          <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={onRemove}>删除组</Button>
        )}
      </div>

      <div className={`flex flex-col ${isRoot ? 'pl-4 border-l-2 border-blue-200 ml-2' : ''}`}>
        {group.children.map((child, index) => {
          return (
            <React.Fragment key={child.id}>
              {index > 0 && (
                <div className="relative flex items-center my-3">
                  <div className="absolute w-full h-px bg-blue-200"></div>
                  <div className="relative z-10 bg-white px-2 ml-8 rounded border border-blue-200">
                    <Radio.Group 
                      value={group.logicalOperator} 
                      onChange={(e) => onChange({ ...group, logicalOperator: e.target.value })}
                      size="small"
                      buttonStyle="solid"
                    >
                      <Radio.Button value="AND">且</Radio.Button>
                      <Radio.Button value="OR">或</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              )}
              {child.type === 'rule' ? (
                <RuleNode 
                  rule={child as RuleCondition} 
                  onChange={(newRule) => handleChildChange(index, newRule)}
                  onRemove={() => handleChildRemove(index)}
                />
              ) : (
                <RuleGroupNode 
                  group={child as RuleGroup} 
                  onChange={(newGroup) => handleChildChange(index, newGroup)}
                  onRemove={() => handleChildRemove(index)}
                  isRoot={false}
                />
              )}
            </React.Fragment>
          );
        })}
        {group.children.length === 0 && (
          <div className="text-gray-400 text-sm py-2">暂无条件，请点击上方按钮添加</div>
        )}
      </div>
    </div>
  );
};

export const SecurityGroupManagement: React.FC = () => {
  const [data, setData] = useState<SecurityGroup[]>(initialData);
  const [selectedGroup, setSelectedGroup] = useState<SecurityGroup | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SecurityGroup | null>(null);
  const [form] = Form.useForm();
  const [formGroupType, setFormGroupType] = useState<'static' | 'dynamic'>('static');

  // 搜索状态
  const [searchName, setSearchName] = useState('');

  const [isDynamicFilterModalVisible, setIsDynamicFilterModalVisible] = useState(false);
  const [conditionTree, setConditionTree] = useState<RuleGroup>({
    id: 'root',
    type: 'group',
    logicalOperator: 'AND',
    children: []
  });

  // 预览状态
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isViewPreviewModalVisible, setIsViewPreviewModalVisible] = useState(false);

  // 删除弹窗状态
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<SecurityGroup | null>(null);

  // 默认选中第一条
  useEffect(() => {
    if (data.length > 0 && !selectedGroup) {
      setSelectedGroup(data[0]);
    }
  }, [data, selectedGroup]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setFormGroupType('static');
    form.setFieldsValue({ groupType: 'static' });
    setIsModalVisible(true);
  };

  const handleEdit = (record: SecurityGroup) => {
    setEditingRecord(record);
    setFormGroupType(record.groupType);
    form.setFieldsValue({
      ...record,
    });
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (groupToDelete) {
      setData(prev => prev.filter(item => item.id !== groupToDelete.id));
      if (selectedGroup?.id === groupToDelete.id) {
        setSelectedGroup(null);
      }
      message.success('删除成功');
      setIsDeleteModalVisible(false);
      setGroupToDelete(null);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      let newSecurityList = editingRecord?.securityList || [];

      let newFilterConditions = undefined;
      if (values.groupType === 'dynamic') {
        newFilterConditions = { 
          conditionTree: {
            id: 'root',
            type: 'group',
            logicalOperator: 'AND',
            children: [{ id: generateId(), type: 'rule', field: 'market', operator: 'in', values: [] }]
          }
        };
      }

      const newRecordData = {
        name: values.name,
        groupType: values.groupType,
        description: values.description,
        securityList: newSecurityList,
        filterConditions: newFilterConditions,
      };

      if (editingRecord) {
        const updatedRecord = { ...editingRecord, ...newRecordData } as SecurityGroup;
        // 如果是从静态切到动态，保留原有的 filterConditions 如果有的话
        if (values.groupType === 'dynamic' && editingRecord.groupType === 'dynamic') {
          updatedRecord.filterConditions = editingRecord.filterConditions;
        }
        setData(prev => prev.map(item => item.id === editingRecord.id ? updatedRecord : item));
        if (selectedGroup?.id === editingRecord.id) {
          setSelectedGroup(updatedRecord);
        }
        message.success('修改成功');
      } else {
        const newRecord: SecurityGroup = {
          ...newRecordData,
          id: `S${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
        setData(prev => [newRecord, ...prev]);
        setSelectedGroup(newRecord);
        message.success('新增成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleEditDynamicFilter = () => {
    let initialTree = selectedGroup?.filterConditions?.conditionTree;

    if (!initialTree) {
      initialTree = {
        id: 'root',
        type: 'group',
        logicalOperator: 'AND',
        children: [{ id: generateId(), type: 'rule', field: 'market', operator: 'in', values: [] }]
      };
    }

    setConditionTree(initialTree);
    setIsPreviewVisible(false);
    setIsDynamicFilterModalVisible(true);
  };

  const handleDynamicFilterModalOk = () => {
    if (selectedGroup) {
      const updatedGroup = {
        ...selectedGroup,
        filterConditions: {
          conditionTree
        }
      };

      setData(prev => prev.map(item => item.id === updatedGroup.id ? updatedGroup : item));
      setSelectedGroup(updatedGroup);
      setIsDynamicFilterModalVisible(false);
      message.success('筛选条件更新成功');
    }
  };

  const handleViewPreview = (tree: RuleGroup) => {
    const filtered = mockAllSecurities.filter(item => evaluateGroup(item, tree));
    setPreviewData(filtered);
    setIsViewPreviewModalVisible(true);
  };

  // 过滤数据
  const filteredData = data.filter(item => {
    return item.name.toLowerCase().includes(searchName.toLowerCase());
  });

  const leftColumns: ColumnsType<SecurityGroup> = [
    { 
      title: '证券组名称', 
      dataIndex: 'name', 
      render: (text, record) => (
        <div className="flex items-center justify-between w-full">
          <span className="truncate" title={text}>{text}</span>
          <Tag color={record.groupType === 'static' ? 'blue' : 'green'} className="ml-2 shrink-0 m-0">
            {record.groupType === 'static' ? '静态' : '动态'}
          </Tag>
        </div>
      )
    }
  ];

  const securityColumns: ColumnsType<any> = [
    { title: '证券代码', dataIndex: 'symbol', width: 100 },
    { title: '证券名称', dataIndex: 'name', width: 100 },
    { title: '交易市场', dataIndex: 'market', width: 120 },
    { title: '有效开始日期', dataIndex: 'validStartDate', width: 120 },
    { title: '有效截止日期', dataIndex: 'validEndDate', width: 120 },
    { title: '添加人', dataIndex: 'creator', width: 80 },
    { title: '添加时间', dataIndex: 'createTime', width: 160 },
    { title: '修改人', dataIndex: 'modifier', width: 80 },
    { title: '修改时间', dataIndex: 'updateTime', width: 160 },
    { 
      title: '操作', 
      key: 'action', 
      width: 120,
      fixed: 'right' as const,
      render: () => (
        <Space size="small">
          <a className="text-[#1890ff] hover:text-[#096dd9]">编辑</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">移除</a>
        </Space>
      ) 
    },
  ];

  // 渲染卡片式的系统条件
  const renderMarketCards = (group: RuleGroup) => {
    if (!group || !group.children || group.children.length === 0) {
      return <Empty description="暂无筛选条件" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    const markets = new Set<string>();
    const rules: RuleCondition[] = [];

    const traverse = (node: RuleGroup | RuleCondition) => {
      if (node.type === 'rule') {
        if (node.field === 'market') {
          if (node.values) {
            node.values.forEach(v => markets.add(v));
          }
        } else {
          rules.push(node as RuleCondition);
        }
      } else {
        if (node.children) {
          node.children.forEach(traverse);
        }
      }
    };

    traverse(group);

    const marketList = Array.from(markets);
    const marketOptions = getEnumOptions('market');

    if (marketList.length === 0) {
      return (
        <div className="grid grid-cols-1 gap-5">
          <div className="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-50 to-white px-5 py-4 border-b border-blue-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <AppstoreFilled className="text-blue-600 text-lg" />
              </div>
              <span className="font-bold text-blue-900 text-lg">全部市场</span>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-4 bg-white">
              {rules.length > 0 ? (
                rules.map((rule, idx) => {
                  const fieldLabel = getFieldOptions().find(o => o.value === rule.field)?.label || rule.field;
                  return (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <TagsOutlined className="text-gray-400" />
                        <span className="text-gray-700 font-medium text-sm">{fieldLabel}</span>
                        <Tag color={rule.operator === 'in' ? 'blue' : 'red'} className="m-0 border-none px-2 py-0.5 leading-tight text-xs font-medium">
                          {rule.operator === 'in' ? '包含' : '不包含'}
                        </Tag>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {rule.values.map(v => {
                          const options = getEnumOptions(rule.field);
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
                  <span className="text-sm">包含所有证券</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {marketList.map(mkt => {
          const marketLabel = marketOptions.find(o => o.value === mkt)?.label || mkt;
          return (
            <div key={mkt} className="bg-white border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-blue-50 to-white px-5 py-4 border-b border-blue-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <AppstoreFilled className="text-blue-600 text-lg" />
                </div>
                <span className="font-bold text-blue-900 text-lg truncate" title={marketLabel}>{marketLabel}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-4 bg-white">
                {rules.length > 0 ? (
                  rules.map((rule, idx) => {
                    const fieldLabel = getFieldOptions().find(o => o.value === rule.field)?.label || rule.field;
                    return (
                      <div key={idx} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <TagsOutlined className="text-gray-400" />
                          <span className="text-gray-700 font-medium text-sm">{fieldLabel}</span>
                          <Tag color={rule.operator === 'in' ? 'blue' : 'red'} className="m-0 border-none px-2 py-0.5 leading-tight text-xs font-medium">
                            {rule.operator === 'in' ? '包含' : '不包含'}
                          </Tag>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-6">
                          {rule.values.map(v => {
                            const options = getEnumOptions(rule.field);
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
                      <TagsOutlined className="text-xl opacity-50" />
                    </div>
                    <span className="text-sm">包含该市场所有证券</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDetails = () => {
    if (!selectedGroup) return <Empty description="请在左侧选择证券组" className="mt-32" />;

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="text-[#1890ff] text-lg flex items-center">
              <SafetyCertificateOutlined />
            </div>
            <span className="font-bold text-base text-gray-800">基本信息</span>
          </div>
          <Space>
            <Button icon={<EditOutlined />} onClick={() => handleEdit(selectedGroup)}>编辑</Button>
            <Button danger icon={<DeleteOutlined />} onClick={() => {
              setGroupToDelete(selectedGroup);
              setIsDeleteModalVisible(true);
            }}>删除</Button>
          </Space>
        </div>

        <div className="mb-8 shrink-0 border-b border-gray-100 pb-8 px-4">
          <div className="grid grid-cols-4 gap-y-6 gap-x-4 text-sm">
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">证券组ID：</span><span className="text-gray-800 truncate pl-2">{selectedGroup.id}</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">证券组名称：</span><span className="text-gray-800 truncate pl-2">{selectedGroup.name}</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">更新模式：</span><span className="text-gray-800 truncate pl-2">{selectedGroup.groupType === 'static' ? '静态证券组' : '动态证券组'}</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">创建人：</span><span className="text-gray-800 truncate pl-2">018566</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">创建日期：</span><span className="text-gray-800 truncate pl-2">{selectedGroup.createTime}</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">描述：</span><span className="text-gray-800 truncate pl-2" title={selectedGroup.description || '--'}>{selectedGroup.description || '--'}</span></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedGroup.groupType === 'static' ? (
            <>
              <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="text-[#1890ff] text-lg flex items-center">
                    <SafetyCertificateOutlined />
                  </div>
                  <span className="font-bold text-base text-gray-800">证券列表</span>
                </div>
                <Space>
                  <Button className="bg-[#1890ff] text-white hover:!bg-[#096dd9] hover:!text-white border-none">导出</Button>
                  <Button className="bg-[#1890ff] text-white hover:!bg-[#096dd9] hover:!text-white border-none">添加</Button>
                  <Button>批量移除</Button>
                  <Button className="text-[#1890ff] border-[#1890ff] hover:!text-[#096dd9] hover:!border-[#096dd9]">批量导入</Button>
                </Space>
              </div>
              <div className="flex-1 overflow-hidden border border-gray-200 rounded">
                <Table 
                  size="middle"
                  rowSelection={{ type: 'checkbox' }}
                  columns={securityColumns}
                  dataSource={selectedGroup.securityList || []}
                  rowKey="symbol"
                  pagination={false}
                  scroll={{ x: 'max-content', y: 'calc(100vh - 420px)' }}
                  locale={{
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
                  }}
                  className="custom-table"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="text-[#1890ff] text-lg flex items-center">
                    <SafetyCertificateOutlined />
                  </div>
                  <span className="font-bold text-base text-gray-800">动态筛选条件</span>
                </div>
                <Space>
                  <Button onClick={() => handleViewPreview(selectedGroup.filterConditions!.conditionTree!)}>预览证券列表</Button>
                  <Button className="bg-[#1890ff] text-white hover:!bg-[#096dd9] hover:!text-white border-none" onClick={handleEditDynamicFilter}>编辑条件</Button>
                </Space>
              </div>
              <div className="p-6 rounded-lg border border-gray-200 flex-1 overflow-y-auto bg-gray-50/50">
                {selectedGroup.filterConditions?.conditionTree ? (
                  renderMarketCards(selectedGroup.filterConditions.conditionTree)
                ) : (
                  <Empty description="暂无筛选条件" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 h-full flex flex-col absolute inset-0 bg-gray-50 overflow-hidden">
      {/* 顶部标题 */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <SafetyCertificateOutlined className="text-[#1890ff] text-xl" />
          <Title level={4} style={{ margin: 0, color: '#333' }}>证券组管理</Title>
        </div>
        <Button type="primary" icon={<PlusOutlined />} className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={handleAdd}>
          新增证券组
        </Button>
      </div>

      {/* 主体左右结构 */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* 左侧列表 */}
        <div className="w-[320px] bg-white border border-gray-200 rounded-md flex flex-col overflow-hidden shadow-sm shrink-0">
          {/* 搜索区 */}
          <div className="p-3 border-b border-gray-200 flex flex-col gap-2 shrink-0 bg-gray-50">
            <Input 
              placeholder="搜索证券组名称" 
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              allowClear
            />
          </div>

          {/* 表格区 */}
          <div className="flex-1 overflow-hidden">
            <Table 
              columns={leftColumns} 
              dataSource={filteredData} 
              rowKey="id"
              pagination={{ 
                pageSize: 20,
                size: 'small',
                showSizeChanger: false,
                showTotal: (total) => `共 ${total} 条`
              }}
              size="small"
              scroll={{ y: 'calc(100vh - 260px)' }}
              onRow={(record) => ({
                onClick: () => setSelectedGroup(record),
                className: 'cursor-pointer transition-colors hover:bg-gray-50'
              })}
              rowClassName={(record) => selectedGroup?.id === record.id ? '!bg-[#e6f7ff]' : ''}
            />
          </div>
        </div>

        {/* 右侧详情 */}
        <div className="flex-1 bg-white border border-gray-200 rounded-md p-6 overflow-hidden flex flex-col shadow-sm">
          {renderDetails()}
        </div>
      </div>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRecord ? "编辑证券组" : "新增证券组"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
        width={520}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none" }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="证券组名称" rules={[{ required: true, message: '请输入证券组名称' }]}>
            <Input placeholder="请输入证券组名称" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>

          <Form.Item 
            name="groupType" 
            label="证券组更新模式" 
            rules={[{ required: true, message: '请选择更新模式' }]}
            tooltip="静态证券组需手动维护证券列表；动态证券组通过设置条件自动筛选证券。"
          >
            <Radio.Group onChange={(e) => setFormGroupType(e.target.value)}>
              <Radio value="static">静态证券组</Radio>
              <Radio value="dynamic">动态证券组</Radio>
            </Radio.Group>
          </Form.Item>

          {formGroupType === 'dynamic' && (
            <div className="bg-blue-50/50 p-3 rounded border border-blue-100 mb-4 text-gray-500 text-sm flex items-start gap-2">
              <InfoCircleOutlined className="text-[#1890ff] mt-0.5 shrink-0" />
              <div>动态证券组的筛选条件请在创建完成后，在右侧详情面板中点击“编辑条件”进行配置。</div>
            </div>
          )}

        </Form>
      </Modal>

      {/* 动态筛选条件编辑弹窗 */}
      <Modal
        title="编辑动态筛选条件"
        open={isDynamicFilterModalVisible}
        onOk={handleDynamicFilterModalOk}
        onCancel={() => setIsDynamicFilterModalVisible(false)}
        destroyOnClose
        width={850}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ className: "bg-[#1890ff] hover:!bg-[#096dd9] border-none" }}
      >
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
          <RuleGroupNode 
            group={conditionTree} 
            onChange={setConditionTree} 
            isRoot={true} 
          />
          <div className="mt-4 flex justify-end">
            <Button type="primary" ghost onClick={() => {
              const filtered = mockAllSecurities.filter(item => evaluateGroup(item, conditionTree));
              setPreviewData(filtered);
              setIsPreviewVisible(true);
            }}>预览证券列表</Button>
          </div>
          {isPreviewVisible && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="font-bold mb-2">预览结果 ({previewData.length}条)</div>
              <Table 
                size="small"
                columns={[
                  { title: '证券代码', dataIndex: 'symbol' },
                  { title: '证券名称', dataIndex: 'name' },
                  { title: '交易市场', dataIndex: 'market', render: (v) => getEnumOptions('market').find(o => o.value === v)?.label || v },
                ]}
                dataSource={previewData}
                rowKey="symbol"
                pagination={{ pageSize: 5 }}
              />
            </div>
          )}
        </div>
      </Modal>

      {/* 预览证券列表弹窗 */}
      <Modal
        title="预览证券列表"
        open={isViewPreviewModalVisible}
        onCancel={() => setIsViewPreviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewPreviewModalVisible(false)}>关闭</Button>
        ]}
        width={800}
      >
        <div className="mb-2">共匹配到 <span className="text-[#1890ff] font-bold">{previewData.length}</span> 条证券</div>
        <Table 
          size="middle"
          columns={[
            { title: '证券代码', dataIndex: 'symbol' },
            { title: '证券名称', dataIndex: 'name' },
            { title: '交易市场', dataIndex: 'market', render: (v) => getEnumOptions('market').find(o => o.value === v)?.label || v },
          ]}
          dataSource={previewData}
          rowKey="symbol"
          pagination={{ pageSize: 10 }}
        />
      </Modal>

      {/* 删除证券组弹窗 */}
      <Modal
        title="删除证券组"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        width={800}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <Alert
          message="删除证券组前，请先解除关联规则中绑定的证券组，否则风控规则将失效"
          type="warning"
          showIcon
          closable
          className="mb-4"
        />
        <Table
          columns={[
            { title: '证券组ID', dataIndex: 'groupId' },
            { title: '证券组名称', dataIndex: 'groupName' },
            { title: '关联的规则编号', dataIndex: 'ruleNo' },
            { title: '关联的规则名称', dataIndex: 'ruleName' },
            { title: '规则状态', dataIndex: 'ruleStatus' },
            { title: '审批状态', dataIndex: 'approvalStatus' },
          ]}
          dataSource={[]}
          pagination={false}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
          }}
          size="middle"
          className="custom-table"
        />
      </Modal>
    </div>
  );
};
export default SecurityGroupManagement;
