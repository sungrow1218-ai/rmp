import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import EditRuleModal from '@/pages/ruleSetting/components/EditRuleModal';
import { useSobInfo } from '@/pages/ruleSetting/components/allSobInfo';
import { SobInfo } from '@/services/account';

interface Props {
  data: any;
  setOpen: (value: boolean) => void;
  authFlag?: number;
}

const RuleModal = ({ data, setOpen, authFlag }: Props) => {
  const sobInfo = useSobInfo(authFlag);

  const sobInfoWithId = useMemo(() => {
    if (!data) {
      return false;
    }
    const dataId = sobInfo.find(
      (item) => item.workGroupId === data.workGroupId
    );
    if (dataId?.bookList) {
      return dataId;
    } else return false;
  }, [data, sobInfo]);
  return (
    <div>
      {sobInfoWithId && (
        <EditRuleModal
          mode={'PREVIEW'}
          onClose={() => {
            setOpen(false);
          }}
          ruleType={data?.ruleBaseInfo?.ruleType}
          refetch={() => {}}
          record={data}
          sobInfo={sobInfoWithId as SobInfo}
          workGroupId={data.workGroupId ?? -1}
          notShowFoot={true}
        />
      )}
    </div>
  );
};
export default RuleModal;
