import { QuerySecuPoolRspDto, SecurityPoolResponseDTO } from './tyeping';

export type DataKeyType = {
  key: string;
  level: number;
  workGroupId: number;
  createRoleId: number;
  secuPoolId?: number;
  secuPoolName?: string;
  secuPoolType?: number;
  secuPoolCreateUserNo?: string;
  secuPoolUpdateUserNo?: string;
  secuPoolCreateDateTime?: number;
  secuPoolLastUpdateTime?: number;
  secuPoolCreateRoleId?: number;
};

export const transformDataKey = (
  data1: SecurityPoolResponseDTO[],
  data2: QuerySecuPoolRspDto[]
) => {
  const result: DataKeyType[] = [];
  if (data1) {
    for (const p of data1) {
      result.push({
        key: `${p.workGroupId}-${p.secuPoolLayerId}`,
        level: 1,
        workGroupId: p.workGroupId,
        createRoleId: p.createRoleId,
      });
    }
  }
  if (data1) {
    for (const p of data2) {
      result.push({
        key: `${p.secuPoolId}`,
        level: 2,
        workGroupId: p.workGroupId,
        createRoleId: p.createRoleId,
        secuPoolId: p.secuPoolId,
        secuPoolName: p.secuPoolName,
        secuPoolType: p.secuPoolType,
        secuPoolCreateUserNo: p.createUserNo,
        secuPoolCreateDateTime: p.createDateTime,
        secuPoolLastUpdateTime: p.lastUpdateTime,
      });
    }
  }

  return result;
};
