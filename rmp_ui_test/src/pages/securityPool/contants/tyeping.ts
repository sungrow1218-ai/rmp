import { PaginationType } from '@/components/Pagination/Pagination';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import { BookList, WorkGroupList } from '@/services/account';
import { DictFeKeyEnumType } from '@/utils/dict';
import type { PaginationProps } from '@ht/sprite-ui';
import { SearchObj } from '../SecurityPool';
import { ParseDataType } from '../LeftRebuild';

type NonNullable<T> = Exclude<T, null | undefined>;
export type ModifiedType = Omit<typeof FORM_MODES, 'PREVIEW' | 'ADD_VIA_COPY'>;
export interface PoolLevelProps<T extends keyof TypeMap> {
  mode: DictFeKeyEnumType['OPERATION_TYPES'];
  formType: string;
  defaultValues?: TypeSelectorPool<T>;
  isDetail?: boolean;
  onClose: () => void;
  processSobId?: number;
  processWorkGroupList?: WorkGroupList[];
  workGroupList: WorkGroupList[];
}

export interface PoolDetailFormType {
  secuPoolId?: number;
  /** 证券代码 */
  securityCode?: string;
  securityName?: string;
  securityCodeStr?: string;
  /** 市场 */
  marketId?: number;
  /** 有效起始日期 */
  effectBeginDate?: string;
  /** 有效截止日期 */
  effectEndDate?: string;
  /** 备注 */
  remark?: string;
}
export interface PoolDetailFormProps {
  mode: DictFeKeyEnumType['OPERATION_TYPES'];
  defaultValues?: PoolDetailFormType;
  isDetail?: boolean;
  onClose: () => void;
}
export interface PoolLevelFormType extends MergeProps {
  secuPoolLayerId?: number;
  secuPoolLayerName?: string;
  workGroupName: string;
  workGroupNameId: number;
}

export interface MergeProps {
  /** 控制类型 */
  controlType?: number;
  /** 账户层级 */
  acctLevel?: number;
  /** 控制范围列表 */
  controlRangeList?: ControlRangeListProps[];
  /** 所属工作台序号 */
  workGroupId?: number;
  accountList?: string[];
  extSysIdList?: any[];
}
interface itemListOption {
  value: string;
  label: string;
}
export interface PoolFormDataType {
  secuPoolLayerList: SecurityPoolResponseDTO[];
  itemList2?: itemListOption[];
  itemList3?: itemListOption[];
}

export type PoolLevelFormInfoValues = NonNullable<PoolLevelFormType>;
type PoolFormInfoValues = NonNullable<SecuPoolDTO>;
type PoolDetailFormInfoValues = NonNullable<PoolDetailFormType>;
interface TypeMap {
  PoolLevelForm: PoolLevelFormInfoValues;
  PoolForm: PoolFormInfoValues;
  PoolDetailForm: PoolDetailFormInfoValues;
  AddDetailForm: PoolDetailFormInfoValues;
  // 可以添加更多类型
}

export type TypeSelectorPool<TKey extends keyof TypeMap> = TypeMap[TKey];
export interface QueryCondDTO {
  secuPoolLayerId?: number;
  secuPoolLayerName?: string;
  secuPoolId?: string;
  secuPoolName?: string;
  secuPoolType?: string;
}
export interface QuerySecurityPoolLayerType {
  pageId: number;
  pageSize: number;
  authFlag?: 0 | 1;
  /** 角色序号 */
  filterCondition?: QueryCondDTO[];
}
export interface SecurityPoolResponseDTO {
  /** 证券池层级序号 */
  secuPoolLayerId: number;
  /** 证券池层级名称 */
  secuPoolLayerName: string;
  /** 所属工作台序号 */
  workGroupId: number;
  /** 创建用户编号 */
  createUserNo: string;
  /** 更新用户编号 */
  updateUserNo: string;
  /** 创建日期时间 */
  createDateTime: number;
  /** 控制类型 */
  controlType: number;
  /** 账户层级 */
  acctLevel?: number;
  /** 控制范围列表 */
  controlRangeList: ControlRangeListProps[];
  [key: string]: any;
  createRoleId: number;
}
export interface ControlRangeListProps {
  /** 对接系统号 */
  extSysId: number;
  /** 账户编码 */
  acctCode: string;
}
export interface SecuPoolLayerDTO {
  /** 证券池层级序号 */
  secuPoolLayerId: number | undefined;
  /** 证券池层级名称 */
  secuPoolLayerName?: string | undefined;
}
export interface QuerySecuPoolLayerType {
  /** 设置类型 */
  alterType?: number;
  /** 控制类型  */
  controlType?: number;
  /** 角色序号 */
  workGroupId?: number;
  /** 账户层级 */
  acctLevel?: number;
  terminalInfo?: string;
  controlRangeList?: ControlRangeListProps[];
}
export interface QuerySecuPoolDetailType extends QuerySecuPoolLayerType {
  pageId: number;
  pageSize: number;
  secuPoolId: number;
  filterCondition: FaultListType;
}
export interface QuerySecuPoolRspDto {
  /** 证券池层级序号 */
  secuPoolLayerId: number;
  /** 证券池序号 */
  secuPoolId: number;
  /** 证券池名称 */
  secuPoolName: string;
  /** 所属工作台序号 */
  workGroupId: number;
  /** 创建用户编号 */
  createUserNo: string;
  /** 更新用户编号 */
  updateUserNo: string;
  /** 创建日期时间 */
  createDateTime: number;
  createRoleId: number;
  secuPoolType: number;
  lastUpdateTime: number;
}
export interface SecuPoolDTO {
  /** 证券池层级序号 */
  secuPoolLayerId?: number;
  /** 证券池序号 */
  secuPoolId?: number;
  /** 证券池层级名称 */
  secuPoolName?: string;
  /** 证券池类型 */
  secuPoolType?: number;
  /** 控制类型 */
  controlType?: number;
  /** 账户层级 */
  acctLevel?: number;
  /** 控制范围列表 */
  controlRangeList?: ControlRangeListProps[];
  /** 所属工作台序号 */
  workGroupId?: number;
}

export interface QuerySecuPoolRspDTO {
  reuslt?: number;
  /** 券池序号 */
  secuPoolId: number;
  /** 证券代码 */
  securityCode: string;
  /** 市场 */
  marketId: number;
  /** 备注 */
  remark: string;
  /** 有效起始日期 */
  effectBeginDate: string;
  /** 有效截止日期 */
  effectEndDate: string;
  /** 创建用户编号 */
  createUserNo: string;
  /** 更新用户编号 */
  updateUserNo: string;
  /** 创建日期时间 */
  createDateTime: number;
  /** 最近刷新时间 */
  lastUpdateTime: number;
  /** 错误描述 */
  errorInfo?: string;
  desc?: string;
}
export interface SecuPoolDetailDTO {
  /** 证券代码 */
  securityCode?: string;
  /** 市场 */
  marketId?: number;
  /** 有效起始日期 */
  effectBeginDate?: string;
  /** 有效截止日期 */
  effectEndDate?: string;
  /** 备注 */
  remark?: string;
}
export interface QuerySecuPoolDeatailType extends QuerySecuPoolLayerType {
  poolSecurityList: SecuPoolDetailDTO[];
  secuPoolId: number | undefined;
}
export interface ExportSecurityPoolType {
  /** 操作员身份ID  */
  operatorCode?: string;
  /** 证券池序号 */
  secuPoolId: number;
  /** 终端信息 */
  terminalInfo?: string;
}
// 分页搜索
export interface SearchProps {
  paginationValue: PaginationType;
  type?: boolean;
}
export interface LeftProps {
  changeKey: (value: any) => void;
  setRiskAuth: (value: any) => void;
  searchObj?: SearchObj;
  workGroupList: WorkGroupList[];
  setSelectInfo: React.Dispatch<
    React.SetStateAction<ParseDataType | undefined>
  >;
}
export interface ExportModalType {
  title: string;
  mode: string;
  hasFooter: boolean;
}
export interface FaultListType {
  securityCode: string;
  marketId: number | string | undefined;
  errorInfo?: string;
}
export interface PagenationState extends PaginationProps {
  pageId: number;
}
export interface TableParams {
  pageSize?: number;
  current?: number;
  filter?: Record<string, any>;
  sorter?: Record<string, any>;
}
export interface TableData {
  list: Record<string, any>[]; // 假设你的数据是对象数组
  total: number; // 总记录数
}
export interface FileParmas {
  fileName: string; //
}
export interface AllSobProps {
  workGroupId: number;
  sobId?: number;
  sobName?: string;
  bookList?: BookList[];
}
