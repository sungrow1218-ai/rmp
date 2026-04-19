import React, { useEffect, useState } from 'react';
import { useSobInfo } from '@/pages/ruleSetting/components/allSobInfo';
import {
  queryExternSystem,
  queryWorkGroup,
  WorkGroupList,
} from '@/services/account';
import { Form, Input, Modal, Select } from '@ht/sprite-ui';
import { useForm } from '@ht/sprite-ui/lib/form/Form';
import { SelectOption } from '@/pages/securityPool/contants/useInfoInit';
import AccountAuthSelect from './AccountAuthSelect';
import MultipleSelect from '@/components/MultipleSelectRebuild';

interface Props {
  data: any;
  setOpen: (value: boolean) => void;
}
const FormItem = Form.Item;
const PoolDetailModal = ({ data, setOpen }: Props) => {
  const [form] = useForm();
  const [workGourpList, setWorkGroupList] = useState<WorkGroupList>();
  const allSobInfo = useSobInfo();
  const [bookLevlList, setBookLevelList] = useState<SelectOption[]>([
    { label: '不区分', value: 0 },
  ]);
  useEffect(() => {
    const fetch = async () => {
      try {
        const resWorkGroup = await queryWorkGroup({
          pageId: 1,
          pageSize: 1000,
        });
        if (resWorkGroup.code !== 0) {
          throw new Error('获取工作台信息失败');
        }
        if (!resWorkGroup.data || resWorkGroup.data.resultList.length === 0) {
          throw new Error('未查询到账套信息');
        }
        const workGroup = resWorkGroup.data.resultList.find(
          (p) => p.workGroupId === data.workGroupId
        );
        setWorkGroupList(workGroup);
      } catch (error) {}
    };
    if (data) {
      fetch();
    }
  }, [data]);

  useEffect(() => {
    if (workGourpList) {
      const sobInfo = allSobInfo.find(
        (r) => r.workGroupId === workGourpList.workGroupId
      );
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
    }
    form.setFieldsValue({
      ...data,
      acctLevel: data.controlType === 2 ? data.acctLevel : 0,
      workGroupName: workGourpList?.workGroupName,
      extSysIdList: [
        ...new Set(data.controlRangeList?.map((i: any) => Number(i.extSysId))),
      ],
      accountList: data.controlRangeList?.map(
        (i: any) => `${i.extSysId}|${i.acctCode}`
      ),
    });
  }, [data, form, allSobInfo, workGourpList]);

  return (
    <div>
      <Modal
        open={true}
        onCancel={() => {
          setOpen(false);
        }}
        width={530}
        maskClosable={false}
        centered={true}
        destroyOnClose={true}
        footer={null}
      >
        <Form
          name="poolLevel"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17 }}
          autoComplete="off"
          form={form}
          disabled={true}
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
            name="workGroupName"
            rules={[{ required: true, message: '选项必填' }]}
          >
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
                disabled={true}
                params={{
                  authFlag: 1,
                  pageId: 1,
                  pageSize: 5000,
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
              <Select options={bookLevlList} disabled={false} />
            </FormItem>
          </>

          {data.controlType === 2 && (
            <>
              <FormItem
                label="控制账户"
                name="accountList"
                rules={[{ required: true, message: '选项必填' }]}
              >
                <AccountAuthSelect
                  disabled={true}
                  sobId={workGourpList?.sobId}
                  bookLevelType={data.acctLevel ?? -1}
                  extSysIdList={[
                    ...new Set(
                      data.controlRangeList?.map((i: any) => Number(i.extSysId))
                    ),
                  ]}
                />
              </FormItem>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};
export default PoolDetailModal;
