// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { Form, Input, message, Select, SelectProps } from '@ht/sprite-ui';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import {
  DictFeKeyEnumType,
  OPERATION_TYPES,
  TRADING_MARKETS,
} from '@/utils/dict';
import {
  AddProps,
  SeatGroupFormState,
} from '@/pages/seatGroup/contants/tyeping';
import { useAuthHook } from '@/hooks/useAuthhook';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';
import { alterSeatGroup } from '@/services/seatGroup';

const FormItem = Form.Item;
const { TextArea } = Input;

interface Ref {
  getFormValueAsync: () => Promise<Recordable | undefined>;
}
// 将接口数据入参格式的数据转换为组件表单的数据格式
const getInitialValue = ({
  mode,
  defaultValues,
}: {
  mode: DictFeKeyEnumType['OPERATION_TYPES'];
  defaultValues?: SeatGroupFormState;
}) => {
  const emptyValue = {
    workGroupId: defaultValues?.workGroupId,
    marketId: defaultValues?.marketId,
  };
  if (mode === FORM_MODES.ADD || !defaultValues) {
    return emptyValue;
  }

  return {
    ...emptyValue,
    ...defaultValues,
  };
};
const PoolLevelForm: ForwardRefRenderFunction<Ref, AddProps> = (
  { mode, formType, onClose, defaultValues },
  ref
) => {
  const initialValues = useMemo(
    () => getInitialValue({ mode, defaultValues }),
    [mode, defaultValues]
  );
  const [form] = Form.useForm<SeatGroupFormState>();
  const [workGroupId, setWorkGroupId] = useState(0);

  const { workGroupAuth } = useAuthHook();

  const handleSubmit = async () => {
    const result = await form.validateFields();

    const dataToSubmit: SeatGroupFormState = {
      ...result,
    };
    const alterTypes = OPERATION_TYPES.find((d) => d.feKey === mode);
    try {
      const secRes = await alterSeatGroup({
        modifyType: Number(alterTypes?.code),
        ...(result as any),
        workGroupId: result?.workGroupId ?? -1,
        seatGroupId: result.seatGroupId ?? 0,
        remark: result.remark ?? '',
      });
      if (secRes.code === 0) {
        onClose();
        message.success({ content: '提交成功' });
      } else {
        // message.error(secRes.message);
        return;
      }
    } catch (error) {}

    return dataToSubmit;
  };
  useImperativeHandle(
    ref,
    () => ({
      getFormValueAsync: handleSubmit,
    }),
    [handleSubmit]
  );
  const changeIds: SelectProps['onChange'] = (id) => {
    setWorkGroupId(id);
    form.setFieldValue('extSysIdList', []);
    form.setFieldValue('acctLevel', undefined);
    form.setFieldValue('accountList', []);
  };

  useEffect(() => {
    if (mode === 'EDIT') {
      setWorkGroupId(initialValues.workGroupId ?? -1);
    }
  }, [initialValues]);
  return (
    <div>
      {formType === 'PoolLevelForm' && (
        <Form
          name="poolLevel"
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
            label="隶属工作台"
            name="workGroupId"
            rules={[{ required: true, message: '选项必填' }]}
          >
            <Select
              options={
                workGroupAuth.map((i) => ({
                  label: i.workGroupName,
                  value: i.workGroupId,
                })) ?? []
              }
              value={workGroupId}
              onChange={changeIds}
              disabled={mode === 'EDIT'}
            />
          </FormItem>
          <FormItem label="分组序号" name="seatGroupId">
            <Input placeholder="自动生成" disabled={true} />
          </FormItem>
          <FormItem
            label="分组名称"
            name="seatGroupName"
            rules={[
              {
                required: true,
                message: '选项必填',
                transform: (value: string) => value.trim(),
              },
            ]}
          >
            <Input maxLength={30} placeholder="分组名称最长30个字符" />
          </FormItem>
          <Form.Item
            label="交易所"
            name="marketId"
            rules={[
              {
                required: true,
                message: '选项必填',
              },
            ]}
          >
            <Select
              options={transformDictToSelectOptionsNumber(
                TRADING_MARKETS.filter((tm) => ['1', '2'].includes(tm.code))
              )}
              placeholder="选择交易所"
              allowClear={true}
              disabled={mode === 'EDIT'}
            />
          </Form.Item>
          <FormItem label="备注" name="remark">
            <TextArea rows={4} maxLength={100} />
          </FormItem>
        </Form>
      )}
    </div>
  );
};

export default forwardRef(PoolLevelForm);
