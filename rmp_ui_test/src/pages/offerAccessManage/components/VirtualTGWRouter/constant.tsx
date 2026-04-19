import { VirtualTGWRouterDataType } from '@/services/offerAccessMaage';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import { OFFER_CHANNEL_tYPE } from '@/utils/offerAccseeDict';
import { Button, Input } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';

export const getTableColumns = () => {
  const columns: ColumnsType<VirtualTGWRouterDataType> = [
    {
      title: '报盘路由编号',
      dataIndex: 'routerId',
      width: 130,
    },
    {
      title: '虚拟网关编号',
      dataIndex: 'virtualTgwId',
      width: 130,

      render: (_, record) => record.virtualTgw.virtualTgwId,
    },
    {
      title: '服务端口',
      width: 150,
      dataIndex: 'virtualSvrPort',

      render: (_, record) => record.virtualTgw.virtualSvrPort,
    },
    {
      title: '虚拟网关名称',
      dataIndex: 'virtualTgwName',
      ellipsis: true,
      render: (_, record) => record.virtualTgw.virtualTgwName,
    },
    {
      title: 'tgw协议类型',
      width: 140,
      dataIndex: 'tgwProtocolType',
      render: (_, record) => {
        const value = record.virtualTgw.tgwProtocolType;
        return transformDictCodeToNameHelper(String(value), [
          {
            code: '1',
            name: 'AST标准',
          },
          {
            code: '0',
            name: '交易所标准',
          },
        ]);
      },
    },
    {
      title: '交易网关编号',
      dataIndex: 'tgwId',
      width: 130,
      render: (_, record) => record.tgw.tgwId,
    },
    {
      title: '交易所网关名称',
      dataIndex: 'offerChannelType',
      render: (_, record) => {
        return transformDictCodeToNameHelper(
          String(record.tgw.offerChannelType),
          OFFER_CHANNEL_tYPE
        );
      },
    },
    {
      title: '报盘代理节点号',
      dataIndex: 'tgwAgentId',
      width: 130,
    },
    {
      title: '启用标志',
      dataIndex: 'enableFlag',
      width: 120,
      render: (value) => {
        if (value === '1') {
          return <span style={{ color: '#3F88F1' }}>开启</span>;
        }
        if (value === '0') {
          return <span style={{ color: '#bb744a' }}>关闭</span>;
        }
        return '';
      },
    },
    {
      title: '交易系统连接状态',
      dataIndex: 'tradeSysLinkStatus',
      width: 150,
      render: (value, record) => {
        if (value === 1 && record.enableFlag === '1') {
          return <span style={{ color: '#3F88F1' }}>就绪</span>;
        }
        if (value === 0 && record.enableFlag === '1') {
          return <span style={{ color: '#bb744a' }}>未就绪</span>;
        }
        return '';
      },
    },
    {
      title: '风控系统连接状态',
      dataIndex: 'riskLinkStatus',
      width: 150,
      render: (value, record) => {
        if (value === 1 && record.enableFlag === '1') {
          return <span style={{ color: '#3F88F1' }}>就绪</span>;
        }
        if (value === 0 && record.enableFlag === '1') {
          return <span style={{ color: '#bb744a' }}>未就绪</span>;
        }
        return '';
      },
    },
    {
      title: '交易所网关连接状态',
      dataIndex: 'tgwLinkStatus',
      width: 165,
      render: (value, record) => {
        if (value === 1 && record.enableFlag === '1') {
          return <span style={{ color: '#3F88F1' }}>就绪</span>;
        }
        if (value === 0 && record.enableFlag === '1') {
          return <span style={{ color: '#bb744a' }}>未就绪</span>;
        }
        return '';
      },
    },
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
