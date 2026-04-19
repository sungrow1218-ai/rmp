import React, { useRef, useState } from 'react';
import EditModal, {
  IAction as ModalAction,
  SubmitAcctGroupAfterType,
} from './EditModal';
import AddAccount, {
  AddAccountAction,
} from '../components/AddAccountTree/AddAccountTree';
import { Button } from 'antd';
import { Mode, SelectedItem } from './data';

const RuleAddAccount = () => {
  const modalRef = useRef<ModalAction>(null);
  const [accountInfo, setAccountInfo] = useState<
    SubmitAcctGroupAfterType | undefined
  >(undefined);
  const addAccountRef = useRef<AddAccountAction>(null);

  // const modalDelRef = useRef<ModalDelAction>(null);

  return (
    <div>
      <Button
        onClick={() => {
          modalRef.current?.open(Mode.ADD, {
            sobId: 1,
            workGroupId: 1,
          } as SelectedItem);
        }}
      >
        新增账户组
      </Button>

      <EditModal
        ref={modalRef}
        onRefresh={() => {}}
        onSubmitAfter={(data?: SubmitAcctGroupAfterType) => {
          if (data) {
            setAccountInfo(data);
            addAccountRef.current?.open();
          }
        }}
      />
      <AddAccount
        ref={addAccountRef}
        reFresh={() => {}}
        sobInfo={{
          sobId: 1,
          sobName: 'Matic账套',
          bookList: [
            {
              bookType: 1,
              bookDepth: 1,
              bookLevelList: [
                {
                  bookLevel: 1,
                  bookLevelName: '股东账户',
                },
              ],
            },
            {
              bookType: 2,
              bookDepth: 3,
              bookLevelList: [
                {
                  bookLevel: 1,
                  bookLevelName: '资产账户',
                },
                {
                  bookLevel: 2,
                  bookLevelName: '产品账户',
                },
                {
                  bookLevel: 3,
                  bookLevelName: '机构',
                },
              ],
            },
          ],
        }}
        bookType={accountInfo?.bookType}
        bookLevel={accountInfo?.bookLevel}
        acctGroupId={accountInfo?.acctGroupId}
      />
    </div>
  );
};

export default RuleAddAccount;
