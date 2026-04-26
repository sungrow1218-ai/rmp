import React, { useState, lazy, Suspense, useEffect, useMemo, useRef, useCallback } from 'react';
import { Table, Input, Select, Button, Space, Typography, Card, Tag, Tree, Spin, message, Modal, Tabs, Descriptions, Tag as AntTag } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined, LineChartOutlined, ArrowLeftOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import {
  queryRuleTemplateGroup,
  RuleTemplateGroupIDTO,
  RuleTemplateGroupStatus,
  queryRuleTemplateDefaultConfiguration,
  queryAccountGroupRelation,
  queryRuleTemplate
} from '@/services/api';
import {
  RuleTypeTemplate,
  RuleTemplateDefaultIDTO,
  RuleTemplateIDTO,
  mergeDefaultParamAndValue,
  EffectiveFlag
} from '@/services/ruleTemplateTypes';
import {
  validateRuleTemplateData,
  fixRuleTemplateData,
  createFallbackTemplateData,
  checkApiResponse
} from '@/services/ruleTemplateDataValidator';
import { RiskLevel } from '@/services/ruleTemplateTypes';
import useWorkGroup from '@/hooks/useWorkGroup';

const { Title, Text } = Typography;

// 懒加载内嵌组件
const RuleCreate = lazy(() => import('../rule/RuleCreate'));
const RuleEdit = lazy(() => import('../rule/RuleEdit'));
const RuleView = lazy(() => import('../rule/RuleView'));
const SingleRuleCreate = lazy(() => import('../rule/SingleRuleCreate'));
const SingleRuleEdit = lazy(() => import('../rule/SingleRuleEdit'));
const SingleRuleView = lazy(() => import('../rule/SingleRuleView'));

// 规则模板配置查看组件
const RuleTemplateConfigView = lazy(() => import('@/components/RuleTemplateConfigViewNew'));

interface RuleRecord {
  id: string;
  ruleTmplGroupId: number;
  ruleTmplGroupName: string;
  description?: string;
  workGroupId: number;
  status: number;
  ruleTemplateList: { ruleTemplateId: number; ruleType: string }[];
  createRoleId: number;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
}


interface SingleRuleRecord {
  id: string;
  ruleNo: string;
  ruleType: string;
  ruleName: string;
  status: 'enabled' | 'disabled';
  priority: number;
  accountControlType: string;
  jointControlMode: string;
  securityControlMethod: string;
  securitySummaryMethod: string;
  creator: string;
  modifier: string;
  createTime: string;
  updateTime: string;
}

const mockSingleData: SingleRuleRecord[] = [
  {
    id: 'S1',
    ruleNo: '30736',
    ruleType: '连续竞价阶段拉抬打压控制',
    ruleName: 'issuer',
    status: 'enabled',
    priority: 5,
    accountControlType: '对接系统',
    jointControlMode: '单独控制',
    securityControlMethod: '证券类别',
    securitySummaryMethod: '分组计算',
    creator: '018566',
    modifier: '018566',
    createTime: '2026-02-12 12:00:00',
    updateTime: '2026-02-12 14:30:00',
  },
  {
    id: 'S2',
    ruleNo: '30721',
    ruleType: '连续竞价阶段拉抬打压控制',
    ruleName: '咨询解耦测试16',
    status: 'enabled',
    priority: 5,
    accountControlType: '证券账户',
    jointControlMode: '单独控制',
    securityControlMethod: '动态维度',
    securitySummaryMethod: '单独计算',
    creator: '018566',
    modifier: '018566',
    createTime: '2026-02-11 15:00:00',
    updateTime: '2026-02-11 16:20:00',
  },
  {
    id: 'S3',
    ruleNo: '30718',
    ruleType: '连续竞价阶段拉抬打压控制',
    ruleName: 'testA',
    status: 'enabled',
    priority: 5,
    accountControlType: '对接系统',
    jointControlMode: '单独控制',
    securityControlMethod: '证券类别',
    securitySummaryMethod: '单独计算',
    creator: '018566',
    modifier: '018566',
    createTime: '2026-02-11 13:00:00',
    updateTime: '2026-02-11 13:45:00',
  },
  {
    id: 'S4',
    ruleNo: '5341',
    ruleType: '连续竞价阶段拉抬打压控制',
    ruleName: 'test09-5',
    status: 'enabled',
    priority: 5,
    accountControlType: '对接系统',
    jointControlMode: '单独控制',
    securityControlMethod: '证券类别',
    securitySummaryMethod: '单独计算',
    creator: '019330',
    modifier: '018566',
    createTime: '2025-09-05 10:00:00',
    updateTime: '2025-09-06 09:15:00',
  }
];

// 模拟规则树数据
const treeData = [
  {
    title: '异常交易类',
    key: '0-0',
    children: [
      {
        title: '拉抬打压',
        key: '0-0-0',
        children: [
          { title: '连续竞价阶段拉抬打压控制', key: '0-0-0-0' },
        ],
      },
      {
        title: '自买自卖',
        key: '0-0-1',
        children: [
          { title: '同账户自买自卖', key: '0-0-1-0' },
          { title: '跨账户自买自卖', key: '0-0-1-1' },
        ],
      },
      {
        title: '频繁撤单',
        key: '0-0-2',
        children: [
          { title: '日内频繁撤单', key: '0-0-2-0' },
          { title: '大额频繁撤单', key: '0-0-2-1' },
        ],
      },
      {
        title: '虚假申报',
        key: '0-0-3',
        children: [
          { title: '开盘集合竞价阶段虚假申报', key: '0-0-3-0' },
        ],
      },
    ],
  },
  {
    title: '集中度类',
    key: '0-1',
    children: [
      {
        title: '个股集中度',
        key: '0-1-0',
        children: [
          { title: '单只股票持仓占比', key: '0-1-0-0' },
          { title: '单只股票流通股占比', key: '0-1-0-1' },
        ],
      },
      {
        title: '行业集中度',
        key: '0-1-1',
        children: [
          { title: '单一行业持仓占比', key: '0-1-1-0' },
        ],
      },
    ],
  },
];

// 简单的错误边界组件
const RuleSettingsErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error('捕获到全局错误:', event.error);
      setHasError(true);
      setError(event.error);
    };

    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      console.error('捕获到未处理的Promise拒绝:', event.reason);
      setHasError(true);
      setError(new Error(`Promise拒绝: ${event.reason}`));
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', unhandledRejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#ff4d4f' }}>
        <h2>组件加载失败</h2>
        <p>规则设置页面暂时无法加载，请稍后重试。</p>
        {error && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
            <details>
              <summary>错误详情</summary>
              <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                {error.message}
              </pre>
            </details>
          </div>
        )}
        <button
          onClick={() => {
            setHasError(false);
            setError(null);
            window.location.reload();
          }}
          style={{ marginTop: '20px', padding: '8px 16px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          重新加载
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export const RuleSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [activeCard, setActiveCard] = useState<'single' | 'template'>('single');
  // 内嵌视图状态
  const [embeddedView, setEmbeddedView] = useState<'none' | 'create' | 'edit' | 'view'>('none');
  const [embeddedType, setEmbeddedType] = useState<'single' | 'template'>('single');
  const [embeddedId, setEmbeddedId] = useState<string>('');
  // 模板组数据
  const [templateData, setTemplateData] = useState<RuleRecord[]>([]);
  const [templatePagination, setTemplatePagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({
    ruleTmplGroupId: undefined as number | undefined,
    ruleTmplGroupName: undefined as string | undefined,
    status: undefined as number | undefined,
    createUserCode: undefined as string | undefined,
  });
  const navigate = useNavigate();

  // 获取工作台信息
  const { activeWorkGroup, loading: workGroupGroupLoading } = useWorkGroup();

  // 查看相关状态
  const [viewingRecord, setViewingRecord] = useState<RuleRecord | null>(null);
  const [ruleConfigLoading, setRuleConfigLoading] = useState(false);
  const [accountGroupLoading, setAccountGroupLoading] = useState(false);
  const [ruleConfigData, setRuleConfigData] = useState<{ configuration: string; ruleType: string }[]>([]);
  const [accountGroupData, setAccountGroupData] = useState<any[]>([]);
  const [ruleTemplateMap, setRuleTemplateMap] = useState<{ [key: string]: RuleTypeTemplate }>({});
  const [activeTabKey, setActiveTabKey] = useState('ruleConfig');

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  // 使用 ref 来存储搜索参数，避免在 useCallback 依赖项中
  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  // 获取模板组数据
  const fetchTemplateData = useCallback(async (params?: any) => {
    setTemplateLoading(true);
    try {
      // 使用传入的参数或默认值，不依赖 templatePagination 状态
      const pageId = params?.pageId || 1;
      const pageSize = params?.pageSize || 10;

      // 构建 filterCondition，合并搜索参数和工作台ID
      const filterCondition: any[] = [];

      // 合并搜索参数和传入的参数
      const mergedParams = {
        ...searchParamsRef.current,
        ...(params || {}),
      };

      // 始终包含工作台ID
      if (activeWorkGroup?.workGroupId) {
        mergedParams.workGroupId = activeWorkGroup.workGroupId;
      }

      // 如果有任何参数，添加到 filterCondition
      if (Object.keys(mergedParams).length > 0) {
        filterCondition.push(mergedParams);
      }

      const currentParams = {
        pageId: 1, // 总是从第一页开始，因为我们要获取所有数据
        pageSize: 5000, // 根据需求，查询5000条数据
        filterCondition: filterCondition.length > 0 ? filterCondition : undefined,
      };

      console.log('📡 发送查询模板组请求:', currentParams);

      const res = await queryRuleTemplateGroup(currentParams);

      console.log('📡 收到模板组响应:', res);

      if (res && res.errorId === 0) {
        // 转换数据格式以匹配前端表格
        const resultList = res.data?.resultList || [];
        const transformedData = resultList.map((item: RuleTemplateGroupIDTO) => ({
          id: `R${item.ruleTmplGroupId}`,
          ruleTmplGroupId: item.ruleTmplGroupId,
          ruleTmplGroupName: item.ruleTmplGroupName,
          description: item.description,
          workGroupId: item.workGroupId,
          status: item.status,
          ruleTemplateList: item.ruleTemplateList || [],
          createRoleId: item.createRoleId,
          createUserCode: item.createUserCode,
          updateUserCode: item.updateUserCode,
          createTime: item.createTime,
          lastUpdateTime: item.lastUpdateTime,
        }));

        setTemplateData(transformedData);
        // 由于我们请求了5000条数据，前端分页基于实际获取的数据
        setTemplatePagination({
          current: 1,
          pageSize: 10, // 前端默认显示10条
          total: transformedData.length, // 总数为实际获取的数据量
        });
      } else {
        const errorMsg = res?.errorMessage || res?.message || '获取模板组数据失败';
        console.error('获取模板组数据失败:', errorMsg, res);
        message.error(errorMsg);
      }
    } catch (error: any) {
      console.error('获取模板组数据异常:', error);
      message.error(`获取模板组数据失败: ${error.message || '未知错误'}`);
      // 设置空数据，避免页面崩溃
      setTemplateData([]);
      setTemplatePagination({
        current: 1,
        pageSize: 10,
        total: 0,
      });
    } finally {
      setTemplateLoading(false);
    }
  }, [activeWorkGroup]); // 依赖 activeWorkGroup，当工作台变化时重新获取数据

  // 初始化加载模板组数据
  useEffect(() => {
    if (activeCard === 'template') {
      fetchTemplateData();
    }
  }, [activeCard, fetchTemplateData]);

  // 当工作台变化时，重新获取模板组数据
  useEffect(() => {
    if (activeCard === 'template' && activeWorkGroup) {
      fetchTemplateData();
    }
  }, [activeWorkGroup, activeCard, fetchTemplateData]);

  const handleCreate = () => {
    if (activeCard === 'single') {
      // 打开内嵌创建视图（单个规则）
      setEmbeddedType('single');
      setEmbeddedView('create');
    } else {
      // 打开内嵌创建视图（模板）
      setEmbeddedType('template');
      setEmbeddedView('create');
    }
  };

  const handleCloseEmbedded = () => {
    setEmbeddedView('none');
    setEmbeddedId('');
    // 清理查看相关数据
    setViewingRecord(null);
    setRuleConfigData([]);
    setAccountGroupData([]);
    setRuleTemplateMap({});
  };

  const handleView = (id: string, type: 'single' | 'template') => {
    setEmbeddedType(type);
    setEmbeddedId(id);
    setEmbeddedView('view');

    // 如果是模板类型，加载规则配置和关联账户组数据
    if (type === 'template') {
      const record = templateData.find(item => item.id === id);
      if (record) {
        setViewingRecord(record);
        loadRuleConfigData(record);
        loadAccountGroupData(record);
      }
    }
  };

  const handleEdit = (id: string, type: 'single' | 'template') => {
    setEmbeddedType(type);
    setEmbeddedId(id);
    setEmbeddedView('edit');
  };

  // 加载规则配置数据
  const loadRuleConfigData = async (record: RuleRecord) => {
    if (!record.ruleTemplateList || record.ruleTemplateList.length === 0) {
      setRuleConfigData([]);
      setRuleTemplateMap({});
      return;
    }

    setRuleConfigLoading(true);
    try {
      const ruleTypes = record.ruleTemplateList.map(item => item.ruleType);

      // 1. 查询默认配置
      console.log('查询规则模板默认配置，规则类型:', ruleTypes);
      const defaultRes = await queryRuleTemplateDefaultConfiguration(ruleTypes);

      // 2. 查询已有配置
      let templateRes;
      if (record) {
        console.log('📤 查询已有配置，参数:', {
          pageId: 1,
          pageSize: 1000,
          authorityFlag: 0,
          filterCondition: [{ ruleTmplGroupId: record.ruleTmplGroupId }],
        });
        templateRes = await queryRuleTemplate({
          pageId: 1,
          pageSize: 1000,
          authorityFlag: 0,
          filterCondition: [{ ruleTmplGroupId: record.ruleTmplGroupId }],
        });
        console.log('📥 已有配置响应:', templateRes);
        console.log('📥 响应数据详情:', {
          errorId: templateRes?.errorId,
          errorMessage: templateRes?.errorMessage,
          hasData: !!templateRes?.data,
          dataKeys: templateRes?.data ? Object.keys(templateRes.data) : [],
          resultListLength: templateRes?.data?.resultList?.length || 0,
          resultList: templateRes?.data?.resultList || []
        });
      }

      // 检查接口数据是否有效
      const isDefaultApiValid = checkApiResponse(defaultRes, 'queryRuleTemplateDefaultConfiguration');
      const isTemplateApiValid = templateRes ? checkApiResponse(templateRes, 'queryRuleTemplate') : true;

      console.log('接口有效性检查:', {
        defaultApi: isDefaultApiValid,
        templateApi: isTemplateApiValid
      });

      if (!isDefaultApiValid || !isTemplateApiValid) {
        console.error('接口响应数据无效，创建回退数据用于展示');
      }

      // 合并模板+已有配置
      const result: {
        [key: string]: RuleTypeTemplate;
      } = {};

      // 如果有默认配置数据，处理每个规则类型
      if (defaultRes.data?.resultList?.length > 0) {
        for (const item of defaultRes.data.resultList) {
          try {
            console.log(`🔍 处理规则类型 ${item.ruleType}`);

            const templateData =
              templateRes?.data?.resultList?.find(
                (i) => i.ruleType === item.ruleType
              ) || null;

            console.log(`🔍 找到的已有配置:`, {
              hasTemplateData: !!templateData?.ruleTemplateId,
              templateData: templateData
            });

            // 解析配置数据
            let defaultData: RuleTemplateDefaultIDTO;
            try {
              defaultData = JSON.parse(item.configuration) as RuleTemplateDefaultIDTO;
              console.log(`🔍 默认配置解析成功:`, {
                rule_type: defaultData.rule_type,
                optional_market_list: defaultData.optional_market_list,
                market_list_length: defaultData.market_list?.length || 0
              });
            } catch (parseError) {
              console.error(`解析配置数据失败，规则类型: ${item.ruleType}`, parseError);
              // 创建回退数据
              result[item.ruleType] = createFallbackTemplateData(item.ruleType);
              continue;
            }

            const mergedData = mergeDefaultParamAndValue(
              defaultData,
              templateData
            );

            console.log(`🔍 合并后的数据:`, {
              ruleType: mergedData.ruleType,
              marketListLength: mergedData.marketList?.length || 0,
              marketList: mergedData.marketList
            });

            // 验证并修复数据
            const validation = validateRuleTemplateData(mergedData, item.ruleType);
            if (!validation.isValid) {
              console.warn(`规则类型 ${item.ruleType} 数据验证失败:`, validation.errors);
              const fixedData = fixRuleTemplateData(mergedData, defaultData);
              result[item.ruleType] = fixedData;
            } else {
              result[item.ruleType] = mergedData;
            }
          } catch (error) {
            console.error(`处理规则类型 ${item.ruleType} 失败:`, error);
            // 创建回退数据
            result[item.ruleType] = createFallbackTemplateData(item.ruleType);
            continue;
          }
        }
      } else {
        // 如果没有默认配置数据，为每个规则类型创建回退数据
        console.warn('默认配置接口返回空数据，为所有规则类型创建回退数据');
        for (const ruleType of ruleTypes) {
          result[ruleType] = createFallbackTemplateData(ruleType);
        }
      }

      // 调试信息：记录数据合并结果
      console.log('规则模板数据合并结果:', {
        规则类型: ruleTypes,
        默认配置数量: defaultRes.data.resultList?.length,
        已有配置数量: templateRes?.data.resultList?.length,
        合并结果数量: Object.keys(result).length,
        合并结果详情: result
      });

      // 确保result不为空
      if (Object.keys(result).length === 0) {
        console.error('警告: 合并结果为空，创建默认回退数据');
        for (const ruleType of ruleTypes) {
          result[ruleType] = createFallbackTemplateData(ruleType);
        }
        console.log('创建回退数据后的结果:', result);
      }

      setRuleTemplateMap(result);
      setRuleConfigData(defaultRes.data?.resultList || []);
    } catch (error) {
      console.error('获取规则模板数据失败:', error);
      console.error('错误详情:', {
        规则类型: record.ruleTemplateList.map(i => i.ruleType),
        工作组ID: record?.ruleTmplGroupId,
        模板组信息: record
      });
      setRuleConfigData([]);
      setRuleTemplateMap({});
    } finally {
      setRuleConfigLoading(false);
    }
  };

  // 加载关联账户组数据
  const loadAccountGroupData = async (record: RuleRecord) => {
    setAccountGroupLoading(true);
    try {
      const params = {
        pageId: 1,
        pageSize: 5000,
        authorityFlag: 1,
        filterCondition: {
          ruleTmplGroupId: [record.ruleTmplGroupId],
          workGroupId: record.workGroupId,
        },
      };

      const res = await queryAccountGroupRelation(params);

      if (res && res.errorId === 0) {
        setAccountGroupData(res.data?.resultList || []);
      } else {
        message.error(res?.errorMessage || '获取关联账户组失败');
        setAccountGroupData([]);
      }
    } catch (error: any) {
      console.error('加载关联账户组失败:', error);
      message.error(`加载关联账户组失败: ${error.message || '未知错误'}`);
      setAccountGroupData([]);
    } finally {
      setAccountGroupLoading(false);
    }
  };


  const columns: ColumnsType<RuleRecord> = [
    { title: '指标组编号', dataIndex: 'ruleTmplGroupId', width: 120 },
    { title: '指标组名称', dataIndex: 'ruleTmplGroupName', width: 180 },
    {
      title: '启用状态',
      dataIndex: 'status',
      width: 120,
      render: (status: number) => {
        if (status === RuleTemplateGroupStatus.ENABLE) {
          return <span className="text-[#1890ff]"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1890ff] mr-2"></span>已启用</span>;
        } else {
          return <span className="text-red-500"><span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>已停用</span>;
        }
      }
    },
    {
      title: '包含规则类型数',
      dataIndex: 'ruleTemplateList',
      width: 140,
      align: 'center',
      render: (ruleTemplateList: { ruleTemplateId: number; ruleType: string }[]) => (
        <span className="text-[#1890ff] bg-[#e6f7ff] px-3 py-0.5 rounded font-medium">
          {ruleTemplateList?.length || 0}
        </span>
      )
    },
    { title: '创建人', dataIndex: 'createUserCode', width: 100 },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 160,
      render: (time: string) => {
        if (!time) return '-';
        // 尝试格式化时间，假设格式为 YYYYMMDDHHmmss
        try {
          if (time.length === 14) {
            return `${time.slice(0,4)}-${time.slice(4,6)}-${time.slice(6,8)} ${time.slice(8,10)}:${time.slice(10,12)}:${time.slice(12,14)}`;
          }
          return time;
        } catch {
          return time;
        }
      }
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdateTime',
      width: 160,
      render: (time: string) => {
        if (!time) return '-';
        // 尝试格式化时间，假设格式为 YYYYMMDDHHmmss
        try {
          if (time.length === 14) {
            return `${time.slice(0,4)}-${time.slice(4,6)}-${time.slice(6,8)} ${time.slice(8,10)}:${time.slice(10,12)}:${time.slice(12,14)}`;
          }
          return time;
        } catch {
          return time;
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Space size="middle" className="text-[#1890ff]">
          <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => handleView(record.id, 'template')}>查看</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => handleView(record.id, 'template')}>绑定账户组</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">{record.status === RuleTemplateGroupStatus.ENABLE ? '禁用' : '启用'}</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => handleEdit(record.id, 'template')}>编辑</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">复制</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">删除</a>
        </Space>
      ),
    },
  ];

  const singleColumns: ColumnsType<SingleRuleRecord> = [
    { title: '规则编号', dataIndex: 'ruleNo', width: 100 },
    { 
      title: '规则类型', 
      dataIndex: 'ruleType', 
      width: 200,
      render: (text) => (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[#1890ff] bg-[#e6f7ff] border border-[#91d5ff] text-xs">
          <LineChartOutlined /> {text}
        </span>
      )
    },
    { title: '规则名称', dataIndex: 'ruleName', width: 140 },
    { 
      title: '启用状态', 
      dataIndex: 'status', 
      width: 100,
      render: (status) => (
        <span className="text-[#1890ff] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1890ff]"></span>
          已启用
        </span>
      )
    },
    { 
      title: '优先级', 
      dataIndex: 'priority', 
      width: 80,
      render: (val) => (
        <span className="inline-block px-2 py-0.5 rounded text-[#1890ff] bg-[#e6f7ff] border border-[#91d5ff] text-xs">
          {val}
        </span>
      )
    },
    { 
      title: '账户控制类型', 
      dataIndex: 'accountControlType', 
      width: 120,
      render: (text) => {
        const isSystem = text === '对接系统';
        return (
          <span className={`inline-block px-2 py-0.5 rounded text-xs border ${
            isSystem 
              ? 'text-[#eb2f96] bg-[#fff0f6] border-[#ffadd2]' 
              : 'text-[#1890ff] bg-[#e6f7ff] border-[#91d5ff]'
          }`}>
            {text}
          </span>
        );
      }
    },
    { 
      title: '联合控制模式', 
      dataIndex: 'jointControlMode', 
      width: 120,
      render: (text) => (
        <span className="inline-block px-2 py-0.5 rounded text-[#722ed1] bg-[#f9f0ff] border-[#d3adf7] text-xs">
          {text}
        </span>
      )
    },
    { title: '证券控制方式', dataIndex: 'securityControlMethod', width: 120 },
    { title: '证券汇总方式', dataIndex: 'securitySummaryMethod', width: 120 },
    { title: '创建人', dataIndex: 'creator', width: 80 },
    { title: '修改人', dataIndex: 'modifier', width: 80 },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    { title: '更新时间', dataIndex: 'updateTime', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="small" className="text-[#1890ff]">
          <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => handleView(record.id, 'single')}>查看</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">禁用</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => handleEdit(record.id, 'single')}>编辑</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">复制</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">删除</a>
        </Space>
      ),
    },
  ];

  return (
    <RuleSettingsErrorBoundary>
      <div className="p-6 h-full flex flex-col absolute inset-0 bg-white overflow-y-auto">
      {/* 顶部标题 */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <Title level={4} style={{ margin: 0, color: '#333' }}>规则设置</Title>
          <InfoCircleOutlined className="text-gray-400" />
        </div>
      </div>

      {/* 统计卡片区 */}
      <div className="flex gap-6 mb-8 shrink-0">
        <div 
          className={`w-64 h-24 bg-white rounded-lg shadow-sm p-4 relative overflow-hidden flex flex-col justify-center cursor-pointer transition-all ${activeCard === 'single' ? 'border-2 border-[#1890ff]' : 'border border-gray-200 hover:border-[#1890ff]/50'}`}
          onClick={() => setActiveCard('single')}
        >
          {activeCard === 'single' && (
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-[#1890ff] border-l-[24px] border-l-transparent">
              <CheckCircleOutlined className="absolute -top-[22px] -left-[14px] text-white text-[10px]" />
            </div>
          )}
          <div className="text-gray-800 font-medium text-sm mb-1">单个规则指标</div>
          <div className="text-3xl font-bold text-gray-800">15</div>
          <div className="absolute right-4 bottom-4 opacity-20">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-300 rounded-full"></div>
            </div>
          </div>
        </div>

        <div
          className={`w-64 h-24 bg-white rounded-lg shadow-sm p-4 relative overflow-hidden flex flex-col justify-center cursor-pointer transition-all ${activeCard === 'template' ? 'border-2 border-[#1890ff]' : 'border border-gray-200 hover:border-[#1890ff]/50'}`}
          onClick={() => {
            setActiveCard('template');
            // 切换到模板卡片时刷新数据
            fetchTemplateData();
          }}
        >
          {activeCard === 'template' && (
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-[#1890ff] border-l-[24px] border-l-transparent">
              <CheckCircleOutlined className="absolute -top-[22px] -left-[14px] text-white text-[10px]" />
            </div>
          )}
          <div className="text-gray-800 font-medium text-sm mb-1">模板生成指标</div>
          <div className="text-3xl font-bold text-gray-800">{templatePagination.total}</div>
          <div className="absolute right-4 bottom-4 opacity-80">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4L4 14L24 24L44 14L24 4Z" fill="#91d5ff" stroke="#1890ff" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M4 24L24 34L44 24" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 34L24 44L44 34" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* 标题和操作区 */}
      <div className="flex justify-between items-end mb-4 shrink-0">
        <div>
          <div className="text-lg font-bold text-gray-800 mb-1">
            {activeCard === 'template' ? '多个规则类型模板创建的指标组' : '单个规则创建生成的指标'}
          </div>
          <div className="text-sm text-gray-500">
            {activeCard === 'template' ? '通过恒定空模板批量创建风控指标，简化配置流程' : '通过自定义规则创建的指标，包含详细的配置信息'}
          </div>
        </div>
        <Space>
          <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={handleCreate}>创建新指标</Button>
          <Button className="text-[#1890ff] border-[#1890ff] hover:!text-[#096dd9] hover:!border-[#096dd9]">导出数据</Button>
        </Space>
      </div>

      {/* 动态内容区 */}
      {embeddedView !== 'none' ? (
        // 内嵌视图（创建/编辑/查看）
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 rounded-lg border border-gray-200">
          <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
              <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleCloseEmbedded} className="text-gray-500 hover:text-[#1890ff]" />
              <Title level={4} style={{ margin: 0, color: '#333' }}>
                {embeddedView === 'create' && embeddedType === 'single' && '创建单个规则指标'}
                {embeddedView === 'edit' && embeddedType === 'single' && '编辑单个规则指标'}
                {embeddedView === 'view' && embeddedType === 'single' && '查看单个规则指标'}
                {embeddedView === 'create' && embeddedType === 'template' && '创建模板指标组'}
                {embeddedView === 'edit' && embeddedType === 'template' && '编辑模板指标组'}
                {embeddedView === 'view' && embeddedType === 'template' && '查看指标模板配置详情'}
              </Title>
            </div>
            {embeddedView === 'create' && (
              <Space>
                <Button onClick={handleCloseEmbedded}>取消</Button>
                <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none">保存草稿</Button>
                <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none">提交审核</Button>
              </Space>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            <Suspense fallback={<Spin size="large" className="w-full h-64 flex items-center justify-center" />}>
              {embeddedView === 'create' && embeddedType === 'template' && <RuleCreate embedded onClose={handleCloseEmbedded} />}
              {embeddedView === 'edit' && embeddedType === 'template' && <RuleEdit embedded onClose={handleCloseEmbedded} />}
              {embeddedView === 'view' && embeddedType === 'template' && (
                <div className="h-full overflow-y-auto">
                  {ruleConfigLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <Spin size="large" />
                      <p>加载规则配置中...</p>
                      <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                        正在查询接口: queryRuleTemplateDefaultConfiguration, queryRuleTemplate
                      </p>
                    </div>
                  ) : Object.keys(ruleTemplateMap).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      <h3>暂无规则配置数据</h3>
                      <p>可能的原因:</p>
                      <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '10px' }}>
                        <li>接口返回空数据</li>
                        <li>数据格式不匹配</li>
                        <li>网络连接问题</li>
                      </ul>
                      <Button
                        type="primary"
                        onClick={() => viewingRecord && loadRuleConfigData(viewingRecord)}
                        style={{ marginTop: '20px' }}
                      >
                        重新加载
                      </Button>
                    </div>
                  ) : (
                    <Suspense fallback={<Spin size="large" className="w-full h-64 flex items-center justify-center" />}>
                      <RuleTemplateConfigView
                        ruleTemplateMap={ruleTemplateMap}
                        viewingRecord={viewingRecord}
                        embedded
                        onClose={handleCloseEmbedded}
                      />
                    </Suspense>
                  )}
                </div>
              )}
              {embeddedView === 'create' && embeddedType === 'single' && <SingleRuleCreate embedded onClose={handleCloseEmbedded} />}
              {embeddedView === 'edit' && embeddedType === 'single' && <SingleRuleEdit embedded onClose={handleCloseEmbedded} />}
              {embeddedView === 'view' && embeddedType === 'single' && <SingleRuleView embedded onClose={handleCloseEmbedded} />}
            </Suspense>
          </div>
        </div>
      ) : activeCard === 'template' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 搜索区 */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4 flex flex-wrap gap-4 items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">指标组编号：</span>
              <Input
                placeholder="请输入"
                style={{ width: 180 }}
                value={searchParams.ruleTmplGroupId ? searchParams.ruleTmplGroupId.toString() : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchParams(prev => ({
                    ...prev,
                    ruleTmplGroupId: value ? parseInt(value) : undefined
                  }));
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">指标组名称：</span>
              <Input
                placeholder="请输入"
                style={{ width: 180 }}
                value={searchParams.ruleTmplGroupName || ''}
                onChange={(e) => {
                  setSearchParams(prev => ({
                    ...prev,
                    ruleTmplGroupName: e.target.value || undefined
                  }));
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">启用状态：</span>
              <Select
                placeholder="请选择"
                style={{ width: 150 }}
                value={searchParams.status}
                onChange={(value) => {
                  setSearchParams(prev => ({
                    ...prev,
                    status: value
                  }));
                }}
                options={[
                  { value: RuleTemplateGroupStatus.ENABLE, label: '已启用' },
                  { value: RuleTemplateGroupStatus.DISABLE, label: '已停用' }
                ]}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">创建人：</span>
              <Input
                placeholder="请输入"
                style={{ width: 150 }}
                value={searchParams.createUserCode || ''}
                onChange={(e) => {
                  setSearchParams(prev => ({
                    ...prev,
                    createUserCode: e.target.value || undefined
                  }));
                }}
              />
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                onClick={() => {
                  setSearchParams({
                    ruleTmplGroupId: undefined,
                    ruleTmplGroupName: undefined,
                    status: undefined,
                    createUserCode: undefined,
                  });
                  // 重置时不需要传入额外参数，fetchTemplateData 会自动使用工作台ID
                  fetchTemplateData({ pageId: 1 });
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                className="bg-[#1890ff] hover:!bg-[#096dd9] border-none"
                onClick={() => fetchTemplateData({ pageId: 1 })}
              >
                查询
              </Button>
            </div>
          </div>

          {/* 表格区 */}
          <div className="flex-1 overflow-hidden">
            <Table
              columns={columns}
              dataSource={templateData}
              rowKey="id"
              loading={templateLoading}
              pagination={{
                current: templatePagination.current,
                pageSize: templatePagination.pageSize,
                total: templatePagination.total,
                showTotal: (total) => `共 ${total} 条记录`,
                showSizeChanger: true,
                showQuickJumper: true,
                position: ['bottomRight'],
                onChange: (page, pageSize) => {
                  // 前端分页，更新分页状态
                  setTemplatePagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize,
                  }));
                },
                onShowSizeChange: (current, size) => {
                  // 前端分页，更新分页大小
                  setTemplatePagination(prev => ({
                    ...prev,
                    current: 1,
                    pageSize: size,
                  }));
                }
              }}
              scroll={{ x: 'max-content', y: 'calc(100vh - 480px)' }}
              size="middle"
              className="custom-rule-table"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* 左侧：规则树 */}
          <div className="w-[280px] shrink-0 border border-gray-200 rounded-lg p-4 overflow-y-auto bg-gray-50/50">
            <div className="text-sm font-medium text-gray-600 mb-4">规则类型导航</div>
            <Tree
              showLine
              defaultExpandAll
              treeData={treeData}
              className="bg-transparent"
            />
          </div>

          {/* 右侧：搜索与列表 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 紧凑型搜索区 */}
            <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4 flex flex-wrap gap-3 items-center shrink-0">
              <Input placeholder="规则编号" style={{ width: 140 }} />
              <Input placeholder="规则名称" style={{ width: 140 }} />
              <Select placeholder="启用状态" style={{ width: 120 }} options={[{value: 'enabled', label: '已启用'}, {value: 'disabled', label: '已停用'}]} />
              <Input placeholder="创建人" style={{ width: 120 }} />
              <div className="ml-auto flex gap-2">
                <Button size="small">重置</Button>
                <Button type="primary" size="small" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none" onClick={handleSearch}>查询</Button>
              </div>
            </div>

            {/* 表格区 */}
            <div className="flex-1 overflow-hidden">
              <Table
                columns={singleColumns}
                dataSource={mockSingleData}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `共 ${total} 条记录`,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  position: ['bottomRight']
                }}
                scroll={{ x: 'max-content', y: 'calc(100vh - 480px)' }}
                size="middle"
                className="custom-rule-table"
              />
            </div>
          </div>
        </div>
      )}

    </div>
    </RuleSettingsErrorBoundary>
  );
};
export default RuleSettings;