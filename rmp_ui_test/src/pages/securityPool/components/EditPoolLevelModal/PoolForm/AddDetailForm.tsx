// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  AutoComplete,
  Badge,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Table,
} from '@ht/sprite-ui';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import styles from '@/pages/securityPool/style.less';

import {
  TypeSelectorPool,
  PoolDetailFormProps,
  QuerySecuPoolRspDto,
  PoolDetailFormType,
  QuerySecuPoolRspDTO,
} from '@/pages/securityPool/contants/tyeping';
import {
  DictFeKeyEnumType,
  OPERATION_TYPES,
  TRADING_MARKETS,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import useUserRoles from '@/hooks/useUserRoles';
import SearchInput from '../../RightTable/SearchInput';
import {
  getColumns,
  parseTime,
  transformDictToMarketOptions,
} from '@/pages/securityPool/contants/contants';
import { ColumnsType } from '@ht/sprite-ui/lib/table';
import { messageDetailInfo, messageInfo } from './message';
import SecuritySingleSelect from '@/components/SecuritySingleSelect/SecuritySingleSelectRebuild';
import { alterSecurityPoolDetail } from '@/services/securityPool/index';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const marketOption = transformDictToMarketOptions(
  TRADING_MARKETS.filter((r) => r.code !== '-1')
);

export const transformDictFilter = (
  dict: readonly { code: string; name: string }[]
) => {
  return dict
    .map((item) => {
      return { value: item.code, label: `${item.code}-${item.name}` };
    })
    .filter(
      (it) => !(it.label.includes('不区分') || it.label.includes('不提示'))
    );
};

interface Ref {
  getFormValueAsync: () => Promise<any>;
}
type ItemOption = {
  label: string;
  value: string;
  code: string;
};
type AddTableType = {
  securityCode: string;
  marketId: number;
  effectBeginDate: string;
  effectEndDate: string;
  remark: string;
  key?: React.Key;
  secuPoolId: number;
};

interface Props extends PoolDetailFormProps {
  secuPoolList: QuerySecuPoolRspDto[];
}
// 将接口数据入参格式的数据转换为组件表单的数据格式
const getInitialValue = ({
  mode,
  defaultValues,
}: {
  mode: DictFeKeyEnumType['OPERATION_TYPES'];
  defaultValues?: PoolDetailFormType;
}) => {
  const emptyValue = {
    securityCode: undefined,
    marketId: undefined,
    effectBeginDate: undefined,
    effectEndDate: undefined,
    remark: undefined,
  };

  if (mode === 'ADD' || !defaultValues) {
    return {
      ...emptyValue,
      secuPoolId: defaultValues?.secuPoolId,
    };
  }

  return {
    ...emptyValue,
    securityCode: defaultValues.securityCode,
    securityCodeStr: ` ${defaultValues.securityCode ?? ''} ${
      defaultValues.securityName ?? ''
    } ${transformDictCodeToNameHelper(
      String(defaultValues.marketId),
      TRADING_MARKETS
    )}`,
    marketIdStr: transformDictCodeToNameHelper(
      String(defaultValues.marketId),
      TRADING_MARKETS
    ),
    marketId: defaultValues.marketId,
    secuPoolId: defaultValues.secuPoolId,
    remark: defaultValues.remark,
    effectBeginDate: defaultValues.effectBeginDate
      ? moment(defaultValues.effectBeginDate, 'YYYY-MM-DD')
      : '',
    effectEndDate: defaultValues.effectEndDate
      ? moment(defaultValues.effectEndDate, 'YYYY-MM-DD')
      : '',
  };
};
const PoolDetailForm: ForwardRefRenderFunction<Ref, Props> = (
  { mode, onClose, defaultValues, secuPoolList },
  ref
) => {
  const [options, setOptions] = useState<ItemOption[]>(marketOption);
  const [inputValue, setInputValue] = useState('');
  const [selectdVal, setSelectdVal] = useState('');
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<AddTableType[]>([]);
  const initialValues = useMemo(
    () => getInitialValue({ mode, defaultValues }),
    [mode, defaultValues]
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    newSelectedRow: { [key: string]: any }
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = useMemo(() => {
    return {
      selectedRowKeys,
      onChange: onSelectChange,
    };
  }, [selectedRowKeys]);

  const getAddColumns = () => {
    const infoArr: ColumnsType<AddTableType> = [
      {
        title: '证券代码',
        dataIndex: 'securityCode',
        width: '24%',
        render: (text) => (
          <div style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>{text}</div>
        ),
      },
      {
        title: '交易市场',
        width: '24%',
        dataIndex: 'marketId',
        render: (value) => (
          <div style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>
            {transformDictCodeToNameHelper(String(value), TRADING_MARKETS)}
          </div>
        ),
      },
      {
        title: '有效起始日期',
        dataIndex: 'effectBeginDate',
        render: (value) => (
          <div style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>
            {parseTime(value, 'YYYY-MM-DD', 'YYYYMMDD')}
          </div>
        ),
      },
      {
        title: '有效截止日期',
        dataIndex: 'effectEndDate',
        render: (value) => (
          <div style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>
            {parseTime(value, 'YYYY-MM-DD', 'YYYYMMDD')}
          </div>
        ),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        ellipsis: true,
      },
    ];
    return infoArr;
  };

  const handleSubmit = useCallback(async () => {
    const alterTypes = OPERATION_TYPES.find((d) => d.feKey === mode);
    try {
      if (!tableData || tableData.length === 0) {
        message.warning('请添加至少一条证券');
        return;
      }
      const securityPoolDetailRes = await alterSecurityPoolDetail({
        modifyType: Number(alterTypes?.code),
        secuPoolId: tableData[0]?.secuPoolId,
        poolSecurityList: tableData as any[],
      });
      if (
        securityPoolDetailRes.data?.faultList &&
        securityPoolDetailRes.data.faultList.length > 0
      ) {
        onClose();
        form.setFieldsValue({});
        return {
          faultList: securityPoolDetailRes.data.faultList,
        };
      } else if (
        securityPoolDetailRes.code !== 0 &&
        securityPoolDetailRes.code !== 145003
      ) {
        message.error(securityPoolDetailRes.message);
      } else if (securityPoolDetailRes.data?.errorId) {
        const faultListInfo = securityPoolDetailRes.data.faultList[0];
        message.error(
          `${securityPoolDetailRes.data.errorInfo}--${
            faultListInfo.errorInfo ?? ''
          }`
        );
      } else if (securityPoolDetailRes.code === 145003) {
        onClose();
        form.setFieldsValue({});
        message.success({
          content: messageDetailInfo(Number(alterTypes?.code)),
        });
      } else {
        onClose();
        form.setFieldsValue({});
        message.success({ content: '提交成功' });
      }
    } catch (error) {}
    return tableData;
  }, [form, mode, onClose, tableData]);
  useImperativeHandle(
    ref,
    () => ({
      getFormValueAsync: handleSubmit,
    }),
    [handleSubmit]
  );

  const compareDates = (_: any, value: moment.MomentInput) => {
    const startDate = form.getFieldValue('effectBeginDate');
    if (!value || !startDate) {
      return Promise.resolve();
    }
    if (moment(value).isBefore(startDate)) {
      return Promise.reject(new Error('结束日期不得小于开始日期'));
    }
    return Promise.resolve();
  };

  const security = Form.useWatch('securityCode', form);

  useEffect(() => {
    if (!security) {
      form.setFieldValue('marketId', undefined);
    } else {
      form.setFieldValue('marketId', String(security?.marketId));
    }
  }, [security]);

  const onAdd = async () => {
    const result = await form.validateFields();
    const dataToSubmit = {
      ...result,
    };
    const effectBeginDate = moment(
      dataToSubmit.effectBeginDate,
      'YYYYMMDD'
    ).isValid();
    const effectEndDate = moment(
      dataToSubmit.effectEndDate,
      'YYYYMMDD'
    ).isValid();
    console.log('====================================');
    console.log(dataToSubmit);
    console.log('====================================');
    const dataList = {
      securityCode: dataToSubmit.securityCode?.securityCode ?? '',
      marketId: dataToSubmit.marketId,
      effectBeginDate: effectBeginDate
        ? moment(dataToSubmit.effectBeginDate).format('YYYYMMDD')
        : '',
      effectEndDate: effectEndDate
        ? moment(dataToSubmit.effectEndDate).format('YYYYMMDD')
        : '',
      remark: dataToSubmit.remark ?? '',
      // securityName: dataToSubmit.securityName ?? '',
      secuPoolId: dataToSubmit.secuPoolId,
      key: uuidv4(),
    };

    const isHave = tableData.find(
      (p) =>
        p.securityCode === dataList.securityCode &&
        p.marketId === dataList.marketId
    );
    if (isHave) {
      message.warning('数据重复,请重新添加');
    } else {
      setTableData([dataList, ...tableData] as AddTableType[]);
    }
    form.resetFields();
  };
  const onDetele = () => {
    const newTaledata = tableData.filter(
      (item1) => !selectedRowKeys.some((item2) => item1.key === item2)
    );
    setTableData([...newTaledata]);
    setSelectedRowKeys([]);
  };

  return (
    <div className={styles.detailForm}>
      <div
        style={{
          borderRadius: '10px',
          paddingTop: '30px',
        }}
      >
        <Form
          name="poolDetailForm"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17 }}
          autoComplete="off"
          initialValues={initialValues}
          form={form}
          style={
            {
              // width: '1',
            }
          }
        >
          <Row>
            <Col span={8}>
              <FormItem
                label="隶属券池"
                name="secuPoolId"
                rules={[
                  {
                    required: true,
                    message: '隶属券池不能为空',
                  },
                ]}
              >
                <Select
                  placeholder="请选择隶属券池"
                  disabled={!!defaultValues?.secuPoolId || mode === 'EDIT'}
                >
                  {secuPoolList.length > 0 &&
                    secuPoolList.map((item) => (
                      <Option key={item.secuPoolId} value={item.secuPoolId}>
                        {item.secuPoolId} {item.secuPoolName}
                      </Option>
                    ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="证券代码"
                name="securityCode"
                rules={[
                  {
                    required: true,
                    message: '证券代码不能为空',
                  },
                ]}
              >
                <SecuritySingleSelect
                  placeholder="请输入证券代码"
                  disabled={mode === 'EDIT'}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="交易市场" name="marketId">
                <Select
                  disabled={true}
                  options={transformDictFilter(TRADING_MARKETS)}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="有效起始日期" name="effectBeginDate">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="有效截止日期"
                name="effectEndDate"
                rules={[{ validator: compareDates }]}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                style={{ marginBottom: '10px' }}
                wrapperCol={{ span: 30 }}
                label="备注"
                name="remark"
                labelCol={{ span: 2 }}
              >
                <TextArea rows={3} maxLength={100} />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '10px',
          }}
        >
          <Button
            onClick={() => {
              form.resetFields();
            }}
            type="link"
          >
            重置
          </Button>
          <Button onClick={onAdd} type="link">
            保存
          </Button>
        </div>
      </div>
      <Divider />
      <div
        style={{
          padding: '0 0 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ paddingLeft: '10px' }}>
          {tableData.length === 0 ? (
            <span>
              {' '}
              <Badge color="#0000009d" /> 待添加证券
            </span>
          ) : (
            `本次新增 ${Number(tableData.length)} 条数据`
          )}
        </div>
        <Button
          type="link"
          disabled={!selectedRowKeys.length}
          style={{
            color: '#BB744A',
          }}
          onClick={onDetele}
        >
          删除
        </Button>
      </div>
      <div
        style={{
          minHeight: '300px',
        }}
      >
        <Table
          columns={getAddColumns()}
          size="small"
          dataSource={tableData ?? []}
          rowSelection={{ ...rowSelection, type: 'checkbox' }}
          pagination={false}
          rowKey={'key'}
          scroll={{
            y: 300,
          }}
        />
      </div>
    </div>
  );
};

export default forwardRef(PoolDetailForm);
