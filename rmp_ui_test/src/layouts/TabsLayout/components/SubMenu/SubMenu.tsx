import React, { useCallback, useMemo, useState } from 'react';
import styles from './styles.less';
import { useMenuFunc } from '@/hooks';
import useMenuInfo from '@/hooks/useMenuInfo';
import { useHistory } from '@oula/oula';
import { IconMap, IconSelectedMap } from './data';

const SubMenu = () => {
  const { menuItemConfig, menuIdToPathMap } = useMenuFunc();
  const menuInfo = useMenuInfo();
  const { push } = useHistory();
  const [hoverKey, setHoverKey] = useState<string>();

  const getParentMenu = useMemo(() => {
    if (menuInfo && menuItemConfig) {
      const { parentMenuId } = menuInfo;
      return menuItemConfig?.find((i) => i.key === `${parentMenuId!}`);
    }
    return null;
  }, [menuInfo, menuItemConfig]);

  const getMenuList = useMemo(() => {
    if (getParentMenu) {
      return getParentMenu.children || [];
    } else {
      return [];
    }
  }, [getParentMenu]);

  const transformMenuIdtoPath = useCallback(
    (menuId?: number) => {
      return menuIdToPathMap?.[menuId || -1] || '';
    },
    [menuIdToPathMap]
  );

  const handleMenuClick = useCallback(
    (key: string) => {
      const clickedMenuIdStr = key || '';
      const clickedMenuId = Number(clickedMenuIdStr);
      if (!clickedMenuIdStr || Number.isNaN(clickedMenuId)) {
        return;
      }
      const menuPathToOpen = transformMenuIdtoPath(clickedMenuId);
      if (!menuPathToOpen) {
        return;
      }
      push(menuPathToOpen);
    },
    [transformMenuIdtoPath]
  );

  if (menuInfo && getParentMenu) {
    return (
      <div className={styles.subMenuWrap}>
        {/* 父级/根菜单项 - 扁平化设计 */}
        <div className={styles.parentMenuItem}>
          <div className={styles.parentMenuContent}>
            <div className={styles.parentMenuIcon}>
              <img src={IconMap[getParentMenu.label]} alt="icon" />
            </div>
            <div className={styles.parentMenuLabel}>
              {getParentMenu.label}
            </div>
          </div>
        </div>

        {/* 子菜单列表容器 - 白色背景面板 */}
        <div className={styles.subMenuListContainer}>
          <div className={styles.subMenuListPanel}>
            {getMenuList.map((item) => (
              <div
                key={item.key}
                className={
                  menuInfo && item.key === `${menuInfo.menuId}`
                    ? `${styles.subMenuItem} ${styles.subMenuItemSelected}`
                    : styles.subMenuItem
                }
                onClick={() => handleMenuClick(item.key)}
                onMouseEnter={() => setHoverKey(item.key)}
                onMouseLeave={() => setHoverKey(undefined)}
              >
                {(menuInfo && item.key === `${menuInfo.menuId}`) ||
                hoverKey === item.key ? (
                  <img src={IconSelectedMap[item.label]} alt="selected icon" />
                ) : (
                  <img src={IconMap[item.label]} alt="icon" />
                )}
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default SubMenu;
