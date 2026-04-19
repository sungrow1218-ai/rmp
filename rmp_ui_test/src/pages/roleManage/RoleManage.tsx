import React from 'react';
import withKeepAlive from '@/wrappers/KeepAlive';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import { MyList } from '@/hooks/useListClick';
import styles from './styles.less';
import RoleList from './components/RoleList';
import RolePermisson from './components/rolePermisson/RolePermisson';
import TitleImgSrc from '@/assets/common/card-title-icon.png';

const RoleManage = () => (
  // MyList 作为 ListContext 的 Provider，将权限状态、角色列表、数据更新方法等共享给子组件（如 RoleManageAuth）。子组件通过 useContext(ListContext) 访问这些状态，避免逐层传递 props。
  <MyList>
    <div className={styles.pageStyle}>
      <div className={styles.left}>
        <RoleList />
      </div>
      <div className={styles.right}>
        <div className={styles.title}>
          <img src={TitleImgSrc} style={{ width: '24px', height: '24px' }} />
          <span>角色权限</span>
        </div>
        <RolePermisson />
      </div>
    </div>
  </MyList>
);

export default withKeepAlive({ cacheKey: KEEPALIVE_CACHE_KEY.ROLE_MANAGE })(
  RoleManage
);
