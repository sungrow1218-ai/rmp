import { message } from '@ht/sprite-ui';
import { AlterRoleUsersParams } from './typing';
import { alterRoleUsers } from '@/services/roleManage';

/**
 * 获取树级数据内部所需的公共的字段
 */
export const collectIds = (
  tree: any[],
  dataIndex: string,
  ids: string[] = []
): string[] => {
  for (const node of tree) {
    if (node.children && node.children.length > 0) {
      // 如果 children 有值，则添加当前节点的 id
      ids.push(node[dataIndex]); // 确保展开的id是字符串类型且key要唯一
      // 递归遍历 children
      collectIds(node.children, dataIndex, ids);
    }
  }
  return ids;
};
/**
 * 扁平数据-由某个字段A为父级，对象内的字段B的关系是A-对多B关系，转为树级数据
 */
export const groupedData = (data: any[], dataIndex: string) => {
  const list = data.reduce((acc, item) => {
    if (!acc[item[dataIndex]]) {
      acc[item[dataIndex]] = [];
    }
    acc[item[dataIndex]].push(item);
    return acc;
  }, {} as { [key: string]: any[] });
  return list;
};
/**
 * 抽取操作角色alterRoleUsers请求
 */
// export const alterFun = async (
//   alterParmas: AlterRoleUsersParams,
//   callback2: () => void,
//   callback1?: (arg0: boolean) => void
// ) => {
//   return alterRoleUsers(alterParmas).then((result) => {
//     if (result.code !== 0) {
//       message.error(result.message);
//     } else {
//       if (alterParmas.alterType === 1 && isFunction(callback1)) {
//         callback1(false);
//       }
//       callback2();
//     }
//   });
// };

// 包装版本（不修改原函数）
// export const alterFunAsync = (
//   alterParmas: AlterRoleUsersParams
// ): Promise<boolean> => {
//   return new Promise((resolve) => {
//     alterRoleUsers(alterParmas)
//       .then((result) => {
//         if (result.code !== 0) {
//           message.error(result.message);
//           resolve(false);
//         } else {
//           message.success('操作成功');
//           resolve(true);
//         }
//       })
//       .catch((error) => {
//         message.error('请求失败');
//         console.error(error);
//         resolve(false);
//       });
//   });
// };
export const alterFun = async (
  alterParams: AlterRoleUsersParams,
  onSuccess?: () => void,
  onFailure?: () => void
): Promise<boolean> => {
  try {
    const result = await alterRoleUsers(alterParams);

    if (result.code !== 0) {
      // message.error(result.message || '操作失败');
      if (onFailure) onFailure();
      return false;
    }

    message.success('操作成功');
    if (onSuccess) onSuccess();
    return true;
  } catch (error: any) {
    // message.error('请求失败');
    console.error(error);
    if (onFailure) onFailure();
    return false;
  }
};
