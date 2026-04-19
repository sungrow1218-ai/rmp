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
import styles from './styles.less';

import { FORM_MODE } from './data';
import {
  basicSchemasOpt,
  tradeSchemasOpt,
  basicSchemasOptionKind,
} from './optionsData';
import { alterOptionInfo, alterOptionKind } from '@/services/securityInfo';
import { useOptionKindByMarket } from './useOptionKindByMarket';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import { useUserInfo } from '@/hooks';

import type { IAction, IProps, DataType, FilledFieldsInfo } from './types';
import { restoreReadonlyFields } from './helpers/validation';
import {
  buildGetFieldRules,
  buildBasicSchemas,
  buildTradeSchemas,
} from './helpers/schemaBuilders';
import {
  buildParams,
  handleOptionsEditEcho,
  handleOptionsKindEditEcho,
  recordInitialFilledFieldsInfo,
} from './helpers/formData';

const EditModal = forwardRef<IAction, IProps>(({ onRefresh }, ref) => {
  const [mode, setMode] = useState<FORM_MODE>(FORM_MODE.ADD);
  const [type, setType] = useState<DataType>('options');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const basicFormRef = useRef<FormActionType>(null);
  const tradeFormRef = useRef<FormActionType>(null);

  const [initialFilledFieldsInfo, setInitialFilledFieldsInfo] =
    useState<FilledFieldsInfo>({});
  const userInfo = useUserInfo();

  const { optionKindOptions, optionKindLoading, fetchOptionKinds } =
    useOptionKindByMarket();

  const isSingleColumn = type === 'optionsKind';
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
      modeIsEdit: mode === FORM_MODE.EDIT,
      type,
      initialFilledFieldsInfo,
      basicSchemasOpt,
      tradeSchemasOpt,
      basicSchemasOptionKind,
    });
  }, [mode, type, initialFilledFieldsInfo]);

  const basicSchemas = useMemo(() => {
    return buildBasicSchemas({
      type,
      modeIsEdit: mode === FORM_MODE.EDIT,
      isSingleColumn,
      optionKindLoading,
      optionKindOptions,
      basicSchemasOpt,
      basicSchemasOptionKind,
      getFieldRules,
    });
  }, [
    type,
    mode,
    isSingleColumn,
    optionKindLoading,
    optionKindOptions,
    getFieldRules,
  ]);

  const tradeSchemas = useMemo(() => {
    return buildTradeSchemas({
      type,
      modeIsEdit: mode === FORM_MODE.EDIT,
      tradeSchemasOpt,
      getFieldRules,
    });
  }, [type, mode, getFieldRules]);

  const getTitleByType = () => {
    const action = mode === FORM_MODE.ADD ? '新增' : '编辑';
    return type === 'options' ? `${action}期权信息` : `${action}期权品种`;
  };

  useImperativeHandle(ref, () => ({
    open: async (inputMode, inputType, defaultValue) => {
      setMode(inputMode);
      setType(inputType);
      setOpen(true);

      if (inputMode !== FORM_MODE.EDIT || !defaultValue) {
        setInitialFilledFieldsInfo({});
        basicFormRef.current?.resetFields?.();
        tradeFormRef.current?.resetFields?.();
        return;
      }

      try {
        if (inputType === 'options') {
          await handleOptionsEditEcho({
            defaultValue,
            fetchOptionKinds,
            basicFormRef,
            tradeFormRef,
            basicSchemasOpt,
          });

          setTimeout(() => {
            const fieldsInfo = recordInitialFilledFieldsInfo({
              type: inputType,
              basicFormRef,
              tradeFormRef,
              basicSchemaList: basicSchemasOpt,
              tradeSchemaList: tradeSchemasOpt,
            });
            setInitialFilledFieldsInfo(fieldsInfo);
          }, 100);
        } else {
          await handleOptionsKindEditEcho({
            defaultValue,
            fetchOptionKinds,
            basicFormRef,
            tradeFormRef,
          });

          setTimeout(() => {
            const fieldsInfo = recordInitialFilledFieldsInfo({
              type: inputType,
              basicFormRef,
              tradeFormRef,
              basicSchemaList: basicSchemasOptionKind,
              tradeSchemaList: tradeSchemasOpt,
            });
            setInitialFilledFieldsInfo(fieldsInfo);
          }, 100);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        message.error('数据回显失败，请重试');
      }
    },
  }));

  const handleValuesChange = (changedValues: Recordable) => {
    if (type === 'options' && mode === FORM_MODE.ADD) {
      if (Object.prototype.hasOwnProperty.call(changedValues, 'marketId')) {
        fetchOptionKinds(changedValues.marketId, basicFormRef);
        basicFormRef.current?.setFieldsValue({ optionKindCode: undefined });
      }
    }

    if (mode === FORM_MODE.EDIT) {
      if (type === 'options') {
        restoreReadonlyFields(
          changedValues,
          ['securityCode', 'marketId', 'securityType'],
          basicFormRef
        );
      } else {
        restoreReadonlyFields(
          changedValues,
          ['marketId', 'optionKindCode'],
          basicFormRef
        );
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const basicData = await basicFormRef.current?.validateFields();
      let tradeData: Recordable | undefined;

      if (type === 'options') {
        tradeData = await tradeFormRef.current?.validateFields();
      }

      const params = buildParams({
        type,
        modeAlterType: mode === FORM_MODE.ADD ? 1 : 2,
        operatorCode: userInfo?.displayName,
        basicData,
        tradeData,
      });

      const apiMap = {
        options: alterOptionInfo,
        optionsKind: alterOptionKind,
      };

      const res = await apiMap[type](params);
      if (res.errorId !== 0) throw new Error(res.errorMessage);

      message.success('操作成功');
      onRefresh?.();
      setOpen(false);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e);
      e?.message && message.error(e.message);
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
      okButtonProps={{ loading }}
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

      {type === 'options' && (
        <div>
          <div className={styles.title}>
            <img
              src={TitleImgSrc}
              alt="交易参数"
              style={{
                width: 24,
                height: 24,
                marginRight: 8,
                verticalAlign: 'middle',
              }}
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
