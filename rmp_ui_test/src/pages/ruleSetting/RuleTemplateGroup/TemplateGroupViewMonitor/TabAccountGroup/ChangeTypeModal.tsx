import {
  AccountGroupRelationResultList,
  modifyAccountGroupRelation,
  modifyAccountGroupRelationParams,
  ResponseAccountGroupItem,
} from '@/services/accountGroup';
import { RuleTemplateGroupIDTO } from '@/services/ruleSetting/idto';
import { Modal } from '@ht/sprite-ui';
import { useMemoizedFn } from 'ahooks';
import { Button, message, Radio, RadioChangeEvent, Switch, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

export interface IProps {
  ruleTemplateGroup: RuleTemplateGroupIDTO;
  open: boolean;
  setOpen: (value: boolean) => void;
  selectItems: AccountGroupRelationResultList[];
  reFetchTable: () => void;
}

const ChangeTypeModal: React.FC<IProps> = ({
  open,
  setOpen,
  ruleTemplateGroup,
  selectItems,
  reFetchTable,
}) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [controlMode, setControlMode] = useState<number>(1);

  const submitRuleGroup = useMemoizedFn(async () => {
    try {
      if (!selectItems || selectItems.length === 0) {
        message.warning('请至少选择一个账户组');
        return;
      }
      setBtnLoading(true);
      const params: modifyAccountGroupRelationParams = {
        modifyType: 2,
        relationList: selectItems?.map((p) => {
          return {
            ruleTmplGroupId: ruleTemplateGroup.ruleTmplGroupId,
            accountGroupId: p.accountGroupId,
            status: ruleTemplateGroup.status,
            controlMode,
          };
        }),
      };
      const res = await modifyAccountGroupRelation(params);
      if (res.errorId !== 0) {
        setOpen(false);
        return;
      }
      setOpen(false);
      message.success('设置成功');
      reFetchTable();
    } catch (error) {
      setOpen(false);
    } finally {
      setBtnLoading(false);
    }
  });

  const onChange = (e: RadioChangeEvent) => {
    setControlMode(e.target.value);
  };

  return (
    <div>
      <Modal
        title={'修改账户控制类型'}
        open={open}
        okButtonProps={{ loading: btnLoading }}
        width={500}
        onOk={submitRuleGroup}
        onCancel={() => setOpen(false)}
        destroyOnClose={true}
      >
        <div
          style={{
            width: '100%',
            padding: '24px 16px',
            display: 'flex',
            alignSelf: 'center',
          }}
        >
          <Radio.Group
            onChange={onChange}
            value={controlMode}
            options={[
              {
                value: 0,
                label: '单独控制',
              },
              {
                value: 1,
                label: '联合控制',
              },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ChangeTypeModal;
