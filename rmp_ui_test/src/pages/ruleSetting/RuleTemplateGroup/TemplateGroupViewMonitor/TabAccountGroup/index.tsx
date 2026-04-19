// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.less';
import { BasicForm, FormActionType } from '@/components/Form';
import { Button, message, Modal } from 'antd';
import {
  BasicColumn,
  BasicTable,
  TableAction,
  TableActionType,
} from '@/components/Table';
import { searchSchemas } from './data';
import { useHeightResize, useUserRoles } from '@/hooks';
import AccountGroupModal from './AccountGroupModal';
import ChangeTypeModal from './ChangeTypeModal';
import {
  AccountGroupRelationResultList,
  modifyAccountGroupRelation,
  queryAccountGroup,
  queryAccountGroupRelation,
  ResponseAccountGroupItem,
} from '@/services/accountGroup';
import { useMemoizedFn } from 'ahooks';
import {
  RuleTemplateGroupIDTO,
  UnBondAccountGroupData,
} from '@/services/ruleSetting/idto';
import AccountGroupDetail from './AccountGroupDetail';
import { AllSobInfo } from '@/pages/ruleSetting/components/allSobInfo';
import { history } from '@oula/oula';
import { debounce } from 'lodash';
import AccountControlTypeTag from '@/pages/ruleSetting/components/AccountControlTypeTag';
import UnionControlTypeTag from '@/pages/ruleSetting/components/UnionControlTypeTag';
import { useAuthHook } from '@/hooks/useAuthhook';
import { FUNC_TYPE, USE_AUTH } from '@/enum';
import useEIP from '@/directives/useEIP';

interface Props {
  ruleTemplateGroup: RuleTemplateGroupIDTO;
  accountType?: {
    [key: string]: string;
  };
  allSobInfo?: AllSobInfo[];
  workGroupId: number;
}

const TabAccountGroup: React.FC<Props> = ({
  ruleTemplateGroup,
  accountType,
  allSobInfo,
  workGroupId,
}) => {
  const tableRef = useRef<TableActionType>(null);
  const formRef = useRef<FormActionType>(null);
  const domRef = useRef(null);
  const domHeight = useHeightResize(domRef);
  const [accountOpen, setAccountOpen] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectItems, setSelectItems] = useState<
    AccountGroupRelationResultList[]
  >([]);
  const [accountGroup, setAccountGroup] = useState<ResponseAccountGroupItem[]>(
    []
  );
  const [selectDetail, setSelectDetail] = useState<
    UnBondAccountGroupData | undefined
  >();
  const [openDetail, setOpenDetail] = useState(false);

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    calculate();
  }, [domHeight]);

  const calculate = () => {
    if (tableRef.current) {
      tableRef.current.setProps({
        scroll: {
          y: domHeight
            ? tableRef.current.getDataSource().length > 0
              ? domHeight - 44 - 48
              : domHeight - 44
            : 400,
        },
      });
    }
  };

  const [_, eipRef] = useEIP();

  const { activeRoleId } = useUserRoles();

  const { menuAuth } = useAuthHook();

  // 权限-查询
  const queryPermission = useMemo(() => {
    if (menuAuth) {
      const auth =
        menuAuth.functionAuthList?.find(
          (item) => item.functionId === FUNC_TYPE.QUERY
        )?.useAuth === USE_AUTH.USED;
      return !!auth;
    }
    return false;
  }, [menuAuth]);

  useEffect(() => {
    if (queryPermission) {
      tableRef.current?.reload();
    }
  }, [queryPermission]);

  // 权限-读写
  const operatePermission = useMemo(() => {
    if (menuAuth) {
      const auth =
        menuAuth.functionAuthList?.find(
          (item) => item.functionId === FUNC_TYPE.OPERATE
        )?.useAuth === USE_AUTH.USED;
      return !!auth;
    }
    return false;
  }, [menuAuth]);

  // 权限-数据
  const dataPermission = (data: Recordable & { createRoleId: number }) =>
    data.createRoleId === activeRoleId;

  useEffect(() => {
    const sobInfo = allSobInfo?.find((i) => i.workGroupId === workGroupId);
    if (sobInfo) {
      let opts: { label: string; value: string }[] = [];
      for (const { bookLevelList, bookType } of sobInfo.bookList || []) {
        opts = [
          ...opts,
          ...bookLevelList.map((i) => ({
            label: i.bookLevelName,
            value: `${sobInfo.sobId as number}|${bookType}|${i.bookLevel}`,
          })),
        ];
      }
      formRef.current?.updateSchemas({
        field: 'acctGroupType',
        componentProps: {
          options: opts,
          allowClear: true,
          placeholder: '请选择账户类型',
        },
      });
    }
  }, [allSobInfo]);

  const queryAccountGroupRequest = useMemoizedFn(async () => {
    try {
      if (ruleTemplateGroup === undefined) return;
      const res = await queryAccountGroup({
        pageId: 1,
        pageSize: 5000,
        authFlag: 1,
        filterCondition: {
          workGroupId: ruleTemplateGroup.workGroupId,
        },
      });
      if (res.code !== 0) {
        setAccountGroup([]);
        return;
      }
      const _data = res?.data?.resultList ?? [];
      setAccountGroup(_data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  });
  useEffect(() => {
    queryAccountGroupRequest();
  }, [ruleTemplateGroup]);

  const tableCloum = useMemo(() => {
    const colums: BasicColumn[] = [
      {
        dataIndex: 'accountGroupId',
        align: 'left',
        title: '账户组ID',
        width: '15%',
      },
      { dataIndex: 'accountGroupName', title: '账户组名称', align: 'left' },
      {
        dataIndex: 'accountTypeName',
        title: '账户类型',
        align: 'left',
        render: (value) => {
          return <AccountControlTypeTag text={value} />;
        },
      },
      {
        dataIndex: 'controlMode',
        title: '账户控制方式',
        align: 'left',
        render: (value) => {
          // return value === 0 ? '单独控制' : '联合控制';
          return (
            <UnionControlTypeTag text={value === 0 ? '单独控制' : '联合控制'} />
          );
        },
      },
    ];
    return colums;
  }, [accountGroup, accountType]);

  const reFetchTable = () => {
    tableRef.current?.reload();
    queryAccountGroupRequest();
    setSelectItems([]);
    setSelectedRowKeys([]);
  };

  const unbindAccount = useMemoizedFn(async () => {
    try {
      const res = await modifyAccountGroupRelation({
        modifyType: 3,
        relationList: selectItems.map((p) => {
          return {
            accountGroupId: p.accountGroupId,
            ruleTmplGroupId: ruleTemplateGroup.ruleTmplGroupId,
          };
        }),
      });
      if (res.code !== 0) {
        return;
      }
      message.success('成功解除绑定');
      reFetchTable();
    } catch (error) {}
  });

  const handleBatchUnbind = () => {
    modal.confirm({
      title: '批量解除绑定',
      content:
        '解除绑定后,该规则模板组下将不再控制所选账户组内的全部账户。请确认是否解除绑定',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await unbindAccount();
          reFetchTable();
          console.log('操作完成'); // 调试日志
        } catch (error) {
          console.error('操作失败:', error);
        }
      },
    });
  };

  const clickJump = (accountGroupId: number) => {
    history.push(`/rule/accountGroup?accountGroupId=${accountGroupId}`);
  };

  const handleSearch = debounce(() => tableRef.current?.reload(), 500);

  return (
    <div className={styles.content}>
      <div className={styles.search}>
        <BasicForm
          ref={formRef}
          layout="inline"
          schemas={searchSchemas}
          onValuesChange={() => handleSearch()}
        />
        <div className={styles.actionBar}>
          {operatePermission ? (
            <Button
              type="primary"
              ref={eipRef}
              onClick={() => setAccountOpen(true)}
              style={{ marginRight: '16px' }}
            >
              关联账户组
            </Button>
          ) : null}
          {operatePermission ? (
            <Button
              ref={eipRef}
              onClick={() => {
                if (!selectItems || selectItems.length === 0) {
                  message.warning('请至少选择一个账户组');
                  return;
                }
                setOpenType(true);
              }}
              type="primary"
              style={{ marginRight: '16px' }}
            >
              修改控制类型
            </Button>
          ) : null}
          {operatePermission ? (
            <Button
              onClick={() => {
                if (!selectItems || selectItems.length === 0) {
                  message.warning('请至少选择一个账户组');
                  return;
                }
                handleBatchUnbind();
              }}
              ref={eipRef}
              type="primary"
            >
              批量解除绑定
            </Button>
          ) : null}
        </div>
      </div>
      <div style={{ height: 'calc(100% - 44px)' }} ref={domRef}>
        <BasicTable
          ref={tableRef}
          columns={tableCloum}
          size="middle"
          autoCreateKey={true}
          fetchSetting={{
            listField: 'data.resultList',
            pageField: 'pageId',
            totalField: 'data.totalSize',
          }}
          api={async (params) => {
            const { accountGroupName, acctGroupType } =
              formRef.current?.getFieldsValue();
            const [sobId, bookType, bookLevel] = (acctGroupType || '').split(
              '|'
            );
            if (!queryPermission) return;
            return queryAccountGroupRelation({
              ...params,
              filterCondition: {
                ruleTmplGroupId: [ruleTemplateGroup.ruleTmplGroupId],
                accountGroupName,
                accountType: acctGroupType
                  ? {
                      sobId: Number(sobId),
                      bookLevel: Number(bookLevel),
                      bookType: Number(bookType),
                    }
                  : undefined,
              },
            });
          }}
          onDataChange={calculate}
          pagination={{
            showTotal: (total) => `总数：${total}`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showQuickJumper: true,
            size: 'default',
          }}
          rowSelection={
            operatePermission
              ? {
                  type: 'checkbox',
                  columnWidth: 80,
                  selectedRowKeys,
                  onChange: (_selectedRowKeys, _selectItems) => {
                    setSelectedRowKeys(_selectedRowKeys);
                    setSelectItems(_selectItems);
                  },
                }
              : undefined
          }
          actionColumn={{
            width: 240,
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            render: (value: any, record: Recordable) => (
              <TableAction
                stopButtonPropagation={true}
                actions={[
                  {
                    label: (
                      <Button
                        type="link"
                        onClick={() => {
                          const _accountGroup = accountGroup.find(
                            (p) => p.acctGroupId === record.accountGroupId
                          );
                          if (_accountGroup) {
                            setSelectDetail({
                              accountGroupId: _accountGroup?.acctGroupId,
                              accountGroupName: _accountGroup?.acctGroupName,
                              bookLevel: _accountGroup.bookLevel,
                              bookType: _accountGroup.bookType,
                            });
                            setOpenDetail(true);
                          }
                        }}
                      >
                        查看明细
                      </Button>
                    ),
                    ifShow:
                      dataPermission(
                        record as Recordable & { createRoleId: number }
                      ) && queryPermission,
                  },
                  {
                    label: (
                      <Button
                        onClick={() => {
                          clickJump(record.accountGroupId);
                        }}
                        type="link"
                        ref={eipRef}
                      >
                        编辑账户组
                      </Button>
                    ),
                    ifShow:
                      dataPermission(
                        record as Recordable & { createRoleId: number }
                      ) && operatePermission,
                  },
                ]}
              />
            ),
          }}
        />
      </div>
      <AccountGroupModal
        reFetchTable={reFetchTable}
        open={accountOpen}
        setOpen={setAccountOpen}
        accountType={accountType}
        allSobInfo={allSobInfo}
        ruleTemplateGroup={ruleTemplateGroup}
      />
      <ChangeTypeModal
        reFetchTable={reFetchTable}
        open={openType}
        setOpen={setOpenType}
        ruleTemplateGroup={ruleTemplateGroup}
        selectItems={selectItems}
      />
      <AccountGroupDetail
        accountGroup={selectDetail}
        open={openDetail}
        setOpen={setOpenDetail}
        accountType={accountType}
      />
      {contextHolder}
    </div>
  );
};

export default TabAccountGroup;
