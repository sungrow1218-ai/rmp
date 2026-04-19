import { BasicForm, FormActionType } from '@/components/Form';
import { Mode } from '@/pages/accountGroup/AccountGroup/data';
import EditModal, {
  IAction as ModalAction,
  SubmitAcctGroupAfterType,
} from '@/pages/accountGroup/AccountGroup/EditModal';
import AddAccountTree, {
  AddAccountAction,
} from '@/pages/accountGroup/components/AddAccountTree/AddAccountTree';
import {
  AllSobInfo,
  useSobInfo,
} from '@/pages/ruleSetting/components/allSobInfo';
import { querySetOfBook, SobInfo } from '@/services/account';
import {
  queryAccountGroup,
  modifyAccountGroupRelation,
  modifyAccountGroupRelationParams,
  ResponseAccountGroupItem,
} from '@/services/accountGroup';
import {
  RuleTemplateGroupIDTO,
  UnBondAccountGroupData,
} from '@/services/ruleSetting/idto';
import { Modal } from '@ht/sprite-ui';
import { useMemoizedFn } from 'ahooks';
import { Button, message, Radio, RadioChangeEvent, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import AccountGroupDetail from './AccountGroupDetail';
import { queryUnBondAccountGroup } from '@/services/ruleSetting';

export interface IProps {
  ruleTemplateGroup?: RuleTemplateGroupIDTO;
  open: boolean;
  setOpen: (value: boolean) => void;
  allSobInfo?: AllSobInfo[];
  accountType?: { [key: string]: string };
  reFetchTable: () => void;
}

const AccountGroupModal: React.FC<IProps> = ({
  open,
  setOpen,
  ruleTemplateGroup,
  accountType,
  allSobInfo,
  reFetchTable,
}) => {
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [tableData, setTableData] = useState<UnBondAccountGroupData[]>([]);
  const [controlMode, setControlMode] = useState<number>(1);
  const [onSelectRowKeys, setOnSelectRowKeys] = useState<React.Key[]>([]);
  const [onSelectItem, setOnSelectItems] = useState<UnBondAccountGroupData[]>(
    []
  );
  const [accountInfo, setAccountInfo] = useState<
    SubmitAcctGroupAfterType | undefined
  >(undefined);
  const modalRef = useRef<ModalAction>(null);
  const addAccountRef = useRef<AddAccountAction>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectDetail, setSelectDetail] = useState<
    UnBondAccountGroupData | undefined
  >();

  const queryAccountGroupRequest = useMemoizedFn(async () => {
    try {
      setLoading(true);
      if (ruleTemplateGroup === undefined) return;
      const res = await queryUnBondAccountGroup({
        pageId: 1,
        pageSize: 5000,
        authorityFlag: 1,
        filterCondition: {
          ruleTmplGroupId: ruleTemplateGroup.ruleTmplGroupId,
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
        message.warning('请至少选择一个账户组');
        return;
      }
      if (!ruleTemplateGroup) {
        return;
      }
      const params: modifyAccountGroupRelationParams = {
        modifyType: 1,
        relationList: onSelectItem?.map((p) => {
          return {
            ruleTmplGroupId: ruleTemplateGroup?.ruleTmplGroupId,
            accountGroupId: p.accountGroupId,
            status: ruleTemplateGroup?.status,
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
      setOnSelectItems([]);
      setSelectDetail(undefined);
      setOnSelectRowKeys([]);
      reFetchTable();
    } catch (error) {
      setOpen(false);
    } finally {
      setBtnLoading(false);
    }
  });
  useEffect(() => {
    if (open && ruleTemplateGroup) {
      queryAccountGroupRequest();
    } else {
      setOnSelectItems([]);
      setSelectDetail(undefined);
      setOnSelectRowKeys([]);
    }
  }, [ruleTemplateGroup, open]);

  const colums: ColumnsType<UnBondAccountGroupData> = [
    {
      title: '账户组ID',
      dataIndex: 'accountGroupId',
    },
    {
      title: '账户组名称',
      dataIndex: 'accountGroupName',
      ellipsis: true,
    },
    {
      dataIndex: 'status',
      title: '账户类型',
      render: (value, record) => {
        const { bookLevel, bookType } = record;
        const bookLevelName = accountType
          ? accountType[`${bookType}|${bookLevel}`]
          : '';
        return bookLevelName;
      },
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <Button
            onClick={() => {
              setSelectDetail(record);
              setOpenDetail(true);
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

  // 关闭modal  清空数据
  const closeModal = () => {
    setOpen(false);
    setOnSelectItems([]);
    setSelectDetail(undefined);
    setOnSelectRowKeys([]);
  };

  return (
    <div>
      <Modal
        title={
          <>
            <span>关联账户组</span>{' '}
            <Button
              style={{ marginLeft: '12px', position: 'relative', top: '-3px' }}
              type="primary"
              onClick={() => {
                if (!ruleTemplateGroup) {
                  return;
                }
                modalRef.current?.open(Mode.ADD, {
                  workGroupId: ruleTemplateGroup.workGroupId,
                  sobId: allSobInfo?.find(
                    (p: any) => p.workGroupId === ruleTemplateGroup.workGroupId
                  )?.sobId,
                } as any);
              }}
            >
              新增账户组
            </Button>
          </>
        }
        open={open}
        width={1200}
        onCancel={() => {
          closeModal();
        }}
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
                onClick={() => {
                  closeModal();
                }}
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
          rowKey={'accountGroupId'}
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
            y: 500,
          }}
          virtual={true}
          dataSource={tableData}
          size="middle"
          pagination={false}
        />
      </Modal>
      <EditModal
        ref={modalRef}
        onRefresh={(mode, acctGroupId) => {
          queryAccountGroupRequest();
        }}
        onSubmitAfter={(data?: SubmitAcctGroupAfterType) => {
          if (data) {
            setAccountInfo(data);
            addAccountRef.current?.open();
          }
        }}
      />
      <AddAccountTree
        ref={addAccountRef}
        reFresh={() => {}}
        sobInfo={
          allSobInfo?.find(
            (p: any) => p.workGroupId === ruleTemplateGroup?.workGroupId
          ) as SobInfo
        }
        bookType={accountInfo?.bookType}
        bookLevel={accountInfo?.bookLevel}
        acctGroupId={accountInfo?.acctGroupId}
      />
      <AccountGroupDetail
        accountGroup={selectDetail}
        open={openDetail}
        setOpen={setOpenDetail}
        accountType={accountType}
      />
    </div>
  );
};

export default AccountGroupModal;
