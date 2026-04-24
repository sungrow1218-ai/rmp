import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Input, Select, Button, Space, Typography, Modal, Form, message, Tag, Empty, Radio, Alert, Spin } from 'antd';
import { PlusOutlined, SearchOutlined, TeamOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, PlusSquareOutlined, AppstoreFilled, IdcardOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { queryAccountGroup, queryAccountGroupDetail, alterAccountGroup, ModifyTypeEnum, queryWorkGroup, queryReferenceByRiskRule } from '@/services/api';
import { querySetOfBookbySobId, querySobIdByWorkGroupId } from '@/services/account/api';
import { useSobInfo } from '@/hooks/useSobInfo';
import { useSystemInfo, getSystemNameById } from '@/hooks/useSystemInfo';
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
  workGroupId?: number;   // 工作台ID，用于获取账套信息
  bookType?: number;      // 账户类型编码 (1:交易账户, 2:管理账户)
  bookLevel?: number;     // 账户层级编码
  accountList?: { accountId: string; accountName: string; system: string }[];
  filterConditions?: {
    conditionTree?: RuleGroup;
    rules?: any[]; // 兼容旧数据
  };
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// BookType 枚举
export enum BookTypeEnum {
  TRADE_ACCOUNT = 1,      // 交易账户
  MANAGE_ACCOUNT = 2,     // 管理账户
}

// 初始模拟数据
const initialData: AccountGroup[] = [
  {
    id: '191', name: '33333', groupType: 'static', accountType: '证券账户', controlType: '联合控制', description: '测试账户组1', createTime: '2023-10-01 10:00:00',
    workGroupId: 1001, bookType: 1, bookLevel: 1,
    accountList: [
      { accountId: 'A001', accountName: '测试账户01', system: 'O32' },
      { accountId: 'A002', accountName: '测试账户02', system: 'O45' }
    ]
  },
  {
    id: '192', name: '自营A股账户组', groupType: 'dynamic', accountType: '证券账户', controlType: '单独控制', description: '自营业务专用', createTime: '2023-10-02 11:30:00',
    workGroupId: 1002, bookType: 1, bookLevel: 2,
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
    workGroupId: 1003, bookType: 2, bookLevel: 1,
    accountList: [
      { accountId: 'P001', accountName: '量化组合A', system: '集中柜台' },
      { accountId: 'P002', accountName: '量化组合B', system: '集中柜台' }
    ]
  },
  {
    id: '194', name: '做市商账户组', groupType: 'dynamic', accountType: '证券账户', controlType: '单独控制', description: '期权做市专用', createTime: '2023-10-10 14:20:00',
    workGroupId: 1004, bookType: 1, bookLevel: 3,
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
    workGroupId: 1005, bookType: 2, bookLevel: 2,
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
  const [accountDetails, setAccountDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [workGroupList, setWorkGroupList] = useState<any[]>([]); // 工作台列表
  const [loadingWorkGroups, setLoadingWorkGroups] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AccountGroup | null>(null);
  const [form] = Form.useForm();
  const [formGroupType, setFormGroupType] = useState<'static' | 'dynamic'>('static');
  const [accountTypeOptions, setAccountTypeOptions] = useState<{ label: string; value: string }[]>([]);
  const [loadingAccountTypes, setLoadingAccountTypes] = useState(false);

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
  const [referenceRules, setReferenceRules] = useState<any[]>([]);
  const [loadingReferences, setLoadingReferences] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 使用 hooks 获取账套信息和系统信息
  const workGroupId = selectedGroup?.workGroupId;
  console.log("workGroupId for useSobInfo:", workGroupId);
  const sobInfo = useSobInfo(workGroupId);
  console.log("sobInfo from useSobInfo:", sobInfo);
  const systemInfo = useSystemInfo(0);
  console.log("systemInfo from useSystemInfo:", systemInfo);

  // 构建账户类型映射
  const acctType = useMemo(() => {
    console.log("Building acctType from sobInfo:", sobInfo);
    const result: Record<string, string> = {};

    if (!sobInfo) {
      console.log("sobInfo is undefined, returning empty acctType");
      return result;
    }

    if (!sobInfo.bookList || !Array.isArray(sobInfo.bookList)) {
      console.log("sobInfo.bookList is not an array or is empty:", sobInfo.bookList);
      return result;
    }

    console.log("Processing bookList:", sobInfo.bookList);
    sobInfo.bookList.forEach((book: any) => {
      const { bookType, bookLevelList } = book;
      console.log(`Processing bookType: ${bookType}, bookLevelList:`, bookLevelList);

      if (bookLevelList && Array.isArray(bookLevelList)) {
        bookLevelList.forEach((level: any) => {
          const key = `${bookType}|${level.bookLevel}`;
          result[key] = level.bookLevelName;
          console.log(`Added mapping: ${key} => ${level.bookLevelName}`);
        });
      }
    });

    console.log("Final acctType:", result);
    return result;
  }, [sobInfo]);

  // 加载工作台列表
  useEffect(() => {
    const fetchWorkGroups = async () => {
      setLoadingWorkGroups(true);
      try {
        const response = await queryWorkGroup({
          pageId: 1,
          pageSize: 100,
        });
        console.log('queryWorkGroup response:', response);
        if (response.code === 0 && response.data?.resultList) {
          setWorkGroupList(response.data.resultList);
        } else {
          console.error('加载工作台列表失败:', response.message);
        }
      } catch (error) {
        console.error('加载工作台列表失败:', error);
      } finally {
        setLoadingWorkGroups(false);
      }
    };
    fetchWorkGroups();
  }, []);

  // 加载账户组数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await queryAccountGroup({
          pageId: 1,
          pageSize: 20,
        });
        console.log('queryAccountGroup response:', response);
        if (response.code === 0) {
          // 根据实际接口返回数据结构，数据在 response.data.resultList 中
          const resultData = response.data?.resultList || [];
          console.log('resultData:', resultData);

          if (Array.isArray(resultData)) {
            // 映射后端数据到前端接口
            const mappedData: AccountGroup[] = resultData.map((item: any) => {
              // 转换 filterConditions 中的 conditionTree 类型（如果有）
              let filterConditions = undefined;
              if (item.filterConditions && item.filterConditions.conditionTree) {
                const conditionTree = item.filterConditions.conditionTree;
                // 确保 type 字段为 'group'
                const transformedConditionTree: RuleGroup = {
                  id: conditionTree.id || 'root',
                  type: 'group' as const,
                  logicalOperator: (conditionTree.logicalOperator === 'OR' ? 'OR' : 'AND'),
                  children: conditionTree.children?.map((child: any) => {
                    if (child.type === 'rule') {
                      return {
                        id: child.id || generateId(),
                        type: 'rule' as const,
                        field: child.field || 'system',
                        operator: (child.operator === 'not_in' ? 'not_in' : 'in') as 'in' | 'not_in',
                        values: child.values || []
                      };
                    } else {
                      // 递归处理子组
                      return {
                        id: child.id || generateId(),
                        type: 'group' as const,
                        logicalOperator: (child.logicalOperator === 'OR' ? 'OR' : 'AND'),
                        children: child.children?.map((grandChild: any) => {
                          if (grandChild.type === 'rule') {
                            return {
                              id: grandChild.id || generateId(),
                              type: 'rule' as const,
                              field: grandChild.field || 'system',
                              operator: (grandChild.operator === 'not_in' ? 'not_in' : 'in') as 'in' | 'not_in',
                              values: grandChild.values || []
                            };
                          } else {
                            // 简化处理，不再深入嵌套
                            return {
                              id: grandChild.id || generateId(),
                              type: 'group' as const,
                              logicalOperator: 'AND',
                              children: []
                            };
                          }
                        }) || []
                      };
                    }
                  }) || []
                };
                filterConditions = {
                  conditionTree: transformedConditionTree,
                  rules: item.filterConditions.rules || []
                };
              }

              // 处理 dynamicFlag 为 null 的情况，默认为静态账户组
              const groupType = item.dynamicFlag === 0 || item.dynamicFlag === null ? 'static' : 'dynamic';

              return {
                id: item.accountGroupId?.toString() || item.id || '',
                name: item.accountGroupName || item.name || '',
                groupType: groupType,
                accountType: item.bookType === 1 ? '证券账户' : '投资组合', // 临时映射，后面会用 acctType 替换
                controlType: '单独控制', // 默认值
                description: item.remark || '',
                createTime: item.createDateTime || item.lastUpdateTime || '',
                workGroupId: item.workGroupId,
                bookType: item.bookType,
                bookLevel: item.bookLevel,
                accountList: item.accountList || [],
                filterConditions,
              };
            });
            setData(mappedData);
            if (mappedData.length > 0 && !selectedGroup) {
              setSelectedGroup(mappedData[0]);
            }
          } else {
            console.error('response.data.resultList 不是数组:', resultData);
            message.error('接口返回数据格式错误');
          }
        } else {
          message.error(`加载账户组列表失败: ${response.message}`);
        }
      } catch (error) {
        console.error('加载账户组列表失败:', error);
        message.error('加载账户组列表失败，请检查网络连接');
      }
    };
    fetchData();
  }, []);

  // 默认选中第一条（当数据变化时）
  useEffect(() => {
    if (data.length > 0 && !selectedGroup) {
      setSelectedGroup(data[0]);
    }
  }, [data, selectedGroup]);

  // 加载账户组明细数据
  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!selectedGroup || selectedGroup.groupType !== 'static') {
        setAccountDetails([]);
        return;
      }
      setLoadingDetails(true);
      try {
        const params = {
          filterCondition: {
            accountGroupId: Number(selectedGroup.id),
            // accountName 和 accountCode 可选，暂不传
          },
          pageId: 1,
          pageSize: 1000,
        };
        console.log('queryAccountGroupDetail 请求参数:', params);
        const response = await queryAccountGroupDetail(params);
        console.log('queryAccountGroupDetail 响应:', response);
        if (response.code === 0) {
          const resultList = response.data?.resultList || [];
          // 映射后端数据到前端表格所需格式
          const mappedDetails = resultList.map((item: any) => ({
            accountId: item.accountId || item.accountCode,
            accountName: item.accountName || item.accountName,
            system: item.system || item.tradeSystemId,
            accountType: item.accountType || '产品账户',
          }));
          setAccountDetails(mappedDetails);
        } else {
          console.error('接口返回错误:', response);
          message.error(`加载账户组明细失败: ${response.message}`);
          setAccountDetails([]);
        }
      } catch (error: any) {
        console.error('加载账户组明细失败，错误详情:', error);
        console.error('错误堆栈:', error.stack);
        // 尝试从错误对象中提取更多信息
        if (error.message) {
          message.error(`加载账户组明细失败: ${error.message}`);
        } else {
          message.error('加载账户组明细失败，请检查网络连接');
        }
        setAccountDetails([]);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchAccountDetails();
  }, [selectedGroup]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setFormGroupType('static');
    form.setFieldsValue({ groupType: 'static' });
    // 加载账户类型选项
    loadAccountTypeOptions();
    setIsModalVisible(true);
  };

  const handleEdit = (record: AccountGroup) => {
    setEditingRecord(record);
    setFormGroupType(record.groupType);

    const formValues: any = {
      ...record,
      accountList: record.accountList?.map(a => a.accountId)
    };

    // 只有静态账户组才设置账户类型字段
    if (record.groupType === 'static') {
      // 构建账户类型字段值
      const accountTypeValue = record.bookType !== undefined && record.bookLevel !== undefined
        ? `${record.bookType}|${record.bookLevel}`
        : undefined;
      formValues.accountType = accountTypeValue;
    }

    form.setFieldsValue(formValues);
    // 加载账户类型选项
    loadAccountTypeOptions();
    setIsModalVisible(true);
  };

  // 处理删除点击
  const handleDeleteClick = async (group: AccountGroup) => {
    setGroupToDelete(group);
    setIsDeleteModalVisible(true);

    // 查询引用规则
    setLoadingReferences(true);
    try {
      const response = await queryReferenceByRiskRule({
        accountGroupId: Number(group.id)
      });
      console.log('查询引用规则响应:', response);

      if (response.code === 0 && response.data?.resultList) {
        setReferenceRules(response.data.resultList);
      } else {
        setReferenceRules([]);
        console.error('查询引用规则失败:', response.message);
      }
    } catch (error) {
      console.error('查询引用规则失败:', error);
      setReferenceRules([]);
    } finally {
      setLoadingReferences(false);
    }
  };

  // 确认删除
  const confirmDelete = async () => {
    if (!groupToDelete) return;

    setDeleting(true);
    try {
      // 调用删除接口
      const params = {
        modifyType: ModifyTypeEnum.DELETE,
        workGroupId: groupToDelete.workGroupId || 1,
        accountGroupId: Number(groupToDelete.id),
        accountGroupName: groupToDelete.name,
        bookType: (groupToDelete.bookType || 1).toString(),
        bookLevel: (groupToDelete.bookLevel || 1).toString(),
        remark: groupToDelete.description || ''
      };

      console.log('调用删除接口，参数:', params);
      const response = await alterAccountGroup(params);
      console.log('删除接口响应:', response);

      if (response.code === 0) {
        // 更新本地数据
        setData(prev => prev.filter(item => item.id !== groupToDelete.id));
        if (selectedGroup?.id === groupToDelete.id) {
          setSelectedGroup(null);
        }

        message.success('删除成功');
        setIsDeleteModalVisible(false);
        setGroupToDelete(null);
        setReferenceRules([]);

        // 重新加载数据
        const fetchData = async () => {
          try {
            const response = await queryAccountGroup({
              pageId: 1,
              pageSize: 20,
            });
            if (response.code === 0 && response.data?.resultList) {
              const mappedData: AccountGroup[] = response.data.resultList.map((item: any) => ({
                id: item.accountGroupId?.toString() || '',
                name: item.accountGroupName || '',
                groupType: item.dynamicFlag === 0 || item.dynamicFlag === null ? 'static' : 'dynamic',
                accountType: item.bookType === 1 ? '证券账户' : '投资组合',
                controlType: '单独控制',
                description: item.remark || '',
                createTime: item.createDateTime || item.lastUpdateTime || '',
                workGroupId: item.workGroupId,
                bookType: item.bookType,
                bookLevel: item.bookLevel,
                accountList: item.accountList || [],
              }));
              setData(mappedData);
            }
          } catch (error) {
            console.error('重新加载数据失败:', error);
          }
        };
        fetchData();
      } else {
        message.error(`删除失败: ${response.message}`);
      }
    } catch (error: any) {
      console.error('删除账户组失败:', error);
      message.error(`删除账户组失败: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('表单验证通过，values:', values);

      // 解析账户类型字段
      let bookType: number | undefined;
      let bookLevel: number | undefined;

      if (values.accountType) {
        const [typeStr, levelStr] = values.accountType.split('|');
        bookType = parseInt(typeStr, 10);
        bookLevel = parseInt(levelStr, 10);
        console.log('解析账户类型:', values.accountType, '=> bookType:', bookType, 'bookLevel:', bookLevel);
      }

      // 准备调用后端接口的参数
      const params: any = {
        accountGroupName: values.name,
        remark: values.description || '',
        workGroupId: editingRecord?.workGroupId || selectedGroup?.workGroupId || 1, // 默认工作台ID
      };

      // 只有静态账户组才需要 bookType 和 bookLevel
      if (values.groupType === 'static') {
        if (bookType !== undefined && bookLevel !== undefined) {
          params.bookType = bookType;
          params.bookLevel = bookLevel;
        } else {
          // 如果没有选择账户类型，使用默认值或编辑记录的值
          params.bookType = editingRecord?.bookType || selectedGroup?.bookType || 1;
          params.bookLevel = editingRecord?.bookLevel || selectedGroup?.bookLevel || 1;
        }
      }

      if (editingRecord) {
        // 编辑模式
        params.modifyType = ModifyTypeEnum.EDIT;
        params.accountGroupId = Number(editingRecord.id);
        console.log('编辑账户组，参数:', params);

        try {
          const response = await alterAccountGroup(params);
          console.log('编辑账户组响应:', response);

          if (response.code === 0) {
            // 更新本地数据
            const updatedRecord = {
              ...editingRecord,
              name: values.name,
              description: values.description,
              groupType: values.groupType,
              bookType: bookType !== undefined ? bookType : editingRecord?.bookType,
              bookLevel: bookLevel !== undefined ? bookLevel : editingRecord?.bookLevel,
            } as AccountGroup;

            setData(prev => prev.map(item => item.id === editingRecord.id ? updatedRecord : item));
            if (selectedGroup?.id === editingRecord.id) {
              setSelectedGroup(updatedRecord);
            }
            message.success('修改成功');
            setIsModalVisible(false);

            // 重新加载数据
            const fetchData = async () => {
              try {
                const response = await queryAccountGroup({
                  pageId: 1,
                  pageSize: 20,
                });
                if (response.code === 0 && response.data?.resultList) {
                  const mappedData: AccountGroup[] = response.data.resultList.map((item: any) => ({
                    id: item.accountGroupId?.toString() || '',
                    name: item.accountGroupName || '',
                    groupType: item.dynamicFlag === 0 || item.dynamicFlag === null ? 'static' : 'dynamic',
                    accountType: item.bookType === 1 ? '证券账户' : '投资组合',
                    controlType: '单独控制',
                    description: item.remark || '',
                    createTime: item.createDateTime || item.lastUpdateTime || '',
                    workGroupId: item.workGroupId,
                    bookType: item.bookType,
                    bookLevel: item.bookLevel,
                    accountList: item.accountList || [],
                  }));
                  setData(mappedData);
                }
              } catch (error) {
                console.error('重新加载数据失败:', error);
              }
            };
            fetchData();
          } else {
            message.error(`修改失败: ${response.message}`);
          }
        } catch (error: any) {
          console.error('编辑账户组失败:', error);
          message.error(`编辑账户组失败: ${error.message}`);
        }
      } else {
        // 新增模式
        params.modifyType = ModifyTypeEnum.ADD;
        console.log('新增账户组，参数:', params);

        try {
          const response = await alterAccountGroup(params);
          console.log('新增账户组响应:', response);

          if (response.code === 0) {
            message.success('新增成功');
            setIsModalVisible(false);

            // 重新加载数据
            const fetchData = async () => {
              try {
                const response = await queryAccountGroup({
                  pageId: 1,
                  pageSize: 20,
                });
                if (response.code === 0 && response.data?.resultList) {
                  const mappedData: AccountGroup[] = response.data.resultList.map((item: any) => ({
                    id: item.accountGroupId?.toString() || '',
                    name: item.accountGroupName || '',
                    groupType: item.dynamicFlag === 0 || item.dynamicFlag === null ? 'static' : 'dynamic',
                    accountType: item.bookType === 1 ? '证券账户' : '投资组合',
                    controlType: '单独控制',
                    description: item.remark || '',
                    createTime: item.createDateTime || item.lastUpdateTime || '',
                    workGroupId: item.workGroupId,
                    bookType: item.bookType,
                    bookLevel: item.bookLevel,
                    accountList: item.accountList || [],
                  }));
                  setData(mappedData);

                  // 选中新增的账户组
                  if (response.data.resultList.length > 0) {
                    const newItem = response.data.resultList[0];
                    const newAccountGroup: AccountGroup = {
                      id: newItem.accountGroupId?.toString() || '',
                      name: newItem.accountGroupName || '',
                      groupType: newItem.dynamicFlag === 0 || newItem.dynamicFlag === null ? 'static' : 'dynamic',
                      accountType: newItem.bookType === 1 ? '证券账户' : '投资组合',
                      controlType: '单独控制',
                      description: newItem.remark || '',
                      createTime: newItem.createDateTime || newItem.lastUpdateTime || '',
                      workGroupId: newItem.workGroupId,
                      bookType: newItem.bookType,
                      bookLevel: newItem.bookLevel,
                      accountList: newItem.accountList || [],
                    };
                    setSelectedGroup(newAccountGroup);
                  }
                }
              } catch (error) {
                console.error('重新加载数据失败:', error);
              }
            };
            fetchData();
          } else {
            message.error(`新增失败: ${response.message}`);
          }
        } catch (error: any) {
          console.error('新增账户组失败:', error);
          message.error(`新增账户组失败: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 加载账户类型选项
  const loadAccountTypeOptions = async () => {
    setLoadingAccountTypes(true);
    try {
      // 获取工作台ID，优先使用编辑记录的工作台ID，否则使用选中记录的工作台ID
      const workGroupId = editingRecord?.workGroupId || selectedGroup?.workGroupId;

      if (!workGroupId) {
        console.log('没有工作台ID，无法加载账户类型选项');
        setAccountTypeOptions([]);
        return;
      }

      // 通过 workGroupId 获取 sobId
      const resWorkGroup = await querySobIdByWorkGroupId(workGroupId);
      if (resWorkGroup.code !== 0 || !resWorkGroup.data?.resultList?.[0]?.sobId) {
        console.error('获取工作台信息失败');
        setAccountTypeOptions([]);
        return;
      }

      const sobId = resWorkGroup.data.resultList[0].sobId;

      // 通过 sobId 获取账套信息
      const resSob = await querySetOfBookbySobId(sobId);
      if (resSob.code !== 0 || !resSob.data?.resultList?.[0]?.bookList) {
        console.error('获取账套信息失败');
        setAccountTypeOptions([]);
        return;
      }

      const sobInfo = resSob.data.resultList[0];
      const options: { label: string; value: string }[] = [];

      // 遍历账套的账户类型和层级
      sobInfo.bookList.forEach((book: any) => {
        const { bookType, bookLevelList } = book;

        if (bookLevelList && Array.isArray(bookLevelList)) {
          bookLevelList.forEach((level: any) => {
            const key = `${bookType}|${level.bookLevel}`;
            options.push({
              label: level.bookLevelName,
              value: key
            });
          });
        }
      });

      setAccountTypeOptions(options);
      console.log('加载的账户类型选项:', options);
    } catch (error) {
      console.error('加载账户类型选项失败:', error);
      setAccountTypeOptions([]);
    } finally {
      setLoadingAccountTypes(false);
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

    // 获取账户类型名称
    const getAccountTypeName = (group: AccountGroup) => {
      console.log("Getting account type name for group:", group);
      console.log("acctType in getAccountTypeName:", acctType);

      if (group.bookType !== undefined && group.bookLevel !== undefined) {
        const key = `${group.bookType}|${group.bookLevel}`;
        console.log(`Looking up key: ${key} in acctType`);
        const name = acctType[key] || group.accountType || '--';
        console.log(`Found account type name: ${name}`);
        return name;
      }

      const fallbackName = group.accountType || '--';
      console.log(`Using fallback account type name: ${fallbackName}`);
      return fallbackName;
    };

    const accountTypeName = getAccountTypeName(selectedGroup);
    console.log("Final accountTypeName for display:", accountTypeName);

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
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteClick(selectedGroup)}>删除</Button>
          </Space>
        </div>

        <div className="mb-8 shrink-0 border-b border-gray-100 pb-8 px-4">
          <div className="grid grid-cols-4 gap-y-6 gap-x-4 text-sm">
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">账户组ID：</span><span className="text-gray-800 truncate pl-2">{selectedGroup.id}</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">账户组名称：</span><span className="text-gray-800 truncate pl-2">{selectedGroup.name}</span></div>
            <div className="flex"><span className="text-gray-500 shrink-0 w-24 text-right">账户类型：</span><span className="text-gray-800 truncate pl-2">{accountTypeName}</span></div>
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
                {loadingDetails ? (
                  <div className="flex justify-center items-center h-40">
                    <Spin tip="加载中..." />
                  </div>
                ) : (
                  <Table
                    size="middle"
                    rowSelection={{ type: 'checkbox' }}
                    columns={[
                      { title: '账户编码', dataIndex: 'accountId' },
                      { title: '账户名称', dataIndex: 'accountName' },
                      { title: '账户类型', dataIndex: 'accountType', render: (_, record) => {
                          // 如果账户列表中的账户有独立的 bookType 和 bookLevel，使用它们
                          // 否则使用账户组的 bookType 和 bookLevel
                          const bookType = record.bookType || selectedGroup?.bookType;
                          const bookLevel = record.bookLevel || selectedGroup?.bookLevel;
                          if (bookType !== undefined && bookLevel !== undefined) {
                            const key = `${bookType}|${bookLevel}`;
                            return acctType[key] || '产品账户';
                          }
                          return '产品账户';
                        } },
                      { title: '交易系统', dataIndex: 'system', render: (value, record) => {
                          console.log('渲染交易系统列 - value:', value, 'record:', record, 'systemInfo length:', systemInfo?.length);

                          // 使用 getSystemNameById 将系统ID转换为系统名称
                          if (value && systemInfo) {
                            // 尝试将值转换为数字
                            const systemId = Number(value);
                            console.log('转换后的 systemId:', systemId, '原始值:', value, 'isNaN:', isNaN(systemId));

                            if (!isNaN(systemId)) {
                              // 打印 systemInfo 中的前几个项目，查看字段结构
                              if (systemInfo.length > 0) {
                                console.log('systemInfo 样本项目:', systemInfo.slice(0, 3).map(item => ({
                                  tradeSystemId: item.tradeSystemId,
                                  tradeSystemName: item.tradeSystemName,
                                  sobId: item.sobId
                                })));
                              }

                              const systemName = getSystemNameById(systemId, systemInfo);
                              console.log('getSystemNameById 调用结果 - systemId:', systemId, 'systemName:', systemName);

                              // 如果找到了系统名称，返回它；否则返回原始值
                              const result = systemName !== '未知系统' ? systemName : value;
                              console.log('最终显示结果:', result);
                              return result;
                            }
                          }
                          console.log('使用默认值:', value || '--');
                          return value || '--';
                        } },
                      { title: '操作', key: 'action', render: () => <a className="text-[#1890ff] hover:text-[#096dd9]">移除</a>, width: 100 },
                    ]}
                    dataSource={accountDetails}
                    rowKey="accountId"
                    pagination={false}
                    scroll={{ y: 'calc(100vh - 420px)' }}
                    locale={{
                      emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
                    }}
                    className="custom-table"
                  />
                )}
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
            <Radio.Group onChange={(e) => {
              const newType = e.target.value;
              setFormGroupType(newType);
              // 如果切换到静态账户组，加载账户类型选项
              if (newType === 'static') {
                loadAccountTypeOptions();
              }
            }}>
              <Radio value="static">静态账户组</Radio>
              <Radio value="dynamic">动态账户组</Radio>
            </Radio.Group>
          </Form.Item>

          {formGroupType === 'static' && (
            <>
              <Form.Item
                name="accountType"
                label="账户类型"
                rules={[{ required: true, message: '请选择账户类型' }]}
                tooltip="选择当前账套下的账户层级"
              >
                <Select
                  placeholder="请选择账户类型"
                  loading={loadingAccountTypes}
                  options={accountTypeOptions}
                  disabled={loadingAccountTypes || !!editingRecord}
                />
              </Form.Item>
            </>
          )}

          {formGroupType === 'dynamic' && (
            <div className="bg-blue-50/50 p-3 rounded border border-blue-100 mb-4 text-gray-500 text-sm flex items-start gap-2">
              <InfoCircleOutlined className="text-[#1890ff] mt-0.5 shrink-0" />
              <div>动态账户组的筛选条件请在创建完成后，在右侧详情面板中点击"编辑条件"进行配置。</div>
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
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setReferenceRules([]);
          setGroupToDelete(null);
          setDeleting(false);
        }}
        width={800}
        okText="确定"
        cancelText="取消"
        okButtonProps={{
          danger: true,
          disabled: referenceRules.length > 0 || deleting,
          loading: deleting
        }}
        destroyOnClose
      >
        <Alert
          message="删除账户组前，请先解除关联规则中绑定的账户组，否则风控规则将失效"
          type="warning"
          showIcon
          closable
          className="mb-4"
        />

        {loadingReferences ? (
          <div className="flex justify-center items-center h-40">
            <Spin tip="正在检查引用规则..." />
          </div>
        ) : referenceRules.length > 0 ? (
          <>
            <div className="mb-3 text-red-500 text-sm">
              该账户组被以下规则引用，请先解除关联：
            </div>
            <Table
              columns={[
                { title: '规则编号', dataIndex: 'ruleNo', key: 'ruleNo' },
                { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName' },
                {
                  title: '规则状态',
                  dataIndex: 'ruleStatus',
                  key: 'ruleStatus',
                  render: (status) => {
                    const statusMap: Record<string, { text: string, color: string }> = {
                      '1': { text: '启用', color: 'green' },
                      '0': { text: '停用', color: 'red' },
                      '2': { text: '草稿', color: 'blue' },
                    };
                    const info = statusMap[status] || { text: status, color: 'default' };
                    return <Tag color={info.color}>{info.text}</Tag>;
                  }
                },
                {
                  title: '审批状态',
                  dataIndex: 'approvalStatus',
                  key: 'approvalStatus',
                  render: (status) => {
                    const statusMap: Record<string, { text: string, color: string }> = {
                      '1': { text: '已审批', color: 'green' },
                      '0': { text: '待审批', color: 'orange' },
                      '2': { text: '审批中', color: 'blue' },
                      '3': { text: '已驳回', color: 'red' },
                    };
                    const info = statusMap[status] || { text: status, color: 'default' };
                    return <Tag color={info.color}>{info.text}</Tag>;
                  }
                },
              ]}
              dataSource={referenceRules}
              pagination={false}
              size="middle"
              rowKey="ruleNo"
              className="custom-table"
            />
          </>
        ) : (
          <div className="text-green-500 text-sm mb-4">
            ✓ 该账户组未被任何规则引用，可以安全删除。
          </div>
        )}

        {groupToDelete && (
          <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">将要删除的账户组信息：</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">账户组ID：</span>{groupToDelete.id}</div>
              <div><span className="text-gray-500">账户组名称：</span>{groupToDelete.name}</div>
              <div><span className="text-gray-500">账户组类型：</span>{groupToDelete.groupType === 'static' ? '静态账户组' : '动态账户组'}</div>
              <div><span className="text-gray-500">工作台ID：</span>{groupToDelete.workGroupId || '--'}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AccountGroupManagement;














