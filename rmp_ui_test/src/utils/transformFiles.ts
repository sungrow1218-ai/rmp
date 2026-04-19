import { read, utils } from 'xlsx';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { TRADING_MARKETS, transformDictCodeToNameHelper } from './dict';

// type 0-判空 1-判断日期格式 2.证券代码填写是否存在3.交易市场是否有效4.是否唯一
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
    value: 'effectBeginDate',
    label: '有效起始日期',
    type: ['1'],
  },
  {
    key: 4,
    value: 'effectEndDate',
    label: '有效截止日期',
    type: ['1'],
  },
  {
    key: 5,
    value: 'remark',
    label: '备注',
  },
];
/**
 * 父子数组扁平化数据转换为树级结构,
 */
export const transformTree = (
  parents: any[],
  children: any[],
  { parentKey }: any
) => {
  const unmatchedChildren: { [key: string]: any } = { children: [] };
  // 创建一个映射，方便查找父节点
  const parentMap = new Map(
    parents.map((parent) => [
      parent[parentKey],
      { ...parent, level: 1, children: [] },
    ])
  );

  // 遍历子节点，将其添加到对应父节点的 children 数组中
  children.forEach((child) => {
    const parent = parentMap.get(child[parentKey]);
    if (parent) {
      parent.children.push({ ...child, level: 2 });
    } else {
      unmatchedChildren.children.push({ ...child, level: 2 });
    }
  });
  const tree = [...parentMap.values()];
  if (unmatchedChildren.children.length > 0) {
    tree.push(unmatchedChildren);
  }
  // 返回所有根节点（父节点）
  return tree;
};
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
/**
 * 解析excel文件
 */
export const handleExecel = (
  fileTemp: any,
  colunms: any[],
  filterColunms?: any[]
) => {
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

          const vData = validateObjects(arr, filterColunms);
          resolve(vData);
        } else {
          resolve(false);
        }
      }
    };
    reader.readAsArrayBuffer(f);
  });
};

// excel数据存入arr
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
const isDateValid = (dateStr: any) => {
  const regex = /\d{8}$/; // 匹配YYYYMMDD格式
  return (
    regex.test(dateStr) && dateStr && moment(dateStr, 'YYYYMMDD').isValid()
  );
};
const validateObjects = (array: any[], columns?: any[]) => {
  let excelColumnsNew = excelColumns;
  if (columns) {
    const bIds = new Set(columns);
    excelColumnsNew = excelColumns.filter((r) => bIds.has(r.key));
  }

  const allNull = excelColumnsNew.filter((r) => r.type?.includes('0'));
  const seenUnique = new Set();
  const seenUniqueList: string[] = [];
  const allDate = excelColumnsNew.filter((r) => r.type?.includes('1'));
  let dataList = [];
  dataList = array
    .map((obj: { [key: string]: any }, _index: any) => {
      const errors: any[] = [];
      let str = '';

      // 检查type-0属性是否全量存在
      allNull.forEach(({ value, label }) => {
        if (!(value in obj)) {
          str = `${str.includes('标的无效') ? '' : '标的无效，'}${label}为空`;
          errors.push(str);
        }
      });

      // 检查type-1是否符合日期格式YYYYMMDD
      if (allDate.length > 0) {
        allDate.forEach(({ value, label }) => {
          if (value in obj && !isDateValid(Number(obj[value]))) {
            if (!errors.includes('生效日期格式错误')) {
              errors.push(`生效日期格式错误`);
            }
          } else {
            obj[value] = obj[value]
              ? moment(obj[value], 'YYYYMMDD').format('YYYY-MM-DD')
              : '';
          }
        });
      }

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
      // 开始日期小于结束日期
      if (
        obj.effectBeginDate &&
        obj.effectEndDate &&
        moment(obj.effectBeginDate, 'YYYYMMDD') >=
          moment(obj.effectEndDate, 'YYYYMMDD')
      ) {
        errors.push('有效起始日期应小于有效截止日期');
      }
      if (obj.remark && obj.remark.length > 100) {
        obj.remark = obj.remark.substring(0, 100);
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
