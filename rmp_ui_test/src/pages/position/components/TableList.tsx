import React, { Key, useEffect, useRef, useState } from 'react';
import { Table, Button, Pagination } from '@ht/sprite-ui';
import type { ColumnsType } from '@ht/sprite-ui/es/table';
import { useSize } from 'ahooks';
import {
  POSITION_TYPE,
  TRADING_MARKETS,
  transformDictCodeToNameHelper,
} from '@/utils/dict';

import { type SearchProps } from '../PositionMain';
import styles from '../style.less';
import { PaginationType } from '@/services/typing';
import { PositionResultList } from '@/services/position';
import { getSystemNameById } from '@/hooks/useSystemInfo';
import { ExtSysItem, querySetOfBook, SobInfo } from '@/services/account';

interface Props {
  loading: boolean;
  tableData: PositionResultList[];
  pagination: PaginationType;
  onSearch: (props: SearchProps) => void;
  systemInfo: ExtSysItem[] | undefined;
  onEdit: (record: PositionResultList) => void;
  selectData: PositionResultList | null;
  setSelectData: React.Dispatch<
    React.SetStateAction<PositionResultList | null>
  >;
}

const TableList: React.FC<Props> = ({
  loading,
  tableData,
  pagination,
  onSearch,
  systemInfo,
  onEdit,
  selectData,
  setSelectData,
}) => {
  const [sobInfo, setSobInfo] = useState<SobInfo[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  console.log(systemInfo, 'systemInfo,table组件');

  useEffect(() => {
    const fetch = async () => {
      try {
        const resSob = await querySetOfBook({
          pageId: 1,
          pageSize: 5000,
        });
        if (resSob.code !== 0) {
          setSobInfo([]);
          throw new Error('获取账套信息失败');
        }
        if (!resSob.data || resSob.data.resultList.length === 0) {
          setSobInfo([]);
          throw new Error('未查询到账套信息');
        }
        setSobInfo(resSob.data.resultList);
      } catch (error) {}
    };
    fetch();
  }, []);

  const colums: ColumnsType<PositionResultList> = [
    {
      title: '外部系统号',
      dataIndex: 'extSysId',
      render: (value) => {
        return getSystemNameById(value, systemInfo);
      },
    },
    {
      title: '管理账户',
      width: '18%',
      dataIndex: 'manageAcct',
      render: (_, record) => {
        const theSobId = systemInfo?.find(
          (p) => p.extSysId === record.extSysId
        )?.sobId;
        const booklevelList = sobInfo
          ?.find((p) => p.sobId === theSobId)
          ?.bookList.find((q) => q.bookType === 2)?.bookLevelList;
        const _manageAcct = record.manageAcct.sort((a, b) => {
          return a.bookLevel - b.bookLevel;
        });
        const strArry = _manageAcct.map((p) => {
          const bookName = booklevelList?.find(
            (q) => q.bookLevel === p.bookLevel
          )?.bookLevelName;
          const str = ` ${bookName ?? '未知层级'} : ${p.acctCode} ${
            p.acctName
          }`;
          return str;
        });
        const str = strArry.join(';');
        return str;
      },
    },
    {
      title: '交易账户',
      width: '18%',
      dataIndex: 'tradeAcct',
      render: (_, record) => {
        const theSobId = systemInfo?.find(
          (p) => p.extSysId === record.extSysId
        )?.sobId;
        const booklevelList = sobInfo
          ?.find((p) => p.sobId === theSobId)
          ?.bookList.find((q) => q.bookType === 1)?.bookLevelList;
        const _tradeAcct = record.tradeAcct.sort((a, b) => {
          return a.bookLevel - b.bookLevel;
        });
        const strArry = _tradeAcct.map((p) => {
          const bookName = booklevelList?.find(
            (q) => q.bookLevel === p.bookLevel
          )?.bookLevelName;
          const str = `  ${bookName ?? '未知层级'} : ${p.acctCode} ${
            p.acctName
          }  `;
          return str;
        });
        const str = strArry.join(';');
        return str;
      },
    },
    {
      title: '交易市场',
      dataIndex: 'marketId',
      render(value) {
        return (
          <div>
            {transformDictCodeToNameHelper(String(value), TRADING_MARKETS)}
          </div>
        );
      },
    },
    {
      title: '证券代码',
      dataIndex: 'securityCode',
    },
    {
      title: '持仓类型',
      dataIndex: 'positionType',
      render(value) {
        return (
          <div>
            {transformDictCodeToNameHelper(String(value), POSITION_TYPE)}
          </div>
        );
      },
    },
    {
      title: '期初持仓数量',
      dataIndex: 'beginAmount',
    },
    {
      title: '期初质押数量',
      dataIndex: 'beginImpawnAmount',
    },
    {
      title: '当前持仓数量',
      dataIndex: 'currentAmount',
    },
    {
      title: '当前质押数量',
      dataIndex: 'currentImpawnAmount',
    },
    // {
    //   title: '操作',
    //   width: 120,
    //   render: (_, record) => {
    //     return (
    //       <Button
    //         onClick={() => {
    //           onEdit(record);
    //         }}
    //         type="link"
    //       >
    //         修改
    //       </Button>
    //     );
    //   },
    // },
  ];

  const carRef = useRef(null);
  const size = useSize(carRef);
  return (
    <div ref={carRef} className={styles.entrustTable}>
      <div className={styles.tableBase}>
        <Table
          loading={loading}
          rowKey={'key'}
          columns={colums}
          pagination={false}
          scroll={{
            y: Number(size?.height) - 120,
            x: 1600,
          }}
          dataSource={tableData}
          rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onChange: (keys, rows) => {
              setSelectedRowKeys(keys);
              setSelectData(rows[0]);
            },
          }}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                if (!record.key) return;
                setSelectedRowKeys([record.key]);
                onEdit(record);
              },
              onClick: () => {
                if (!record.key) return;
                setSelectedRowKeys([record.key]);
                setSelectData(record);
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
          showQuickJumper={true}
          style={{
            paddingTop: '5px',
          }}
          showTotal={(total) => `总数：${total}`}
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) => {
            onSearch({ page, pageSize });
          }}
        />
      </div>
    </div>
  );
};

export default TableList;
