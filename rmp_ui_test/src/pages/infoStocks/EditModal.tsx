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
import {
  FORM_MODE,
  relaSchemas,
  getTradeSchemas,
  getBasicSchemas,
} from './data';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import {
  alterStockInfo,
  ReqAlterStockInfo,
  StockItem,
} from '@/services/securityInfo';
import dayjs from 'dayjs';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { buildShortUUID } from '@/utils/uuid';
import { useGetState } from 'ahooks';
import { useUserInfo } from '@/hooks';

export interface IProps {
  onRefresh?: () => void;
}

export interface IAction {
  open: (mode: FORM_MODE, defaultValue?: StockItem) => void;
}

const EditModal = forwardRef<IAction, IProps>(({ onRefresh }, ref) => {
  const [mode, setMode] = useState<FORM_MODE>(FORM_MODE.ADD);
  const [open, setOpen] = useState<boolean>(false);
  const basicFormRef = useRef<FormActionType>(null);
  const tradeFormRef = useRef<FormActionType>(null);
  const [loading, setLoading] = useState(false);
  const [relaKeys, setRelaKeys, getRelaKeys] = useGetState<string[]>([]);
  const relaRefs = useRef<{ [key: string]: FormActionType | null }>({});

  // 缓存值
  const [cacheBasicData, setCacheBasicData] = useState({});
  const [cacheTradeData, setCacheTradeData] = useState({});

  useImperativeHandle(ref, () => ({
    open: (inputMode, defaultValue) => {
      setMode(inputMode);
      setOpen(true);
      setRelaKeys([]);
      if (inputMode === FORM_MODE.EDIT && defaultValue) {
        const basicData: Recordable = {
          informationSystemId: defaultValue.informationSystemId,
          securityCode: defaultValue.securityCode,
          securityName: defaultValue.securityName,
          marketId: defaultValue.marketId,
          securityType: defaultValue.securityType,
          tradeCurrencyCode: defaultValue.tradeCurrencyCode,
          boardType: defaultValue.boardType,
          issuerOrganizationCode: defaultValue.issuerOrganizationCode,
          listDate: defaultValue.listDate
            ? dayjs(String(defaultValue.listDate), 'YYYYMMDD')
            : undefined,
          delistDate: defaultValue.delistDate
            ? dayjs(String(defaultValue.delistDate), 'YYYYMMDD')
            : undefined,
        };
        const tradeData: Recordable = {
          totalShare: defaultValue.totalShare,
          outstandingShare: defaultValue.outstandingShare,
          tradeUnitType: defaultValue.tradeUnitType,
          tradeUnitAmount: defaultValue.tradeUnitAmount,
          tradeStatus: defaultValue.tradeStatus,
        };
        if (defaultValue.securityRelativeList) {
          setRelaKeys(
            defaultValue.securityRelativeList.map((i) => buildShortUUID())
          );
          setTimeout(() => {
            for (
              let index = 0;
              index < defaultValue.securityRelativeList.length;
              index++
            ) {
              const {
                secuCodeRelaType,
                relatedSecurityCode,
                relatedMarketId,
                effectiveDate,
                expireDate,
              } = defaultValue.securityRelativeList[index];
              relaRefs.current[getRelaKeys()[index]]?.setFieldsValue({
                secuCodeRelaType,
                relatedSecurityCode,
                relatedMarketId,
                effectiveDate: effectiveDate
                  ? dayjs(effectiveDate, 'YYYYMMDD')
                  : undefined,
                expireDate: expireDate
                  ? dayjs(expireDate, 'YYYYMMDD')
                  : undefined,
              });
            }
          }, 100);
        }
        setTimeout(() => {
          basicFormRef.current?.setFieldsValue(basicData);
          basicFormRef.current?.updateSchemas([
            { field: 'securityCode', dynamicDisabled: true },
            { field: 'marketId', dynamicDisabled: true },
          ]);
          tradeFormRef.current?.setFieldsValue(tradeData);
        }, 100);
        // 缓存
        setCacheBasicData(basicData);
        setCacheTradeData(tradeData);
      }
    },
  }));

  const userInfo = useUserInfo();

  const basicSchemas = useMemo(
    () => getBasicSchemas(mode, cacheBasicData),
    [mode, cacheBasicData]
  );

  const tradeSchemas = useMemo(
    () => getTradeSchemas(mode, cacheTradeData),
    [mode, cacheTradeData]
  );

  const handleValidate = () => {
    const relaRefList = [];
    for (const item of relaKeys) {
      relaRefList.push(relaRefs.current[item]?.validateFields());
    }
    // 校验
    return Promise.all([
      basicFormRef.current?.validateFields(),
      tradeFormRef.current?.validateFields(),
      ...relaRefList,
    ]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await handleValidate();
      const basicData = await basicFormRef.current?.validateFields();
      const tradeData = await tradeFormRef.current?.validateFields();
      const securityRelativeList = [];
      for (const item of relaKeys) {
        const {
          secuCodeRelaType,
          relatedSecurityCode,
          relatedMarketId,
          effectiveDate,
          expireDate,
        } = await relaRefs.current[item]?.validateFields();
        securityRelativeList.push({
          secuCodeRelaType,
          relatedSecurityCode,
          relatedMarketId,
          effectiveDate: effectiveDate
            ? effectiveDate.format('YYYYMMDD')
            : undefined,
          expireDate: expireDate ? expireDate.format('YYYYMMDD') : undefined,
        });
      }
      const params: DeepPartial<ReqAlterStockInfo> = {
        operatorCode: userInfo?.displayName,
        informationSystemId: basicData.informationSystemId,
        modifyType: mode === FORM_MODE.ADD ? 1 : 2,
        securityCode: basicData.securityCode,
        securityName: basicData.securityName,
        marketId: basicData.marketId,
        securityType: basicData.securityType,
        tradeCurrencyCode: basicData.tradeCurrencyCode,
        boardType: basicData.boardType,
        securityRelativeList,
        issuerOrganizationCode: basicData.issuerOrganizationCode,
        listDate: basicData.listDate
          ? basicData.listDate.format('YYYYMMDD')
          : undefined,
        delistDate: basicData.delistDate
          ? basicData.delistDate.format('YYYYMMDD')
          : undefined,
        totalShare: tradeData.totalShare,
        outstandingShare: tradeData.outstandingShare,
        tradeUnitType: tradeData.tradeUnitType,
        tradeUnitAmount: tradeData.tradeUnitAmount,
        tradeStatus: tradeData.tradeStatus,
      };
      const res = await alterStockInfo(params);
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
      title={mode === FORM_MODE.ADD ? '新增股票信息' : '编辑股票信息'}
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
          <span>证券关联代码</span>
          <PlusOutlined
            style={{ color: '#bb744a', marginLeft: '16px' }}
            onClick={() => setRelaKeys((prev) => [...prev, buildShortUUID()])}
          />
        </div>
        {relaKeys.map((i, index) => (
          <div key={i} className={styles.formBlock}>
            <BasicForm
              ref={(ref) => (relaRefs.current[i] = ref)}
              rowProps={{ gutter: 16 }}
              baseColProps={{ span: 12 }}
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              schemas={relaSchemas}
            />
            <DeleteOutlined
              style={{
                position: 'absolute',
                left: '514px',
                bottom: '30px',
                fontSize: '18px',
              }}
              onClick={() =>
                setRelaKeys((prev) => [...prev].filter((j) => j !== i))
              }
            />
            {relaKeys.length !== index + 1 ? (
              <div className={styles.divider}></div>
            ) : null}
          </div>
        ))}
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
