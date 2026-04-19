import React, { useMemo, useState } from 'react';
import withKeepAlive from '@/wrappers/KeepAlive';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import LeftSide from './Left';
import RightAuthTable from './RightAuth';
import styles from './style.less';
import { SeatGroupState } from './contants/tyeping';
import { useAuthHook } from '@/hooks/useAuthhook';
import { useUserRoles } from '@/hooks';
import { FUNC_TYPE, USE_AUTH } from '@/enum';
import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import PageTitle from '@/components/PageTitle';

const SeatGroup = () => {
  const [key, setKey] = useState<string>();
  const [reocord, setRecord] = useState<SeatGroupState | undefined>();

  // 当用户选择不同席位组时，更新key和record
  const changeKey = (value: { key: any; record: SeatGroupState }) => {
    setKey(value.key);
    setRecord(value.record);
  };

  const { menuAuth, workGroupAuth } = useAuthHook();

  const { activeRoleId } = useUserRoles();

  // 权限-读写
  const operatePermission = useMemo(() => {
    if (menuAuth) {
      const auth =
        menuAuth.functionAuthList?.find(
          (item) => item.functionId === FUNC_TYPE.OPERATE
        )?.useAuth === USE_AUTH.USED;
      return !!auth;
    }
    return false;
  }, [menuAuth]);

  // 权限-数据
  const dataPermission = (data: Recordable & { createRoleId: number }) => {
    if (data) {
      return data.createRoleId === activeRoleId;
    }
    return false;
  };

  return (
    <div className={styles.pageStyle}>
      <PageTitle
        title="席位组管理"
        showIcon={true}
        popRender={
          <>
            席位池通过在线添加席位列表创建，支持按席位编码、名称筛选明细，{' '}
            <br />
            目前仅“资金前端控制”风控规则可用席位组账户类型控制。
          </>
        }
      />
      <div className={styles.content}>
        <div className={styles.left}>
          <LeftSide
            changeKey={changeKey}
            menuAuth={menuAuth}
            workGroupAuth={workGroupAuth}
          />
        </div>
        <div className={styles.right}>
          <RightAuthTable
            selectKey={key}
            selectRecord={reocord}
            permission={operatePermission && dataPermission(reocord as any)}
          />
        </div>
      </div>
    </div>
  );
};

// 将SeatGroup 组件包裹在 withKeepAlive 中，使其具有缓存功能。cacheKey 用于标识该组件的缓存键名，确保组件的状态在离开页面后仍能保留
export default withKeepAlive({ cacheKey: KEEPALIVE_CACHE_KEY.SEAT_GROUP })(
  SeatGroup
);
