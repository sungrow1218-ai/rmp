export interface Props {
  [key: string]: any;
}
type TimeState = {
  startTime: string;
  endTime: string;
};
export interface SearchFilterProps {
  procedureCode?: string;
  procedureName?: string;
  procedureType?: number;
  procedureStatus?: number;
  currentProcessors?: string;
  creator?: string;
  createBetween?: TimeState[];
  finishTime?: string;
}
export interface DataListProps {
  procedureCode: string;
  procedureName: string;
  procedureType?: number;
  procedureStatus: number;
  currentProcessors: string[];
  creator: string;
  createTime: string;
  finishTime?: string;
}
export interface DetailModalProps {
  visible: boolean;
  record?: DataListProps;
  onClose: () => void;
}
export interface TimeInfo {
  createTime: string;
  finishTime: string;
  times: string;
}
export interface DoneProps {
  timeInfo: TimeInfo;
  defaultValues?: DetailState;
}
export interface DoingProps {
  defaultValues?: DetailState;
}
export interface DetailState {
  /** 流程编号 */
  procedureCode: string;
  /** 流程名称 */
  procedureName: string;
  /** 流程类型 */
  procedureType: number;
  /** 操作类型 */
  operationType: number;
  /** 业务状态 */
  busiStatus: number;
  /** 当前审批人列表 */
  currentProcessors: string[];
  /** 创建人 */
  creator: string;
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
  alterType: number;
  /** 是否是自我发起 */
  isSelf: boolean;
  /** 生效信息 */
  errorInfo: string;
  comment: string;
}
