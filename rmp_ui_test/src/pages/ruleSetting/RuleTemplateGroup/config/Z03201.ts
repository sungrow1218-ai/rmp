import { TemplateItem } from '../type';
import { RulesMap } from './rules';

// 连续竞价阶段虚假申报控制(创业板)
export default [
  {
    template: '（一）最优5档内申报买入或卖出',
  },
  {
    template:
      '（二）单笔申报后，实时最优5档内累计剩余有效申报数量在$44以上或者金额在$45以上，且占市场同方向最优5档剩余有效申报总量的比例在$46以上',
    $44: {
      component: 'InputNumber',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0.0,
        max: 99999999.9999,
        precision: 4,
        suffix: '万股',
      },
    },
    $45: {
      component: 'InputNumber',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0.0,
        max: 99999999.9999,
        precision: 4,
        suffix: '万元',
      },
    },
    $46: {
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
    template: '（三）累计撤销申报数量占累计申报数量的比例在$29以上',
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
    template: '（四）满足上述情形的申报发生$50以上',
    $50: {
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
