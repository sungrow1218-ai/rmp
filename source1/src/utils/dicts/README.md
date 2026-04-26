# 字典系统使用指南

本目录包含了从 `rmp_ui_test` 项目中迁移过来的所有字典定义，用于交易系统的字段、交易市场等常量数据。

## 文件结构

```
src/utils/dicts/
├── index.ts              # 主入口文件，导出所有字典
├── typing.ts             # 类型工具函数
├── enum.ts               # 枚举类型
├── dict.ts               # 主要字典定义（规则、证券、市场等）
├── dictEntrust.ts        # 委托相关字典
├── dictFutures.ts        # 期货相关字典
├── dictInfo.ts           # 信息相关字典（市场、货币、基金等）
├── dictRiskAlarm.ts      # 风控告警字典
├── offerAccseeDict.ts    # 报盘接入字典
└── README.md             # 本文档
```

## 使用方式

### 1. 导入单个字典文件

```typescript
import { TRADING_MARKETS, SECURITY_CATEGORY_LEVEL_1 } from '@/utils/dicts/dict';
import { ENTRUST_TYPE, ENTRUST_DIRECTION } from '@/utils/dicts/dictEntrust';
```

### 2. 导入所有字典（推荐）

```typescript
import * as Dicts from '@/utils/dicts';

// 使用示例
const markets = Dicts.TRADING_MARKETS;
const entrustTypes = Dicts.ENTRUST_TYPE;
```

### 3. 使用字典工具函数

```typescript
import { transformDictCodeToNameHelper, TRADING_MARKETS } from '@/utils/dicts';

// 根据 code 获取 name
const marketName = transformDictCodeToNameHelper('1', TRADING_MARKETS);
// 返回: '上交所'
```

### 4. 使用类型定义

```typescript
import type { DictFeKeyEnumType, SecurityCategoryItem } from '@/utils/dicts';

// 在组件或函数中使用类型
const category: SecurityCategoryItem = {
  name: '股票',
  code: '10',
  children: [...]
};
```

## 主要字典分类

### 1. 交易市场 (TRADING_MARKETS)
- 包含国内外主要交易所：上交所、深交所、港交所、纽交所等

### 2. 证券类别 (SECURITY_CATEGORY_LEVEL_1/2)
- 一级分类：股票、债券、基金、期货、期权等
- 二级分类：详细的证券类型分类

### 3. 委托相关 (ENTRUST_*)
- 委托类型、委托方向、委托状态、价格类型等

### 4. 规则相关 (RULE_*)
- 规则类型、规则状态、规则关系、检查时点等

### 5. 单位与比较 (UNITS, COMPARE_DIRECTIONS)
- 计量单位：万元、万股、%等
- 比较方向：大于、小于、等于等

### 6. 期货期权 (FUTURES_*)
- 月份控制、合约月份、时间窗口等

### 7. 基金信息 (FUND_*)
- 基金投资分类、发行分类、风险收益类型等

### 8. 货币与结算 (CURRENCY_TYPE, SETTLE_METHOD)
- 货币类型：人民币、美元、欧元等
- 结算方式：钱货两讫、当日无负债等

## 注意事项

1. **类型安全**: 所有字典都使用 `as const` 断言，提供了完整的类型推导
2. **代码一致性**: 字典中的 `code` 字段通常是字符串类型，部分可能是数字
3. **前端键值**: `feKey` 字段用于前端内部使用，与后端 `code` 对应
4. **映射关系**: 部分字典提供了 `__MAP` 后缀的对象，用于快速查找

## 示例代码

```typescript
import * as Dicts from '@/utils/dicts';

// 获取所有交易市场
function getTradingMarkets() {
  return Dicts.TRADING_MARKETS;
}

// 根据 code 获取市场名称
function getMarketName(code: string) {
  return Dicts.transformDictCodeToNameHelper(code, Dicts.TRADING_MARKETS);
}

// 获取证券一级分类
function getSecurityCategories() {
  return Dicts.SECURITY_CATEGORY_LEVEL;
}

// 获取委托方向选项
function getEntrustDirectionOptions() {
  return Dicts.ENTRUST_DIRECTION.map(item => ({
    value: item.code,
    label: item.name
  }));
}
```

## 迁移说明

这些字典文件是从 `rmp_ui_test` 项目迁移而来，已经调整了导入路径以适应新项目的结构。所有字典内容保持原样，确保了与原有系统的兼容性。