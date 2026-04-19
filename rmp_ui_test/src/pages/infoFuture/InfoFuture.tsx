import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.less';
import { Radio } from 'antd';

import {
  columnFutures,
  columnFuturesKind,
  columnContract,
} from './futuresData';
import { FORM_MODE } from './data';
import EditModal from './EditModal';
import { IAction as ModalAction } from './types';
import FuturesManagement, {
  FuturesManagementAction,
} from './FuturesManagement';
import FuturesKindManagement from './FuturesKindManagement';
import ArbitrageContractManagement from './ArbitrageContractManagement';

type TabKey = 'future' | 'futurekind' | 'contract';

const InfoFuture = () => {
  const modalRef = useRef<ModalAction>(null);

  const futureRef = useRef<FuturesManagementAction>(null);
  const futureKindRef = useRef<any>(null);
  const contractRef = useRef<any>(null);

  const [selected, setSelected] = useState<TabKey>('future');

  useEffect(() => {
    futureRef.current?.reload();
  }, []);

  const handleFuturesAdd = () => {
    modalRef.current?.open(FORM_MODE.ADD, 'futures');
  };

  const handleFuturesKindAdd = () => {
    modalRef.current?.open(FORM_MODE.ADD, 'futuresKind');
  };

  const handleContractAdd = () => {
    modalRef.current?.open(FORM_MODE.ADD, 'contract');
  };

  const handleFuturesEdit = (record: any) => {
    modalRef.current?.open(FORM_MODE.EDIT, 'futures', record);
  };

  const handleFuturesKindEdit = (record: any) => {
    modalRef.current?.open(FORM_MODE.EDIT, 'futuresKind', record);
  };

  const handleContractEdit = (record: any) => {
    modalRef.current?.open(FORM_MODE.EDIT, 'contract', record);
  };

  const triggerReloadByTab = (tab: TabKey) => {
    if (tab === 'future') futureRef.current?.reload();
    if (tab === 'futurekind') futureKindRef.current?.reload?.();
    if (tab === 'contract') contractRef.current?.reload?.();
  };

  return (
    <div className={styles.pageStyle}>
      <Radio.Group
        value={selected}
        onChange={(e) => {
          const next = e.target.value as TabKey;
          setSelected(next);
          triggerReloadByTab(next);
        }}
        style={{ marginBottom: '16px' }}
      >
        <Radio.Button value="future">期货信息管理</Radio.Button>
        <Radio.Button value="futurekind">期货品种管理</Radio.Button>
        <Radio.Button value="contract">套利合约信息管理</Radio.Button>
      </Radio.Group>

      <div className={styles.content}>
        {selected === 'future' && (
          <div className={styles.contentChild}>
            <FuturesManagement
              ref={futureRef}
              columns={columnFutures}
              onAdd={handleFuturesAdd}
              onEdit={handleFuturesEdit}
            />
          </div>
        )}

        {selected === 'futurekind' && (
          <div className={styles.contentChild}>
            <FuturesKindManagement
              ref={futureKindRef}
              columns={columnFuturesKind}
              onAdd={handleFuturesKindAdd}
              onEdit={handleFuturesKindEdit}
            />
          </div>
        )}

        {selected === 'contract' && (
          <div className={styles.contentChild}>
            <ArbitrageContractManagement
              ref={contractRef}
              columns={columnContract}
              onAdd={handleContractAdd}
              onEdit={handleContractEdit}
            />
          </div>
        )}
      </div>

      <EditModal
        ref={modalRef}
        onRefresh={() => {
          triggerReloadByTab(selected);
        }}
      />
    </div>
  );
};

export default InfoFuture;
