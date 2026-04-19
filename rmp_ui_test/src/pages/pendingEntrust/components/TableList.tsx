// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { Key, useRef, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Divider,
  Pagination,
  message,
  Popconfirm,
} from '@ht/sprite-ui';
import type { ColumnsType } from '@ht/sprite-ui/es/table';
import moment from 'moment';
import { DownOutlined, UpOutlined } from '@ht-icons/sprite-ui-react';
import {
  ENTRUST_DIRECTION,
  ENTRUST_STATUS,
  PRICE_TYPE,
  BUSINESS_TYPE,
} from '@/utils/dictEntrust';
import { useMemoizedFn, useSize } from 'ahooks';
import { useSystemInfo } from '@/hooks';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';

import { FormDataType, transformDT, type SearchProps } from '../Entrust';
import styles from '../style.less';
import { PaginationType } from '@/services/typing';
import {
  deletePendingEntrust,
  deletePendingEntrustOneClick,
  DeletePendingEntrustParams,
  queryRevokeEntrust,
} from '@/services/pendingEntrust';
import { QueryEntrustParams } from '@/services/entrust';
import { FormInstance } from '@ht/sprite-ui/es/form';
import { getSystemNameById } from '@/components/ExtSystemSelect';
import { Popover } from 'antd';

interface Props {
  loading: boolean;
  tableData: any;
  pagination: PaginationType;
  onSearch: (props: SearchProps) => void;
  changeExpend: () => void;
  isExpend: boolean;
  resetForm: () => void;
  searchNodeId: number | undefined;
  form: FormInstance<FormDataType>;
}

const transformKey = (data: Key[]) => {
  return data.map((p) => {
    const [extSysId, extSubSysId, entrustCode] = String(p).split('|');
    return {
      extSysId: Number(extSysId),
      extSubSysId: Number(extSubSysId),
      entrustCode,
    };
  });
};

const TableList: React.FC<Props> = ({
  loading,
  tableData,
  pagination,
  onSearch,
  changeExpend,
  isExpend,
  resetForm,
  searchNodeId,
  form,
}) => {
  const systemInfo = useSystemInfo(0);
  const colums: ColumnsType<any> = [
    {
      title: '委托日期',
      dataIndex: 'entrustDate',
      // width: 20,
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
      render: (value) => {
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

  const [selectItem, setSelectItem] = useState<Key[]>([]);
  const onChange = (selectedRowKeys: Key[]) => {
    setSelectItem(selectedRowKeys);
  };
  const revokeEntrust = useMemoizedFn(async () => {
    try {
      if (selectItem.length > 0 && searchNodeId) {
        const res = await queryRevokeEntrust({
          nodeId: searchNodeId,
          entrustList: transformKey(selectItem),
        });
        if (res.code !== 0) {
          // message.error({
          //   content: `${res.message}`,
          // });
          return;
        }
        message.success('废单成功');
        setSelectItem([]);
        onSearch({
          page: 1,
          pageSize: pagination.pageSize,
        });
      }
    } catch (error) {}
  });
  const deleteEntrust = async () => {
    try {
      if (selectItem.length > 0 && searchNodeId) {
        const res = await deletePendingEntrust({
          nodeId: searchNodeId,
          entrustList: transformKey(selectItem),
        });
        if (res.code !== 0) {
          // message.error({
          //   content: `${res.message}`,
          // });
          return;
        }
        message.success('删除成功');
        setSelectItem([]);
        onSearch({
          page: 1,
          pageSize: pagination.pageSize,
        });
      }
    } catch (error) {}
  };
  const deleteAllEntrust = async () => {
    try {
      const dt = await form.validateFields();

      const filterCondition = transformDT(dt);
      const params: DeletePendingEntrustParams = {
        nodeId: Number(dt.nodeId),
        filterCondition,
      };
      const res = await deletePendingEntrustOneClick(params);
      if (res.code !== 0) {
        // message.error({
        //   content: `${res.message}`,
        // });
        return;
      }
      message.success('删除成功');
      setSelectItem([]);
      onSearch({
        page: 1,
        pageSize: pagination.pageSize,
      });
    } catch (error) {}
  };

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
        <Popconfirm
          onConfirm={revokeEntrust}
          disabled={selectItem.length === 0}
          title={`是否将选定的${selectItem.length}条挂单设置为废单?`}
        >
          <Button
            style={{
              marginRight: '15px',
            }}
            disabled={selectItem.length === 0}
            type="primary"
          >
            批量废单
          </Button>
        </Popconfirm>

        <Popconfirm
          onConfirm={deleteEntrust}
          disabled={selectItem.length === 0}
          title={`是否将选定的${selectItem.length}条挂单从计算核心删除?`}
        >
          <Button
            style={{
              marginRight: '15px',
            }}
            disabled={selectItem.length === 0}
            type="primary"
          >
            批量删除
          </Button>
        </Popconfirm>

        <Popconfirm
          onConfirm={deleteAllEntrust}
          title={`是否将所有满足当前过滤条件的挂单从计算核心删除?`}
        >
          <Button
            style={{
              marginRight: '15px',
            }}
            type="primary"
          >
            一键删除
          </Button>
        </Popconfirm>
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
            setSelectItem([]);
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
          rowSelection={{
            selectedRowKeys: selectItem,
            onChange,
          }}
          scroll={{
            y: size ? Number(size.height) - 200 : 500,
            x: 3000,
          }}
          dataSource={tableData}
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
