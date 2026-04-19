import React, { useEffect, useMemo } from 'react';
import { Form, Input, Modal, Select } from '@ht/sprite-ui';

import { TRADING_MARKETS } from '@/utils/dict';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';

import { WorkGroupList } from '@/services/account';

const FormItem = Form.Item;
const { TextArea } = Input;

interface Props {
  data: any;
  setOpen: (value: boolean) => void;
  workGroupList: WorkGroupList[];
}

const SeatGroupDetail: React.FC<Props> = ({ data, workGroupList, setOpen }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...data });
  }, [data, form]);

  const optionWork = useMemo(() => {
    // if (workGroupList) return [];
    return workGroupList?.map((p) => {
      return {
        label: p.workGroupName,
        value: p.workGroupId,
      };
    });
  }, [workGroupList]);

  return (
    <div>
      <Modal
        width={528}
        open={true}
        centered={true}
        onCancel={() => {
          setOpen(false);
        }}
        title={'分组详情'}
        footer={[]}
      >
        <Form
          name="poolLevel"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          disabled={true}
          form={form}
          style={{
            width: '100%',
            marginTop: '12px',
          }}
        >
          <FormItem
            label="隶属工作台"
            name="workGroupId"
            rules={[{ required: true, message: '选项必填' }]}
          >
            <Select options={optionWork} value={data.workGroupId} />
          </FormItem>
          <FormItem label="分组序号" name="seatGroupId">
            <Input placeholder="自动生成" disabled={true} />
          </FormItem>
          <FormItem
            label="分组名称"
            name="seatGroupName"
            rules={[
              {
                required: true,
                message: '选项必填',
                transform: (value: string) => value.trim(),
              },
            ]}
          >
            <Input maxLength={30} placeholder="分组名称最长30个字符" />
          </FormItem>
          <Form.Item
            label="交易所"
            name="marketId"
            rules={[
              {
                required: true,
                message: '选项必填',
              },
            ]}
          >
            <Select
              options={transformDictToSelectOptionsNumber(
                TRADING_MARKETS.filter((tm) => ['1', '2'].includes(tm.code))
              )}
              placeholder="选择交易所"
              allowClear={true}
            />
          </Form.Item>
          <FormItem label="备注" name="remark">
            <TextArea rows={4} maxLength={100} />
          </FormItem>
        </Form>
      </Modal>
      ( )
    </div>
  );
};

export default SeatGroupDetail;
