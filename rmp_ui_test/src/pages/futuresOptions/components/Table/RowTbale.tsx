import React from 'react';
import { message, Table } from '@ht/sprite-ui';
import { ColumnsType } from '@ht/sprite-ui/lib/table';
import { FutureOptionList, ResultList } from '@/services/FutureOption';

import { TableListType } from '../Fututres/Futures';

import styles from '../../style.less';
import { TRADING_MARKETS } from '@/utils/dictFutures';
import { isEip } from '@/utils/utils';

export const getKindCodeName = (value: string, data: ResultList[]) => {
  const KindName = data?.filter((item) => item.kindCode === value)[0]?.kindName;
  return `${value}  ${KindName}`;
};

type Size = {
  width: number;
  height: number;
};
interface Props {
  onselectItems: (
    value: number,
    record: FutureOptionList,
    type?: string
  ) => void;
  selectItems: FutureOptionList[];
  tableData: TableListType[];
  size: number;
  allKindCode: ResultList[];
  tableLoading: boolean;
  operateAuth: boolean;
  tabKey: string;
}

const RowTable: React.FC<Props> = ({
  onselectItems,
  selectItems,
  tableData,
  size,
  allKindCode,
  tableLoading,
  operateAuth,
  tabKey,
}) => {
  const colums: ColumnsType<TableListType> = [
    {
      title: '交易所',
      dataIndex: 'marketId',
      align: 'center',
      width: 130,
      render: (value) => {
        return TRADING_MARKETS.find((item) => item.code === value.toString())
          ?.name;
      },
      onCell: (record) => {
        return {
          rowSpan: record.marketIdRowSpan,
          onClick: () => {
            onselectItems(0, record);
          },
          onDoubleClick: () => {
            message.warn('请选择具体品种');
          },
        };
      },
    },
    {
      title: tabKey === '1' ? '期货品种' : '期权品种',
      dataIndex: 'kindCode',
      align: 'center',
      width: 200,
      render: (_, record) => {
        return getKindCodeName(record.kindCode, allKindCode);
      },
      onCell: (record) => {
        return {
          rowSpan: record.kindCodeRowSpan,
          onClick: () => {
            onselectItems(1, record);
          },
          onDoubleClick: () => {
            if (operateAuth && !isEip()) {
              onselectItems(1, record, 'double');
            }
          },
        };
      },
    },
    {
      title: '合约月份',
      align: 'center',
      width: 130,
      dataIndex: 'monthControlType',
      render: (value, record, index) => {
        let monthType = '';
        switch (value) {
          case 0:
            monthType = '所有月份';
            break;
          case 1:
            monthType = `${record.contractMonth}月份`;
            break;
          case 2:
            monthType = `非${record.contractMonth}月份`;
            break;
          default:
            monthType = '';
        }
        return monthType;
      },

      onCell: (record) => {
        return {
          rowSpan: record.monthRowSpan,
          onClick: () => {
            onselectItems(2, record);
          },
          onDoubleClick: () => {
            if (operateAuth && !isEip()) {
              onselectItems(2, record, 'double');
            }
          },
        };
      },
    },
    {
      title: '时段',
      align: 'center',
      render: (_, record) => {
        let begintime = '';
        let endTime = '';
        const beginType = record.beginInfluenceDirection === 3 ? '含' : '不含';
        const endType = record.endInfluenceDirection === 4 ? '含' : '不含';
        if (record.beginDateType === 3) {
          begintime = `自上市日(${beginType})`;
        } else {
          const dayType =
            record.beginDayOffset === 999
              ? '最后一个'
              : `第${record.beginDayOffset}个`;
          const monType = `自交割月${
            record.beginMonthOffset === 0
              ? ''
              : `前${Math.abs(record.beginMonthOffset)}月`
          }`;
          const monTypeKey = `自标的合约交割月${
            record.beginMonthOffset === 0
              ? ''
              : `前${Math.abs(record.beginMonthOffset)}月`
          }`;
          const type = record.beginDateType === 1 ? '自然日' : '交易日';
          const _begintime =
            (tabKey === '1' ? monType : monTypeKey) + dayType + type;
          begintime = `${_begintime}(${beginType})`;
        }

        if (record.endDateType === 3) {
          endTime = `自上市日(${beginType})`;
        } else {
          const dayType =
            record.endDayOffset === 999
              ? '最后1个'
              : `第${record.endDayOffset}个`;
          const monType = `至交割月${
            record.endMonthOffset === 0
              ? ''
              : `前${Math.abs(record.endMonthOffset)}月`
          }`;
          const monTypeKey = `至标的合约交割月${
            record.endMonthOffset === 0
              ? ''
              : `前${Math.abs(record.endMonthOffset)}月`
          }`;
          const type = record.endDateType === 1 ? '自然日' : '交易日';
          const _endime =
            (tabKey === '1' ? monType : monTypeKey) + dayType + type;
          endTime = `${_endime}(${endType})`;
        }

        return begintime + endTime;
      },
      onCell: (record) => {
        return {
          rowSpan: record.timeRowSpan,
          onClick: () => {
            onselectItems(3, record);
          },
          onDoubleClick: () => {
            if (operateAuth && !isEip()) {
              onselectItems(3, record, 'double');
            }
          },
        };
      },
    },
    {
      title: '市场总持仓规模',
      dataIndex: 'marketPositionQuantity',
      align: 'center',
      width: 150,
      render: (value, record) => {
        if (record.compareDirection !== 0 && tabKey === '1') {
          let marketPositionQuantity = '';
          switch (record.compareDirection) {
            case 1:
              marketPositionQuantity = `>${value}`;
              break;
            case 2:
              marketPositionQuantity = `<${value}`;
              break;
            case 3:
              marketPositionQuantity = `≥${value}`;
              break;
            case 4:
              marketPositionQuantity = `≤${value}`;
              break;
            default:
              marketPositionQuantity = '';
          }
          return marketPositionQuantity;
        }
        return '__';
      },
      onCell: (record) => {
        return {
          // rowSpan: record.marketIdRowSpan,
          onClick: () => {
            onselectItems(-1, record);
          },
          onDoubleClick: () => {
            if (operateAuth && !isEip()) {
              onselectItems(-1, record, 'double');
            }
          },
        };
      },
    },
    {
      title: '数量限额/手',
      dataIndex: 'threshold',
      align: 'center',
      width: 130,
      render: (value, record) => {
        if (record.thresholdType === 1) {
          return `${value}手`;
        }
        return '__';
      },
      onCell: (record) => {
        return {
          onClick: () => {
            onselectItems(-1, record);
          },
          onDoubleClick: () => {
            if (operateAuth && !isEip()) {
              onselectItems(-1, record, 'double');
            }
          },
        };
      },
    },
    {
      title: '比例限额/%',
      dataIndex: 'threshold2',
      align: 'center',
      width: 130,
      render: (value, record) => {
        if (record.thresholdType === 2 && tabKey === '1') {
          return `${record.threshold.toFixed(2)}%`;
        }
        return '__';
      },
      onCell: (record) => {
        return {
          // rowSpan: record.marketIdRowSpan,
          onClick: () => {
            onselectItems(-1, record);
          },
          onDoubleClick: () => {
            if (operateAuth && !isEip()) {
              onselectItems(-1, record, 'double');
            }
          },
        };
      },
    },
  ];
  return (
    <Table
      columns={
        tabKey === '1'
          ? colums
          : colums.filter((item) => {
              return (
                item.title !== '市场总持仓规模' && item.title !== '比例限额/%'
              );
            })
      }
      size="middle"
      loading={tableLoading}
      rowClassName={(record) => {
        if (selectItems.find((item) => item.key === record.key)) {
          return `${styles.rowHover} ${styles.rowActive}`;
        } else {
          return styles.rowHovert;
        }
      }}
      scroll={{
        y: size ? (operateAuth ? size - 320 : size - 270) : undefined,
        x: 1600,
      }}
      dataSource={tableData}
      rowKey={'key'}
      pagination={false}
    />
  );
};
export default RowTable;
