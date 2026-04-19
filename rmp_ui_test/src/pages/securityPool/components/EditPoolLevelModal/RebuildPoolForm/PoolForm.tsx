import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Form, Input, message, Select } from 'antd';

import { FORM_MODES } from '@/pages/ruleSetting/constant';
import {
  TypeSelectorPool,
  SecurityPoolResponseDTO,
} from '@/pages/securityPool/contants/tyeping';
import {
  DictFeKeyEnumType,
  OPERATION_TYPES,
  SECU_POOL_TYPES,
} from '@/utils/dict';

import { useLockFn } from 'ahooks';

import { messageTopInfo } from './message';
import { WorkGroupList } from '@/services/account';
import { alterSecurityPool } from '@/services/securityPool/index';

const { Option } = Select;
const FormItem = Form.Item;
interface Ref {
  getFormValueAsync: () => Promise<TypeSelectorPool<'PoolForm'> | undefined>;
}
interface Props {
  mode: DictFeKeyEnumType['OPERATION_TYPES'];
  // formType: string;
  defaultValues?: any;
  // isDetail?: boolean;
  onClose: () => void;
  workGroupList: WorkGroupList[];
  authLayerList?: SecurityPoolResponseDTO[];
}

// 将接口数据入参格式的数据转换为组件表单的数据格式
const getInitialValue = ({
  mode,
  defaultValues,
}: {
  mode: DictFeKeyEnumType['OPERATION_TYPES'];
  defaultValues?: any;
}): Partial<TypeSelectorPool<'PoolForm'>> => {
  const emptyValue = {
    secuPoolLayerId: defaultValues?.secuPoolLayerId ?? -1,
    secuPoolId: undefined,
    secuPoolName: undefined,
    secuPoolLayerName: defaultValues?.secuPoolLayerName ?? -1,
    workGroupId: defaultValues?.workGroupId ?? -1,
    workGroupName: defaultValues?.workGroupName ?? -1,
  };

  if (!defaultValues) {
    return {
      ...emptyValue,
    };
  }

  return {
    ...emptyValue,
    ...defaultValues,
  };
};
const PoolForm = forwardRef<Ref, Props>(
  ({ mode, onClose, defaultValues, authLayerList, workGroupList }, ref) => {
    const initialValues = useMemo(
      () => getInitialValue({ mode, defaultValues }),
      [mode, defaultValues]
    );
    useEffect(() => {
      if (initialValues) {
        form.setFieldsValue({ ...initialValues });
      }
    }, [initialValues]);

    const workGroupId = useMemo(() => {
      if (defaultValues) {
        return defaultValues.workGroupId;
      }
      return 0;
    }, [defaultValues]);

    const [form] = Form.useForm();
    const handleSubmit = useLockFn(async () => {
      const result = await form.validateFields();
      const dataToSubmit = {
        ...result,
      };
      const alterTypes = OPERATION_TYPES.find((d) => d.feKey === mode);
      try {
        const securityPoolRes = await alterSecurityPool({
          modifyType: Number(alterTypes?.code),
          secuPoolLayerId: dataToSubmit.secuPoolLayerId,
          secuPoolId:
            Number(alterTypes?.code) === 1 ? 0 : dataToSubmit.secuPoolId,
          secuPoolName: dataToSubmit.secuPoolName,
          secuPoolType: dataToSubmit.secuPoolType,
          workGroupId,
        });
        if (securityPoolRes.code === 0) {
          onClose();
          message.success({ content: '提交成功' });
        } else if (securityPoolRes.code === 145003) {
          onClose();
          message.success({
            content: messageTopInfo(Number(alterTypes?.code)),
          });
        } else {
          // message.error(securityPoolRes.message);
          return;
        }
      } catch (error) {}
      return dataToSubmit;
    });
    useImperativeHandle(
      ref,
      () => ({
        getFormValueAsync: handleSubmit,
      }),
      [handleSubmit]
    );
    return (
      <div>
        {
          <Form
            name="poolForm"
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
              label="隶属层级"
              name="secuPoolLayerId"
              style={{ display: 'none' }}
              rules={[
                {
                  required: true,
                  message: '隶属层级不能为空',
                },
              ]}
            >
              <Select placeholder="请选择隶属层级" disabled={true}>
                <Input />
              </Select>
            </FormItem>
            <FormItem
              label="隶属层级"
              name="secuPoolLayerName"
              rules={[
                {
                  required: true,
                  message: '隶属层级不能为空',
                },
              ]}
            >
              <Select placeholder="请选择隶属层级" disabled={true}>
                <Input />
              </Select>
            </FormItem>

            <FormItem
              label="券池编号"
              name="secuPoolId"
              style={{ display: mode === 'ADD' ? 'none' : '' }}
            >
              <Input disabled={true} placeholder="自动生成" />
            </FormItem>
            <FormItem
              label="券池名称"
              name="secuPoolName"
              rules={[
                {
                  required: true,
                  message: '券池名称不能为空',
                  transform: (value: string) => value.trim(),
                },
              ]}
            >
              <Input maxLength={15} placeholder="券池名称最长15个字符" />
            </FormItem>
            <FormItem
              label="券池类型"
              name="secuPoolType"
              rules={[
                {
                  required: true,
                  message: '券池类型不能为空',
                },
              ]}
            >
              <Select disabled={mode === 'EDIT'}>
                {SECU_POOL_TYPES.map((item) => (
                  <Option value={item.code} key={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Form>
        }
      </div>
    );
  }
);

export default PoolForm;
