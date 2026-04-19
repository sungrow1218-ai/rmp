export interface DictType {
  code: string;
  name: string;
  feKey: string;
}
/**
 * 月份类型
 */
export const MONTH_CONTROL_TYPE = [
  { code: '0', name: '无', feKey: '0' },
  { code: '1', name: '是', feKey: '1' },
  { code: '2', name: '非', feKey: '2' },
] as const;
export const COMTRACT_MONTH = [
  { code: '1', name: '一月份', feKey: '1' },
  { code: '2', name: '二月份', feKey: '2' },
  { code: '3', name: '三月份', feKey: '3' },
  { code: '4', name: '四月份', feKey: '4' },
  { code: '5', name: '五月份', feKey: '5' },
  { code: '6', name: '六月份', feKey: '6' },
  { code: '7', name: '七月份', feKey: '7' },
  { code: '8', name: '八月份', feKey: '8' },
  { code: '9', name: '九月份', feKey: '9' },
  { code: '10', name: '十月份', feKey: '10' },
  { code: '11', name: '十一月份', feKey: '11' },
  { code: '12', name: '十二月份', feKey: '12' },
] as const;

export const COMPARE_DIRECTION = [
  { code: '1', name: '大于', feKey: 'GT' },
  { code: '2', name: '小于', feKey: 'LT' },
  { code: '3', name: '大于等于', feKey: 'GTE' },
  { code: '4', name: '小于等于', feKey: 'LTE' },
] as const;

export const BEGIN_INFLUENCE_DIRECTION = [
  { code: '1', name: '不含', feKey: 'CONTAIN' },
  { code: '3', name: '含', feKey: 'NOCONTAIN' },
] as const;
export const END_INFLUENCE_DIRECTION = [
  { code: '2', name: '不含', feKey: 'CONTAIN' },
  { code: '4', name: '含', feKey: 'NOCONTAIN' },
] as const;
export const MONTH_OFFSET = [
  { code: '1', name: '上市日', feKey: '0' },
  { code: '0', name: '交割月', feKey: '1' },
  { code: '-1', name: '交割月前1个月', feKey: '2' },
  { code: '-2', name: '交割月前2个月', feKey: '3' },
  { code: '-3', name: '交割月前3个月', feKey: '4' },
] as const;
export const MONTH_OFFSET_KEY = [
  { code: '1', name: '上市日', feKey: '0' },
  { code: '0', name: '交割月', feKey: '1' },
  { code: '-1', name: '标的合约交割月前1个月', feKey: '2' },
  { code: '-2', name: '标的合约交割月前2个月', feKey: '3' },
  { code: '-3', name: '标的合约交割月前3个月', feKey: '4' },
] as const;

export const DAY_OFFSET = [
  { code: '1', name: '第1个', feKey: '1' },
  { code: '2', name: '第2个', feKey: '2' },
  { code: '3', name: '第3个', feKey: '3' },
  { code: '4', name: '第4个', feKey: '4' },
  { code: '5', name: '第5个', feKey: '5' },
  { code: '6', name: '第6个', feKey: '6' },
  { code: '7', name: '第7个', feKey: '7' },
  { code: '8', name: '第8个', feKey: '8' },
  { code: '9', name: '第9个', feKey: '9' },
  { code: '10', name: '第10个', feKey: '10' },
  { code: '11', name: '第11个', feKey: '11' },
  { code: '12', name: '第12个', feKey: '12' },
  { code: '13', name: '第13个', feKey: '13' },
  { code: '14', name: '第14个', feKey: '14' },
  { code: '15', name: '第15个', feKey: '15' },
  { code: '16', name: '第16个', feKey: '16' },
  { code: '17', name: '第17个', feKey: '17' },
  { code: '18', name: '第18个', feKey: '18' },
  { code: '19', name: '第19个', feKey: '19' },
  { code: '20', name: '第20个', feKey: '20' },
  { code: '21', name: '第21个', feKey: '21' },
  { code: '22', name: '第22个', feKey: '22' },
  { code: '23', name: '第23个', feKey: '23' },
  { code: '24', name: '第24个', feKey: '24' },
  { code: '25', name: '第25个', feKey: '25' },
  { code: '26', name: '第26个', feKey: '26' },
  { code: '27', name: '第27个', feKey: '27' },
  { code: '28', name: '第28个', feKey: '28' },
  { code: '29', name: '第29个', feKey: '29' },
  { code: '30', name: '第30个', feKey: '30' },
  { code: '31', name: '第31个', feKey: '31' },
  { code: '999', name: '最后1个', feKey: '999' },
] as const;

export const DAY_TYPE = [
  { code: '1', name: '自然日', feKey: 'CONTAIN' },
  { code: '2', name: '交易日', feKey: 'NOCONTAIN' },
] as const;
export const THRESHOLD_TYPE = [
  { code: '1', name: '按数量', feKey: 'number' },
  { code: '2', name: '按比列', feKey: 'prenrn' },
] as const;

export const TRADING_MARKETS = [
  { code: '3', name: '上期所', feKey: 'KEY_3' },
  { code: '4', name: '郑商所', feKey: 'KEY_4' },

  { code: '7', name: '中金所', feKey: 'KEY_7' },
  { code: '9', name: '大商所', feKey: 'KEY_9' },

  { code: '34', name: '能源交易所', feKey: 'KEY_34' },

  { code: '107', name: '广期所', feKey: 'KEY_107' },
] as const;
