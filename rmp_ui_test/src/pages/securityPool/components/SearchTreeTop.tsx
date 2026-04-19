import { useWorkGroup } from '@/hooks/useWorkGroup';
import { WorkGroupList } from '@/services/account';
import { off } from '@/utils/dom';
import { tranFromDataToOption } from '@/utils/utils';
import { Card, FormInstance, Form, Select, Input, Button } from 'antd';
import React, { useMemo } from 'react';

interface Props {
  form: FormInstance;
  onFilter: (form: FormInstance) => void;
  workGroupList: WorkGroupList[];
}

const SearchTreeTop: React.FC<Props> = ({ form, onFilter, workGroupList }) => {
  const workGourpOptions = useMemo(() => {
    if (workGroupList) {
      return tranFromDataToOption(
        workGroupList,
        'workGroupName',
        'workGroupId'
      );
    }
    return [];
  }, [workGroupList]);

  return (
    <div>
      <Card style={{ marginBottom: '20px' }}>
        <Form form={form}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '20px', width: '60%' }}>
              <Form.Item
                label="工作台"
                name="workGroupId"
                style={{ marginBottom: 0, flex: 1 }}
              >
                <Select
                  allowClear={true}
                  showSearch={true}
                  optionFilterProp="label"
                  options={workGourpOptions}
                />
              </Form.Item>
              <Form.Item
                label="券池分组"
                name="secuPoolLayerName"
                style={{ marginBottom: 0, flex: 1 }}
              >
                <Input autoComplete="off" />
              </Form.Item>
              <Form.Item
                label="券池名称"
                name="secuPoolName"
                style={{ marginBottom: 0, flex: 1 }}
              >
                <Input autoComplete="off" />
              </Form.Item>
              <Form.Item
                label="创建人"
                name="creater"
                style={{ marginBottom: 0, flex: 1 }}
              >
                <Input autoComplete="off" />
              </Form.Item>
            </div>
            <div>
              <Button
                style={{ marginRight: '16px' }}
                onClick={() => {
                  form.resetFields();
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  onFilter(form);
                }}
              >
                查询
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SearchTreeTop;
