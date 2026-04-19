import React, { useCallback, useRef, useEffect } from 'react';

import styles from './styles.less';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import { Form, Input, Row, Col, DatePicker, Select } from '@ht/sprite-ui';
import moment from 'moment';
import { PROCEDURE_TYPE, PROCEDURE_TYPE_MODE } from './dict';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import CardTitle from '@/components/CardTitle';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
interface Props {
  form: InstanceType<any>;
  enterSearch: () => void;
}
const options = PROCEDURE_TYPE_MODE.map((p) => ({
  label: p.name,
  value: Number(p.code),
}));
const disabledTodayDate = (current: moment.Moment) => {
  return current > moment().endOf('day');
};
const SearchMain: React.FC<Props> = ({ form, enterSearch }) => {
  return (
    <div className={styles.searchMain} style={{ minWidth: '1200px' }}>
      <CardTitle title="流程管理" />
      <Form
        form={form}
        style={{ paddingTop: '16px' }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Row>
          <Col span={6}>
            <FormItem
              rules={[
                {
                  max: 125,
                  message: '长度不能超过 125 个字符',
                },
              ]}
              label="流程名称"
              name="procedureName"
            >
              <Input onPressEnter={enterSearch} autoComplete="off" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="流程类型" name="procedureType">
              <MultipleSelect options={options} />
            </FormItem>
          </Col>
          {/* <Col span={6}>
            <FormItem label="流程编号" name="procedureCode">
              <Input />
            </FormItem>
          </Col> */}
          <Col span={6}>
            <FormItem
              label="发起人"
              name="creator"
              rules={[
                {
                  max: 8,
                  message: '长度不能超过 8 个字符',
                },
              ]}
            >
              <Input onPressEnter={enterSearch} autoComplete="off" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              label="当前处理人"
              name="currentProcessor"
              rules={[
                {
                  max: 8,
                  message: '长度不能超过 8 个字符',
                },
              ]}
            >
              <Input onPressEnter={enterSearch} autoComplete="off" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="发起日期" name="creatTime">
              <RangePicker
                style={{ width: '100%' }}
                disabledDate={disabledTodayDate}
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="办结日期" name="finshTime">
              <RangePicker
                style={{ width: '100%' }}
                disabledDate={disabledTodayDate}
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchMain;
