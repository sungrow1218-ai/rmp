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
  exportPreciousMetalKind,
  PreciousMetalKindItem,
  queryPreciousMetalKind,
} from '@/services/securityInfo';
import ColManage from '@/components/ColManage';

const KindTable = () => {
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
      const { marketId, prcsMetalKindCode } = formRef.current?.getFieldsValue();
      const res = await exportPreciousMetalKind({
        marketId: marketId ? [marketId] : undefined,
        prcsMetalKindCode: prcsMetalKindCode ? [prcsMetalKindCode] : undefined,
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

  return (
    <div style={{ width: '100%', height: '100%' }} ref={domRef}>
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
              componentProps: {
                placeholder: '请选择',
                allowClear: true,
                style: { width: '240px' },
                options: TRADE_MARKET_PRECIOUS_METALS.map((i) => ({
                  label: `${i.code}-${i.name}`,
                  value: i.code,
                })),
              },
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
            customKey="kind"
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
            const { marketId, prcsMetalKindCode } =
              formRef.current?.getFieldsValue();
            return queryPreciousMetalKind({
              ...params,
              ...{
                filterCondition: {
                  marketId: marketId ? [marketId] : undefined,
                  prcsMetalKindCode: prcsMetalKindCode
                    ? [prcsMetalKindCode]
                    : undefined,
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
                            record as PreciousMetalKindItem
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
      <EditModal ref={modalRef} onRefresh={() => tableRef.current?.reload()} />
    </div>
  );
};

export default KindTable;
