import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import { DetailState } from '@/pages/processManage/contant/typing';
import {
  type CommonResponseWrapper,
  type RequestParameterPagination,
  type ResponseParameterPagination,
} from '../typing';
import {
  DetailStateIDTO,
  InProgressListIDTO,
  ProcessListDataIDTO,
} from './Idto';
import {
  parseInProgressList,
  parseProcessListData,
  parseProcessListParams,
  parseProgressDetail,
} from './parse';

export type InProgressParams = {
  changeModule: number;
  changeItemId: number;
};

export type InProgressList = {
  alterType: number;
  procedureCode: string;
  procedureName: string;
  procedureType: number;
  procedureStatus: number;
  creator: string;
  createTime: string;
  textBefore: string;
  textAfter: string;
};
interface InProgressResponData extends ResponseParameterPagination {
  resultList: InProgressList[];
}

export async function queryInProgress(params: InProgressParams) {
  return parseRequestByPage<InProgressListIDTO, InProgressList>(
    request(`/aegis/api/procedure/queryInProgress`, {
      method: 'POST',
      data: params,
    }),
    parseInProgressList
  );
}

interface PendingCountState {
  pendingCount: number;
}
/**
 * 流程管理- 查询当前登录人待办条数
 */
export async function queryPendingCount() {
  return parseRequestByPage<PendingCountState>(
    request(`/aegis/api/procedure/queryPendingCount`, {
      method: 'GET',
    })
  );
}
/**
 * 流程管理- 查询流程详情
 */
export async function queryDetail(params: { procedureCode: string }) {
  return parseRequestByPage<DetailStateIDTO, DetailState>(
    request(`/aegis/api/procedure/queryDetail`, {
      method: 'post',
      data: params,
    }),
    parseProgressDetail
  );
}
/**
 * 流程列表
 */
export async function queryProcessList(params: ProcessListParams) {
  return parseRequestByPage<ProcessListDataIDTO, ProcessListData>(
    request(`/aegis/api/procedure/queryList`, {
      method: 'post',
      data: parseProcessListParams(params),
    }),
    parseProcessListData
  );
}

export interface ProcessListParams extends RequestParameterPagination {
  filterCondition?: {
    procedureCode?: string;
    procedureName?: string;
    procedureType?: string;
    generalStatus?: number;
    changeModule?: number;
    currentProcessor?: string[];
    creator?: string;
    createStartTime?: string;
    createEndTime?: string;
    finishStartTime?: string;
    finishEndTime?: string;
  };
}
export interface ProcessListData {
  procedureCode: string;
  procedureName: string;
  // procedureStatus: number;
  // changeModule: number;
  currentProcessors: string[];
  creator: string;
  createTime: string;
  finishTime: string;
  alterType: number;
  isAuthProcess: boolean;
  isSelf: boolean;
  procedureType: number;
  // /**
  //  * 业务状态
  //  */
  // busiStatus: number;
  /**
   * 通用状态
   */
  generalStatus: number;
}
interface ProcessListRespon extends ResponseParameterPagination {
  resultList: ProcessListData[];
}

/**
 * 审批接口
 */
export async function queryProcess(params: ProcessType) {
  return parseRequest<any>(
    request(`/aegis/api/procedure/process`, {
      method: 'POST',
      data: params,
    })
  );
}

type ProcessType = {
  procedureCode: string;
  approval: number; // 1 同意  2 驳回 3 撤销
  comment?: string;
};
/**
 * 查询关联规则
 */
export async function queryRelateRuleList(params: { ruleId: number }) {
  return parseRequestByPage<ProcessRuleList>(
    request(`/aegis/api/procedure/queryRelateRuleList`, {
      method: 'POST',
      data: params,
    })
  );
}
type data = {
  resultList: ProcessRuleList[];
} & ResponseParameterPagination;

export type ProcessRuleList = {
  relatedRuleId: number;
  status: number;
  ruleType: string;
  ruleName: string;
  relationType: number;
  workGroupId: number;
};

/** 我的流程列表 */
export async function queryMyProcessList(params: ProcessMyListParams) {
  return parseRequestByPage<ProcessListDataIDTO, ProcessListData>(
    request(`/aegis/api/procedure/queryMyList`, {
      method: 'post',
      data: params,
    }),
    parseProcessListData
  );
}

interface ProcessMyListParams extends RequestParameterPagination {
  filterCondition?: {
    action: number;
  };
}
