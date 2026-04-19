import { useEffect, useState } from 'react';
import { queryExternSystem, type ExtSysItem } from '@/services/account';

// export default function useExternSystems() {
//   const [list, setList] = useState<ExtSysItem[]>([]);
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await queryExternSystem({
//           pageId: 1,
//           pageSize: 5000,
//           authFlag: 1,
//         });
//         setList(res?.data?.resultList ?? []);
//       } catch {
//         setList([]);
//       }
//     })();
//   }, []);
//   return list;
// }
export default function useExternSystems(sobId?: number | string) {
  const [list, setList] = useState<ExtSysItem[]>([]);
  useEffect(() => {
    if (!sobId) {
      setList([]);
      return;
    }
    (async () => {
      try {
        const res = await queryExternSystem({
          pageId: 1,
          pageSize: 5000,
          authFlag: 1,
          filterCondition: { sobId: Number(sobId) },
        });
        setList(res?.data?.resultList ?? []);
        console.log('useExternSystems', res.data.resultList);
      } catch {
        setList([]);
      }
    })();
  }, [sobId]);
  return list;
}
