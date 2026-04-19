import React from 'react';
import { Form, TreeSelect } from '@ht/sprite-ui';
import { Rule } from '@ht/sprite-ui/lib/form';
import { NamePath } from '@ht/sprite-ui/lib/form/interface';

export const RoleCheck = (props: {
  name: NamePath | undefined;
  options: (string | number | any)[] | undefined;
  value: any[];
  rules: Rule[];
}) => {
  return (
    <>
      <Form.Item {...props} name={props.name} rules={props.rules}>
        <TreeSelect
          showArrow={true}
          showSearch={false}
          treeCheckable={true}
          value={props.value ?? []}
          placeholder="请选择角色"
          style={{ width: '100%', flex: 1 }}
          treeData={props.options}
        />
      </Form.Item>
    </>
  );
};
