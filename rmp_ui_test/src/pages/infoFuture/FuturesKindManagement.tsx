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

import { queryFutureKindInfo, exportFutureKind } from '@/services/securityInfo';
import { TRADE_MARKET_FUTURE } from '@/utils/dictInfo';

export interface FuturesKindManagementAction {
  reload: () => void;
}

interface FuturesKindManagementProps {
  columns: any[];
  onAdd: () => void;
  onEdit?: (record: any) => void;
}

const FuturesKindManagement = forwardRef<
  FuturesKindManagementAction,
  FuturesKindManagementProps
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

  // ===== 品种下拉 =====
  const [kindOptions, setKindOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [kindLoading, setKindLoading] = useState(false);

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

  const fetchKindOptions = async (mkt?: number) => {
    if (!mkt) {
      setKindOptions([]);
      formRef.current?.setFieldsValue({ futuresKindCode: undefined });
      return;
    }
    setKindLoading(true);
    try {
      const res = await queryFutureKindInfo({
        pageId: 1,
        pageSize: 500,
        filterCondition: { marketId: [mkt] },
      });

      if (res?.errorId !== 0) {
        // message.error(res?.errorMessage || '期货品种下拉查询失败');
        setKindOptions([]);
        return;
      }

      const list = res?.data?.resultList ?? [];

      setKindOptions(
        list.map((i: any) => ({
          label: `${i.futuresKindCode}-${i.futuresKindName}`,
          value: i.futuresKindCode,
        }))
      );

      // market 变化，清空已选
      formRef.current?.setFieldsValue({ futuresKindCode: undefined });
    } catch (e: any) {
      console.error(e);
      // message.error(e?.message || '期货品种下拉查询失败');
      setKindOptions([]);
    } finally {
      setKindLoading(false);
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
      const { marketId, futuresKindCode } =
        formRef.current?.getFieldsValue() || {};

      const res = await exportFutureKind({
        marketId: marketId ? [marketId] : undefined,
        futuresKindCode: futuresKindCode || undefined,
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
      //  message.error(e?.message || '导出失败');
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
            // marketId 变化：联动下拉 + 查表
            if (
              Object.prototype.hasOwnProperty.call(changedValues, 'marketId')
            ) {
              fetchKindOptions(changedValues.marketId);
              debouncedReload();
              return;
            }
            // 其它条件变化：实时查
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
                options: TRADE_MARKET_FUTURE.map((i) => ({
                  label: `${i.code}-${i.name}`,
                  value: i.code,
                })),
              },
            },
            {
              field: 'futuresKindCode',
              label: '期货品种代码',
              component: 'Select',
              componentProps: {
                placeholder: '请选择',
                allowClear: true,
                style: { width: '240px' },
                loading: kindLoading,
                options: kindOptions,
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
            customKey="futuresKindManage"
            columns={columns.map((i) => ({
              label: i.title as string,
              value: i.dataIndex,
              disabled: i.dataIndex === 'futuresKindCode',
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
          api={(params) => {
            const { marketId, futuresKindCode } =
              formRef.current?.getFieldsValue() || {};
            return queryFutureKindInfo({
              ...params,
              filterCondition: {
                marketId: marketId ? [marketId] : undefined,
                futuresKindCode: futuresKindCode
                  ? [futuresKindCode]
                  : undefined,
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

export default FuturesKindManagement;
