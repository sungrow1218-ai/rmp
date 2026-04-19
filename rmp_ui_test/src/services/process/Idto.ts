import { RequestParameterPaginationIDTO } from '../typing';

export interface ProcessListDataIDTO {
  procedureCode: string;
  procedureName: string;
  currentProcessors: string[];
  createUserCode: string;
  createTime: string;
  finishTime: string;
  modifyType: number;
  isAuthProcess: boolean;
  isSelf: boolean;
  procedureType: number;
  generalStatus: number;
}

export interface ProcessListParamsIDTO extends RequestParameterPaginationIDTO {
  filterCondition?: {
    procedureCode?: string;
    procedureName?: string;
    generalStatus?: number;
    procedureType?: string;
    changeModule?: number;
    currentProcessor?: string[];
    createUserCode?: string;
    createStartTime?: string;
    createEndTime?: string;
    finishStartTime?: string;
    finishEndTime?: string;
  };
}

export type InProgressListIDTO = {
  modifyType: number;
  procedureCode: string;
  procedureName: string;
  procedureType: number;
  procedureStatus: number;
  createUserCode: string;
  createTime: string;
  textBefore: string;
  textAfter: string;
};

export interface DetailStateIDTO {
  /** 流程编号 */
  procedureCode: string;
  /** 流程名称 */
  procedureName: string;
  /** 流程类型 */
  procedureType: number;
  /** 操作类型 */
  operationType: number;
  /** 业务状态 */
  businessStatus: number;
  /** 当前审批人列表 */
  currentProcessors: string[];
  /** 创建人 */
  createUserCode: string;
  /** 创建时间 */
  createTime: string;
  /** 变更模块 */
  changeModule: number;
  /** 变更项 */
  changeItem: string;
  /** 变更项id */
  changeItemId: number;
  /** 变更详情 */
  changeText: string;
  /** 变更前切片信息 */
  textBefore: string;
  /** 变更后切片信息 */
  textAfter: string;
  /** 办结时间 */
  finishTime: string;
  /** 操作状态 */
  modifyType: number;
  /** 是否是自我发起 */
  isSelf: boolean;
  /** 生效信息 */
  errorReason: string;
  comment: string;
}
