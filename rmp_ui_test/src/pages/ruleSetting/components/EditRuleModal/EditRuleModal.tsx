import React, { useMemo } from 'react';
import { ConfigProvider, Modal } from 'antd';
import { DictCodeEnumType } from '@/utils/dict';
import { FORM_MODES } from '../../constant';
import RuleTypeEditForm from './RuleTypeEditForm';
import { SobInfo } from '@/services/account';
import styles from './style.less';

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
  [FORM_MODES.ADD]: '新增',
  [FORM_MODES.EDIT]: '编辑',
  [FORM_MODES.ADD_VIA_COPY]: '新增',
  [FORM_MODES.PREVIEW]: '浏览',
};

const EditFormNotFound = () => {
  return <div>未找到对应规则类型的表单</div>;
};

const EditRuleModal: React.FC<Props> = ({
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
  const validateMode = Object.values(FORM_MODES).includes(mode);
  const title = ModeToTitleMap[mode] || '未知模式';
  return (
    <ConfigProvider
      getPopupContainer={(node: any) => {
        if (node) {
          return node.parentNode;
        }
        return document.body;
      }}
    >
      <Modal
        title={title}
        destroyOnClose={true}
        open={true}
        footer={false}
        onCancel={() => {
          onClose();
        }}
        width={1600}
        wrapClassName="resised"
      >
        {validateMode ? (
          <div className={styles.content}>
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
          </div>
        ) : null}
      </Modal>
    </ConfigProvider>
  );
};

export default EditRuleModal;
