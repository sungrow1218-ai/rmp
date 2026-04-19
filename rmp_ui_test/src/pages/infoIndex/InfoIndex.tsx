// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.less';
import { Button, message } from 'antd';
import { BasicTable, TableAction, TableActionType } from '@/components/Table';
import { BasicForm, FormActionType } from '@/components/Form';
import {
  columnIndexOptions,
  columnIngredientOptions,
  FORM_MODE,
  indexColumns,
  ingredientColumns,
} from './data';
import EditIndexModal, { IAction as ModalIndexAction } from './EditIndexModal';
import EditIngredientModal, {
  IAction as ModalIngredientAction,
} from './EditIngredientModal';
import { TRADE_MARKET_INDEX, TRADE_MARKET_STOCK } from '@/utils/dictInfo';
import SecuritySelectSimple from '@/pages/infoStocks/components/SecuritySelectSimple';
import {
  exportIndexComponentStocksDetail,
  exportIndexInfo,
  IndexItem,
  IngredientItem,
  queryIndexComponentStocksDetail,
  queryIndexInfo,
} from '@/services/securityInfo';
import { EditOutlined } from '@ant-design/icons';
import useEIP from '@/directives/useEIP';
import ColManage from '@/components/ColManage';
import IndexSelectSimple, {
  IAction as IndexSelectAction,
} from './components/IndexSelectSimple';

const InfoIndex = () => {
  const tableIndexRef = useRef<TableActionType>(null);
  const tableIngredientRef = useRef<TableActionType>(null);
  const formIndexRef = useRef<FormActionType>(null);
  const formIngredientRef = useRef<FormActionType>(null);
  const modalIndexRef = useRef<ModalIndexAction>(null);
  const modalIngredientRef = useRef<ModalIngredientAction>(null);

  const [selected, setSelected] = useState<IndexItem>();

  const [showIndexColumns, setShowIndexColumns] = useState<string[]>(
    columnIndexOptions.map((i) => i.value)
  );

  const [showIngredientColumns, setShowIngredientColumns] = useState<string[]>(
    columnIngredientOptions.map((i) => i.value)
  );

  const [_, eipRef] = useEIP();

  const [loading, setLoading] = useState(false);

  const exportIndexFile = async () => {
    try {
      setLoading(true);
      const { marketId, security } = formIndexRef.current?.getFieldsValue();
      const res = await exportIndexInfo({
        marketId: marketId ? [marketId] : undefined,
        securityCode: security ? security.securityCode : undefined,
      });
      if (res.errorId !== 0) {
        // message.error(res.errorMessage);
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

  const [ingredientLoading, setIngredientLoading] = useState(false);

  const exportIngredientFile = async () => {
    try {
      setIngredientLoading(true);
      const { componentMarketId, componentSecurity } =
        formIngredientRef.current?.getFieldsValue();
      const res = await exportIndexComponentStocksDetail({
        componentMarketId: componentMarketId ? [componentMarketId] : undefined,
        componentSecurityCode: componentSecurity
          ? componentSecurity.securityCode
          : undefined,
        indexMarketId: selected ? [selected.marketId] : undefined,
        indexCode: selected?.securityCode,
      });
      if (res.errorId !== 0) {
        //  message.error(res.errorMessage);
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
      setIngredientLoading(false);
    }
  };

  useEffect(() => {
    if (selected) {
      formIngredientRef.current?.resetFields();
      tableIngredientRef.current?.reload({ pagination: { current: 1 } });
    }
  }, [selected]);

  const indexSelectRef = useRef<IndexSelectAction>(null);

  return (
    <div className={styles.pageStyle}>
      <div className={styles.pageTitle}>指数信息管理</div>
      <div className={styles.content}>
        <div className={styles.tableBlock}>
          <div className={styles.filter}>
            <BasicForm
              ref={formIndexRef}
              onValuesChange={() =>
                tableIndexRef.current?.reload({ pagination: { current: 1 } })
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
                    options: TRADE_MARKET_INDEX.map((i) => ({
                      label: `${i.code}-${i.name}`,
                      value: i.code,
                    })),
                    onChange: (value) => {
                      formAction.setFieldValue('security', undefined);
                      tableIndexRef.current?.reload();
                    },
                  }),
                },
                {
                  field: 'security',
                  label: '证券代码',
                  component: 'Input',
                  render: (renderCallbackParams) => (
                    <IndexSelectSimple
                      marketId={renderCallbackParams.values.marketId}
                      ref={indexSelectRef}
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
                  if (modalIndexRef.current) {
                    modalIndexRef.current.open(FORM_MODE.ADD);
                  }
                }}
              >
                新建
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: '16px' }}
                onClick={exportIndexFile}
                loading={loading}
              >
                导出
              </Button>
              <ColManage
                customKey="primary"
                columns={columnIndexOptions}
                onColumnChange={(val) =>
                  setShowIndexColumns(
                    val.filter((i) => i.checked).map((i) => i.value)
                  )
                }
              />
            </div>
          </div>
          <div className={styles.list}>
            <BasicTable
              ref={tableIndexRef}
              columns={indexColumns.filter((i) =>
                showIndexColumns.includes(i.dataIndex as string)
              )}
              autoCreateKey={true}
              size="middle"
              rowClassName={(record: any) => {
                if (!selected) return '';
                if (
                  record.marketId === selected.marketId &&
                  record.securityCode === selected.securityCode &&
                  record.informationSystemId === selected.informationSystemId
                ) {
                  return styles.selectedRowBg;
                } else {
                  return '';
                }
              }}
              fetchSetting={{
                listField: 'data.resultList',
                pageField: 'pageId',
                totalField: 'data.totalSize',
              }}
              api={async (params) => {
                const { marketId, security } =
                  formIndexRef.current?.getFieldsValue();
                return queryIndexInfo({
                  ...params,
                  ...{
                    filterCondition: {
                      marketId:
                        marketId || security
                          ? [marketId || security.marketId]
                          : undefined,
                      securityCode: security
                        ? security.securityCode
                        : undefined,
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
                              modalIndexRef.current?.open(
                                FORM_MODE.EDIT,
                                record as IndexItem
                              )
                            }
                          />
                        ),
                      },
                    ]}
                  />
                ),
              }}
              pagination={{
                showTotal: (total) => `总数：${total}`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showQuickJumper: true,
                size: 'default',
              }}
              onRowClick={(record) => setSelected(record as IndexItem)}
            />
          </div>
          <EditIndexModal
            ref={modalIndexRef}
            onRefresh={() => {
              tableIndexRef.current?.reload();
              indexSelectRef.current?.refresh();
            }}
          />
        </div>
        <div className={styles.tableBlock} style={{ marginTop: '16px' }}>
          <div className={styles.filter}>
            <BasicForm
              ref={formIngredientRef}
              onValuesChange={() =>
                tableIngredientRef.current?.reload({
                  pagination: { current: 1 },
                })
              }
              schemas={[
                {
                  field: 'componentMarketId',
                  label: '交易市场',
                  component: 'Select',
                  componentProps: ({ formAction }) => ({
                    placeholder: '请选择',
                    allowClear: true,
                    style: { width: '240px' },
                    options: TRADE_MARKET_STOCK.map((i) => ({
                      label: `${i.code}-${i.name}`,
                      value: i.code,
                    })),
                    onChange: (value) => {
                      formAction.setFieldValue('componentSecurity', undefined);
                      tableIngredientRef.current?.reload();
                    },
                  }),
                },
                {
                  field: 'componentSecurity',
                  label: '证券代码',
                  component: 'Input',
                  render: (renderCallbackParams) => (
                    <SecuritySelectSimple
                      marketId={
                        renderCallbackParams.values.componentMarketId ||
                        undefined
                      }
                    />
                  ),
                },
              ]}
              layout="inline"
            />
            <div className={styles.actionBar}>
              <Button
                type="primary"
                disabled={!selected}
                onClick={() => {
                  if (modalIngredientRef.current) {
                    modalIngredientRef.current.open(FORM_MODE.ADD, {
                      indexCode: selected!.securityCode,
                      indexMarketId: selected!.marketId,
                    });
                  }
                }}
              >
                新建
              </Button>
              <Button
                type="primary"
                disabled={!selected}
                style={{ marginLeft: '16px' }}
                onClick={exportIngredientFile}
                loading={ingredientLoading}
              >
                导出
              </Button>
              <ColManage
                customKey="ingredient"
                columns={columnIngredientOptions}
                onColumnChange={(val) =>
                  setShowIngredientColumns(
                    val.filter((i) => i.checked).map((i) => i.value)
                  )
                }
              />
            </div>
          </div>
          <div className={styles.list}>
            <BasicTable
              ref={tableIngredientRef}
              columns={ingredientColumns.filter((i) =>
                showIngredientColumns.includes(i.dataIndex as string)
              )}
              immediate={false}
              autoCreateKey={true}
              size="middle"
              fetchSetting={{
                listField: 'data.resultList',
                pageField: 'pageId',
                totalField: 'data.totalSize',
              }}
              api={async (params) => {
                const { componentMarketId, componentSecurity } =
                  formIngredientRef.current?.getFieldsValue();
                return queryIndexComponentStocksDetail({
                  ...params,
                  ...{
                    filterCondition: {
                      indexCode: selected?.securityCode,
                      indexMarketId: [selected!.marketId],
                      ...(componentMarketId || componentSecurity
                        ? {
                            componentMarketId:
                              componentMarketId || componentSecurity
                                ? [
                                    componentMarketId ||
                                      componentSecurity.marketId,
                                  ]
                                : undefined,
                            componentSecurityCode: componentSecurity
                              ? componentSecurity.securityCode
                              : undefined,
                          }
                        : {}),
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
                              modalIngredientRef.current?.open(
                                FORM_MODE.EDIT,
                                {
                                  indexCode: selected!.securityCode,
                                  indexMarketId: selected!.marketId,
                                },
                                record as IngredientItem
                              )
                            }
                          />
                        ),
                      },
                    ]}
                  />
                ),
              }}
              pagination={{
                showTotal: (total) => `总数：${total}`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showQuickJumper: true,
                size: 'default',
              }}
            />
          </div>
          <EditIngredientModal
            ref={modalIngredientRef}
            onRefresh={() => tableIngredientRef.current?.reload()}
          />
        </div>
      </div>
    </div>
  );
};

export default InfoIndex;
