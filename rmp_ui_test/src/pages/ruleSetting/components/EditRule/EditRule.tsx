import React, { useMemo } from 'react';
import styles from './styles.less';
import { Button, ConfigProvider } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { FORM_MODES } from '../../constant';
import {
  DictCodeEnumType,
  RULE_TYPE_LEVEL_2,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import { SobInfo } from '@/services/account';
import RuleTypeEditForm from '../EditRuleModal/RuleTypeEditForm';

interface Props {
  mode: keyof typeof FORM_MODES;
  ruleType: DictCodeEnumType['RULE_TYPE_LEVEL_2'];
  record: any;
  onClose: () => void;
  refetch: () => void;
  sobInfo?: SobInfo;
  workGroupId: number;
  notShowFoot?: boolean;
}

const ModeToTitleMap = {
  [FORM_MODES.ADD]: '新增规则',
  [FORM_MODES.EDIT]: '编辑规则',
  [FORM_MODES.ADD_VIA_COPY]: '新增规则',
  [FORM_MODES.PREVIEW]: '浏览规则',
};

const EditFormNotFound = () => {
  return <div>未找到对应规则类型的表单</div>;
};

const EditRule: React.FC<Props> = ({
  refetch,
  mode,
  record,
  ruleType,
  onClose,
  sobInfo,
  workGroupId,
  notShowFoot,
}) => {
  const EditForm = useMemo(() => {
    if (ruleType) {
      return RuleTypeEditForm[ruleType];
    }
    return EditFormNotFound;
  }, [ruleType]);

  const ruleTypeName = useMemo(
    () => transformDictCodeToNameHelper(ruleType, RULE_TYPE_LEVEL_2),
    [ruleType]
  );

  const showFooter = useMemo(
    () => mode !== 'PREVIEW' && !notShowFoot,
    [mode, notShowFoot]
  );

  return (
    <div className={styles.editRule}>
      <div className={styles.header}>
        <Button onClick={onClose}>
          <RollbackOutlined />
          返回
        </Button>
        <div className={styles.title}>{ModeToTitleMap[mode] || '未知模式'}</div>
        <div className={styles.ruleName}>
          <div style={{ marginRight: '40px' }}>{ruleType}</div>
          <div>{ruleTypeName}</div>
        </div>
      </div>
      <div
        className={styles.wrapper}
        style={{ padding: showFooter ? '40px 0 64px' : '40px 0 0' }}
      >
        <div className={styles.content}>
          <ConfigProvider
            theme={{
              components: {
                Collapse: {
                  headerBg: '#FBFBFB',
                  contentBg: '#FFFFFF',
                },
              },
            }}
          >
            <EditForm
              refetch={refetch}
              mode={mode}
              onClose={onClose}
              record={record}
              sobInfo={record?.sobInfo ?? sobInfo}
              workGroupId={
                workGroupId !== -1 ? workGroupId : record?.workGroupId ?? 1
              }
              notShowFoot={notShowFoot}
            />
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};

export default EditRule;
