import {
  querySetOfBookbySobId,
  querySobIdByWorkGroupId,
} from '@/services/account/api';
import { useEffect, useState } from 'react';
import { SobInfo } from '@/services/account/api';

export const useSobInfo = (workGroupId?: number) => {
  const [sobInfo, setSobInfo] = useState<SobInfo>();

  useEffect(() => {
    const fetch = async () => {
      if (!workGroupId) {
        setSobInfo(undefined);
        return;
      }

      try {
        // 1. 通过 workGroupId 获取 sobId
        const resWorkGroup = await querySobIdByWorkGroupId(workGroupId);
        console.log('querySobIdByWorkGroupId 响应:', resWorkGroup);

        if (resWorkGroup.code !== 0) {
          console.error('获取工作台信息失败，错误码:', resWorkGroup.code);
          setSobInfo(undefined);
          return;
        }

        if (!resWorkGroup.data || !resWorkGroup.data.resultList || resWorkGroup.data.resultList.length === 0) {
          console.log('未查询到工作台-账套关系信息');
          setSobInfo(undefined);
          return;
        }

        const sobId = resWorkGroup.data.resultList[0].sobId;
        console.log('获取到的 sobId:', sobId);

        // 2. 通过 sobId 获取账套信息
        const resSob = await querySetOfBookbySobId(sobId);
        console.log('querySetOfBookbySobId 响应:', resSob);

        if (resSob.code !== 0) {
          console.error('获取账套信息失败，错误码:', resSob.code);
          setSobInfo(undefined);
          return;
        }

        if (!resSob.data || !resSob.data.resultList || resSob.data.resultList.length === 0) {
          console.log('未查询到账套信息');
          setSobInfo(undefined);
          return;
        }

        console.log('成功获取账套信息:', resSob.data.resultList[0]);
        setSobInfo(resSob.data.resultList[0]);
      } catch (error) {
        console.error('获取账套信息失败:', error);
        setSobInfo(undefined);
      }
    };

    fetch();
  }, [workGroupId]);

  return sobInfo;
};