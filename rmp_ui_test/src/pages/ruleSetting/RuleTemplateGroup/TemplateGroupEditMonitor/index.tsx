// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-depth */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-nested-callbacks */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.less';
import { Button, Empty, message, Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { Mode, RuleTypeTemplate, Status } from '../type';
import CollapseItem from '../components/CollapseItem';
import { BasicForm, FormActionType } from '@/components/Form';
import LeftTree from '../components/LeftTree';
import RuleTemplate, {
  IAction as RuleTemplateAction,
} from '../components/RuleTemplate';
import { IRuleConfigurationItem } from '../../type';
import {
  modifyRuleTemplateGroup,
  queryRuleTemplate,
  queryRuleTemplateDefaultConfiguration,
} from '@/services/ruleSetting';
import {
  ModifyRuleTemplateGroupParams,
  RuleTemplateDefaultIDTO,
  RuleTemplateGroupIDTO,
} from '@/services/ruleSetting/idto';
import {
  getLeafNodesAdvanced,
  mergeDefaultParamAndValue,
  parseRuleTypeTemplateToModRuleTmpList,
} from './util';
import { formSchemas } from './data';
import { cloneDeep, isEqual } from 'lodash';
import { usePrevious } from 'ahooks';
import { useHeightResize } from '@/hooks';
import CONFIG from '../configMonitor';

const ModeToTitleMap = {
  [Mode.ADD]: '新增规则组',
  [Mode.EDIT]: '编辑规则组',
  [Mode.CLONE]: '新增规则组',
};

interface Props {
  mode: Mode.ADD | Mode.EDIT | Mode.CLONE;
  onVisableChange: (value: boolean) => void;
  workGroupId: number;
  ruleTypeTree: IRuleConfigurationItem[];
  groupInfo?: RuleTemplateGroupIDTO;
  onRefresh: () => void;
}

const TemplateGroupEditMonitor: React.FC<Props> = ({
  mode,
  onVisableChange,
  workGroupId,
  ruleTypeTree,
  groupInfo,
  onRefresh,
}) => {
  const basicFormRef = useRef<FormActionType>(null);
  const ruleTemplateRef = useRef<RuleTemplateAction>(null);

  const [enable, setEnable] = useState<boolean>(true);
  // 用于透传
  const [ruleTemplateMap, setRuleTemplateMap] = useState<{
    [key: string]: RuleTypeTemplate;
  }>({});
  // 用于存储改变
  const ruleTemplateMapRef = useRef<{
    [key: string]: RuleTypeTemplate;
  }>({});
  // 用于缓存比较
  const cacheRuleTemplateMapRef = useRef<{
    [key: string]: RuleTypeTemplate;
  }>({});

  const [selectedRuleType, setSelectedRuleType] = useState<string>();

  const getRuleTypes = useMemo(() => {
    const ruleTypes = getLeafNodesAdvanced<IRuleConfigurationItem>(
      ruleTypeTree,
      'SubList'
    );
    return ruleTypes || [];
  }, [ruleTypeTree]);

  useEffect(() => {
    const fetch = async () => {
      try {
        // 默认配置
        const defaultRes = await queryRuleTemplateDefaultConfiguration(
          getRuleTypes.map((i) => i.Id)
        );
        // 已有配置
        let templateRes;
        if ((mode === Mode.EDIT || mode === Mode.CLONE) && groupInfo) {
          const { ruleTmplGroupName, description, status } = groupInfo;
          basicFormRef.current?.setFieldsValue({
            ruleTmplGroupName: `${
              mode === Mode.CLONE ? '复制' : ''
            }${ruleTmplGroupName}`,
            description,
          });
          setEnable(status === Status.ENABLE);
          templateRes = await queryRuleTemplate({
            pageId: 1,
            pageSize: 1000,
            authorityFlag: 0,
            filterCondition: [{ ruleTmplGroupId: groupInfo.ruleTmplGroupId }],
          });
        }
        // 合并模板+已有配置
        const result: {
          [key: string]: RuleTypeTemplate;
        } = {};
        for (const item of defaultRes.data.resultList || []) {
          try {
            const templateData = templateRes?.data.resultList.find(
              (i) => i.ruleType === item.ruleType
            );
            const defaultData = JSON.parse(
              item.configuration
            ) as RuleTemplateDefaultIDTO;
            result[item.ruleType] = mergeDefaultParamAndValue(
              defaultData,
              templateData
            );
          } catch (error) {
            console.error(error);
            continue;
          }
        }
        setRuleTemplateMap(result);
        ruleTemplateMapRef.current = cloneDeep(result);
        cacheRuleTemplateMapRef.current = cloneDeep(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [ruleTypeTree, groupInfo]);

  const [checked, setChecked] = useState<string[]>([]);

  const doSave = async () => {
    try {
      // 校验基础信息
      const basicInfo = await basicFormRef.current?.validateFields();
      if (selectedRuleType) {
        // 校验参数信息
        await ruleTemplateRef.current?.validate();
      }
      // 勾选为空
      if (checked.length === 0) {
        message.error('请至少勾选一个规则指标类型');
        return;
      }
      const params: ModifyRuleTemplateGroupParams = {
        modifyType: mode === Mode.ADD || mode === Mode.CLONE ? 1 : 2,
        ruleTmplGroupId:
          mode === Mode.ADD || mode === Mode.CLONE
            ? 0
            : groupInfo
            ? groupInfo.ruleTmplGroupId
            : 0,
        ruleTmplGroupName: basicInfo.ruleTmplGroupName,
        description: basicInfo.description,
        workGroupId,
        status: enable ? Status.ENABLE : Status.DISABLE,
        modRuleTmplList: [],
        delRuleTmplList: [],
      };
      // 遍历所有子节点
      for (const ruleType of getRuleTypes.map((i) => i.Id)) {
        // 启用规则实例
        if (checked.includes(ruleType)) {
          /**
           * 编辑：比较
           * 1.已经存在的规则
           * 2.规则配置没有改变
           */
          if (mode === Mode.EDIT) {
            const isInclude = Boolean(
              groupInfo?.ruleTemplateList.find((i) => i.ruleType === ruleType)
            );
            const isSame = isEqual(
              ruleTemplateMapRef.current[ruleType],
              cacheRuleTemplateMapRef.current[ruleType]
            );
            if (isSame && isInclude) continue;
          }
          if (!ruleTemplateMapRef.current[ruleType]) continue;
          const item = parseRuleTypeTemplateToModRuleTmpList(
            ruleTemplateMapRef.current[ruleType]
          );
          // 克隆：需调整id
          if (mode === Mode.CLONE) {
            item.ruleTemplateId = 0;
            for (const securityItem of item.securityGroupList) {
              securityItem.thresholdList.forEach((i) => {
                i.thresholdId = undefined;
              });
            }
          }
          params.modRuleTmplList!.push(item);
        } else if (
          ruleTemplateMapRef.current[ruleType] &&
          ruleTemplateMapRef.current[ruleType].ruleTemplateId
        ) {
          // 未被启用但是之前已有，则删除
          params.delRuleTmplList!.push({
            ruleTemplateId: ruleTemplateMapRef.current[ruleType].ruleTemplateId,
          });
        }
      }
      // 去除冗余字段
      if (params.modRuleTmplList?.length === 0) delete params.modRuleTmplList;
      if (params.delRuleTmplList?.length === 0) delete params.delRuleTmplList;
      const res = await modifyRuleTemplateGroup(params);
      if (res.errorId !== 0) return;
      message.success('操作成功');
      onRefresh();
      onVisableChange(false);
    } catch (error: any) {
      console.error(error);
      if (error.message) {
        message.error(error.message);
      } else {
        message.error('请正确填写模板组配置信息');
      }
    }
  };

  const prevRuleType = usePrevious(selectedRuleType);

  // 切换ruleType更新数据
  useEffect(() => {
    if (prevRuleType) {
      setRuleTemplateMap((prev) => {
        prev[prevRuleType] = ruleTemplateMapRef.current[prevRuleType];
        return prev;
      });
    }
  }, [selectedRuleType]);

  // 由于没有默认值兜底，切换校验不再需要
  const handleChangeRuleType = async (changedRuleType: string) => {
    if (changedRuleType) {
      setSelectedRuleType(changedRuleType);
    }
  };

  useEffect(() => {
    if (mode === Mode.ADD) {
      setSelectedRuleType(getRuleTypes[0]?.Id || undefined);
    }
    if (mode === Mode.EDIT || mode === Mode.CLONE) {
      for (const item of getRuleTypes) {
        if (
          groupInfo?.ruleTemplateList.map((i) => i.ruleType).includes(item.Id)
        ) {
          setSelectedRuleType(item.Id);
          return;
        }
      }
    }
  }, [groupInfo, mode, getRuleTypes]);

  const domRef = useRef(null);

  const domHeight = useHeightResize(domRef);

  return (
    <div className={styles.pageStyle}>
      <div className={styles.header}>
        <Button onClick={() => onVisableChange(false)}>
          <RollbackOutlined />
          返回
        </Button>
        <div className={styles.title}>{ModeToTitleMap[mode]}</div>
      </div>
      <div className={styles.wrapper}>
        <div style={{ margin: '-4px', padding: '4px', marginBottom: '10px' }}>
          <CollapseItem
            title="基本信息"
            extra={
              <div
                className={styles.required}
                onClick={(e) => e.stopPropagation()}
              >
                是否启用:
                <Switch
                  style={{ marginLeft: '8px' }}
                  checkedChildren="开"
                  unCheckedChildren="关"
                  value={enable}
                  onChange={(val) => setEnable(val)}
                />
                <Tooltip title="启用则按照模板内规则设置生成风控规则，并立即生效">
                  <QuestionCircleOutlined
                    style={{ marginLeft: '8px', color: '#CBCBCB' }}
                  />
                </Tooltip>
              </div>
            }
          >
            <BasicForm
              ref={basicFormRef}
              layout="horizontal"
              baseColProps={{ span: 24 }}
              schemas={formSchemas}
            />
          </CollapseItem>
        </div>
        <div
          ref={domRef}
          style={{
            flex: '1 auto',
            overflow: 'hidden',
            margin: '-4px',
            padding: '4px',
          }}
        >
          <CollapseItem title="选择控制规则">
            <div
              className={styles.content}
              style={{ height: `${domHeight - 48 - 24}px` }}
            >
              <div className={styles.left}>
                <LeftTree
                  template={ruleTypeTree}
                  onSelect={(ruleType) => handleChangeRuleType(ruleType)}
                  onCheck={(val) => setChecked(val)}
                  mode={mode}
                  defaultRuleTypes={
                    groupInfo
                      ? groupInfo.ruleTemplateList.map((i) => i.ruleType)
                      : undefined
                  }
                  selectedKey={selectedRuleType as React.Key}
                />
              </div>
              <div className={styles.right}>
                {selectedRuleType && ruleTemplateMap[selectedRuleType] ? (
                  <RuleTemplate
                    ruleType={selectedRuleType}
                    ref={ruleTemplateRef}
                    mode={mode}
                    template={ruleTemplateMap[selectedRuleType]}
                    onRuleTypeValueChange={(val) => {
                      if (ruleTemplateMapRef.current[selectedRuleType]) {
                        ruleTemplateMapRef.current[selectedRuleType] = val;
                      }
                    }}
                    formTemplate={CONFIG[selectedRuleType]}
                    showRiskLevelOptions={false}
                    showScaleSetting={false}
                    showMarketTabLabel={false}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Empty />
                  </div>
                )}
              </div>
            </div>
          </CollapseItem>
        </div>
      </div>
      <div className={styles.footer}>
        <Button type="primary" onClick={() => doSave()}>
          保存
        </Button>
        <Button
          style={{ marginRight: '16px' }}
          onClick={() => onVisableChange(false)}
        >
          取消
        </Button>
      </div>
    </div>
  );
};

export default TemplateGroupEditMonitor;
