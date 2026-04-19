import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import withKeepAlive from '@/wrappers/KeepAlive';
import { Tabs, TabsProps } from 'antd';
import React, { useState } from 'react';
import styles from './styles.less';
import ExchangeGateWay from './components/ExchangeGateWay';
import VirtualGateWay from './components/VirtualGateway';
import VirtualTGWRouter from './components/VirtualTGWRouter';

const OfferManageMain = () => {
  const [tabKey, setTabKey] = useState('1');
  const onChange = (key: string) => {
    setTabKey(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '交易所网关维护',
      children: <ExchangeGateWay />,
    },
    {
      key: '2',
      label: '虚拟网关维护',
      children: <VirtualGateWay />,
    },
    {
      key: '3',
      label: '报盘路由维护',
      children: <VirtualTGWRouter />,
    },
  ];
  return (
    <div className={styles.OfferManageMain}>
      <span
        style={{
          fontSize: '18px',
          fontWeight: 600,
          letterSpacing: '1px',
          paddingBottom: '16px',
        }}
      >
        报盘端接入管理
      </span>
      <div className={styles.tabsBox}>
        <Tabs items={items} activeKey={tabKey} onChange={onChange} />
      </div>
    </div>
  );
};

export default withKeepAlive({
  cacheKey: KEEPALIVE_CACHE_KEY.OFFER_ACCESS_MANAGE,
})(OfferManageMain);
