import { showIndexValueTable } from '@/pages/riskControlAlarm/components/typeUntil';
import { WarnRemarkData } from '@/services/riskControlAlarm';

export const defalutConfig = [
  { colName: '业务日期', key: 'businessDate', show: 1 },
  { colName: '触警时间', key: 'warnTime', show: 1 },
  { colName: '触警对象', key: 'ruleSource', show: 1 },
  { colName: '所属编号', key: 'ruleId', show: 1 },
  { colName: '所属名称', key: 'ruleName', show: 1, disabled: true },
  { colName: '规则类型', key: 'ruleType', show: 1 },
  { colName: '证券代码', key: 'securityCode', show: 1 },
  { colName: '委托方向', key: 'entrustDirection', show: 1 },
  { colName: '触警操作', key: 'warnOperation', show: 1 },
  { colName: '触警说明', key: 'remark', show: 1 },
  { colName: '外部系统号', key: 'extSysId', show: 1 },
  { colName: '交易市场', key: 'marketId', show: 1 },
  { colName: '委托编码', key: 'entrustCode', show: 1 },
  { colName: '账户', key: 'account', show: 1 },
  { colName: '灰度标志', key: 'grayFlag', show: 1 },
];

export const colorEntrustDirection = [
  { EntrustName: '买入', code: 1, color: 1 },
  { EntrustName: '债券买入', code: 3, color: 1 },
  { EntrustName: '融券(逆)回购', code: 6, color: 1 },
  { EntrustName: '配股配债认购', code: 9, color: 1 },
  { EntrustName: '债转股', code: 10, color: 1 },
  { EntrustName: '申购', code: 12, color: 1 },
  { EntrustName: '基金认购', code: 13, color: 1 },
  { EntrustName: 'ETF基金申购', code: 26, color: 1 },
  { EntrustName: '转回质押', code: 31, color: 1 },
  { EntrustName: '买入开仓', code: 32, color: 1 },
  { EntrustName: '卖出开仓', code: 34, color: 1 },
  { EntrustName: '开基申购', code: 53, color: 1 },
  { EntrustName: '认购', code: 55, color: 1 },
  { EntrustName: '卖出', code: 2, color: 0 },
  { EntrustName: '债券卖出', code: 4, color: 0 },
  { EntrustName: '融资(正)回购', code: 5, color: 0 },
  { EntrustName: 'ETF基金赎回', code: 27, color: 0 },
  { EntrustName: '提交质押', code: 30, color: 0 },
  { EntrustName: '卖出平仓', code: 33, color: 0 },
  { EntrustName: '买入平仓', code: 35, color: 0 },
  { EntrustName: '开基赎回', code: 54, color: 0 },
];

export const tableWidth = (length: number) => {
  if (length === 14) {
    return 2180;
  } else if (length >= 10 && length < 14) {
    return 2000;
  } else if (length >= 7 && length < 10) {
    return 1800;
  } else if (length < 7) {
    return 1600;
  } else {
    return 1600;
  }
};
interface TableData {
  indexName: string;
  indexValue: string;
  warnThreshold: string;
  banThreshold: string;
  ignoreThreshold?: string;
}

export const tranRuleData = (
  data: WarnRemarkData,
  ruleType: string,
  entrustCode?: string
): TableData[] | undefined => {
  if (!data) return [];

  if (ruleType === 'A1') {
    const isPre = data.factorResult?.length
      ? data.factorResult?.length > 1
      : false;
    const factorArry =
      data?.factorResult
        ?.map((p) => {
          if (p.factorType === 1 && !isPre) {
            return {
              indexName: '证券持仓数量',
              indexValue: showIndexValueTable(p.factorValue, 2, '万股(手)'),
              warnThreshold: `${
                !isPre
                  ? `${showIndexValueTable(data.warnThreshold, 2, '万股(手)')}`
                  : '--'
              }`,
              banThreshold: `${
                !isPre
                  ? `${showIndexValueTable(data.banThreshold, 2, '万股(手)')}`
                  : '--'
              }`,
              ignoreThreshold: `${
                !isPre
                  ? `${showIndexValueTable(
                      data.ignoreThreshold,
                      2,
                      '万股(手)'
                    )}`
                  : '--'
              }`,
            };
          }
          return '';
        })
        ?.filter((q) => q !== '') ?? [];

    const indexObj = {
      indexName: data.indexName,
      indexValue: showIndexValueTable(data.indexValue, 1, '%'),
      warnThreshold: showIndexValueTable(data.warnThreshold, 1, '%'),
      banThreshold: showIndexValueTable(data.banThreshold, 1, '%'),
      ignoreThreshold: showIndexValueTable(data.ignoreThreshold, 1, '%'),
    };

    if (isPre) {
      return [indexObj, ...factorArry];
    } else {
      return factorArry;
    }
  }
  if (ruleType === 'E01') {
    return [
      {
        indexName: '当前市值',
        indexValue: showIndexValueTable(data.indexValue, 2, '万元'),
        warnThreshold: showIndexValueTable(data.warnThreshold, 2, '万元'),
        banThreshold: showIndexValueTable(data.banThreshold, 2, '万元'),
        ignoreThreshold: showIndexValueTable(data.ignoreThreshold, 2, '万元'),
      },
    ];
  }
  if (ruleType === 'F1') {
    return [
      {
        indexName: data?.calcMode === 1 ? '交易额' : '交易量',
        indexValue: showIndexValueTable(
          data.indexValue,
          2,
          data?.calcMode === 1 ? '万元' : '万手'
        ),
        warnThreshold: showIndexValueTable(
          data.warnThreshold,
          2,
          data?.calcMode === 1 ? '万元' : '万手'
        ),
        banThreshold: showIndexValueTable(
          data.banThreshold,
          2,
          data?.calcMode === 1 ? '万元' : '万手'
        ),
        ignoreThreshold: showIndexValueTable(
          data.ignoreThreshold,
          2,
          data?.calcMode === 1 ? '万元' : '万手'
        ),
      },
    ];
  }
  if (ruleType === 'F2') {
    return [
      {
        indexName: '累计净买入金额',
        indexValue: showIndexValueTable(data.indexValue, 2, '万元'),
        warnThreshold: showIndexValueTable(data.warnThreshold, 2, '万元'),
        banThreshold: showIndexValueTable(data.banThreshold, 2, '万元'),
        ignoreThreshold: showIndexValueTable(data.ignoreThreshold, 2, '万元'),
      },
    ];
  }
  if (ruleType === 'H1') {
    return [
      {
        indexName: '价格偏离度',
        indexValue:
          data.calcType === 0
            ? showIndexValueTable(data.indexValue, 1, '%')
            : showIndexValueTable(data.indexValue, 3, '元'),
        warnThreshold:
          data.calcType === 0
            ? showIndexValueTable(data.warnThreshold, 1, '%')
            : showIndexValueTable(data.warnThreshold, 3, '元'),
        banThreshold:
          data.calcType === 0
            ? showIndexValueTable(data.banThreshold, 1, '%')
            : showIndexValueTable(data.banThreshold, 3, '元'),
        ignoreThreshold:
          data.calcType === 0
            ? showIndexValueTable(data.ignoreThreshold, 1, '%')
            : showIndexValueTable(data.ignoreThreshold, 3, '元'),
      },
    ];
  }
  if (ruleType === 'J1' || ruleType === 'J2') {
    if (data.contraMode === 1) {
      return [
        {
          indexName: '当前委托价格',
          indexValue: `${data?.orderPrice ? `${data.orderPrice}元` : '--'}`,
          warnThreshold: '--',
          banThreshold: `--`,
        },
        {
          indexName: '当前委托编码',
          indexValue: `${entrustCode ?? '--'}`,
          warnThreshold: `--`,
          banThreshold: `--`,
        },
        {
          indexName: '对敲委托价格',
          indexValue: `${data.bucketPrice ? `${data.bucketPrice}元` : '--'}`,
          warnThreshold: `--`,
          banThreshold: `--`,
        },
        {
          indexName: '对敲委托编码',
          indexValue: `${data.bucketEntrustNo ?? '--'}`,
          warnThreshold: `--`,
          banThreshold: `--`,
        },
      ];
    } else {
      return [
        {
          indexName: '当前委托价格',
          indexValue: `${data?.orderPrice ? `${data.orderPrice}元` : '--'}`,
          warnThreshold: '',
          banThreshold: '',
        },
        {
          indexName: '当前委托编码',
          indexValue: `${entrustCode ?? '--'}`,
          warnThreshold: '',
          banThreshold: '',
        },
      ];
    }
  }
  if (ruleType === 'I1' || ruleType === 'I51') {
    return [
      {
        indexName: '触发次数',
        indexValue: '1次',
        warnThreshold: data.operation === 1 ? '1次' : '--',
        banThreshold: data.operation === 2 ? '1次' : '--',
        ignoreThreshold: data.operation === 3 ? '1次' : '--',
      },
    ];
  }
  if (ruleType === 'J3') {
    return data.factorResult
      ?.map((p) => {
        if (p.factorType === 11000) {
          return {
            indexName: '自成交比例',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 11004) {
          return {
            indexName: '自成交次数',
            indexValue: showIndexValueTable(p.factorValue, 3, '次'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '次'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '次'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '次'),
          };
        }
        if (p.factorType === 11005) {
          return {
            indexName: '自成交金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        return '';
      })
      .filter((p) => p !== '');
  }
  if (ruleType === 'Q51000') {
    if (data.statisticsType === 10001) {
      return [
        {
          indexName: '区间内申报次数',
          indexValue: showIndexValueTable(data.indexValue, 3, '次'),
          warnThreshold: showIndexValueTable(data.warnThreshold, 3, '次'),
          banThreshold: showIndexValueTable(data.banThreshold, 3, '次'),
          ignoreThreshold: showIndexValueTable(data.ignoreThreshold, 3, '次'),
        },
      ];
    }
    if (data.statisticsType === 2) {
      return [
        {
          indexName: '区间内申报数量',
          indexValue: showIndexValueTable(data.indexValue, 2, '万股(手)'),
          warnThreshold: showIndexValueTable(data.warnThreshold, 2, '万股(手)'),
          banThreshold: showIndexValueTable(data.banThreshold, 2, '万股(手)'),
          ignoreThreshold: showIndexValueTable(
            data.ignoreThreshold,
            2,
            '万股(手)'
          ),
        },
      ];
    }
    if (data.statisticsType === 1) {
      return [
        {
          indexName: '区间内申报金额',
          indexValue: showIndexValueTable(data.indexValue, 2, '万元'),
          warnThreshold: showIndexValueTable(data.warnThreshold, 2, '万元'),
          banThreshold: showIndexValueTable(data.banThreshold, 2, '万元'),
          ignoreThreshold: showIndexValueTable(data.ignoreThreshold, 2, '万元'),
        },
      ];
    }
  }
  if (ruleType === 'Z02') {
    return [
      {
        indexName: '1分钟单向委托金额',
        indexValue: showIndexValueTable(data.indexValue, 2, '万元'),
        warnThreshold: showIndexValueTable(data.warnThreshold, 2, '万元'),
        banThreshold: showIndexValueTable(data.banThreshold, 2, '万元'),
        ignoreThreshold: showIndexValueTable(data.ignoreThreshold, 2, '万元'),
      },
    ];
  }
  if (ruleType === 'Z04') {
    return [
      {
        indexName: '符合条件的撤单次数',
        indexValue: showIndexValueTable(data.indexValue, 3, '次'),
        warnThreshold: showIndexValueTable(data.warnThreshold, 3, '次'),
        banThreshold: showIndexValueTable(data.banThreshold, 3, '次'),
        ignoreThreshold: showIndexValueTable(data.ignoreThreshold, 3, '次'),
      },
    ];
  }
  if (ruleType === 'Z06001' || ruleType === 'Z06101') {
    return data.factorResult
      ?.map((p) => {
        if (p.factorType === 58) {
          return {
            indexName: '单日申报数量',
            indexValue: showIndexValueTable(p.factorValue, 3, '笔'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '笔'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '笔'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '笔'),
          };
        }
        return '';
      })
      .filter((p) => p !== '');
  }

  if (ruleType === 'Z06202') {
    data.factorResult?.map((p) => {
      if (p.factorType === 57) {
        return {
          indexName: '每秒申报数量',
          indexValue: showIndexValueTable(p.factorValue, 3, '笔'),
          warnThreshold: showIndexValueTable(p.warnThreshold, 3, '笔'),
          banThreshold: showIndexValueTable(p.banThreshold, 3, '笔'),
          ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '笔'),
        };
      }
      return '';
    });
  }
  if (ruleType === 'Z06006') {
    return data.factorResult
      ?.map((p) => {
        if (p.factorType === 57) {
          return {
            indexName: '每秒申报数量',
            indexValue: showIndexValueTable(p.factorValue, 3, '笔'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '笔'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '笔'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '笔'),
          };
        }
        return '';
      })
      .filter((p) => p !== '');
  }
  if (ruleType === 'Z06003') {
    return data.factorResult
      ?.map((p) => {
        if (p.factorType === 64) {
          return {
            indexName: '瞬时撤单次数',
            indexValue: showIndexValueTable(p.factorValue, 3, '次'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '次'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '次'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '次'),
          };
        }
        if (p.factorType === 65) {
          return {
            indexName: '撤单笔数占比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 66) {
          return {
            indexName: '瞬时撤单金额比例',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        return '';
      })
      .filter((p) => p !== '');
  }
  if (ruleType === 'O01') {
    return data.factorResult
      ?.map((p) => {
        if (p.factorType === 22) {
          return {
            indexName: '当日撤单笔数',
            indexValue: showIndexValueTable(p.factorValue, 3, '笔'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '笔'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '笔'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '笔'),
          };
        }
        if (p.factorType === 23) {
          return {
            indexName: '撤单委托比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        return '';
      })
      .filter((p) => p !== '');
  }
  const fiveBest = {
    indexName: '报价在最优五档内',
    indexValue: '--',
    warnThreshold: '--',
    banThreshold: '--',
    ignoreThreshold: '--',
  };
  if (ruleType === 'Z03201') {
    const list = data.factorResult
      ?.map((p) => {
        if (p.factorType === 44) {
          return {
            indexName: '五档内挂单数量',
            indexValue: showIndexValueTable(p.factorValue, 2, '万股(手)'),
            warnThreshold: showIndexValueTable(p.banThreshold, 2, '万股(手)'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万股(手)'),
            ignoreThreshold: showIndexValueTable(
              p.ignoreThreshold,
              2,
              '万股(手)'
            ),
          };
        }
        if (p.factorType === 45) {
          return {
            indexName: '五档内挂单金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        if (p.factorType === 46) {
          return {
            indexName: '五档内挂单市场占比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 29) {
          return {
            indexName: '累计撤销占比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 50) {
          return {
            indexName: '累计触发次数',
            indexValue: showIndexValueTable(p.factorValue, 3, '次'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '次'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '次'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '次'),
          };
        }

        return '';
      })
      .filter((p) => p !== '');

    if (list) {
      return [fiveBest, ...list];
    }
    return [];
  }
  if (ruleType === 'Z03202') {
    const list = data.factorResult
      ?.map((p) => {
        if (p.factorType === 44) {
          return {
            indexName: '五档内挂单数量',
            indexValue: showIndexValueTable(p.factorValue, 2, '万股(手)'),
            warnThreshold: showIndexValueTable(p.banThreshold, 2, '万股(手)'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万股(手)'),
            ignoreThreshold: showIndexValueTable(
              p.ignoreThreshold,
              2,
              '万股(手)'
            ),
          };
        }
        if (p.factorType === 45) {
          return {
            indexName: '五档内挂单金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        if (p.factorType === 46) {
          return {
            indexName: '五档内挂单市场占比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 50) {
          return {
            indexName: '累计触发次数',
            indexValue: showIndexValueTable(p.factorValue, 3, '次'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '次'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '次'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '次'),
          };
        }
        if (p.factorType === 29) {
          return {
            indexName: '累计撤销占比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 47) {
          return {
            indexName: '反向卖出/买入成交次数',
            indexValue: showIndexValueTable(p.factorValue, 3, '次'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '次'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '次'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '次'),
          };
        }
        return '';
      })
      .filter((p) => p !== '');

    if (list) {
      return [fiveBest, ...list];
    }
    return [];
  }
  if (data.factorResult) {
    return data.factorResult
      .map((p) => {
        if (p.factorType === 15) {
          return {
            indexName: '成交金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold:
              ruleType === 'Z06004'
                ? showIndexValueTable(p.banThreshold, 2, '万元')
                : showIndexValueTable(p.warnThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        if (p.factorType === 16) {
          return {
            indexName: '成交数量',
            indexValue: showIndexValueTable(p.factorValue, 2, '万股(手)'),
            warnThreshold:
              ruleType === 'Z07301' || ruleType === 'Z06004'
                ? showIndexValueTable(p.banThreshold, 2, '万股(手)')
                : showIndexValueTable(p.warnThreshold, 2, '万股(手)'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万股(手)'),
            ignoreThreshold: showIndexValueTable(
              p.ignoreThreshold,
              2,
              '万股(手)'
            ),
          };
        }
        if (p.factorType === 17) {
          return {
            indexName:
              ruleType === 'Z06004'
                ? '当前笔1分钟内成交价格涨跌幅'
                : '价格涨跌幅',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold:
              ruleType === 'Z01101' ||
              ruleType === 'Z01301' ||
              ruleType === 'Z06004'
                ? showIndexValueTable(p.banThreshold, 1, '%')
                : showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 18) {
          return {
            indexName: '市场成交占比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold:
              ruleType === 'Z06004'
                ? showIndexValueTable(p.banThreshold, 1, '%')
                : showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 22) {
          return {
            indexName: '当日撤单笔数',
            indexValue: showIndexValueTable(p.factorValue, 3, '笔'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '笔'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '笔'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '笔'),
          };
        }
        if (p.factorType === 23) {
          return {
            indexName: '撤单委托比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }

        if (p.factorType === 29) {
          return {
            indexName: '累计撤销占比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold:
              ruleType === 'Z03203'
                ? showIndexValueTable(p.banThreshold, 1, '%')
                : showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 33) {
          return {
            indexName:
              ruleType === 'Z05301'
                ? '涨跌停价新增申报金额'
                : '涨跌停价挂单金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold:
              ruleType === 'Z03203'
                ? showIndexValueTable(p.banThreshold, 2, '万元')
                : showIndexValueTable(p.warnThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        if (p.factorType === 34) {
          return {
            indexName:
              ruleType === 'Z05301'
                ? '涨跌停价新增申报数量'
                : '涨跌停价挂单数量',
            indexValue: showIndexValueTable(p.factorValue, 2, '万股(手)'),
            warnThreshold:
              ruleType === 'Z03203'
                ? showIndexValueTable(p.banThreshold, 2, '万股(手)')
                : showIndexValueTable(p.warnThreshold, 2, '万股(手)'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万股(手)'),
            ignoreThreshold: showIndexValueTable(
              p.ignoreThreshold,
              2,
              '万股(手)'
            ),
          };
        }
        if (p.factorType === 35) {
          return {
            indexName: '反向成交金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        if (p.factorType === 36) {
          return {
            indexName: '反向成交数量',
            indexValue: showIndexValueTable(p.factorValue, 2, '万股(手)'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万股(手)'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万股(手)'),
            ignoreThreshold: showIndexValueTable(
              p.ignoreThreshold,
              2,
              '万股(手)'
            ),
          };
        }
        if (p.factorType === 38) {
          return {
            indexName: ruleType === 'Z01102' ? '开盘价涨跌幅' : '收盘价涨跌幅',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold:
              ruleType === 'Z01102' || ruleType === 'Z01302'
                ? showIndexValueTable(p.banThreshold, 1, '%')
                : showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 40) {
          return {
            indexName: '累计申报数量',
            indexValue: showIndexValueTable(p.factorValue, 2, '万股(手)'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万股(手)'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万股(手)'),
            ignoreThreshold: showIndexValueTable(
              p.ignoreThreshold,
              2,
              '万股(手)'
            ),
          };
        }
        if (p.factorType === 41) {
          return {
            indexName: '累计申报金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        if (p.factorType === 42) {
          return {
            indexName: '同方向累计申报占比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 43) {
          return {
            indexName: '低于申报买入/高于申报卖出次数',
            indexValue: showIndexValueTable(p.factorValue, 3, '次'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '次'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '次'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '次'),
          };
        }
        if (p.factorType === 44) {
          return {
            indexName: '五档内挂单数量',
            indexValue: showIndexValueTable(p.factorValue, 2, '万股(手)'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万股(手)'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万股(手)'),
            ignoreThreshold: showIndexValueTable(
              p.ignoreThreshold,
              2,
              '万股(手)'
            ),
          };
        }
        if (p.factorType === 45) {
          return {
            indexName: '五档内挂单金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        if (p.factorType === 46) {
          return {
            indexName: '五档内挂单市场占比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 47) {
          return {
            indexName: '反向卖出/买入成交次数',
            indexValue: showIndexValueTable(p.factorValue, 3, '次'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '次'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '次'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '次'),
          };
        }
        if (p.factorType === 48) {
          return {
            indexName:
              ruleType === 'Z05301'
                ? '收盘涨跌停价剩余申报市场占比'
                : '涨跌停价挂单市场占比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold:
              ruleType === 'Z03203'
                ? showIndexValueTable(p.banThreshold, 1, '%')
                : showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 49) {
          return {
            indexName: '申报价格偏离度',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold:
              ruleType === 'Z03101'
                ? showIndexValueTable(p.banThreshold, 1, '%')
                : showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 50) {
          return {
            indexName: '累计触发次数',
            indexValue: showIndexValueTable(p.factorValue, 3, '次'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '次'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '次'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '次'),
          };
        }
        if (p.factorType === 51) {
          return {
            indexName: '市场涨跌停价剩余申报数量',
            indexValue: showIndexValueTable(p.factorValue, 2, '万股(手)'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万股(手)'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万股(手)'),
            ignoreThreshold: showIndexValueTable(
              p.ignoreThreshold,
              2,
              '万股(手)'
            ),
          };
        }
        if (p.factorType === 52) {
          return {
            indexName: '市场涨跌停价剩余申报金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        if (p.factorType === 57) {
          return {
            indexName: '每秒申报数量',
            indexValue: showIndexValueTable(p.factorValue, 3, '笔'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '笔'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '笔'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '笔'),
          };
        }
        if (p.factorType === 64) {
          return {
            indexName: '瞬时撤单次数',
            indexValue: showIndexValueTable(p.factorValue, 3, '次'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '次'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '次'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '次'),
          };
        }
        if (p.factorType === 65) {
          return {
            indexName: '当日撤单笔数占比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 66) {
          return {
            indexName: '瞬时撤单金额比例',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 67) {
          return {
            indexName: '指数波动率',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 68) {
          return {
            indexName: '指数成分股成交金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        if (p.factorType === 69) {
          return {
            indexName: '本方成交金额市场占比',
            indexValue: showIndexValueTable(p.factorValue, 1, '%'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 1, '%'),
            banThreshold: showIndexValueTable(p.banThreshold, 1, '%'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 1, '%'),
          };
        }
        if (p.factorType === 11001) {
          return {
            indexName: '买入金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        if (p.factorType === 11002) {
          return {
            indexName: '卖出金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        if (p.factorType === 11003) {
          return {
            indexName: '累计成交量对日内最大持仓量倍数',
            indexValue: showIndexValueTable(p.factorValue, 3, '倍'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 3, '倍'),
            banThreshold: showIndexValueTable(p.banThreshold, 3, '倍'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 3, '倍'),
          };
        }
        if (p.factorType === 34000) {
          return {
            indexName: '剩余有效申报金额',
            indexValue: showIndexValueTable(p.factorValue, 2, '万元'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万元'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万元'),
            ignoreThreshold: showIndexValueTable(p.ignoreThreshold, 2, '万元'),
          };
        }
        if (p.factorType === 33000) {
          return {
            indexName: '剩余有效申报数量',
            indexValue: showIndexValueTable(p.factorValue, 2, '万股(手)'),
            warnThreshold: showIndexValueTable(p.warnThreshold, 2, '万股(手)'),
            banThreshold: showIndexValueTable(p.banThreshold, 2, '万股(手)'),
            ignoreThreshold: showIndexValueTable(
              p.ignoreThreshold,
              2,
              '万股(手)'
            ),
          };
        }

        return '';
      })
      .filter((q) => q !== '');
  }
};
