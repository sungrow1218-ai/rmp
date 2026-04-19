// EditModal.tsx
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BasicForm, FormActionType } from '@/components/Form';
import { message, Modal } from 'antd';
import { FORM_MODE } from './data';
import { useFuturesKindByMarket } from './useFuturesKindByMarket';
import {
  alterContract,
  alterFutureInfo,
  alterFutureKind,
} from '@/services/securityInfo';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import { useUserInfo } from '@/hooks';
import styles from './styles.less';

import type { IAction, IProps, DataType, FilledFieldsInfo } from './types';
import {
  buildGetFieldRules,
  buildBasicSchemas,
  buildTradeSchemas,
} from './helpers/schemaBuilders';
import {
  buildParams,
  getKeyFieldsByType,
  recordInitialFilledFieldsInfo,
  setFormDataByType,
} from './helpers/formData';

const EditModal = forwardRef<IAction, IProps>(({ onRefresh }, ref) => {
  const [mode, setMode] = useState<FORM_MODE>(FORM_MODE.ADD);
  const [type, setType] = useState<DataType>('futures');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [initialFilledFieldsInfo, setInitialFilledFieldsInfo] =
    useState<FilledFieldsInfo>({});

  const basicFormRef = useRef<FormActionType>(null);
  const tradeFormRef = useRef<FormActionType>(null);

  const { futuresKindOptions, futuresKindLoading, fetchFuturesKinds } =
    useFuturesKindByMarket();
  const isSingleColumn = type === 'futuresKind';
  const userInfo = useUserInfo();

  const modalWidth = useMemo(
    () => (isSingleColumn ? 500 : 900),
    [isSingleColumn]
  );

  const layoutConfig = useMemo(
    () => ({
      rowProps: { gutter: 16 },
      baseColProps: { span: isSingleColumn ? 24 : 12 },
      labelCol: { span: isSingleColumn ? 6 : 8 },
      wrapperCol: { span: isSingleColumn ? 18 : 16 },
    }),
    [isSingleColumn]
  );

  const getFieldRules = useMemo(() => {
    return buildGetFieldRules({
      mode: mode === FORM_MODE.EDIT ? 'EDIT' : 'ADD',
      type,
      initialFilledFieldsInfo,
    });
  }, [mode, type, initialFilledFieldsInfo]);

  useImperativeHandle(ref, () => ({
    open: async (inputMode, inputType, defaultValue) => {
      setMode(inputMode);
      setType(inputType);
      setOpen(true);

      if (inputMode === FORM_MODE.ADD) {
        basicFormRef.current?.resetFields();
        tradeFormRef.current?.resetFields();
        setInitialFilledFieldsInfo({});
        return;
      }

      if (inputMode === FORM_MODE.EDIT && defaultValue) {
        try {
          if (inputType === 'futures' && defaultValue.marketId) {
            await fetchFuturesKinds(defaultValue.marketId, basicFormRef);
          }

          setTimeout(() => {
            setFormDataByType(
              inputType,
              { basicFormRef, tradeFormRef },
              defaultValue
            );

            setTimeout(() => {
              const fieldsInfo = recordInitialFilledFieldsInfo(
                inputType,
                basicFormRef,
                tradeFormRef
              );
              if (Object.keys(fieldsInfo).length > 0)
                setInitialFilledFieldsInfo(fieldsInfo);
            }, 150);

            setTimeout(() => {
              const currentValues = (basicFormRef.current?.getFieldsValue?.() ||
                {}) as Record<string, any>;
              const keyFields = getKeyFieldsByType(inputType);
              const missingFields = keyFields.filter(
                (field) => !(field in currentValues)
              );
              if (missingFields.length > 0) {
                // eslint-disable-next-line no-console
                console.warn('数据回显可能不完整，缺失字段:', missingFields);
                message.warning('部分数据可能未正确加载，请检查表单配置');
              }
            }, 200);
          }, 80);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          message.error('编辑数据加载失败，请重试');
          setTimeout(() => {
            setFormDataByType(
              inputType,
              { basicFormRef, tradeFormRef },
              defaultValue
            );
          }, 80);
        }
      }
    },
  }));

  const handleValuesChange = (changedValues: Recordable) => {
    if (type === 'futures' && mode === FORM_MODE.ADD) {
      if (Object.prototype.hasOwnProperty.call(changedValues, 'marketId')) {
        fetchFuturesKinds(changedValues.marketId, basicFormRef);
      }
    }

    if (mode === FORM_MODE.EDIT) {
      const readonlyFields: string[] = [];

      if (type === 'futures') {
        readonlyFields.push(
          'marketId',
          'futuresKindCode',
          'contractMonth',
          'securityType'
        );
      } else if (type === 'contract') {
        readonlyFields.push('marketId');
      }

      const hasTouchedReadonly = readonlyFields.some((f) =>
        Object.prototype.hasOwnProperty.call(changedValues, f)
      );

      if (hasTouchedReadonly) {
        const currentValues = (basicFormRef.current?.getFieldsValue?.() ||
          {}) as Record<string, any>;
        const patch: Record<string, any> = {};

        readonlyFields.forEach((f) => {
          if (Object.prototype.hasOwnProperty.call(changedValues, f))
            patch[f] = currentValues[f];
        });

        if (Object.keys(patch).length > 0)
          basicFormRef.current?.setFieldsValue(patch);
      }
    }
  };

  const basicSchemas = useMemo(() => {
    return buildBasicSchemas({
      type,
      isSingleColumn,
      mode: mode === FORM_MODE.EDIT ? 'EDIT' : 'ADD',
      futuresKindOptions,
      futuresKindLoading,
      getFieldRules,
    });
  }, [
    type,
    isSingleColumn,
    mode,
    futuresKindOptions,
    futuresKindLoading,
    getFieldRules,
  ]);

  const tradeSchemas = useMemo(() => {
    return buildTradeSchemas({
      type,
      mode: mode === FORM_MODE.EDIT ? 'EDIT' : 'ADD',
      getFieldRules,
    });
  }, [type, mode, getFieldRules]);

  const getTitleByType = () => {
    const action = mode === FORM_MODE.ADD ? '新增' : '编辑';
    const titleMap: Record<DataType, string> = {
      futures: `${action}期货信息`,
      futuresKind: `${action}期货品种`,
      contract: `${action}套利合约信息`,
    };
    return titleMap[type] || `${action}信息`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const basicData = await basicFormRef.current?.validateFields();
      let tradeData: Recordable | undefined;
      if (type === 'futures')
        tradeData = await tradeFormRef.current?.validateFields();

      const params = buildParams({
        type,
        modeAlterType: mode === FORM_MODE.ADD ? 1 : 2,
        basicData,
        tradeData,
        operatorCode: userInfo?.displayName,
      });

      const apiMap = {
        futures: alterFutureInfo,
        futuresKind: alterFutureKind,
        contract: alterContract,
      };

      const res = await apiMap[type](params);
      if (res.errorId !== 0) throw new Error(res.errorMessage);

      message.success('操作成功');
      onRefresh?.();
      setOpen(false);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e);
      // e?.message && message.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={getTitleByType()}
      open={open}
      onCancel={() => setOpen(false)}
      width={modalWidth}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose={true}
    >
      <div>
        <div className={styles.title}>
          <img
            src={TitleImgSrc}
            style={{ width: 24, height: 24, marginRight: 8 }}
            alt=""
          />
          基本信息
        </div>

        <div className={styles.formBlock}>
          <BasicForm
            ref={basicFormRef}
            {...layoutConfig}
            schemas={basicSchemas}
            onValuesChange={handleValuesChange}
          />
        </div>
      </div>

      {type === 'futures' && (
        <div>
          <div className={styles.title}>
            <img
              src={TitleImgSrc}
              style={{
                width: 24,
                height: 24,
                marginRight: 8,
                verticalAlign: 'middle',
              }}
              alt=""
            />
            交易参数
          </div>
          <div className={styles.formBlock}>
            <BasicForm
              ref={tradeFormRef}
              rowProps={{ gutter: 16 }}
              baseColProps={{ span: 12 }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              schemas={tradeSchemas}
            />
          </div>
        </div>
      )}
    </Modal>
  );
});

export default EditModal;
