import { TemplateItem } from '../type';
import { RulesMap } from './rules';

// 开盘集合竞价阶段虚假申报控制
export default [
  {
    template: '（一）以偏离前收盘价$49以上的价格申报买入或卖出',
    $49: {
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
    template: '（二）累计申报数量在$40以上或者申报金额在$41以上',
    $40: {
      component: 'InputNumber',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0.0,
        max: 99999999.9999,
        precision: 4,
        suffix: '万股',
      },
    },
    $41: {
      component: 'InputNumber',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0.0,
        max: 99999999.9999,
        precision: 4,
        suffix: '万元',
      },
    },
  },
  {
    template: '（三）累计申报数量占市场同方向申报总量的比例在$42以上',
    $42: {
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
    template: '（四）累计撤销申报数量占累计申报数量的比例在$29以上',
    $29: {
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
      '（五）以低于申报买入价格反向申报卖出或者以高于申报卖出价格反向申报买入的次数在$43以上',
    $43: {
      component: 'InputNumber',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0,
        max: 99999999,
        precision: 0,
        suffix: '次',
      },
    },
  },
] as TemplateItem[];
