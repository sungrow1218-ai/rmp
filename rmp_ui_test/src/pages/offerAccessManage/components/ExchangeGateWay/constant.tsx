import { ExchangeGateWayDataType } from '@/services/offerAccessMaage';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import { OFFER_CHANNEL_tYPE } from '@/utils/offerAccseeDict';
import { Button, Input } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';

export const getTableColumns = () => {
  const columns: ColumnsType<ExchangeGateWayDataType> = [
    {
      title: '交易网关编号',
      dataIndex: 'tgwId',
      width: 130,
      ellipsis: true,
    },
    {
      title: '交易市场',
      dataIndex: 'marketId',
      width: 90,
      render: (value) =>
        transformDictCodeToNameHelper(String(value), TRADING_MARKETS),
    },
    {
      title: '报盘通用类型',
      width: 120,
      dataIndex: 'offerChannelType',
      render: (value) =>
        transformDictCodeToNameHelper(String(value), OFFER_CHANNEL_tYPE),
    },
    {
      title: 'TGW地址',
      width: 150,
      dataIndex: 'tgwSvrIp',
      ellipsis: true,
    },
    {
      title: 'TGW端口',
      width: 120,
      dataIndex: 'tgwSvrPort',
      ellipsis: true,
    },
    {
      title: '发送方标识',
      dataIndex: 'senderCompId',
      ellipsis: true,
    },
    {
      title: '接收方标识',
      dataIndex: 'targetCompId',
      ellipsis: true,
    },
    {
      title: '登录密码',
      width: 140,
      dataIndex: 'loginPassword',
      render: (value) => {
        if (value) {
          return `******`;
        } else {
          return '';
        }
      },
    },
    {
      title: '应用版本号',
      width: 120,
      dataIndex: 'appVersion',
    },
    {
      title: '心跳间隔(秒)',
      width: 120,
      dataIndex: 'heartBeatInterval',
    },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   width: 120,
    //   render: (value, record) => {
    //     if (value === 1) {
    //       return <span style={{ color: '#3F88F1' }}>就绪</span>;
    //     }
    //     if (value === 0) {
    //       return <span style={{ color: '#bb744a' }}>未就绪</span>;
    //     }
    //     return '';
    //   },
    // },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '创建人',
      width: 100,
      dataIndex: 'createUserCode',
    },
    {
      title: '创建日期',
      width: 180,
      dataIndex: 'createDateTime',
      render: (value) => {
        const time = moment(value, 'YYYYMMDDHHmmss');
        if (time.isValid()) {
          return time.format('YYYY-MM-DD HH:mm:ss');
        } else return '';
      },
    },
    {
      title: '最近修改人',
      width: 110,
      dataIndex: 'updateUserCode',
    },
    {
      title: '更新时间',
      width: 180,
      dataIndex: 'lastUpdateTime',
      render: (value) => {
        const time = moment(value, 'YYYYMMDDHHmmss');
        if (time.isValid()) {
          return time.format('YYYY-MM-DD HH:mm:ss');
        } else return '';
      },
    },
  ];

  return columns;
};
