import {
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Spin,
} from '@ht/sprite-ui';
import React, { useEffect, useState } from 'react';
import {
  POSITION_TYPE,
  TRADING_MARKETS,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import { FormInstance } from '@ht/sprite-ui/es/form';

import {
  ExtSysItem,
  queryManageAccount,
  queryTradeAccount,
} from '@/services/account';
import { tranFromDataToOption } from '@/utils/utils';
import {
  adjustPosition,
  AdjustPositionParams,
  PositionResultList,
} from '@/services/position';

import SecuritySingleSelect from '@/components/SecuritySingleSelect';
import { Option } from '../PositionMain';

interface Props {
  open: boolean;
  mode: number;
  form: FormInstance;
  onClose: () => void;
  reFresh: (p?: any) => void;
  systemInfo: ExtSysItem[] | undefined;
  selectData: PositionResultList | null;
  nodeOptions: Option[];
}
const FormItem = Form.Item;
const OperaModal: React.FC<Props> = ({
  open,
  mode,
  onClose,
  form,
  reFresh,
  systemInfo,
  selectData,
  nodeOptions,
}) => {
  const adjustType = Form.useWatch('adjustType', form);
  const extSysId = Form.useWatch('extSysId', form);
  const formPositionType = Form.useWatch('positionType', form);
  const [manageList, setmanageList] = useState<any[]>();
  const [tradeList, setTradeList] = useState<any[]>([]);
  const [load, setLoad] = useState(false);
  const [tradeLoad, setTradeLoad] = useState(false);
  const [manageLoad, setManageLoad] = useState(false);
  useEffect(() => {
    if (!open) return;
    if (mode === 2) {
      if (adjustType === 0) {
        form.setFieldValue('adjustAfterAmount', selectData?.currentAmount);
      }
      if (adjustType === 1) {
        form.setFieldValue(
          'adjustAfterAmount',
          selectData?.currentImpawnAmount
        );
      }
    } else {
      form.setFieldValue('adjustAfterAmount', '');
    }
  }, [adjustType, selectData, open]);

  useEffect(() => {
    if (formPositionType && formPositionType !== '1') {
      form.setFieldValue('adjustType', 0);
    }
  }, [formPositionType]);
  const alterDetail = async () => {
    setLoad(true);
    try {
      let param: AdjustPositionParams | null = null;
      const dt = await form.validateFields();
      if (mode === 1) {
        const [securityCode, marketId] = dt.securityCode?.split('|');
        const [tradeCode, ...any] = dt.baseTradeAcct.split('|');
        param = {
          nodeId: Number(dt.nodeId),
          marketId: Number(marketId),
          extSysId: dt.extSysId,
          baseTradeAcct: tradeCode,
          baseManageAcct: dt.baseManageAcct,
          positionType: dt.positionType,
          adjustType: dt.adjustType,
          adjustBeforeAmount: 0,
          adjustAfterAmount: dt.adjustAfterAmount,
          securityCode,
        };
      }
      if (mode === 2 && selectData) {
        const { adjustType, adjustAfterAmount } = dt;
        const amountFlag =
          adjustType === 0
            ? selectData.currentAmount === adjustAfterAmount
            : selectData.currentImpawnAmount === adjustAfterAmount;
        if (amountFlag) {
          message.warning('持仓数量或质押数量没有改变!');
          return;
        }
        param = {
          nodeId: Number(dt.nodeId),
          marketId: selectData?.marketId ?? 0,
          extSysId: selectData?.extSysId ?? 0,
          baseTradeAcct:
            selectData.tradeAcct?.find((p) => p.bookLevel === 1)?.acctCode ??
            '',
          baseManageAcct:
            selectData.manageAcct?.find((p) => p.bookLevel === 1)?.acctCode ??
            '',
          positionType: selectData.positionType,
          adjustType,
          adjustBeforeAmount:
            adjustType === 0
              ? selectData.currentAmount
              : selectData.currentImpawnAmount,
          adjustAfterAmount: dt.adjustAfterAmount,
          securityCode: selectData.securityCode,
        };
      }
      if (!param) return;
      const res = await adjustPosition(param);
      if (res.code !== 0) {
        // message.error({
        //   content: `${res.message}`,
        // });
        return;
      }
      message.success('操作成功');
      reFresh();
      onClose();
    } catch (error) {
    } finally {
      setLoad(false);
    }
  };

  const handleChange = (e: any, optionData: any) => {
    form.setFieldsValue({
      securityCode: optionData.key,
    });
  };

  useEffect(() => {
    if (!extSysId) {
      setTradeList([]);
      setmanageList([]);
    }
    if (mode === 1) {
      form.setFieldsValue({
        baseTradeAcct: '',
        baseManageAcct: '',
      });
    }
    const fetchTrade = async () => {
      if (!extSysId) return;
      try {
        setTradeLoad(true);
        const tradeRes = await queryTradeAccount({
          pageId: 1,
          pageSize: 5000,
          filterCondition: {
            extSysId: [extSysId],
          },
        });
        if (tradeRes.code !== 0) {
          setTradeList([]);
          throw new Error('获取交易账户失败');
        }
        const _tradeList = tradeRes.data?.resultList;
        if (_tradeList && _tradeList.length > 0) {
          const _data = _tradeList.filter((p) => p.bookLevel === 1);
          const _option = _data.map((p) => {
            return {
              label: `${p.acctCode} ${
                p.acctName
              } ${transformDictCodeToNameHelper(
                String(p.marketId),
                TRADING_MARKETS
              )}`,
              value: `${p.acctCode}|${p.marketId}`,
            };
          });
          setTradeList(_option);
        } else {
          setTradeList([]);
        }
      } catch (error) {
      } finally {
        setTradeLoad(false);
      }
    };
    const fetchManage = async () => {
      if (!extSysId) return;
      try {
        setManageLoad(true);
        const tradeRes = await queryManageAccount({
          pageId: 1,
          pageSize: 5000,
          filterCondition: {
            extSysId: [extSysId],
          },
        });
        if (tradeRes.code !== 0) {
          setmanageList([]);
          throw new Error('获取交易账户失败');
        }
        const _tradeList = tradeRes.data?.resultList;
        if (_tradeList && _tradeList.length > 0) {
          const _data = _tradeList.filter((p) => p.bookLevel === 1);
          const _option = _data.map((p) => {
            return {
              label: `${p.acctCode} ${p.acctName}
              `,
              value: `${p.acctCode}`,
            };
          });
          setmanageList(_option);
        } else {
          setmanageList([]);
        }
      } catch (error) {
      } finally {
        setManageLoad(false);
      }
    };
    fetchTrade();
    fetchManage();
  }, [extSysId]);

  return (
    <div>
      <Modal
        title={
          <span style={{ fontSize: '18px', fontWeight: '600' }}>
            {mode === 1 ? '持仓新增' : '持仓修改'}
          </span>
        }
        destroyOnClose={true}
        open={open}
        onCancel={() => {
          onClose();
        }}
        maskClosable={false}
        okButtonProps={{ loading: load }}
        onOk={alterDetail}
        centered={true}
        width={528}
      >
        <Form
          form={form}
          name="search_entrust"
          labelCol={{ span: 6 }}
          initialValues={{ adjustType: 0 }}
        >
          <FormItem
            label="节点号"
            name="nodeId"
            rules={[{ required: true, message: '请选择节点号' }]}
          >
            <Select
              disabled={mode === 2}
              allowClear={true}
              options={nodeOptions}
            />
          </FormItem>
          <FormItem
            label="外部系统号"
            name="extSysId"
            rules={[{ required: true }]}
          >
            <Select
              disabled={mode === 2}
              placeholder="请选择交易系统"
              options={tranFromDataToOption(
                systemInfo,
                'extSysName',
                'extSysId'
              )}
            />
          </FormItem>

          <FormItem label="交易基础账户" name="baseTradeAcct">
            <Select
              placeholder={'请选择交易基础账户'}
              loading={tradeLoad}
              disabled={mode === 2}
              options={tradeList}
              showPopup={true}
              showSearch={true}
              allowClear={true}
              dropdownRender={(menu) => {
                return <Spin spinning={tradeLoad}>{menu}</Spin>;
              }}
            />
          </FormItem>

          <FormItem label="管理基础账户" name="baseManageAcct">
            <Select
              placeholder={'请选择管理基础账户'}
              disabled={mode === 2}
              loading={manageLoad}
              showPopup={true}
              options={manageList}
              showSearch={true}
              allowClear={true}
              dropdownRender={(menu) => {
                return <Spin spinning={manageLoad}>{menu}</Spin>;
              }}
            />
          </FormItem>
          <FormItem
            rules={[{ required: true }]}
            label="证券代码"
            name="securityCodeStr"
          >
            <SecuritySingleSelect
              disabled={mode === 2}
              showPopup={true}
              allowClear={true}
              placeholder={'请输入证券代码进行搜索'}
              onSelect={handleChange}
            />
          </FormItem>
          <FormItem label="证券代码" name="securityCode" hidden={true}>
            <Input />
          </FormItem>
          <FormItem
            label="持仓类型"
            rules={[{ required: true }]}
            name="positionType"
          >
            <Select
              disabled={mode === 2}
              options={tranFromDataToOption(POSITION_TYPE, 'name', 'code')}
            />
          </FormItem>
          <FormItem
            rules={[{ required: true }]}
            label="调整类型"
            name="adjustType"
          >
            <Radio.Group>
              <Radio value={0}>持仓数量</Radio>
              <Radio disabled={formPositionType !== '1'} value={1}>
                质押数量
              </Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={adjustType === 0 ? '当前持仓数量' : '当前质押数量'}
            name="adjustAfterAmount"
            rules={[{ required: true }]}
          >
            <InputNumber
              max={100000000000}
              addonAfter={'股/手'}
              style={{ width: '100%' }}
            />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};

export default OperaModal;
