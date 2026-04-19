import { queryWorkGroup, WorkGroupList } from '@/services/account';
import { useEffect, useMemo, useState } from 'react';

export const useWorkGroup = (authFlag = 1) => {
  const [workGroup, setWorkGroup] = useState<WorkGroupList[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const resWorkGroup = await queryWorkGroup({
          pageId: 1,
          pageSize: 1000,
          authFlag,
        });
        if (resWorkGroup.code !== 0) {
          setWorkGroup([]);
          throw new Error('获取工作台信息失败');
        }
        if (resWorkGroup.data && resWorkGroup.data.resultList) {
          setWorkGroup(resWorkGroup.data.resultList);
        } else {
          setWorkGroup([]);
        }
      } catch (error) {}
    };
    fetch();
  }, []);

  return workGroup;
};
