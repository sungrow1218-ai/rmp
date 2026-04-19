import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Space, Typography, Modal, Form, message, Tag, Empty, Radio, Alert } from 'antd';
import { PlusOutlined, SearchOutlined, TeamOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, PlusSquareOutlined, AppstoreFilled, IdcardOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './style.css';

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

interface AccountGroup {
  id: string;
  name: string;
  groupType: 'static' | 'dynamic';
  accountType: string;
  controlType: string;
  description: string;
  createTime: string;
  accountList?: { accountId: string; accountName: string; system: string }[];
  filterConditions?: {
    conditionTree?: RuleGroup;
    rules?: any[]; // 兼容旧数据
  };
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// 初始模拟数据
const initialData: AccountGroup[] = [
  { 
    id: '191', name: '33333', groupType: 'static', accountType: '证券账户', controlType: '联合控制', description: '测试账户组1', createTime: '2023-10-01 10:00:00',
    accountList: [
      { accountId: 'A001', accountName: '测试账户01', system: 'O32' },
      { accountId: 'A002', accountName: '测试账户02', system: 'O45' }
    ]
  },
  { 
    id: '192', name: '自营A股账户组', groupType: 'dynamic', accountType: '证券账户', controlType: '单独控制', description: '自营业务专用', createTime: '2023-10-02 11:30:00',
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
  { 
    id: '193', name: '量化高频账户组', groupType: 'static', accountType: '投资组合', controlType: '联合控制', description: '量化交易策略组', createTime: '2023-10-05 09:15:00',
    accountList: [
      { accountId: 'P001', accountName: '量化组合A', system: '集中柜台' },
      { accountId: 'P002', accountName: '量化组合B', system: '集中柜台' }
    ]
  },
  { 
    id: '194', name: '做市商账户组', groupType: 'dynamic', accountType: '证券账户', controlType: '单独控制', description: '期权做市专用', createTime: '2023-10-10 14:20:00',
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
  { 
    id: '195', name: 'QFII测试账户组', groupType: 'static', accountType: '投资组合', controlType: '联合控制', description: '外资客户测试', createTime: '2023-10-15 16:45:00',
    accountList: [
      { accountId: 'Q001', accountName: 'QFII组合1', system: 'GTP' }
    ]
  },
];

// 动态筛选条件配置
const mockSystems = [
  { value: 'O32', label: 'O32' },
  { value: 'O45', label: 'O45' },
  { value: '机构O32', label: '机构O32' },
  { value: '集中柜台', label: '集中柜台' },
  { value: '根网', label: '根网' },
  { value: 'GTP', label: 'GTP' },
];

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
  if (field === 'system') return mockSystems;

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

const operatorOptions = [
  { value: 'in', label: '包含' },
  { value: 'not_in', label: '不包含' },
];

// 规则节点组件
const RuleNode: React.FC<{
  rule: RuleCondition;
  onChange: (rule: RuleCondition) => void;
  onRemove: () => void;
  selectedSystems: string[];
}> = ({ rule, onChange, onRemove, selectedSystems }) => {
  const currentFieldOptions = getFieldOptions();
  const currentEnumOptions = getEnumOptions(rule.field, selectedSystems);

  const isInvalidField = !currentFieldOptions.find(o => o.value === rule.field);

  return (
    <div className={`flex items-start gap-3 bg-white p-3 rounded border ${isInvalidField ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-blue-300'} transition-colors shadow-sm`}>
      <div className="flex flex-col gap-1">
        <Select 
          value={rule.field}
          onChange={(val) => onChange({ ...rule, field: val, values: [] })}
          options={currentFieldOptions}
          style={{ width: 140 }}
          status={isInvalidField ? 'error' : undefined}
        />
        {isInvalidField && <span className="text-[10px] text-red-500">当前系统选择下不可用</span>}
      </div>
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
  selectedSystems: string[];
}> = ({ group, onChange, onRemove, isRoot, selectedSystems }) => {
  const handleAddRule = () => {
    onChange({
      ...group,
      children: [
        ...group.children,
        { id: generateId(), type: 'rule', field: 'system', operator: 'in', values: [] }
      ]
    });
  };

  const handleAddGroup = () => {
    onChange({
      ...group,
      children: [
        ...group.children,
        { id: generateId(), type: 'group', logicalOperator: 'AND', children: [{ id: generateId(), type: 'rule', field: 'system', operator: 'in', values: [] }] }
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
                  selectedSystems={selectedSystems}
                />
              ) : (
                <RuleGroupNode 
                  group={child as RuleGroup} 
                  onChange={(newGroup) => handleChildChange(index, newGroup)}
                  onRemove={() => handleChildRemove(index)}
                  isRoot={false}
                  selectedSystems={selectedSystems}
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

export const AccountGroupManagement: React.FC = () => {
  const [data, setData] = useState<AccountGroup[]>(initialData);
  const [selectedGroup, setSelectedGroup] = useState<AccountGroup | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AccountGroup | null>(null);
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

  // 删除弹窗状态
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<AccountGroup | null>(null);

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

  const handleEdit = (record: AccountGroup) => {
    setEditingRecord(record);
    setFormGroupType(record.groupType);
    form.setFieldsValue({
      ...record,
      accountList: record.accountList?.map(a => a.accountId)
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

      let newAccountList = editingRecord?.accountList || [];

      let newFilterConditions = undefined;
      if (values.groupType === 'dynamic') {
        newFilterConditions = { 
          conditionTree: {
            id: 'root',
            type: 'group',
            logicalOperator: 'AND',
            children: [{ id: generateId(), type: 'rule', field: 'system', operator: 'in', values: [] }]
          }
        };
      }

      const newRecordData = {
        name: values.name,
        groupType: values.groupType,
        accountType: values.accountType || (editingRecord ? editingRecord.accountType : '证券账户'),
        controlType: editingRecord ? editingRecord.controlType : '单独控制',
        description: values.description,
        accountList: newAccountList,
        filterConditions: newFilterConditions,
      };

      if (editingRecord) {
        const updatedRecord = { ...editingRecord, ...newRecordData } as AccountGroup;
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
        const newRecord: AccountGroup = {
          ...newRecordData,
          id: Math.floor(Math.random() * 10000).toString(),
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
      // 兼容旧数据
      const rules = selectedGroup?.filterConditions?.rules || [];
      if (rules.length > 0) {
        initialTree = {
          id: 'root',
          type: 'group',
          logicalOperator: 'AND',
          children: rules.map(r => ({ ...r, id: generateId(), type: 'rule' }))
        };
      } else {
        initialTree = {
          id: 'root',
          type: 'group',
          logicalOperator: 'AND',
          children: [{ id: generateId(), type: 'rule', field: 'system', operator: 'in', values: [] }]
        };
      }
    }

    setConditionTree(initialTree);
    setIsDynamicFilterModalVisible(true);
  };

  // 提取树中选中的系统
  const getSelectedSystems = (group: RuleGroup): Set<string> => {
    let systems = new Set<string>();
    if (!group || !group.children) return systems;
    group.children.forEach(child => {
      if (child.type === 'rule') {
        if ((child as RuleCondition).field === 'system' && (child as RuleCondition).values) {
          (child as RuleCondition).values.forEach(v => systems.add(v));
        }
      } else {
        const childSystems = getSelectedSystems(child as RuleGroup);
        childSystems.forEach(v => systems.add(v));
      }
    });
    return systems;
  };

  // 编辑弹窗中的状态
  const editSelectedSystemsSet = getSelectedSystems(conditionTree);
  const editSelectedSystems = Array.from(editSelectedSystemsSet);

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

  // 过滤数据
  const filteredData = data.filter(item => {
    return item.name.toLowerCase().includes(searchName.toLowerCase());
  });

  const leftColumns: ColumnsType<AccountGroup> = [
    { 
      title: '账户组名称', 
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

  // 详情展示中的状态
  const viewSelectedSystemsSet = selectedGroup?.filterConditions?.conditionTree 
    ? getSelectedSystems(selectedGroup.filterConditions.conditionTree) 
    : new Set<string>();
  const viewSelectedSystems = Array.from(viewSelectedSystemsSet);

  // 渲染卡片式的系统条件
  const renderSystemCards = (group: RuleGroup, viewSelectedSystems: string[]) => {
    if (!group || !group.children || group.children.length === 0) {
      return <Empty description="暂无筛选条件" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    const systems = new Set<string>();
    const rules: RuleCondition[] = [];

    const traverse = (node: RuleGroup | RuleCondition) => {
      if (node.type === 'rule') {
        if (node.field === 'system') {
          if (node.values) {
            node.values.forEach(v => systems.add(v));
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

    const systemList = Array.from(systems);
    
    if (systemList.length === 0) {
      return (
        <div className="p-6 text-center">
          <Empty description="未选择任何交易系统" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      );
    }

    const result: Record<string, RuleCondition[]> = {};
    systemList.forEach(sys => {
      result[sys] = [];
    });

    rules.forEach(rule => {
      if (!rule.values || rule.values.length === 0) return;
      
      const sysValues: Record<string, string[]> = {};
      rule.values.forEach(v => {
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
                          {rule.values.map(v => {
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

  const renderDetails = () => {
    if (!selectedGroup) return <Empty description="请在左侧选择账户组" className="mt-32" />;

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="text-[#1890ff] text-lg flex items-center">
              <svg viewBox="0 0 1024 1024" width="1.2em" height="1.2em" fill="currentColor">
                <path d="M512 146.3l-383.8 192 383.8 192 383.8-192zM128.2 466.3l-64 32L512 722.3l447.8-224-64-32L512 658.3zM128.2 658.3l-64 32L512 914.3l447.8-224-64-32L512 850.3z"></path>
              </svg>
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
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">账户组ID：</span><span className="text-gray-800 truncate pl-2">{selectedGroup.id}</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">账户组名称：</span><span className="text-gray-800 truncate pl-2">{selectedGroup.name}</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">账户类型：</span><span className="text-gray-800 truncate pl-2">{selectedGroup.accountType}</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">更新模式：</span><span className="text-gray-800 truncate pl-2">{selectedGroup.groupType === 'static' ? '静态账户组' : '动态账户组'}</span></div>

            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">创建人：</span><span className="text-gray-800 truncate pl-2">018566</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">创建日期：</span><span className="text-gray-800 truncate pl-2">{selectedGroup.createTime}</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">最新更新日期：</span><span className="text-gray-800 truncate pl-2">{selectedGroup.createTime}</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">描述：</span><span className="text-gray-800 truncate pl-2" title={selectedGroup.description || '--'}>{selectedGroup.description || '--'}</span></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedGroup.groupType === 'static' ? (
            <>
              <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="text-[#1890ff] text-lg flex items-center">
                    <svg viewBox="0 0 1024 1024" width="1.2em" height="1.2em" fill="currentColor">
                      <path d="M512 146.3l-383.8 192 383.8 192 383.8-192zM128.2 466.3l-64 32L512 722.3l447.8-224-64-32L512 658.3zM128.2 658.3l-64 32L512 914.3l447.8-224-64-32L512 850.3z"></path>
                    </svg>
                  </div>
                  <span className="font-bold text-base text-gray-800">账户列表</span>
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
                  columns={[
                    { title: '账户编码', dataIndex: 'accountId' },
                    { title: '账户名称', dataIndex: 'accountName' },
                    { title: '账户类型', dataIndex: 'accountType', render: () => '产品账户' },
                    { title: '交易系统', dataIndex: 'system' },
                    { title: '操作', key: 'action', render: () => <a className="text-[#1890ff] hover:text-[#096dd9]">移除</a>, width: 100 },
                  ]}
                  dataSource={selectedGroup.accountList || []}
                  rowKey="accountId"
                  pagination={false}
                  scroll={{ y: 'calc(100vh - 420px)' }}
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
                    <svg viewBox="0 0 1024 1024" width="1.2em" height="1.2em" fill="currentColor">
                      <path d="M512 146.3l-383.8 192 383.8 192 383.8-192zM128.2 466.3l-64 32L512 722.3l447.8-224-64-32L512 658.3zM128.2 658.3l-64 32L512 914.3l447.8-224-64-32L512 850.3z"></path>
                    </svg>
                  </div>
                  <span className="font-bold text-base text-gray-800">动态筛选条件</span>
                </div>
                <Space>
                  <Button className="bg-[#1890ff] text-white hover:!bg-[#096dd9] hover:!text-white border-none" onClick={handleEditDynamicFilter}>编辑条件</Button>
                </Space>
              </div>
              <div className="p-6 rounded-lg border border-gray-200 flex-1 overflow-y-auto bg-gray-50/50">
                {selectedGroup.filterConditions?.conditionTree ? (
                  renderSystemCards(selectedGroup.filterConditions.conditionTree, viewSelectedSystems)
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
          <TeamOutlined className="text-[#1890ff] text-xl" />
          <Title level={4} style={{ margin: 0, color: '#333' }}>账户组管理</Title>
        </div>
        <Button type="primary" icon={<PlusOutlined />} className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={handleAdd}>
          新增账户组
        </Button>
      </div>

      {/* 主体左右结构 */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* 左侧列表 */}
        <div className="w-[320px] bg-white border border-gray-200 rounded-md flex flex-col overflow-hidden shadow-sm shrink-0">
          {/* 搜索区 */}
          <div className="p-3 border-b border-gray-200 flex flex-col gap-2 shrink-0 bg-gray-50">
            <Input 
              placeholder="搜索账户组名称" 
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
        title={editingRecord ? "编辑账户组" : "新增账户组"}
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
          <Form.Item name="name" label="账户组名称" rules={[{ required: true, message: '请输入账户组名称' }]}>
            <Input placeholder="请输入账户组名称" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>

          <Form.Item 
            name="groupType" 
            label="账户组更新模式" 
            rules={[{ required: true, message: '请选择更新模式' }]}
            tooltip="静态账户组需手动维护账户列表；动态账户组通过设置条件自动筛选账户。"
          >
            <Radio.Group onChange={(e) => setFormGroupType(e.target.value)}>
              <Radio value="static">静态账户组</Radio>
              <Radio value="dynamic">动态账户组</Radio>
            </Radio.Group>
          </Form.Item>

          {formGroupType === 'dynamic' && (
            <div className="bg-blue-50/50 p-3 rounded border border-blue-100 mb-4 text-gray-500 text-sm flex items-start gap-2">
              <InfoCircleOutlined className="text-[#1890ff] mt-0.5 shrink-0" />
              <div>动态账户组的筛选条件请在创建完成后，在右侧详情面板中点击“编辑条件”进行配置。</div>
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
            selectedSystems={editSelectedSystems}
          />
        </div>
      </Modal>

      {/* 删除账户组弹窗 */}
      <Modal
        title="删除账户组"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        width={800}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <Alert
          message="删除账户组前，请先解除关联规则中绑定的账户组，否则风控规则将失效"
          type="warning"
          showIcon
          closable
          className="mb-4"
        />
        <Table
          columns={[
            { title: '账户组ID', dataIndex: 'groupId' },
            { title: '账户组名称', dataIndex: 'groupName' },
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

export default AccountGroupManagement;