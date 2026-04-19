import { BasicForm, FormActionType, FormSchema } from '@/components/Form';
import { QuestionCircleOutlined } from '@ht-icons/sprite-ui-react';
import { Checkbox, message, Modal, Tooltip } from '@ht/sprite-ui';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DynamicFlag, Mode, SelectedItem } from './data';
import { querySetOfBookbySobId } from '@/services/account';
import { alterAccountGroup } from '@/services/accountGroup';

export interface IProps {
  onRefresh: (mode: Mode, acctGroupId: number) => void;
  onSubmitAfter?: (data?: SubmitAcctGroupAfterType) => void;
}
export type SubmitAcctGroupAfterType = {
  acctGroupId: number;
  acctGroupName: string;
  bookType: number;
  bookLevel: number;
};

export interface IAction {
  open: (mode: Mode, record: SelectedItem) => void;
}

const EditModal = forwardRef<IAction, IProps>(
  ({ onRefresh, onSubmitAfter }, ref) => {
    const formRef = useRef<FormActionType>(null);
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<Mode>(Mode.ADD);
    const [loading, setLoading] = useState(false);
    const [acctGroup, setAcctGroup] = useState<SelectedItem>();

    const getSchemas = useMemo<FormSchema[]>(
      () => [
        {
          field: 'acctGroupName',
          label: '账户组名称',
          rules: [{ required: true }, { max: 50, message: '不能超过50字符' }],
          component: 'Input',
          componentProps: {
            autoComplete: 'off',
          },
        },
        {
          field: 'acctGroupRemark',
          label: '描述',
          component: 'InputTextArea',
          rules: [{ max: 500, message: '不能超过500字符' }],
        },
        {
          field: 'dynamicFlag',
          label: '账户组更新模式',
          rules: [{ required: true, type: 'array' }],
          component: 'CheckboxGroup',
          defaultValue: [DynamicFlag.STATIC],
          componentProps: {
            children: (
              <Checkbox value={DynamicFlag.STATIC} checked={true}>
                静态账户组
                <Tooltip title="静态账户组指用户创建时选择的固定账户范围，除非用户人工更新账户组，否则系统不会自动更新">
                  <QuestionCircleOutlined style={{ marginLeft: '16px' }} />
                </Tooltip>
              </Checkbox>
            ),
          },
        },
        {
          field: 'acctGroupType',
          label: (
            <>
              账户类型
              <Tooltip title="即账户组内的账户类型">
                <QuestionCircleOutlined style={{ marginLeft: '16px' }} />
              </Tooltip>
            </>
          ),
          rules: [{ required: true }],
          dynamicDisabled: mode === Mode.EDIT,
          component: 'Select',
        },
      ],
      [mode]
    );

    useImperativeHandle(ref, () => ({
      open: async (mode, record) => {
        setOpen(true);
        setMode(mode);
        setAcctGroup(record);
        try {
          const res = await querySetOfBookbySobId(record.sobId);
          if (res.code !== 0) {
            throw Error('获取账套信息失败');
          }
          let opts: { label: string; value: string }[] = [];
          if (
            res.data &&
            res.data.resultList &&
            res.data.resultList.length > 0
          ) {
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
          if (formRef.current) {
            formRef.current.updateSchemas({
              field: 'acctGroupType',
              componentProps: { options: opts, allowClear: true },
            });
          }
        } catch (error: any) {
          console.error(error);
          error.message && message.success(error.message);
        } finally {
          if (mode === Mode.EDIT) {
            formRef.current?.setFieldsValue({
              acctGroupName: record.acctGroupName,
              acctGroupRemark: record.acctGroupRemark,
              acctGroupType: `${record.bookType}|${record.bookLevel}`,
            });
          }
        }
      },
    }));

    return (
      <Modal
        title={mode === Mode.ADD ? '新增账户组' : '编辑账户组'}
        open={open}
        onOk={async () => {
          try {
            setLoading(true);
            const { acctGroupName, acctGroupRemark, acctGroupType } =
              await formRef.current?.validateFields();
            const [bookType, bookLevel] = acctGroupType.split('|');
            const param = {
              alterType: mode === Mode.ADD ? 1 : 2,
              workGroupId: acctGroup!.workGroupId,
              acctGroupId: mode === Mode.ADD ? 0 : acctGroup!.acctGroupId,
              acctGroupName,
              acctGroupRemark,
              dynamicFlag: 0,
              bookType,
              bookLevel,
            };
            const res = await alterAccountGroup(param);
            if (res.code !== 0) {
              throw Error(res.message);
            }
            if (onSubmitAfter && res.data && res.data.accountGroupId) {
              onSubmitAfter({
                acctGroupId: Number(res.data.accountGroupId),
                acctGroupName,
                bookType: Number(bookType),
                bookLevel: Number(bookLevel),
              });
              setOpen(false);
            }
            message.success('操作成功');
            onRefresh(
              mode,
              mode === Mode.ADD
                ? res.data.acct_group_id
                : acctGroup!.acctGroupId
            );
            setOpen(false);
          } catch (error: any) {
            console.error(error);
            // error.message && message.error(error.message);
          } finally {
            setLoading(false);
          }
        }}
        onCancel={() => setOpen(false)}
        okButtonProps={{ loading }}
        destroyOnClose={true}
      >
        <BasicForm
          ref={formRef}
          schemas={getSchemas}
          layout="vertical"
          baseColProps={{ span: 24 }}
        />
      </Modal>
    );
  }
);

export default EditModal;
