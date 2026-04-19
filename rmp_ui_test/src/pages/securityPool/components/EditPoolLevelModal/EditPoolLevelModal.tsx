import React, { useMemo, useRef, useState } from 'react';
import { Button, Modal } from '@ht/sprite-ui';
import {
  SecurityPoolResponseDTO,
  TypeSelectorPool,
} from '@/pages/securityPool/contants/tyeping';

import { FaultListType } from '@/services/generalLimit';
import { WorkGroupList } from '@/services/account';
import PoolLevelForm from './RebuildPoolForm/PoolLevelForm';
import PoolForm from './RebuildPoolForm/PoolForm';
import PoolDetailForm from './RebuildPoolForm/PoolDetailForm';
import AddDetailForm from './RebuildPoolForm/AddDetailForm';

interface Props {
  mode: 'ADD' | 'EDIT' | 'DELETE';
  levelType: 'PoolForm' | 'PoolLevelForm' | 'AddDetailForm' | 'PoolDetailForm';
  selectRecord?: any;
  treeKey?: any;
  onClose: () => void;
  reFresh: (p?: any) => void;
  openResult?: (data: FaultListType[]) => void;
  authLayerList?: SecurityPoolResponseDTO[];
  workGroupList: WorkGroupList[];
  afterAddSubmit?: () => void;
}

const EditPoolLevelModal: React.FC<Props> = ({
  mode,
  selectRecord,
  levelType,
  onClose,
  reFresh,
  treeKey,
  openResult,
  authLayerList,
  workGroupList,
  afterAddSubmit,
}) => {
  const ModeToTitleMap = {
    ADD: {
      PoolLevelForm: '新增券池分组',
      PoolForm: '新增券池',
      PoolDetailForm: '新增券池明细',
      AddDetailForm: '新增券池明细',
    },
    EDIT: {
      PoolLevelForm: '修改券池分组',
      PoolForm: '修改券池',
      PoolDetailForm: '修改券池明细',
      AddDetailForm: '新增券池明细',
    },
    DELETE: {
      PoolLevelForm: '删除',
      PoolForm: '删除',
      PoolDetailForm: '删除',
      AddDetailForm: '删除',
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

  // const EditPoolLeftForm = useMemo(() => PoolFormEdit[levelType], [levelType]);
  const defaultValues = useMemo(() => {
    setBtnLoading(false);
    let defaultValue = {};
    if (mode === 'EDIT') {
      defaultValue = { ...selectRecord };
    } else if (levelType === 'PoolForm') {
      defaultValue = {
        secuPoolLayerId: selectRecord?.secuPoolLayerId ?? '',
        secuPoolLayerName: selectRecord?.secuPoolLayerName ?? '',
        workGroupId: selectRecord?.workGroupId ?? '',
        workGroupName: selectRecord?.workGroupName ?? '',
      };
    } else if (levelType === 'AddDetailForm') {
      defaultValue = {
        secuPoolId: treeKey,
      };
    } else if (levelType === 'PoolLevelForm') {
      defaultValue = {
        workGroupId: selectRecord?.workGroupId ?? '',
        workGroupName: selectRecord?.workGroupName ?? '',
      };
    }
    return defaultValue;
  }, [levelType, mode, authLayerList, selectRecord]);

  const handleSubmit = async () => {
    try {
      setBtnLoading(true);
      const info: any = await poolFormRef.current?.getFormValueAsync();
      if (info?.faultList) {
        openResult && openResult(info.faultList);
      } else if (info) {
        reFresh(levelType);
        if (
          (levelType === 'PoolForm' || levelType === 'PoolLevelForm') &&
          mode === 'ADD'
        ) {
          afterAddSubmit && afterAddSubmit();
        }
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
      width={levelType === 'AddDetailForm' ? 1500 : 528}
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
      {validateMode && levelType === 'PoolLevelForm' && (
        <PoolLevelForm
          ref={poolFormRef}
          mode={mode}
          onClose={onClose}
          authLayerList={authLayerList || []}
          defaultValues={defaultValues}
          workGroupList={workGroupList}
        />
      )}
      {validateMode && levelType === 'PoolForm' && (
        <PoolForm
          ref={poolFormRef}
          mode={mode}
          onClose={onClose}
          authLayerList={authLayerList || []}
          defaultValues={defaultValues}
          workGroupList={workGroupList}
        />
      )}
      {validateMode && levelType === 'PoolDetailForm' && (
        <PoolDetailForm
          ref={poolFormRef}
          mode={mode}
          onClose={onClose}
          defaultValues={defaultValues}
        />
      )}
      {validateMode && levelType === 'AddDetailForm' && (
        <AddDetailForm
          ref={poolFormRef}
          mode={mode}
          onClose={onClose}
          defaultValues={defaultValues}
        />
      )}
    </Modal>
  );
};

export default EditPoolLevelModal;
