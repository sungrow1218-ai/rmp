import React, { useEffect, useMemo, useRef, useState } from 'react';
import withKeepAlive from '@/wrappers/KeepAlive';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import styles from './styles.less';
import { getIsIfram } from '@/utils/utils';
import PageTitle from '@/components/PageTitle';
import RuleIndex from './RuleIndex';
import useMenuInfo from '@/hooks/useMenuInfo';
import { queryMenuConfig } from '@/services/menu';
import { RuleTypeItem } from './RuleIndex/type';
import { parseToList } from './RuleIndex/util';
import { Select } from 'antd';
import { IRuleConfiguration, IRuleConfigurationItem, ModuleType } from './type';
import TabIndexImgSrc from '@/assets/icon/icon_tab_index.png';
import TabTplGroupImgSrc from '@/assets/icon/icon_tab_tplGroup.png';
import CornerTick from '@/components/CornerTick';
import RuleTemplateGroup from './RuleTemplateGroup';
import {
  queryRuleSetting,
  queryRuleTemplateGroup,
} from '@/services/ruleSetting';

const RuleSetting = () => {
  const isIfram = getIsIfram();

  const [selectedTab, setSelectedTab] = useState<ModuleType>(
    ModuleType.TEMPLATE_GROUP
  );
  const [indexCount, setIndexCount] = useState<number>(0);
  const [tplGroupCount, setTplGroupCount] = useState<number>(0);
  const menuInfo = useMenuInfo();
  const hasGetConfig = useRef(false);
  const [selectedWorkGroup, setSelectedWorkGroup] = useState<number>();
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    []
  );
  const [ruleTypeList, setRuleTypeList] = useState<RuleTypeItem[]>([]);
  const [ruleTmplGroupMap, setRuleTmplGroupMap] = useState<
    Recordable<IRuleConfigurationItem[]>
  >({});

  const [reloadFlag, setReloadFlag] = useState<boolean>(true);

  useEffect(() => {
    // 查询配置
    const queryConfig = async () => {
      try {
        const result = await queryMenuConfig({
          pageId: 1,
          pageSize: 100,
          filterCondition: {
            menuId: menuInfo?.menuId,
          },
        });
        if (result.code !== 0) {
          throw new Error('请求菜单配置失败');
        }
        if (result.data?.resultList?.length) {
          const ruleConfiguration = JSON.parse(
            result.data?.resultList[0]?.displayConfig
          ) as IRuleConfiguration;
          const parseData = parseToList(ruleConfiguration.workGroupList);
          setRuleTypeList(parseData.ruleTypeList);
          setRuleTmplGroupMap(parseData.ruleTmplGroupMap);
        }
      } catch (error: any) {
        console.error(error);
        // error.message && message.error(error.message);
      } finally {
        hasGetConfig.current = true;
      }
    };
    if (menuInfo && menuInfo.menuId && !hasGetConfig.current) {
      queryConfig();
    }
  }, [menuInfo?.menuId]);

  useEffect(() => {
    const optionsMap = new Map();
    for (const item of ruleTypeList) {
      if (!optionsMap.has(item.workGroupId)) {
        optionsMap.set(item.workGroupId, item.workGroupName);
      }
    }
    const list: { label: string; value: number }[] = [];
    for (const [value, label] of optionsMap.entries()) {
      list.push({ label, value });
    }
    setOptions(list);
    if (list.length > 0) {
      setSelectedWorkGroup(list[0].value);
    }
  }, [ruleTypeList]);

  const getFilterRuleTypeList = useMemo(() => {
    if (selectedWorkGroup && ruleTypeList.length >= 0) {
      return ruleTypeList.filter((i) => i.workGroupId === selectedWorkGroup);
    } else {
      return [];
    }
  }, [ruleTypeList, selectedWorkGroup]);

  useEffect(() => {
    if (selectedWorkGroup) {
      queryRuleSetting({
        pageId: 1,
        pageSize: 5000,
        filterCondition: {
          workGroupList: [
            {
              workGroupId: selectedWorkGroup,
              ruleType: [...new Set(ruleTypeList.map((i) => i.ruleTypeId))],
            },
          ],
        },
      }).then((res) => {
        setIndexCount(res.data.totalSize);
      });
      queryRuleTemplateGroup({
        pageId: 1,
        pageSize: 5000,
        filterCondition: [{ workGroupId: selectedWorkGroup }],
      }).then((res) => {
        setTplGroupCount(res.data.totalSize);
      });
    }
  }, [selectedWorkGroup, reloadFlag]);

  const getRuleTmplGroupTree = useMemo(() => {
    if (selectedWorkGroup) {
      return ruleTmplGroupMap[selectedWorkGroup] || [];
    }
    return [];
  }, [ruleTmplGroupMap, selectedWorkGroup]);

  return (
    <div className={`${styles.pageStyle} ${isIfram ? styles.isIfram : ''}`}>
      <PageTitle
        title="规则设置"
        extra={
          <Select
            style={{ width: '200px' }}
            value={selectedWorkGroup}
            options={options}
            onSelect={(val) => setSelectedWorkGroup(val)}
          />
        }
      />
      <div className={styles.pageTabs}>
        <div
          className={
            selectedTab === ModuleType.INDEX
              ? `${styles.tabItem} ${styles.tabItemActive}`
              : styles.tabItem
          }
          onClick={() => setSelectedTab(ModuleType.INDEX)}
        >
          <p>单个规则指标</p>
          <div>
            <div className={styles.count}>{indexCount}</div>
            <img style={{ width: '40px' }} src={TabIndexImgSrc} />
          </div>
          {selectedTab === ModuleType.INDEX ? <CornerTick /> : null}
        </div>
        <div
          className={
            selectedTab === ModuleType.TEMPLATE_GROUP
              ? `${styles.tabItem} ${styles.tabItemActive}`
              : styles.tabItem
          }
          onClick={() => setSelectedTab(ModuleType.TEMPLATE_GROUP)}
        >
          <p>模板生成指标</p>
          <div>
            <div className={styles.count}>{tplGroupCount}</div>
            <img style={{ width: '40px' }} src={TabTplGroupImgSrc} />
          </div>
          {selectedTab === ModuleType.TEMPLATE_GROUP ? <CornerTick /> : null}
        </div>
      </div>
      <div className={styles.pageContent}>
        <div
          style={{
            display: selectedTab === ModuleType.INDEX ? 'flex' : 'none',
            width: '100%',
            flex: 1,
          }}
        >
          <RuleIndex
            ruleTypeList={getFilterRuleTypeList}
            refresh={() => setReloadFlag((prev) => !prev)}
          />
        </div>
        <div
          style={{
            display:
              selectedTab === ModuleType.TEMPLATE_GROUP ? 'flex' : 'none',
            width: '100%',
            flex: 1,
          }}
        >
          <RuleTemplateGroup
            workGroupId={selectedWorkGroup}
            ruleTypeTree={getRuleTmplGroupTree}
            refresh={() => setReloadFlag((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
};
export default withKeepAlive({
  cacheKey: KEEPALIVE_CACHE_KEY.RULE_SETTING,
})(RuleSetting);
