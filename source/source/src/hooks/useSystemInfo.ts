import { queryExternSystem } from '@/services/account/api';
import { useEffect, useState } from 'react';
import { ExtSysItem } from '@/services/account/api';

export function getSystemNameById(systemId: number, systemInfo?: ExtSysItem[]) {
  return (
    systemInfo?.find((item) => systemId === item.tradeSystemId)?.tradeSystemName ??
    '未知系统'
  );
}

export const useSystemInfo = (authorityFlag?: number) => {
  const [systemInfo, setSystemInfo] = useState<ExtSysItem[]>();

  useEffect(() => {
    const fetch = async () => {
      try {
        console.log('开始获取外部系统列表，authorityFlag:', authorityFlag);
        const res = await queryExternSystem({
          pageId: 1,
          pageSize: 1000,
          authorityFlag,
        });
        console.log('queryExternSystem 响应:', res);

        if (res.code !== 0) {
          setSystemInfo([]);
          console.error('获取外部系统列表失败，错误码:', res.code);
          return;
        }

        console.log('外部系统列表数据:', res.data?.resultList);
        if (res.data?.resultList) {
          // 打印前几个系统信息，查看字段结构
          const sampleItems = res.data.resultList.slice(0, 3);
          console.log('样本系统信息:', sampleItems.map(item => ({
            tradeSystemId: item.tradeSystemId,
            tradeSystemName: item.tradeSystemName,
            sobId: item.sobId
          })));
        }

        setSystemInfo(res.data.resultList);
      } catch (error) {
        console.error('获取系统信息失败:', error);
      }
    };

    fetch();
  }, [authorityFlag]);

  return systemInfo;
};