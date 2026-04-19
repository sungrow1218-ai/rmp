import { BasicTable, TableActionType } from '@/components/Table';
import { StockItem } from '@/services/securityInfo';
import { transformDictCodeToNameHelper } from '@/utils/dict';
import { TRADE_MARKET } from '@/utils/dictInfo';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { SecurityRelationMap } from './data';

export interface IAction {
  open: (stock: StockItem) => void;
}

const RelativeModal = forwardRef<IAction>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const tableRef = useRef<TableActionType>(null);

  useImperativeHandle(ref, () => ({
    open: async (stock) => {
      setOpen(true);
      const { securityRelativeList } = stock;
      setTimeout(() => {
        tableRef.current?.setTableData(securityRelativeList || []);
      }, 100);
    },
  }));

  return (
    <Modal
      title={'证券关联代码'}
      width={800}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnHidden={true}
    >
      <BasicTable
        ref={tableRef}
        pagination={false}
        columns={[
          {
            dataIndex: 'secuCodeRelaType',
            title: '证券代码关联关系类型',
            width: 200,
            render: (value) => SecurityRelationMap[value],
          },
          { dataIndex: 'relatedSecurityCode', title: '关联证券代码' },
          {
            dataIndex: 'relatedMarketId',
            title: '关联交易市场',
            render: (value) =>
              transformDictCodeToNameHelper(value, TRADE_MARKET) || '--',
          },
          {
            dataIndex: 'effectiveDate',
            title: '生效日期',
            render: (value) =>
              value
                ? dayjs(String(value), 'YYYYMMDD').format('YYYY-MM-DD')
                : '--',
          },
          {
            dataIndex: 'expireDate',
            title: '失效日期',
            render: (value) =>
              value
                ? dayjs(String(value), 'YYYYMMDD').format('YYYY-MM-DD')
                : '--',
          },
        ]}
      />
    </Modal>
  );
});

export default RelativeModal;
