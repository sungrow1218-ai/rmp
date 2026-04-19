import { RULE_CONTROL_DIM, RULE_TYPE_LEVEL_2 } from '@/utils/dict';
import { Button, Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import React, { useMemo } from 'react';
import moment from 'moment';
import { FormInstance } from 'antd/es/form';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import { useSobInfo } from '../allSobInfo';
import { WorkGroupList } from '@/services/rule';
import RuleTypeTreeSelect from '@/components/RuleTypeTreeSelect/RuleTypeTreeSelect';
import { PaginationType } from '@/services/typing';

const { RangePicker } = DatePicker;

export interface SobOption {
  bookLevel: number;
  label: string;
  workGroupId: number;
  sobId?: number;
  bookType: number;
  value: string;
}

interface Props {
  isSelectRuleTypeId: string | false;
  handClickAll: () => void;
  form: FormInstance;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workGroupRuleType: WorkGroupList[];
  onSearch: (page: number, pageSize: number) => Promise<void>;
  pagination: PaginationType;
}
const disabledTodayDate = (current: moment.Moment) => {
  return current > moment().endOf('day');
};
const HightSearchFilter: React.FC<Props> = ({
  handClickAll,
  form,
  open,
  setOpen,
  isSelectRuleTypeId,
  workGroupRuleType,
  onSearch,
  pagination,
}) => {
  const resetForm = () => {
    form.resetFields([
      'ruleType',
      'acctCode',
      'acctName',
      'createDate',
      'updateDate',
      'controlType',
    ]);
  };

  const allSobInfo = useSobInfo();
  const isShowAcc = workGroupRuleType.length === 1;

  const sobInfoOption = useMemo(() => {
    if (workGroupRuleType && workGroupRuleType.length > 0) {
      const { workGroupId } = workGroupRuleType[0];
      const list: SobOption[] = [];
      const sobInfo = allSobInfo.find((p) => p.workGroupId === workGroupId);
      sobInfo?.bookList?.forEach((p) => {
        p.bookLevelList?.forEach((q) => {
          list.push({
            value: `${q.bookLevel}|${p.bookType}`,
            bookLevel: q.bookLevel,
            label: q.bookLevelName,
            workGroupId,
            sobId: sobInfo.sobId,
            bookType: p.bookType,
          });
        });
      });
      return list;
    }
    return [];
  }, [allSobInfo, workGroupRuleType]);

  const ruleControlType = useMemo(() => {
    const option = RULE_CONTROL_DIM.filter(
      (p) => p.code !== '1' && p.code !== '2'
    ).map((it) => ({
      value: it.code,
      label: it.name,
    }));
    return [...sobInfoOption, ...option];
  }, [sobInfoOption]);

  return (
    <Modal
      open={open}
      title={'过滤器'}
      maskClosable={false}
      onCancel={() => {
        setOpen(false);
        const data = form.getFieldValue('ruleType');
        const isOnly =
          isSelectRuleTypeId &&
          data &&
          data.length === 1 &&
          isSelectRuleTypeId === data[0];
        if (data) {
          if (!isOnly) {
            handClickAll();
          }
        }
      }}
      centered={true}
      width={1100}
      footer={
        <>
          <Button
            type="primary"
            onClick={() => {
              resetForm();
            }}
          >
            重置
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setOpen(false);
              const data = form.getFieldValue('ruleType');
              const isOnly =
                isSelectRuleTypeId &&
                data &&
                data.length === 1 &&
                isSelectRuleTypeId === data[0];
              if (data && data.length > 0) {
                if (!isOnly) {
                  handClickAll();
                }
              }
              onSearch(1, pagination.pageSize);
            }}
          >
            确定
          </Button>
        </>
      }
    >
      <Form form={form} labelCol={{ span: 5 }}>
        <Row>
          <Col span={12}>
            <Form.Item label="规则类型" name="ruleType">
              <RuleTypeTreeSelect />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="账户编码" name="acctCode">
              <Input allowClear={true} autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="账户名称" name="acctName">
              <Input allowClear={true} autoComplete="off" />
            </Form.Item>
          </Col>
          {isShowAcc && (
            <Col span={12}>
              <Form.Item label="控制账户类型" name="controlType">
                <MultipleSelect options={ruleControlType} />
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item label="创建时间" name="createDate">
              <RangePicker
                style={{ width: '100%' }}
                disabledDate={disabledTodayDate}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="修改时间" name="updateDate">
              <RangePicker
                style={{ width: '100%' }}
                disabledDate={disabledTodayDate}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default HightSearchFilter;
