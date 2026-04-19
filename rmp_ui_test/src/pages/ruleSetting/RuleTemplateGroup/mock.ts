import { RuleTemplateDefaultIDTO } from '@/services/ruleSetting/idto';
import { RiskLevel, RuleTypeTemplate, SecurityGroup } from './type';

export const templatesMock = [
  {
    Id: 'Z01',
    Name: '拉抬打压控制',
    SubList: [
      {
        Id: 'Z03101',
        Name: '开盘集合竞价阶段拉抬打压控制',
      },
      {
        Id: 'Z01102',
        Name: '开盘集合竞价阶段拉抬打压且反向控制',
      },
      {
        Id: 'Z01201',
        Name: '连续竞价阶段拉抬打压控制',
      },
      {
        Id: 'Z01202',
        Name: '连续竞价阶段拉抬打压且反向控制',
      },
      {
        Id: 'Z01301',
        Name: '收盘集合竞价阶段拉抬打压控制',
      },
      {
        Id: 'Z01302',
        Name: '收盘集合竞价阶段拉抬打压且反向控制',
      },
    ],
  },
  {
    Id: 'Z02',
    Name: '严重异常波动标的申报速率控制',
  },
  {
    Id: 'Z03',
    Name: '虚假申报控制',
    SubList: [
      {
        Id: 'Z03001',
        Name: '开盘集合竞价阶段虚假申报控制',
      },
      {
        Id: 'Z03201',
        Name: '连续竞价阶段虚假申报控制(创业板)',
      },
      {
        Id: 'Z03202',
        Name: '连续竞价阶段虚假申报控制',
      },
      {
        Id: 'Z03203',
        Name: '涨跌幅限制价位虚假申报控制',
      },
      {
        Id: 'Z03000',
        Name: '连续竞价阶段虚假申报控制(简化)',
      },
    ],
  },
];

export const ruleTemplateDefaultMock: RuleTemplateDefaultIDTO = {
  rule_type: 'Z03101',
  optional_market_list: [1, 2], // 可选的市场列表，有几个，展示几个选项
  warn_value_percent: 0.9, // 预警值占禁止值比例
  // 市场列表，用户勾选了几个市场，展示市场列表里的几个对象，未勾展示全部的
  market_list: [
    {
      market_id: 1, // 市场
      security_group_list: [
        {
          security_group_id: 1, // 证券组序号
          security_group_name: '证券组名称',
          // 这些都是固定值，直接填到模板的参数里即可
          security_range: {
            security_control_type: 1, // 证券控制方式
            security_summary_type: 2, // 证券汇总方式
            security_summary_condition: 2, // 证券汇总条件，该字段不一定有
            secu_set_id_list: [1], // 证券集合类对象序号列表,按照券池、动态维度、现货限仓表等证券集合类对象控制时有此值，正常只有一个
            secu_filter_class_list: ['10', '120201'], // 证券过滤分类列表，按照证券类别、期货期权品种控制时有此值，可能有多个
            // 证券列表，按单券或者指数控制时有此值，可能有多个
            security_list: [
              {
                security_code: '证券代码',
                market_id: 1, // 市场，这个值和上面的market_id是一致的
              },
            ],
          },
          // 禁止阈值列表
          threshold_list: [
            {
              threshold_id: 42,
              factor_type: 15, // 因子类型
              compare_direction: 1, // 比较方向
              default_value: 88, // 默认值，填的监管值，新增时或恢复默认值时填写
              unit: 4, // 单位
            },
          ],
          // 生效时段列表，直接填到模板参数里即可
          effective_time_list: [
            {
              begin_time: '起始时间，格式：hhmmss',
              end_time: '截止时间，格式：hhmmss',
            },
          ],
          // 存储规则计算的其他必要参数，这些参数目前都是固化的，直接填到模板参数里即可
          ext_parameter_list: [
            {
              parameter_type: 1,
              parameter_value: '参数值，都以string存储',
            },
          ],
        },
      ],
    },
  ],
};

export const securityGroupListMock: SecurityGroup[] = [
  {
    securityGroupId: 1,
    securityGroupName: '证券组名称',
    securityControlType: 1,
    securitySummaryType: 2,
    securitySummaryCondition: 2,
    secuSetIdList: [1],
    secuFilterClassList: ['10', '120201'],
    securityList: [{ securityCode: '证券代码', marketId: 1 }],
    thresholdList: [
      {
        thresholdId: 42,
        factorType: 15,
        compareDirection: 1,
        defaultValue: 88,
        unit: 4,
      },
    ],
    effectiveTimeList: [
      {
        beginTime: '15:00:00',
        endTime: '17:00:00',
      },
    ],
    extParameterList: [
      {
        parameterType: 1,
        parameterValue: '参数值，都以string存储',
        parameterValue2: '',
      },
    ],
  },
  {
    securityGroupId: 2,
    securityGroupName: '证券组名称2',
    securityControlType: 1,
    securitySummaryType: 2,
    securitySummaryCondition: 2,
    secuSetIdList: [1],
    secuFilterClassList: ['10', '120201'],
    securityList: [{ securityCode: '证券代码', marketId: 1 }],
    thresholdList: [
      {
        thresholdId: 43,
        factorType: 15,
        compareDirection: 1,
        defaultValue: 88,
        unit: 4,
      },
    ],
    effectiveTimeList: [
      {
        beginTime: '15:00:00',
        endTime: '17:00:00',
      },
    ],
    extParameterList: [
      {
        parameterType: 1,
        parameterValue: '参数值，都以string存储',
        parameterValue2: '',
      },
    ],
  },
];

export const ruleTemplateMock: RuleTypeTemplate = {
  ruleType: 'Z03101',
  ruleTemplateId: 0,
  optionalMarketList: [
    { marketId: 1, marketName: '上交所' },
    { marketId: 2, marketName: '深交所' },
  ], // 可选的市场列表，有几个，展示几个选项
  optionalWarnLevelList: [
    { label: '拦截', value: RiskLevel.INTERCEPT },
    { label: '预警', value: RiskLevel.WARNING },
  ],
  defaultMarket: [1, 2],
  defaultWarnLevel: [RiskLevel.INTERCEPT, RiskLevel.WARNING],
  warnValueDefaultPercent: 0.9, // 预警值占禁止值比例
  // 市场列表，用户勾选了几个市场，展示市场列表里的几个对象，未勾展示全部的
  marketList: [
    {
      marketId: 1, // 市场
      marketName: '上交所',
      securityGroupList: [
        {
          securityGroupId: 1, // 证券组序号
          securityGroupName: '证券组名称',
          // 这些都是固定值，直接填到模板的参数里即可
          securityControlType: 1, // 证券控制方式
          securitySummaryType: 2, // 证券汇总方式
          securitySummaryCondition: 2, // 证券汇总条件，该字段不一定有
          secuSetIdList: [1], // 证券集合类对象序号列表,按照券池、动态维度、现货限仓表等证券集合类对象控制时有此值，正常只有一个
          secuFilterClassList: ['10', '120201'], // 证券过滤分类列表，按照证券类别、期货期权品种控制时有此值，可能有多个
          // 证券列表，按单券或者指数控制时有此值，可能有多个
          securityList: [
            {
              securityCode: '证券代码',
              marketId: 1, // 市场，这个值和上面的market_id是一致的
            },
          ],
          // 禁止阈值列表
          thresholdList: [
            {
              thresholdId: 42,
              factorType: 15, // 因子类型
              compareDirection: 1, // 比较方向
              defaultValue: 88, // 默认值，填的监管值，新增时或恢复默认值时填写
              unit: 4, // 单位
            },
          ],
          // 生效时段列表，直接填到模板参数里即可
          effectiveTimeList: [
            {
              beginTime: '起始时间，格式：hhmmss',
              endTime: '截止时间，格式：hhmmss',
            },
          ],
          // 存储规则计算的其他必要参数，这些参数目前都是固化的，直接填到模板参数里即可
          extParameterList: [
            {
              parameterType: 1,
              parameterValue: '参数值，都以string存储',
              parameterValue2: '',
            },
          ],
        },
      ],
    },
    {
      marketId: 2, // 市场
      marketName: '深交所',
      securityGroupList: [
        {
          securityGroupId: 1, // 证券组序号
          securityGroupName: '证券组名称',
          // 这些都是固定值，直接填到模板的参数里即可
          securityControlType: 1, // 证券控制方式
          securitySummaryType: 2, // 证券汇总方式
          securitySummaryCondition: 2, // 证券汇总条件，该字段不一定有
          secuSetIdList: [1], // 证券集合类对象序号列表,按照券池、动态维度、现货限仓表等证券集合类对象控制时有此值，正常只有一个
          secuFilterClassList: ['10', '120201'], // 证券过滤分类列表，按照证券类别、期货期权品种控制时有此值，可能有多个
          // 证券列表，按单券或者指数控制时有此值，可能有多个
          securityList: [
            {
              securityCode: '证券代码',
              marketId: 1, // 市场，这个值和上面的market_id是一致的
            },
          ],
          // 禁止阈值列表
          thresholdList: [
            {
              thresholdId: 42,
              factorType: 15, // 因子类型
              compareDirection: 1, // 比较方向
              defaultValue: 88, // 默认值，填的监管值，新增时或恢复默认值时填写
              unit: 4, // 单位
            },
          ],
          // 生效时段列表，直接填到模板参数里即可
          effectiveTimeList: [
            {
              beginTime: '起始时间，格式：hhmmss',
              endTime: '截止时间，格式：hhmmss',
            },
          ],
          // 存储规则计算的其他必要参数，这些参数目前都是固化的，直接填到模板参数里即可
          extParameterList: [
            {
              parameterType: 1,
              parameterValue: '参数值，都以string存储',
              parameterValue2: '',
            },
          ],
        },
      ],
    },
  ],
};
