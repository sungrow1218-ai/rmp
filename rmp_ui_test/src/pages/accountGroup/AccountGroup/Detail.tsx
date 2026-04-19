// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  BasicColumn,
  BasicTable,
  TableAction,
  TableActionType,
} from '@/components/Table';
import { Button, Row, Col, Popconfirm, message, Modal } from '@ht/sprite-ui';
import styles from './styles.less';
import {
  AccountGroupRelationResultList,
  AcctItem,
  alterAccountGroupDetail,
  exportAccountGroupDetail,
  modifyAccountGroupRelation,
  queryAccountGroupDetail,
} from '@/services/accountGroup';
import { EditOutlined } from '@ht-icons/sprite-ui-react';
import useEIP from '@/directives/useEIP';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import { downloadByUrl } from '@/utils/file';
import { useHeightResize, useUserRoles } from '@/hooks';
import AddAccount, {
  AddAccountAction,
} from '../components/AddAccountTree/AddAccountTree';
import { useSobInfo } from '@/hooks/useSobInfo';
import { FUNC_TYPE, USE_AUTH } from '@/enum';
import { MenuAuthListParamType } from '@/pages/roleManage/contant/typing';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import { getSystemNameById, useSystemInfo } from '@/hooks/useSystemInfo';
import ImportModal, {
  ImportModalRef,
} from '../components/ImportModal/ImportModal';
import FaultListModal from '../components/FaultListModal';
import { nextTick } from '@/utils/dom';
import { BookTypeEnum } from '@/pages/ruleSetting/components/RuleDimensionControl/component/ControlAcctTypeSelect';
import DeleteDetailModal, {
  IAction as BatchDeleteAction,
} from './DeleteDetailModal';
import { SelectedItem } from './data';
import { toPath } from 'lodash';
import { Space, Tabs } from 'antd';
import RuleGroupTable from '../components/RuleGroupDetail';
import RuleGroupModal from '../components/RuleGroupModal/RuleGroupModal';
import { useMemoizedFn } from 'ahooks';
import DeleteAllRule from '../components/DeleteAllRule';

const { confirm } = Modal;

interface Props {
  acctGroup: SelectedItem;
  acctType: Recordable;
  onEdit: (selected: SelectedItem) => void;
  menuAuth: Nullable<MenuAuthListParamType>;
}

interface SelectAcctItem extends AcctItem {
  key: string;
}

const Detail: FC<Props> = ({ acctGroup, acctType, onEdit, menuAuth }) => {
  const tableRef = useRef<TableActionType>(null);
  const addAccountRef = useRef<AddAccountAction>(null);
  const importModalRef = useRef<ImportModalRef>(null);
  const batchDeleteRef = useRef<BatchDeleteAction>(null);

  const sobInfo = useSobInfo(acctGroup.workGroupId); // 根据workGropId获取账套信息
  const { bookType } = acctGroup;
  const { bookLevel } = acctGroup;
  const { acctGroupId } = acctGroup;

  const [delLoading, setDelLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const [_, eipRef] = useEIP();

  const { activeRoleId } = useUserRoles();

  const systemInfo = useSystemInfo(0);
  // tabs的key
  const [tabsKey, setTabsKey] = useState<string>('accountList');

  // 导入失败列表
  const [isFaultModalVisible, setIsFaultModalVisible] = useState(false);
  const [faultList, setFaultList] = useState<any[]>([]);
  const [lastImportTotal, setLastImportTotal] = useState(0);
  const [isOpenRefetch, setIsOpenRefetch] = useState(true);

  const [open, setOpen] = useState(false);
  // openDeleteModal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectItems, setSelectItems] = useState<
    AccountGroupRelationResultList[]
  >([]);

  const accountTypeName =
    (sobInfo?.bookList || [])
      .find((b) => b.bookType === bookType)
      ?.bookLevelList.find((l) => l.bookLevel === bookLevel)?.bookLevelName ||
    '';

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

  // 权限-数据
  const dataPermission = useMemo(() => {
    if (acctGroup && acctGroup.createRoleId) {
      return acctGroup.createRoleId === activeRoleId;
    } else {
      return false;
    }
  }, [acctGroup, activeRoleId]);

  const [rowData, setRowData] = useState<SelectAcctItem[]>([]);

  // 导出操作
  const exportFile = async () => {
    try {
      setExportLoading(true);
      const res = await exportAccountGroupDetail({
        acctGroupId: acctGroup.acctGroupId,
      });
      if (res.code !== 0) {
        throw Error('导出文件失败');
      }
      downloadByUrl({ url: res.data?.fileUrl });
      message.success('操作成功');
    } catch (error: any) {
      console.error(error);
      // error.message && message.error(error.message);
    } finally {
      setExportLoading(false);
    }
  };

  // 删除
  const doDelete = async (acctItem: SelectAcctItem) => {
    try {
      const { acctCode, acctName, extSysId, marketId } = acctItem;
      const res = await alterAccountGroupDetail({
        alterType: 3,
        acctGroupId: acctGroup.acctGroupId,
        acctList: [{ acctCode, acctName, extSysId, marketId }],
      });
      if (res.data && res.data.faultList && res.data.faultList[0]) {
        throw Error(res.data.faultList[0].errorInfo);
      } else {
        const rows = rowData.filter((i) => i.key !== acctItem.key);
        setRowData(rows);
        tableRef.current?.setSelectedRowKeys(rows.map((i) => i.key));
        tableRef.current?.reload();
        message.success({ content: '删除成功' });
      }
    } catch (error: any) {
      console.error(error);
      // error.message && message.error(error.message);
    }
  };

  // 批量删除
  const batchDelete = async (acctList: SelectAcctItem[]) => {
    setDelLoading(true);
    try {
      const res = await alterAccountGroupDetail({
        alterType: 3,
        acctGroupId: acctGroup.acctGroupId,
        acctList: acctList.map(
          ({ acctCode, acctName, extSysId, marketId }) => ({
            acctCode,
            acctName,
            extSysId,
            marketId,
          })
        ),
      });
      if (res.data && res.data.faultList && res.data.faultList.length > 0) {
        batchDeleteRef.current?.open(
          res.data.faultList.map((i: Recordable) => ({
            ...i,
            acctTypeName:
              acctType[`${acctGroup.bookType}|${acctGroup.bookLevel}`] || '--',
          }))
        );
      } else {
        message.success({ content: '删除成功' });
      }
      setRowData([]);
      tableRef.current?.clearSelectedRowKeys();
      tableRef.current?.reload();
    } catch (error: any) {
      console.error(error);
      // error.message && message.error(error.message);
    } finally {
      setDelLoading(false);
    }
  };

  const domRef = useRef(null);

  const domHeight = useHeightResize(domRef);

  useEffect(() => {
    calculate();
  }, [domHeight]);

  const calculate = () => {
    if (tableRef.current) {
      tableRef.current.setProps({
        scroll: {
          y: domHeight
            ? tableRef.current.getDataSource().length > 0
              ? domHeight - 47 - 48
              : domHeight - 47
            : 400,
        },
      });
    }
  };

  useEffect(() => {
    if (acctGroup.acctGroupId) {
      setRowData([]);
      tableRef.current?.clearSelectedRowKeys();
      tableRef.current?.reload({ pagination: { current: 1 } });
    }
  }, [acctGroup.acctGroupId]);

  const getColumns = useMemo<BasicColumn[]>(() => {
    const columns: BasicColumn[] = [
      {
        dataIndex: 'acctCode',
        title: '账户编码',
        align: 'left',
        render: (value) => value || '--',
      },
      {
        dataIndex: 'acctName',
        title: '账户名称',
        align: 'left',
        ellipsis: true,
        render: (value) => value || '--',
      },
      {
        dataIndex: 'bookType',
        title: '账户类型',
        align: 'left',
        render: (value) =>
          acctType[`${acctGroup.bookType}|${acctGroup.bookLevel}`] || '--',
      },
      {
        dataIndex: 'extSysId',
        title: '交易系统',
        align: 'left',
        render: (value) => getSystemNameById(value, systemInfo) || '--',
      },
    ];
    if (acctGroup.bookType === BookTypeEnum.TRADE_ACCOUNT) {
      columns.push({
        dataIndex: 'marketId',
        title: '交易市场',
        align: 'left',
        render: (value) =>
          transformDictCodeToNameHelper(String(value), TRADING_MARKETS) || '--',
      });
    }
    if (operatePermission && dataPermission) {
      columns.push({
        title: '操作',
        align: 'left',
        dataIndex: 'groupId',
        width: 120,
        render: (_, record) => (
          <TableAction
            stopButtonPropagation={true}
            actions={[
              {
                label: '移除',
                disabled: !operatePermission,
                onClick: () => {
                  confirm({
                    title: '移除账户',
                    content: (
                      <>
                        <div>是否移除当前账户，移除后将从当前列表中移除。</div>
                        <div>账户名称：{record.acctName}</div>
                      </>
                    ),
                    onOk: () => doDelete(record as SelectAcctItem),
                    okText: '确认',
                    cancelText: '取消',
                  });
                },
              },
            ]}
          />
        ),
      });
    }
    return columns;
  }, [operatePermission, dataPermission, acctGroup, systemInfo, acctType]);

  const [forceRender, setForceRender] = useState(true);

  useEffect(() => {
    setForceRender(false);
    nextTick(() => {
      setForceRender(true);
    });
  }, [getColumns]);

  // 一键解除绑定

  const unbindAccount = useMemoizedFn(async () => {
    try {
      if (!selectItems || selectItems.length === 0) {
        message.warning('请至少选择一个账户组');
        return;
      }
      const res = await modifyAccountGroupRelation({
        modifyType: 3,
        relationList: selectItems.map((p) => {
          return {
            accountGroupId: acctGroupId,
            ruleTmplGroupId: p.ruleTmplGroupId,
          };
        }),
      });
      if (res.errorId !== 0) {
        return;
      }
      message.success('成功解除绑定');
      setIsOpenRefetch(true);
    } catch (error) {}
  });

  return (
    <div className={styles.detailBlock}>
      <div className={styles.info}>
        <div className={styles.title}>
          <img src={TitleImgSrc} style={{ width: '24px', height: '24px' }} />
          <span>基本信息</span>
          {operatePermission && dataPermission ? (
            <div className={styles.edit}>
              <EditOutlined
                style={{ fontSize: '14px', color: '#bb744a' }}
                ref={eipRef}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(acctGroup);
                }}
              />
            </div>
          ) : null}
        </div>

        <Row className={styles.desc}>
          <Col span={6} className={styles.descItem}>
            <div className={styles.label}>账户组ID：</div>
            <div className={styles.value}>{acctGroup.acctGroupId}</div>
          </Col>
          <Col span={6} className={styles.descItem}>
            <div className={styles.label}>账户组名称：</div>
            <div className={styles.value} title={acctGroup.acctGroupName}>
              {acctGroup.acctGroupName}
            </div>
          </Col>
          <Col span={6} className={styles.descItem}>
            <div className={styles.label}>账户类型：</div>
            <div className={styles.value}>
              {acctType[`${acctGroup.bookType}|${acctGroup.bookLevel}`] || '--'}
            </div>
          </Col>
          <Col span={6} className={styles.descItem}>
            <div className={styles.label}>更新模式：</div>
            <div className={styles.value}>静态账户组</div>
          </Col>
          <Col span={6} className={styles.descItem}>
            <div className={styles.label}>创建人：</div>
            <div className={styles.value}>{acctGroup.createUserCode}</div>
          </Col>
          <Col span={6} className={styles.descItem}>
            <div className={styles.label}>创建日期：</div>
            <div className={styles.value}>{acctGroup.createDateTime}</div>
          </Col>
          <Col span={6} className={styles.descItem}>
            <div className={styles.label} style={{ width: '120px' }}>
              最新更新日期：
            </div>
            <div className={styles.value}>{acctGroup.lastUpdateTime}</div>
          </Col>
          <Col span={6} className={styles.descItem}>
            <div className={styles.label}>描述：</div>
            <div className={styles.value}>
              {acctGroup.acctGroupRemark || '--'}
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.list}>
        <Tabs
          className={styles.accountTabs}
          onChange={(key) => setTabsKey(key)}
          tabBarExtraContent={{
            right: (
              <>
                {tabsKey === 'accountList' ? (
                  <div className={styles.action}>
                    {queryPermission ? (
                      <Button
                        type="primary"
                        ref={eipRef}
                        style={{ marginRight: '16px' }}
                        onClick={() => exportFile()}
                        loading={exportLoading}
                      >
                        导出
                      </Button>
                    ) : null}
                    {operatePermission && dataPermission ? (
                      <Button
                        type="primary"
                        style={{ marginRight: '16px' }}
                        ref={eipRef}
                        onClick={() => addAccountRef.current?.open()} // ✅ 使用 ref 打开
                      >
                        添加
                      </Button>
                    ) : null}
                    {operatePermission && dataPermission ? (
                      <Button
                        ref={eipRef}
                        disabled={rowData.length === 0}
                        loading={delLoading}
                        style={{ marginRight: '16px' }}
                        onClick={() => {
                          confirm({
                            title: '批量移除账户',
                            content: `请确认是否移除选中的${rowData.length}条账户，移除后无法恢复，请谨慎操作。`,
                            onOk: () => batchDelete(rowData),
                            okText: '确认',
                            cancelText: '取消',
                          });
                        }}
                      >
                        批量移除
                      </Button>
                    ) : null}
                    {operatePermission && dataPermission ? (
                      <Button
                        ref={eipRef}
                        onClick={() => importModalRef.current?.open()}
                      >
                        批量导入
                      </Button>
                    ) : null}
                  </div>
                ) : (
                  <Space>
                    {operatePermission && dataPermission ? (
                      <Button
                        type="primary"
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                        添加绑定
                      </Button>
                    ) : null}
                    {operatePermission && dataPermission ? (
                      <Button
                        onClick={() => {
                          // setOpenDeleteModal(true);
                          Modal.confirm({
                            title: '批量解除绑定',
                            content: (
                              <>
                                解除绑定后,该账户组下将不在关联所有的规则模板。
                                请确认是否解除绑定
                              </>
                            ),
                            okText: '确定',
                            cancelText: '取消',
                            onOk: () => {
                              unbindAccount();
                            },
                          });
                        }}
                        type="primary"
                      >
                        批量解除绑定
                      </Button>
                    ) : null}
                    {/* {queryPermission ? (
                      <Button type="primary">导出</Button>
                    ) : null} */}
                  </Space>
                )}
              </>
            ),
          }}
          items={[
            {
              key: 'accountList',
              label: '账户列表',
              children: (
                <div className={styles.table} ref={domRef}>
                  {forceRender && (
                    <BasicTable
                      ref={tableRef}
                      fetchSetting={{
                        listField: 'data.resultList',
                        pageField: 'pageId',
                        totalField: 'data.totalSize',
                      }}
                      style={{ width: '100%', height: '100%' }}
                      api={async (params) => {
                        if (queryPermission) {
                          return queryAccountGroupDetail({
                            ...params,
                            filterCondition: {
                              acctGroupId: acctGroup.acctGroupId,
                            },
                          });
                        }
                      }}
                      afterFetch={(origin) =>
                        origin.map((i: AcctItem) => ({
                          ...i,
                          key: `${i.acctCode}|${i.extSysId}|${
                            i.marketId ?? -1
                          }`,
                        }))
                      }
                      columns={getColumns}
                      onDataChange={calculate}
                      rowSelection={
                        operatePermission && dataPermission
                          ? {
                              columnWidth: '60px',
                              type: 'checkbox',
                              onChange: (selectedRowKeys, selectedRows) => {
                                tableRef.current?.setSelectedRowKeys(
                                  selectedRowKeys
                                );
                                setRowData(selectedRows);
                              },
                            }
                          : undefined
                      }
                      pagination={{
                        showTotal: (total) => `总数：${total}`,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showQuickJumper: true,
                        size: 'default',
                      }}
                    />
                  )}
                </div>
              ),
            },
            {
              key: 'ruleGroupModel',
              label: '关联的规则模板',
              children: (
                <RuleGroupTable
                  setIsOpenRefetch={setIsOpenRefetch}
                  isOpenRefetch={isOpenRefetch}
                  accountGroupId={acctGroupId}
                  queryPermission={queryPermission}
                  operatePermission={operatePermission}
                  dataPermission={dataPermission}
                  setSelectItems={setSelectItems}
                />
              ),
            },
          ]}
        />
      </div>
      {sobInfo && (
        <AddAccount
          ref={addAccountRef}
          reFresh={() => tableRef.current?.reload()}
          sobInfo={sobInfo}
          bookType={bookType}
          bookLevel={bookLevel}
          acctGroupId={acctGroupId}
        />
      )}
      <ImportModal
        ref={importModalRef}
        bookType={bookType}
        bookLevel={bookLevel}
        acctGroupId={acctGroupId}
        sobInfo={sobInfo}
        onConfirm={async (data, detail) => {
          setFaultList([]);
          // 1) 组装提交数据
          const acct_list = data.map((item: any) => ({
            acctCode: item.acctCode,
            acctName: String(item.acctName || ''),
            extSysId: Number(item.extSysId),
            marketId: Number(item.marketId ?? -1), // 没有则给 -1
          }));
          if (!acct_list || acct_list.length === 0) {
            return;
          }

          // 2) 记录本次导入总数（用于提示）
          setLastImportTotal(detail.total);

          // 3) 提交
          const res = await alterAccountGroupDetail({
            alterType: 1,
            acctGroupId,
            acctList: acct_list,
          });

          const backendFaultList = res?.data?.faultList ?? [];
          console.log('backendFaultList', backendFaultList);

          // 4) 合并前端 formatErrors 和后端 faultList
          const mergedFaultList = [
            ...(detail.formatErrors?.map((item: any) => ({
              ...item,
              accountTypeName,
            })) || []),

            // 后端返回的错误
            ...backendFaultList.map((item: any) => ({
              ...item,
              accountTypeName, // 增强字段
            })),
          ];
          console.log('mergedFaultList', mergedFaultList);
          const successNum = acct_list.length - backendFaultList.length;
          if (mergedFaultList.length > 0) {
            // 4) 失败清单写入 state，并展示弹窗
            setFaultList(mergedFaultList);
            console.log('mergedFaultList', mergedFaultList);
            setIsFaultModalVisible(true);
            if (successNum > 0) {
              tableRef.current?.reload({ pagination: { current: 1 } });
            }
          } else if (acct_list.length > 0) {
            // 全部成功
            message.success(`导入成功：共 ${acct_list.length} 个`);
            tableRef.current?.reload({ pagination: { current: 1 } });
          }
        }}
      />
      <FaultListModal
        topTitle="账户导入失败"
        isReSubmit={false} // 导入时不显示再次提交按钮
        tips={`共计添加${lastImportTotal}个账户，成功${
          lastImportTotal - faultList.length
        }个，失败${faultList.length}个。请查看失败原因调整文件后重新导入。`}
        faultList={faultList}
        visible={isFaultModalVisible}
        onClose={() => {
          setIsFaultModalVisible(false);
          setFaultList([]);
        }}
        acctGroupId={Number(acctGroupId)}
        unitLabel={accountTypeName}
        // 关闭“父层”（这里是导入弹窗）
        onCloseParent={() => importModalRef.current?.close?.()}
        onRefresh={() =>
          tableRef.current?.reload({ pagination: { current: 1 } })
        }
      />
      <DeleteDetailModal ref={batchDeleteRef} />
      <RuleGroupModal
        setIsOpenRefetch={setIsOpenRefetch}
        accountGroupId={acctGroupId}
        open={open}
        setOpen={setOpen}
        workGroupId={acctGroup?.workGroupId}
      />
      <DeleteAllRule
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        setIsOpenRefetch={setIsOpenRefetch}
        unbindAccount={unbindAccount}
      />
    </div>
  );
};

export default Detail;
