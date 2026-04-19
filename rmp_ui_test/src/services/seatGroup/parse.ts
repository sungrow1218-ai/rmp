import {
  AlterSeatGroupDetailParams,
  QuerySeatGroupDetailRspDTO,
  QuerySeatGroupRspDTO,
  QuerySeatInfoRspDTO,
} from './dto';
import {
  AlterSeatGroupDetailIParams,
  QuerySeatGroupDetailRspIDTO,
  QuerySeatGroupRspIDTO,
  QuerySeatInfoRspIDTO,
} from './idto';

// 查询席位组-结果
export const parseQuerySeatGroupRsp = (
  idata: QuerySeatGroupRspIDTO
): QuerySeatGroupRspDTO => {
  const data: QuerySeatGroupRspDTO = {
    seatGroupId: idata.seatGroupId,
    seatGroupName: idata.seatGroupName,
    marketId: idata.marketId,
    remark: idata.remark,
    workGroupId: idata.workGroupId,
    createUserNo: idata.createUserCode,
    updateUserNo: idata.updateUserCode,
    createDateTime: idata.createTime,
    lastUpdateTime: idata.lastUpdateTime,
    createRoleId: idata.createRoleId,
  };
  return data;
};

// 查询席位组明细-结果
export const parseQuerySeatGroupDetail = (
  idata: QuerySeatGroupDetailRspIDTO
): QuerySeatGroupDetailRspDTO => {
  const data: QuerySeatGroupDetailRspDTO = {
    seatCode: idata.seatCode,
    seatName: idata.seatName,
    marketId: idata.marketId,
    createUserNo: idata.createUserCode,
    updateUserNo: idata.updateUserCode,
    createDateTime: idata.createTime,
    lastUpdateTime: idata.lastUpdateTime,
    extSysId: idata.tradeSystemId,
  };
  return data;
};

// 设置席位组明细
export const parseAlterSeatGroupDetailParams = (
  params: AlterSeatGroupDetailParams
): AlterSeatGroupDetailIParams => {
  const data: AlterSeatGroupDetailIParams = {
    modifyType: params.modifyType,
    seatGroupId: params.seatGroupId,
    poolSecurityList: (params.poolSecurityList || []).map((i) => ({
      seatCode: i.seatCode,
      seatName: i.seatName,
      marketId: i.marketId,
      tradeSystemId: i.extSysId,
    })),
  };
  return data;
};

// 查询席位组信息-结果
export const parseQuerySeatInfo = (
  idata: QuerySeatInfoRspIDTO
): QuerySeatInfoRspDTO => {
  const data: QuerySeatInfoRspDTO = {
    seatCode: idata.seatCode,
    seatName: idata.seatName,
    marketId: idata.marketId,
    lastUpdateTime: idata.lastUpdateTime,
    extSysId: idata.tradeSystemId,
  };
  return data;
};
