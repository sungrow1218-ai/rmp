import React, { CSSProperties, useState } from 'react';
import { Form, Button, Input } from 'antd';

import { FormInstance } from 'antd/es/form/Form';
import { RULE_STATUSES } from '@/utils/dict';
import styles from '../../RuleIndex/styles.less';
import { PaginationType } from '@/services/typing';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import HightSearchFilter from './HightSearchFilter';
import useEIP from '@/directives/useEIP';
import { WorkGroupList } from '@/services/rule';

interface Props {
  form: FormInstance;
  onSearch: (page: number, pageSize: number) => Promise<void>;
  pagination: PaginationType;
  funcAuth: {
    editAuth: boolean;
    queryAuth: boolean;
  };
  resetForm: () => void;
  handClickAll: () => void;
  isSelectRuleTypeId: string | false;
  style?: CSSProperties;
  workGroupRuleType: WorkGroupList[];
}

const TableSearch: React.FC<Props> = ({
  form,
  onSearch,
  pagination,
  funcAuth,
  resetForm,
  isSelectRuleTypeId,
  handClickAll,
  style = {},
  workGroupRuleType,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const filterValue = inputValue.replace(/[^0-9]/g, '');
    e.target.value = filterValue;
    form.setFieldValue('ruleId', filterValue);
  };

  const onPressEnter = () => {
    onSearch(1, pagination.pageSize);
  };
  const [open, setOpen] = useState(false);
  const [_, eipRef] = useEIP();
  return (
    <div className={styles.searchTop} style={style}>
      <Form
        form={form}
        style={{ display: 'flex' }}
        name="rule_setting_search"
        onFinish={onPressEnter}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault(); // 阻止默认表单提交行为
            onPressEnter();
          }
        }}
      >
        <div style={{ display: 'flex', gap: '15px' }}>
          <Form.Item label="规则编号" name="ruleId" style={{ marginBottom: 0 }}>
            <Input
              autoComplete="off"
              allowClear={true}
              onChange={handleInputChange}
              style={{ width: '150px' }}
              placeholder="请输入"
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            rules={[
              {
                max: 100,
                message: '长度不能超过 100 个字符',
              },
            ]}
            label="规则名称"
            name="ruleName"
          >
            <Input
              allowClear={true}
              autoComplete="off"
              style={{ width: '150px' }}
              placeholder="请输入"
            />
          </Form.Item>
          <Form.Item
            label="启用状态"
            name="ruleStatus"
            style={{ marginBottom: 0 }}
          >
            <MultipleSelect
              options={RULE_STATUSES.map((p) => ({
                label: p.name,
                value: p.code,
              }))}
              style={{ width: '150px' }}
              placeholder="请选择"
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            label="创建人"
            rules={[
              {
                pattern: /^[A-Za-z0-9]+$/,
                message: '请输入正确的格式',
              },
            ]}
            name="createUserCode"
          >
            <Input
              allowClear={true}
              autoComplete="off"
              style={{ width: '150px' }}
              placeholder="请输入"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              过滤器
            </Button>
          </Form.Item>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            style={{
              marginRight: '15px',
              justifySelf: 'flex-end',
            }}
            ref={eipRef}
            onClick={resetForm}
          >
            重置
          </Button>
          {/* {(workGroupId !== -1 || oneWorkId) && funcAuth.queryAuth ? (
              <Button
                style={{
                  marginRight: '15px',
                }}
                type="primary"
                onClick={onOpenHighSearch}
              >
                高级查询
              </Button>
            ) : null} */}
          {funcAuth.queryAuth && (
            <Button
              style={{
                marginRight: '15px',
              }}
              onClick={() => {
                onSearch(1, pagination.pageSize);
              }}
              type="primary"
            >
              查询
            </Button>
          )}
        </div>
      </Form>
      <HightSearchFilter
        open={open}
        onSearch={onSearch}
        pagination={pagination}
        setOpen={setOpen}
        form={form}
        isSelectRuleTypeId={isSelectRuleTypeId}
        handClickAll={handClickAll}
        workGroupRuleType={workGroupRuleType}
      />
    </div>
  );
};

export default TableSearch;
