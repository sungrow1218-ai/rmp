export interface CommonResponseWrapper<T> {
  /**
   * 响应编码：=0 正常，<0 系统错误，>0 业务错误
   */
  code: number;
  /**
   * 信息：错误或者成功反馈给前端的信息
   */
  message: string;
  /**
   * 业务响应数据
   */
  data: T;
}

export interface CommonResponseIWrapper<T> {
  /**
   * 响应编码：=0 正常，<0 系统错误，>0 业务错误
   */
  code: number;
  errorId: number;
  /**
   * 信息：错误或者成功反馈给前端的信息
   */
  message: string;
  errorMessage: string;
  /**
   * 业务响应数据
   */
  data: T;
}

export interface RequestParameterPagination {
  /**
   * 当前页码，不传默认为 1
   */
  pageId?: number;
  /**
   * 当前分页查询大小，不传默认为 1000
   */
  pageSize?: number;
  authFlag?: number;
}
export interface RequestParameterPaginationIDTO {
  /**
   * 当前页码，不传默认为 1
   */
  pageId?: number;
  /**
   * 当前分页查询大小，不传默认为 1000
   */
  pageSize?: number;
  authorityFlag?: number;
}

export interface ResponseParameterPagination {
  /**
   * 当前页码
   */
  pageId: number;
  /**
   * 当前分页查询大小
   */
  pageSize: number;
  /**
   * 查询总数
   */
  totalSize: number;
}

/*
 * 分页设置
 */
export interface PaginationType {
  current: number;
  pageSize: number;
  total?: number;
}
export interface PaginationChange {
  page: number;
  pageSize: number;
}
