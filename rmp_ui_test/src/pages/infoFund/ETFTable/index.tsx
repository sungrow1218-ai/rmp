import { BasicForm, FormActionType } from '@/components/Form';
import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles.less';
import { Button, message } from 'antd';
import { BasicTable, TableAction, TableActionType } from '@/components/Table';
import { TRADE_MARKET, TRADE_MARKET_FUND } from '@/utils/dictInfo';
import { EditOutlined } from '@ant-design/icons';
import useEIP from '@/directives/useEIP';
import EditModal, { IAction as ModalAction } from './EditModal';
import { useHeightResize, useWidthResize } from '@/hooks';
import {
  exportEtfComponentStocksDetail,
  ETFItem,
  queryEtfComponentStocksDetail,
  FundItem,
} from '@/services/securityInfo';
import { FORM_MODE, columnOptions, columns } from './data';
import ColManage from '@/components/ColManage';
import FundSelectSimple from '../components/FundSelectSimple';

interface IProp {
  linkFund?: FundItem;
}

const ETFTable: React.FC<IProp> = ({ linkFund }) => {
  const tableRef = useRef<TableActionType>(null);
  const formRef = useRef<FormActionType>(null);
  const modalRef = useRef<ModalAction>(null);

  const domRef = useRef(null);
  const domHeight = useHeightResize(domRef);
  const domWidth = useWidthResize(domRef);

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
          x: 2200,
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
      const {
        componentMarketId,
        componentSecurityCode,
        etfMarketId,
        etfSecurity,
      } = formRef.current?.getFieldsValue();
      const res = await exportEtfComponentStocksDetail({
        componentMarketId,
        componentSecurityCode,
        etfMarketId: etfMarketId ? [etfMarketId] : undefined,
        etfSecurityCode: etfSecurity ? etfSecurity.securityCode : undefined,
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
      //  error.message && message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (linkFund) {
      formRef.current?.setFieldsValue({
        etfMarketId: linkFund.marketId,
        etfSecurity: {
          securityCode: linkFund.securityCode,
          marketId: linkFund.marketId,
          informationSystemId: linkFund.informationSystemId,
        },
      });
      tableRef.current?.reload();
    }
  }, [linkFund]);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={domRef}>
      <div className={styles.filter}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <BasicForm
            ref={formRef}
            schemas={[
              {
                field: 'componentMarketId',
                label: '交易市场',
                component: 'MultipleSelect',
                componentProps: {
                  placeholder: '请选择交易市场',
                  allowClear: true,
                  style: { width: domWidth < 1920 ? '180px' : '240px' },
                  options: TRADE_MARKET.filter((i) => i.code !== -1).map(
                    (i) => ({
                      label: `${i.code}-${i.name}`,
                      value: i.code,
                    })
                  ),
                },
              },
              {
                field: 'componentSecurityCode',
                label: '证券代码',
                component: 'Input',
                componentProps: {
                  placeholder: '请输入证券代码',
                  style: { width: domWidth < 1920 ? '180px' : '240px' },
                },
              },
              {
                field: 'etfMarketId',
                label: 'ETF基金所属市场',
                component: 'Select',
                componentProps: ({ formAction }) => ({
                  placeholder: '请选择',
                  allowClear: true,
                  style: { width: domWidth < 1920 ? '180px' : '240px' },
                  options: TRADE_MARKET_FUND.map((i) => ({
                    label: `${i.code}-${i.name}`,
                    value: i.code,
                  })),
                  onChange: (value) => {
                    formAction.setFieldValue('etfSecurity', undefined);
                  },
                }),
              },
              {
                field: 'etfSecurity',
                label: 'ETF基金代码',
                component: 'Input',
                render: (renderCallbackParams) => (
                  <FundSelectSimple
                    securityType={120202}
                    style={{ width: domWidth < 1920 ? '180px' : '240px' }}
                    marketId={renderCallbackParams.values.etfMarketId}
                  />
                ),
              },
            ]}
            layout="inline"
          />
          <Button
            onClick={() => {
              formRef.current?.resetFields();
              tableRef.current?.reload({ pagination: { current: 1 } });
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
          >
            查询
          </Button>
        </div>
        <div>
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
            customKey="etf"
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
            const {
              componentMarketId,
              componentSecurityCode,
              etfMarketId,
              etfSecurity,
            } = formRef.current?.getFieldsValue();
            return queryEtfComponentStocksDetail({
              ...params,
              ...{
                filterCondition: {
                  componentMarketId,
                  componentSecurityCode,
                  etfMarketId:
                    etfMarketId || etfSecurity
                      ? [etfMarketId || etfSecurity.marketId]
                      : undefined,
                  etfSecurityCode: etfSecurity
                    ? etfSecurity.securityCode
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
                            record as ETFItem
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
          scroll={{ x: 2200 }}
        />
      </div>
      <EditModal ref={modalRef} onRefresh={() => tableRef.current?.reload()} />
    </div>
  );
};

export default ETFTable;
