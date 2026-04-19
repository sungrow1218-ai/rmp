import { BasicForm, FormActionType } from '@/components/Form';
import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles.less';
import { Button, message } from 'antd';
import { BasicTable, TableAction, TableActionType } from '@/components/Table';
import { columns, columnOptions } from './data';
import { TRADE_MARKET_PRECIOUS_METALS } from '@/utils/dictInfo';
import { EditOutlined } from '@ant-design/icons';
import useEIP from '@/directives/useEIP';
import EditModal, { IAction as ModalAction } from './EditModal';
import { FORM_MODE } from '../data';
import { useHeightResize } from '@/hooks';
import {
  exportPreciousMetal,
  PreciousMetalItem,
  queryPreciousMetal,
} from '@/services/securityInfo';
import ColManage from '@/components/ColManage';
import PreciousMetalSelectSimple, {
  IAction as PreciousMetalAction,
} from '../components/PreciousMetalSelectSimple';

const PrimaryTable = () => {
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
              ? domHeight - 92 - 48
              : domHeight - 92
            : 400,
          x: 3200,
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
      const { marketId, prcsMetalKindCode, security } =
        formRef.current?.getFieldsValue();
      const res = await exportPreciousMetal({
        marketId: marketId ? [marketId] : undefined,
        prcsMetalKindCode: prcsMetalKindCode ? [prcsMetalKindCode] : undefined,
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

  const preciousMetalRef = useRef<PreciousMetalAction>(null);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={domRef}>
      <div className={styles.filter}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BasicForm
            ref={formRef}
            schemas={[
              {
                field: 'marketId',
                label: '交易市场',
                component: 'Select',
                componentProps: ({ formAction }) => ({
                  placeholder: '请选择',
                  allowClear: true,
                  style: { width: '240px' },
                  options: TRADE_MARKET_PRECIOUS_METALS.map((i) => ({
                    label: `${i.code}-${i.name}`,
                    value: i.code,
                  })),
                  onChange: (value) => {
                    formAction.setFieldValue('security', undefined);
                  },
                }),
              },
              {
                field: 'prcsMetalKindCode',
                label: '贵金属品种',
                component: 'Input',
                componentProps: {
                  placeholder: '请输入',
                  allowClear: true,
                  style: { width: '240px' },
                },
              },
              {
                field: 'security',
                label: '证券代码',
                component: 'Input',
                render: (renderCallbackParams) => (
                  <PreciousMetalSelectSimple
                    marketId={renderCallbackParams.values.marketId}
                    ref={preciousMetalRef}
                  />
                ),
              },
            ]}
            layout="inline"
          />
          <Button
            onClick={() => {
              formRef.current?.resetFields();
              tableRef.current?.reload();
            }}
          >
            重置
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: '16px' }}
            onClick={() =>
              tableRef.current?.reload({ pagination: { current: 1 } })
            }
            loading={loading}
          >
            查询
          </Button>
        </div>
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
            customKey="primary"
            columns={columnOptions}
            onColumnChange={(val) =>
              setShowColumns(val.filter((i) => i.checked).map((i) => i.value))
            }
          />
        </div>
      </div>
      <div className={styles.list}>
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
            const { marketId, prcsMetalKindCode, security } =
              formRef.current?.getFieldsValue();
            return queryPreciousMetal({
              ...params,
              ...{
                filterCondition: {
                  marketId:
                    marketId || security
                      ? [marketId || security.marketId]
                      : undefined,
                  prcsMetalKindCode: prcsMetalKindCode
                    ? [prcsMetalKindCode]
                    : undefined,
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
                            record as PreciousMetalItem
                          )
                        }
                      />
                    ),
                  },
                ]}
              />
            ),
          }}
          scroll={{ x: 3200 }}
          pagination={{
            showTotal: (total) => `总数：${total}`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showQuickJumper: true,
            size: 'default',
          }}
        />
      </div>
      <EditModal
        ref={modalRef}
        onRefresh={() => {
          tableRef.current?.reload();
          preciousMetalRef.current?.refresh();
        }}
      />
    </div>
  );
};

export default PrimaryTable;
