/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable max-lines */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { Form, Input, message, Select, SelectProps } from '@ht/sprite-ui';
import { useSobInfo } from '@/pages/ruleSetting/components/allSobInfo';

import { FORM_MODES } from '@/pages/ruleSetting/constant';
import {
  ControlRangeListProps,
  MergeProps,
  PoolLevelFormType,
  PoolLevelProps,
  TypeSelectorPool,
} from '@/pages/securityPool/contants/tyeping';
import { DictFeKeyEnumType, OPERATION_TYPES } from '@/utils/dict';
import {
  SelectOption,
  useInfoInit,
} from '@/pages/securityPool/contants/useInfoInit';
import { useSetState } from 'ahooks';
import AccountAuthSelect from './AccountAuthSelect';
import { isArray } from 'lodash';
import { messageInfo } from './message';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import { queryExternSystem } from '@/services/account';
import { alterSecurityPoolLayer } from '@/services/securityPool/index';

const FormItem = Form.Item;
interface Ref {
  getFormValueAsync: () => Promise<
    TypeSelectorPool<'PoolLevelForm'> | undefined
  >;
}
// 将接口数据入参格式的数据转换为组件表单的数据格式
const getInitialValue = ({
  mode,
  defaultValues,
}: {
  mode: DictFeKeyEnumType['OPERATION_TYPES'];
  defaultValues?: PoolLevelFormType;
}): Partial<PoolLevelFormType> => {
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
  if (mode === FORM_MODES.ADD || !defaultValues) {
    return emptyValue;
  }

  return {
    ...emptyValue,
    secuPoolLayerId: defaultValues.secuPoolLayerId,
    secuPoolLayerName: defaultValues.secuPoolLayerName,
    workGroupId: defaultValues?.workGroupId ?? -1,
    controlType: defaultValues.controlType ?? 1,
    acctLevel: defaultValues.controlType === 2 ? defaultValues.acctLevel : 0,
    controlRangeList: defaultValues.controlRangeList ?? [],
    extSysIdList: [
      ...new Set(
        defaultValues.controlRangeList?.map((i) => Number(i.extSysId))
      ),
    ],
    accountList: defaultValues.controlRangeList?.map(
      (i) => `${i.extSysId}|${i.acctCode}`
    ),
  };
};
const PoolLevelForm: ForwardRefRenderFunction<
  Ref,
  PoolLevelProps<'PoolLevelForm'>
> = ({ mode, formType, onClose, defaultValues }, ref) => {
  const initialValues = useMemo(
    () => getInitialValue({ mode, defaultValues }),
    [mode, defaultValues]
  );
  const [form] = Form.useForm<PoolLevelFormType>();
  const useInfoInitFun = useInfoInit();
  const acctLevel = Form.useWatch('acctLevel', form);
  const [mergeList, setMergeList] = useSetState<MergeProps>({});
  const [exSysList, setExSysList] = useState<any[]>([]);
  const [workGroupId, setWorkGroupId] = useState(0);
  const [sobId, setSobId] = useState<number | undefined>(undefined);
  const [bookLevlList, setBookLevelList] = useState<SelectOption[]>([
    { label: '不区分', value: 0 },
  ]);
  const allSobInfo = useSobInfo();
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

  const handleSubmit = async () => {
    const result = await form.validateFields();
    let controlRangeListNew: ControlRangeListProps[] = [];

    if (
      mergeList.controlType !== 1 &&
      isArray(result.accountList) &&
      result.accountList.length > 0
    ) {
      controlRangeListNew = result?.accountList.map((item) => {
        const [extSysId, acctCode] = item.split('|');
        return {
          extSysId: Number(extSysId),
          acctCode,
        };
      });
    } else if (isArray(result.extSysIdList) && result.extSysIdList.length > 0) {
      controlRangeListNew = result.extSysIdList.map((p) => ({
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
  const changeExtSys = (values: number[]) => {
    setMergeList({ ...mergeList, extSysIdList: values });
    setExSysList(values);
  };
  const changeIds: SelectProps['onChange'] = (id) => {
    setWorkGroupId(id);
    const sobInfo = allSobInfo.find((r) => r.workGroupId === id);
    const ids = sobInfo?.sobId;

    setSobId(ids);
    initBookList(id);
    form.setFieldValue('extSysIdList', []);
    form.setFieldValue('acctLevel', undefined);
    form.setFieldValue('accountList', []);
  };
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
      initBookList(initialValues.workGroupId ?? -1);

      if (useInfoInitFun?.workGourpList.length) {
        const sobInfo = useInfoInitFun?.workGourpList.find(
          (p) => p.value === initialValues.workGroupId
        );
        const ids = sobInfo?.sobId;
        setSobId(ids);
      }
      if (isArray(initialValues.extSysIdList)) {
        setExSysList(initialValues.extSysIdList);
      }

      setWorkGroupId(initialValues.workGroupId ?? -1);
    }
  }, [initialValues, allSobInfo]);

  useEffect(() => {
    form.resetFields();
  }, [mode, defaultValues]);

  return (
    <div>
      {formType === 'PoolLevelForm' && (
        <Form
          name="poolLevel"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          initialValues={{ ...initialValues }}
          form={form}
          style={{
            width: '100%',
            marginTop: '12px',
          }}
        >
          <FormItem label="层级编号" name="secuPoolLayerId">
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
            name="workGroupId"
            rules={[{ required: true, message: '选项必填' }]}
          >
            <Select
              options={useInfoInitFun?.workGourpList ?? []}
              value={workGroupId}
              onChange={changeIds}
              disabled={mode === 'EDIT'}
            />
          </FormItem>
          {!!workGroupId && (
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
          )}

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
      )}
    </div>
  );
};

export default forwardRef(PoolLevelForm);
