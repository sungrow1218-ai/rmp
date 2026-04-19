import React from 'react';
import {
  type FormInstance,
  Form,
  Select,
  Row,
  Col,
  Input,
} from '@ht/sprite-ui';

import TitleImgSrc from '@/assets/common/card-title-icon.png';

import { FormDataType, type Option } from '../PositionMain';
import styles from '../style.less';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import { queryExternSystem } from '@/services/account';
import SecuritySelect from '@/components/SecuritySelect';

interface Props {
  form: FormInstance<FormDataType>;
  nodeOptions: Option[];
  isExpend: boolean;
}

const FormItem = Form.Item;

const SearchForm: React.FC<Props> = ({ form, nodeOptions, isExpend }) => {
  return (
    <div className={styles.search}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: isExpend ? '20px' : '10px',
        }}
      >
        <img src={TitleImgSrc} className={styles.logo} />
        <span className={styles.titleText}>持仓查询与应急调整</span>
      </div>
      <Form
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
              <Select allowClear={true} options={nodeOptions} />
            </FormItem>
          </Col>
          <Col span={6}>
            <Form.Item
              label="外部系统号"
              rules={[{ required: true }]}
              name="extSysId"
            >
              <MultipleSelect
                api={queryExternSystem}
                params={{
                  pageId: 1,
                  pageSize: 1000,
                  authFlag: 0,
                }}
                labelField="extSysName"
                valueField="extSysId"
                resultField="data.resultList"
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <FormItem label="证券代码" name="security">
              <SecuritySelect style={{ width: '100%' }} />
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem label="交易账户" name="tradeAcctCode">
              <Input allowClear={true} autoComplete="off" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="管理账户" name="manageAcctCode">
              <Input allowClear={true} autoComplete="off" />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchForm;
