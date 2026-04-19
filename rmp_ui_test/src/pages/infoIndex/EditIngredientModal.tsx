import { BasicForm, FormActionType } from '@/components/Form';
import { message, Modal } from 'antd';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getBasicIngredientSchemas, FORM_MODE } from './data';
import {
  alterIndexComponentStocksDetail,
  ReqAlterIndexComponentStocks,
} from '@/services/securityInfo';
import styles from './styles.less';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import { useUserInfo } from '@/hooks';

export interface IProps {
  onRefresh?: () => void;
}

export interface IAction {
  open: (
    mode: FORM_MODE,
    indexValue: { indexCode: string; indexMarketId: number },
    value?: Recordable
  ) => void;
}

const EditIngredientModal = forwardRef<IAction, IProps>(
  ({ onRefresh }, ref) => {
    const [mode, setMode] = useState<FORM_MODE>(FORM_MODE.ADD);
    const [open, setOpen] = useState<boolean>(false);
    const basicFormRef = useRef<FormActionType>(null);
    const [loading, setLoading] = useState(false);

    // 缓存值
    const [cacheBasicData, setCacheBasicData] = useState({});

    const userInfo = useUserInfo();

    const basicSchemas = useMemo(
      () => getBasicIngredientSchemas(mode, cacheBasicData),
      [mode, cacheBasicData]
    );

    useImperativeHandle(ref, () => ({
      open: (inputMode, indexValue, defaultValue) => {
        setMode(inputMode);
        setOpen(true);
        if (inputMode === FORM_MODE.EDIT && defaultValue) {
          const basicData: Recordable = {
            informationSystemId: defaultValue.informationSystemId,
            componentSecurityName: defaultValue.securityName,
            componentSecurityCode: defaultValue.componentSecurityCode,
            componentMarketId: defaultValue.componentMarketId,
            componentSecurity: {
              securityCode: defaultValue.componentSecurityCode,
              securityName: defaultValue.securityName,
              marketId: defaultValue.componentMarketId,
              informationSystemId: defaultValue.informationSystemId,
            },
            indexCode: indexValue.indexCode,
            indexMarketId: indexValue.indexMarketId,
            indexWeight: defaultValue.indexWeight,
          };
          setTimeout(() => {
            basicFormRef.current?.setFieldsValue(basicData);
          }, 100);
          // 缓存
          setCacheBasicData(basicData);
        }
        if (inputMode === FORM_MODE.ADD) {
          setTimeout(
            () =>
              basicFormRef.current?.setFieldsValue({
                indexCode: indexValue.indexCode,
                indexMarketId: indexValue.indexMarketId,
              }),
            100
          );
        }
      },
    }));

    const handleSubmit = async () => {
      setLoading(true);
      try {
        const basicData = await basicFormRef.current?.validateFields();
        const params: DeepPartial<ReqAlterIndexComponentStocks> = {
          modifyType: mode === FORM_MODE.ADD ? 1 : 2,
          operatorCode: userInfo?.displayName,
          informationSystemId: basicData.informationSystemId,
          componentSecurityCode: basicData.componentSecurityCode,
          componentMarketId: basicData.componentMarketId,
          indexCode: basicData.indexCode,
          indexMarketId: basicData.indexMarketId,
          indexWeight: basicData.indexWeight,
        };
        const res = await alterIndexComponentStocksDetail(params);
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
        title={mode === FORM_MODE.ADD ? '新增指数成分股' : '编辑指数成分股'}
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
              onValuesChange={(changedValues, allValues) => {
                if ('componentSecurity' in changedValues) {
                  if (changedValues.componentSecurity === undefined) {
                    basicFormRef.current?.setFieldsValue({
                      componentSecurityCode: undefined,
                      componentSecurityName: undefined,
                      componentMarketId: undefined,
                    });
                  } else {
                    const { marketId, securityCode, securityName } =
                      changedValues.componentSecurity;
                    basicFormRef.current?.setFieldsValue({
                      componentSecurityCode: securityCode,
                      componentSecurityName: securityName,
                      componentMarketId: marketId,
                    });
                  }
                }
              }}
            />
          </div>
        </div>
      </Modal>
    );
  }
);

export default EditIngredientModal;
