/**
 * 路由解析器
 * 将 UMI 风格的路由配置转换为 react-router-dom v6 的 JSX 路由
 */

import React, { lazy, Suspense, ReactElement } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 包装器映射
const wrapperMap: Record<string, React.ComponentType<any>> = {
  '@/wrappers/LoginStatusCheckPoint': lazy(() => import('@/wrappers/LoginStatusCheckPoint')),
  '@/wrappers/UserRole': lazy(() => import('@/wrappers/UserRole')),
  '@/wrappers/MenuFunc': lazy(() => import('@/wrappers/MenuFunc')),
  '@/wrappers/UseExtSys': lazy(() => import('@/wrappers/UseExtSys')),
  '@/wrappers/RouteGuard': lazy(() => import('@/wrappers/RouteGuard')),
};

// 布局组件映射
const layoutMap: Record<string, React.ComponentType<any>> = {
  '../layouts/BlankLayout': lazy(() => import('@/layouts/BlankLayout')),
  '../layouts/TabsLayout': lazy(() => import('@/layouts/TabsLayout')),
};

// 页面组件缓存
const pageComponentCache: Record<string, React.ComponentType<any>> = {};

/**
 * 动态加载页面组件
 */
const loadPageComponent = (componentPath: string): React.ComponentType<any> => {
  if (pageComponentCache[componentPath]) {
    return pageComponentCache[componentPath];
  }

  // 转换组件路径
  // 例如: './login' -> '@/pages/login/Login'
  // 例如: './rule/settings' -> '@/pages/rule/RuleSettings'
  let normalizedPath = componentPath;

  if (componentPath.startsWith('./')) {
    // 移除开头的 ./
    const path = componentPath.substring(2);

    // 根据路径映射到实际组件
    if (path === 'login') {
      normalizedPath = '@/pages/login/Login';
    } else if (path === 'welcome') {
      normalizedPath = '@/pages/welcome/Welcome';
    } else if (path === 'report/view') {
      normalizedPath = '@/pages/report/ReportView';
    } else if (path === 'quota/management') {
      normalizedPath = '@/pages/quota/QuotaManagement';
    } else if (path === 'quota/adjustment') {
      normalizedPath = '@/pages/quota/QuotaAdjustment';
    } else if (path === 'process/management') {
      normalizedPath = '@/pages/process/ProcessManagement';
    } else if (path === 'rule/settings') {
      normalizedPath = '@/pages/rule/RuleSettings';
    } else if (path === 'rule/create') {
      normalizedPath = '@/pages/rule/RuleCreate';
    } else if (path === 'rule/edit') {
      normalizedPath = '@/pages/rule/RuleEdit';
    } else if (path === 'rule/view') {
      normalizedPath = '@/pages/rule/RuleView';
    } else if (path === 'rule/single/create') {
      normalizedPath = '@/pages/rule/SingleRuleCreate';
    } else if (path === 'rule/single/edit') {
      normalizedPath = '@/pages/rule/SingleRuleEdit';
    } else if (path === 'rule/single/view') {
      normalizedPath = '@/pages/rule/SingleRuleView';
    } else if (path === 'account-group') {
      normalizedPath = '@/pages/account-group';
    } else if (path === 'security/group') {
      normalizedPath = '@/pages/security-group/SecurityGroupManagement';
    } else if (path === 'alert/query') {
      normalizedPath = '@/pages/alert/query';
    } else {
      // 默认处理：将路径转换为 PascalCase
      const parts = path.split('/');
      const componentName = parts.map(part =>
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join('');
      normalizedPath = `@/pages/${path}/${componentName}`;
    }
  }

  const Component = lazy(() => import(/* @vite-ignore */ normalizedPath));
  pageComponentCache[componentPath] = Component;
  return Component;
};

/**
 * 应用包装器
 */
const applyWrappers = (
  element: ReactElement,
  wrappers: string[] = []
): ReactElement => {
  let wrappedElement = element;

  for (const wrapperPath of wrappers) {
    const Wrapper = wrapperMap[wrapperPath];
    if (Wrapper) {
      wrappedElement = <Wrapper>{wrappedElement}</Wrapper>;
    }
  }

  return wrappedElement;
};

/**
 * 解析单个路由配置
 */
const parseRoute = (route: any, key?: string): ReactElement => {
  const { path, component, routes, wrappers, exact, ...rest } = route;

  // 加载组件
  let Component: React.ComponentType<any> | null = null;

  if (component) {
    if (layoutMap[component]) {
      Component = layoutMap[component];
    } else {
      Component = loadPageComponent(component);
    }
  }

  // 如果有子路由，递归解析
  if (routes && routes.length > 0) {
    const childRoutes = routes.map((childRoute: any, index: number) =>
      parseRoute(childRoute, `${key}-${index}`)
    );

    // 如果有组件，渲染组件并嵌套子路由
    if (Component) {
      const element = (
        <Route key={key} path={path} element={<Component />}>
          {childRoutes}
        </Route>
      );

      return applyWrappers(element, wrappers);
    } else {
      // 没有组件，直接渲染子路由
      return (
        <React.Fragment key={key}>
          {childRoutes}
        </React.Fragment>
      );
    }
  }

  // 叶子路由
  if (Component) {
    const element = (
      <Route
        key={key}
        path={path}
        element={<Component {...rest} />}
      />
    );

    return applyWrappers(element, wrappers);
  }

  // 没有组件的路由（如重定向）
  return <Route key={key} path={path} element={<Navigate to="/login" replace />} />;
};

/**
 * 解析路由配置并生成 JSX 路由
 */
export const parseRoutes = (routesConfig: any[]): ReactElement => {
  const routeElements = routesConfig.map((route, index) =>
    parseRoute(route, `route-${index}`)
  );

  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Routes>
        {routeElements}
        {/* 默认重定向到登录页 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

/**
 * 获取扁平化的路由列表（用于菜单等）
 */
export const getFlatRoutes = (routesConfig: any[]): any[] => {
  const flatRoutes: any[] = [];

  const traverse = (routes: any[], parentPath = '') => {
    for (const route of routes) {
      const fullPath = parentPath + route.path;
      const routeInfo = {
        ...route,
        path: fullPath,
      };

      flatRoutes.push(routeInfo);

      if (route.routes) {
        traverse(route.routes, fullPath);
      }
    }
  };

  traverse(routesConfig);
  return flatRoutes;
};