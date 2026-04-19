export interface ControlRangeListProps {
  /** 对接系统号 */
  extSysId: number;
  /** 账户编码 */
  acctCode: string;
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

export interface AlterSecurityPoolLayerDTO {
  /** 设置类型 */
  modifyType?: number;
  /** 控制类型  */
  controlType?: number;
  /** 角色序号 */
  workGroupId?: number;
  /** 账户层级 */
  acctLevel?: number;
  terminalInfo?: string;
  controlRangeList?: ControlRangeListProps[];
  /** 证券池层级序号 */
  secuPoolLayerId: number | undefined;
  /** 证券池层级名称 */
  secuPoolLayerName?: string | undefined;
}

// 查询证券池-参数
export interface QuerySecurityPoolParams {
  pageId: number;
  pageSize: number;
  authorityFlag?: 0 | 1;
  filterCondition?: {
    secuPoolLayerId?: number;
    secuPoolLayerName?: string;
    secuPoolId?: string;
    secuPoolName?: string;
    secuPoolType?: string;
  }[];
}

// 查询证券池-结果
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

export interface AlterSecurityPoolParam {
  /** 设置类型 */
  modifyType?: number;
  terminalInfo?: string;
  /** 所属工作台序号 */
  workGroupId?: number;
  /** 证券池层级序号 */
  secuPoolLayerId?: number;
  /** 证券池序号 */
  secuPoolId?: number;
  /** 证券池层级名称 */
  secuPoolName?: string;
  /** 证券池类型 */
  secuPoolType?: number;
}

export interface QuerySecurityPoolDetailParam {
  pageId: number;
  pageSize: number;
  secuPoolId: number;
  filterCondition?: { securityCode?: string; marketId?: number };
}

export interface QuerySecurityPoolDetailRspDTO {
  securityCode: string;
  securityName: string;
  marketId: number;
  effectBeginDate?: string;
  effectEndDate?: string;
  remark: string;
  secuPoolId: number;
  secuPoolName: string;
  createUserNo: string;
  updateUserNo: string;
  createDateTime: number;
  lastUpdateTime: number;
}

export interface AlterSecurityPoolDetailParam {
  modifyType: number;
  secuPoolId: number;
  terminalInfo?: string;
  poolSecurityList?: {
    securityCode: string;
    marketId: number;
    effectBeginDate?: number;
    effectEndDate?: number;
    remark?: string;
  }[];
}

export interface AlterSecurityPoolDetailRspDTO {
  errorId: number;
  errorInfo: string;
  faultList: { securityCode: string; marketId: number; errorInfo: string }[];
}

export interface ExportSecurityPoolDetailParam {
  /** 证券池序号 */
  secuPoolId: number;
}
