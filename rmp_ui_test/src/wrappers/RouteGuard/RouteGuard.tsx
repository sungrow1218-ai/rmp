import { useMenuFunc } from '@/hooks';
import { redirectToEntry } from '@/utils/utils';
import { useLocation } from '@oula/oula';
import { type ReactFragment, type ReactPortal } from 'react';

const RouteGuard = (props: {
  children: boolean | ReactFragment | ReactPortal | null | undefined;
}) => {
  const { menuPathToIdMap } = useMenuFunc();

  const location = useLocation();

  // 允许访问的公共路径，不需要菜单权限检查
  const publicPaths = ['/welcome', '/'];

  // 如果是公共路径，直接放行
  if (publicPaths.includes(location.pathname)) {
    return props.children;
  }

  // 检查菜单权限映射是否存在
  if (!menuPathToIdMap) {
    // 如果菜单数据还没加载，等待加载完成
    return props.children;
  }

  // 检查当前路径是否有权限访问
  if (!menuPathToIdMap[location.pathname]) {
    // 没有权限，重定向到欢迎页面
    redirectToEntry();
    return null;
  }

  return props.children;
};

export default RouteGuard;
