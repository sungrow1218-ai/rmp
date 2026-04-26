/**
 * 字典数据结构生成类型的工具函数
 * 将如下结构:
 *   [
 *    {[key]: value1},
 *    {[key]: value2}
 *   ]
 * 转换为联合类型结构: value1 | value2
 */
export type ValueTypeAtKey<
  T extends readonly { [key: string]: any }[],
  K extends keyof T[number]
> = T[number][K];