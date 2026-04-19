interface FunctionItemType {
  /**
   * 功能序号
   */
  functionId: number;
  /**
   * 功能名称
   */
  functionName: string;
  /**
   * 功能描述
   */
  functionDescription: string;
}
export interface MenuItemTypeIDTO {
  /**
   * 菜单编号
   */
  menuId: number;
  /**
   * 菜单名称
   */
  menuName: string;
  /**
   * 上级菜单编号
   */
  parentMenuId?: number;
  /**
   * 菜单地址
   */
  menuUrl: string;
  /**
   * 菜单功能对象
   */
  functionList: FunctionItemType[];
}
