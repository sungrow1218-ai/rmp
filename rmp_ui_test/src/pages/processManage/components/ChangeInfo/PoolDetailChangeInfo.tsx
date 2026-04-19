import { Popover, Table } from '@ht/sprite-ui';
import { ColumnsType } from '@ht/sprite-ui/lib/table';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../styles.less';
import { parseTime } from '@/pages/securityPool/contants/contants';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';

interface Props {
  changeText: any;
  size?: number;
  status?: number;
}

export function getPopupContainerParent(node?: HTMLElement): HTMLElement {
  const tbody = node?.closest('tbody');
  return (tbody as HTMLElement) ?? document.body;
}

const PoolDetailChangeInfo: React.FC<Props> = ({
  changeText,
  size,
  status,
}) => {
  const [count, setCount] = useState({
    failNum: 0,
    successNum: 0,
  });
  const columns: ColumnsType<any> = [
    {
      title: '证券代码',
      dataIndex: 'securityCode',
      // width: '24%',
      ellipsis: true,
    },
    {
      title: '证券名称',
      dataIndex: 'securityName',
      // width: '20%',
      ellipsis: true,
    },
    {
      title: '交易市场',
      // width: '24%',
      dataIndex: 'marketId',
      ellipsis: true,
    },
    {
      title: '有效起始日期',
      dataIndex: 'effectiveDate',
      render: (value) => (
        <div style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>
          {parseTime(value, 'YYYY-MM-DD', 'YYYYMMDD')}
        </div>
      ),
    },
    {
      title: '有效截止日期',
      dataIndex: 'expireDate',
      render: (value) => (
        <div style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>
          {parseTime(value, 'YYYY-MM-DD', 'YYYYMMDD')}
        </div>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '导入状态',
      dataIndex: 'status',
      width: 100,
      render: (text) => (
        <div className={text === '失败' ? styles.errorInfo : ''}>{text}</div>
      ),
    },
    {
      title: '错误描述',
      dataIndex: 'errorMessage',
      className: styles.errorInfo,
      ellipsis: true,
      width: 250,
    },
  ];
  const getTableData = () => {
    const data = changeText.map((p: any) => ({ ...p, key: uuidv4() }));
    const data1 = data.filter((p: any) => p.status === '失败');
    const data2 = data.filter((p: any) => p.status !== '失败');

    return [...data1, ...data2];
  };

  useEffect(() => {
    if (changeText) {
      const data1 = changeText.filter((p: any) => p.status === '失败');
      const data3 = changeText.filter((p: any) => p.status === '成功');
      setCount({
        failNum: Number(data1.length),
        successNum: Number(data3.length),
      });
    }
  }, [changeText]);
  return (
    <div style={{ paddingBottom: '20px' }}>
      <Table
        dataSource={getTableData()}
        columns={columns}
        rowKey={'key'}
        pagination={{
          pageSizeOptions: ['10', '20', '50', '100'],
          defaultPageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => {
            if (status === 2) {
              return `本次导入 ${total} 条， 成功 ${count.successNum} 条， 失败 ${count.failNum} 条`;
            }
            return `本次导入 ${total} 条`;
          },
        }}
        className={styles.rowHover}
        scroll={{ y: Number(size) - 50 > 0 ? Number(size) - 110 : 300 }}
      />
    </div>
  );
};

export default PoolDetailChangeInfo;
