export interface QuerySeatGroupRspIDTO {
  seatGroupId: number;
  seatGroupName: string;
  marketId: number;
  remark?: string;
  workGroupId: number;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
  createRoleId: number;
}

export interface QuerySeatGroupDetailRspIDTO {
  seatCode: string;
  seatName: string;
  marketId: number;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
  tradeSystemId: number;
}

export interface AlterSeatGroupDetailIParams {
  modifyType: number;
  seatGroupId: number;
  poolSecurityList: {
    seatCode: string;
    seatName: string;
    marketId: number;
    tradeSystemId: number;
  }[];
}

export interface QuerySeatInfoRspIDTO {
  tradeSystemId: number;
  marketId: number;
  seatCode: string;
  seatName: string;
  lastUpdateTime: string;
}
