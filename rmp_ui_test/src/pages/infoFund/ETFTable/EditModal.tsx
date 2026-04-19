import { BasicForm, FormActionType } from '@/components/Form';
import { message, Modal } from 'antd';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../styles.less';
import { getBasicSchemas, FORM_MODE } from './data';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import {
  alterEtfComponentStocksDetail,
  ETFItem,
  ReqAlterEtfComponentStocks,
} from '@/services/securityInfo';
import { useUserInfo } from '@/hooks';

export interface IProps {
  onRefresh?: () => void;
}

export interface IAction {
  open: (mode: FORM_MODE, defaultValue?: ETFItem) => void;
}

const EditModal = forwardRef<IAction, IProps>(({ onRefresh }, ref) => {
  const [mode, setMode] = useState<FORM_MODE>(FORM_MODE.ADD);
  const [open, setOpen] = useState<boolean>(false);
  const basicFormRef = useRef<FormActionType>(null);
  const [loading, setLoading] = useState(false);

  // 缓存值
  const [cacheBasicData, setCacheBasicData] = useState({});

  const userInfo = useUserInfo();

  const basicSchemas = useMemo(
    () => getBasicSchemas(mode, cacheBasicData),
    [mode, cacheBasicData]
  );

  useImperativeHandle(ref, () => ({
    open: (inputMode, defaultValue) => {
      setMode(inputMode);
      setOpen(true);
      if (inputMode === FORM_MODE.EDIT && defaultValue) {
        const basicData: Recordable = {
          componentSecurityCode: defaultValue.componentSecurityCode,
          componentMarketId: defaultValue.componentMarketId,
          etfSecurityCode: defaultValue.etfSecurityCode,
          etfMarketId: defaultValue.etfMarketId,
          etfSecurity: {
            securityCode: defaultValue.etfSecurityCode,
            marketId: defaultValue.etfMarketId,
            informationSystemId: defaultValue.informationSystemId,
          },
          purchaseReplaceBalance: defaultValue.purchaseReplaceBalance,
          redeemReplaceBalance: defaultValue.redeemReplaceBalance,
          securityAmount: defaultValue.securityAmount,
          cashReplaceFlag: defaultValue.cashReplaceFlag,
          informationSystemId: defaultValue.informationSystemId,
        };
        setTimeout(() => {
          basicFormRef.current?.setFieldsValue(basicData);
        }, 100);
        // 缓存
        setCacheBasicData(basicData);
      }
    },
  }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const basicData = await basicFormRef.current?.validateFields();
      const params: DeepPartial<ReqAlterEtfComponentStocks> = {
        modifyType: mode === FORM_MODE.ADD ? 1 : 2,
        operatorCode: userInfo?.displayName,
        componentSecurityCode: basicData.componentSecurityCode,
        componentMarketId: basicData.componentMarketId,
        etfSecurityCode: basicData.etfSecurityCode,
        etfMarketId: basicData.etfMarketId,
        purchaseReplaceBalance: basicData.purchaseReplaceBalance,
        redeemReplaceBalance: basicData.redeemReplaceBalance,
        securityAmount: basicData.securityAmount,
        cashReplaceFlag: basicData.cashReplaceFlag,
        informationSystemId: basicData.informationSystemId,
      };
      const res = await alterEtfComponentStocksDetail(params);
      if (res.errorId !== 0) {
        throw Error(res.errorMessage);
      }
      message.success('操作成功');
      onRefresh && onRefresh();
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      ///  error.message && message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={mode === FORM_MODE.ADD ? '新增ETF成分券信息' : '编辑ETF成分券信息'}
      open={open}
      onCancel={() => setOpen(false)}
      width={1000}
      onOk={handleSubmit}
      okButtonProps={{ loading }}
      destroyOnHidden={true}
    >
      <div>
        <div className={styles.title}>
          <img
            src={TitleImgSrc}
            style={{ width: '24px', height: '24px', marginRight: '8px' }}
          />
          <span>基本信息</span>
        </div>
        <div className={styles.formBlock}>
          <BasicForm
            ref={basicFormRef}
            rowProps={{ gutter: 16 }}
            baseColProps={{ span: 12 }}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            schemas={basicSchemas}
            onValuesChange={(changedValues, allValues) => {
              if ('etfSecurity' in changedValues) {
                if (changedValues.etfSecurity === undefined) {
                  basicFormRef.current?.setFieldsValue({
                    etfSecurityCode: undefined,
                    etfMarketId: undefined,
                  });
                } else {
                  const { marketId, securityCode } = changedValues.etfSecurity;
                  basicFormRef.current?.setFieldsValue({
                    etfSecurityCode: securityCode,
                    etfMarketId: marketId,
                  });
                }
              }
            }}
          />
        </div>
      </div>
    </Modal>
  );
});

export default EditModal;
