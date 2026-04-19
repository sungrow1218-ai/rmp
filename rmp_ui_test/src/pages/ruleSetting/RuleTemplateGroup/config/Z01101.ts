import { TemplateItem } from '../type';
import { RulesMap } from './rules';

// 开盘集合竞价阶段拉抬打压控制
export default [
  {
    template: '（一）成交数量在$16以上或成交金额在$15以上',
    $15: {
      component: 'InputNumber',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0.0,
        max: 99999999.9999,
        precision: 4,
        suffix: '万元',
      },
    },
    $16: {
      component: 'InputNumber',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0.0,
        max: 99999999.9999,
        precision: 4,
        suffix: '万股',
      },
    },
  },
  {
    template: '（二）成交数量占期间市场成交总量的比例在$18以上',
    $18: {
      component: 'InputNumber',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0,
        max: 100,
        precision: 2,
        suffix: '%',
      },
    },
  },
  {
    template: '（三）开盘价涨（跌）幅$17以上',
    $17: {
      component: 'InputNumber',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0,
        max: 100,
        precision: 2,
        suffix: '%',
      },
    },
  },
  {
    template:
      '（四）股票开盘价达到涨（跌）幅限制价格的，在涨（跌）幅限制价格有效申报数量占期间市场该价格有效申报总量的比例$48以上',
    $48: {
      component: 'InputNumber',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0,
        max: 100,
        precision: 2,
        suffix: '%',
      },
    },
  },
] as TemplateItem[];
