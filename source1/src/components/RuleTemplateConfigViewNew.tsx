import * as React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Tree, Tabs, Collapse, Descriptions, Tag, Space, Typography, Card, Button, Empty, Input, Select, Modal, message, Table, Spin } from 'antd';
import {
  ArrowLeftOutlined, IdcardOutlined, AppstoreFilled
} from '@ant-design/icons';
import type { RuleTypeTemplate, SecurityGroup } from '../services/ruleTemplateTypes';
import { RiskLevel } from '../services/ruleTemplateTypes';
import { useNavigate } from 'react-router-dom';
import { queryMenuConfig } from '@/services/api';
import {
  getRuleTemplateConfig as getStandardRuleTemplateConfig,
  getMarketName as getStandardMarketName,
  getSecurityGroupName as getStandardSecurityGroupName,
  renderTemplate as renderStandardTemplate,
  getAllMarketIds as getAllStandardMarketIds,
  getMarketData as getStandardMarketData,
  hasWarningLevel as hasStandardWarningLevel
} from '@/pages/ruleSetting/RuleTemplateGroup/components/config/utils';

import {
  getRuleTemplateConfig as getMonitorRuleTemplateConfig,
  getMarketName as getMonitorMarketName,
  getSecurityGroupName as getMonitorSecurityGroupName,
  renderTemplate as renderMonitorTemplate,
  renderMultiThreshold as renderMonitorMultiThreshold,
  getAllMarketIds as getAllMonitorMarketIds,
  getMarketData as getMonitorMarketData,
  hasWarningLevel as hasMonitorWarningLevel
} from '@/pages/ruleSetting/RuleTemplateGroup/components/configMonitor/utils';

// 导入规则字典
import { RULE_TYPE_LEVEL_2 } from '@/utils/dicts/dict';

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

const RuleTemplateConfigViewNew: React.FC<RuleTemplateConfigViewProps> = ({
  ruleTemplateMap,
  viewingRecord,
  embedded = false,
  onClose
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 调试日志
  useEffect(() => {
    console.error('📡 ========== RuleTemplateConfigViewNew 数据检查开始 ==========');
    console.error('📡 接收到的 ruleTemplateMap 对象:', ruleTemplateMap);
    console.error('📡 规则类型列表:', Object.keys(ruleTemplateMap));
    console.error('📡 viewingRecord:', viewingRecord);

    if (Object.keys(ruleTemplateMap).length === 0) {
      console.error('📡 警告: ruleTemplateMap 为空对象！');
      console.error('📡 可能的原因:');
      console.error('📡 1. queryRuleTemplateDefaultConfiguration 接口返回空数据');
      console.error('📡 2. queryRuleTemplate 接口返回空数据');
      console.error('📡 3. mergeDefaultParamAndValue 函数处理失败');
      console.error('📡 4. 数据格式不匹配');
      return;
    }

    // 检查每个规则类型的数据
    Object.keys(ruleTemplateMap).forEach(ruleType => {
      const template = ruleTemplateMap[ruleType];
      console.error(`📡 === 规则类型 ${ruleType} ===`);
      console.error('📡 完整模板数据:', template);
      console.error(`📡 市场数量: ${template.marketList?.length || 0}`);

      if (template.marketList && template.marketList.length > 0) {
        template.marketList.forEach((market, index) => {
          console.error(`📡 市场 ${index + 1}: ID=${market.marketId}, 名称=${market.marketName}`);
          console.error(`📡   证券组数量: ${market.securityGroupList?.length || 0}`);

          if (market.securityGroupList && market.securityGroupList.length > 0) {
            market.securityGroupList.forEach((sg, sgIndex) => {
              console.error(`📡   证券组 ${sgIndex + 1}: ID=${sg.securityGroupId}, 名称=${sg.securityGroupName}`);
              console.error(`📡     阈值数量: ${sg.thresholdList?.length || 0}`);

              if (sg.thresholdList && sg.thresholdList.length > 0) {
                sg.thresholdList.forEach((threshold, tIndex) => {
                  console.error(`📡     阈值 ${tIndex + 1}: 因子类型=${threshold.factorType}`);
                  console.error(`📡       值类型:`, typeof threshold.value);
                  console.error(`📡       值:`, threshold.value);
                  console.error(`📡       默认值类型:`, typeof threshold.defaultValue);
                  console.error(`📡       默认值:`, threshold.defaultValue);
                });
              } else {
                console.error(`📡     警告: 证券组 ${sg.securityGroupName} 没有阈值数据！`);
              }
            });
          } else {
            console.error(`📡   警告: 市场 ${market.marketName} 没有证券组数据！`);
          }
        });
      } else {
        console.error(`📡 警告: 规则类型 ${ruleType} 没有市场数据！`);
      }
    });
    console.error('📡 ========== RuleTemplateConfigViewNew 数据检查结束 ==========');
  }, [ruleTemplateMap]);

  // 判断是否为监控版本 - 基于规则类型
  const isMonitorVersion = useCallback((ruleType: string) => {
    // 监控版本的规则类型：Z01101, Z01102, Z01201, Z01202, Z01301, Z01302, Z03101, Z03201, Z03202, Z03203
    const monitorRuleTypes = ['Z01101', 'Z01102', 'Z01201', 'Z01202', 'Z01301', 'Z01302', 'Z03101', 'Z03201', 'Z03202', 'Z03203'];
    return monitorRuleTypes.includes(ruleType);
  }, []);

  // 根据版本选择工具函数
  const getUtils = useCallback((ruleType: string) => {
    const isMonitor = isMonitorVersion(ruleType);

    return {
      isMonitor,
      getRuleTemplateConfig: isMonitor ? getMonitorRuleTemplateConfig : getStandardRuleTemplateConfig,
      getMarketName: isMonitor ? getMonitorMarketName : getStandardMarketName,
      getSecurityGroupName: isMonitor ? getMonitorSecurityGroupName : getStandardSecurityGroupName,
      renderTemplate: isMonitor ? renderMonitorTemplate : renderStandardTemplate,
      renderMultiThreshold: isMonitor ? renderMonitorMultiThreshold : null,
      getAllMarketIds: isMonitor ? getAllMonitorMarketIds : getAllStandardMarketIds,
      getMarketData: isMonitor ? getMonitorMarketData : getStandardMarketData,
      hasWarningLevel: isMonitor ? hasMonitorWarningLevel : hasStandardWarningLevel,
    };
  }, [isMonitorVersion]);
  const [treeLoading, setTreeLoading] = useState(true);
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [treeError, setTreeError] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [activeMarketTab, setActiveMarketTab] = useState<string>('1');
  const [boundGroups, setBoundGroups] = useState<AccountGroup[]>([
    allGroups[0],
    allGroups[1]
  ]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNewGroups, setSelectedNewGroups] = useState<string[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentDetailGroup, setCurrentDetailGroup] = useState<AccountGroup | null>(null);

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

  // 获取选中的规则类型
  const selectedRuleType = selectedKeys.length > 0 ? selectedKeys[0].toString() : '';

  // 将规则类型转换为规则名称
  const getRuleNameByType = useCallback((ruleType: string): string => {
    if (!ruleType) return '';

    // 在规则字典中查找对应的规则名称
    const ruleItem = RULE_TYPE_LEVEL_2.find(item => item.code === ruleType);
    return ruleItem ? ruleItem.name : ruleType;
  }, []);

  // 获取选中的规则模板
  const selectedTemplate = useMemo(() => {
    if (!selectedRuleType) return null;
    return ruleTemplateMap[selectedRuleType] || null;
  }, [selectedRuleType, ruleTemplateMap]);
  
  // 当切换规则模板时，自动同步激活的市场页签
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.marketList && selectedTemplate.marketList.length > 0) {
      console.log('📡 同步激活的市场页签:', {
        ruleType: selectedTemplate.ruleType,
        firstMarketId: selectedTemplate.marketList[0].marketId
      });
      // 默认切换到第一个市场
      setActiveMarketTab(selectedTemplate.marketList[0].marketId.toString());
    }
  }, [selectedTemplate]);

  // 获取所有市场ID
  const marketIds = selectedTemplate ? getUtils(selectedRuleType).getAllMarketIds(selectedTemplate) : [];

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
  const renderRealDataContent = (ruleType: string, marketId: number, securityGroup: SecurityGroup) => {
    const utils = getUtils(ruleType);
    const templateConfig = utils.getRuleTemplateConfig(ruleType);
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
          console.error('🔍 === 开始处理模板项 ===');
          console.error('🔍 模板内容:', item.template);
          console.error('🔍 utils.isMonitor:', utils.isMonitor);
          console.error('🔍 utils.renderMultiThreshold:', utils.renderMultiThreshold);
          console.error('🔍 当前规则类型:', selectedRuleType);

          // 如果是监控版本，显示三级阈值（使用三个数字框）
          if (utils.isMonitor && utils.renderMultiThreshold) {
            console.error('🔍 进入监控版本分支');
            const renderedTemplate = utils.renderMultiThreshold(item.template, securityGroup);

            // 调试日志
            console.error('🔍 监控版本渲染模板:', renderedTemplate);
            console.error('🔍 模板原始字符串:', JSON.stringify(renderedTemplate));
            console.error('🔍 模板是否包含unit-suffix:', renderedTemplate.includes('unit-suffix'));
            console.error('🔍 模板是否包含multi-threshold:', renderedTemplate.includes('multi-threshold'));

            // 解析三级阈值数据 - 使用更宽松的正则表达式
            const match = renderedTemplate.match(/<span class="multi-threshold">(.*?)<\/span>\s*<span class="unit-suffix">(.*?)<\/span>/);
            console.error('🔍 正则匹配结果:', match);
            if (match) {
              console.error('🔍 匹配到的完整数组:', match);
              const [, thresholdContent, unitSuffix] = match;
              console.error('🔍 解析到的阈值内容:', thresholdContent);
              console.error('🔍 解析到的单位:', unitSuffix);
              console.error('🔍 单位字符串:', JSON.stringify(unitSuffix));
              console.error('🔍 单位长度:', unitSuffix ? unitSuffix.length : 0);
              console.error('🔍 单位是否为空:', unitSuffix === '');
              console.error('🔍 单位是否为空字符串:', unitSuffix === '');
              console.error('🔍 单位是否为undefined:', unitSuffix === undefined);
              console.error('🔍 单位是否为null:', unitSuffix === null);

              // 解析不提示、预警、拦截三个值
              const thresholdMatch = thresholdContent.match(/不提示:([^\/]+)\/预警:([^\/]+)\/拦截:([^\/]+)/);
              console.error('🔍 三级阈值解析结果:', thresholdMatch);
              if (thresholdMatch) {
                const [, notipValue, warningValue, interceptValue] = thresholdMatch;
                console.error('🔍 开始替换，阈值值:', notipValue, warningValue, interceptValue);
                console.error('🔍 单位:', unitSuffix);
                console.error('🔍 单位JSON:', JSON.stringify(unitSuffix));

                // 将 multi-threshold 替换为三个数字框 - 使用全局替换
                const finalTemplate = renderedTemplate.replace(
                  /<span class="multi-threshold">.*?<\/span>\s*<span class="unit-suffix">.*?<\/span>/g,
                  `<div class="inline-flex items-center gap-1">
                    <div class="px-2 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">${notipValue}</div>
                    <div class="px-2 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">${warningValue}</div>
                    <div class="px-2 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">${interceptValue}</div>
                    <span class="font-medium ml-1">${unitSuffix}</span>
                  </div>`
                );

                console.error('🔍 替换后的模板:', finalTemplate);

                return (
                  <div key={index} className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
                    <span className="font-medium" dangerouslySetInnerHTML={{ __html: finalTemplate }} />
                  </div>
                );
              }
            }

            // 如果解析失败，回退到原来的显示方式
            console.error('🔍 监控版本解析失败，使用回退方式');
            console.error('🔍 回退前的模板:', renderedTemplate);

            return (
              <div key={index} className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
                <span
                  className="font-medium"
                  dangerouslySetInnerHTML={{
                    __html: renderedTemplate.replace(
                      /<span class="multi-threshold">(.*?)<\/span>\s*<span class="unit-suffix">(.*?)<\/span>/g,
                      (match, thresholdContent, unitSuffix) => {
                        console.error('🔍 回退处理 - 阈值内容:', thresholdContent);
                        console.error('🔍 回退处理 - 单位:', unitSuffix);

                        // 尝试解析三级阈值
                        const thresholdMatch = thresholdContent.match(/不提示:([^\/]+)\/预警:([^\/]+)\/拦截:([^\/]+)/);
                        console.error('🔍 回退处理 - 三级阈值解析结果:', thresholdMatch);

                        if (thresholdMatch) {
                          const [, notipValue, warningValue, interceptValue] = thresholdMatch;
                          console.error('🔍 回退处理 - 解析成功，值:', notipValue, warningValue, interceptValue);
                          return `<div class="inline-flex items-center gap-1">
                            <div class="px-2 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">${notipValue}</div>
                            <div class="px-2 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">${warningValue}</div>
                            <div class="px-2 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">${interceptValue}</div>
                            <span class="font-medium ml-1">${unitSuffix}</span>
                          </div>`;
                        } else {
                          // 如果解析失败，使用原来的显示方式
                          console.error('🔍 回退处理 - 解析失败，使用原样显示');
                          return `<span class="px-4 py-1 bg-white border border-gray-200 rounded text-center min-w-[200px] text-[#1890ff] font-medium">${thresholdContent}</span><span class="font-medium ml-1">${unitSuffix}</span>`;
                        }
                      }
                    )
                  }}
                />
              </div>
            );
          } else {
            console.error('🔍 进入标准版本分支');
            // 标准版本，显示三个阈值（不提示、预警、拦截）
            // 获取三个级别的阈值
            // 获取三个级别的阈值值
            const notipTemplate = utils.renderTemplate(item.template, securityGroup, RiskLevel.NOTIP);
            const warningTemplate = utils.renderTemplate(item.template, securityGroup, RiskLevel.WARNING);
            const interceptTemplate = utils.renderTemplate(item.template, securityGroup, RiskLevel.INTERCEPT);

            console.error('🔍 不提示模板:', notipTemplate);
            console.error('🔍 预警模板:', warningTemplate);
            console.error('🔍 拦截模板:', interceptTemplate);

            // 首先尝试检查是否有三级阈值数据
            console.error('🔍 检查模板中是否包含三级阈值格式');

            // 检查不提示模板中是否包含"不提示:"格式
            if (notipTemplate.includes('不提示:') && notipTemplate.includes('预警:') && notipTemplate.includes('拦截:')) {
              console.error('🔍 检测到三级阈值格式，尝试解析');

              // 尝试从模板中提取三级阈值
              const multiThresholdMatch = notipTemplate.match(/不提示:([^<]+)\/预警:([^<]+)\/拦截:([^<]+)/);
              if (multiThresholdMatch) {
                console.error('🔍 成功解析三级阈值:', multiThresholdMatch);
                const [, notipValue, warningValue, interceptValue] = multiThresholdMatch;

                // 提取单位
                const unitMatch = notipTemplate.match(/<span class="unit-suffix">(.*?)<\/span>/);
                const unit = unitMatch ? unitMatch[1] : '';

                // 将模板中的三级阈值替换为三个数字框
                const renderedTemplate = notipTemplate.replace(
                  /不提示:([^<]+)\/预警:([^<]+)\/拦截:([^<]+)<span class="unit-suffix">(.*?)<\/span>/,
                  `<div class="inline-flex items-center gap-1">
                    <div class="px-2 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">${notipValue}</div>
                    <div class="px-2 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">${warningValue}</div>
                    <div class="px-2 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">${interceptValue}</div>
                    <span class="font-medium ml-1">${unit}</span>
                  </div>`
                );

                return (
                  <div key={index} className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
                    <span className="font-medium" dangerouslySetInnerHTML={{ __html: renderedTemplate }} />
                  </div>
                );
              }
            }

            // 如果没有三级阈值格式，使用原来的逻辑
            console.error('🔍 未检测到三级阈值格式，使用标准版本逻辑');

            // 提取阈值值和单位
            const extractThreshold = (template: string) => {
              const match = template.match(/<span class="threshold-value">(.*?)<\/span><span class="unit-suffix">(.*?)<\/span>/);
              if (match) {
                const [, value, unit] = match;
                return { value, unit };
              }
              return { value: '-', unit: '' };
            };

            const notipData = extractThreshold(notipTemplate);
            const warningData = extractThreshold(warningTemplate);
            const interceptData = extractThreshold(interceptTemplate);

            console.error('🔍 提取的阈值数据:', { notipData, warningData, interceptData });

            // 使用第一个非空单位
            const unit = notipData.unit || warningData.unit || interceptData.unit;

            // 将模板中的占位符替换为三个数字框
            const renderedTemplate = notipTemplate.replace(
              /<span class="threshold-value">.*?<\/span><span class="unit-suffix">.*?<\/span>/,
              `<div class="inline-flex items-center gap-1">
                <div class="px-2 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">${notipData.value}</div>
                <div class="px-2 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">${warningData.value}</div>
                <div class="px-2 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">${interceptData.value}</div>
                <span class="font-medium ml-1">${unit}</span>
              </div>`
            );

            return (
              <div key={index} className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
                <span className="font-medium" dangerouslySetInnerHTML={{ __html: renderedTemplate }} />
              </div>
            );
          }
        })}
      </div>
    );
  };

  // 渲染预警级别配置
  const renderWarningContent = (ruleType: string, marketId: number, securityGroup: SecurityGroup) => {
    const utils = getUtils(ruleType);
    const templateConfig = utils.getRuleTemplateConfig(ruleType);
    if (!templateConfig || templateConfig.length === 0) {
      return null;
    }

    // 监控版本不单独显示预警级别（因为已经包含在三级阈值中）
    if (utils.isMonitor) {
      return null;
    }

    // 标准版本显示三个阈值（不提示、预警、拦截）
    return (
      <div className="py-4 px-6 flex flex-col gap-6 bg-gray-50/50 rounded-md border border-gray-100">
        {templateConfig.map((item, index) => {
          // 获取三个级别的阈值
          const notipTemplate = utils.renderTemplate(item.template, securityGroup, RiskLevel.NOTIP);
          const warningTemplate = utils.renderTemplate(item.template, securityGroup, RiskLevel.WARNING);
          const interceptTemplate = utils.renderTemplate(item.template, securityGroup, RiskLevel.INTERCEPT);

          // 提取阈值值和单位
          const extractThreshold = (template: string) => {
            const match = template.match(/<span class="threshold-value">(.*?)<\/span><span class="unit-suffix">(.*?)<\/span>/);
            if (match) {
              const [, value, unit] = match;
              return { value, unit };
            }
            return { value: '-', unit: '' };
          };

          const notipData = extractThreshold(notipTemplate);
          const warningData = extractThreshold(warningTemplate);
          const interceptData = extractThreshold(interceptTemplate);

          // 使用第一个非空单位
          const unit = notipData.unit || warningData.unit || interceptData.unit;

          // 将模板中的占位符替换为三个数字框
          const renderedTemplate = notipTemplate.replace(
            /<span class="threshold-value">.*?<\/span><span class="unit-suffix">.*?<\/span>/,
            `<div class="inline-flex items-center gap-1">
              <div class="px-2 py-1 bg-white border border-gray-200 rounded-l text-center min-w-[60px] text-[#1890ff] font-medium">${notipData.value}</div>
              <div class="px-2 py-1 bg-white border-y border-r border-gray-200 text-center min-w-[60px] text-[#1890ff] font-medium">${warningData.value}</div>
              <div class="px-2 py-1 bg-white border-y border-r border-gray-200 rounded-r text-center min-w-[60px] text-[#1890ff] font-medium">${interceptData.value}</div>
              <span class="font-medium ml-1">${unit}</span>
            </div>`
          );

          return (
            <div key={index} className="flex items-center gap-3 text-gray-700 flex-wrap leading-loose">
              <span className="font-medium" dangerouslySetInnerHTML={{ __html: renderedTemplate }} />
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
          <Title level={4} style={{ margin: 0, color: '#333' }}>查看指标模板配置详情</Title>
        </div>
        <Space>
          <Button onClick={handleBack}>返回</Button>
          <Button type="primary" className="bg-[#1890ff] hover:!bg-[#096dd9] border-none">编辑配置</Button>
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
        <Card bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }} className="shadow-sm rounded-lg flex-1 overflow-hidden min-h-[600px]">
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
                    <div className="flex-1 p-6 bg-white flex flex-col">
                      {selectedTemplate ? (
                        <div className="w-full flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 shrink-0">
                            <div className="w-1 h-4 bg-[#1890ff] rounded"></div>
                            <span className="text-lg font-bold text-gray-800">{getRuleNameByType(selectedRuleType)} - 参数配置</span>
                          </div>

                          <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden flex-1 min-h-0">
                            <Tabs
                              activeKey={activeMarketTab}
                              onChange={setActiveMarketTab}
                              className="market-tabs flex-1 min-h-0"
                              tabBarStyle={{ marginBottom: 0, padding: '0 16px', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
                              items={marketIds.map(marketId => {
                                const utils = getUtils(selectedRuleType);
                                const marketData = utils.getMarketData(selectedTemplate, marketId);
                                const marketName = utils.getMarketName(marketId);

                                return {
                                  key: marketId.toString(),
                                  label: <span className="font-medium text-[#1890ff] px-2">{marketName}</span>,
                                  children: (
                                    <div className="p-4 bg-white h-full overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                                      {marketData && marketData.securityGroupList.length > 0 ? (
                                        <Collapse defaultActiveKey={marketData.securityGroupList.map(sg => sg.securityGroupId.toString())} className="bg-white border border-gray-200 rounded-lg" expandIconPosition="end">
                                          {marketData.securityGroupList.map(securityGroup => (
                                            <Panel
                                              key={securityGroup.securityGroupId}
                                              header={<span className="font-bold text-gray-800">{securityGroup.securityGroupName || utils.getSecurityGroupName(securityGroup.securityGroupId)}</span>}
                                              className="border-b border-gray-200 last:border-none"
                                            >
                                              {/* 拦截阈值 */}
                                              <div className="mb-6">
                                                <div className="text-sm font-medium text-gray-600 mb-3">
                                                  {/* {utils.isMonitor ? '三级阈值（不提示/预警/拦截）：' : '拦截阈值：'} */}
                                                </div>
                                                {renderRealDataContent(selectedRuleType, marketId, securityGroup)}
                                              </div>

                                              {/* 预警阈值（仅标准版本显示） */}
                                              {!utils.isMonitor && (
                                                <div>
                                                  <div className="text-sm font-medium text-gray-600 mb-3">预警阈值：</div>
                                                  {renderWarningContent(selectedRuleType, marketId, securityGroup)}
                                                </div>
                                              )}
                                            </Panel>
                                          ))}
                                        </Collapse>
                                      ) : (
                                        <div className="text-center text-gray-500 py-8">
                                          暂无证券组配置
                                        </div>
                                      )}
                                    </div>
                                  )
                                };
                              })}
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
          const viewSelectedSystemsSet = new Set<string>();
          const traverse = (node: any) => {
            if (node.type === 'rule' && node.field === 'system' && node.values) {
              node.values.forEach((v: string) => viewSelectedSystemsSet.add(v));
            } else if (node.children) {
              node.children.forEach(traverse);
            }
          };
          traverse(currentDetailGroup.filterConditions.conditionTree);
          const viewSelectedSystems = Array.from(viewSelectedSystemsSet);

          return (
            <div className="max-h-[60vh] overflow-y-auto pr-2 py-4 bg-gray-50/50 px-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {viewSelectedSystems.map(sys => (
                  <div key={sys} className="bg-white border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-blue-50 to-white px-5 py-4 border-b border-blue-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <AppstoreFilled className="text-blue-600 text-lg" />
                      </div>
                      <span className="font-bold text-blue-900 text-lg truncate" title={sys}>{sys}</span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col gap-4 bg-white">
                      <div className="flex flex-col items-center justify-center h-full py-6 text-gray-400">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                          <IdcardOutlined className="text-xl opacity-50" />
                        </div>
                        <span className="text-sm">包含该系统所有账户</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

export default RuleTemplateConfigViewNew;