import { BookList } from '@/services/account';
import { RULE_CONTROL_DIM, RULE_TYPE_LEVEL_2 } from '@/utils/dict';
import { Button, Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import React, { useEffect, useMemo } from 'react';
import styles from './style.less';
import moment from 'moment';
import { FormInstance } from 'antd/es/form';
import { PaginationType } from '@/services/typing';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import { TreeKeyType } from '../../RuleIndex/type';

const { RangePicker } = DatePicker;

const ruleTypeOption = RULE_TYPE_LEVEL_2.map((p) => {
  return {
    label: p.name,
    value: p.code,
  };
});
interface AllSobInfo {
  workGroupId: number;
  sobId?: number;
  sobName?: string;
  bookList?: BookList[];
  workGroupName: string;
}
export interface SobOption {
  bookLevel: number;
  label: string;
  workGroupId: number;
  sobId?: number;
  bookType: number;
  value: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  allSobInfo: AllSobInfo[];
  workGroupId: number;
  treeKeyType: TreeKeyType;
  handClickAll: () => void;
  higtForm: FormInstance;
  onSearch: (page: number, pageSize: number) => Promise<void>;
  pagination: PaginationType;
  resetForm: () => void;
}
const disabledTodayDate = (current: moment.Moment) => {
  return current > moment().endOf('day');
};
const HighSearchModal: React.FC<Props> = ({
  allSobInfo,
  open,
  onClose,
  workGroupId,
  treeKeyType,
  handClickAll,
  higtForm,
  onSearch,
  pagination,
  resetForm,
}) => {
  const sobInfoOption = useMemo(() => {
    if (workGroupId) {
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
  }, [allSobInfo, workGroupId]);

  const ruleControlType = useMemo(() => {
    const option = RULE_CONTROL_DIM.filter(
      (p) => p.code !== '1' && p.code !== '2'
    ).map((it) => ({
      value: it.code,
      label: it.name,
    }));
    return [...sobInfoOption, ...option];
  }, [sobInfoOption]);

  useEffect(() => {
    if (open) {
      const ruleType = treeKeyType.key.map((p) => {
        return p.split('|')[1];
      });

      if (treeKeyType.type !== 'highSearchType') {
        higtForm.setFieldValue('ruleType', [...new Set(ruleType)]);
      }
    }
  }, [higtForm, open, treeKeyType.key, treeKeyType.type]);

  useEffect(() => {
    higtForm.resetFields();
  }, [workGroupId]);

  return (
    <div className={styles.highSearchModal}>
      <Modal
        title={'高级查询'}
        open={open}
        onCancel={() => {
          onClose();
        }}
        forceRender={true}
        maskClosable={false}
        centered={true}
        width={1100}
        footer={
          <>
            <Button
              onClick={() => {
                higtForm.resetFields();
              }}
            >
              重置
            </Button>
            <Button
              type="primary"
              onClick={() => {
                resetForm();
                handClickAll();
                onSearch(1, pagination.pageSize);
              }}
            >
              查询
            </Button>
          </>
        }
      >
        <Form form={higtForm} labelCol={{ span: 5 }}>
          <Row>
            <Col span={12}>
              <Form.Item label="规则类型" name="ruleType">
                <MultipleSelect options={ruleTypeOption} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    max: 100,
                    message: '长度不能超过 100 个字符',
                  },
                ]}
                label="规则名称"
                name="ruleName"
              >
                <Input max={100} allowClear={true} autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="控制账户类型" name="controlType">
                <MultipleSelect options={ruleControlType} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    pattern: /^[A-Za-z0-9]+$/,
                    message: '请输入正确的格式',
                  },
                ]}
                name="createUserCode"
                label="创建人"
              >
                <Input allowClear={true} autoComplete="off" />
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
    </div>
  );
};

export default HighSearchModal;
