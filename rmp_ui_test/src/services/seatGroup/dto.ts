export interface QuerySeatGroupRspDTO {
  seatGroupId: number;
  seatGroupName: string;
  marketId: number;
  remark?: string;
  workGroupId: number;
  createUserNo: string;
  updateUserNo: string;
  createDateTime: string;
  lastUpdateTime: string;
  createRoleId: number;
}

export interface QuerySeatGroupDetailRspDTO {
  seatCode: string;
  seatName: string;
  marketId: number;
  createUserNo: string;
  updateUserNo: string;
  createDateTime: string;
  lastUpdateTime: string;
  extSysId: number;
}

export interface AlterSeatGroupDetailParams {
  modifyType: number;
  seatGroupId: number;
  poolSecurityList: {
    seatCode: string;
    seatName: string;
    marketId: number;
    extSysId: number;
  }[];
}

export interface QuerySeatInfoRspDTO {
  extSysId: number;
  marketId: number;
  seatCode: string;
  seatName: string;
  lastUpdateTime: string;
}
