import { QuerySecuPoolRspDTO } from '@/pages/securityPool/contants/tyeping';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import moment from 'moment';
import { ColumnsType, ColumnType } from '@ht/sprite-ui/es/table';
import React from 'react';
import { RolePermissonProps } from '@/pages/roleManage/contant/typing';

export const parseTime = (
  value: moment.MomentInput,
  str: string,
  flag: string
) => (value ? moment(value, flag).format(str) : undefined);
export const getColumns = () => {
  const infoArr: ColumnsType<QuerySecuPoolRspDTO> = [
    {
      title: '券池',
      dataIndex: 'secuPoolName',
      ellipsis: true,
    },
    {
      title: '证券代码',
      dataIndex: 'securityCode',
      render: (text) => (
        <div style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>{text}</div>
      ),
    },
    {
      title: '证券名称',
      dataIndex: 'securityName',
      ellipsis: true,
    },
    {
      title: '交易市场',
      dataIndex: 'marketId',
      render: (value) => (
        <div style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>
          {transformDictCodeToNameHelper(String(value), TRADING_MARKETS)}
        </div>
      ),
    },
    {
      title: '有效起始日期',
      dataIndex: 'effectBeginDate',
      render: (value) => (
        <div style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>
          {parseTime(value, 'YYYY-MM-DD', 'YYYYMMDD')}
        </div>
      ),
    },
    {
      title: '有效截止日期',
      dataIndex: 'effectEndDate',
      render: (value) => (
        <div style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>
          {parseTime(value, 'YYYY-MM-DD', 'YYYYMMDD')}
        </div>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 130,
      ellipsis: true,
    },
    {
      title: '添加人',
      dataIndex: 'createUserNo',
    },
    {
      title: '添加时间',
      dataIndex: 'createDateTime',
      render(value, record) {
        return parseTime(value, 'YYYY-MM-DD HH:mm:ss', 'YYYYMMDDHHmmss');
      },
    },
    {
      title: '修改人',
      dataIndex: 'updateUserNo',
    },
    {
      title: '修改时间',
      dataIndex: 'lastUpdateTime',
      render(value, record) {
        return parseTime(value, 'YYYY-MM-DD HH:mm:ss', 'YYYYMMDDHHmmss');
      },
    },
  ];
  return infoArr;
};

export const getColumnsRes = (mode: string) => {
  let infoArr: ColumnType<QuerySecuPoolRspDTO>[] = [];
  if (mode === 'ADD') {
    infoArr = [
      {
        title: '证券代码',
        dataIndex: 'securityCode',
        render: (value, record) => (
          <span style={{ color: record.desc ? '#FF4D4F' : '' }}>{value}</span>
        ),
      },

      {
        title: '交易市场',
        dataIndex: 'marketId',
        render(value, record) {
          return (
            <span
              style={{
                color: record.desc ? '#FF4D4F' : '',
              }}
            >
              {transformDictCodeToNameHelper(String(value), TRADING_MARKETS)
                ? transformDictCodeToNameHelper(String(value), TRADING_MARKETS)
                : value}
            </span>
          );
        },
      },
      {
        title: '有效起始日期',
        dataIndex: 'effectBeginDate',
        render: (value, record) => (
          <span
            style={{
              color: record.desc ? '#FF4D4F' : '',
            }}
          >
            {value}
          </span>
        ),
      },
      {
        title: '有效截止日期',
        dataIndex: 'effectEndDate',
        render: (value, record) => (
          <span
            style={{
              color: record.desc ? '#FF4D4F' : '',
            }}
          >
            {value}
          </span>
        ),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 120,
        render: (text) => (
          <div style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
            {text}
          </div>
        ),
      },
      {
        title: '校验结果',
        dataIndex: 'reuslt',
        render(value, record) {
          return (
            <span style={{ color: record.reuslt !== 1 ? '#FF4D4F' : '' }}>{`${
              value === 1 ? '通过' : '不通过'
            }`}</span>
          );
        },
      },
      {
        title: '错误描述',
        dataIndex: 'desc',
        render: (value, record) => (
          <span style={{ color: record.reuslt !== 1 ? '#FF4D4F' : '' }}>
            {value}
          </span>
        ),
      },
    ];
  } else if (mode === 'DELETE') {
    infoArr = [
      {
        title: '证券代码',
        dataIndex: 'securityCode',
        render: (value, record) => (
          <span style={{ color: record.desc ? '#FF4D4F' : '' }}>{value}</span>
        ),
      },

      {
        title: '交易市场',
        dataIndex: 'marketId',
        render(value, record) {
          return (
            <span
              style={{
                color: record.desc ? '#FF4D4F' : '',
              }}
            >
              {transformDictCodeToNameHelper(String(value), TRADING_MARKETS)
                ? transformDictCodeToNameHelper(String(value), TRADING_MARKETS)
                : value}
            </span>
          );
        },
      },
      {
        title: '校验结果',
        dataIndex: 'reuslt',
        render(value, record) {
          return (
            <span style={{ color: record.reuslt !== 1 ? '#FF4D4F' : '' }}>{`${
              value === 1 ? '通过' : '不通过'
            }`}</span>
          );
        },
      },
      {
        title: '错误描述',
        dataIndex: 'desc',
        render: (value, record) => (
          <span style={{ color: record.reuslt !== 1 ? '#FF4D4F' : '' }}>
            {value}
          </span>
        ),
      },
    ];
  }
  return infoArr;
};
export const getColumnsAltRes = () => {
  const infoArr: ColumnsType<QuerySecuPoolRspDTO> = [
    {
      title: '证券代码',
      dataIndex: 'securityCode',
    },

    {
      title: '交易市场',
      dataIndex: 'marketId',
      render(value, record) {
        return transformDictCodeToNameHelper(String(value), TRADING_MARKETS);
      },
    },
    {
      title: '错误描述',
      dataIndex: 'errorInfo',
    },
  ];
  return infoArr;
};
export const converToTreeData = (data: any) => {
  return data.map((item: any) => {
    let key = '';
    let title = '';
    if (item.level === 1) {
      key = 'secuPoolLayerId';
      title = 'secuPoolLayerName';
    }
    if (item.level === 2) {
      key = 'secuPoolId';
      title = 'secuPoolName';
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
export const createWorkAuthMap = (funAuthList: any[], workGroupList: any[]) => {
  const aMap = new Map<string, boolean>();
  const authMap = new Map(
    funAuthList.map((item) => [
      `${item.workGroupId}-${item.functionId}`,
      !!item.useAuth,
    ])
  );
  funAuthList.forEach((item) => {
    const workGroupId = item.workGroupId ?? -1;

    const workGroupAuth = !!funAuthList.some((m: any) => {
      return m.useAuth === 1 && m.workGroupId === item.workGroupId;
    });
    aMap.set(workGroupId, workGroupAuth);
  });
  return workGroupList.reduce((acc, curr) => {
    if (aMap.get(curr.workGroupId)) {
      acc[curr.workGroupId] = {
        ...curr,
        workGroupAuth: aMap.get(curr.workGroupId),
        addAuth: authMap.get(`${curr.workGroupId}-1`),
        otherAuth: authMap.get(`${curr.workGroupId}-999`),
      };
    }

    return acc;
  }, {});
};
interface Dict {
  code: string;
  name: string;
}

export const transformDictToMarketOptions = (dict?: Dict[]) => {
  if (!dict) {
    return [];
  }
  return dict.map((item) => {
    return {
      label: item.name,
      value: item.name.toString(),
      code: item.code,
    };
  });
};
