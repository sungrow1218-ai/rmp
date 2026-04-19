import React, { useRef } from 'react';
import { Card, Table, Button, Divider, Pagination } from '@ht/sprite-ui';
import type { ColumnsType } from '@ht/sprite-ui/es/table';
import moment from 'moment';
import { DownOutlined, UpOutlined } from '@ht-icons/sprite-ui-react';
import {
  ENTRUST_TYPE,
  ENTRUST_DIRECTION,
  ENTRUST_STATUS,
  PRICE_TYPE,
  INVEST_TYPE,
  TRADE_PLATFORM_ID,
  BUSINESS_TYPE,
} from '@/utils/dictEntrust';
import { useSize } from 'ahooks';
import { useSystemInfo } from '@/hooks';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';

import { type SearchProps } from '../Entrust';
import styles from '../style.less';
import { PaginationType } from '@/services/typing';
import { getSystemNameById } from '@/components/ExtSystemSelect';

interface Props {
  loading: boolean;
  tableData: any;
  pagination: PaginationType;
  onSearch: (props: SearchProps) => void;
  changeExpend: () => void;
  isExpend: boolean;
  resetForm: () => void;
}

const TableList: React.FC<Props> = ({
  loading,
  tableData,
  pagination,
  onSearch,
  changeExpend,
  isExpend,
  resetForm,
}) => {
  const systemInfo = useSystemInfo(0);
  const colums: ColumnsType<any> = [
    {
      title: '委托日期',
      dataIndex: 'entrustDate',
      render(value) {
        const timeMoment = moment(String(value), 'YYYYMMDD');
        if (timeMoment.isValid()) {
          return <div>{timeMoment.format('YYYY-MM-DD')}</div>;
        }
        return null;
      },
    },
    {
      title: '委托时间',
      dataIndex: 'entrustTime',
      render(value) {
        const timeMoment = moment(String(value), 'HHmmss');
        if (timeMoment.isValid()) {
          return <div>{timeMoment.format('HH:mm:ss')}</div>;
        } else {
          return null;
        }
      },
    },
    {
      title: '外部系统号',
      dataIndex: 'extSysId',
      render: (value, record) => {
        return getSystemNameById(value, systemInfo);
      },
    },
    {
      title: '外部子系统号',
      dataIndex: 'extSubsysId',
    },
    {
      title: '委托编码',
      dataIndex: 'entrustCode',
    },
    {
      title: '交易账户',
      width: '200px',
      ellipsis: true,
      dataIndex: 'tradeAcct',
    },
    {
      title: '管理账户',
      width: '200px',
      ellipsis: true,
      dataIndex: 'manageAcct',
    },
    {
      title: '交易席位',
      dataIndex: 'seatCode',
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
      title: '委托类型',
      dataIndex: 'entrustType',
      render(value) {
        return (
          <div>
            {transformDictCodeToNameHelper(String(value), ENTRUST_TYPE)}
          </div>
        );
      },
    },
    {
      title: '委托方向',
      dataIndex: 'entrustDirection',
      render(value) {
        return (
          <div>
            {transformDictCodeToNameHelper(String(value), ENTRUST_DIRECTION)}
          </div>
        );
      },
    },
    {
      title: '委托价格类型',
      dataIndex: 'priceType',
      render(value) {
        return (
          <div> {transformDictCodeToNameHelper(String(value), PRICE_TYPE)}</div>
        );
      },
    },
    {
      title: '委托状态',
      dataIndex: 'entrustStatus',
      render(value) {
        return (
          <div>
            {transformDictCodeToNameHelper(String(value), ENTRUST_STATUS)}
          </div>
        );
      },
    },
    {
      title: '委托数量',
      dataIndex: 'entrustAmount',
    },
    {
      title: '委托价格',
      dataIndex: 'entrustPrice',
    },
    {
      title: '成交数量',
      dataIndex: 'dealAmount',
    },
    {
      title: '撤单数量',
      dataIndex: 'withdrawAmount',
    },
    {
      title: '投资类型',
      dataIndex: 'investType',
      render(value, record, index) {
        return (
          <div>{transformDictCodeToNameHelper(String(value), INVEST_TYPE)}</div>
        );
      },
    },
    {
      title: '交易平台',
      dataIndex: 'tradePlatformId',
      render(value, record, index) {
        return (
          <div>
            {transformDictCodeToNameHelper(String(value), TRADE_PLATFORM_ID)}
          </div>
        );
      },
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      render(value) {
        return (
          <div>
            {transformDictCodeToNameHelper(String(value), BUSINESS_TYPE)}
          </div>
        );
      },
    },
  ];

  const carRef = useRef(null);
  const size = useSize(carRef);
  return (
    <div ref={carRef} className={styles.entrustTable}>
      <Divider style={{ margin: '16px' }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',

          paddingBottom: '16px',
        }}
      >
        <Button
          style={{
            marginRight: '8px',
          }}
          type="link"
          onClick={changeExpend}
        >
          {isExpend ? '收起' : '展开'}
          {isExpend ? <UpOutlined /> : <DownOutlined />}
        </Button>
        <Button
          style={{
            marginRight: '15px',
          }}
          onClick={resetForm}
        >
          重置
        </Button>
        <Button
          onClick={() => {
            onSearch({
              page: 1,
              pageSize: pagination.pageSize,
            });
          }}
          type="primary"
        >
          查询
        </Button>
      </div>

      <div className={styles.tableBase}>
        <Table
          loading={loading}
          rowKey={'key'}
          columns={colums}
          pagination={false}
          scroll={{
            y: size ? Number(size.height) - 200 : undefined,
            x: 3000,
          }}
          dataSource={tableData}
        />
      </div>
      {/* <OwnPagination pagination={pagination} onFinsh={onSearch} /> */}
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
          onChange={(page, pageSize) => {
            onSearch({ page, pageSize });
          }}
        />
      </div>
    </div>
  );
};

export default TableList;
