import { querySetOfBookbySobId } from '@/services/account';
import React, { useEffect, useState } from 'react';

interface Props {
  workGroupId: number;
  bookType: number;
  bookLevel: number;
}
const AccountType: React.FC<Props> = (workGroupId: number) => {
  const [sobInfoWithWorkGroupId, setSobInfoWithWorkGroupId] = useState<any>({});
  useEffect(() => {
    const fetch = async () => {
      try {
        const resSob = await querySetOfBookbySobId(
          resWorkGroup.data.resultList[0].sobId
        );
        if (resSob.code !== 0) {
          throw new Error('获取账套信息失败');
        }
        if (!resSob.data || resSob.data.resultList.length === 0) {
          throw new Error('未查询到账套信息');
        }
      } catch (error) {}
    };
    fetch();
  }, [workGroupId]);
};
