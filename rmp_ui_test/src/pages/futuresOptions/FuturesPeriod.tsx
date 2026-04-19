import React, { useMemo, useRef, useState } from 'react';
import { Empty, Tabs } from '@ht/sprite-ui';
import withKeepAlive from '@/wrappers/KeepAlive';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';

import Card from '@/components/Card';
import LeftGroup from './components/leftGroup';
import Futures from './components/Fututres';

import styles from './style.less';
import { useFuturAuthHook } from './components/auth';
import { useHeightResize } from '@/hooks';
import CardTitle from '@/components/CardTitle';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import PageTitle from '@/components/PageTitle';

const { TabPane } = Tabs;

const FuturestPeriod = () => {
  const [groupKey, setGroupKey] = useState(0);
  const [tabKey, setTabKey] = useState('1');
  const [groupAuth, setGroupAuth] = useState(false);
  const onChange = (key: string) => {
    setTabKey(key);
  };
  const menuFunAuth = useFuturAuthHook();
  const handleChangeGroupKey = (value: number, isAuth: boolean) => {
    setGroupKey(value);
    setGroupAuth(isAuth);
  };

  const cardRef = useRef(null);
  const size = useHeightResize(cardRef);
  return (
    <div
      ref={cardRef}
      className={styles.pageStyle}
      style={{ minWidth: '1700px' }}
    >
      <PageTitle
        title="期货期权限仓管理"
        showIcon={true}
        popRender={
          <>
            鉴于交易所针对期货期权持仓限额的规定一般包括：品种、时间段、合约月份、市场总持仓规模、投资类型，{' '}
            <br />
            且期货和期权一般分开计算，因此将限仓分为期货限仓和期权限仓两类，
            <br />
            基于不同目的设置的限仓数据可能不同，因此引入限仓分组的概念，一组限仓可以是根据相同投资类型进行设置的，{' '}
            <br />
            也可能是根据不同用户进行设置的，设置风控规则时绑定一组限仓，实现持仓集中度、交易额等风控规则的快速配置
            <br />
          </>
        }
      />
      <div className={styles.content}>
        <LeftGroup
          size={size}
          menuFunAuth={menuFunAuth}
          handleChangeGroupKey={handleChangeGroupKey}
          groupKey={groupKey}
        />
        <div className={styles.futuresPeriod}>
          <CardTitle title="期货/期权限仓设置" />
          <div className={styles.tabsBase} style={{ flex: '1 auto' }}>
            <Tabs defaultActiveKey={'1'} onChange={onChange}>
              <TabPane tab="期货限仓" key="1">
                {groupKey || groupKey === 0 ? (
                  <Futures
                    menuFunAuth={menuFunAuth}
                    groupAuth={groupAuth}
                    tabKey={tabKey}
                    groupId={groupKey}
                    size={size}
                  />
                ) : (
                  <Empty
                    className={styles.futuresEmpty}
                    image={NoDataSimpleSvg}
                    description={'暂无数据'}
                  />
                )}
              </TabPane>
              <TabPane tab="期权限仓" key="2">
                {groupKey || groupKey === 0 ? (
                  <Futures
                    groupAuth={groupAuth}
                    menuFunAuth={menuFunAuth}
                    tabKey={tabKey}
                    groupId={groupKey}
                    size={size}
                  />
                ) : (
                  <Empty
                    className={styles.futuresEmpty}
                    image={NoDataSimpleSvg}
                    description={'暂无数据'}
                  />
                )}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withKeepAlive({
  cacheKey: KEEPALIVE_CACHE_KEY.FUTURES_OPTIONS,
})(FuturestPeriod);
