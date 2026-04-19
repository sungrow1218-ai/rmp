type Fn<T = any, R = T> = (...arg: T[]) => R;

declare type Nullable<T> = T | null;

declare type Recordable<T = any> = Record<string, T>;

declare type TargetContext = '_self' | '_blank';

declare type NullableProperties<T> = { [K in keyof T]: T[K] | null };

declare type InferArray<T> = T extends (infer S)[] ? S : never;

// 递归地将所有嵌套属性变为可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
