import React, { useRef, useState } from 'react';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import withKeepAlive from '@/wrappers/KeepAlive';
import GroupListContain from './leftGroup';
import RightTable from './RightTable';
import styles from './styles.less';
import { Empty } from 'antd';
import { useHeightResize } from '@/hooks';
import { useAuthHook } from '@/hooks/useAuthhook';
import CardTitle from '@/components/CardTitle';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import PageTitle from '@/components/PageTitle';

const GeneralLimitMain = () => {
  const [groupKey, setGroupKey] = useState<number | undefined>(undefined);
  const [dataAuth, setDataAuth] = useState(false);
  const handleChangeGroupKey = (
    value: number | undefined,
    dataAuth: boolean
  ) => {
    setGroupKey(value);
    setDataAuth(dataAuth);
  };
  const ref = useRef(null);
  const size = useHeightResize(ref);

  const { menuAuth } = useAuthHook();

  return (
    <div className={styles.pageStyle} ref={ref}>
      <PageTitle
        title="通用限仓管理"
        showIcon={true}
        popRender={
          <>
            交易所针对股票、债券等证券有集中度的监管要求， <br />
            按照同一实控人计算，总持仓不超过证券总股本/债券发行余额的X%， <br />
            因此针对集中度风控指标规则，通过通用限仓功能统一管理特定证券的限仓值，{' '}
            <br />
            集中度规则中关联通用限仓分组，实现集中度规则的快速配置
          </>
        }
      />
      <div className={styles.content}>
        <GroupListContain
          menuAuth={menuAuth}
          handleChangeGroupKey={handleChangeGroupKey}
          groupKey={groupKey}
          size={size}
        />
        <div className={styles.right}>
          <CardTitle title="通用限仓明细" />
          {groupKey || groupKey === 0 ? (
            <RightTable
              groupKey={groupKey}
              size={size}
              menuAuth={menuAuth}
              dataAuth={dataAuth}
            />
          ) : (
            <Empty
              className={styles.futuresEmpty}
              image={NoDataSimpleSvg}
              description={'暂无数据'}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default withKeepAlive({
  cacheKey: KEEPALIVE_CACHE_KEY.GENERAL_LIMIT,
})(GeneralLimitMain);
