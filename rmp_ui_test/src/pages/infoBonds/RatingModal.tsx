import { BasicTable, TableActionType } from '@/components/Table';
import {
  BondItem,
  OrganInfoItem,
  queryIssuerRating,
  queryOrganInfo,
  RatingItem,
} from '@/services/securityInfo';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export interface IAction {
  open: (bond: BondItem) => void;
}

const RatingModal = forwardRef<IAction>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const tableRef = useRef<TableActionType>(null);
  const [organList, setOrganList] = useState<OrganInfoItem[]>([]);
  const [ratingList, setRatingList] = useState<RatingItem[]>([]);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    open: async (bond) => {
      setOpen(true);
      setLoading(true);
      try {
        // 获取机构
        const organRes = await queryOrganInfo({ pageId: 1, pageSize: 5000 });
        setOrganList(organRes.data.resultList || []);
        // 获取分级
        const ratingRes = await queryIssuerRating();
        setRatingList(ratingRes.data.resultList || []);
        tableRef.current?.setTableData(
          bond.ratingInfo ? [bond.ratingInfo] : []
        );
      } catch (error: any) {
        console.error(error);
        // error.message && message.error(error.message);
      } finally {
        setLoading(false);
      }
    },
  }));

  return (
    <Modal
      title={'外部评级信息'}
      width={800}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnHidden={true}
    >
      <BasicTable
        ref={tableRef}
        loading={loading}
        columns={[
          {
            dataIndex: 'ratingOrganizationCode',
            title: '外部评级机构',
            render: (value) => {
              const target = organList.find(
                (i) => i.organizationCode === value
              );
              if (target) {
                return target.organizationName;
              } else {
                return value || '--';
              }
            },
          },
          {
            dataIndex: 'externalRating',
            title: '外部评级',
            render: (value) => {
              const target = ratingList.find((i) => i.ratingCode === value);
              if (target) {
                return target.ratingName;
              } else {
                return value || '--';
              }
            },
          },
          {
            dataIndex: 'ratingDate',
            title: '评级日期',
            render: (value) =>
              value
                ? dayjs(String(value), 'YYYYMMDD').format('YYYY-MM-DD')
                : '--',
          },
        ]}
        pagination={false}
      />
    </Modal>
  );
});

export default RatingModal;
