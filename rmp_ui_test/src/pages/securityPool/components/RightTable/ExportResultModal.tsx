import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, message, Modal } from '@ht/sprite-ui';
import {
  getColumnsRes,
  getColumnsAltRes,
} from '@/pages/securityPool/contants/contants';
import styles from '@/pages/securityPool/style.less';
import { useUserRoles } from '@/hooks';
import moment from 'moment';
import { useLockFn } from 'ahooks';
import { v4 as uuidv4 } from 'uuid';

import PoolDetailModalTable from './PoolDetailModalTable';
import {
  FaultListType,
  PagenationState,
  QuerySecuPoolRspDTO,
} from '../../contants/tyeping';
import { messageDetailInfo } from '../EditPoolLevelModal/PoolForm/message';
import { alterSecurityPoolDetail } from '@/services/securityPool/index';

interface Props {
  title: string;
  mode: string;
  hasFooter: boolean;
  tableLoading: boolean;
  tableData: QuerySecuPoolRspDTO[];
  visible: boolean;
  updateData: (p: any, q?: any, fields?: number) => void;
  treeKey: number | undefined;
  afterSubmit: () => void;
}

const ExportResultModal: React.FC<Props> = ({
  title,
  mode,
  hasFooter,
  tableLoading,
  tableData,
  visible,
  updateData,
  treeKey,
  afterSubmit,
}) => {
  const [errResultList, setErrResultList] = useState<FaultListType[]>([]);
  const [dataList, setDataList] = useState<QuerySecuPoolRspDTO[]>([]);
  const [pagination, setPagination] = useState<PagenationState>({
    pageId: 1,
    showSizeChanger: false,
    total: 0,
    pageSize: 10,
  });
  const [btnLoading, setBtnLoading] = useState(false);

  const handleCancel = () => {
    if (!mode) {
      updateData(false, []);
    } else {
      updateData(false);
    }
  };
  const handleSubmit = useLockFn(async () => {
    const tableDataSuccess = dataList?.map((p) => {
      return {
        securityCode: p.securityCode,
        marketId: Number(p.marketId),
        effectBeginDate:
          p.effectBeginDate && mode === 'ADD'
            ? moment(p.effectBeginDate).format('YYYYMMDD')
            : '',
        effectEndDate:
          p.effectEndDate && mode === 'ADD'
            ? moment(p.effectEndDate).format('YYYYMMDD')
            : '',
        remark: p.remark ?? '',
      };
    });
    if (tableDataSuccess.length > 0) {
      try {
        setBtnLoading(true);
        const securityPoolDetailRes = await alterSecurityPoolDetail({
          modifyType: mode === 'ADD' ? 1 : 3,
          secuPoolId: treeKey as number,
          poolSecurityList: tableDataSuccess as any[],
        });
        if (securityPoolDetailRes.code === 145003) {
          updateData(false, []);
          message.success({
            content: messageDetailInfo(mode === 'ADD' ? 1 : 3),
          });
          afterSubmit();
        } else if (securityPoolDetailRes.code !== 0) {
          afterSubmit();
          // message.error(securityPoolDetailRes.message);
        } else if (
          securityPoolDetailRes.data &&
          Array.isArray(securityPoolDetailRes.data.faultList) &&
          securityPoolDetailRes.data.faultList.length > 0
        ) {
          afterSubmit();
          const resultList = securityPoolDetailRes.data.faultList?.map((a) => {
            return {
              ...a,
              key: uuidv4(),
            };
          });
          setErrResultList(resultList);
          setPagination({ ...pagination, total: resultList.length });

          updateData(true, resultList, mode === 'ADD' ? 1 : 3);
        } else {
          updateData(false, []);
          message.success({ content: '提交成功' });
          afterSubmit();
        }
      } catch (error) {
      } finally {
        setBtnLoading(false); // 无论请求成功还是失败，最后都要将加载状态设置为 false
      }
    } else {
      message.error('有效数据为0');
      updateData(false);
    }
  });

  const recordResLen = useMemo(() => {
    const slenData = tableData.filter((d) => d.reuslt === 1);
    const slen = slenData.length;
    setDataList(slenData);
    const elen = tableData.filter((d) => d.reuslt === 0).length;
    setPagination({ ...pagination, total: tableData.length });
    return {
      success: slen,
      error: elen,
    };
  }, [tableData]);
  return (
    <Modal
      title={title}
      destroyOnClose={true}
      open={visible}
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
      {['ADD', 'DELETE'].includes(mode) ? (
        <div key="footer-text" className={styles.tips}>
          本次共{title.includes('批量删除') ? '批量删除' : '导入'}
          {tableData.length}
          条，无效数据{recordResLen.error}条，有效数据
          {recordResLen.success}
          条，是否继续{title.includes('批量删除') ? '' : '导入'}？
        </div>
      ) : (
        <div key="footer-tips" className={styles.tips}>
          本次{title.includes('批量删除') ? '批量删除' : '导入'}失败
          {errResultList.length}条
        </div>
      )}
      <PoolDetailModalTable
        tableLoading={tableLoading}
        tableData={tableData}
        isDiy={true}
        columnsDiy={
          ['ADD', 'DELETE'].includes(mode)
            ? getColumnsRes(mode)
            : getColumnsAltRes()
        }
        pagination={pagination}
      />
    </Modal>
  );
};

export default ExportResultModal;
