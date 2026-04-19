import React, { useMemo, useRef, useState } from 'react';
import { Button, Modal } from '@ht/sprite-ui';

import { TypeSelectorPool } from '@/pages/securityPool/contants/tyeping';
import PoolFormEdit from './PoolForm';
import { isArray, isEmpty } from 'lodash';
import { TRADING_MARKETS } from '@/utils/dict';
import SeatGroup from '../../SeatGroup';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';

interface Props {
  mode: 'ADD' | 'EDIT';
  levelType: 'PoolLevelForm';
  selectRecord?: any;
  treeKey?: any;
  onClose: () => void;
  reFresh: (p?: any) => void;
}
const optipns = transformDictToSelectOptionsNumber(
  TRADING_MARKETS.filter((tm) => ['1', '2'].includes(tm.code))
);
const EditPoolLevelModal: React.FC<Props> = ({
  mode,
  selectRecord,
  levelType,
  onClose,
  reFresh,
  treeKey,
}) => {
  const ModeToTitleMap = {
    ADD: {
      PoolLevelForm: '新增席位组',
      PoolDetailForm: '新增证券',
    },
    EDIT: {
      PoolLevelForm: '修改席位组',
      PoolDetailForm: '修改证券',
    },
  };
  const validateMode = ['ADD', 'EDIT'].includes(mode);
  const modeType = ModeToTitleMap[mode];
  const title = modeType[levelType] || '未知模式';
  const poolFormRef = useRef<{
    getFormValueAsync: () => Promise<
      TypeSelectorPool<typeof levelType> | undefined
    >;
  }>(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const EditPoolLeftForm = useMemo(() => PoolFormEdit[levelType], [levelType]);
  const defaultValues = useMemo(() => {
    setBtnLoading(false);
    const defaultValue = { ...selectRecord };
    return isEmpty(defaultValue) ? undefined : defaultValue;
  }, [levelType, mode, selectRecord]);

  const handleSubmit = async () => {
    try {
      setBtnLoading(true);
      const info = await poolFormRef.current?.getFormValueAsync();
      if (info) {
        reFresh(levelType);
      } else {
        setBtnLoading(false);
      }
    } catch (error) {
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <Modal
      title={title}
      destroyOnClose={true}
      open={true}
      maskClosable={false}
      onCancel={() => {
        onClose();
      }}
      transitionName={''}
      maskTransitionName={''}
      centered={true}
      width={528}
      footer={[
        <Button
          key="back"
          onClick={() => {
            onClose();
          }}
        >
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={btnLoading}
        >
          确认
        </Button>,
      ]}
    >
      {validateMode ? (
        <EditPoolLeftForm
          ref={poolFormRef}
          mode={mode}
          onClose={onClose}
          formType={levelType}
          defaultValues={defaultValues}
        />
      ) : (
        '未找到对应的表单'
      )}
    </Modal>
  );
};

export default EditPoolLevelModal;
