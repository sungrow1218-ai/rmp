import { BookTypeEnum } from '@/pages/ruleSetting/components/RuleDimensionControl/component/ControlAcctTypeSelect';

export interface LeftContainProps {
  changeTabs: (key: string) => void;
}
export interface RolePermissonProps {
  [key: string]: any;
}
export interface EditApiModalProps {
  onConfirm: (key?: any) => void | Promise<any>;
  apiServe?: (data?: any) => Promise<any>;
  initialValues?: {};
  requsetParams?: {};
  formItems?: any[];
  [key: string]: any;
}
export interface FunctionAuthorityParams {
  queryRoleId: number;
  menuId: number;
}
export interface RoleFunctionAuthorityResType {
  roleId: number;
  menuAuthList: MenuAuthListParamType[];
}
export interface MenuAuthListParamType {
  menuId: number;
  useAuth: number;
  empowerAuth: number;
  menuName?: string;
  functionAuthList: FunAuthListType[];
}
export interface FunAuthListType {
  functionId: number | null;
  functionName?: string;
  functionDescrip?: string;
  useAuth: number | null;
  workGroupId?: number | null;
}
export interface FunRightsTableDataType extends MenuAuthListParamType {
  [key: string]: any;
  key: string;
  children?: any[];
  menuName?: string;
  parentMenuId?: number;
}
export interface MenuInfoResType {
  menuName: string;
  parentMenuId: number;
  menuId: number;
  menuUrl?: string;
  functionList?: {
    functionId: number;
    functionName: string;
    functionDescrip: string;
  }[];
}
export interface WorkGroupType {
  workGroupId: number;
  workGroupName?: string;
  functionList?: MenuInfoResParamType[];
}
export type MenuInfoResParamType = {
  functionId: number;
  functionName: string;
  functionDescrip: string;
};
export interface workFunState {
  workGroupId: number;
  workGroupName?: string;
  functionId: number;
  functionName: string;
  functionDescrip?: string;
}
export interface AccountPermissionsDataParam
  extends AccountPermissionsReqParam {
  extSysName?: string;
  acctName?: string;
}
export interface AccountPermissionsReqParam {
  acctCode: string;
  bookLevel: number;
  extSysId: number;
  queryAuth?: number;
  operateAuth?: number;
}
export interface AccountPermtTableDataProps
  extends AccountPermissionsDataParam {
  children?: any[];
  key: string;
  [key: string]: any;
}
export interface FunPermissionProps {
  tabKey: string;
  searchVal: string | undefined;
  reload: () => void;
}

export interface RoleBaseInfoResState {
  // 角色序号
  roleId: number;
  // 角色名称
  roleName: string;
  // 角色描述
  roleDescrip: string;
  // 角色状态- 生效状态，删除角色
  roleStatus: number;
  // 创建用户编号
  createUserNo: string;
  // 更新用户编号
  updateUserNo: string;
  // 创建日期时间
  createDateTime: string;
  // 最近刷新时间
  lastUpdatTime: string;
}
export interface SpecDatAuthListProps {
  // 数据类型
  dataType: number;
  // 跨角色查询权限
  crossRoleQueryAuth: number;
  // 数据创建角色序号
  dataRoleId: number;
}
export interface RiskDataAuthListState {
  // 数据类型
  dataType: number;
  // 数据实例序号
  dataInstId: number;
  // 查询权限
  queryAuth: number;
  // 明细查询权限
  detailQueryAuth: number;
  // 操作权限
  operateAuth: number;
}
export interface RoleUsersState {
  // 角色序号
  roleId?: number;
  // 角色名称
  roleName: string;
  // 用户编码
  userCode: string;
  // 最近刷新时间
  lastUpdateTime?: string;
}
type Recordable<T = any> = Record<string, T>;
// 可以放在文件顶部或某个合适的类型定义文件中
export interface GroupedUserData extends Recordable {
  userCode: string;
  roles: string; // 合并后的角色名字符串
  key: string; // 用于 React 列表渲染的唯一键
  // 如果需要保留原始数据的引用，可以添加一个字段
  // originalRecords?: RoleUsersState[];
}
export interface UserListTableDataProps {
  key: string;
  children: RoleUsersState[];
  roleId: number;

  // 用户编码
  userCode: string;
}
export interface AlterCommonParams {
  // 操作类型
  alterType: number;
  // 设置角色序号 新增传0
  alterRoleId: number;
}
export interface AlterRoleBaseInfoParams extends AlterCommonParams {
  // 设置角色名称-新增必填
  roleName?: string;
  // 设置角色描述
  roleDescrip?: string;
}

export interface AllAuthorityDataProps {
  roleId: number;
  menuAuthList: MenuAuthListParamType[];
  acctAuthList: {
    extSysId: number;
    extSysName: string;
    bookLevel: number;
    bookType: BookTypeEnum;
    acctCode: string;
    acctName: string;
    marketId: number;
    auth: number;
  }[];
  specDataAuthList: SpecDatAuthListProps[];
  riskDataAuthList: RiskDataAuthListState[];
  workGroupAuthList: WorkGroupAuthList[];
}
export interface WorkGroupAuthList {
  workGroupId: number;
  workGroupName: string;
}

export interface AccountAuthorityDataProps {
  roleId: number;
  acctAuthList: {
    extSysId: number;
    extSysName: string;
    bookLevel: number;
    bookType: BookTypeEnum;
    acctCode: string;
    marketId: number;
  }[];
}

export interface TransformUserParams {
  dataIndex: string;
}
export interface RoleUserListType {
  alterRoleId: number | undefined;
  userCodeList: string[];
}
export interface AlterRoleUsersParams {
  // 操作类型
  alterType: number;
  // 角色用户列表
  roleUserList: RoleUserListType[];
}
export interface ModalInfoState {
  title: string;
  mode: number;
}
export interface TreeNode {
  key: string;
  parentId?: string;
  children: TreeNode[];
  [key: string]: any;
}
export interface ExternSystemState {
  sobId: number;
  extSysName: string;
  lastUpdateTime: string;
  extSysId: number;
}

export interface AccountTreeItem {
  bookLevel: number;
  bookLevelName: string;
  acctCode: string;
  acctName: string;
  marketId?: number;
  parentAcctCode: string;
  extSysId: number;
}
