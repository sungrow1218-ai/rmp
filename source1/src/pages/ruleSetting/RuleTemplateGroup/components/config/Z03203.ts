import { TemplateItem } from '../../type';
import { RulesMap } from './rules';

// 涨跌幅限制价位虚假申报控制
export default [
  {
    template: '（一）股票交易价格处于涨（跌）幅限制状态',
  },
  {
    template:
      '（二）单笔以涨（跌）幅限制价格申报后，在该价格剩余有效申报数量在$34以上或者金额在$33以上，且占市场该价格剩余有效申报总量的比例在$48以上',
    $34: {
      component: 'InputNumber',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0.0,
        max: 99999999.9999,
        precision: 4,
        suffix: '万股',
      },
    },
    $33: {
      component: 'InputNumber',
      rules: [RulesMap.required, RulesMap.threshold],
      componentProps: {
        min: 0.0,
        max: 99999999.9999,
        precision: 4,
        suffix: '万元',
      },
    },
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
  {
    template:
      '（三）单笔撤销以涨（跌）幅限制价格的申报后，在涨（跌）幅限制价格的累计撤销申报数量占以该价格累计申报数量的比例在$29以上',
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
    template: '（四）以上情形累计触发$50以上',
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
