import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FormActionType } from '@/components/Form';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Popover,
  Row,
  Space,
  Tooltip,
} from '@ht/sprite-ui';
import { DetailState, SearchFilterProps } from '../../contant/typing';
import moment from 'moment';

import { RULE_TYPE_LEVEL_2, transformDictCodeToNameHelper } from '@/utils/dict';
import { CHANGE_MODULE, PROCEDURE_TYPE } from '../../dict';
import { getPopupContainer } from '@/utils/dom';

interface Props {
  defaultValues: DetailState | undefined;

  form: InstanceType<any>;
  setOpen: (value: boolean) => void;
}

const DetailForm = ({ defaultValues, form, setOpen }: Props) => {
  const textData = useMemo(() => {
    if (defaultValues) {
      const oldData: any = defaultValues.textBefore
        ? JSON.parse(defaultValues.textBefore)
        : '';
      const newData: any = defaultValues.textAfter
        ? JSON.parse(defaultValues.textAfter)
        : '';
      if (defaultValues.alterType !== 3) {
        return newData;
      } else {
        return oldData;
      }
    }
  }, [defaultValues]);

  useEffect(() => {
    form.setFieldsValue({
      ...defaultValues,
      createTime:
        defaultValues && defaultValues.createTime
          ? moment(defaultValues.createTime, 'YYYYMMDD HH:mm:ss').format(
              'YYYY-MM-DD HH:mm:ss'
            )
          : '',
      // ruleType: transformDictCodeToNameHelper(value, RULE_TYPE_LEVEL_2),
      procedureType: transformDictCodeToNameHelper(
        (defaultValues && defaultValues.changeModule?.toString()) ?? '',
        PROCEDURE_TYPE
      ),
    });
    const num = PROCEDURE_TYPE.find(
      (p) => p.code === String(defaultValues?.changeModule)
    )?.feKey;
    if (num === '1') {
      const value = textData?.ruleBaseInfo?.ruleType ?? '';
      form.setFieldValue(
        'ruleType',
        transformDictCodeToNameHelper(value, RULE_TYPE_LEVEL_2)
      );
    } else {
      const value = defaultValues?.changeModule;
      form.setFieldValue(
        'changeType',
        transformDictCodeToNameHelper(String(value), CHANGE_MODULE)
      );
    }
  }, [defaultValues, form, textData]);

  const changePageType = useMemo(() => {
    const num = PROCEDURE_TYPE.find(
      (p) => p.code === String(defaultValues?.changeModule)
    )?.feKey;
    return Number(num);
  }, [defaultValues]);

  return (
    <div>
      <Form form={form}>
        <Row gutter={16} justify="start">
          <Col span={6}>
            <Form.Item
              label={
                <div style={{ width: '60px', textAlign: 'right' }}>发起人</div>
              }
              name="creator"
              // labelAlign="left"
              // labelCol={{ span: 4 }}
              // wrapperCol={{ span: 18 }}
              style={{ marginBottom: '10px' }}
            >
              <Input disabled={true} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="发起时间"
              name="createTime"
              // labelAlign="left"
              // labelCol={{ span: 5 }}
              // wrapperCol={{ span: 18 }}
              style={{ marginBottom: '10px' }}
            >
              <Input disabled={true} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="流程类型"
              name="procedureType"
              // labelCol={{ span: 5 }}
              // wrapperCol={{ span: 18 }}
              style={{ marginBottom: '10px' }}
            >
              <Input disabled={true} />
            </Form.Item>
          </Col>
          <Col span={6}>
            {changePageType === 1 && (
              <Form.Item
                label="规则类型"
                // labelAlign="left"
                // labelCol={{ span: 5 }}
                style={{ marginBottom: '10px' }}
              >
                <Popover
                  content={transformDictCodeToNameHelper(
                    textData?.ruleBaseInfo?.ruleType,
                    RULE_TYPE_LEVEL_2
                  )}
                  getPopupContainer={getPopupContainer}
                >
                  <Form.Item name="ruleType" labelAlign="right">
                    <Input disabled={true} />
                  </Form.Item>
                </Popover>
              </Form.Item>
            )}
            {changePageType === 2 && (
              <Form.Item
                label="变更模块"
                // labelAlign="left"
                // labelCol={{ span: 5 }}
                style={{ marginBottom: '10px' }}
              >
                <Form.Item name="changeType" labelAlign="right">
                  <Input disabled={true} />
                </Form.Item>
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row justify="start">
          <Col span={24}>
            <Form.Item
              label={
                <div style={{ width: '60px', textAlign: 'right' }}>
                  变更事项
                </div>
              }
              // labelAlign="left"
              // labelCol={{ span: 1 }}
            >
              <div
                style={{
                  display: 'flex',
                }}
              >
                <Form.Item
                  name="changeItem"
                  // labelAlign="right"
                  style={{ flex: 1 }}
                >
                  <Input disabled={true} />
                </Form.Item>
                {(changePageType === 1 ||
                  defaultValues?.changeModule === 201) && (
                  <Button
                    type="link"
                    style={{
                      color: '#BB744A',
                      marginBottom: '24px',
                      paddingRight: 0,
                    }}
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    {defaultValues?.changeModule === 201
                      ? '打开层级详情'
                      : '打开规则详情'}
                  </Button>
                )}
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default DetailForm;
