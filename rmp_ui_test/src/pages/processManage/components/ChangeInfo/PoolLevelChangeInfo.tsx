import { Popover, Table } from '@ht/sprite-ui';
import { ColumnsType } from '@ht/sprite-ui/lib/table';
import React, { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../styles.less';

interface Props {
  changeText: any;
  size?: number;
}

export function getPopupContainerParent(node?: HTMLElement): HTMLElement {
  const tbody = node?.closest('tbody');
  return (tbody as HTMLElement) ?? document.body;
}

const PoolLevelChangeInfo: React.FC<Props> = ({ changeText, size }) => {
  const columns: ColumnsType<any> = [
    {
      title: '参数',
      dataIndex: 'paramName',
      width: '180px',
    },
    {
      title: '原内容',
      ellipsis: true,
      render: (_, record) => {
        if (record.paramType.toString() !== '0') {
          return (
            Array.isArray(record.preValue.multiValue) &&
            record.preValue.multiValue.map((lp: any) => {
              return (
                <div
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                    color:
                      lp.operate.toString() === '3'
                        ? '#ff4d4f'
                        : lp.operate.toString() === '2'
                        ? '#BB744A'
                        : '',
                  }}
                  key={uuidv4()}
                >
                  <Popover
                    // placement="right"
                    content={lp.value ?? ''}
                    key={uuidv4()}
                    // getPopupContainer={getPopupContainerParent}
                  >
                    <span> {lp.value ?? ''}</span>
                  </Popover>
                </div>
              );
            })
          );
        } else {
          return record.preValue.singleValue ?? '';
        }
      },
    },
    {
      title: '现内容',
      render: (_, record) => {
        if (record.paramType.toString() !== '0') {
          return (
            Array.isArray(record.postValue.multiValue) &&
            record.postValue.multiValue.map((lp: any) => {
              return (
                <div
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                    color:
                      lp.operate.toString() === '1'
                        ? 'rgb(82, 196, 26)'
                        : lp.operate.toString() === '2'
                        ? '#BB744A'
                        : '',
                  }}
                  key={uuidv4()}
                >
                  <Popover
                    content={lp.value ?? ''}
                    key={uuidv4()}
                    // placement="right"
                    // getPopupContainer={getPopupContainerParent}
                  >
                    {lp.value ?? ''}
                  </Popover>
                </div>
              );
            })
          );
        } else {
          return record.postValue.singleValue ?? '';
        }
      },
    },
  ];
  return (
    <div style={{ paddingBottom: '20px' }}>
      <Table
        size="middle"
        dataSource={changeText}
        columns={columns}
        rowKey={'key'}
        pagination={false}
        className={styles.rowHover}
        scroll={{ y: size }}
      />
    </div>
  );
};

export default PoolLevelChangeInfo;
