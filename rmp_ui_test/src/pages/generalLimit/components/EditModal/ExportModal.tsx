import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, message, Modal, Table } from 'antd';

import styles from '@/pages/securityPool/style.less';

import { useLockFn } from 'ahooks';
import { v4 as uuidv4 } from 'uuid';
import {
  getColumnsFault,
  getColumnsResult,
  ResultValiTable,
} from '../../untils';

import {
  alterGeneralLimitDetail,
  FaultListType,
} from '@/services/generalLimit';
import { PagenationState } from '@/pages/securityPool/contants/tyeping';

interface Props {
  groupKey: number;
  title: string;
  mode: string;
  hasFooter: boolean;
  tableLoading: boolean;
  tableData: ResultValiTable[];
  exportOpen: boolean;
  updateData: (isOpen: boolean, resList?: any) => void;
  afterSubmit?: () => void;
  afterCancel?: () => void;
}

const ExportModal: React.FC<Props> = ({
  groupKey,
  title,
  mode,
  hasFooter,
  tableLoading,
  tableData,
  exportOpen,
  updateData,
  afterSubmit,
  afterCancel,
}) => {
  const [errResultList, setErrResultList] = useState<FaultListType[]>([]);
  const [dataList, setDataList] = useState<ResultValiTable[]>([]);
  const [pagination, setPagination] = useState<PagenationState>({
    pageId: 1,
    showSizeChanger: false,
    total: 0,
  });
  const [btnLoading, setBtnLoading] = useState(false);

  const handleCancel = () => {
    if (!mode) {
      updateData(false, []);
    } else {
      updateData(false);
    }
    afterCancel && afterCancel();
  };
  const handleSubmit = useLockFn(async () => {
    const tableDataSuccess = dataList?.map((p) => {
      return {
        securityCode: p.securityCode,
        marketId: Number(p.marketId),
        limitValue: p.limitValue ? Number(p.limitValue) / 100 : 0,
      };
    });
    if (tableDataSuccess.length > 0) {
      try {
        setBtnLoading(true);
        const securityPoolDetailRes = await alterGeneralLimitDetail({
          alterType: 1,
          groupId: groupKey,
          poolSecurityList: tableDataSuccess,
        });
        if (securityPoolDetailRes.code !== 0) {
          // message.error(securityPoolDetailRes.message);
        } else if (
          securityPoolDetailRes.data &&
          Array.isArray(securityPoolDetailRes.data.faultList) &&
          securityPoolDetailRes.data.faultList.length > 0
        ) {
          const resultList = securityPoolDetailRes.data.faultList?.map((a) => {
            return {
              ...a,
              key: uuidv4(),
            };
          });
          setErrResultList(resultList);
          setPagination({ ...pagination, total: resultList.length });

          updateData(true, resultList);
        } else {
          updateData(false, []);
          message.success({ content: '提交成功' });
        }
      } catch (error) {
      } finally {
        setBtnLoading(false); // 无论请求成功还是失败，最后都要将加载状态设置为 false
      }
    } else {
      message.error('有效数据为0');
      updateData(false);
    }
    afterSubmit && afterSubmit();
  });

  const recordResLen = useMemo(() => {
    const slenData = tableData.filter((d) => d.reuslt === 1);
    const slen = slenData.length;
    setDataList(slenData);
    setPagination({ ...pagination, total: tableData.length });
    const elen = tableData.filter((d) => d.reuslt === 0).length;
    return {
      success: slen,
      error: elen,
    };
  }, [tableData]);
  return (
    <Modal
      title={title}
      destroyOnClose={true}
      open={exportOpen}
      maskClosable={false}
      centered={true}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={1160}
      wrapClassName={styles.exportModal}
      footer={
        hasFooter
          ? [
              <Button key="back" onClick={handleCancel}>
                取消
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={handleSubmit}
                loading={btnLoading}
              >
                确认
              </Button>,
            ]
          : null
      }
    >
      {mode === 'Add' ? (
        <div key="footer-text" className={styles.tips}>
          本次共导入{tableData.length}
          条，无效数据{recordResLen.error}条，有效数据
          {recordResLen.success}
          条，是否继续导入？
        </div>
      ) : (
        <div key="footer-tips" className={styles.tips}>
          本次导入失败{errResultList.length}条
        </div>
      )}

      <Table
        columns={mode === 'Add' ? getColumnsResult() : getColumnsFault()}
        size="small"
        dataSource={tableData ?? []}
        loading={tableLoading}
        pagination={pagination}
      />
    </Modal>
  );
};

export default ExportModal;
