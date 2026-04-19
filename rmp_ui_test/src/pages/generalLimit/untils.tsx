import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import { ColumnType } from 'antd/lib/table';
import { GeneraList } from './RightTable';
import React from 'react';
import { parseTime } from '../securityPool/contants/contants';
import { read, utils } from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

export type ResultValiTable = {
  key?: React.Key;
  reuslt?: number;
  securityCode: string;
  /** 市场 */
  marketId: number;
  limitValue?: number;
  /** 错误描述 */
  errorInfo?: string;
  desc?: string;
};
// type 0-判空 1-判断日期格式 2.证券代码填写是否存在3.交易市场是否有效4.是否唯一 5 限仓值是否有效
const excelColumns = [
  {
    key: 1,
    value: 'securityCode',
    label: '证券代码',
    type: ['0', '4'],
  },
  {
    key: 2,
    value: 'marketId',
    label: '交易市场',
    type: ['0', '3', '4'],
  },

  {
    key: 3,
    value: 'limitValue',
    label: '限仓值/%',
    type: ['0', '5'],
  },
];

export const parseNull = (
  obj: { [x: string]: any },
  v: any,
  key: string | number
) => {
  if (v) {
    obj[key] = v ? String(v).replace(/\s/g, '') : v;
  }
  return obj;
};
export const getColumns = () => {
  const columns: ColumnType<GeneraList>[] = [
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
      render: (text) => <div style={{ whiteSpace: 'nowrap' }}>{text}</div>,
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
      title: '限仓值/%',
      dataIndex: 'limitValue',
      render: (value) => (
        <div style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>
          {(value * 100).toFixed(2)}%
        </div>
      ),
    },
    {
      title: '添加人',
      width: 130,
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
      width: 130,
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
  return columns;
};
export const getColumnsResult = () => {
  const infoArr: ColumnType<ResultValiTable>[] = [
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
      title: '限仓值',
      dataIndex: 'limitValue',
      render: (value, record) => (
        <span
          style={{
            color: record.desc ? '#FF4D4F' : '',
          }}
        >
          {/* {value}% */}
          {isNaN(value) ? value : `${Number(value).toFixed(2)}%`}
        </span>
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
  return infoArr;
};
export const getColumnsFault = () => {
  const infoArr: ColumnType<ResultValiTable>[] = [
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
      title: '错误描述',
      dataIndex: 'errorInfo',
      render: (value, record) => (
        <span style={{ color: '#FF4D4F' }}>{value}</span>
      ),
    },
  ];
  return infoArr;
};

export const handleExecel = (fileTemp: any, colunms: any[]) => {
  return new Promise((resolve) => {
    const f = fileTemp;
    const reader = new FileReader();
    let outdata;
    reader.onload = function (e) {
      const data = e.target?.result;

      const wb = read(data, { type: 'binary' });
      outdata = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const excelData = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
        header: 1,
      });
      let arr = [];
      if (excelData.length > 0) {
        const headers = excelData[0];
        const fixCols = arraysMatchByProperty(headers, excelColumns, 'label');

        if (fixCols) {
          arr = parseArray(outdata, colunms);
          const vData = validateObjects(arr);
          resolve(vData);
        } else {
          resolve(false);
        }
      }
    };
    reader.readAsArrayBuffer(f);
  });
};

export const parseArray = (outdata: any[], colunms: any[]) => {
  let arr: any[] = [];

  if (outdata.length > 0) {
    outdata.map((v: any) => {
      const obj: { [key: string]: any } = {};
      Object.keys(v).map((o) => {
        if (v[o]) {
          const hasKey = colunms.some((c) => c.title === o);
          const hasKeyData = colunms.find((c) => c.title === o);
          if (hasKey) {
            parseNull(obj, v[o], hasKeyData.dataIndex);
          } else {
            parseNull(obj, v[o], o);
          }
        } else {
          obj[o] = v[o];
        }
        return o;
      });
      const isNoEmpty = !Object.values(v).every((o) => {
        return o === undefined;
      });
      if (isNoEmpty) {
        arr.push(obj);
      }
      return v;
    });
  } else {
    arr = [];
  }
  return arr;
};
const arraysMatchByProperty = (arr1: any, arr2: any, property: string) => {
  // 检查长度是否相同
  if (arr1.length !== arr2.length) {
    return false;
  }
  const dataList = new Set(
    arr2.map((item: { [x: string]: any }) => item[property])
  );
  for (const val of arr1) {
    if (!dataList.has(val)) {
      return false;
    }
  }

  return true;
};
const validateObjects = (array: any[]) => {
  const allNull = excelColumns.filter((r) => r.type?.includes('0'));
  const seenUnique = new Set();
  const seenUniqueList: string[] = [];
  let dataList = [];
  dataList = array
    .map((obj: { [key: string]: any }, _index: any) => {
      const errors: any[] = [];
      let str = '';

      // 检查type-0属性是否全量存在
      allNull.forEach(({ value, label }) => {
        if (!(value in obj)) {
          str = `${str.includes('标的无效') ? '' : '标的无效：'}${label}为空`;
          errors.push(str);
        }
      });

      // 检查marketId属性的值是否在字典表内
      if ('marketId' in obj) {
        const hasId = transformDictCodeToNameHelper(
          String(obj.marketId),
          TRADING_MARKETS
        );
        if (!hasId) {
          errors.push(`交易市场无效`);
        }
        // 检查type-4属性是否全量存在
        if ('securityCode' in obj) {
          if (seenUnique.has(`${obj.securityCode}|${obj.marketId}`)) {
            errors.push('证券重复');
            seenUniqueList.push(`${obj.securityCode}|${obj.marketId}`);
          } else {
            seenUnique.add(`${obj.securityCode}|${obj.marketId}`);
          }
        }
      }
      // 判断限仓值是否有效
      if ('limitValue' in obj) {
        const limitValue = Number(obj.limitValue);
        if (Number.isNaN(limitValue)) {
          errors.push(`限仓值无效`);
        } else if (obj.limitValue < 0 || obj.limitValue > 100) {
          errors.push(`限仓值超出范围`);
        }
      }
      return {
        ...obj,
        reuslt: !(errors.length > 0) ? 1 : 0,
        desc: errors.join('，'),
        key: uuidv4(),
      };
    })
    .map((obj: { [key: string]: any }) => {
      const errors: any[] = [];
      seenUniqueList.forEach((h) => {
        if (
          `${obj.securityCode}|${obj.marketId}` === h &&
          !obj.desc.includes('证券重复')
        ) {
          errors.push('证券重复');
        }
      });
      const errorsSet = [...new Set(errors)];
      return {
        ...obj,
        key: uuidv4(),
        reuslt: !(errors.length > 0) ? obj.reuslt : 0,
        desc: errorsSet.length > 0 ? obj.desc + errorsSet.join('，') : obj.desc,
      };
    })
    .sort((a, b) => a.reuslt - b.reuslt);

  return dataList;
};
