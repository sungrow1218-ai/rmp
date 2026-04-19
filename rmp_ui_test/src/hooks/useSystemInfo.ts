import { queryExternSystem, ExtSysItem } from '@/services/account';
import { useEffect, useState } from 'react';

export function getSystemNameById(systemId: number, systemInfo?: ExtSysItem[]) {
  return (
    systemInfo?.find((item) => systemId === item.extSysId)?.extSysName ??
    '未知系统'
  );
}

export const useSystemInfo = (authFlag?: number) => {
  const [systemInfo, setSystemInfo] = useState<ExtSysItem[]>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await queryExternSystem({
          pageId: 1,
          pageSize: 1000,
          authFlag,
        });
        if (res.code !== 0) {
          setSystemInfo([]);
          throw new Error('获取外部系统列表失败');
        }
        setSystemInfo(res.data.resultList);
      } catch (error) {}
    };
    fetch();
  }, []);

  return systemInfo;
};
