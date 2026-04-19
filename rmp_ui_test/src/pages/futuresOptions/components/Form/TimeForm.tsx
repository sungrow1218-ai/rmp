// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react';
import { FormInstance, Form, Select, Space, InputNumber } from '@ht/sprite-ui';
import {
  MONTH_CONTROL_TYPE,
  COMTRACT_MONTH,
  DictType,
  MONTH_OFFSET,
  DAY_TYPE,
  DAY_OFFSET,
  COMPARE_DIRECTION,
  THRESHOLD_TYPE,
  BEGIN_INFLUENCE_DIRECTION,
  END_INFLUENCE_DIRECTION,
  MONTH_OFFSET_KEY,
} from '@/utils/dictFutures';
import { FutureOptionList } from '@/services/FutureOption';
import styles from '../../style.less';

interface Props {
  form: FormInstance;
  editTimeData: FutureOptionList | null;
  disabled: boolean;
  tabKey: string;
  timeOpen: boolean;
  // setEditData: React.Dispatch<React.SetStateAction<FutureOptionList[]>>;
  // editData: FutureOptionList[];
}
const marginRight = 8;

export const transformDict = (data: any) => {
  return data.map((item: DictType) => {
    return {
      label: item.name,
      value: item.code,
    };
  });
};

const compareDirectionOPtions = [
  { label: '无', value: '0' },
  ...transformDict(COMPARE_DIRECTION),
];

const TimeForm: React.FC<Props> = ({
  form,
  editTimeData,
  disabled,
  tabKey,
  timeOpen,
  // editData,
}) => {
  const watchMonthType = Form.useWatch('monthControlType', form);
  const watchThresholdType = Form.useWatch('thresholdType', form);
  const watchCompareDirection = Form.useWatch('compareDirection', form);
  const watchBeginMonthOffset = Form.useWatch('beginMonthOffset', form);
  const watchEndMonthOffset = Form.useWatch('endMonthOffset', form);
  useEffect(() => {
    if (watchCompareDirection === '0') {
      form.setFieldValue('thresholdType', '1');
    }
  }, [form, watchCompareDirection]);

  useEffect(() => {
    if (editTimeData && timeOpen) {
      form.setFieldsValue({
        monthControlType: editTimeData.monthControlType.toString(),
        contractMonth:
          editTimeData.monthControlType === 0
            ? '1'
            : editTimeData.contractMonth.toString(),

        beginInfluenceDirection:
          editTimeData.beginInfluenceDirection.toString(),

        beginDayOffset:
          editTimeData.beginDateType === 3
            ? '1'
            : editTimeData.beginDayOffset.toString(),
        beginMonthOffset:
          editTimeData.beginDateType === 3
            ? '1'
            : editTimeData.beginMonthOffset.toString(),

        beginDateType:
          editTimeData.beginDateType === 3
            ? '1'
            : editTimeData.beginDateType.toString(),

        endInfluenceDirection: editTimeData.endInfluenceDirection.toString(),

        endDayOffset: editTimeData.endDayOffset.toString(),
        endMonthOffset: editTimeData.endMonthOffset.toString(),
        endDateType: editTimeData.endDateType.toString(),
        threshold: editTimeData.threshold ?? '1',
        compareDirection:
          tabKey === '1'
            ? editTimeData.compareDirection.toString() ?? '0'
            : '0',
        marketPositionQuantity:
          tabKey === '1'
            ? editTimeData.marketPositionQuantity.toString() ?? 0
            : 0,
      });
      if (editTimeData.compareDirection.toString() === '0' || tabKey === '2') {
        form.setFieldValue('thresholdType', '1');
      } else {
        form.setFieldValue(
          'thresholdType',
          editTimeData.thresholdType.toString()
        );
      }
    } else {
      form.setFieldsValue({
        monthControlType: '0',
        contractMonth: '1',

        beginInfluenceDirection: '1',
        beginDayOffset: '1',
        beginMonthOffset: '1',
        beginDateType: '1',

        endInfluenceDirection: '2',
        endDayOffset: '1',
        endMonthOffset: '-1',
        endDateType: '1',

        thresholdType: '1',
        threshold: 1,
        compareDirection: '0',
        marketPositionQuantity: 0,
      });
    }
  }, [editTimeData, form, tabKey, timeOpen]);

  return (
    <div className={styles.futuresTimeModal}>
      <Form form={form} name="search_futures">
        <div className={styles.inputBox}>
          <Form.Item
            style={{ marginRight }}
            // labelCol={{ span: 10 }}
            label="特殊月份"
            name="monthControlType"
          >
            <Select
              disabled={disabled}
              style={{ width: '100px' }}
              options={transformDict(MONTH_CONTROL_TYPE)}
            />
          </Form.Item>
          {watchMonthType && watchMonthType !== '0' && (
            <Form.Item name="contractMonth">
              <Select
                disabled={disabled}
                style={{ width: '120px' }}
                options={transformDict(COMTRACT_MONTH)}
              />
            </Form.Item>
          )}
        </div>

        <div className={styles.inputBox}>
          <Form.Item
            style={{ marginRight }}
            label="起始时间"
            name="beginInfluenceDirection"
          >
            <Select
              disabled={disabled}
              style={{ width: '100px' }}
              options={transformDict(BEGIN_INFLUENCE_DIRECTION)}
            />
          </Form.Item>

          <Form.Item style={{ marginRight }} name="beginMonthOffset">
            <Select
              disabled={disabled}
              style={{ width: '200px' }}
              options={
                tabKey === '1'
                  ? transformDict(MONTH_OFFSET)
                  : transformDict(MONTH_OFFSET_KEY)
              }
            />
          </Form.Item>
          {watchBeginMonthOffset && watchBeginMonthOffset !== '1' && (
            <Form.Item style={{ marginRight }} name="beginDayOffset">
              <Select
                disabled={disabled}
                style={{ width: '100px' }}
                options={transformDict(DAY_OFFSET)}
              />
            </Form.Item>
          )}
          {watchBeginMonthOffset && watchBeginMonthOffset !== '1' && (
            <Form.Item style={{ marginRight }} name="beginDateType">
              <Select
                disabled={disabled}
                style={{ width: '100px' }}
                options={transformDict(DAY_TYPE)}
              />
            </Form.Item>
          )}
        </div>
        <div className={styles.inputBox}>
          <Form.Item
            style={{ marginRight }}
            labelCol={{ span: 10 }}
            label="截至时间"
            name="endInfluenceDirection"
          >
            <Select
              disabled={disabled}
              style={{ width: '100px' }}
              options={transformDict(END_INFLUENCE_DIRECTION)}
            />
          </Form.Item>

          <Form.Item style={{ marginRight }} name="endMonthOffset">
            <Select
              style={{ width: '200px' }}
              disabled={disabled}
              options={
                tabKey === '1'
                  ? transformDict(MONTH_OFFSET).filter(
                      (item: any) => item.value !== '1'
                    )
                  : transformDict(MONTH_OFFSET_KEY).filter(
                      (item: any) => item.value !== '1'
                    )
              }
            />
          </Form.Item>
          {watchEndMonthOffset && watchEndMonthOffset !== '1' && (
            <Form.Item style={{ marginRight }} name="endDayOffset">
              <Select
                disabled={disabled}
                style={{ width: '100px' }}
                options={transformDict(DAY_OFFSET)}
              />
            </Form.Item>
          )}
          {watchEndMonthOffset && watchEndMonthOffset !== '1' && (
            <Form.Item style={{ marginRight }} name="endDateType">
              <Select
                disabled={disabled}
                style={{ width: '100px' }}
                options={transformDict(DAY_TYPE)}
              />
            </Form.Item>
          )}
        </div>

        <div className={styles.inputBox}>
          {tabKey === '1' && (
            <Form.Item
              style={{ marginRight }}
              label="持仓规模"
              name="compareDirection"
            >
              <Select
                disabled={disabled}
                style={{ width: '100px' }}
                options={compareDirectionOPtions}
              />
            </Form.Item>
          )}

          {watchCompareDirection !== '0' &&
            watchCompareDirection &&
            tabKey !== '2' && (
              <Form.Item
                rules={[
                  {
                    validator: (_, value) => {
                      if (Number(value) < 1) {
                        return Promise.reject(
                          new Error('持仓规模不能为空且大于等于0')
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                name="marketPositionQuantity"
              >
                <InputNumber
                  step={1}
                  disabled={disabled}
                  precision={0}
                  addonAfter="手"
                  style={{ width: 140 }}
                />
              </Form.Item>
            )}
        </div>

        <div className={styles.inputBox}>
          <Form.Item
            style={{ marginRight }}
            label="持仓限额"
            name="thresholdType"
          >
            <Select
              disabled={
                !watchCompareDirection ||
                watchCompareDirection === '0' ||
                disabled ||
                tabKey === '2'
              }
              style={{ width: '100px' }}
              options={transformDict(THRESHOLD_TYPE)}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                validator: (_, value) => {
                  if (watchThresholdType === '1') {
                    if (Number(value) < 0) {
                      return Promise.reject(
                        new Error('持仓限额不能为空且大于等于0')
                      );
                    }
                  }
                  if (watchThresholdType === '2') {
                    if (Number(value) < 0 || Number(value) > 100) {
                      return Promise.reject(
                        new Error('持仓限额不能为空且大于等于0小于等于100')
                      );
                    }
                  }

                  return Promise.resolve();
                },
              },
            ]}
            name="threshold"
          >
            <InputNumber
              disabled={disabled}
              addonAfter={watchThresholdType === '2' ? '%' : '手'}
              style={{ width: 140 }}
              precision={watchThresholdType === '2' ? 2 : 0}
              min={0}
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};
export default TimeForm;
