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
import SecurityTypeSelect from '@/components/SecurityTypeSelectRebuild';
import SecuritySelect from '@/components/SecuritySelect';
import SecuritySelectWithName from '@/components/SecuritySelectWithName/SecuritySelect';
import CardTitle from '@/components/CardTitle';
import { alterSecurityPoolDetail } from '@/services/securityPool/index';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const marketOption = transformDictToMarketOptions(
  TRADING_MARKETS.filter((r) => r.code !== '-1')
);
const { RangePicker } = DatePicker;
export const transformDictFilter = (
  dict: readonly { code: string; name: string }[]
) => {
  return dict
    .map((item) => {
      return { value: item.code, label: `${item.code}-${item.name}` };
    })
    .filter((it) => !it.label.includes('不区分'));
};

interface Ref {
  getFormValueAsync: () => Promise<any>;
}
type AddTableType = {
  securityCode: string;
  marketId: number;
  effectBeginDate: string;
  effectEndDate: string;
  remark: string;
  key?: React.Key;
  secuPoolId: number;
};

const PoolDetailForm: ForwardRefRenderFunction<Ref, PoolDetailFormProps> = (
  { mode, onClose, defaultValues },
  ref
) => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<AddTableType[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
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

  const onAdd = async () => {
    if (!defaultValues) {
      message.error('证券池不存在');
      return;
    }
    const result = await form.validateFields();
    const dataToSubmit = {
      ...result,
    };

    const isHaveDate =
      dataToSubmit.effectDate && dataToSubmit.effectDate?.length > 0;
    const effectBeginDate = isHaveDate
      ? dataToSubmit.effectDate[0].format('YYYYMMDD')
      : '';
    const effectEndDate = isHaveDate
      ? dataToSubmit.effectDate[1].format('YYYYMMDD')
      : '';

    const dataList = dataToSubmit.securityCode?.map((p: any) => {
      return {
        securityCode: p.securityCode,
        marketId: p.marketId,
        securityName: p.securityName,
        effectBeginDate,
        effectEndDate,
        remark: dataToSubmit.remark ?? '',
        key: uuidv4(),
        secuPoolId: defaultValues.secuPoolId,
      };
    });
    const isHaveFun = (arr1: any[], arr2: any[]) => {
      for (const item of arr1) {
        const found = arr2.find(
          (p: any) =>
            p.securityCode === item.securityCode && p.marketId === item.marketId
        );
        if (found) {
          return true;
        }
      }
      return false;
    };
    const isHave = isHaveFun(tableData, dataList);
    if (isHave) {
      message.warning('数据重复,请重新添加');
    } else {
      setTableData([...dataList, ...tableData] as AddTableType[]);
      form.resetFields();
    }
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
        }}
      >
        <CardTitle title="选择证券" style={{ marginBottom: '16px' }} />
        <Form
          name="poolDetailForm"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 6 }}
          autoComplete="off"
          form={form}
          style={
            {
              // width: '1',
            }
          }
        >
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
            <SecuritySelectWithName />
          </FormItem>

          <FormItem
            wrapperCol={{ span: 7 }}
            label="有效日期范围"
            name="effectDate"
          >
            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </FormItem>

          <FormItem
            style={{ marginBottom: '10px' }}
            wrapperCol={{ span: 30 }}
            label="备注"
            name="remark"
            labelCol={{ span: 2 }}
          >
            <TextArea rows={3} maxLength={100} />
          </FormItem>
        </Form>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
          }}
        >
          <div></div>
          <Button onClick={onAdd} type="link">
            保存
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
            }}
            type="link"
          >
            重置
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CardTitle title="已选证券" />
          {tableData.length === 0 ? (
            <span style={{ paddingLeft: '16px' }}> 待添加证券</span>
          ) : (
            <span style={{ paddingLeft: '16px' }}>
              {' '}
              本次新增 {Number(tableData.length)} 条数据`
            </span>
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
