import { CommonResponseWrapper, PaginationType } from '@/services/typing';
import { SeatGroupDetailParams, SeatGroupParams } from './tyeping';
import { RolePermissonProps } from '@/pages/roleManage/contant/typing';

const mockRequsest = async <T>(data: T) => {
  return new Promise<CommonResponseWrapper<T>>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data,
        message: 'success',
      });
    }, 1000);
  });
};
export async function querySeatGroup(p0: {
  pageId: number;
  pageSize: number;
  filterCondition: SeatGroupParams | undefined;
}) {
  const { filterCondition = {} } = p0;
  const arr = [
    {
      seatGroupId: 2,
      seatGroupName: 'mock席位组席位组席席位组',
      marketId: 34,
      workGroupId: 1,
      createUserNo: '',
      updateUserNo: '',
      createDateTime: '',
      lastUpdateTime: '',
    },
    {
      seatGroupId: 4,
      seatGroupName: 'mock2',
      workGroupId: 4,
      marketId: 2,
      createUserNo: '',
      updateUserNo: '',
      createDateTime: '',
      lastUpdateTime: '',
    },
    {
      seatGroupId: 12,
      seatGroupName: 'mock3',
      workGroupId: 3,
      marketId: 1,
      createUserNo: '',
      updateUserNo: '',
      createDateTime: '',
      lastUpdateTime: '',
    },
    {
      workGroupId: 2,
      seatGroupId: 66,
      seatGroupName: 'mock4',
      marketId: 1,
      createUserNo: '',
      updateUserNo: '',
      createDateTime: '',
      lastUpdateTime: '',
    },
    {
      workGroupId: 1,
      seatGroupId: 92,
      seatGroupName: 'mock54',
      marketId: 1,
      createUserNo: '',
      updateUserNo: '',
      createDateTime: '',
      lastUpdateTime: '',
    },
  ];
  return mockRequsest({
    errorId: 0,
    errorInfo: '',
    pageId: 1,
    pageSize: 1000,
    totalSize: 5,
    resultList: filterCondition.marketId
      ? arr.filter((r) => r.marketId === filterCondition.marketId)
      : arr,
  });
}
export async function querySeatGroupDetail(p0: {
  pageId: number;
  pageSize: number;
  filterCondition?: SeatGroupDetailParams;
  seatGroupId: number;
}) {
  const { filterCondition = {} } = p0;
  const arr = [
    {
      seatCode: '10002',
      seatName: 'mock席位1',
      marketId: 1,
      extSysId: 20000022,
      createUserNo: '010788',
      updateUserNo: '',
      createDateTime: '202503261635',
      lastUpdateTime: '202503261635',
    },
    {
      seatCode: '10003',
      seatName: 'mock席位2',
      marketId: 1,
      extSysId: 20000021,
      createUserNo: '010788',
      updateUserNo: '',
      createDateTime: '202503261635',
      lastUpdateTime: '202503261635',
    },
    {
      seatCode: '10004',
      seatName: 'mock席位3',
      marketId: 1,
      extSysId: 20000021,
      createUserNo: '010788',
      updateUserNo: '',
      createDateTime: '202503261635',
      lastUpdateTime: '202503261635',
    },
    {
      seatCode: '10004',
      seatName: 'mock席位4',
      marketId: 1,
      extSysId: 20000022,
      createUserNo: '010788',
      updateUserNo: '',
      createDateTime: '202503261635',
      lastUpdateTime: '202503261635',
    },
    {
      seatCode: '10005',
      seatName: 'mock席位5',
      marketId: 1,
      extSysId: 20000022,
      createUserNo: '010788',
      updateUserNo: '',
      createDateTime: '202503261635',
      lastUpdateTime: '202503261635',
    },
  ];
  return mockRequsest({
    errorId: 0,
    errorInfo: '',
    pageId: 1,
    pageSize: 1000,
    totalSize: 5,
    resultList: filterCondition.seatCode
      ? arr.filter((r) => r.seatCode === filterCondition.seatCode)
      : arr,
  });
}
export async function querySeatInfo(param: {
  filterCondition?: SeatGroupDetailParams;
  pageId: number;
  pageSize: number;
}) {
  const { filterCondition = {} } = param;
  const mockData: RolePermissonProps[] = Array.from({ length: 800 }).map(
    (_, i) => ({
      seatCode: `1000${i.toString()}`,
      seatName: `content${i + 1}`,
      marketId: (i > 200 && i % 2) === 0 ? 34 : 1,
      extSysId: 20000022,
      lastUpdateTime: '202503261635',
    })
  );
  return mockRequsest({
    errorId: 0,
    errorInfo: '',
    pageId: 1,
    pageSize: 1000,
    totalSize: 5,
    resultList: filterCondition.marketId
      ? mockData.filter((r) => r.marketId === filterCondition.marketId)
      : mockData,
  });
}
