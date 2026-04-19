import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { BasicForm, FormActionType } from '@/components/Form';
import { BasicTable, TableAction, TableActionType } from '@/components/Table';
import useEIP from '@/directives/useEIP';
import { useHeightResize } from '@/hooks';
import ColManage from '@/components/ColManage/ColManage';
import styles from './styles.less';

import { queryOptionKind, exportOptionKind } from '@/services/securityInfo';
import { TRADE_MARKET_OPTION } from '@/utils/dictInfo';

export interface OptionsKindManagementAction {
  reload: () => void;
}

interface OptionsKindManagementProps {
  columns: any[];
  onAdd: () => void;
  onEdit?: (record: any) => void;
}

const OptionsKindManagement = forwardRef<
  OptionsKindManagementAction,
  OptionsKindManagementProps
>(({ columns, onAdd, onEdit }, ref) => {
  const tableRef = useRef<TableActionType>(null);
  const formRef = useRef<FormActionType>(null);
  const domRef = useRef(null);
  const [_, eipRef] = useEIP();

  const [showColumns, setShowColumns] = useState<string[]>(
    columns.map((i) => i.value)
  );

  const domHeight = useHeightResize(domRef);
  const [exportLoading, setExportLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    reload: () => tableRef.current?.reload(),
  }));

  const reloadTimer = useRef<any>(null);
  const debouncedReload = () => {
    if (reloadTimer.current) clearTimeout(reloadTimer.current);
    reloadTimer.current = setTimeout(() => {
      tableRef.current?.reload();
    }, 250);
  };

  const [optionKindOptions, setOptionKindOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [optionKindLoading, setOptionKindLoading] = useState(false);

  const fetchOptionKindOptions = async (mkt?: number) => {
    if (!mkt) {
      setOptionKindOptions([]);
      formRef.current?.setFieldsValue({ optionKindCode: undefined });
      return;
    }

    setOptionKindLoading(true);
    try {
      const res = await queryOptionKind({
        pageId: 1,
        pageSize: 500,
        filterCondition: {
          marketId: [mkt],
        },
      });

      if (res?.errorId !== 0) {
        // message.error(res?.errorMessage || '期权品种下拉查询失败');
        setOptionKindOptions([]);
        return;
      }

      const list = res?.data?.resultList ?? [];

      setOptionKindOptions(
        list.map((i: any) => ({
          label: `${i.optionKindCode}-${i.optionKindName}`,
          value: i.optionKindCode,
        }))
      );

      formRef.current?.setFieldsValue({ optionKindCode: undefined });
    } catch (e: any) {
      console.error(e);
      // message.error(e?.message || '期权品种下拉查询失败');
      setOptionKindOptions([]);
    } finally {
      setOptionKindLoading(false);
    }
  };

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

  useEffect(() => {
    tableRef.current?.reload();
  }, []);

  const handleExport = async () => {
    try {
      setExportLoading(true);
      const { marketId, optionKindCode } =
        formRef.current?.getFieldsValue() || {};

      const res = await exportOptionKind({
        marketId: marketId ? [marketId] : undefined,
        optionKindCode: optionKindCode || undefined,
      });

      if (res?.errorId !== 0) {
        message.error(res?.message || '导出失败');
        return;
      }

      const fileUrl = res?.data?.fileUrl;
      if (fileUrl) {
        location.href = fileUrl;
      } else {
        message.error('导出文件地址为空');
      }
    } catch (e: any) {
      console.error(e);
      // message.error(e?.message || '导出失败');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <>
      <div className={styles.filter}>
        <BasicForm
          ref={formRef}
          layout="inline"
          onValuesChange={(changedValues) => {
            if (
              Object.prototype.hasOwnProperty.call(changedValues, 'marketId')
            ) {
              fetchOptionKindOptions(changedValues.marketId);
            }
            debouncedReload();
          }}
          schemas={[
            {
              field: 'marketId',
              label: '交易市场',
              component: 'Select',
              componentProps: {
                placeholder: '请选择',
                allowClear: true,
                style: { width: '240px' },
                options: TRADE_MARKET_OPTION.map((i) => ({
                  label: `${i.code}-${i.name}`,
                  value: i.code,
                })),
              },
            },
            {
              field: 'optionKindCode',
              label: '期权品种代码',
              component: 'Select',
              componentProps: {
                placeholder: '请选择',
                allowClear: true,
                style: { width: '240px' },
                loading: optionKindLoading,
                options: optionKindOptions,
              },
            },
          ]}
        />

        <div className={styles.actionBar}>
          <Button type="primary" onClick={onAdd}>
            新建
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: '16px' }}
            onClick={handleExport}
            loading={exportLoading}
          >
            导出
          </Button>

          <ColManage
            customKey="optionsKind"
            columns={columns.map((i) => ({
              label: i.title as string,
              value: i.dataIndex,
              disabled: i.dataIndex === 'optionKindCode',
            }))}
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
            const { marketId, optionKindCode } =
              formRef.current?.getFieldsValue() || {};

            return queryOptionKind({
              ...params,
              filterCondition: {
                marketId: marketId ? [marketId] : undefined,
                optionKindCode: optionKindCode ? [optionKindCode] : undefined,
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
                        onClick={() => onEdit?.(record)}
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
    </>
  );
});

export default OptionsKindManagement;
