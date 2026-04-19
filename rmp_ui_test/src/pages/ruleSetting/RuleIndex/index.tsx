import React, { useEffect, useMemo, useRef, useState } from 'react';
import LeftTree from './Left';
import RightTable, { IAction as RightAction } from './Right';
import { Button, Form, message } from 'antd';
import { RuleTypeItem, WorkGroupList } from './type';
import styles from './styles.less';
import ColManage from '@/components/ColManage';
import { useAuthHook } from '@/hooks/useAuthhook';
import useEIP from '@/directives/useEIP';
import { columnOptions } from '../data';
import { exportRiskRule } from '@/services/ruleSetting';
import { downloadByUrl } from '@/utils/file';
import { Mode } from '../type';
import EditRule from '../components/EditRule';
import { QueryRuleSettingRspDTO } from '@/services/ruleSetting/dto';
import { useSobInfo } from '../components/allSobInfo';
import { SobInfo } from '@/services/account';
import { DictCodeEnumType } from '@/utils/dict';

interface Props {
  ruleTypeList: RuleTypeItem[];
  refresh: () => void;
}

interface FormDataType {
  [key: string]: any;
}

type RuleType = DictCodeEnumType['RULE_TYPE_LEVEL_2'];

const RuleIndex: React.FC<Props> = ({ ruleTypeList, refresh }) => {
  const treeRef = useRef<any>(null);
  const rightRef = useRef<RightAction>(null);

  const [form] = Form.useForm();
  const handClickAll = () => {
    treeRef.current.onHighSelectKey();
  };
  const isBackTreeKey = useRef<any>(undefined);

  const setIsBackTreeKey = (value?: boolean) => {
    isBackTreeKey.current = value;
  };
  const [workGroupRuleType, setWorkGroupRuleType] = useState<WorkGroupList[]>(
    []
  );

  // 遮罩是否出现
  const [isVisible, setIsVisible] = useState(false);

  const [_, eipRef] = useEIP();

  const isSelectRuleTypeId = useMemo(() => {
    if (workGroupRuleType && workGroupRuleType.length === 1) {
      if (workGroupRuleType[0].ruleType.length === 1) {
        return workGroupRuleType[0].ruleType[0];
      }
      return false;
    }
    return false;
  }, [workGroupRuleType]);

  const isSelectWorkGroupId = useMemo(() => {
    if (workGroupRuleType && workGroupRuleType.length === 1) {
      if (workGroupRuleType[0].ruleType.length === 1) {
        return workGroupRuleType[0].workGroupId;
      }
      return false;
    }
    return false;
  }, [workGroupRuleType]);

  // 功能权限列表
  const functionAuthList = useAuthHook();

  // 功能权限
  const funcAuth = useMemo(() => {
    const authList = functionAuthList
      ? functionAuthList.menuAuth?.functionAuthList
      : [];
    const editAuth =
      authList?.find((item) => item.functionId === 1)?.useAuth === 1;
    const queryAuth =
      authList?.find((item) => item.functionId === 2)?.useAuth === 1;
    return {
      editAuth,
      queryAuth,
    };
  }, [functionAuthList]);

  const [showColumns, setShowColumns] = useState<string[]>(
    columnOptions.map((i) => i.value)
  );

  const [downloading, setDownLoading] = useState(false);

  const onDownload = async () => {
    try {
      setDownLoading(true);
      let quleQueryParams: any = null;

      const formData: FormDataType = await form.validateFields();
      const filterCondition: { [key: string]: any } = {};
      for (const key of Object.keys(formData)) {
        if (
          (typeof formData[key] === 'string' && formData[key].trim()) ||
          typeof formData[key] === 'number' ||
          (Array.isArray(formData[key]) && formData[key].length > 0)
        ) {
          if (!(key.includes('tradeInput') || key.includes('manageInput'))) {
            filterCondition[key] = formData[key];
          }
        }
        // ruleId转数组形式
        if (key === 'ruleId' && formData.ruleId) {
          filterCondition.ruleId = [Number(formData.ruleId)];
        }
      }
      filterCondition.workGroupList = workGroupRuleType;
      if (!filterCondition.workGroupList?.length) {
        return;
      }
      if (
        formData?.ruleType &&
        Array.isArray(formData.ruleType) &&
        formData.ruleType.length > 0
      ) {
        filterCondition.workGroupList = workGroupRuleType.map((p) => {
          return {
            ...p,
            ruleType: formData.ruleType,
          };
        });
        delete filterCondition.ruleType;
      }
      if (
        formData.createDate &&
        Array.isArray(formData.createDate) &&
        formData.createDate.length > 0
      ) {
        filterCondition.createBeginDate =
          formData.createDate[0].format('YYYYMMDD');
        filterCondition.createEndDate =
          formData.createDate[1].format('YYYYMMDD');
        delete filterCondition.createDate;
      }
      if (
        formData.updateDate &&
        Array.isArray(formData.updateDate) &&
        formData.updateDate.length > 0
      ) {
        filterCondition.updateBeginDate =
          formData.updateDate[0].format('YYYYMMDD');
        filterCondition.updateEndDate =
          formData.updateDate[1].format('YYYYMMDD');
        delete filterCondition.updateDate;
      }
      if (
        formData.controlType &&
        Array.isArray(formData.controlType) &&
        formData.controlType.length > 0
      ) {
        const acctControlClass = formData.controlType?.map((p: string) => {
          if (p.length > 2) {
            const [bookLevel, bookType] = p.split('|');
            return {
              controlAcctType: Number(bookType) === 1 ? 2 : 1,
              acctLevel: Number(bookLevel),
            };
          } else {
            return {
              controlAcctType: Number(p),
            };
          }
        });
        filterCondition.acctControlClass = acctControlClass;
        delete filterCondition.controlType;
      }

      quleQueryParams = {
        filterCondition,
      };
      const res = await exportRiskRule(quleQueryParams);
      if (res.code !== 0) {
        throw new Error('下载失败');
      }
      const { fileUrl } = res?.data;
      downloadByUrl({ url: fileUrl });
      message.success('下载成功');
    } catch (error) {
      // message.error({ content: `下载失败` });
    } finally {
      setDownLoading(false);
    }
  };

  const sobInfo = useSobInfo();

  const [mode, setMode] = useState<Mode>('ADD');
  const [editFormData, setEditFormData] =
    useState<QueryRuleSettingRspDTO | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.text}>
          <p>单个规则创建生成的指标</p>
          <div className={styles.desc}>
            通过自定义规则创建的指标，包含详细的配置信息
          </div>
        </div>
        <div className={styles.action}>
          <div style={{ marginRight: '16px' }}>
            {funcAuth.editAuth && isSelectRuleTypeId && (
              <Button
                type="primary"
                ref={eipRef}
                onClick={() => {
                  setEditFormData(null);
                  setMode('ADD');
                  setVisible(true);
                }}
              >
                创建新指标
              </Button>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingRight: '10px',
            }}
          >
            {funcAuth.queryAuth && (
              <Button loading={downloading} onClick={onDownload}>
                导出数据
              </Button>
            )}
            <ColManage
              customKey={'ruleIndex'}
              columns={columnOptions}
              onColumnChange={(columns) =>
                setShowColumns(
                  columns.filter((i) => i.checked).map((i) => i.value)
                )
              }
            />
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <LeftTree
          form={form}
          setWorkGroupRuleType={setWorkGroupRuleType}
          workGroupRuleType={workGroupRuleType}
          setIsBackTreeKey={setIsBackTreeKey}
          ref={treeRef}
          isVisible={isVisible}
          ruleTypeList={ruleTypeList}
        />
        <RightTable
          ref={rightRef}
          form={form}
          handClickAll={handClickAll}
          isBackTreeKey={isBackTreeKey}
          workGroupRuleType={workGroupRuleType}
          isVisible={isVisible}
          showColumns={showColumns}
          setMode={setMode}
          setEditFormData={setEditFormData}
          setVisible={setVisible}
          onDeleteRefresh={() => refresh()}
        />
        {visible && (editFormData || mode === 'ADD') && (
          <EditRule
            mode={mode}
            onClose={() => {
              setVisible(false);
            }}
            ruleType={
              mode === 'ADD'
                ? (isSelectRuleTypeId as RuleType)
                : (editFormData?.ruleBaseInfo.ruleType as RuleType)
            }
            refetch={() => {
              rightRef.current?.refetch();
              refresh();
            }}
            record={editFormData}
            sobInfo={
              mode === 'ADD'
                ? (sobInfo.find(
                    (item) => item.workGroupId === isSelectWorkGroupId
                  ) as SobInfo)
                : (sobInfo.find(
                    (item) => item.workGroupId === editFormData?.workGroupId
                  ) as SobInfo)
            }
            workGroupId={
              mode === 'ADD'
                ? (isSelectWorkGroupId as number)
                : (editFormData?.workGroupId as number)
            }
          />
        )}
      </div>
    </div>
  );
};

export default RuleIndex;
