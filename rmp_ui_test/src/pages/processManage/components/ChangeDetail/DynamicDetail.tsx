import React, { useEffect, useState } from 'react';

import { Button, Form, Input, Modal, Table } from '@ht/sprite-ui';

import styles from './styles.less';
import Card from '@/components/Card';

import TextArea from '@ht/sprite-ui/lib/input/TextArea';
import { Condition, conditionColumns } from '@/pages/dynamicDimension/data';
import { ColumnsType } from '@ht/sprite-ui/lib/table';
import {
  Operator,
  OperatorView,
  UnitType,
  UnitView,
} from '@/pages/dynamicDimension/const';
import ConditionTable from '@/pages/dynamicDimension/components/ConditionTable';
import Explain from '@/pages/dynamicDimension/components/Explain';

interface Props {
  data: any;
  setOpen: (value: boolean) => void;
}

const DynamicDetail = ({ data, setOpen }: Props) => {
  const [form] = Form.useForm();
  const [conditions, setConditions] = useState<Condition[]>([]);

  useEffect(() => {
    form.setFieldsValue({ code: data.dyndimId, name: data.dyndimName });
  }, [data, form]);

  return (
    <div>
      <Modal
        open={true}
        width={1250}
        onCancel={() => {
          setOpen(false);
        }}
        footer={[]}
      >
        <div className={styles.wrapper}>
          <Form
            layout="inline"
            name="basic"
            disabled={true}
            form={form}
            preserve={false}
          >
            <Form.Item label="维度编号" name={'code'}>
              <Input disabled={true} placeholder="自动生成" />
            </Form.Item>
            <Form.Item
              label="维度名称"
              name={'name'}
              rules={[
                { required: true, message: '请填写维度名称', type: 'string' },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
          <Card
            title="条件列表"
            style={{ marginTop: '24px' }}
            bodyStyle={{ padding: '16px 0' }}
          >
            <ConditionTable
              defaultConditions={data.dyndimConditionList}
              onChange={(value) => {
                setConditions(value);
              }}
              onResetExpression={() => {}}
              mode={4}
            />
          </Card>
          <Card
            title="条件计算公式"
            style={{ marginTop: '8px' }}
            bodyStyle={{ padding: '16px 0' }}
            headerRight={() => (
              <>
                <Button size="small" style={{ width: '44px' }}>
                  &#40;
                </Button>
                <Button
                  size="small"
                  style={{ width: '44px', marginLeft: '16px' }}
                >
                  &#41;
                </Button>
                <Button
                  size="small"
                  style={{ width: '44px', marginLeft: '16px' }}
                >
                  &#124;
                </Button>
                <Button
                  size="small"
                  style={{ width: '44px', marginLeft: '16px' }}
                >
                  &#38;
                </Button>
              </>
            )}
          >
            <TextArea
              rows={3}
              value={data.dyndimFormula ?? ''}
              disabled={true}
            />
          </Card>
          <Card
            title="中文描述"
            style={{ marginTop: '8px' }}
            bodyStyle={{ padding: '16px 0' }}
          >
            <Explain
              expression={data.dyndimFormula ?? ''}
              conditions={conditions}
              onChange={(status) => []}
            />
          </Card>
        </div>
      </Modal>
    </div>
  );
};
export default DynamicDetail;
