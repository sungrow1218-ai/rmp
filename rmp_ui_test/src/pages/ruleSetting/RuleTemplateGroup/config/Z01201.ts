import { TemplateItem } from '../type';
import { RulesMap } from './rules';

// 连续竞价阶段拉抬打压控制
export default [
  {
    template:
      '（一）连续竞价阶段任意3分钟内，成交数量在$16以上或成交金额在$15以上',
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
    template: '（二）成交数量占成交期间市场成交总量的比例在$18以上',
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
    template: '（三）价格涨（跌）幅$17以上',
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
] as TemplateItem[];
