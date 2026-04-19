import { VirtualGateWayDataType } from '@/services/offerAccessMaage';
import { transformDictCodeToNameHelper } from '@/utils/dict';
import { tranFromDataToOption } from '@/utils/utils';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';

export const getTableColumns = () => {
  const columns: ColumnsType<VirtualGateWayDataType> = [
    {
      title: '虚拟网关编号',
      dataIndex: 'virtualTgwId',
      width: 130,
      ellipsis: true,
    },
    {
      title: '虚拟网关名称',
      dataIndex: 'virtualTgwName',
      ellipsis: true,
    },
    {
      title: '服务端口',
      width: 150,
      dataIndex: 'virtualSvrPort',
      ellipsis: true,
    },
    {
      title: '交易系统编号',
      width: 130,
      dataIndex: 'extSysId',
    },
    {
      title: '交易子系统编号',
      dataIndex: 'extSubsysId',
    },
    {
      title: '委托起始申报号',
      dataIndex: 'beginOrderId',
      ellipsis: true,
    },
    {
      title: '委托结束申报号',
      dataIndex: 'endOrderId',
      ellipsis: true,
    },
    {
      title: 'tgw协议类型',
      width: 140,
      dataIndex: 'tgwProtocolType',
      render: (value) => {
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
    // {
    //   title: '状态',
    //   dataIndex: 'virtualTgwStatus',
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
    // {
    //   title: '联合风控连接状态',
    //   dataIndex: 'riskStatus',
    //   width: 160,
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
      title: '风控调用标志',
      dataIndex: 'toRiskFlag',
      width: 160,
      render: (value, record) => {
        if (value === 1) {
          return <span style={{ color: '#3F88F1' }}>开启</span>;
        }
        if (value === 0) {
          return <span style={{ color: '#bb744a' }}>关闭</span>;
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
