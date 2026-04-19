import React from 'react';
import withKeepAlive from '@/wrappers/KeepAlive';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import ProcessWrap from './ProcessWrap';
import styles from './styles.less';

const ProcessManage = () => {
  return (
    <div className={`${styles.process}`}>
      <ProcessWrap />
    </div>
  );
};
export default withKeepAlive({ cacheKey: KEEPALIVE_CACHE_KEY.PROCESS_MANAGE })(
  ProcessManage
);
