import { BasicForm, FormActionType } from '@/components/Form';
import { message, Modal } from 'antd';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FORM_MODE, getBasicIndexSchemas } from './data';
import { alterIndexInfo, ReqAlterIndexInfo } from '@/services/securityInfo';
import styles from './styles.less';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import { useUserInfo } from '@/hooks';

export interface IProps {
  onRefresh?: () => void;
}

export interface IAction {
  open: (mode: FORM_MODE, value?: Recordable) => void;
}

const EditIndexModal = forwardRef<IAction, IProps>(({ onRefresh }, ref) => {
  const [mode, setMode] = useState<FORM_MODE>(FORM_MODE.ADD);
  const [open, setOpen] = useState<boolean>(false);
  const basicFormRef = useRef<FormActionType>(null);
  const [loading, setLoading] = useState(false);

  // 缓存值
  const [cacheBasicData, setCacheBasicData] = useState({});

  const userInfo = useUserInfo();

  const basicSchemas = useMemo(
    () => getBasicIndexSchemas(mode, cacheBasicData),
    [mode, cacheBasicData]
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
        setTimeout(() => {
          basicFormRef.current?.setFieldsValue(basicData);
          basicFormRef.current?.updateSchemas([
            { field: 'marketId', dynamicDisabled: true },
            { field: 'securityCode', dynamicDisabled: true },
          ]);
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
      const params: DeepPartial<ReqAlterIndexInfo> = {
        modifyType: mode === FORM_MODE.ADD ? 1 : 2,
        operatorCode: userInfo?.displayName,
        informationSystemId: basicData.informationSystemId,
        securityCode: basicData.securityCode,
        securityName: basicData.securityName,
        marketId: basicData.marketId,
        securityType: basicData.securityType,
        tradeCurrencyCode: basicData.tradeCurrencyCode,
      };
      const res = await alterIndexInfo(params);
      if (res.errorId !== 0) {
        throw Error(res.errorMessage);
      }
      message.success('操作成功');
      onRefresh && onRefresh();
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      //  error.message && message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={mode === FORM_MODE.ADD ? '新增指数' : '编辑指数'}
      open={open}
      onCancel={() => setOpen(false)}
      width={500}
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
            baseColProps={{ span: 24 }}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            schemas={basicSchemas}
          />
        </div>
      </div>
    </Modal>
  );
});

export default EditIndexModal;
