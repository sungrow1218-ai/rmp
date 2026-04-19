import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.less';
import { Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { BasicTable, TableAction, TableActionType } from '@/components/Table';
import { BasicForm, FormActionType } from '@/components/Form';
import { columnOptions, columns, FORM_MODE } from './data';
import { useHeightResize } from '@/hooks';
import EditModal, { IAction as ModalAction } from './EditModal';
import useEIP from '@/directives/useEIP';
import {
  exportRepoInfo,
  queryRepoInfo,
  RepoItem,
} from '@/services/securityInfo';
import { TRADE_MARKET_REPO } from '@/utils/dictInfo';
import ColManage from '@/components/ColManage';
import RepoSelectSimple, {
  IAction as RepoSelectAction,
} from './components/RepoSelectSimple';

const InfoRepo = () => {
  const tableRef = useRef<TableActionType>(null);
  const formRef = useRef<FormActionType>(null);
  const modalRef = useRef<ModalAction>(null);

  const domRef = useRef(null);

  const domHeight = useHeightResize(domRef);

  const [showColumns, setShowColumns] = useState<string[]>(
    columnOptions.map((i) => i.value)
  );

  const [_, eipRef] = useEIP();

  const calculate = () => {
    if (tableRef.current) {
      tableRef.current.setProps({
        scroll: {
          y: domHeight
            ? tableRef.current.getDataSource().length > 0
              ? domHeight - 47 - 48
              : domHeight - 47
            : 400,
          x: 2000,
        },
      });
    }
  };

  useEffect(() => {
    calculate();
  }, [domHeight]);

  const [loading, setLoading] = useState(false);

  const exportFile = async () => {
    try {
      setLoading(true);
      const { marketId, security } = formRef.current?.getFieldsValue();
      const res = await exportRepoInfo({
        marketId: marketId ? [marketId] : undefined,
        securityCode: security ? security.securityCode : undefined,
      });
      if (res.errorId !== 0) {
        message.error(res.errorMessage);
      } else {
        const { fileUrl } = res.data;
        if (fileUrl) {
          location.href = fileUrl;
        }
      }
    } catch (error: any) {
      console.error(error);
      // error.message && message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const repoSelectRef = useRef<RepoSelectAction>(null);

  return (
    <div className={styles.pageStyle}>
      <div className={styles.pageTitle}>回购信息管理</div>
      <div className={styles.content}>
        <div className={styles.filter}>
          <BasicForm
            ref={formRef}
            onValuesChange={() =>
              tableRef.current?.reload({ pagination: { current: 1 } })
            }
            schemas={[
              {
                field: 'marketId',
                label: '交易市场',
                component: 'Select',
                componentProps: ({ formAction }) => ({
                  placeholder: '请选择',
                  allowClear: true,
                  style: { width: '240px' },
                  options: TRADE_MARKET_REPO.map((i) => ({
                    label: `${i.code}-${i.name}`,
                    value: i.code,
                  })),
                  onChange: (value) => {
                    formAction.setFieldValue('security', undefined);
                    tableRef.current?.reload();
                  },
                }),
              },
              {
                field: 'security',
                label: '证券代码',
                component: 'Input',
                render: (renderCallbackParams) => (
                  <RepoSelectSimple
                    marketId={renderCallbackParams.values.marketId}
                    ref={repoSelectRef}
                  />
                ),
              },
            ]}
            layout="inline"
          />
          <div className={styles.actionBar}>
            <Button
              type="primary"
              onClick={() => {
                if (modalRef.current) {
                  modalRef.current.open(FORM_MODE.ADD);
                }
              }}
            >
              新建
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: '16px' }}
              onClick={exportFile}
              loading={loading}
            >
              导出
            </Button>
            <ColManage
              columns={columnOptions}
              onColumnChange={(val) =>
                setShowColumns(val.filter((i) => i.checked).map((i) => i.value))
              }
            />
          </div>
        </div>
        <div className={styles.list} ref={domRef}>
          <BasicTable
            ref={tableRef}
            columns={columns.filter((i) =>
              showColumns.includes(i.dataIndex as string)
            )}
            onDataChange={calculate}
            autoCreateKey={true}
            size="middle"
            fetchSetting={{
              listField: 'data.resultList',
              pageField: 'pageId',
              totalField: 'data.totalSize',
            }}
            api={async (params) => {
              const { marketId, security } = formRef.current?.getFieldsValue();
              return queryRepoInfo({
                ...params,
                ...{
                  filterCondition: {
                    marketId: marketId ? [marketId] : undefined,
                    securityCode: security ? security.securityCode : undefined,
                    fuzzyQueryFlag: 0,
                  },
                },
              });
            }}
            actionColumn={{
              width: 100,
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
                        <EditOutlined
                          ref={eipRef}
                          onClick={() =>
                            modalRef.current?.open(
                              FORM_MODE.EDIT,
                              record as RepoItem
                            )
                          }
                        />
                      ),
                    },
                  ]}
                />
              ),
            }}
            scroll={{ x: 2000 }}
            pagination={{
              showTotal: (total) => `总数：${total}`,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showQuickJumper: true,
              size: 'default',
            }}
          />
        </div>
      </div>
      <EditModal
        ref={modalRef}
        onRefresh={() => {
          tableRef.current?.reload();
          repoSelectRef.current?.refresh();
        }}
      />
    </div>
  );
};

export default InfoRepo;
