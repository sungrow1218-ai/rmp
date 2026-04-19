import { queryPendingCount } from '@/services/process';

export const getUrlParams = (url: string) => {
  const params: { [key: string]: any } = {};
  const queryIndex = url.indexOf('?');
  if (queryIndex === -1) {
    return params;
  }
  const queryString = url.slice(queryIndex + 1);
  const paramPairs = queryString.split('&');
  paramPairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key) {
      params[key] = value || '';
    }
  });
  return params;
};

// export const setProcessListCount = async () => {
//   try {
//     const pendingRes = await queryPendingCount();

//     if (pendingRes.code !== 0) {
//       throw new Error('查询当前登录人待办条数失败');
//     } else if (pendingRes.data?.resultList) {
//       sessionStorage.setItem(
//         'processListCount',
//         `${pendingRes.data?.resultList[0]?.pendingCount ?? 0}`
//       );
//       window.dispatchEvent(
//         new CustomEvent('storage-changed', {
//           detail: {
//             processListCount: `${
//               pendingRes.data?.resultList[0]?.pendingCount ?? 0
//             }`,
//           },
//         })
//       );
//     }
//   } catch (error) {}
// };
