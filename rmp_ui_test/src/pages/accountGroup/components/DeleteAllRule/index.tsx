import { BasicForm, FormActionType } from '@/components/Form';
import {
  AccountGroupRelationResultList,
  modifyAccountGroupRelation,
  modifyAccountGroupRelationParams,
} from '@/services/accountGroup';
import { queryRuleTemplateGroup } from '@/services/ruleSetting';
import { RuleTemplateGroupIDTO } from '@/services/ruleSetting/idto';
import { PaginationType } from '@/services/typing';
import { Modal } from '@ht/sprite-ui';
import { useMemoizedFn } from 'ahooks';
import { Button, message, Radio, RadioChangeEvent, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';

export interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setIsOpenRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  unbindAccount: () => Promise<void>;
}

const DeleteAllRule: React.FC<IProps> = ({
  open,
  setOpen,
  setIsOpenRefetch,
  unbindAccount,
}) => {
  return (
    <Modal
      title={<>批量解除绑定</>}
      open={open}
      centered={true}
      onOk={() => {
        unbindAccount();
        setIsOpenRefetch(true);
      }}
      onCancel={() => setOpen(false)}
      destroyOnClose={true}
    >
      <>
        解除绑定后,该账户组下将不在关联所有的规则模板。
        <br /> 请确认是否解除绑定
      </>
    </Modal>
  );
};

export default DeleteAllRule;
