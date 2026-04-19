import { BasicForm, FormActionType } from '@/components/Form';
import {
  AccountGroupRelationResultList,
  modifyAccountGroupRelation,
  modifyAccountGroupRelationParams,
} from '@/services/accountGroup';
import {
  queryRuleTemplateGroup,
  queryUnBondTemplateGroup,
} from '@/services/ruleSetting';
import {
  RuleTemplateGroupIDTO,
  UnBondTemplateGroupData,
} from '@/services/ruleSetting/idto';
import { PaginationType } from '@/services/typing';
import { Modal } from '@ht/sprite-ui';
import { useMemoizedFn } from 'ahooks';
import { Button, message, Radio, RadioChangeEvent, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import ViewRuleModeModal from '../ViewRuleModeModal';

export interface IProps {
  accountGroupId: number;
  open: boolean;
  setOpen: (value: boolean) => void;
  setIsOpenRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  workGroupId?: number;
}

const RuleGroupModal: React.FC<IProps> = ({
  open,
  setOpen,
  accountGroupId,
  setIsOpenRefetch,
  workGroupId,
}) => {
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [tableData, setTableData] = useState<UnBondTemplateGroupData[]>([]);
  const [controlMode, setControlMode] = useState<number>(1);
  const [onSelectRowKeys, setOnSelectRowKeys] = useState<React.Key[]>([]);
  const [onSelectItem, setOnSelectItems] = useState<UnBondTemplateGroupData[]>(
    []
  );
  const [openRuleMode, setOpenRuleMode] = useState<boolean>(false);
  const [ruleTemplateGroupId, setRuleTemplateGroupId] = useState<
    number | undefined
  >(undefined);

  const queryRuleModeInfo = useMemoizedFn(async () => {
    try {
      setLoading(true);
      if (accountGroupId === undefined) {
        return;
      }
      const res = await queryUnBondTemplateGroup({
        pageId: 1,
        pageSize: 5000,
        authorityFlag: 1,
        filterCondition: {
          accountGroupId,
        },
      });
      if (res.errorId !== 0) {
        setTableData([]);
        return;
      }
      const _data = res?.data?.resultList ?? [];
      setTableData(_data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  });
  const submitRuleGroup = useMemoizedFn(async () => {
    try {
      setBtnLoading(true);
      if (!onSelectItem || onSelectItem.length === 0) {
        message.warning('请至少选择一个数据');
        return;
      }
      const params: modifyAccountGroupRelationParams = {
        modifyType: 1,
        relationList: onSelectItem?.map((p) => {
          return {
            ruleTmplGroupId: p.ruleTmplGroupId,
            accountGroupId,
            controlMode,
            status: p.status,
            // remark: p.description,
          };
        }),
      };
      const res = await modifyAccountGroupRelation(params);
      if (res.errorId !== 0) {
        return;
      }
      setOpen(true);
      message.success('设置成功');
      setOnSelectItems([]);
      setOnSelectRowKeys([]);
      setIsOpenRefetch(true);
    } catch (error) {
    } finally {
      setOpen(false);
      setBtnLoading(false);
    }
  });

  useEffect(() => {
    if (open) {
      setOnSelectItems([]);
      setOnSelectRowKeys([]);
      queryRuleModeInfo();
    }
  }, [open, accountGroupId]);

  const colums: ColumnsType<UnBondTemplateGroupData> = [
    {
      title: '模板ID',
      dataIndex: 'ruleTmplGroupId',
    },
    {
      title: '规则模板名称',
      dataIndex: 'ruleTmplGroupName',
      ellipsis: true,
    },
    {
      dataIndex: 'status',
      title: '启用状态',
      render: (value) => {
        return (
          <Switch
            checked={value === 1}
            checkedChildren="开启"
            disabled={true}
            unCheckedChildren="关闭"
          />
        );
      },
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <Button
            onClick={() => {
              setOpenRuleMode(true);
              setRuleTemplateGroupId(record.ruleTmplGroupId);
            }}
            type="link"
          >
            查看
          </Button>
        );
      },
    },
  ];

  const onChange = (e: RadioChangeEvent) => {
    setControlMode(e.target.value);
  };

  return (
    <div>
      <Modal
        title={'关联规则模板'}
        open={open}
        // onOk={submitRuleGroup}
        width={1200}
        onCancel={() => setOpen(false)}
        destroyOnClose={true}
        footer={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignSelf: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',

                alignSelf: 'center',
              }}
            >
              <span> 账户组控制模式：</span>
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
            <div>
              <Button
                loading={btnLoading}
                style={{ marginRight: '15px' }}
                onClick={() => setOpen(false)}
                type="default"
              >
                取消
              </Button>
              <Button
                onClick={() => {
                  submitRuleGroup();
                }}
                loading={btnLoading}
                type="primary"
              >
                确认
              </Button>
            </div>
          </div>
        }
      >
        <Table
          columns={colums}
          loading={loading}
          rowKey={'ruleTmplGroupId'}
          rowSelection={{
            columnWidth: 80,
            type: 'checkbox',
            selectedRowKeys: onSelectRowKeys,
            onChange: (selectedRowKeys: any, item) => {
              setOnSelectRowKeys(selectedRowKeys);
              setOnSelectItems(item);
            },
          }}
          scroll={{
            y: 300,
          }}
          virtual={true}
          dataSource={tableData}
          size="middle"
          pagination={false}
        />
      </Modal>

      <ViewRuleModeModal
        open={openRuleMode}
        setOpen={setOpenRuleMode}
        ruleTemplateGroupId={ruleTemplateGroupId}
      />
    </div>
  );
};

export default RuleGroupModal;
