import {
  querySetOfBookbySobId,
  querySobIdByWorkGroupId,
  SobInfo,
} from '@/services/account';
import { useEffect, useState } from 'react';

export const useSobInfo = (workGroupId: number) => {
  const [sobInfo, setSobInfo] = useState<SobInfo>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const resWorkGroup = await querySobIdByWorkGroupId(workGroupId);
        if (resWorkGroup.code !== 0) {
          throw new Error('获取工作台信息失败');
        }
        if (!resWorkGroup.data || resWorkGroup.data.resultList.length === 0) {
          throw new Error('未查询到账套信息');
        }
        const resSob = await querySetOfBookbySobId(
          resWorkGroup.data.resultList[0].sobId
        );
        if (resSob.code !== 0) {
          throw new Error('获取账套信息失败');
        }
        if (!resSob.data || resSob.data.resultList.length === 0) {
          throw new Error('未查询到账套信息');
        }
        setSobInfo(resSob.data.resultList[0]);
      } catch (error) {}
    };
    fetch();
  }, [workGroupId]);

  return sobInfo;
};
