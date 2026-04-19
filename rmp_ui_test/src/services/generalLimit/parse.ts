import {
  alterLimitDetailType,
  GeneralLimitDetailList,
  GeneralLimitGroupList,
} from '.';
import {
  alterLimitDetailTypeIDTO,
  GeneralLimitDetailListIDTO,
  GeneralLimitGroupListIDTO,
} from './Idto';

// 通用限仓分组查询出参D
export const parseQueryLimitGroupData = (
  prev: GeneralLimitGroupListIDTO
): GeneralLimitGroupList => {
  const data: GeneralLimitGroupList = {
    groupId: prev?.limitGroupId,
    groupName: prev?.limitGroupName,
    createUserCode: prev?.createUserCode,
    updateUserCode: prev?.updateUserCode,
    createDateTime: prev?.createTime,
    lastUpdateTime: prev?.lastUpdateTime,
    createRoleId: prev?.createRoleId,
  };
  return data;
};
// 通用限仓明细查询出参D
export const parseQueryLimitDetailData = (
  prev: GeneralLimitDetailListIDTO
): GeneralLimitDetailList => {
  const data: GeneralLimitDetailList = {
    groupId: prev?.limitGroupId,
    securityCode: prev?.securityCode,
    securityName: prev?.securityName,
    marketId: prev?.marketId,
    limitValue: prev?.totalLimit,
    createUserNo: prev?.createUserCode,
    updateUserNo: prev?.updateUserCode,
    createDateTime: prev?.createTime,
    lastUpdateTime: prev?.lastUpdateTime,
  };
  return data;
};
export const parseAlterLimitDetailData = (
  prev: alterLimitDetailTypeIDTO
): alterLimitDetailType => {
  const data: alterLimitDetailType = {
    faultList: (prev?.faultList || [])?.map((p) => ({
      securityCode: p.securityCode,
      marketId: p.marketId,
      errorInfo: p.errorMessage,
    })),
  };
  return data;
};
