import React, { useState } from 'react';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import withKeepAlive from '@/wrappers/KeepAlive';
import Search from './Search';
import List from './List';
import styles from './style.less';
import { useAuthHook } from '@/hooks/useAuthhook';
import PageTitle from '@/components/PageTitle';

const DynamicDimension = () => {
  // 选中动态维度
  const [selected, setSelected] = useState<Nullable<Recordable>>(null);

  // 处理选中
  const handleSelect = (record: Recordable | null) => {
    setSelected(record);
  };

  const { menuAuth } = useAuthHook();

  return (
    <div className={styles.pageBox}>
      <PageTitle
        showIcon={true}
        title="动态维度管理"
        popRender={
          <>
            可自定义证券条件，系统自动从证券库过滤满足条件的证券，证券范围动态更新，{' '}
            <br />
            如按特定交易市场和证券类别自定义条件，有新增符合条件证券会自动更新列表。
          </>
        }
      />
      <div className={styles.pageStyle}>
        <div className={styles.left}>
          <Search onSelect={handleSelect} menuAuth={menuAuth} />
        </div>
        <div className={styles.right}>
          <List selected={selected} menuAuth={menuAuth} />
        </div>
      </div>
    </div>
  );
};

export default withKeepAlive({
  cacheKey: KEEPALIVE_CACHE_KEY.DYNAMIC_DIMENSION,
})(DynamicDimension);
