// 查询通用限仓分组
export type GeneralLimitGroupListIDTO = {
  limitGroupId: number;
  limitGroupName: string;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
  createRoleId: number;
};

// 限仓明细出参
export type GeneralLimitDetailListIDTO = {
  securityCode: string;
  securityName: string;
  marketId: number;
  totalLimit: number;
  limitGroupId: number;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
};

// 设置限仓出参
export type FaultListType = {
  securityCode: string;
  marketId: number | string | undefined;
  errorMessage?: string;
};

export type alterLimitDetailTypeIDTO = {
  faultList?: FaultListType[];
};
