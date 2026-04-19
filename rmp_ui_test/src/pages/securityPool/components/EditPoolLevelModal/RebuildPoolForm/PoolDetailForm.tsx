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
import { DatePicker, Form, Input, message, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import styles from '@/pages/securityPool/style.less';

import {
  TypeSelectorPool,
  PoolDetailFormProps,
  QuerySecuPoolRspDto,
  PoolDetailFormType,
} from '@/pages/securityPool/contants/tyeping';
import {
  DictFeKeyEnumType,
  OPERATION_TYPES,
  TRADING_MARKETS,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import useUserRoles from '@/hooks/useUserRoles';
import SearchInput from '../../RightTable/SearchInput';
import { transformDictToMarketOptions } from '@/pages/securityPool/contants/contants';
import { messageDetailInfo } from './message';
import { alterSecurityPoolDetail } from '@/services/securityPool/index';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const marketOption = transformDictToMarketOptions(
  TRADING_MARKETS.filter((r) => r.code !== '-1')
);

const transformDictFilter = (
  dict: readonly { code: string; name: string }[]
) => {
  return dict
    .map((item) => {
      return { value: item.code, label: `${item.code}-${item.name}` };
    })
    .filter((it) => !it.label.includes('不区分'));
};

interface Ref {
  getFormValueAsync: () => Promise<
    TypeSelectorPool<'PoolDetailForm'> | undefined
  >;
}
type ItemOption = {
  label: string;
  value: string;
  code: string;
};
interface Props extends PoolDetailFormProps {
  secuPoolList?: QuerySecuPoolRspDto[];
}
// 将接口数据入参格式的数据转换为组件表单的数据格式
const getInitialValue = ({
  mode,
  defaultValues,
}: {
  mode: DictFeKeyEnumType['OPERATION_TYPES'];
  defaultValues?: any;
}) => {
  console.log(defaultValues);
  const emptyValue = {
    securityCode: undefined,
    marketId: undefined,
    effectBeginDate: undefined,
    effectEndDate: undefined,
    remark: undefined,
  };

  return {
    ...emptyValue,

    securityCode: `${defaultValues?.securityCode ?? ''} ${
      defaultValues?.securityName ?? ''
    }`,

    marketId: String(defaultValues?.marketId),
    secuPoolName: defaultValues?.secuPoolName ?? '',
    secuPoolId: defaultValues?.secuPoolId,
    remark: defaultValues?.remark,
    effectBeginDate: defaultValues?.effectBeginDate
      ? dayjs(`${defaultValues.effectBeginDate}`, 'YYYYMMDD')
      : '',
    effectEndDate: defaultValues?.effectEndDate
      ? dayjs(`${defaultValues.effectEndDate}`, 'YYYYMMDD')
      : '',
  };
};
const PoolDetailForm = forwardRef<Ref, Props>(
  ({ mode, onClose, defaultValues, secuPoolList }, ref) => {
    const [form] = Form.useForm<TypeSelectorPool<'PoolDetailForm'>>();
    const { activeRoleId } = useUserRoles();
    const initialValues = useMemo(
      () => getInitialValue({ mode, defaultValues }),
      [mode, defaultValues]
    );
    const handleSubmit = useCallback(async () => {
      const result = await form.validateFields();
      const dataToSubmit = {
        ...result,
      };
      const dataList = [
        {
          securityCode: defaultValues?.securityCode,
          marketId: defaultValues?.marketId,
          effectBeginDate: dataToSubmit.effectBeginDate
            ? dayjs(dataToSubmit.effectBeginDate).format('YYYYMMDD')
            : '',
          effectEndDate: dataToSubmit.effectEndDate
            ? dayjs(dataToSubmit.effectEndDate).format('YYYYMMDD')
            : '',
          remark: dataToSubmit.remark ?? '',
        },
      ];
      const alterTypes = OPERATION_TYPES.find((d) => d.feKey === mode);
      try {
        const securityPoolDetailRes = await alterSecurityPoolDetail({
          modifyType: Number(alterTypes?.code),
          secuPoolId: dataToSubmit?.secuPoolId as number,
          poolSecurityList: dataList as any[],
        });
        if (
          securityPoolDetailRes.code !== 0 &&
          securityPoolDetailRes.code !== 145003
        ) {
          return;
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
      return dataToSubmit;
    }, [activeRoleId, form, mode]);
    useImperativeHandle(
      ref,
      () => ({
        getFormValueAsync: handleSubmit,
      }),
      [handleSubmit]
    );
    const compareDates = (_: any, value: Dayjs) => {
      const startDate = form.getFieldValue('effectBeginDate');
      if (!value || !startDate) {
        return Promise.resolve();
      }
      if (dayjs(value).isBefore(startDate)) {
        return Promise.reject(new Error('结束日期不得小于开始日期'));
      }
      return Promise.resolve();
    };
    return (
      <div className={styles.detailForm}>
        {
          <Form
            name="poolDetailForm"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            autoComplete="off"
            initialValues={initialValues}
            form={form}
            style={{
              width: '100%',
              marginTop: '12px',
            }}
          >
            <FormItem
              label="隶属券池"
              name="secuPoolId"
              style={{ display: 'none' }}
              rules={[
                {
                  required: true,
                  message: '隶属券池不能为空',
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              label="隶属券池"
              name="secuPoolName"
              rules={[
                {
                  required: true,
                  message: '隶属券池不能为空',
                },
              ]}
            >
              <Input disabled={true} />
            </FormItem>

            <FormItem label="证券代码" name="securityCode">
              <Input disabled={true} />
            </FormItem>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '交易市场不能为空',
                },
              ]}
              label="交易市场"
              name="marketId"
            >
              <Select
                disabled={true}
                options={transformDictFilter(TRADING_MARKETS)}
              />
            </FormItem>
            <FormItem label="有效起始日期" name="effectBeginDate">
              <DatePicker format="YYYY-MM-DD" />
            </FormItem>
            <FormItem
              label="有效截止日期"
              name="effectEndDate"
              rules={[{ validator: compareDates }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </FormItem>
            <FormItem label="备注" name="remark">
              <TextArea rows={4} maxLength={100} />
            </FormItem>
          </Form>
        }
      </div>
    );
  }
);

export default PoolDetailForm;
