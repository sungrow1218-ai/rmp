import React, { useEffect, useRef, useState } from 'react';
import {
  Table,
  Pagination,
  Badge,
  Space,
  Button,
  Popconfirm,
  message,
} from '@ht/sprite-ui';
import type { ColumnsType } from '@ht/sprite-ui/es/table';

import { transformDictCodeToNameHelper } from '@/utils/dict';
import { BasicColumn, TableAction } from '@/components/Table';
import { isArray } from 'lodash';

import styles from '../styles.less';

import { ProcessListData, queryProcess } from '@/services/process';
import { PaginationType } from '@/services/typing';
import { PROCEDURE_STATUS, PROCEDURE_TYPE } from '../dict';
import { useMemoizedFn } from 'ahooks';
import { getPopupContainer } from '@/utils/dom';

interface Props {
  tableData: ProcessListData[];
  tableLoading: boolean;
  pagination: PaginationType;
  size?: number;
  onSearch: (page: number, pageSize: number) => void;
  onMySearch: (page: number, pageSize: number) => void;
  handleDetail: (value: any) => void;
  searchType: number;
  setMode: (value: string) => void;
  eipAble: number;
}

function getPopupContainerTbody(node?: HTMLElement): HTMLElement {
  const nod =
    node?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode
      ?.parentNode;
  console.log('====================================');
  console.log(nod);
  console.log('====================================');
  return (nod as HTMLElement) ?? document.body;
}

const getStatus = (value: number) => {
  switch (value) {
    case 1:
      return (
        <div>
          <Badge color={'#BB744A'} />
          <span style={{ color: '#BB744A' }}>处理中</span>
        </div>
      );
    case 2:
      return (
        <div>
          <Badge color={'#52C41A'} />
          <span style={{ color: '#52C41A' }}>已办结</span>
        </div>
      );
    case 3:
      return (
        <div>
          <Badge color={'#979797'} />
          <span style={{ color: '#979797' }}>已撤销</span>
        </div>
      );
    default:
      <div>
        <Badge color={'#BB744A'} />
        <span style={{ color: '#BB744A' }}>已创建</span>
      </div>;
  }
};

const TableData: React.FC<Props> = ({
  tableData,
  tableLoading,
  pagination,
  size,
  onSearch,
  handleDetail,
  onMySearch,
  searchType,
  setMode,
  eipAble,
}) => {
  const queryisProcess = useMemoizedFn(
    async (approval: number, procedureCode: string | undefined) => {
      try {
        if (!procedureCode) {
          return;
        }

        const res = await queryProcess({
          procedureCode,
          approval,
        });
        if (res.code !== 0) {
          // message.error(res.message);
          return;
        }
        message.success('撤销成功');
        if (searchType === 0) {
          onSearch(1, pagination.pageSize);
        } else {
          onMySearch(1, pagination.pageSize);
        }
      } catch (error) {
        // message.error({ content: '撤销失败' });
      }
    }
  );
  const columns: ColumnsType<ProcessListData> = [
    {
      title: '流程类型',
      dataIndex: 'procedureType',
      width: 100,
      render: (_, record) => {
        return transformDictCodeToNameHelper(
          record.procedureType?.toString() ?? '',
          PROCEDURE_TYPE
        );
      },
      align: 'center',
    },
    {
      title: '流程名称',
      dataIndex: 'procedureName',
      ellipsis: true,
    },
    {
      title: '当前状态',
      width: '8%',
      dataIndex: 'generalStatus',

      render: getStatus,
    },
    {
      title: '发起人',
      width: '8%',
      dataIndex: 'creator',
      ellipsis: true,
      render: (value) => {
        if (value !== -1) {
          return value;
        } else {
          return '系统';
        }
      },
    },
    {
      title: '当前处理人',
      ellipsis: true,
      width: '13%',
      dataIndex: 'currentProcessors',
      render: (text) => `${isArray(text) ? text.join('\u00A0\u00A0') : text}`,
    },
    {
      title: '发起时间',
      width: '10%',
      dataIndex: 'createTime',
    },
    {
      title: '办结时间',
      width: '10%',
      dataIndex: 'finishTime',
    },
    {
      title: '操作',
      align: 'center',
      width: '150px',
      render: (_, record) => {
        return (
          <div style={{ textAlign: 'start' }}>
            <Space>
              {(record.isSelf || record.generalStatus !== 1) && (
                <Button
                  onClick={() => {
                    setMode('PREVIEW');
                    handleDetail(record);
                  }}
                  type="link"
                  size="small"
                >
                  查看
                </Button>
              )}
              {eipAble !== 1 &&
                record.isAuthProcess &&
                record.generalStatus === 1 && (
                  <Button
                    onClick={() => {
                      setMode('EDIT');
                      handleDetail(record);
                    }}
                    type="link"
                    size="small"
                  >
                    办理
                  </Button>
                )}
              {eipAble !== 1 && record.isSelf && record.generalStatus === 1 && (
                <Popconfirm
                  title={'确认是否撤销'}
                  // getPopupContainer={getPopupContainerTbody}
                  onConfirm={() => {
                    queryisProcess(3, record.procedureCode);
                  }}
                >
                  <Button type="link" size="small">
                    撤销
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <div
      style={{
        flex: '1 auto',
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
      }}
    >
      <div className={styles.tableBase} style={{ flex: '1 auto' }}>
        <Table
          size="middle"
          columns={columns}
          dataSource={tableData ?? []}
          loading={tableLoading}
          rowKey={'procedureCode'}
          pagination={false}
          scroll={{
            y: size ? size - 350 : undefined,
          }}
          onRow={(record) => {
            return {
              onDoubleClick: (event) => {
                setMode('PREVIEW');
                handleDetail(record);
              },
            };
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
          pageSizeOptions={['10', '20', '50', '100']}
          showSizeChanger={true}
          style={{
            paddingTop: '5px',
          }}
          showQuickJumper={true}
          showTotal={(total) => `总数：${total}`}
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={
            searchType === 2 || searchType === 3 ? onMySearch : onSearch
          }
        />
      </div>
    </div>
  );
};

export default TableData;
