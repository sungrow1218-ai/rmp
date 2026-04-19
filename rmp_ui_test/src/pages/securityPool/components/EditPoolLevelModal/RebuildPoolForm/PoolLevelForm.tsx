// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { Form, Input, message, Select, SelectProps } from 'antd';
import { useSobInfo } from '@/pages/ruleSetting/components/allSobInfo';
import { WorkGroupList, queryExternSystem } from '@/services/account';
import { DictFeKeyEnumType, OPERATION_TYPES } from '@/utils/dict';
import {
  ControlRangeListProps,
  MergeProps,
  PoolLevelFormType,
  SecurityPoolResponseDTO,
  TypeSelectorPool,
} from '@/pages/securityPool/contants/tyeping';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import AccountAuthSelect from './AccountAuthSelect';
import { useSetState } from 'ahooks';
import { isArray } from 'lodash';
import { messageInfo } from './message';
import { alterSecurityPoolLayer } from '@/services/securityPool/index';

interface Props {
  mode: DictFeKeyEnumType['OPERATION_TYPES'];
  // formType: string;
  defaultValues?: any;
  // isDetail?: boolean;
  onClose: () => void;
  workGroupList: WorkGroupList[];
  authLayerList?: SecurityPoolResponseDTO[];
}

const FormItem = Form.Item;
type Option = {
  label: string;
  value: number;
};

const getInitialValue = ({
  mode,
  defaultValues,
}: {
  mode: DictFeKeyEnumType['OPERATION_TYPES'];
  defaultValues?: any;
}) => {
  const emptyValue = {
    secuPoolLayerId: undefined,
    secuPoolLayerName: undefined,
    workGroupId: undefined,
    controlType: undefined,
    acctLevel: undefined,
    controlRangeList: [],
    extSysIdList: [],
    accountList: [],
  };
  if (mode === 'ADD') {
    return {
      ...emptyValue,
      workGroupId: defaultValues?.workGroupId ?? -1,
      workGroupName: defaultValues?.workGroupName ?? '',
    };
  }

  return {
    ...emptyValue,
    secuPoolLayerId: defaultValues.secuPoolLayerId,
    secuPoolLayerName: defaultValues.secuPoolLayerName,
    workGroupName: defaultValues?.workGroupName ?? '',
    workGroupId: defaultValues?.workGroupId ?? -1,
    controlType: defaultValues.controlType ?? 1,
    acctLevel: defaultValues.controlType === 2 ? defaultValues.acctLevel : 0,
    controlRangeList: defaultValues.controlRangeList ?? [],
    extSysIdList: [
      ...new Set(
        defaultValues.controlRangeList?.map((i: any) => Number(i.extSysId))
      ),
    ],
    accountList: defaultValues.controlRangeList?.map(
      (i: any) => `${i.extSysId}|${i.acctCode}`
    ),
  };
};

interface Ref {
  getFormValueAsync: () => Promise<
    TypeSelectorPool<'PoolLevelForm'> | undefined
  >;
}

const PoolLevelForm = forwardRef<Ref, Props>(
  ({ mode, defaultValues, workGroupList, authLayerList, onClose }, ref) => {
    const [form] = Form.useForm();
    const allSobInfo = useSobInfo();
    const [exSysList, setExSysList] = useState<any[]>([]);
    const [mergeList, setMergeList] = useSetState<MergeProps>({});

    const acctLevel = Form.useWatch('acctLevel', form);
    const [bookLevlList, setBookLevelList] = useState<Option[]>([
      { label: '不区分', value: 0 },
    ]);

    const sobId = useMemo(() => {
      if (allSobInfo && defaultValues.workGroupId) {
        const sobInfo = allSobInfo.find(
          (r) => r.workGroupId === defaultValues.workGroupId
        );
        return sobInfo?.sobId;
      }
      return 0;
    }, [allSobInfo, defaultValues]);

    const initBookList = (id: number) => {
      const sobInfo = allSobInfo.find((r) => r.workGroupId === id);
      const bookList = sobInfo?.bookList ?? [];
      const bookLevlData =
        bookList
          .find((t) => t.bookType === 2)
          ?.bookLevelList.map((p) => {
            return {
              label: p.bookLevelName,
              value: p.bookLevel,
            };
          }) ?? [];
      setBookLevelList([{ label: '不区分', value: 0 }, ...bookLevlData]);
    };
    useEffect(() => {
      if (allSobInfo && defaultValues) {
        initBookList(defaultValues.workGroupId);
        console.log('====================================');
        console.log(
          initialValues,
          defaultValues,
          defaultValues.workGroupName,
          '初始话数据'
        );
        console.log('====================================');
        form.setFieldsValue({ ...initialValues });
      }
    }, [allSobInfo, defaultValues]);

    const changeExtSys = (values: number[]) => {
      setMergeList({ ...mergeList, extSysIdList: values });
      setExSysList(values);
    };

    // 初始话数据

    const initialValues = useMemo(
      () => getInitialValue({ mode, defaultValues }),
      [mode, defaultValues]
    );

    useEffect(() => {
      if (mode === 'EDIT') {
        const nums =
          initialValues.controlType === 1
            ? undefined
            : initialValues.acctLevel ?? -1;
        setMergeList((prev) => ({
          ...prev,
          ...initialValues,
          controlType: initialValues.controlType,
          acctLevel: nums,
        }));

        if (isArray(initialValues.extSysIdList)) {
          setExSysList(initialValues.extSysIdList);
        }
      }
    }, [initialValues, allSobInfo, mode, setMergeList]);

    const typeChange = (value: number) => {
      if (value === 0) {
        setMergeList((prev) => ({
          ...prev,
          controlType: 1,
          acctLevel: undefined,
          controlRangeList: exSysList.map((p) => {
            return {
              extSysId: p,
              acctCode: '-1',
            };
          }),
        }));
      } else {
        setMergeList((prev) => ({
          ...prev,
          controlType: 2,
          acctLevel: value,
          controlRangeList: [],
        }));
      }
      form.resetFields(['accountList']);
      form.setFieldValue('accountList', []);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSubmit = async () => {
      const result = await form.validateFields();
      let controlRangeListNew: ControlRangeListProps[] = [];

      if (
        mergeList.controlType !== 1 &&
        isArray(result.accountList) &&
        result.accountList.length > 0
      ) {
        controlRangeListNew = result?.accountList?.map((item: any) => {
          const [extSysId, acctCode] = item.split('|');
          return {
            extSysId: Number(extSysId),
            acctCode,
          };
        });
      } else if (
        isArray(result.extSysIdList) &&
        result.extSysIdList.length > 0
      ) {
        controlRangeListNew = result.extSysIdList.map((p: any) => ({
          extSysId: p,
          acctCode: '-1',
        }));
      } else {
        controlRangeListNew = mergeList.controlRangeList ?? [];
      }
      const dataToSubmit: PoolLevelFormType = {
        ...result,
        ...mergeList,
        controlRangeList: controlRangeListNew,
      };
      const alterTypes = OPERATION_TYPES.find((d) => d.feKey === mode);
      try {
        const secRes = await alterSecurityPoolLayer({
          modifyType: Number(alterTypes?.code),
          secuPoolLayerId:
            Number(alterTypes?.code) === 1 ? 0 : dataToSubmit.secuPoolLayerId,
          secuPoolLayerName: result.secuPoolLayerName,
          workGroupId: dataToSubmit?.workGroupId ?? -1,
          controlType: dataToSubmit.controlType ?? 1,
          acctLevel:
            dataToSubmit.controlType === 2 ? dataToSubmit.acctLevel : undefined,
          controlRangeList: dataToSubmit.controlRangeList ?? [],
        });

        if (secRes.code === 0) {
          onClose();
          message.success({ content: '提交成功' });
        } else if (secRes.code === 145003) {
          onClose();
          message.success({ content: messageInfo(Number(alterTypes?.code)) });
        } else {
          // message.error(secRes.message);
          return;
        }
      } catch (error) {}
      return dataToSubmit;
    };
    useImperativeHandle(
      ref,
      () => ({
        getFormValueAsync: handleSubmit,
      }),
      [handleSubmit]
    );

    return (
      <div>
        {
          <Form
            name="poolLevel"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            autoComplete="off"
            form={form}
            style={{
              width: '100%',
              marginTop: '12px',
            }}
          >
            <FormItem
              label="层级编号"
              style={{ display: mode === 'ADD' ? 'none' : '' }}
              name="secuPoolLayerId"
            >
              <Input placeholder="自动生成" disabled={true} />
            </FormItem>
            <FormItem
              label="层级名称"
              name="secuPoolLayerName"
              rules={[
                {
                  required: true,
                  message: '选项必填',
                  transform: (value: string) => value.trim(),
                },
              ]}
            >
              <Input maxLength={15} placeholder="券池名称最长15个字符" />
            </FormItem>
            <FormItem
              label="工作台"
              name="workGroupName"
              rules={[{ required: true, message: '选项必填' }]}
            >
              <Input disabled={true} />
            </FormItem>
            <FormItem name="workGroupId" style={{ display: 'none' }}>
              <Input />
            </FormItem>

            <>
              <FormItem
                label="对接系统"
                name="extSysIdList"
                rules={[{ required: true, message: '选项必填' }]}
              >
                <MultipleSelect
                  api={queryExternSystem}
                  onChange={(values: any) => changeExtSys(values)}
                  params={{
                    authFlag: 1,
                    pageId: 1,
                    pageSize: 5000,
                    filterCondition: { sobId },
                  }}
                  labelField="extSysName"
                  valueField="extSysId"
                  resultField="data.resultList"
                />
              </FormItem>

              <FormItem
                label="控制账户类型"
                name="acctLevel"
                rules={[{ required: true, message: '选项必填' }]}
              >
                <Select options={bookLevlList} onChange={typeChange} />
              </FormItem>
            </>

            {!!acctLevel && (
              <>
                <FormItem
                  label="控制账户"
                  name="accountList"
                  rules={[{ required: true, message: '选项必填' }]}
                >
                  <AccountAuthSelect
                    sobId={sobId}
                    bookLevelType={mergeList.acctLevel ?? -1}
                    extSysIdList={exSysList}
                  />
                </FormItem>
              </>
            )}
          </Form>
        }
      </div>
    );
  }
);

export default PoolLevelForm;
