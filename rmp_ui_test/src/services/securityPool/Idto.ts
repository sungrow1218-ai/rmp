export interface ControlRangeListPropsIDTO {
  /** 对接系统号 */
  tradeSystemId: number;
  /** 账户编码 */
  accountCode: string;
}

export interface SecurityPoolResponseIDTO {
  /** 证券池层级序号 */
  secuPoolLayerId: number;
  /** 证券池层级名称 */
  secuPoolLayerName: string;
  /** 控制类型 */
  controlType: number;
  /** 账户层级 */
  accountLevel?: number;
  /** 控制范围列表 */
  controlRangeList: ControlRangeListPropsIDTO[];
  /** 所属工作台序号 */
  workGroupId: number;
  /** 创建用户编号 */
  createUserCode: string;
  /** 更新用户编号 */
  updateUserCode: string;
  /** 创建日期时间 */
  createTime: number;
  lastUpdateTime: string;
  createRoleId: number;
}

export interface AlterSecurityPoolLayerIDTO {
  /** 设置类型 */
  modifyType?: number;
  /** 控制类型  */
  controlType?: number;
  /** 角色序号 */
  workGroupId?: number;
  /** 账户层级 */
  accountLevel?: number;
  terminalInfo?: string;
  controlRangeList?: ControlRangeListPropsIDTO[];
  /** 证券池层级序号 */
  secuPoolLayerId: number | undefined;
  /** 证券池层级名称 */
  secuPoolLayerName?: string | undefined;
}

// 查询证券池-参数
export interface QuerySecurityPoolIParams {
  pageId: number;
  pageSize: number;
  authorityFlag?: 0 | 1;
  filterCondition?: {
    secuPoolLayerId?: number;
    securityPoolId?: string;
    securityPoolName?: string;
    securityPoolType?: string;
  }[];
}

// 查询证券池-结果
export interface QuerySecuPoolRspIDTO {
  secuPoolLayerId: number;
  secuPoolLayerName: string;
  securityPoolId: number;
  securityPoolName: string;
  securityPoolType: number;
  workGroupId: number;
  createUserCode: string;
  updateUserCode: string;
  createTime: number;
  createRoleId: number;
  lastUpdateTime: number;
}

export interface AlterSecurityPoolIParam {
  /** 设置类型 */
  modifyType?: number;
  terminalInfo?: string;
  /** 所属工作台序号 */
  workGroupId?: number;
  /** 证券池层级序号 */
  secuPoolLayerId?: number;
  /** 证券池序号 */
  securityPoolId?: number;
  /** 证券池层级名称 */
  securityPoolName?: string;
  /** 证券池类型 */
  securityPoolType?: number;
}

export interface QuerySecurityPoolDetailIParam {
  pageId: number;
  pageSize: number;
  securityPoolId: number;
  filterCondition?: { securityCode?: string; marketId?: number };
}

export interface QuerySecurityPoolDetailRspIDTO {
  securityCode: string;
  securityName: string;
  marketId: number;
  remark: string;
  effectiveDate?: number;
  expireDate?: number;
  securityPoolId: number;
  securityPoolName: string;
  createUserCode: string;
  updateUserCode: string;
  createTime: number;
  lastUpdateTime: number;
}

export interface AlterSecurityPoolDetailIParam {
  modifyType: number;
  securityPoolId: number;
  terminalInfo?: string;
  poolSecurityList?: {
    securityCode: string;
    marketId: number;
    effectiveDate?: number;
    expireDate?: number;
    remark?: string;
  }[];
}

export interface AlterSecurityPoolDetailRspIDTO {
  errorId: number;
  errorMessage: string;
  faultList: { securityCode: string; marketId: number; errorMessage: string }[];
}

export interface ExportSecurityPoolDetailIParam {
  /** 证券池序号 */
  securityPoolId: number;
}
