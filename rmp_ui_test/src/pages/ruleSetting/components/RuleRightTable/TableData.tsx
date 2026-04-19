/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-lines */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Popconfirm, Badge, message, Pagination, Table } from 'antd';
import { type alterRuleStatusParams, type ResultList } from '@/services/rule';
import moment from 'moment';
import {
  DIMENSION_CONTROL_TYPES,
  RULE_CONTROL_DIM,
  RULE_TYPE_LEVEL_2,
  SECURITY_AGGREGATION_METHODS,
  SECURITY_CONTROL_TYPES__MAP,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import { BookList, SobInfo } from '@/services/account';
import { useUserRoles, useWidthResize } from '@/hooks';
import { useMemoizedFn, useLockFn } from 'ahooks';
import { type PaginationType } from '@/services/typing';
import SubTable from './SubTable';
import styles from './style.less';
import { isProgress } from '@/components/IsProscess/InProcess';
import ProcessModal from '../ProcessModal';
import useEIP from '@/directives/useEIP';

import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { QueryRuleSettingRspDTO } from '@/services/ruleSetting/dto';
import { alterRuleStatus } from '@/services/ruleSetting';
import { Mode, TableListType } from '../../type';
import IconRuleTypeSrc from '@/assets/icon/icon_ruleType.png';
import AccountControlTypeTag from '../AccountControlTypeTag';
import UnionControlTypeTag from '../UnionControlTypeTag';

const ResizableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0} // 垂直方向不进行拖拽
      onResize={onResize}
      axis="x"
      draggableOpts={{ enableUserSelectHack: false }}
      handle={<div className="resizable-handler"></div>}
    >
      <th {...restProps} />
    </Resizable>
  );
};

type ProcessType = ResultList & { sobInfo?: SobInfo };
interface AllSobInfo {
  workGroupId: number;
  sobId?: number;
  sobName?: string;
  bookList?: BookList[];
  workGroupName: string;
}

type FuncAuth = {
  editAuth: boolean;
  queryAuth: boolean;
};

interface Props {
  tableLoading: boolean;
  tableData: TableListType[];
  setEditFormData: (value: QueryRuleSettingRspDTO) => void;
  setMode: (value: Mode) => void;
  setVisible: (value: boolean) => void;
  onDelete: (value: QueryRuleSettingRspDTO) => void;
  refetch: () => void;
  size?: number;
  onSearch: (page: number, pageSize: number) => void;
  pagination: PaginationType;
  sobInfo: AllSobInfo[];
  funcAuth: FuncAuth;
  showColumns: string[];
}

const TableData: React.FC<Props> = ({
  onDelete,
  setVisible,
  setMode,
  setEditFormData,
  tableLoading,
  tableData,
  refetch,
  size,
  onSearch,
  pagination,
  sobInfo,
  funcAuth,
  showColumns,
}) => {
  const { activeRoleId } = useUserRoles();
  const [procedureCode, setProcedureCode] = useState('');

  // 1无行为  2 老切片  3 新切片
  const [open, setOpen] = useState(false);
  const [processData, setProcessData] = useState<
    ResultList & { sobInfo?: SobInfo }
  >();
  const [alterType, setAlterType] = useState<number>(1); //

  const tableDom = useRef<HTMLDivElement>(null);

  const tableWidth = useWidthResize(tableDom);

  const onProcessResult = (value: number) => {
    if (!value || value === 1) {
      return;
    }
    if (value === 3) {
      setEditFormData(processData as QueryRuleSettingRspDTO);
      setVisible(true);
    }

    if (value === 2 || value === 4) {
      setVisible(true);
    }
    if (value === 5) {
      refetch();
    }
  };

  const [_, eipRef] = useEIP();

  const [columns, setColumns] = useState<any[]>([]);

  const columnsWidthMap = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    const template = [
      {
        title: '规则编号',
        dataIndex: 'ruleId',
        width: 75,
        minWidth: 75,
        render(_: any, record: Recordable) {
          return <>{record.ruleBaseInfo.ruleId}</>;
        },
      },
      {
        title: '规则类型',
        dataIndex: 'ruleType',
        width: 250,
        minWidth: 250,
        ellipsis: true,
        render(_: any, record: Recordable) {
          return (
            <div>
              <div
                style={{
                  padding: '4px 8px',
                  background: 'rgba(255,247,237,0.4)',
                  borderRadius: '4px 4px 4px 4px',
                  border: '1px solid rgba(241,171,74,0.2)',
                  display: 'inline-block',
                  color: '#BB744A',
                }}
              >
                <img
                  style={{ width: '16px', height: '16px', marginRight: '4px' }}
                  src={IconRuleTypeSrc}
                />
                {transformDictCodeToNameHelper(
                  record.ruleBaseInfo.ruleType,
                  RULE_TYPE_LEVEL_2
                )}
              </div>
            </div>
          );
        },
      },
      {
        title: '规则名称',
        dataIndex: 'ruleName',
        ellipsis: true,
        width: 250,
        minWidth: 250,
        render(_: any, record: Recordable) {
          return `${record.ruleBaseInfo.ruleName}`;
        },
      },
      {
        title: '启用状态',
        width: 100,
        minWidth: 100,
        dataIndex: 'ruleStatus',
        render(_: any, record: Recordable) {
          const value = record.ruleBaseInfo.ruleStatus.toString();
          return (
            <div>
              <Badge
                color={value === '1' ? '#3F88F1' : '#F94736'}
                size="small"
                style={{ marginRight: '8px' }}
              />
              {value === '1' ? (
                <span style={{ color: '#3F88F1' }}>已启用</span>
              ) : (
                <span style={{ color: '#F94736' }}>已停用</span>
              )}
            </div>
          );
        },
      },
      {
        title: '优先级',
        dataIndex: 'rulePriority',
        width: 90,
        minWidth: 90,
        render(_: any, record: Recordable) {
          return (
            <span
              style={{
                display: 'inline-block',
                width: '40px',
                height: '32px',
                background: '#FFF2E1',
                borderRadius: '4px',
                border: '1px solid rgba(241,171,74,0.2)',
                textAlign: 'center',
                lineHeight: '32px',
                color: '#F1AB4A',
              }}
            >
              {record.ruleBaseInfo.rulePriority ?? ''}
            </span>
          );
        },
      },
      {
        title: '账户控制类型',
        dataIndex: 'ruleControDim',
        width: 120,
        minWidth: 120,
        render(_: any, record: Recordable) {
          const sobWithID = sobInfo?.find(
            (item) => item.workGroupId === record.workGroupId
          );
          const option: any[] = [];
          sobWithID?.bookList?.forEach((p) => {
            p.bookLevelList.forEach((it) => {
              option.push({
                label: it.bookLevelName,
                bookType: p.bookType,
                bookLevel: it.bookLevel,
              });
            });
          });
          const ruleControlType = record.ruleControlAcct?.controlAcctType ?? 3;
          const ruleControlLevel = record.ruleControlAcct?.acctLevel ?? 0;
          let text = '';
          if (ruleControlType !== 1 && ruleControlType !== 2) {
            text =
              RULE_CONTROL_DIM.find((p) => p.code === String(ruleControlType))
                ?.name ?? '';
          } else if (ruleControlType === 1) {
            text =
              option?.find(
                (it) => it.bookType === 2 && ruleControlLevel === it.bookLevel
              )?.label ?? '';
          } else if (ruleControlType === 2) {
            text =
              option?.find(
                (it) => it.bookType === 1 && ruleControlLevel === it.bookLevel
              )?.label ?? '';
          }
          return <AccountControlTypeTag text={text} />;
        },
      },
      {
        title: '联合控制模式',
        dataIndex: 'unionControlType',
        width: 160,
        minWidth: 160,
        render(_: any, record: Recordable) {
          const ruleControlType = record.ruleControlAcct?.unionControlType ?? 0;
          const value =
            DIMENSION_CONTROL_TYPES.find(
              (it) => it.code === String(ruleControlType)
            )?.name ?? '';
          return <UnionControlTypeTag text={value} />;
        },
      },
      {
        title: '证券控制方式',
        dataIndex: 'securityControlType',
        width: 120,
        minWidth: 120,
        render(_: any, record: Recordable) {
          const ruleControlType =
            record.ruleControlSecurity.securityControlType ?? 0;
          const value =
            Object.values(SECURITY_CONTROL_TYPES__MAP).find(
              (it) => it.code === String(ruleControlType)
            )?.name ?? '';
          return value;
        },
      },
      {
        title: '证券汇总方式',
        dataIndex: 'securitySummaryType',
        width: 120,
        minWidth: 120,
        render(_: any, record: Recordable) {
          const ruleControlType =
            record.ruleControlSecurity.securitySummaryType ?? 0;
          const value =
            SECURITY_AGGREGATION_METHODS.find(
              (it) => it.code === String(ruleControlType)
            )?.name ?? '';

          return value;
        },
      },
      {
        title: '创建人',
        dataIndex: 'createUserCode',
        width: 100,
        minWidth: 100,
        render(_: any, record: Recordable) {
          return <>{record.createUserCode}</>;
        },
      },
      {
        title: '修改人',
        dataIndex: 'updateUserCode',
        width: 100,
        minWidth: 100,
        render(_: any, record: Recordable) {
          return <>{record.updateUserCode}</>;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createDateTime',
        width: 180,
        minWidth: 180,
        render(_: any, record: Recordable) {
          const timeMonent = moment(
            String(record.createDateTime),
            'YYYYMMDDHHmmss'
          );
          if (timeMonent.isValid()) {
            return <div>{timeMonent.format('YYYY-MM-DD kk:mm:ss')}</div>;
          }
          return null;
        },
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateTime',
        width: 180,
        minWidth: 180,
        render(_: any, record: Recordable) {
          const timeMonent = moment(
            String(record.lastUpdateTime),
            'YYYYMMDDHHmmss'
          );
          if (timeMonent.isValid()) {
            return <div>{timeMonent.format('YYYY-MM-DD kk:mm:ss')}</div>;
          }
          return null;
        },
      },
    ];
    const result = [];
    for (const item of template) {
      if (!columnsWidthMap.current[item.dataIndex]) {
        columnsWidthMap.current[item.dataIndex] = item.width;
      }
      if (showColumns.includes(item.dataIndex)) {
        result.push({
          ...item,
          width: columnsWidthMap.current[item.dataIndex],
        } as any);
      }
    }
    result.push({
      title: '操作',
      dataIndex: 'action',
      width: 190,
      minWidth: 190,
      fixed: 'right',
      render(_: any, record: Recordable) {
        const { editAuth, queryAuth } = funcAuth;
        const dataAuth = activeRoleId === record.createRoleId;
        const auth = editAuth && dataAuth;
        const status = record.ruleBaseInfo.ruleStatus.toString();
        return (
          <div className={styles.operationBox}>
            {auth &&
              (status === '2' ? (
                <Button
                  onClick={() => {
                    onRuleStatus(record as ResultList);
                  }}
                  type="link"
                  ref={eipRef}
                  color="primary"
                >
                  启用
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    onRuleStatus(record as ResultList);
                  }}
                  type="link"
                  ref={eipRef}
                  color="primary"
                >
                  禁用
                </Button>
              ))}
            {auth && (
              <Button
                ref={eipRef}
                onClick={async () => {
                  setMode('EDIT');
                  setEditFormData(record as QueryRuleSettingRspDTO);
                  const processList = await isProgress(
                    1,
                    record.ruleBaseInfo.ruleId
                  );
                  const { sobInfo } = record;
                  if (processList && processList.length > 0) {
                    let ruleData: any = null;
                    const type = processList[0]?.alterType ?? 1;
                    const _procedureCode = processList[0]?.procedureCode ?? '';
                    setAlterType(processList[0]?.alterType);
                    if (type === 3) {
                      ruleData = JSON.parse(processList[0].textBefore);
                    } else {
                      ruleData = JSON.parse(processList[0].textAfter);
                    }
                    const newRecord = { ...ruleData, sobInfo };
                    setProcedureCode(_procedureCode);
                    setProcessData(newRecord as ProcessType);
                    setOpen(true);
                  } else {
                    setVisible(true);
                  }
                }}
                type="link"
                color="primary"
              >
                编辑
              </Button>
            )}
            {auth && (
              <Button
                onClick={() => {
                  setEditFormData(record as QueryRuleSettingRspDTO);
                  setMode('ADD_VIA_COPY');
                  setVisible(true);
                }}
                type="link"
                ref={eipRef}
                color="primary"
              >
                复制
              </Button>
            )}
            {auth && (
              <Popconfirm
                title="确认是否删除？"
                onConfirm={async () => {
                  const processList = await isProgress(
                    1,
                    record.ruleBaseInfo.ruleId
                  );
                  if (processList && processList.length > 0) {
                    message.warning('已有在途流程，请撤销或流程办结后操作');
                  } else {
                    onDelete(record as QueryRuleSettingRspDTO);
                  }
                }}
              >
                <Button ref={eipRef} type="link" color="primary">
                  删除
                </Button>
              </Popconfirm>
            )}
          </div>
        );
      },
    });
    setColumns(result);
  }, [sobInfo, showColumns, funcAuth, activeRoleId]);

  const handleResize =
    (index: number) =>
    (e: any, { size }: { size: { width: number; height: number } }) => {
      const nextColumns = [...columns];
      const finalWidth = Math.max(nextColumns[index].minWidth!, size.width);
      nextColumns[index] = {
        ...nextColumns[index],
        width: finalWidth,
      };
      columnsWidthMap.current[nextColumns[index].dataIndex] = size.width;
      setColumns(nextColumns);
    };

  const mergedColumns = useMemo(
    () =>
      columns.map((col, index) => ({
        ...col,
        onHeaderCell: (column: any) => ({
          width: column.width,
          onResize: handleResize(index),
          minWidth: column.minWidth,
        }),
      })),
    [columns]
  );

  const onRuleStatus = useMemoizedFn(
    useLockFn(async (record: ResultList) => {
      try {
        const processList = await isProgress(1, record.ruleBaseInfo.ruleId);
        if (processList && processList.length > 0) {
          message.warning('已有在途流程，请撤销或流程办结后操作');
          return;
        }
        const status =
          record.ruleBaseInfo.ruleStatus.toString() === '1' ? 2 : 1;
        const params: alterRuleStatusParams = {
          workGroupId: record.workGroupId,
          operatorCode: '123',
          ruleStatus: status,
          ruleId: record.ruleBaseInfo.ruleId,
        };
        const result = await alterRuleStatus(params);
        if (result.code === 145003) {
          message.success({
            content: '启用状态已更新,需要复核后生效',
          });
          refetch();
          return;
        } else if (result.code !== 0) {
          // message.error({
          //   content: `${result.message}`,
          // });
          return;
        }
        refetch();
        message.success({
          content: status.toString() === '1' ? '启用成功' : '禁用成功',
        });
      } catch (error) {}
    })
  );

  return (
    <div
      style={{
        flex: '1 auto',
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
      }}
    >
      <div
        className={styles.tableBase}
        style={{ flex: '1 auto' }}
        ref={tableDom}
      >
        <Table
          size="middle"
          columns={mergedColumns}
          dataSource={tableData ?? []}
          loading={tableLoading}
          rowKey={'key'}
          pagination={false}
          onRow={(record) => {
            return {
              onDoubleClick: (event) => {
                event.stopPropagation();
                if (funcAuth.queryAuth) {
                  setEditFormData(record);
                  setMode('PREVIEW');
                  setVisible(true);
                }
              },
            };
          }}
          scroll={{
            y: size ? size - 118 : undefined,
            x: '100%',
          }}
          // tableLayout="fixed"
          expandable={{
            expandedRowRender: (record) => (
              <SubTable
                record={record}
                showColumns={showColumns}
                tableWidth={tableWidth}
              />
            ),
            rowExpandable: (record) => (record.ruleRelaList || []).length > 0,
          }}
          components={{
            header: {
              cell: ResizableTitle,
            },
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Pagination
          pageSizeOptions={['10', '20', '50', '100', '200']}
          showSizeChanger={true}
          style={{
            paddingTop: '5px',
          }}
          showQuickJumper={true}
          showTotal={(total) => `总数：${total}`}
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={onSearch}
        />
        <ProcessModal
          procedureCode={procedureCode}
          alterType={alterType}
          open={open}
          setOpen={setOpen}
          onProcessResult={onProcessResult}
        />
      </div>
    </div>
  );
};

export default TableData;
