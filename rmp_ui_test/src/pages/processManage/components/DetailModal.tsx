import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../styles.less';
import {
  Button,
  Divider,
  Form,
  message,
  Modal,
  Space,
  Typography,
} from '@ht/sprite-ui';
import { DetailState, TimeInfo } from '../contant/typing';
import DetailBaseInfo from './BaseInfo.tsx/DetailBaseInfo';

import Doing from './StatusBar/Doing';
import { ProcessListData, queryDetail, queryProcess } from '@/services/process';
import { useMemoizedFn } from 'ahooks';
import TextArea from '@ht/sprite-ui/lib/input/TextArea';
import DetailForm from './BaseInfo.tsx/DetailForm';
import { getPopupContainer } from '@/utils/dom';
// import { defaultValues } from './mock';

const { Title } = Typography;

interface DetailModalProps {
  visible: boolean;
  record: ProcessListData | null;
  onClose: () => void;
  eipAble: number;
  refetch: () => void;
  mode: string;
}

const DetailModal: FC<DetailModalProps> = ({
  visible,
  onClose,
  record,
  eipAble,
  refetch,
  mode,
}) => {
  const [defaultValues, setDefaultValues] = useState<DetailState | undefined>(
    undefined
  );
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    if (!record) return;
    try {
      const deRes = await queryDetail({ procedureCode: record.procedureCode });
      if (deRes.code !== 0) {
        // message.error({
        //   content: `${deRes.message}`,
        // });
      }
      if (deRes.data && deRes.data.resultList[0]) {
        setDefaultValues(deRes.data.resultList[0]);
      } else {
        setDefaultValues(undefined);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [record, visible]);

  const queryisProcess = useMemoizedFn(
    async (approval: number, procedureCode: string | undefined) => {
      setLoading(true);
      const formData = await form.validateFields();
      try {
        if (!procedureCode) {
          return;
        }
        const comment = formData?.comment ?? '';
        const res = await queryProcess({
          procedureCode,
          approval,
          comment,
        });
        if (res.code !== 0) {
          // message.error(res.message);
          onClose();
          refetch();
          return;
        }
        onClose();
        refetch();
        form.resetFields();
        if (approval === 3) {
          message.success('撤销成功');
          return;
        }
        message.success('审批成功');
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  );

  return (
    <Modal
      title="流程详情"
      open={visible}
      onCancel={onClose}
      width={'100%'}
      style={{ top: '50px' }}
      destroyOnClose={true}
      getContainer={false}
      footer={null}
      bodyStyle={{
        height: 'calc(99vh - 50px)',
      }}
    >
      <div className={styles.wrap}>
        <div
          className={styles.left}
          style={{
            height: 'calc(99vh - 50px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div>
            <div className={styles.title}>
              <Title
                level={4}
                ellipsis={{
                  tooltip: {
                    title: (
                      <div style={{ color: '#333' }}>
                        {defaultValues?.changeItem}
                      </div>
                    ),
                    getTooltipContainer: getPopupContainer,
                    placement: 'right',
                    color: '#fff',
                  },
                }}
                style={{
                  width: '800px',
                  textAlign: 'center',
                  paddingBottom: '24px',
                }}
              >
                {defaultValues?.procedureName}
              </Title>
            </div>
            <div>
              <DetailForm
                defaultValues={defaultValues}
                form={form}
                setOpen={setOpen}
              />
            </div>
          </div>

          <DetailBaseInfo
            open={open}
            setOpen={setOpen}
            defaultValues={defaultValues}
            form={form}
          />

          <div>
            <Form form={form} className={styles.propcessForm}>
              <span
                style={{
                  // marginLeft: '10px',
                  fontWeight: 700,
                }}
              >
                {' '}
                审批意见：
              </span>
              <Form.Item
                style={{ marginBottom: '0px' }}
                name="comment"
                labelAlign="right"
              >
                <TextArea
                  disabled={mode === 'PREVIEW'}
                  style={{ marginTop: '10px', width: '100%' }}
                  rows={2}
                />
              </Form.Item>
            </Form>
            <Divider />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              {mode === 'EDIT' && (
                <Space>
                  <Button
                    onClick={() => {
                      onClose();
                      form.resetFields();
                    }}
                  >
                    返回
                  </Button>
                  <Button
                    onClick={() => {
                      queryisProcess(2, defaultValues?.procedureCode);
                    }}
                    disabled={
                      record?.generalStatus !== 1 ||
                      eipAble === 1 ||
                      defaultValues?.isSelf
                    }
                    loading={loading}
                    type="primary"
                    danger={true}
                  >
                    不予通过
                  </Button>
                  <Button
                    onClick={() => {
                      queryisProcess(1, defaultValues?.procedureCode);
                    }}
                    loading={loading}
                    disabled={
                      record?.generalStatus !== 1 ||
                      eipAble === 1 ||
                      defaultValues?.isSelf
                    }
                    type="primary"
                  >
                    审批通过
                  </Button>
                </Space>
              )}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <Doing defaultValues={defaultValues} />
        </div>
      </div>
    </Modal>
  );
};
export default DetailModal;
