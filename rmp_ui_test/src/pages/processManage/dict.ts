export const PROCEDURE_TYPE = [
  { code: '101', name: '规则变更', feKey: '1' },
  { code: '102', name: '规则变更', feKey: '1' },
  { code: '201', name: '券池变更', feKey: '2' },
  { code: '202', name: '券池变更', feKey: '2' },
  { code: '203', name: '券池变更', feKey: '2' },
  // { code: '101', name: '规则变更', feKey: '1' },
  // { code: '101', name: '规则变更', feKey: '1' },
  // { code: '101', name: '规则变更', feKey: '1' },
  // { code: '101', name: '规则变更', feKey: '1' },
] as const;
export const PROCEDURE_TYPE_MODE = [
  { code: '1', name: '规则变更', feKey: '1' },
  { code: '2', name: '券池变更', feKey: '2' },
] as const;

export const CHANGE_MODULE = [
  { code: '101', name: '规则变更', feKey: '101' },
  { code: '102', name: '规则启用', feKey: '102' },
  { code: '201', name: '券池层级', feKey: '201' },
  { code: '202', name: '删除券池', feKey: '202' },
  { code: '203', name: '券池明细', feKey: '203' },
  // { code: '101', name: '规则变更', feKey: '1' },
  // { code: '101', name: '规则变更', feKey: '1' },
  // { code: '101', name: '规则变更', feKey: '1' },
  // { code: '101', name: '规则变更', feKey: '1' },
] as const;

/**
 * 流程状态
 */
export const PROCEDURE_STATUS = [
  { code: '0', name: '已创建', feKey: 'KEY_1' },
  { code: '1', name: '处理中', feKey: 'KEY_2' },
  { code: '2', name: '已办结', feKey: 'KEY_3' },
  { code: '3', name: '已撤销', feKey: 'KEY_4' },
] as const;
