import React, { useState } from 'react';
import styles from './styles.less';
import { Radio } from 'antd';
import PrimaryTable from './PrimaryTable';
import KindTable from './KindTable';

const InfofuturesAndOptions = () => {
  const [selected, setSelected] = useState('primary');

  return (
    <div className={styles.pageStyle}>
      <Radio.Group
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{ marginBottom: '16px' }}
      >
        <Radio.Button value="primary">贵金属基本信息</Radio.Button>
        <Radio.Button value="kind">贵金属品种</Radio.Button>
      </Radio.Group>
      <div className={styles.content}>
        {selected === 'primary' ? <PrimaryTable /> : null}
        {selected === 'kind' ? <KindTable /> : null}
      </div>
    </div>
  );
};

export default InfofuturesAndOptions;
