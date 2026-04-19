import React, { useState } from 'react';
import styles from './styles.less';
import { Radio } from 'antd';
import FundTable from './FundTable';
import ETFTable from './ETFTable';
import { FundItem } from '@/services/securityInfo';

const InfoFund = () => {
  const [selected, setSelected] = useState('fund');

  const [linkFund, setLinkFund] = useState<FundItem>();

  return (
    <div className={styles.pageStyle}>
      <Radio.Group
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{ marginBottom: '16px' }}
      >
        <Radio.Button value="fund">基金信息</Radio.Button>
        <Radio.Button value="etf">ETF成分券明细</Radio.Button>
      </Radio.Group>
      <div className={styles.content}>
        {selected === 'fund' ? (
          <FundTable
            onLink={(fund) => {
              setSelected('etf');
              setLinkFund(fund);
            }}
          />
        ) : null}
        {selected === 'etf' ? <ETFTable linkFund={linkFund} /> : null}
      </div>
    </div>
  );
};

export default InfoFund;
