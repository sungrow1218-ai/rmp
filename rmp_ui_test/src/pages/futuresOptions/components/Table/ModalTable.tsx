// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useMemo } from 'react';
import { Table, Popconfirm, Select, InputNumber } from '@ht/sprite-ui';

import { ColumnsType } from '@ht/sprite-ui/lib/table';

import { transformDict } from '../Form/TimeForm';
import { FutureOptionList } from '@/services/FutureOption';
import { DeleteOutlined } from '@ht-icons/sprite-ui-react';
import styles from '../../style.less';
import { COMPARE_DIRECTION } from '@/utils/dictFutures';

interface Props {
  tabKey: string;
  compareChange: (value: string, record: FutureOptionList) => void;
  onQuantityChange: (value: number, record: FutureOptionList) => void;
  onThresholdNumberChange: (value: number, record: FutureOptionList) => void;
  onThresholdChange: (value: number, record: FutureOptionList) => void;
  setTimeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeEditData: React.Dispatch<
    React.SetStateAction<FutureOptionList | null>
  >;
  editData: FutureOptionList[];
  setEditData: React.Dispatch<React.SetStateAction<FutureOptionList[]>>;
  setTimeType: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  buttonType: string;
}

const ModalTable: React.FC<Props> = ({
  setTimeOpen,
  setTimeEditData,
  compareChange,
  onQuantityChange,
  onThresholdNumberChange,
  onThresholdChange,
  editData,
  setEditData,
  setTimeType,
  disabled,
  buttonType,
  tabKey,
}) => {
  const onDelSelect = (record: FutureOptionList) => {
    setTimeType('3');
    const data = editData?.filter((item) => item.key !== record.key) ?? [];
    setEditData(data);
  };
  const _columns: ColumnsType<FutureOptionList> = [
    {
      title: '合约月份',
      align: 'center',
      width: 100,
      dataIndex: 'monthControlType',
      render: (value, record) => {
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
        return <>{monthType}</>;
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
              ? '最后1个'
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
          const type =
            record.beginDateType === 3
              ? ''
              : record.beginDateType === 1
              ? '自然日'
              : '交易日';
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
          const type =
            record.endDateType === 3
              ? ''
              : record.endDateType === 1
              ? '自然日'
              : '交易日';
          const _endime =
            (tabKey === '1' ? monType : monTypeKey) + dayType + type;
          endTime = `${_endime}(${endType})`;
        }

        return (
          <span style={{ color: '#bb744a', cursor: 'pointer' }}>
            {begintime + endTime}
          </span>
        );
      },
      onCell: (record) => {
        return {
          onDoubleClick: () => {
            setTimeEditData(record);
            setTimeType('Edit');
            setTimeOpen(true);
          },
        };
      },
    },
    {
      title: '比较方向',
      width: 120,
      align: 'center',
      render: (_, record) => {
        if (record.compareDirection !== 0) {
          return (
            <>
              <Select
                disabled={disabled}
                size="middle"
                style={{ width: 100, textAlign: 'left' }}
                onChange={(value) => {
                  compareChange(value, record);
                }}
                value={record.compareDirection.toString()}
                options={transformDict(COMPARE_DIRECTION)}
              />
            </>
          );
        } else {
          return '__';
        }
      },
    },
    {
      title: '市场总持仓规模',
      width: 140,
      align: 'center',
      dataIndex: 'marketPositionQuantity',
      render: (_, record) => {
        if (record.compareDirection !== 0) {
          return (
            <>
              <InputNumber
                min={1}
                step={1}
                size="middle"
                disabled={disabled}
                precision={0}
                style={{ width: 120 }}
                value={record.marketPositionQuantity}
                onBlur={(e) => {
                  onQuantityChange(Number(e.target.value), record);
                }}
                onChange={(value) => {
                  onQuantityChange(Number(value), record);
                }}
              />
            </>
          );
        }
        return '__';
      },
    },
    {
      title: '数量限额/手',
      align: 'center',
      width: 140,
      dataIndex: 'threshold',
      render: (value, record) => {
        if (record.thresholdType === 1) {
          return (
            <>
              <InputNumber
                min={0}
                step={1}
                max={9999999}
                disabled={disabled}
                size="middle"
                precision={0}
                style={{ width: 120 }}
                value={record.threshold}
                onChange={(inputValue) => {
                  onThresholdNumberChange(Number(inputValue), record);
                }}
                onBlur={(e) => {
                  onThresholdNumberChange(Number(e.target.value), record);
                }}
              />
            </>
          );
        }
        return '__';
      },
    },
    {
      title: '比例限额/%',
      align: 'center',
      width: 140,
      dataIndex: 'threshold',
      render: (_, record) => {
        if (record.thresholdType === 2) {
          return (
            <>
              <InputNumber
                min={0.0}
                step={1}
                size="middle"
                disabled={disabled}
                precision={2}
                max={100}
                style={{ width: 120 }}
                value={record.threshold}
                onChange={(inputValue) => {
                  onThresholdChange(Number(inputValue), record);
                }}
                onBlur={(e) => {
                  onThresholdChange(Number(e.target.value), record);
                }}
              />
            </>
          );
        }
        return '__';
      },
    },
  ];
  const deleteButton: ColumnsType<FutureOptionList> = [
    {
      title: '操作',
      align: 'center',
      width: 80,
      dataIndex: 'delete',
      render: (_, record) => {
        return (
          <Popconfirm
            title="是否确认删除?"
            okText="是"
            cancelText="否"
            onConfirm={() => onDelSelect(record)}
          >
            <DeleteOutlined style={{ color: '#bb744a' }} />
          </Popconfirm>
        );
      },
    },
  ];

  const showButton = useMemo(() => {
    if (buttonType === 'Add') {
      return true;
    }
    return false;
  }, [buttonType]);

  const colunms = showButton ? [..._columns, ...deleteButton] : [..._columns];

  return (
    <div className={styles.optionsFutureTable}>
      <Table
        columns={colunms}
        size="small"
        scroll={{ y: 280 }}
        dataSource={editData ?? []}
        rowKey={'key'}
        pagination={false}
      />
    </div>
  );
};

export default ModalTable;
