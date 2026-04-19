import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import moment from 'moment';
import React from 'react';
import useExyInfo from '@/hooks/useExyInfo';
import type { ColumnsType } from '@ht/sprite-ui/es/table/interface';
import { RolePermissonProps } from '@/pages/roleManage/contant/typing';
import { BasicColumn } from '@/components/Table';

export const parseTime = (
  value: moment.MomentInput,
  str: string,
  flag: string
) => (value ? moment(value, flag).format(str) : undefined);

export const getColumns = () => {
  const { availabExSysInfo } = useExyInfo();
  const infoArr: BasicColumn[] = [
    {
      title: '席位编码',
      dataIndex: 'seatCode',
      align: 'left',
    },
    {
      title: '席位名称',
      dataIndex: 'seatName',
      align: 'left',
    },
    {
      title: '交易所',
      dataIndex: 'marketId',
      align: 'left',
      render: (value) =>
        transformDictCodeToNameHelper(String(value), TRADING_MARKETS),
    },
    {
      title: '席位来源',
      dataIndex: 'extSysId',
      width: 120,
      align: 'left',
      render: (text) =>
        availabExSysInfo && text
          ? availabExSysInfo[Number(text)].extSysName
          : text,
    },
    {
      title: '添加人',
      dataIndex: 'createUserNo',
      align: 'left',
    },
    {
      title: '添加时间',
      dataIndex: 'createDateTime',
      align: 'left',
      render: (text) =>
        parseTime(text, 'YYYY-MM-DD HH:mm:ss', 'YYYYMMDDHHmmss'),
    },
    {
      title: '修改人',
      dataIndex: 'updateUserNo',
      align: 'left',
    },
    {
      title: '修改时间',
      dataIndex: 'lastUpdateTime',
      align: 'left',
      render: (text) =>
        parseTime(text, 'YYYY-MM-DD HH:mm:ss', 'YYYYMMDDHHmmss'),
    },
  ];
  return infoArr;
};

export const getColumnsAdd = () => {
  const { availabExSysInfo } = useExyInfo();
  const infoArr: ColumnsType<RolePermissonProps> = [
    {
      title: '交易所',
      dataIndex: 'marketId',
      align: 'center',
      render: (value) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          {transformDictCodeToNameHelper(String(value), TRADING_MARKETS)}
        </div>
      ),
    },
    {
      title: '席位编码',
      dataIndex: 'seatCode',
      align: 'center',
      render: (text) => (
        <div style={{ whiteSpace: 'nowrap', minWidth: '120px' }}>{text}</div>
      ),
    },
    {
      title: '席位名称',
      dataIndex: 'seatName',
      align: 'center',
    },
    {
      title: '数据来源',
      dataIndex: 'extSysId',
      align: 'center',
      render: (text) => (
        <div style={{ whiteSpace: 'nowrap', minWidth: '120px' }}>
          {availabExSysInfo && text
            ? availabExSysInfo[Number(text)].extSysName
            : text}
        </div>
      ),
    },
  ];
  return infoArr;
};

export const converToTreeData = (data: any) => {
  return data.map((item: any) => {
    let key = '';
    let title = '';
    if (item.level === 1) {
      key = 'workGroupId';
      title = 'workGroupName';
    }
    if (item.level === 2) {
      key = 'seatGroupId';
      title = 'seatGroupName';
    }
    return {
      ...item,
      key: item[key],
      title: item[title],
      children: item.children?.length ? converToTreeData(item.children) : [],
      level: item.level,
    };
  });
};
