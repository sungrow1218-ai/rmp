import React from 'react';
import { Form, Modal, Table } from '@ht/sprite-ui';
import { getColumns } from '@/pages/generalLimit/untils';

interface Props {
  data: any;
  setOpen: (value: boolean) => void;
}

const GeneralLimitDetail = ({ data, setOpen }: Props) => {
  return (
    <div>
      <Modal
        open={true}
        width={1250}
        onCancel={() => {
          setOpen(false);
        }}
        footer={[]}
        title={'通用限仓明细'}
      >
        <div>
          <Table
            columns={getColumns()}
            dataSource={[data]}
            pagination={false}
          />
        </div>
      </Modal>
    </div>
  );
};
export default GeneralLimitDetail;
