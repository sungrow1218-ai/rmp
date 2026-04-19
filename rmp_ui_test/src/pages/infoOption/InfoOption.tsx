import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.less';
import { Radio } from 'antd';

import { columnOptions, columnOptionsKind } from './optionsData';
import { FORM_MODE } from './data';
import EditModal, { IAction as ModalAction } from './EditModal';

import OptionsManagement, {
  OptionsManagementAction,
} from './OptionsManagement';
import OptionsKindManagement, {
  OptionsKindManagementAction,
} from './OptionsKindManagement';

type TabKey = 'option' | 'optionkind';

const InfoOption = () => {
  const modalRef = useRef<ModalAction>(null);

  const optionRef = useRef<OptionsManagementAction>(null);
  const optionKindRef = useRef<OptionsKindManagementAction>(null);

  const [selected, setSelected] = useState<TabKey>('option');

  useEffect(() => {
    optionRef.current?.reload();
  }, []);

  const handleOptionsAdd = () =>
    modalRef.current?.open(FORM_MODE.ADD, 'options');
  const handleOptionsKindAdd = () =>
    modalRef.current?.open(FORM_MODE.ADD, 'optionsKind');

  const handleOptionsEdit = (record: any) =>
    modalRef.current?.open(FORM_MODE.EDIT, 'options', record);

  const handleOptionsKindEdit = (record: any) =>
    modalRef.current?.open(FORM_MODE.EDIT, 'optionsKind', record);

  const triggerReloadByTab = (tab: TabKey) => {
    if (tab === 'option') optionRef.current?.reload();
    if (tab === 'optionkind') optionKindRef.current?.reload();
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
        <Radio.Button value="option">期权信息管理</Radio.Button>
        <Radio.Button value="optionkind">期权品种管理</Radio.Button>
      </Radio.Group>

      <div className={styles.content}>
        {selected === 'option' && (
          <div className={styles.contentChild}>
            <OptionsManagement
              ref={optionRef}
              columns={columnOptions}
              onAdd={handleOptionsAdd}
              onEdit={handleOptionsEdit}
            />
          </div>
        )}

        {selected === 'optionkind' && (
          <div className={styles.contentChild}>
            <OptionsKindManagement
              ref={optionKindRef}
              columns={columnOptionsKind}
              onAdd={handleOptionsKindAdd}
              onEdit={handleOptionsKindEdit}
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

export default InfoOption;
