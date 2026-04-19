import React from 'react';
import { Form, Modal } from '@ht/sprite-ui';
import TimeForm from '@/pages/futuresOptions/components/Form/TimeForm';
import { FutureOptionList } from '@/services/FutureOption';

interface Props {
  open: boolean;
  data: any;
  setOpen: (value: boolean) => void;
}

const FuturesOptionsDetail = ({ data, setOpen, open }: Props) => {
  const [form] = Form.useForm();
  return (
    <div>
      <Modal
        open={open}
        width={750}
        onCancel={() => {
          setOpen(false);
        }}
        footer={[]}
        title={data.limitType === 1 ? '期货明细' : '期权明细'}
      >
        <TimeForm
          form={form}
          editTimeData={data as FutureOptionList}
          disabled={true}
          tabKey={data.limitType.toString()}
          timeOpen={open}
        />
      </Modal>
    </div>
  );
};
export default FuturesOptionsDetail;
