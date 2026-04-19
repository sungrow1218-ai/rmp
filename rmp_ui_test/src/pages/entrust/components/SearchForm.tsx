import React from 'react';
import {
  type FormInstance,
  Form,
  Select,
  Row,
  Col,
  TimePicker,
  Radio,
  Input,
} from '@ht/sprite-ui';
import {
  ENTRUST_TYPE,
  ENTRUST_DIRECTION,
  ENTRUST_STATUS,
} from '@/utils/dictEntrust';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import { TRADING_MARKETS } from '@/utils/dict';
import { FormDataType, type Option } from '../Entrust';
import styles from '../style.less';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import { queryExternSystem } from '@/services/account';
import SecuritySelect from '@/components/SecuritySelect';
import CardTitle from '@/components/CardTitle';

interface Props {
  form: FormInstance<FormDataType>;
  nodeOptions: Option[];
  isExpend: boolean;
}

const transformDict = (dict: readonly { code: string; name: string }[]) => {
  return dict
    .map((item) => {
      return { value: item.code, label: `${item.code}-${item.name}` };
    })
    .filter((it) => !it.label.includes('不区分'));
};
const FormItem = Form.Item;
const { RangePicker: TimeRangePicker } = TimePicker;

const SearchForm: React.FC<Props> = ({ form, nodeOptions, isExpend }) => {
  return (
    <div className={styles.search}>
      <CardTitle title={'委托查询'} style={{ paddingBottom: '16px' }} />
      <Form
        initialValues={{
          primaryFlag: 0,
          entrustType: ['0'],
        }}
        form={form}
        name="search_entrust"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ display: isExpend ? 'block' : 'none' }}
      >
        <Row>
          <Col span={6}>
            <FormItem
              label="节点号"
              name="nodeId"
              rules={[{ required: true, message: '请选择节点号' }]}
            >
              <Select options={nodeOptions} />
            </FormItem>
          </Col>
          <Col span={6}>
            <Form.Item label="外部系统号" name="extSysId">
              <MultipleSelect
                api={queryExternSystem}
                params={{
                  authFlag: 0,
                  pageId: 1,
                  pageSize: 1000,
                }}
                labelField="extSysName"
                valueField="extSysId"
                resultField="data.resultList"
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <FormItem
              rules={[{ required: true, message: '请选择委托类型' }]}
              label="委托类型"
              name="entrustType"
            >
              <MultipleSelect options={transformDict(ENTRUST_TYPE)} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="交易市场" name="marketId">
              <MultipleSelect options={transformDict(TRADING_MARKETS)} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="证券代码" name="securityCode">
              <SecuritySelect style={{ width: '100%' }} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="委托方向" name="entrustDirection">
              <MultipleSelect options={transformDict(ENTRUST_DIRECTION)} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="委托状态" name="entrustStatus">
              <MultipleSelect options={transformDict(ENTRUST_STATUS)} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="交易账号" name="tradeAcctCode">
              <Input />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="管理账号" name="manageAcctCode">
              <Input />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="委托编码" name="entrustCode">
              <Input />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem wrapperCol={{ span: 20 }} label="委托时间" name="timeSeg">
              <TimeRangePicker />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem name="primaryFlag">
              <Radio.Group>
                <Radio value={1}>查询主节点</Radio>
                <Radio value={0}>查询备节点</Radio>
              </Radio.Group>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchForm;
