import React, { useMemo, type FC } from 'react';
import { Menu, ConfigProvider } from '@ht/sprite-ui';
import { type MenuItemProps } from '@/wrappers/MenuFunc/MenuFuncContext';
import styles from './styles.less';
import projectBStyles from '../../projectBStyles.less';

interface Props {
  menuData: MenuItemProps[];
  activeId: string;
  onClick: (e: { key: string }) => void;
}

const NavMenu: FC<Props> = ({ menuData, activeId, onClick }) => {
  const getMenuItems = useMemo(() => {
    const result = [];
    for (const { label, key } of menuData) {
      result.push({
        label: <span>{label}</span>, // 移除下拉箭头
        key,
        // 不传递 children 属性，这样就不会显示二级菜单
      });
    }
    return result;
  }, [menuData]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            activeBarHeight: 3,
            itemHeight: 36,
            itemMarginBlock: 0,
            itemMarginInline: 0,
          },
        },
      }}
    >
      <Menu
        mode="horizontal"
        theme="dark"
        className={`${styles.navMenu} ${projectBStyles.customTopMenu}`}
        style={{
          height: '56px',
          lineHeight: '56px',
          background: 'transparent',
          width: '100%',
        }}
        selectedKeys={[activeId]}
        onClick={onClick}
        items={getMenuItems}
        // 移除 onOpenChange 和 triggerSubMenuAction，因为不显示二级菜单了
      />
    </ConfigProvider>
  );
};

export default NavMenu;
