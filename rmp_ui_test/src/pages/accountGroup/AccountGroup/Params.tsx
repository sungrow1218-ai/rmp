import { BasicForm, FormActionType, FormSchema } from '@/components/Form';
import { querySetOfBookbySobId, WorkGroupList } from '@/services/account';
import { Button, message } from '@ht/sprite-ui';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import styles from './styles.less';
import { SearchOutlined } from '@ht-icons/sprite-ui-react';

interface Props {
  workGroupList: WorkGroupList[];
  onChange: (params: Recordable) => void;
}

const Params: FC<Props> = ({ onChange, workGroupList }) => {
  const formRef = useRef<FormActionType>(null);

  // 获取账户组类型
  const getAcctGroupType = async (sobId: number) => {
    let opts: { label: string; value: string }[] = [];
    try {
      const res = await querySetOfBookbySobId(sobId);
      if (res.code !== 0) {
        throw Error('获取账套信息失败');
      }
      if (res.data && res.data.resultList && res.data.resultList.length > 0) {
        for (const { bookLevelList, bookType } of res.data.resultList[0]
          .bookList) {
          opts = [
            ...opts,
            ...bookLevelList.map((i) => ({
              label: i.bookLevelName,
              value: `${bookType}|${i.bookLevel}`,
            })),
          ];
        }
      }
      return opts;
    } catch (error: any) {
      console.error(error);
      error.message && message.success(error.message);
      return opts;
    }
  };

  const getSchemas = useMemo<FormSchema[]>(
    () => [
      {
        field: 'workGroupId',
        label: '工作台',
        component: 'Select',
        componentProps: ({ formAction }) => {
          return {
            options: workGroupList.map((i) => ({
              label: i.workGroupName,
              value: i.workGroupId,
              ...i,
            })),
            style: { width: '240px' },
            allowClear: true,
            onChange: async (value, option: any) => {
              formAction.setFieldValue('acctGroupType', undefined);
              if (value) {
                getAcctGroupType(option.sobId).then((opts) => {
                  formAction.updateSchemas({
                    field: 'acctGroupType',
                    componentProps: { options: opts, allowClear: true },
                  });
                });
              } else {
                formAction.updateSchemas({
                  field: 'acctGroupType',
                  componentProps: { options: [], allowClear: true },
                });
              }
            },
          };
        },
      },
      {
        field: 'acctGroupName',
        label: '账户组名称',
        component: 'Input',
        labelWidth: '120px',
        componentProps: {
          style: { width: '240px' },
          allowClear: true,
          placeholder: '请输入',
          autoComplete: 'off',
          suffix: <SearchOutlined />,
        },
      },
      {
        field: 'acctGroupType',
        label: '账户组类型',
        component: 'Select',
        labelWidth: '120px',
        componentProps: {
          options: [],
          style: { width: '240px' },
          allowClear: true,
        },
      },
      {
        field: 'createUserCode',
        label: '创建人',
        component: 'Input',
        labelWidth: '80px',
        componentProps: {
          allowClear: true,
          style: { width: '240px' },
          placeholder: '请输入',
          autoComplete: 'off',
          suffix: <SearchOutlined />,
        },
      },
    ],
    [workGroupList]
  );

  const handleSearch = async () => {
    const params: Recordable = await formRef.current?.validateFields();
    if (params.acctGroupType) {
      const [bookType, bookLevel] = params.acctGroupType.split('|');
      params.bookType = bookType;
      params.bookLevel = bookLevel;
      delete params.acctGroupType;
    }
    onChange(params);
  };

  const handleReset = () => {
    formRef.current?.resetFields();
    formRef.current?.updateSchemas({
      field: 'acctGroupType',
      componentProps: { options: [], allowClear: true },
    });
    handleSearch();
  };

  const hasSetWorkgroup = useRef(false);

  useEffect(() => {
    if (workGroupList.length > 0 && !hasSetWorkgroup.current) {
      formRef.current?.setFieldValue(
        'workGroupId',
        workGroupList[0].workGroupId
      );
      getAcctGroupType(workGroupList[0].sobId).then((opts) => {
        formRef.current?.updateSchemas({
          field: 'acctGroupType',
          componentProps: { options: opts, allowClear: true },
        });
      });
      hasSetWorkgroup.current = true;
    }
  }, [workGroupList]);

  return (
    <div className={styles.paramsBlock}>
      <BasicForm ref={formRef} schemas={getSchemas} layout="inline" />
      <div>
        <Button style={{ marginRight: '16px' }} onClick={handleReset}>
          重置
        </Button>
        <Button type="primary" onClick={handleSearch}>
          查询
        </Button>
      </div>
    </div>
  );
};

export default Params;
