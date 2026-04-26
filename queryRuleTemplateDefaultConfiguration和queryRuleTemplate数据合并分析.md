# queryRuleTemplateDefaultConfiguration 和 queryRuleTemplate 数据合并分析

## 1. 接口概述

### 1.1 queryRuleTemplateDefaultConfiguration

- **功能**: 获取规则模板的默认配置
- **返回数据**: 包含 `configuration` JSON 字符串的规则模板默认配置
- **数据结构**: `RuleTemplateDefaultIDTO`

### 1.2 queryRuleTemplate

- **功能**: 查询已有的规则模板配置
- **返回数据**: 规则模板列表，包含已配置的规则模板信息
- **数据结构**: `RuleTemplateIDTO`

## 2. 数据合并流程

### 2.1 整体流程

```
1. 调用 queryRuleTemplateDefaultConfiguration 获取默认配置
2. 调用 queryRuleTemplate 获取已有配置
3. 对每个规则类型，合并默认配置和已有配置
4. 使用 mergeDefaultParamAndValue 函数进行合并
5. 将合并后的数据存储到 ruleTemplateMap 中
```

### 2.2 具体实现代码

```typescript
// 1. 获取默认配置
const defaultRes = await queryRuleTemplateDefaultConfiguration(
  getRuleTypes.map((i) => i.Id)
);

// 2. 获取已有配置
let templateRes;
if (groupInfo) {
  templateRes = await queryRuleTemplate({
    pageId: 1,
    pageSize: 1000,
    authorityFlag: 0,
    filterCondition: [{ ruleTmplGroupId: groupInfo.ruleTmplGroupId }],
  });
}

// 3. 合并数据
const result: { [key: string]: RuleTypeTemplate } = {};
for (const item of defaultRes.data.resultList || []) {
  try {
    const templateData =
      templateRes?.data.resultList.find((i) => i.ruleType === item.ruleType) ||
      ({} as RuleTemplateIDTO);

    const defaultData = JSON.parse(
      item.configuration
    ) as RuleTemplateDefaultIDTO;

    result[item.ruleType] = mergeDefaultParamAndValue(
      defaultData,
      templateData
    );
  } catch (error) {
    continue;
  }
}
```

## 3. 数据结构对比

### 3.1 RuleTemplateDefaultIDTO (默认配置)

```typescript
interface RuleTemplateDefaultIDTO {
  rule_type: string; // 规则类型
  optional_market_list: number[]; // 可选市场列表
  warn_value_percent: number; // 预警值百分比
  market_list: MarketItem[]; // 市场列表

  // MarketItem 结构
  market_id: number; // 市场ID
  security_group_list: SecurityGroupItem[]; // 证券组列表

  // SecurityGroupItem 结构
  security_group_id: number; // 证券组ID
  security_group_name: string; // 证券组名称
  security_range: {
    // 安全范围
    security_control_type: number; // 安全控制类型
    security_summary_type: number; // 安全汇总类型
    security_summary_condition: number; // 安全汇总条件
    secu_set_id_list: number[]; // 证券集ID列表
    secu_filter_class_list: string[]; // 证券过滤分类列表
    security_list?: {
      // 证券列表
      security_code: string;
      market_id: number;
    }[];
  };
  forbid_threshold_list: {
    // 禁止阈值列表
    factor_type: number; // 因子类型
    compare_direction: number; // 比较方向
    default_value: number; // 默认值
    unit: number; // 单位
  }[];
  effective_time_list: {
    // 有效时间列表
    begin_time: string;
    end_time: string;
  }[];
  ext_parameter_list: {
    // 扩展参数列表
    parameter_type: number;
    parameter_value: string;
  }[];
}
```

### 3.2 RuleTemplateIDTO (已有配置)

```typescript
interface RuleTemplateIDTO {
  ruleType: string; // 规则类型
  ruleTemplateId: number; // 规则模板ID
  securityGroupList: SecurityGroupList[]; // 证券组列表

  // SecurityGroupList 结构
  securityGroupId: number; // 证券组ID
  securityGroupName: string; // 证券组名称
  securityControlType: number; // 安全控制类型
  securitySummaryType: number; // 安全汇总类型
  securitySummaryCondition: number; // 安全汇总条件
  secuSetIdList: number[]; // 证券集ID列表
  secuFilterClassList: string[]; // 证券过滤分类列表
  securityList: {
    // 证券列表
    securityCode: string;
    marketId: number;
  }[];
  thresholdList: {
    // 阈值列表
    thresholdId?: number; // 阈值ID
    warnLevel: number; // 预警级别
    compareDirection: number; // 比较方向
    value?: number; // 值
    unit: number; // 单位
    factorType?: number; // 因子类型
    setType?: number; // 设置类型
  }[];
  effectiveTimeList?: {
    // 有效时间列表
    beginTime: string;
    endTime: string;
  }[];
  extraParameterList?: {
    // 扩展参数列表
    parameterType: number;
    parameterValue: string;
    parameterValue2?: string;
  }[];
}
```

## 4. mergeDefaultParamAndValue 函数详细分析

### 4.1 函数签名

```typescript
export const mergeDefaultParamAndValue = (
  defaultParams: RuleTemplateDefaultIDTO,  // 默认配置
  values: RuleTemplateIDTO | undefined     // 已有配置（可能为空）
): RuleTypeTemplate => { ... }
```

### 4.2 合并策略

#### 4.2.1 基本字段合并

```typescript
// 规则类型：使用默认配置的 rule_type
ruleType: defaultParams.rule_type,

// 规则模板ID：如果有已有配置则使用，否则为0
ruleTemplateId: values ? values.ruleTemplateId : 0,

// 可选市场列表：从默认配置转换
optionalMarketList: defaultParams.optional_market_list.map((i) => ({
  marketId: i,
  marketName: transformDictCodeToNameHelper(`${i}`, TRADING_MARKETS),
})),

// 默认市场：如果有已有配置则使用第一个证券组的marketId，否则使用默认的可选市场列表
defaultMarket: values
  ? values.securityGroupList[0].marketId
  : defaultParams.optional_market_list,
```

#### 4.2.2 安全组数据合并

```typescript
securityGroupList: m.security_group_list.map((s) => {
  // 1. 查找对应的已有配置
  const sValue = values
    ? values.securityGroupList.find(
        (i) => i.securityGroupId === s.security_group_id
      )
    : undefined;

  return {
    // 2. 基本字段：使用默认配置
    securityGroupId: s.security_group_id,
    securityGroupName: s.security_group_name,

    // 3. 安全相关字段：优先使用已有配置，否则使用默认值
    securityControlType: sValue
      ? sValue.securityControlType
      : s.security_range.security_control_type,
    securitySummaryType: sValue
      ? sValue.securitySummaryType
      : s.security_range.security_summary_type,
    securitySummaryCondition: sValue
      ? sValue.securitySummaryCondition
      : s.security_range.security_summary_condition,
    secuSetIdList: sValue
      ? sValue.secuSetIdList
      : s.security_range.secu_set_id_list,
    secuFilterClassList: sValue
      ? sValue.secuFilterClassList
      : s.security_range.secu_filter_class_list,

    // 4. 证券列表：优先使用已有配置，否则转换默认配置
    securityList: sValue
      ? sValue.securityList
      : s.security_range.security_list?.map((i) => ({
          securityCode: i.security_code,
          marketId: i.market_id,
        })),

    // 5. 阈值列表：特殊处理（见下文详细分析）
    thresholdList: s.forbid_threshold_list.map((i) => {
      const tValue = sValue?.thresholdList.find(
        (t) =>
          t.factorType === i.factor_type &&
          t.warnLevel === RiskLevel.INTERCEPT
      );
      return {
        thresholdId: tValue ? tValue.thresholdId : undefined,
        warnLevel: tValue ? tValue.warnLevel : undefined,
        compareDirection: tValue
          ? tValue.compareDirection
          : i.compare_direction,
        value: tValue ? tValue.value : undefined,
        setType: tValue ? tValue.setType : SetType.DEFAULT,
        factorType: tValue ? tValue.factorType : i.factor_type,
        defaultValue: i.default_value,
        unit: tValue ? tValue.unit : i.unit,
      };
    }),

    // 6. 其他字段：优先使用已有配置，否则转换默认配置
    effectiveTimeList: sValue
      ? sValue.effectiveTimeList
      : s.effective_time_list.map((i) => ({
          beginTime: i.begin_time,
          endTime: i.end_time,
        })),
    extParameterList: sValue
      ? sValue.excludeSecurityList
      : s.ext_parameter_list.map((i) => ({
          parameterType: i.parameter_type,
          parameterValue: i.parameter_value,
        })),
  } as SecurityGroup;
}),
```

### 4.3 阈值合并的特殊处理

#### 4.3.1 默认配置的阈值结构

```typescript
// 默认配置：每个因子只有一个默认值
forbid_threshold_list: {
  factor_type: number; // 因子类型
  compare_direction: number; // 比较方向
  default_value: number; // 默认值
  unit: number; // 单位
}
[];
```

#### 4.3.2 已有配置的阈值结构

```typescript
// 已有配置：每个因子可能有多个预警级别
thresholdList: {
  thresholdId?: number;     // 阈值ID
  warnLevel: number;        // 预警级别（1:预警, 2:拦截）
  compareDirection: number; // 比较方向
  value?: number;          // 值
  unit: number;            // 单位
  factorType?: number;     // 因子类型
  setType?: number;        // 设置类型
}[]
```

#### 4.3.3 合并逻辑

1. **查找已有配置**：根据 `factor_type` 和 `warnLevel === RiskLevel.INTERCEPT` 查找对应的阈值
2. **字段合并策略**：
   - `thresholdId`: 使用已有配置的阈值 ID
   - `warnLevel`: 使用已有配置的预警级别
   - `compareDirection`: 优先使用已有配置，否则使用默认值
   - `value`: 使用已有配置的值（如果存在）
   - `setType`: 使用已有配置的设置类型，默认为 `SetType.DEFAULT`
   - `factorType`: 优先使用已有配置，否则使用默认值
   - `defaultValue`: 始终使用默认配置的 `default_value`
   - `unit`: 优先使用已有配置，否则使用默认值

### 4.4 预警级别合并

```typescript
// 设置警告级别
if (values && values.securityGroupList.length > 0) {
  const warnLevel: RiskLevel[] = [];
  const securityGroup = values.securityGroupList[0];

  // 预警级别（RiskLevel.WARNING = 1）
  if (
    securityGroup.thresholdList &&
    securityGroup.thresholdList.some((i) => i.warnLevel === RiskLevel.WARNING)
  ) {
    warnLevel.push(RiskLevel.WARNING);
  }

  // 拦截级别（RiskLevel.INTERCEPT = 2）
  if (
    securityGroup.thresholdList &&
    securityGroup.thresholdList.some(
      (i) =>
        i.warnLevel === RiskLevel.INTERCEPT &&
        i.effectiveFlag === EffectiveFlag.ON
    )
  ) {
    warnLevel.push(RiskLevel.INTERCEPT);
  }

  ruleTypeTemplate.defaultWarnLevel = warnLevel;
}
```

### 4.5 预警值百分比合并

```typescript
warnValueDefaultPercent:
  values?.securityGroupList[0].extraParameterList?.find(
    (e) => e.parameterType === 19996
  )?.parameterValue2
    ? Number(
        values?.securityGroupList[0].extraParameterList?.find(
          (e) => e.parameterType === 19996
        )?.parameterValue2
      )
    : defaultParams.warn_value_percent,
```

## 5. 数据转换示例

### 5.1 默认配置示例

```json
{
  "rule_type": "Z03101",
  "optional_market_list": [1, 2],
  "warn_value_percent": 0.9,
  "market_list": [
    {
      "market_id": 1,
      "security_group_list": [
        {
          "security_group_id": 1,
          "security_group_name": "证券组1",
          "security_range": {
            "security_control_type": 1,
            "security_summary_type": 2,
            "security_summary_condition": 2,
            "secu_set_id_list": [1],
            "secu_filter_class_list": ["10", "120201"]
          },
          "forbid_threshold_list": [
            {
              "factor_type": 15,
              "compare_direction": 1,
              "default_value": 88,
              "unit": 4
            }
          ]
        }
      ]
    }
  ]
}
```

### 5.2 已有配置示例

```json
{
  "ruleType": "Z03101",
  "ruleTemplateId": 123,
  "securityGroupList": [
    {
      "securityGroupId": 1,
      "securityGroupName": "证券组1",
      "securityControlType": 1,
      "securitySummaryType": 2,
      "securitySummaryCondition": 2,
      "secuSetIdList": [1],
      "secuFilterClassList": ["10", "120201"],
      "thresholdList": [
        {
          "thresholdId": 456,
          "warnLevel": 2,
          "compareDirection": 1,
          "value": 90,
          "unit": 4,
          "factorType": 15,
          "setType": 1
        }
      ]
    }
  ]
}
```

### 5.3 合并后结果

```typescript
{
  ruleType: "Z03101",
  ruleTemplateId: 123,
  optionalMarketList: [
    { marketId: 1, marketName: "上海" },
    { marketId: 2, marketName: "深圳" }
  ],
  defaultMarket: [1],  // 使用已有配置的第一个marketId
  optionalWarnLevelList: [
    { label: "拦截", value: 2 },
    { label: "预警", value: 1 }
  ],
  defaultWarnLevel: [2],  // 只有拦截级别
  warnValueDefaultPercent: 0.9,
  marketList: [{
    marketId: 1,
    marketName: "上海",
    securityGroupList: [{
      securityGroupId: 1,
      securityGroupName: "证券组1",
      securityControlType: 1,      // 使用已有配置
      securitySummaryType: 2,      // 使用已有配置
      securitySummaryCondition: 2, // 使用已有配置
      secuSetIdList: [1],          // 使用已有配置
      secuFilterClassList: ["10", "120201"], // 使用已有配置
      thresholdList: [{
        thresholdId: 456,          // 使用已有配置
        warnLevel: 2,              // 使用已有配置
        compareDirection: 1,       // 使用已有配置
        value: 90,                 // 使用已有配置
        setType: 1,                // 使用已有配置
        factorType: 15,            // 使用已有配置
        defaultValue: 88,          // 使用默认配置
        unit: 4                    // 使用已有配置
      }]
    }]
  }]
}
```

## 6. 关键合并规则总结

### 6.1 优先使用已有配置的字段

- `ruleTemplateId`
- `securityControlType`
- `securitySummaryType`
- `securitySummaryCondition`
- `secuSetIdList`
- `secuFilterClassList`
- `securityList`
- `thresholdList` 中的各个字段（除 `defaultValue` 外）
- `effectiveTimeList`
- `extParameterList`

### 6.2 始终使用默认配置的字段

- `rule_type`（转换为 `ruleType`）
- `optional_market_list`（转换为 `optionalMarketList`）
- `warn_value_percent`（转换为 `warnValueDefaultPercent`）
- `forbid_threshold_list` 中的 `default_value`（转换为 `defaultValue`）

### 6.3 条件性使用的字段

- `defaultMarket`: 如果有已有配置则使用第一个证券组的 `marketId`，否则使用默认的 `optional_market_list`
- `defaultWarnLevel`: 根据已有配置的 `thresholdList` 动态计算
- `warnValueDefaultPercent`: 优先使用已有配置的 `extraParameterList` 中 `parameterType === 19996` 的 `parameterValue2`，否则使用默认值

## 7. 数据流图

```
queryRuleTemplateDefaultConfiguration
        ↓
[ { configuration: "JSON字符串", ruleType: "Z03101" }, ... ]
        ↓
JSON.parse() → RuleTemplateDefaultIDTO
        ↓
        ┌─────────────────────┐
        │ mergeDefaultParamAndValue │
        └─────────────────────┘
        ↓           ↑
RuleTypeTemplate ← RuleTemplateIDTO
        ↓           ↑
        └───── queryRuleTemplate
```

## 8. 注意事项

1. **数据完整性**: 如果已有配置为空，则全部使用默认配置
2. **错误处理**: 使用 `try-catch` 包装 `JSON.parse()`，解析失败时跳过该规则类型
3. **字段映射**: 注意后端字段命名风格（snake_case）到前端字段命名风格（camelCase）的转换
4. **阈值处理**: 默认配置只包含拦截级别的阈值，已有配置可能包含多个预警级别
5. **市场选择**: 默认市场从已有配置的第一个证券组的 `marketId` 获取，如果没有已有配置则使用所有可选市场

## 9. 扩展性考虑

1. **支持更多预警级别**: 当前系统支持两级（预警和拦截），数据结构支持扩展
2. **动态模板**: 模板系统支持通过修改 `formTemplate` 来改变页面显示
3. **字段扩展**: 合并函数可以轻松扩展以支持新的字段
