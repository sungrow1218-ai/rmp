import React, { useEffect, useState } from 'react';
import { Modal } from '@ht/sprite-ui';
import { getColumnsAltRes } from '@/pages/securityPool/contants/contants';
import styles from '@/pages/securityPool/style.less';

import PoolDetailModalTable from './PoolDetailModalTable';
import { PagenationState } from '../../contants/tyeping';

interface Props {
  mode: string;
  tableData: any[];
  visible: boolean;
  close: () => void;
}

const ResultModal: React.FC<Props> = ({ mode, tableData, visible, close }) => {
  const [pagination, setPagination] = useState<PagenationState>({
    pageId: 1,
    showSizeChanger: false,
    total: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (tableData?.length > 0) {
      setPagination({
        ...pagination,
        total: tableData.length,
      });
    }
  }, [tableData]);

  return (
    <Modal
      title={mode === 'DELETE' ? '删除结果' : '新增结果'}
      destroyOnClose={true}
      open={visible}
      maskClosable={false}
      onCancel={close}
      centered={true}
      footer={[]}
      width={1160}
      wrapClassName={styles.exportModal}
    >
      <div key="footer-tips" className={styles.tips}>
        本次{mode === 'DELETE' ? '删除' : '新增'}失败
        {tableData.length}条
      </div>

      <PoolDetailModalTable
        tableLoading={false}
        tableData={tableData}
        isDiy={true}
        columnsDiy={getColumnsAltRes()}
        pagination={pagination}
      />
    </Modal>
  );
};

export default ResultModal;
