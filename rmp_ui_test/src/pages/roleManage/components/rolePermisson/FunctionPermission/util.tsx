import { AuthType, DataType, MenuAuth } from './data';

/**
 * 数组转树结构
 * @param arr 数组
 * @returns
 */
export const convertToTree = (arr: MenuAuth[]) => {
  const tree: DataType[] = [];
  const map: { [key: string]: DataType } = {};
  arr.forEach((item) => {
    const {
      menuId,
      parentMenuId,
      menuName,
      empowerAuth,
      useAuth,
      functionAuthList,
    } = item;
    map[menuId] = {
      key: menuId,
      menuId,
      menuName,
      parentMenuId,
      empowerAuth,
      useAuth,
      children:
        functionAuthList.length === 0
          ? undefined
          : functionAuthList.map((i) => ({
              key: `${item.menuId}|${i.functionId}`,
              menuId,
              parentMenuId: menuId,
              functionId: i.functionId,
              functionName: i.functionName,
              useAuth: i.useAuth,
            })),
    };
  });
  arr.forEach((item) => {
    if (item.parentMenuId !== -1 && map[item.parentMenuId]) {
      if (map[item.parentMenuId].children) {
        (map[item.parentMenuId].children as DataType[]).push(map[item.menuId]);
      } else {
        map[item.parentMenuId].children = [map[item.menuId]];
      }
    } else {
      tree.push(map[item.menuId]);
    }
  });
  return tree;
};

// 获取下级所有节点
export const getAllChildrenNodes = (node: DataType): DataType[] => {
  let nodes: DataType[] = [];
  if (node.children) {
    for (const item of node.children) {
      nodes = [...nodes, item, ...getAllChildrenNodes(item)];
    }
    return nodes;
  } else {
    return nodes;
  }
};

// 获取上级所有节点
export const getParentMenuAuths = (
  parentMenuId: number,
  allMenu: MenuAuth[]
): MenuAuth[] => {
  let result: MenuAuth[] = [];
  const target = allMenu.find((i) => i.menuId === parentMenuId);
  if (target) {
    result.push(target);
    if (target.parentMenuId !== -1) {
      result = [...result, ...getParentMenuAuths(target.parentMenuId, allMenu)];
    }
  }
  return result;
};

// 获取兄弟节点
export const getBrotherMenuAuths = (
  parentMenuId: number,
  allMenu: MenuAuth[]
): MenuAuth[] => {
  return allMenu.filter((i) => i.parentMenuId === parentMenuId);
};

// 根据当前节点判断父节点是否取消
export const getCancelParentMenuAuths = (
  node: MenuAuth,
  key: 'empowerAuth' | 'useAuth',
  allMenu: MenuAuth[]
) => {
  let result: MenuAuth[] = [];
  if (node.parentMenuId === -1) return [];
  const brothers = allMenu.filter(
    (i) => i.parentMenuId === node.parentMenuId && i.menuId !== node.menuId
  );
  if (brothers.every((i) => i[key] === AuthType.NONE)) {
    const parentMenu = allMenu.find((i) => i.menuId === node.parentMenuId);
    result = [
      ...result,
      parentMenu!,
      ...getCancelParentMenuAuths(parentMenu!, key, allMenu),
    ];
  }
  return result;
};

// 根据当前节点判断父节点是否取消
export const getCancelParentMenuAuthsByFunction = (
  node: DataType,
  key: 'empowerAuth' | 'useAuth',
  allMenu: MenuAuth[]
) => {
  let result: MenuAuth[] = [];
  if (node.parentMenuId === -1) return [];
  const parent = allMenu.find((i) => i.menuId === node.parentMenuId);
  if (
    parent &&
    parent?.functionAuthList.every((i) => i[key as 'useAuth'] === AuthType.NONE)
  ) {
    result = [parent, ...getCancelParentMenuAuths(parent, key, allMenu)];
  }
  return result;
};
