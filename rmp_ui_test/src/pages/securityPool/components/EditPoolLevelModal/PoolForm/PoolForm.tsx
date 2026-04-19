import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  SelectProps,
} from '@ht/sprite-ui';

import { FORM_MODES } from '@/pages/ruleSetting/constant';
import {
  PoolFormDataType,
  TypeSelectorPool,
  SecuPoolDTO,
  QuerySecuPoolLayerType,
  PoolLevelProps,
  QuerySecuPoolRspDto,
  QuerySecurityPoolLayerType,
  SecurityPoolResponseDTO,
} from '@/pages/securityPool/contants/tyeping';
import {
  DictFeKeyEnumType,
  OPERATION_TYPES,
  SECU_POOL_TYPES,
} from '@/utils/dict';
import useUserRoles from '@/hooks/useUserRoles';
import { useLockFn, useMemoizedFn } from 'ahooks';
import { useInfoInit } from '@/pages/securityPool/contants/useInfoInit';
import { RolePermissonProps } from '@/pages/roleManage/contant/typing';
import { isArray } from 'lodash';
import { messageInfo, messageTopInfo } from './message';
import { alterSecurityPool } from '@/services/securityPool/index';

const { Option } = Select;
const FormItem = Form.Item;
interface Ref {
  getFormValueAsync: () => Promise<TypeSelectorPool<'PoolForm'> | undefined>;
}
interface Props extends PoolLevelProps<'PoolForm'> {
  secuPoolLayerList: SecurityPoolResponseDTO[];
  selectRecord?: any;
}

// 将接口数据入参格式的数据转换为组件表单的数据格式
const getInitialValue = ({
  mode,
  defaultValues,
}: {
  mode: DictFeKeyEnumType['OPERATION_TYPES'];
  defaultValues?: TypeSelectorPool<'PoolForm'>;
}): Partial<TypeSelectorPool<'PoolForm'>> => {
  const emptyValue = {
    secuPoolLayerId: undefined,
    secuPoolId: undefined,
    secuPoolName: undefined,
  };

  if (!defaultValues) {
    return emptyValue;
  }

  return {
    ...emptyValue,
    ...defaultValues,
  };
};
const PoolForm: React.ForwardRefRenderFunction<Ref, Props> = (
  { mode, formType, onClose, defaultValues, secuPoolLayerList, selectRecord },
  ref
) => {
  const initialValues = useMemo(
    () => getInitialValue({ mode, defaultValues }),
    [mode, defaultValues]
  );
  useEffect(() => {
    form.resetFields();
  }, [mode, defaultValues]);
  const [workGroupId, setWorkGroupId] = useState(-1);
  const useInfoInitFun = useInfoInit();

  const [form] = Form.useForm<TypeSelectorPool<'PoolForm'>>();
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
        message.success({ content: messageTopInfo(Number(alterTypes?.code)) });
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
  const getWorkId = (value: any, option: RolePermissonProps) => {
    setWorkGroupId(option?.workGroupId);
  };
  useEffect(() => {
    if (defaultValues?.workGroupId) {
      setWorkGroupId(defaultValues?.workGroupId);
    }
  }, [defaultValues?.workGroupId]);
  return (
    <div>
      {formType === 'PoolForm' && (
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
            rules={[
              {
                required: true,
                message: '隶属层级不能为空',
              },
            ]}
          >
            <Select
              placeholder="请选择隶属层级"
              disabled={mode === 'EDIT'}
              onChange={getWorkId}
              showSearch={true}
              filterOption={(input, option) =>
                (option.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {isArray(useInfoInitFun?.secuPoolLayerAuthData) &&
                useInfoInitFun?.secuPoolLayerAuthData.length > 0 &&
                (mode === 'ADD'
                  ? useInfoInitFun?.secuPoolLayerAuthData ?? []
                  : useInfoInitFun?.secuPoolLayerData ?? []
                ).map((item) => (
                  <Option
                    value={item.secuPoolLayerId}
                    key={item.secuPoolLayerId}
                    workGroupId={item.workGroupId}
                  >
                    {item.secuPoolLayerName}
                  </Option>
                ))}
            </Select>
          </FormItem>

          <FormItem label="券池编号" name="secuPoolId">
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
      )}
    </div>
  );
};

export default forwardRef(PoolForm);
