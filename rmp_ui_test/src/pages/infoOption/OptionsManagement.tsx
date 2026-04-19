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

import { queryOptionInfo, exportOptionInfo } from '@/services/securityInfo';

import { useOptionKindByMarket } from './useOptionKindByMarket';
import OptionSelectSimple from './OptionSelectSimple';
import { TRADE_MARKET_OPTION } from '@/utils/dictInfo';

export interface OptionsManagementAction {
  reload: () => void;
}

interface OptionsManagementProps {
  columns: any[];
  onAdd: () => void;
  onEdit?: (record: any) => void;
}

const OptionsManagement = forwardRef<
  OptionsManagementAction,
  OptionsManagementProps
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

  // 期权品种下拉 options（marketId 联动）
  const { optionKindOptions, optionKindLoading, fetchOptionKinds } =
    useOptionKindByMarket();

  useImperativeHandle(ref, () => ({
    reload: () => tableRef.current?.reload(),
  }));

  const calculate = () => {
    if (tableRef.current) {
      tableRef.current.setProps({
        scroll: {
          y: domHeight
            ? tableRef.current.getDataSource().length > 0
              ? domHeight - 47 - 48
              : domHeight - 47
            : 400,
          x: 3200,
        },
      });
    }
  };

  useEffect(() => {
    calculate();
  }, [domHeight]);

  // 页面首次进入：自动查询一次
  useEffect(() => {
    tableRef.current?.reload();
  }, []);

  const handleQuery = () => {
    tableRef.current?.reload();
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      const { marketId, optionsKind, security } =
        formRef.current?.getFieldsValue() || {};

      const res = await exportOptionInfo({
        marketId: marketId ? [marketId] : undefined,
        optionKindCode: optionsKind || undefined,
        securityCode: security ? security.securityCode : undefined,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <BasicForm
            ref={formRef}
            layout="inline"
            onValuesChange={(changedValues) => {
              if (
                Object.prototype.hasOwnProperty.call(changedValues, 'marketId')
              ) {
                fetchOptionKinds(changedValues.marketId, formRef);
                formRef.current?.setFieldsValue({ security: undefined });
              }
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
                field: 'optionsKind',
                label: '期权品种',
                component: 'Select',
                componentProps: {
                  placeholder: '请选择',
                  allowClear: true,
                  style: { width: '240px' },
                  loading: optionKindLoading,
                  options: optionKindOptions,
                },
              },
              {
                field: 'security',
                label: '证券代码',
                component: 'Input',
                render: (renderCallbackParams) => (
                  <OptionSelectSimple
                    marketId={
                      renderCallbackParams.values.marketId === '-1'
                        ? undefined
                        : renderCallbackParams.values.marketId
                    }
                  />
                ),
              },
            ]}
          />

          <Button type="primary" onClick={handleQuery}>
            查询
          </Button>
        </div>

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
            customKey="optionsManage"
            columns={columns.map((i) => ({
              label: i.title as string,
              value: i.dataIndex,
              disabled: i.dataIndex === 'securityCode',
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
            const { marketId, optionsKind, security } =
              formRef.current?.getFieldsValue() || {};
            return queryOptionInfo({
              ...params,
              filterCondition: {
                marketId: marketId ? [marketId] : undefined,
                optionKindCode: optionsKind ? [optionsKind] : undefined,
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

export default OptionsManagement;
