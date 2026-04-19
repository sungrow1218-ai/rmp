import {
  BookList,
  querySetOfBook,
  queryWorkGroup,
  SobInfo,
} from '@/services/account';
import { useEffect, useMemo, useState } from 'react';

interface SobIdList {
  workGroupId: number;
  workGroupName: string;
  sobId: number;
}

export interface AllSobInfo {
  workGroupId: number;
  sobId?: number | undefined;
  sobName?: string | undefined;
  bookList?: BookList[] | undefined;
  workGroupName: string;
}

export const useSobInfo = (authFlag?: number) => {
  const [sobInfo, setSobInfo] = useState<SobInfo[]>([]);
  const [sobIdList, setSobIdList] = useState<SobIdList[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const resWorkGroup = await queryWorkGroup({
          authFlag,
          pageId: 1,
          pageSize: 1000,
        });
        if (resWorkGroup.code !== 0) {
          throw new Error('获取工作台信息失败');
        }
        if (!resWorkGroup.data || resWorkGroup.data.resultList.length === 0) {
          throw new Error('未查询到账套信息');
        }
        setSobIdList(resWorkGroup.data.resultList);
        const resSob = await querySetOfBook({
          pageId: 1,
          pageSize: 1000,
        });
        if (resSob.code !== 0) {
          throw new Error('获取账套信息失败');
        }
        if (!resSob.data || resSob.data.resultList.length === 0) {
          throw new Error('未查询到账套信息');
        }
        setSobInfo(resSob.data.resultList);
      } catch (error) {}
    };
    fetch();
  }, []);

  const allSobInfoWithId = useMemo(() => {
    return sobIdList?.map((workList) => {
      const _sobInfo = sobInfo.find((item) => item.sobId === workList.sobId);
      return {
        workGroupId: workList.workGroupId,
        workGroupName: workList.workGroupName,
        ..._sobInfo,
      };
    });
  }, [sobInfo, sobIdList]);

  return allSobInfoWithId;
};
