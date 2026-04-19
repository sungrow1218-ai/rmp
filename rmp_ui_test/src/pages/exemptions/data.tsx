export enum Mode {
  ADD = 'ADD',
  EDIT = 'EDIT',
}

export enum AlterType {
  ADD = 1,
  EDIT = 2,
  DELETE = 3,
}

// 映射关系
export const ModeToAlterType = {
  [Mode.ADD]: AlterType.ADD,
  [Mode.EDIT]: AlterType.EDIT,
};
