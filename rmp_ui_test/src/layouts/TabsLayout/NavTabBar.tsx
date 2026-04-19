import React, {
  type FC,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Tabs } from '@ht/sprite-ui';
import { ClearOutlined } from '@ht-icons/sprite-ui-react';
import { type MenuItemType } from '@/services/menu';
import {
  DYNAMIC_MENU_PATH_PREFIX_TO_CACHE_KEY,
  FIXED_MENU_PATH_TO_CACHE_KEY_MAP,
} from '@/utils/constant';
import { getDynamicCacheKey } from '@/utils/utils';
import styles from './index.less';
import projectBStyles from './projectBStyles.less';

interface Props {
  currentPath: string;
  flatMenuData: MenuItemType[];
  /**
   * 路由变更时调用
   */
  handleMenuOpen: (path: string) => void;
  /**
   * 菜单路径到菜单 id 的映射
   */
  transformMenuPathtoId: (path: string) => number;
  /**
   * 菜单 id 到菜单路径的映射
   */
  transformMenuIdtoPath: (id?: number) => string;
  /**
   * 关闭页签时清空 keepalive 缓存
   */
  dropCache: (cacheKey: string) => void;
  /**
   * 清空按钮点击时调用的回调
   */
  onReset: () => void;
}

type Panel = {
  id: string;
  menuId: number;
  name: string;
};

function genPanelId(menuId: number) {
  if (menuId < 0) {
    return '';
  }
  return `tab_${menuId}`;
}

function getMenuPathCacheKey(menuPath: string) {
  const fixedRouteCacheKey: string =
    // @ts-expect-error
    FIXED_MENU_PATH_TO_CACHE_KEY_MAP[menuPath] || '';

  if (fixedRouteCacheKey) {
    return fixedRouteCacheKey;
  }

  let dynamicMenuPathCacheKey = '';

  Object.keys(DYNAMIC_MENU_PATH_PREFIX_TO_CACHE_KEY).some((dynamicMenuPath) => {
    const [pathPrefix] = dynamicMenuPath.split(':');
    if (menuPath.startsWith(pathPrefix)) {
      const pathParam = menuPath.replace(pathPrefix, '');
      dynamicMenuPathCacheKey = getDynamicCacheKey(
        // @ts-expect-error
        DYNAMIC_MENU_PATH_PREFIX_TO_CACHE_KEY[dynamicMenuPath],
        pathParam
      );
      return true;
    }
    return false;
  });

  return dynamicMenuPathCacheKey;
}

const NavTabBar: FC<Props> = ({
  currentPath,
  flatMenuData,
  handleMenuOpen,
  transformMenuPathtoId,
  transformMenuIdtoPath,
  dropCache,
  onReset,
}) => {
  // 所有曾经打开过的 tab 面板对象
  const [tabPanels, setTabPanels] = useState<Panel[]>([]);
  const tabItems = useMemo(() => {
    const items = tabPanels.map((panel) => ({
      label: panel.name,
      key: String(panel.id),
    }));
    return items;
  }, [tabPanels]);

  // 当前激活的菜单 id
  const activeMenuId = useMemo(
    () => transformMenuPathtoId(currentPath),
    [transformMenuPathtoId, currentPath]
  );

  // 当前激活的 tab 面板 id, tab_${menuId}
  const activePanelId = genPanelId(activeMenuId);

  // 当 roleId 变更时，需要清空所有 tab 面板
  useEffect(() => {
    setTabPanels([]);
  }, [flatMenuData]);

  useEffect(() => {
    setTabPanels((state) => {
      const alreadyOpened = state.find(
        (panel) => panel.menuId === activeMenuId
      );

      if (alreadyOpened) {
        return state;
      }
      const menuName = flatMenuData?.find(
        (item) => item.menuId === activeMenuId
      )?.menuName;

      if (!menuName || !activeMenuId) {
        return state;
      }

      return [
        ...state,
        {
          id: genPanelId(activeMenuId),
          menuId: activeMenuId,
          name: menuName,
        },
      ];
    });
  }, [activeMenuId, setTabPanels, flatMenuData]);

  const handleTabSwitch = useCallback(
    (panelId: string) => {
      const menuIdToSwitch = tabPanels.find(
        (panel) => panel.id === panelId
      )?.menuId;
      const menuPath = transformMenuIdtoPath(menuIdToSwitch);
      handleMenuOpen(menuPath);
    },
    [tabPanels, transformMenuIdtoPath, handleMenuOpen]
  );

  const cleanupSingleCache = useCallback(
    (menuPath?: string) => {
      if (!menuPath) {
        return;
      }

      const fixedRouteCacheKey = getMenuPathCacheKey(menuPath);

      if (!fixedRouteCacheKey) {
        return;
      }
      if (fixedRouteCacheKey) {
        dropCache(fixedRouteCacheKey);
      }
    },
    [dropCache]
  );

  const handleTabRemove = useCallback(
    (panelId: string) => {
      // 根据 panelId（tab_${menuId}）获取要删除的 tab 的索引
      const menuIdToRemove = tabPanels.find(
        (panel) => panel.id === panelId
      )?.menuId;
      // 根据 menuId 获取要删除的 tabPanel 在 tabPanels 数组中的索引位置，这个主要是用于计算下一个激活 tab 的索引
      const tabIndexToRemove = tabPanels.findIndex(
        (panel) => panel.menuId === menuIdToRemove
      );
      // 从 tabPanels 中删除要删除的 tabPanel
      const nextPanelList = tabPanels.filter(
        (_, idx) => idx !== tabIndexToRemove
      );
      // 删除后激活页签临时指定为当前页签
      let nextActiveMenuId = activeMenuId;
      // 如果删除的是当前激活页签，则需要将激活态切换到其他页签
      if (activeMenuId === menuIdToRemove) {
        if (tabIndexToRemove - 1 <= 0) {
          nextActiveMenuId = nextPanelList[0]?.menuId;
        } else {
          nextActiveMenuId = nextPanelList[tabIndexToRemove - 1]?.menuId;
        }
      }
      cleanupSingleCache(transformMenuIdtoPath(menuIdToRemove));
      const menuPath = transformMenuIdtoPath(nextActiveMenuId);
      setTabPanels(nextPanelList);
      handleMenuOpen(menuPath);
    },
    [
      tabPanels,
      transformMenuIdtoPath,
      handleMenuOpen,
      activeMenuId,
      cleanupSingleCache,
    ]
  );

  // 处理 tab 组件 onChange 事件回调的方法，但是这里只用作处理 remove 事件回调的口子
  const handleTabEdit = useCallback(
    (targetKey: any, action: 'remove' | 'add') => {
      // 这里只处理删除操作，新增操作由路由触发，不在这里处理
      if (!targetKey || action !== 'remove' || typeof targetKey !== 'string') {
        return;
      }
      handleTabRemove(targetKey);
    },
    [handleTabRemove]
  );

  const handleCleanup = useCallback(() => {
    setTabPanels([]);
    onReset();
  }, [onReset]);

  return (
    <Tabs
      tabBarStyle={{
        height: 47,
        marginBottom: 0,
      }}
      className={`${styles.navTabs} ${projectBStyles.customTabs}`}
      hideAdd={true}
      onChange={handleTabSwitch}
      activeKey={activePanelId}
      type="editable-card"
      items={tabItems}
      onEdit={handleTabEdit}
      tabBarExtraContent={
        <div
          style={{ display: 'flex', flexDirection: 'row', padding: '0 12px' }}
        >
          <div
            style={{
              height: 12,
              width: 1,
              marginTop: 18,
              background: '#f1e5de',
            }}
          />
          <div className={styles.cleanupBtn} onClick={handleCleanup}>
            <ClearOutlined style={{ fontSize: 18 }} />
          </div>
        </div>
      }
    />
  );
};

export default NavTabBar;
