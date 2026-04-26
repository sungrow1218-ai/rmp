import * as React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Tree, Tabs, Collapse, Descriptions, Tag, Space, Typography, Card, Statistic, Button, Empty, Input, Select, Modal, message, Table, Spin } from 'antd';
import {
  LineChartOutlined, BarChartOutlined, SafetyOutlined, SettingOutlined,
  BankOutlined, AppstoreOutlined, ArrowLeftOutlined, IdcardOutlined,
  AppstoreFilled, EyeOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import type { RuleTypeTemplate, SecurityGroup } from '../services/ruleTemplateTypes';
import { RiskLevel } from '../services/ruleTemplateTypes';
import { useNavigate } from 'react-router-dom';
import { queryMenuConfig } from '../services/api';
import {
  getRuleTemplateConfig,
  getMarketName,
  getSecurityGroupName,
  renderTemplate,
  getAllMarketIds,
  getMarketData,
  hasWarningLevel
} from '@/pages/ruleSetting/RuleTemplateGroup/components/configMonitor/utils';

const { Title } = Typography;
const { Panel } = Collapse;

interface RuleTemplateConfigViewProps {
  ruleTemplateMap: { [key: string]: RuleTypeTemplate };
  viewingRecord: any;
  embedded?: boolean;
  onClose?: () => void;
}

interface TreeDataNode {
  key: string;
  title: string;
  children?: TreeDataNode[];
}

// 左侧树形结构的数据接口
interface IRuleConfigurationItem {
  Id: string;
  Name: string;
  SubList?: IRuleConfigurationItem[];
}

// 规则配置接口（从queryMenuConfig返回的displayConfig JSON解析）
interface IRuleConfiguration {
  Id: string;
  Name: string;
  workGroupList: {
    WorkGroupId: number;
    WorkGroupName: string;
    RuleTypeList: {
      rule: IRuleConfigurationItem[];
      template: IRuleConfigurationItem[];
    };
  }[];
}

// 账户组接口
interface AccountGroup {
  id: string;
  name: string;
  accountType: string;
  controlType: string;
  groupType: 'static' | 'dynamic';
  filterConditions?: any;
}

// 真实数据渲染函数

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

// 简单的缓存对象，避免重复查询相同的数据
const menuConfigCache: {
  data: TreeDataNode[] | null;
  workGroupId: string | null;
  timestamp: number;
} = {
  data: null,
  workGroupId: null,
  timestamp: 0
};

// 缓存有效期（5分钟）
const CACHE_EXPIRY = 5 * 60 * 1000;

const RuleTemplateConfigView: React.FC<RuleTemplateConfigViewProps> = ({
  ruleTemplateMap,
  viewingRecord,
  embedded = false,
  onClose
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [treeLoading, setTreeLoading] = useState(true);
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [treeError, setTreeError] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['Z01102']);
  const [activeMarketTab, setActiveMarketTab] = useState<string>('SH');
  const [selectedRuleType, setSelectedRuleType] = useState<string>('');
  const [boundGroups, setBoundGroups] = useState<AccountGroup[]>([
    allGroups[0],
    allGroups[1]
  ]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNewGroups, setSelectedNewGroups] = useState<string[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentDetailGroup, setCurrentDetailGroup] = useState<AccountGroup | null>(null);

  // 安全检查
  if (!viewingRecord) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">
        数据加载中...
      </div>
    );
  }

  // 确保viewingRecord的属性是基本类型
  const safeViewingRecord = {
    ruleTmplGroupId: String(viewingRecord.ruleTmplGroupId || '-'),
    ruleTmplGroupName: String(viewingRecord.ruleTmplGroupName || '-'),
    status: Number(viewingRecord.status || 0),
    workGroupId: String(viewingRecord.workGroupId || '-'),
    ruleTemplateList: Array.isArray(viewingRecord.ruleTemplateList) ? viewingRecord.ruleTemplateList : []
  };

  // 转换IRuleConfigurationItem为TreeDataNode
  const convertToTreeData = useCallback((items: IRuleConfigurationItem[]): TreeDataNode[] => {
    return items.map(item => ({
      key: item.Id,
      title: item.Name,
      children: item.SubList ? convertToTreeData(item.SubList) : undefined
    }));
  }, []);

  // 查询菜单配置并构建树形结构
  const fetchMenuConfig = useCallback(async (retryCount = 0) => {
    const MAX_RETRIES = 2;

    // 检查缓存
    const currentWorkGroupId = safeViewingRecord.workGroupId;
    const now = Date.now();

    if (
      menuConfigCache.data &&
      menuConfigCache.workGroupId === currentWorkGroupId &&
      now - menuConfigCache.timestamp < CACHE_EXPIRY
    ) {
      console.log('使用缓存数据');
      setTreeData(menuConfigCache.data);
      setTreeLoading(false);
      return;
    }

    try {
      setTreeLoading(true);
      setTreeError(null); // 清除之前的错误状态
      // 查询菜单配置，需要传递menuId参数
      const requestParams = {
        pageId: 1,
        pageSize: 100,
        // 根据rmp_ui_test项目，filterCondition应该是一个数组
        filterCondition:
          {
            menuId: 101, // 使用rmp_ui_test中使用的默认menuId
          },
      };
      console.log('调用queryMenuConfig，参数:', JSON.stringify(requestParams, null, 2));
      const result = await queryMenuConfig(requestParams);

      if (result.errorId === 0 && result.data?.resultList?.length > 0) {
        // 解析displayConfig JSON
        const displayConfig = result.data.resultList[0].displayConfig;
        if (displayConfig) {
          try {
            const ruleConfiguration = JSON.parse(displayConfig) as IRuleConfiguration;

            // 检查是否有工作台配置
            if (!ruleConfiguration.workGroupList || ruleConfiguration.workGroupList.length === 0) {
              message.warning('菜单配置中没有工作台数据');
              return;
            }

            // 获取当前工作台的模板配置
            const currentWorkGroupId = parseInt(safeViewingRecord.workGroupId);
            const workGroupConfig = ruleConfiguration.workGroupList.find(
              wg => wg.WorkGroupId === currentWorkGroupId
            );

            if (workGroupConfig && workGroupConfig.RuleTypeList.template) {
              // 使用模板配置构建树形结构
              const templateTreeData = convertToTreeData(workGroupConfig.RuleTypeList.template);
              console.log('找到对应工作台配置，构建树形数据:', {
                workGroupId: currentWorkGroupId,
                workGroupName: workGroupConfig.WorkGroupName,
                treeDataCount: templateTreeData.length
              });
              setTreeData(templateTreeData);
              // 更新缓存
              menuConfigCache.data = templateTreeData;
              menuConfigCache.workGroupId = currentWorkGroupId.toString();
              menuConfigCache.timestamp = Date.now();
            } else {
              // 如果没有找到对应工作台的配置，使用第一个工作台的配置
              const firstWorkGroup = ruleConfiguration.workGroupList[0];
              if (firstWorkGroup && firstWorkGroup.RuleTypeList.template) {
                const templateTreeData = convertToTreeData(firstWorkGroup.RuleTypeList.template);
                console.log('未找到对应工作台配置，使用第一个工作台配置:', {
                  currentWorkGroupId,
                  firstWorkGroupId: firstWorkGroup.WorkGroupId,
                  firstWorkGroupName: firstWorkGroup.WorkGroupName,
                  treeDataCount: templateTreeData.length
                });
                setTreeData(templateTreeData);
                // 更新缓存
                menuConfigCache.data = templateTreeData;
                menuConfigCache.workGroupId = currentWorkGroupId.toString();
                menuConfigCache.timestamp = Date.now();
              } else {
                console.log('未找到任何工作台的模板配置');
                message.warning('当前工作台没有可用的规则模板配置');
              }
            }
          } catch (parseError) {
            console.error('解析displayConfig JSON失败:', parseError);
            message.error('解析菜单配置数据失败，请检查配置格式');

            // 如果是解析错误，不重试
            return;
          }
        } else {
          console.error('菜单配置中没有displayConfig字段');
          message.warning('菜单配置数据不完整');
        }
      } else {
        console.error('查询菜单配置失败:', result.errorMessage);
        setTreeError(result.errorMessage || '查询菜单配置失败');

        // 如果是服务器错误，尝试重试
        if (retryCount < MAX_RETRIES) {
          console.log(`第${retryCount + 1}次重试...`);
          setTimeout(() => fetchMenuConfig(retryCount + 1), 1000 * (retryCount + 1));
        } else {
          message.error(result.errorMessage || '查询菜单配置失败，请稍后重试');
        }
      }
    } catch (error: any) {
      console.error('查询菜单配置异常:', error);

      // 如果是网络错误，尝试重试
      if (retryCount < MAX_RETRIES) {
        console.log(`第${retryCount + 1}次重试...`);
        setTimeout(() => fetchMenuConfig(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        const errorMsg = `查询菜单配置异常: ${error.message || '网络错误，请检查网络连接'}`;
        setTreeError(errorMsg);
        message.error(errorMsg);
      }
    } finally {
      setTreeLoading(false);
    }
  }, [safeViewingRecord.workGroupId, convertToTreeData]);

  // 初始化时查询菜单配置
  useEffect(() => {
    fetchMenuConfig();
  }, [fetchMenuConfig]);

  // 获取选中的规则模板
  const selectedTemplate = selectedRuleType ? ruleTemplateMap[selectedRuleType] : null;

  // 模拟数据加载
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleBack = () => {
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

  // 渲染真实数据配置内容
  const renderRealDataContent = (ruleType: string, marketId: number, securityGroup: SecurityGroup, riskLevel: RiskLevel = RiskLevel.INTERCEPT) => {
    const templateConfig = getRuleTemplateConfig(ruleType);
    if (!templateConfig || templateConfig.length === 0) {
      return (
        <div className="py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100">
          <div className="text-center text-gray-500">
            暂无规则模板配置
          </div>
        </div>
      );
    }

    return (
      <div className="py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100">
        {templateConfig.map((item, index) => {
          const renderedTemplate = renderTemplate(item.template, securityGroup, riskLevel);

          return (
            <div key={index} className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
              <span
                className="font-medium"
                dangerouslySetInnerHTML={{
                  __html: renderedTemplate.replace(
                    /<span class="threshold-value">(.*?)<\/span><span class="unit-suffix">(.*?)<\/span>/g,
                    '<span class="px-4 py-1 bg-white border border-gray-200 rounded text-center min-w-[60px] text-[#1890ff] font-medium">$1</span><span class="font-medium ml-1">$2</span>'
                  )
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染预警级别配置
  const renderWarningContent = (ruleType: string, marketId: number, securityGroup: SecurityGroup) => {
    const templateConfig = getRuleTemplateConfig(ruleType);
    if (!templateConfig || templateConfig.length === 0) {
      return null;
    }

    return (
      <div className="py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100">
        {templateConfig.map((item, index) => {
          const renderedTemplate = renderTemplate(item.template, securityGroup, RiskLevel.WARNING);

          return (
            <div key={index} className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
              <span
                className="font-medium"
                dangerouslySetInnerHTML={{
                  __html: renderedTemplate.replace(
                    /<span class="threshold-value">(.*?)<\/span><span class="unit-suffix">(.*?)<\/span>/g,
                    '<span class="px-4 py-1 bg-white border border-gray-200 rounded text-center min-w-[60px] text-[#1890ff] font-medium">$1</span><span class="font-medium ml-1">$2</span>'
                  )
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };
       <div>
          <Space.Compact>
            <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.market_declare_ratio_t1}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.market_declare_ratio_t2}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.market_declare_ratio_t3}</span>
          </Space.Compact>
          <span className="font-medium">% 以上</span>
        </div>

        {/* 条件四 */}
        <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
          <span className="font-medium">(四) 累计撤销申报数量占累计申报数量的比例在</span>
          <Space.Compact>
            <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.cancel_ratio_t1}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.cancel_ratio_t2}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.cancel_ratio_t3}</span>
          </Space.Compact>
          <span className="font-medium">% 以上</span>
        </div>

        {/* 条件五 */}
        <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
          <span className="font-medium">(五) 以低于申报买入价格反向申报卖出 或者 以高于申报卖出价格反向申报买入的次数在</span>
          <Space.Compact>
            <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.reverse_declare_count_t1}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.reverse_declare_count_t2}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.reverse_declare_count_t3}</span>
          </Space.Compact>
          <span className="font-medium">次 以上</span>
        </div>
      </div>
    );
  };

  // 渲染只读的阈值配置内容 (连续竞价阶段虚假申报)
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
          <Space.Compact>
            <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.volume_t1}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.volume_t2}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.volume_t3}</span>
          </Space.Compact>
          <span className="font-medium">万股 以上或者金额在</span>
          <Space.Compact>
            <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.amount_t1}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.amount_t2}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.amount_t3}</span>
          </Space.Compact>
          <span className="font-medium">万元 以上，且占市场同方向最优5档剩余有效申报总量的比例在</span>
          <Space.Compact>
            <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.ratio_t1}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.ratio_t2}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.ratio_t3}</span>
          </Space.Compact>
          <span className="font-medium">% 以上</span>
        </div>

        {/* 条件三 */}
        <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
          <span className="font-medium">(三) 满足上述情形的申报发生</span>
          <Space.Compact>
            <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.count_t1}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.count_t2}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.count_t3}</span>
          </Space.Compact>
          <span className="font-medium">次 以上</span>
        </div>

        {/* 条件四 */}
        <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
          <span className="font-medium">(四) 累计撤销申报数量占累计申报数量的比例在</span>
          <Space.Compact>
            <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.cancel_ratio_t1}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.cancel_ratio_t2}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.cancel_ratio_t3}</span>
          </Space.Compact>
          <span className="font-medium">% 以上</span>
        </div>

        {/* 条件五 */}
        <div className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
          <span className="font-medium">(五) 存在反向卖出（买入）的成交次数 在</span>
          <Space.Compact>
            <span className="px-4 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">{data.reverse_trade_count_t1}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">{data.reverse_trade_count_t2}</span>
            <span className="px-4 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">{data.reverse_trade_count_t3}</span>
          </Space.Compact>
          <span className="font-medium">次 以上</span>
        </div>
      </div>
    );
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

  // 账户组表格列定义
  const columns: any[] = [
    { title: '账户组ID', dataIndex: 'id', key: 'id', align: 'center' as const },
    { title: '账户组名称', dataIndex: 'name', key: 'name', align: 'center' as const },
    {
      title: '更新模式',
      dataIndex: 'groupType',
      key: 'groupType',
      align: 'center' as const,
      render: (text: string) => (
        <Tag color={text === 'static' ? 'blue' : 'green'} className="m-0">
          {text === 'static' ? '静态账户组' : '动态账户组'}
        </Tag>
      )
    },
    {
      title: '账户类型',
      dataIndex: 'accountType',
      key: 'accountType',
      align: 'center' as const,
      render: (text: string) => (
        <span className="inline-block px-3 py-1 rounded text-[#1890ff] bg-[#e6f7ff] border border-[#91d5ff] text-sm">
          {text}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: AccountGroup) => (
        <Space size="middle">
          <a className="text-[#1890ff] hover:text-[#096dd9]" onClick={() => handleViewDetail(record)}>查看明细</a>
          <a className="text-[#1890ff] hover:text-[#096dd9]">编辑账户组</a>
        </Space>
      ),
    },
  ];

  // 过滤出还未绑定的账户组供选择
  const availableGroups = allGroups.filter(g => !boundGroups.some(bg => bg.id === g.id));

  if (loading) {
    return <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">加载中...</div>;
  }

  return (
    <div className={`flex flex-col ${embedded ? 'h-auto max-h-full' : 'h-full absolute inset-0'} bg-gray-50`}
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
          <Title level={4} style={{ margin: 0, color: '#333' }}>查看指标模板配置详情</Title>
        </div>
        <Space>
          <Button onClick={handleBack}>返回</Button>
          <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none">编辑配置</Button>
        </Space>
      </div>

      {/* 主体内容区 */}
      <div className={`${embedded ? 'flex-auto overflow-auto' : 'flex-1 overflow-y-auto'} p-6 flex flex-col gap-6`}

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
            <Descriptions.Item label="指标组编号">{safeViewingRecord.ruleTmplGroupId}</Descriptions.Item>
            <Descriptions.Item label="指标组名称">{viewingRecord?.ruleTmplGroupName || '-'}</Descriptions.Item>
            <Descriptions.Item label="启用状态">
              <Tag color={safeViewingRecord.status === 1 ? 'success' : 'error'} style={{ fontWeight: '500', padding: '2px 8px' }}>
                {safeViewingRecord.status === 1 ? '已启用' : '已停用'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="工作台ID">{safeViewingRecord.workGroupId}</Descriptions.Item>
            <Descriptions.Item label="规则类型数">{safeViewingRecord.ruleTemplateList.length || 0}</Descriptions.Item>
            <Descriptions.Item label="备注说明" span={2}>
              <span style={{ color: '#666', fontSize: '14px' }}>这是一个用于监控异常交易行为的指标组模板。</span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Tabs 区域 */}
        <Card bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }} className={`shadow-sm rounded-lg ${embedded ? 'flex-auto' : 'flex-1'} overflow-hidden ${embedded ? 'min-h-[400px]' : 'min-h-[600px]'}`}
          <Tabs
            defaultActiveKey="rule"
            className="px-6 pt-4 flex-1 flex flex-col view-tabs-container"
            items={[
              {
                key: 'rule',
                label: <span className="text-base font-medium px-2">规则配置详情</span>,
                children: (
                  <div className="flex h-full -mx-6 border-t border-gray-100">
                    {/* 左侧：规则树 */}
                    <div className="w-[320px] border-r border-gray-200 p-4 overflow-y-auto bg-gray-50/50 shrink-0">
                      {treeLoading ? (
                        <div className="h-full flex flex-col items-center justify-center">
                          <Spin size="large" tip="加载规则树..." />
                          <p className="mt-4 text-gray-500 text-sm">正在查询菜单配置...</p>
                        </div>
                      ) : treeError ? (
                        <div className="h-full flex flex-col items-center justify-center p-4">
                          <div className="text-red-500 text-center mb-4">
                            <div className="text-lg font-medium mb-2">加载失败</div>
                            <div className="text-sm">{treeError}</div>
                          </div>
                          <Button
                            type="primary"
                            onClick={() => {
                              setTreeError(null);
                              fetchMenuConfig();
                            }}
                          >
                            重试
                          </Button>
                        </div>
                      ) : treeData.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                          <Empty description="暂无规则配置数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                          <p className="mt-2 text-sm">请检查菜单配置或联系管理员</p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-3 text-sm text-gray-600">
                            共 {treeData.length} 个规则类型
                          </div>
                          <Tree
                            showLine
                            defaultExpandAll
                            selectedKeys={selectedKeys}
                            onSelect={(keys) => setSelectedKeys(keys)}
                            treeData={treeData}
                            className="bg-transparent custom-tree"
                          />
                        </>
                      )}
                    </div>

                    {/* 右侧：配置参数区 */}
                    <div className="flex-1 p-6 overflow-y-auto bg-white">
                      {selectedKeys.includes('Z01102') ? (
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
                      ) : selectedKeys.includes('Z01201') ? (
                        <div className="w-full">
                          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                            <div className="w-1 h-4 bg-[#1890ff] rounded"></div>
                            <span className="text-lg font-bold text-gray-800">开盘集合竞价阶段虚假申报控制 - 参数配置</span>
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
                      ) : selectedKeys.includes('Z01202') ? (
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

export default RuleTemplateConfigView;