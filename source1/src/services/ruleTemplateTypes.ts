// 规则模板相关类型定义
// 参考rmp_ui_test项目实现

// 通用类型定义
type Recordable<T = any> = Record<string, T>;

// 规则模板默认配置接口类型
export interface RuleTemplateDefaultIDTO {
  rule_type: string;                    // 规则类型代码，如 "Z01101"
  optional_market_list: number[];       // 可选市场列表，如 [1, 2]
  warn_value_percent: number;           // 预警值占禁止值比例，如 0.9
  market_list: {                        // 市场配置列表
    market_id: number;                  // 市场ID，如 1(上交所), 2(深交所)
    security_group_list: {              // 证券组列表
      security_group_id: number;        // 证券组ID
      security_group_name: string;      // 证券组名称
      security_range: {                 // 证券范围配置
        security_control_type: number;  // 证券控制方式
        security_summary_type: number;  // 证券汇总方式
        security_summary_condition: number; // 证券汇总条件
        secu_set_id_list: number[];     // 证券集合ID列表
        secu_filter_class_list: string[]; // 证券过滤分类列表
        security_list?: {               // 证券列表（可选）
          security_code: string;
          market_id: number;
        }[];
      };
      forbid_threshold_list: {          // 禁止阈值列表
        factor_type: number;            // 因子类型，对应模板中的$参数
        compare_direction: number;      // 比较方向
        default_value: number;          // 默认值（监管值）
        unit: number;                   // 单位
      }[];
      effective_time_list: {            // 生效时段列表
        begin_time: string;             // 开始时间，格式：hhmmss
        end_time: string;               // 结束时间，格式：hhmmss
      }[];
      ext_parameter_list: {             // 扩展参数列表
        parameter_type: number;         // 参数类型
        parameter_value: string;        // 参数值
      }[];
    }[];
  }[];
}

// 规则模板接口类型
export interface RuleTemplateIDTO {
  ruleTemplateId: number;
  ruleType: string;
  securityGroupList: {
    marketId: number[];  // 修复：改为数组类型
    securityGroupId: number;
    securityGroupName: string;  // 添加缺失的字段
    securityControlType: number;
    securitySummaryType: number;
    securitySummaryCondition: number | null;
    secuSetIdList: number[];
    secuFilterClassList: string[] | null;
    securityList?: {
      securityCode: string;
      marketId: number;
    }[];
    thresholdList: {
      thresholdId?: number;
      warnLevel?: number;
      compareDirection: number;
      value?: number;
      setType: number | null;
      factorType: number;
      defaultValue?: number;  // 改为可选
      unit: number;
      effectiveFlag?: number | null;
    }[];
    effectiveTimeList: {
      beginTime: string;
      endTime: string;
    }[];
    extraParameterList?: any[] | null;  // 根据实际数据调整
    excludeSecurityList?: {
      parameterType: number;
      parameterValue: string;
    }[];
  }[];
}

// 前端使用的规则类型模板
export interface RuleTypeTemplate {
  ruleType: string;
  ruleTemplateId: number;
  optionalMarketList: {
    marketId: number;
    marketName: string;
  }[];
  defaultMarket: number[];
  optionalWarnLevelList: {
    label: string;
    value: number;
  }[];
  defaultWarnLevel: number[];
  warnValueDefaultPercent?: number;
  marketList: {
    marketId: number;
    marketName: string;
    securityGroupList: SecurityGroup[];
  }[];
}

// 证券组类型
export interface SecurityGroup {
  securityGroupId: number;
  securityGroupName: string;
  securityControlType: number;
  securitySummaryType: number;
  securitySummaryCondition: number;
  secuSetIdList: number[];
  secuFilterClassList: string[];
  securityList?: {
    securityCode: string;
    marketId: number;
  }[];
  thresholdList: ThresholdItem[];
  effectiveTimeList: {
    beginTime: string;
    endTime: string;
  }[];
  extParameterList: {
    parameterType: number;
    parameterValue: string;
  }[];
}

// 阈值项类型
export interface ThresholdItem {
  thresholdId?: number;
  warnLevel?: number;
  compareDirection: number;
  value?: number | Recordable<number>; // 支持单值和三级阈值对象
  setType: number;
  factorType: number;
  defaultValue: number | Recordable<number>; // 支持单值和三级阈值对象
  unit: number;
}

// 风控级别枚举
export enum RiskLevel {
  INTERCEPT = 2,  // 拦截（三级）
  WARNING = 1,    // 预警（二级）
  NOTIP = 3,      // 不提示（一级）
}

// 设置类型枚举
export enum SetType {
  DEFAULT = 0,    // 默认
  CUSTOM = 1,     // 自定义
}

// 生效标志枚举
export enum EffectiveFlag {
  OFF = 0,        // 关闭
  ON = 1,         // 开启
}

// 交易市场字典
export const TRADING_MARKETS = [
  { code: '1', name: '上交所', feKey: 'KEY_1' },
  { code: '2', name: '深交所', feKey: 'KEY_2' },
  { code: '3', name: '上期所', feKey: 'KEY_3' },
  { code: '4', name: '大商所', feKey: 'KEY_4' },
  { code: '5', name: '郑商所', feKey: 'KEY_5' },
  { code: '6', name: '中金所', feKey: 'KEY_6' },
  { code: '7', name: '能源中心', feKey: 'KEY_7' },
  { code: '8', name: '广期所', feKey: 'KEY_8' },
] as const;

// 字典转换辅助函数
export const transformDictCodeToNameHelper = (
  code: string | number,
  dict: readonly { code: string | number; name: string }[]
) => {
  return dict.find((item) => item.code === code)?.name || '';
};

export const mergeDefaultParamAndValue = (
  defaultParams: RuleTemplateDefaultIDTO,
  values: RuleTemplateIDTO | null
): RuleTypeTemplate => {
  // 提取公共逻辑：获取风险级别列表
  const getRiskLevelsFromGroups = (groups: any[]) => {
    const levels = new Set<RiskLevel>();
    groups.forEach((g) => {
      g.thresholdList?.forEach((t: any) => {
        if (t.warnLevel) levels.add(t.warnLevel);
      });
    });
    return Array.from(levels);
  };

  // 如果有已有配置数据，则以已有配置数据为准构建市场和证券组结构
  if (values && values.securityGroupList && values.securityGroupList.length > 0) {
    const savedGroups = values.securityGroupList;

    // 1. 获取所有涉及到的市场 ID
    const marketIds = Array.from(
      new Set(savedGroups.flatMap((sg) => sg.marketId || []))
    );

    // 2. 构建可选市场列表
    const optionalMarketList = marketIds.map((id) => ({
      marketId: id,
      marketName: transformDictCodeToNameHelper(`${id}`, TRADING_MARKETS),
    }));

    // 3. 构建风险级别列表
    const levels = getRiskLevelsFromGroups(savedGroups);
    const optionalWarnLevelList = levels
      .map((l) => ({
        label:
          l === RiskLevel.INTERCEPT
            ? '拦截'
            : l === RiskLevel.WARNING
            ? '预警'
            : '不提示',
        value: l,
      }))
      .sort((a, b) => b.value - a.value); // 拦截(2) > 预警(1)

    // 4. 构建市场列表数据
    const marketList = marketIds.map((marketId) => {
      // 找出属于该市场的所有证券组
      const groupsInMarket = savedGroups.filter(
        (sg) => sg.marketId && sg.marketId.includes(marketId)
      );

      return {
        marketId: marketId,
        marketName: transformDictCodeToNameHelper(`${marketId}`, TRADING_MARKETS),
        securityGroupList: groupsInMarket.map((sg) => {
          // 获取 Schema (来自默认配置中对应市场的第一个组)
          const defaultMarket = defaultParams.market_list.find(
            (m) => m.market_id === marketId
          );
          const schemaThresholdList =
            defaultMarket?.security_group_list[0]?.forbid_threshold_list || [];
          const schemaExtParams =
            defaultMarket?.security_group_list[0]?.ext_parameter_list || [];
          const schemaEffectiveTime =
            defaultMarket?.security_group_list[0]?.effective_time_list || [];

          return {
            securityGroupId: sg.securityGroupId,
            securityGroupName: sg.securityGroupName,
            securityControlType: sg.securityControlType,
            securitySummaryType: sg.securitySummaryType,
            securitySummaryCondition: sg.securitySummaryCondition,
            secuSetIdList: sg.secuSetIdList,
            secuFilterClassList: sg.secuFilterClassList,
            securityList: sg.securityList,
            thresholdList: schemaThresholdList.map((schemaItem) => {
              // 匹配因子
              const allValues = sg.thresholdList.filter(
                (t) => t.factorType === schemaItem.factor_type
              );

              const lowValue = allValues.find(
                (t) => t.warnLevel === RiskLevel.NOTIP
              );
              const middleValue = allValues.find(
                (t) => t.warnLevel === RiskLevel.WARNING
              );
              const highValue = allValues.find(
                (t) => t.warnLevel === RiskLevel.INTERCEPT
              );

              let valueObj: any = undefined;
              if (lowValue || middleValue || highValue) {
                valueObj = {};
                if (lowValue) valueObj[RiskLevel.NOTIP] = lowValue.value;
                if (middleValue) valueObj[RiskLevel.WARNING] = middleValue.value;
                if (highValue) valueObj[RiskLevel.INTERCEPT] = highValue.value;
              }

              const defaultValue = schemaItem.default_value;
              const finalValue =
                valueObj !== undefined ? valueObj : defaultValue;
              const finalWarnLevel =
                typeof finalValue === 'number' ? RiskLevel.INTERCEPT : undefined;

              return {
                thresholdId:
                  highValue?.thresholdId ||
                  middleValue?.thresholdId ||
                  lowValue?.thresholdId,
                warnLevel: finalWarnLevel,
                compareDirection:
                  highValue?.compareDirection ||
                  middleValue?.compareDirection ||
                  lowValue?.compareDirection ||
                  schemaItem.compare_direction,
                value: finalValue,
                defaultValue: defaultValue,
                factorType: schemaItem.factor_type,
                unit:
                  highValue?.unit ||
                  middleValue?.unit ||
                  lowValue?.unit ||
                  schemaItem.unit,
                setType:
                  highValue?.setType ||
                  middleValue?.setType ||
                  lowValue?.setType ||
                  (valueObj ? SetType.CUSTOM : SetType.DEFAULT),
              };
            }),
            effectiveTimeList:
              sg.effectiveTimeList ||
              schemaEffectiveTime.map((i) => ({
                beginTime: i.begin_time,
                endTime: i.end_time,
              })),
            extParameterList:
              sg.extraParameterList ||
              schemaExtParams.map((i) => ({
                parameterType: i.parameter_type,
                parameterValue: i.parameter_value,
              })),
          } as SecurityGroup;
        }),
      };
    });

    return {
      ruleType: defaultParams.rule_type,
      ruleTemplateId: values.ruleTemplateId,
      optionalMarketList,
      defaultMarket: marketIds,
      optionalWarnLevelList,
      defaultWarnLevel: levels,
      warnValueDefaultPercent:
        Number(
          savedGroups[0]?.extraParameterList?.find(
            (e) => e.parameterType === 19996
          )?.parameterValue2
        ) || defaultParams.warn_value_percent,
      marketList,
    };
  }

  // 如果没有已有配置，则使用默认配置构建（创建模式）
  return {
    ruleType: defaultParams.rule_type,
    ruleTemplateId: 0,
    optionalMarketList: defaultParams.optional_market_list.map((i) => ({
      marketId: i,
      marketName: transformDictCodeToNameHelper(`${i}`, TRADING_MARKETS),
    })),
    defaultMarket: defaultParams.optional_market_list,
    optionalWarnLevelList: [
      { label: '拦截', value: RiskLevel.INTERCEPT },
      { label: '预警', value: RiskLevel.WARNING },
    ],
    defaultWarnLevel: [RiskLevel.INTERCEPT, RiskLevel.WARNING],
    warnValueDefaultPercent: defaultParams.warn_value_percent,
    marketList: defaultParams.market_list.map((m) => ({
      marketId: m.market_id,
      marketName: transformDictCodeToNameHelper(`${m.market_id}`, TRADING_MARKETS),
      securityGroupList: m.security_group_list.map((s) => ({
        securityGroupId: s.security_group_id,
        securityGroupName: s.security_group_name,
        securityControlType: s.security_range.security_control_type,
        securitySummaryType: s.security_range.security_summary_type,
        securitySummaryCondition: s.security_range.security_summary_condition,
        secuSetIdList: s.security_range.secu_set_id_list,
        secuFilterClassList: s.security_range.secu_filter_class_list,
        securityList: s.security_range.security_list?.map((i) => ({
          securityCode: i.security_code,
          marketId: i.market_id,
        })),
        thresholdList: s.forbid_threshold_list.map((i) => ({
          thresholdId: undefined,
          warnLevel: RiskLevel.INTERCEPT,
          compareDirection: i.compare_direction,
          value: i.default_value,
          defaultValue: i.default_value,
          factorType: i.factor_type,
          unit: i.unit,
          setType: SetType.DEFAULT,
        })),
        effectiveTimeList: s.effective_time_list.map((i) => ({
          beginTime: i.begin_time,
          endTime: i.end_time,
        })),
        extParameterList: s.ext_parameter_list.map((i) => ({
          parameterType: i.parameter_type,
          parameterValue: i.parameter_value,
        })),
      })),
    })),
  };
};