import React, {
  useState,
  useEffect,
  FC,
  forwardRef,
  Ref,
  useMemo,
} from 'react';
import { Form, Modal, Input, message } from '@ht/sprite-ui';
import type { ModalProps } from '@ht/sprite-ui/lib/modal';
import styles from '../styles.less';
import { v4 as uuidv4 } from 'uuid';

import { EditApiModalProps } from '../contant/typing';
import { isEmpty, isFunction } from 'lodash';

const getInitialValue = ({
  defaultValues = {},
  formItems = [],
}: {
  defaultValues: any;
  formItems: any[];
}) => {
  const emptyValue: { [key: string]: any } = {};
  formItems.forEach((h) => {
    emptyValue[h.name] = defaultValues[h.name]
      ? defaultValues[h.name]
      : undefined;
  });

  return {
    ...emptyValue,
  };
};

const EditApiModal: React.FC<EditApiModalProps & ModalProps> = ({
  open,
  onCancel,
  onConfirm,
  apiServe,
  requsetParams,
  initialValues = {},
  formItems = [],
  reqExtral,
  ...props
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues);
    }
  }, [open, initialValues]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let parmas = { ...requsetParams };
      if (reqExtral) {
        parmas = { ...parmas, [reqExtral]: [{ ...values }] };
      } else {
        parmas = { ...parmas, ...values };
      }
      if (isFunction(apiServe)) {
        const response = await apiServe({ ...parmas, ...requsetParams });
        if (response.code !== 0) {
          // message.error(response.message);
          return;
        } else {
          form.resetFields();

          onConfirm(response.data);
        }
      } else {
        await onConfirm(values);
        formItems.forEach((h) => {
          if (!h?.disabled) {
            form.resetFields([h.name]);
          }
        });
      }
    } catch (error) {
      console.log('Request canceled', JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };
  const handleCancel: ModalProps['onCancel'] = (e) => {
    if (onCancel) {
      onCancel(e);
    }
    form.resetFields();
  };
  return (
    <Modal
      open={open}
      width={440}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
      maskClosable={false}
      bodyStyle={{ minHeight: '160px' }}
      destroyOnClose={true}
      centered={true}
      {...props}
    >
      <Form
        name="editApiForm"
        className={styles.editApiForm}
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ flex: 1 }}
        autoComplete="off"
        key={uuidv4()}
      >
        {formItems.map(
          ({
            name,
            label,
            rules,
            disabled,
            placeholder,
            filedComp: FiledCompontes,
            options,
          }) => (
            <div key={uuidv4()} className={styles.formItem}>
              {!FiledCompontes ? (
                <Form.Item name={name} label={label} rules={rules} key={name}>
                  <Input disabled={disabled} placeholder={placeholder} />
                </Form.Item>
              ) : (
                <FiledCompontes
                  options={options}
                  label={label}
                  name={name}
                  rules={rules}
                />
              )}
            </div>
          )
        )}
      </Form>
    </Modal>
  );
};
export default EditApiModal;
