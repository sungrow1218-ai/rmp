import { Form, Input, InputNumber, message, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { GeneraList } from '../../RightTable';
import { TRADING_MARKETS } from '@/utils/dict';
import { useMemoizedFn } from 'ahooks';
import {
  alterGeneralLimitDetail,
  alterLimitDetailParams,
} from '@/services/generalLimit';
import SearchInput from './SearchInput';
import SecuritySingleSelect from '@/components/SecuritySingleSelect/SecuritySingleSelectRebuild';

const transformDictFilter = (
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

interface Props {
  open: boolean;
  mode: number;
  selectRecord?: GeneraList[];
  onClose: () => void;
  reFresh: (p?: any) => void;
  groupKey: number;
}
const EditPoolModal: React.FC<Props> = ({
  open,
  mode,
  selectRecord,
  onClose,
  reFresh,
  groupKey,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const ModeToTitleMap = {
    add: '新增证券',
    edit: '编辑证券',
    unkonw: '未知模式',
  };
  const type = mode === 1 ? 'add' : mode === 2 ? 'edit' : 'unkonw';
  const modeType = ModeToTitleMap[type];

  const watchMarket: string = Form.useWatch('marketId', form);

  useEffect(() => {
    if (open && mode === 2 && selectRecord && selectRecord.length === 1) {
      form.setFieldsValue({
        security: `${selectRecord[0].securityCode} ${selectRecord[0].securityName}`,
        marketId: selectRecord[0].marketId.toString() ?? '未知市场',
        limitValue: selectRecord ? selectRecord[0]?.limitValue * 100 : 0,
      });
    }
  }, [form, mode, open, selectRecord]);

  const alterDetailData = useMemoizedFn(async () => {
    setLoading(true);
    const quleQueryParams: alterLimitDetailParams = {
      alterType: mode,
      groupId: groupKey,
    };
    const fromData = await form.validateFields();
    if (selectRecord?.length === 1 && mode === 2) {
      const dataList = selectRecord.map((p) => {
        return {
          securityCode: p.securityCode,
          marketId: p.marketId,
          limitValue: fromData.limitValue
            ? Number(fromData.limitValue) / 100
            : 0,
        };
      });
      quleQueryParams.poolSecurityList = dataList;
    }
    if (mode === 1) {
      const poolSecurityList = [
        {
          securityCode: fromData.security.securityCode,
          marketId: Number(fromData.marketId),
          limitValue: fromData.limitValue
            ? Number(fromData.limitValue) / 100
            : 0,
        },
      ];

      quleQueryParams.poolSecurityList = poolSecurityList;
    }
    try {
      const result = await alterGeneralLimitDetail(quleQueryParams);
      if (result.code !== 0) {
        // message.error({
        //   content: `${result.message}`,
        // });
        return;
      } else if (
        result.data &&
        Array.isArray(result.data.faultList) &&
        result.data.faultList.length > 0
      ) {
        message.error({
          content: `${result.data.faultList[0]?.errorInfo ?? '操作失败'}`,
        });
        return;
      } else {
        message.success({ content: '操作成功' });
      }
      onClose();
      form.resetFields();
      reFresh();

      // }
    } catch (error) {
      // message.error({ content: `${JSON.stringify(error)}` });
    } finally {
      setLoading(false);
    }
  });

  const security = Form.useWatch('security', form);

  useEffect(() => {
    if (mode === 2) return;
    if (!security) {
      form.setFieldValue('marketId', undefined);
    } else {
      form.setFieldValue('marketId', String(security?.marketId));
    }
  }, [security]);

  return (
    <div>
      <Modal
        title={modeType}
        destroyOnClose={true}
        open={open}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        maskClosable={false}
        okButtonProps={{ loading }}
        onOk={alterDetailData}
        centered={true}
        width={528}
      >
        {type !== 'unkonw' && (
          <Form form={form} labelCol={{ span: 6 }}>
            {mode === 1 ? (
              <Form.Item
                label="证券代码"
                name="security"
                rules={[{ required: true }]}
              >
                <SecuritySingleSelect placeholder="请输入证券代码" />
              </Form.Item>
            ) : (
              <Form.Item label="证券代码" name="security">
                <Input disabled={true} width={'100%'} />
              </Form.Item>
            )}

            <Form.Item
              name="marketId"
              label="交易市场"
              rules={[{ required: true }]}
            >
              <Select
                style={{ width: '100%' }}
                disabled={true}
                placeholder="输入证券代码,自动填充"
                allowClear={true}
                options={transformDictFilter(TRADING_MARKETS)}
              />
            </Form.Item>
            <Form.Item
              rules={[
                { required: true, message: '请输入0.00~100.00之前的数字' },
                {
                  validator: (_, value) => {
                    if (value < 0 || value > 100) {
                      return Promise.reject('请输入0.00~100.00之前的数字');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              label="限仓值"
              name="limitValue"
            >
              <InputNumber
                style={{ width: ' 100%' }}
                addonAfter={'%'}
                precision={2}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default EditPoolModal;
