import { BasicForm, FormActionType } from '@/components/Form';
import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles.less';
import { Button, message } from 'antd';
import { BasicTable, TableAction, TableActionType } from '@/components/Table';
import { TRADE_MARKET_FUND } from '@/utils/dictInfo';
import { EditOutlined } from '@ant-design/icons';
import useEIP from '@/directives/useEIP';
import EditModal, { IAction as ModalAction } from './EditModal';
import { useHeightResize } from '@/hooks';
import {
  exportInvestFundInfo,
  FundItem,
  queryInvestFundInfo,
} from '@/services/securityInfo';
import RatingModal, { IAction as RatingAction } from './RatingModal';
import { columnOptions, FORM_MODE, getColumns } from './data';
import ColManage from '@/components/ColManage';
import FundSelectSimple, {
  IAction as FundSelectAction,
} from '../components/FundSelectSimple';
import RelativeModal, { IAction as RelativeAction } from './RelativeModal';

interface IProp {
  onLink: (fund: FundItem) => void;
}

const FundTable: React.FC<IProp> = ({ onLink }) => {
  const tableRef = useRef<TableActionType>(null);
  const formRef = useRef<FormActionType>(null);
  const modalRef = useRef<ModalAction>(null);
  const ratingRef = useRef<RatingAction>(null);
  const relativeRef = useRef<RelativeAction>(null);

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
          x: 3800,
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
      const res = await exportInvestFundInfo({
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
      //  error.message && message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (value: FundItem) => {
    if (ratingRef.current) {
      ratingRef.current.open(value);
    }
  };

  const handleLink = (value: FundItem) => {
    onLink(value);
  };

  const handleRelativeClick = (value: FundItem) => {
    if (relativeRef.current) {
      relativeRef.current.open(value);
    }
  };

  const fundSelectRef = useRef<FundSelectAction>(null);

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
              componentProps: ({ formAction }) => ({
                placeholder: '请选择',
                allowClear: true,
                style: { width: '240px' },
                options: TRADE_MARKET_FUND.map((i) => ({
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
                <FundSelectSimple
                  marketId={renderCallbackParams.values.marketId}
                  ref={fundSelectRef}
                />
              ),
            },
          ]}
          layout="inline"
        />
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
            customKey="fund"
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
          columns={getColumns(
            handleRatingClick,
            handleLink,
            handleRelativeClick
          ).filter((i) => showColumns.includes(i.dataIndex as string))}
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
            return queryInvestFundInfo({
              ...params,
              filterCondition: {
                querySecurityRatingFlag: '1',
                marketId:
                  marketId || security
                    ? [marketId || security.marketId]
                    : undefined,
                securityCode: security ? security.securityCode : undefined,
                fuzzyQueryFlag: 0,
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
                            record as FundItem
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
          scroll={{ x: 3600 }}
        />
      </div>
      <EditModal
        ref={modalRef}
        onRefresh={() => {
          tableRef.current?.reload();
          fundSelectRef.current?.refresh();
        }}
      />
      <RatingModal ref={ratingRef} />
      <RelativeModal ref={relativeRef} />
    </div>
  );
};

export default FundTable;
