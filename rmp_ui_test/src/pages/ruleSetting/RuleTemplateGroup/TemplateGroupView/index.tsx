import React, { useMemo, useRef } from 'react';
import styles from './styles.less';
import { Button, Tabs } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import TabRuleTmplGroup from './TabRuleTmplGroup';
import TabAccountGroup from './TabAccountGroup';
import { useHeightResize } from '@/hooks';
import { IRuleConfigurationItem } from '../../type';
import { RuleTemplateGroupIDTO } from '@/services/ruleSetting/idto';
import dayjs from 'dayjs';
import { AllSobInfo } from '../../components/allSobInfo';
import { Status } from '../type';

interface IProps {
  onVisableChange: (value: boolean) => void;
  ruleTypeTree: IRuleConfigurationItem[];
  groupInfo: RuleTemplateGroupIDTO;
  accountType?: {
    [key: string]: string;
  };
  workGroupId: number;
  allSobInfo?: AllSobInfo[];
  showBackBtn?: boolean;
  showAccountGroupTab?: boolean;
}

const TemplateGroupView: React.FC<IProps> = ({
  onVisableChange,
  ruleTypeTree,
  groupInfo,
  accountType,
  allSobInfo,
  workGroupId,
  showBackBtn = true,
  showAccountGroupTab = true,
}) => {
  const domRef = useRef(null);
  const domHeight = useHeightResize(domRef);

  const getTabItems = useMemo(() => {
    const tabItems = [
      {
        key: 'tabRuleTmplGroup',
        label: '指标组详情',
        children: (
          <div style={{ height: `${domHeight - 193}px` }}>
            <TabRuleTmplGroup
              groupInfo={groupInfo}
              ruleTypeTree={ruleTypeTree}
            />
          </div>
        ),
      },
    ];
    if (showAccountGroupTab) {
      tabItems.push({
        key: 'tabAccountGroup',
        label: '关联账户组',
        children: (
          <div style={{ height: `${domHeight - 193}px` }}>
            <TabAccountGroup
              ruleTemplateGroup={groupInfo}
              allSobInfo={allSobInfo}
              accountType={accountType}
              workGroupId={workGroupId}
            />
          </div>
        ),
      });
    }
    return tabItems;
  }, [
    domHeight,
    groupInfo,
    ruleTypeTree,
    showAccountGroupTab,
    allSobInfo,
    accountType,
    workGroupId,
  ]);

  return (
    <div className={styles.pageStyle}>
      {showBackBtn ? (
        <div className={styles.header}>
          <Button onClick={() => onVisableChange(false)}>
            <RollbackOutlined />
            返回
          </Button>
          <div className={styles.title}>浏览规则组</div>
        </div>
      ) : null}
      <div className={styles.wrapper} ref={domRef}>
        <div className={styles.groupHeader}>
          <div className={styles.groupName} title={groupInfo.ruleTmplGroupName}>
            {groupInfo.ruleTmplGroupName}
          </div>
          {groupInfo.status === Status.ENABLE ? (
            <div className={styles.statusTagEnable}>已启用</div>
          ) : (
            <div className={styles.statusTagDisable}>已停用</div>
          )}
        </div>
        <div className={styles.baseInfo}>
          <div>创建人：{groupInfo.createUserCode}</div>
          <div>
            创建时间：
            {dayjs(groupInfo.createTime, 'YYYYMMDDHHmmss').format(
              'YYYY-MM-DD HH:mm:ss'
            )}
          </div>
          <div>
            最新更新时间：
            {dayjs(groupInfo.lastUpdateTime, 'YYYYMMDDHHmmss').format(
              'YYYY-MM-DD HH:mm:ss'
            )}
          </div>
        </div>
        <div className={styles.desc}>
          描述：
          <span title={groupInfo.description}>{groupInfo.description}</span>
        </div>
        <div className={styles.tabs}>
          <Tabs
            defaultActiveKey="tabRuleTmplGroup"
            style={{ width: '100%' }}
            items={getTabItems}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateGroupView;
