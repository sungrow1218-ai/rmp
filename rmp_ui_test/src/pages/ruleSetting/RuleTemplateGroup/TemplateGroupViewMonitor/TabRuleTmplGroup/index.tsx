import React, { useEffect, useMemo, useState } from 'react';
import styles from './styles.less';
import LeftTree from '../../components/LeftTree';
import RuleTemplate from '../../components/RuleTemplate';
import { Mode, RuleTypeTemplate } from '../../type';
import { IRuleConfigurationItem } from '@/pages/ruleSetting/type';
import {
  RuleTemplateDefaultIDTO,
  RuleTemplateGroupIDTO,
  RuleTemplateIDTO,
} from '@/services/ruleSetting/idto';
import {
  queryRuleTemplate,
  queryRuleTemplateDefaultConfiguration,
} from '@/services/ruleSetting';
import {
  getLeafNodesAdvanced,
  // mergeDefaultParamAndValue,
} from '../../TemplateGroupEdit/util';
import { mergeDefaultParamAndValue } from '../../TemplateGroupEditMonitor/util';
import { Empty } from 'antd';
import CONFIG from '../../configMonitor';

interface IProp {
  ruleTypeTree: IRuleConfigurationItem[];
  groupInfo: RuleTemplateGroupIDTO;
}

const TabRuleTmplGroup: React.FC<IProp> = ({ ruleTypeTree, groupInfo }) => {
  const [selectedRuleType, setSelectedRuleType] = useState<string>();

  // 用于透传
  const [ruleTemplateMap, setRuleTemplateMap] = useState<{
    [key: string]: RuleTypeTemplate;
  }>({});

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
        if (groupInfo) {
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
            const templateData =
              templateRes?.data.resultList.find(
                (i) => i.ruleType === item.ruleType
              ) || ({} as RuleTemplateIDTO);
            const defaultData = JSON.parse(
              item.configuration
            ) as RuleTemplateDefaultIDTO;
            result[item.ruleType] = mergeDefaultParamAndValue(
              defaultData,
              templateData
            );
          } catch (error) {
            continue;
          }
        }
        setRuleTemplateMap(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [getRuleTypes]);

  useEffect(() => {
    for (const item of getRuleTypes) {
      if (
        groupInfo?.ruleTemplateList.map((i) => i.ruleType).includes(item.Id)
      ) {
        setSelectedRuleType(item.Id);
        return;
      }
    }
  }, [groupInfo, getRuleTypes]);

  return (
    <div className={styles.content} style={{ height: '100%' }}>
      <div className={styles.left}>
        <LeftTree
          template={ruleTypeTree}
          onSelect={(ruleType) => setSelectedRuleType(ruleType)}
          mode={Mode.VIEW}
          filterRuleTypes={groupInfo.ruleTemplateList.map((i) => i.ruleType)}
          selectedKey={selectedRuleType as React.Key}
        />
      </div>
      <div className={styles.right}>
        {selectedRuleType && ruleTemplateMap[selectedRuleType] ? (
          <RuleTemplate
            ruleType={selectedRuleType}
            mode={Mode.VIEW}
            template={ruleTemplateMap[selectedRuleType]}
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
  );
};

export default TabRuleTmplGroup;
