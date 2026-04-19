import { BasicForm, FormActionType } from '@/components/Form';
import { message, Modal } from '@ht/sprite-ui';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Mode, ModeToAlterType } from './data';
import { queryWorkGroup } from '@/services/account';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import { RULE_TYPE_LEVEL_2 } from '@/utils/dict';
import { nextTick } from '@/utils/dom';
import { alterRuleApproveExempt } from '@/services/exemptions/index';

interface Props {
  onConfirm: () => void;
}

interface Ref {
  open: (mode: Mode, defaultValue?: Recordable) => void;
}

export interface ModalActionType {
  open: (mode: Mode, defaultValue?: Recordable) => void;
}

// 规则类型选项
const RuleTypeOptions = RULE_TYPE_LEVEL_2.map((i) => ({
  label: i.name,
  value: i.code,
}));

const FormModal: ForwardRefRenderFunction<Ref, Props> = (
  { onConfirm },
  ref
) => {
  const [mode, setMode] = useState(Mode.ADD);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormActionType>(null);

  useImperativeHandle(
    ref,
    () => ({
      open: (mode: Mode, defaultValue?: Recordable) => {
        setOpen(true);
        setMode(mode);
        nextTick(() => {
          if (defaultValue && formRef.current) {
            formRef.current?.setFieldsValue(defaultValue);
          }
          if (mode === Mode.ADD) {
            formRef.current?.resetFields();
          }
        });
      },
    }),
    []
  );

  // 确认操作
  const handleOk = async () => {
    setLoading(true);
    try {
      const params = await formRef.current?.validateFields();
      const result = await alterRuleApproveExempt({
        ...params,
        modifyType: ModeToAlterType[mode],
      });
      if (result.code !== 0) {
        // message.error(result.message);
        return;
      }
      message.success('操作成功');
      setOpen(false);
      onConfirm();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={'规则豁免设置'}
      destroyOnClose={true}
      open={open}
      onCancel={() => setOpen(false)}
      onOk={handleOk}
      forceRender={true}
      okButtonProps={{ loading }}
    >
      <BasicForm
        ref={formRef}
        layout="horizontal"
        rowProps={{ gutter: 16 }}
        baseColProps={{ span: 24 }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        schemas={[
          {
            field: 'userCode',
            label: '用户编码',
            component: 'Input',
            rules: [{ required: true, message: '请填写用户编码' }],
            dynamicDisabled: mode === Mode.EDIT,
            componentProps: {
              placeholder: '请输入用户编码',
              autoComplete: 'off',
            },
          },
          {
            field: 'workGroupId',
            label: '工作台',
            component: 'ApiSelect',
            rules: [{ required: true, message: '请选择工作台' }],
            dynamicDisabled: mode === Mode.EDIT,
            componentProps: {
              placeholder: '请选择工作台',
              api: async (params: any) => {
                const {
                  data: { resultList },
                } = await queryWorkGroup(params);
                return resultList.map((i) => ({
                  label: i.workGroupName,
                  value: i.workGroupId,
                }));
              },
              params: {
                pageId: 1,
                pageSize: 5000,
              },
            },
          },
          {
            field: 'ruleTypeList',
            label: '规则类型',
            component: 'Input',
            rules: [
              { required: true, message: '请选择规则类型', type: 'array' },
            ],
            render: (renderCallbackParams, opts) => (
              <MultipleSelect options={RuleTypeOptions} />
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default forwardRef(FormModal);
