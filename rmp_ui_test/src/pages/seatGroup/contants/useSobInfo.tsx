import { queryWorkGroup } from '@/services/account';
import { useEffect, useMemo, useState } from 'react';

export interface SobIdList {
  workGroupId: number;
  workGroupName: string;
  sobId: number;
}

export const useSobInfo = (workGroupId?: number) => {
  const [sobIdList, setSobIdList] = useState<SobIdList[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const resWorkGroup = await queryWorkGroup({
          pageId: 1,
          pageSize: 1000,
          filterCondition: workGroupId
            ? {
                workGroupId,
              }
            : undefined,
        });
        if (resWorkGroup.code !== 0) {
          throw new Error('获取工作台信息失败');
        }
        if (!resWorkGroup.data || resWorkGroup.data.resultList.length === 0) {
          throw new Error('未查询到账套信息');
        }
        setSobIdList(resWorkGroup.data.resultList);
      } catch (error) {}
    };
    fetch();
  }, [workGroupId]);

  return sobIdList;
};
