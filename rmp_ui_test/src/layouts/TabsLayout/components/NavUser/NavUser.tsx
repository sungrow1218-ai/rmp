import React, { useEffect, useMemo, useState, type FC } from 'react';
import {
  Dropdown,
  Space,
  type MenuProps,
  Badge,
  Popover,
  Button,
} from '@ht/sprite-ui';
import { Menu } from 'antd';
import { CaretDownOutlined, PoweroffOutlined } from '@ht-icons/sprite-ui-react';
import tipSvg from '@/assets/layout/tip.svg';
import { UserInfoResponseDataType } from '@/services/auth/index';
import DemoAvatarImg from '@/assets/layout/demo-avatar.webp';
import styles from './style.less';
import projectBStyles from '../../projectBStyles.less';
import { queryPendingCount } from '@/services/process';
import { useHistory } from '@oula/oula';
import { useMenuFunc } from '@/hooks';
import { eventBus } from '@/event-bus';

interface NavUserProps {
  onLogout: () => void;
  /**
   * 用户信息
   */
  userInfo?: UserInfoResponseDataType;
}

const NavUser: FC<NavUserProps> = ({ onLogout, userInfo }) => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const history = useHistory();
  const menuArry = useMenuFunc();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'LOGOUT') {
      onLogout();
      setOpen(false);
    }
  };

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };
  const fetch = async () => {
    try {
      const pendingRes = await queryPendingCount();

      if (pendingRes.code !== 0) {
        throw new Error('查询当前登录人待办条数失败');
      } else if (pendingRes.data?.resultList) {
        setCount(pendingRes.data?.resultList[0]?.pendingCount ?? 0);
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    const callback = () => {
      fetch();
    };
    eventBus.on('data-updated', callback);
    return () => {
      eventBus.off('data-updated', callback);
    };
  }, []);

  const isHaveProcess = useMemo(() => {
    if (menuArry) {
      const haveProcessMenu = menuArry.flatMenuData?.find((it) => {
        return it.menuId === 401;
      });
      if (haveProcessMenu) {
        return true;
      }
      return false;
    }
    return false;
  }, [menuArry]);

  const menu = (
    <Menu
      style={{ marginTop: 22, minWidth: 150 }}
      onClick={handleMenuClick}
      items={[
        {
          label: '退出登录',
          key: 'LOGOUT',
          icon: <PoweroffOutlined />,
        },
      ]}
    />
  );

  const clickJump = () => {
    history.push('/affairs/processManage?myList=1');
  };
  const content = (
    <div
      style={{
        display: 'flex',
        width: '248px',
        justifyContent: 'space-between',
        cursor: 'pointer',
      }}
      onClick={clickJump}
    >
      <Button type="link">我的待办</Button>
      <Button type="link">{count} 条</Button>
    </div>
  );

  return (
    <div className={styles.container}>
      {isHaveProcess && (
        <Popover placement="bottomRight" content={content} trigger="hover">
          <div
            style={{ display: 'flex', width: '48px' }}
            className={styles.badge}
          >
            <Badge
              className={styles.badge}
              count={count}
              // overflowCount={10}
              size="small"
            >
              <img
                src={tipSvg}
                alt=""
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </Badge>
          </div>
        </Popover>
      )}
      {/* 通知图标 - 参考项目B */}
      <div className={projectBStyles.notificationBadge} style={{ cursor: 'pointer' }}>
        <div className={projectBStyles.notificationDot}></div>
      </div>
      <div className={styles.avatar}>
        <img src={DemoAvatarImg} />
      </div>
      <Dropdown
        overlay={menu}
        open={open}
        onOpenChange={handleOpenChange}
        overlayClassName={projectBStyles.userDropdownMenu}
      >
        <a className={styles.name}>
          <Space>
            {userInfo?.displayName}
            <CaretDownOutlined />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default NavUser;
