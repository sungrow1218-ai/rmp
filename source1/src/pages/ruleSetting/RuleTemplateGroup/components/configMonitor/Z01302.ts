import { TemplateItem } from '../../type';
import { RulesMap } from './rules';

// 收盘集合竞价阶段拉抬打压且反向控制
export default [
  {
    template: '（一）收盘集合竞价阶段成交数量在$16以上或者成交金额在$15以上',
    $15: {
      component: 'MultiThreshold',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0.0,
        max: 99999999.9999,
        precision: 4,
        suffix: '万元',
      },
    },
    $16: {
      component: 'MultiThreshold',
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
    template: '（二）收盘集合竞价阶段成交数量占期间市场成交总量的比例在$18以上',
    $18: {
      component: 'MultiThreshold',
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
    template: '（三）收盘集合竞价阶段股票涨（跌）幅$38以上',
    $38: {
      component: 'MultiThreshold',
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
      '（四）当日收盘集合竞价阶段及次一交易日10时以前累计反向卖出（买入）成交数量在$36以上或者成交金额在$35以上',
    $35: {
      component: 'MultiThreshold',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0.0,
        max: 99999999.9999,
        precision: 4,
        suffix: '万元',
      },
    },
    $36: {
      component: 'MultiThreshold',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0.0,
        max: 99999999.9999,
        precision: 4,
        suffix: '万股',
      },
    },
  },
] as TemplateItem[];
