import { BasicForm, FormActionType } from '@/components/Form';
import { message, Modal } from 'antd';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './styles.less';
import { FORM_MODE, getBasicSchemas, getTradeSchemas } from './data';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import {
  alterRepoInfo,
  RepoItem,
  ReqAlterRepoInfo,
} from '@/services/securityInfo';
import { useUserInfo } from '@/hooks';

export interface IProps {
  onRefresh?: () => void;
}

export interface IAction {
  open: (mode: FORM_MODE, defaultValue?: RepoItem) => void;
}

const EditModal = forwardRef<IAction, IProps>(({ onRefresh }, ref) => {
  const [mode, setMode] = useState<FORM_MODE>(FORM_MODE.ADD);
  const [open, setOpen] = useState<boolean>(false);
  const basicFormRef = useRef<FormActionType>(null);
  const tradeFormRef = useRef<FormActionType>(null);
  const [loading, setLoading] = useState(false);

  // 缓存值
  const [cacheBasicData, setCacheBasicData] = useState({});
  const [cacheTradeData, setCacheTradeData] = useState({});

  const userInfo = useUserInfo();

  const basicSchemas = useMemo(
    () => getBasicSchemas(mode, cacheBasicData),
    [mode, cacheBasicData]
  );

  const tradeSchemas = useMemo(
    () => getTradeSchemas(mode, cacheTradeData),
    [mode, cacheTradeData]
  );

  useImperativeHandle(ref, () => ({
    open: (inputMode, defaultValue) => {
      setMode(inputMode);
      setOpen(true);
      if (inputMode === FORM_MODE.EDIT && defaultValue) {
        const basicData: Recordable = {
          informationSystemId: defaultValue.informationSystemId,
          securityCode: defaultValue.securityCode,
          securityName: defaultValue.securityName,
          marketId: defaultValue.marketId,
          securityType: defaultValue.securityType,
          tradeCurrencyCode: defaultValue.tradeCurrencyCode,
        };
        const tradeData: Recordable = {
          tradeUnitType: defaultValue.tradeUnitType,
          tradeUnitAmount: defaultValue.tradeUnitAmount,
        };
        setTimeout(() => {
          basicFormRef.current?.setFieldsValue(basicData);
          tradeFormRef.current?.setFieldsValue(tradeData);
          basicFormRef.current?.updateSchemas([
            { field: 'marketId', dynamicDisabled: true },
            { field: 'securityCode', dynamicDisabled: true },
          ]);
        }, 100);
        // 缓存
        setCacheBasicData(basicData);
        setCacheTradeData(tradeData);
      }
    },
  }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const basicData = await basicFormRef.current?.validateFields();
      const tradeData = await tradeFormRef.current?.validateFields();
      const params: DeepPartial<ReqAlterRepoInfo> = {
        modifyType: mode === FORM_MODE.ADD ? 1 : 2,
        operatorCode: userInfo?.displayName,
        informationSystemId: basicData.informationSystemId,
        securityCode: basicData.securityCode,
        securityName: basicData.securityName,
        marketId: basicData.marketId,
        securityType: basicData.securityType,
        tradeCurrencyCode: basicData.tradeCurrencyCode,
        tradeUnitType: tradeData.tradeUnitType,
        tradeUnitAmount: tradeData.tradeUnitAmount,
      };
      const res = await alterRepoInfo(params);
      if (res.errorId !== 0) {
        throw Error(res.errorMessage);
      }
      message.success('操作成功');
      onRefresh && onRefresh();
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      // error.message && message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={mode === FORM_MODE.ADD ? '新增回购信息' : '编辑回购信息'}
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
          />
        </div>
      </div>
      <div>
        <div className={styles.title}>
          <img
            src={TitleImgSrc}
            style={{ width: '24px', height: '24px', marginRight: '8px' }}
          />
          <span>交易参数</span>
        </div>
        <div className={styles.formBlock}>
          <BasicForm
            ref={tradeFormRef}
            rowProps={{ gutter: 16 }}
            baseColProps={{ span: 12 }}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            schemas={tradeSchemas}
          />
        </div>
      </div>
    </Modal>
  );
});

export default EditModal;
