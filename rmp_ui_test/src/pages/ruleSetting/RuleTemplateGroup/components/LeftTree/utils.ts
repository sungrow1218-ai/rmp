/**
 * 更灵活的树过滤函数
 * @param list 节点数组
 * @param predicate 过滤逻辑
 * @param key 子节点字段名，默认为 'children'
 */
export const treeFilter = <T>(
  list: T[],
  predicate: (node: T) => boolean,
  key: keyof T = 'children' as keyof T
): T[] => {
  return list.reduce<T[]>((acc, node) => {
    const children = node[key] as T[] | undefined;

    if (children) {
      const filteredChildren = treeFilter(children, predicate, key);
      if (filteredChildren.length > 0 || predicate(node)) {
        acc.push({
          ...node,
          [key]: filteredChildren,
        });
      }
    } else if (predicate(node)) {
      acc.push({ ...node });
    }

    return acc;
  }, []);
};

/**
 * 遍历树并转换字段名
 */
export const transformTree = <T, R = any>(
  data: T[],
  callback: (node: T) => R,
  key: keyof T = 'children' as keyof T
): R[] => {
  return data.map((node) => {
    const newNode = callback(node) as any;
    if (node[key] && (node[key] as T[]).length > 0) {
      newNode.children = transformTree(node[key] as T[], callback);
    }
    return newNode;
  });
};
