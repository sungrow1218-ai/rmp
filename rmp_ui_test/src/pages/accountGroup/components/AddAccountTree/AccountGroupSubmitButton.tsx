// components/AddAccountTree/AccountGroupSubmitButton.tsx
import React, { useState } from 'react';
import { Button, message } from '@ht/sprite-ui';
import { alterAccountGroupDetail } from '@/services/accountGroup';

export type AcctItemForSubmit = {
  acctCode: string;
  acctName: string;
  marketId: number;
  extSysId: number;
};

export type SubmitPayload = {
  acctGroupId: number;
  acctList: AcctItemForSubmit[];
  unitLabel?: string; // 用于美化 faultList 的单位名（可选）
};

export type AccountGroupSubmitButtonProps = {
  payload: SubmitPayload;
  onSuccess?: (total: number) => void;
  onFault?: (faultList: any[]) => void; // 把 faultList 回传，父层自行处理（例如弹窗）
  // 自定义失败列表的增强逻辑（默认不处理，父层可以传入加上 unitLabel 等）
  enhanceFaultList?: (faultList: any[], unitLabel?: string) => any[];
  // Button 透传
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode; // 按钮文案
};

/** 也导出一个纯函数，方便不通过按钮时主动调用 */
export async function submitAccountGroup(payload: SubmitPayload) {
  const { acctGroupId, acctList } = payload;
  const res = await alterAccountGroupDetail({
    alterType: 1,
    acctGroupId,
    acctList,
  });
  return res;
}

const AccountGroupSubmitButton: React.FC<AccountGroupSubmitButtonProps> = ({
  payload,
  onSuccess,
  onFault,
  enhanceFaultList,
  type = 'primary',
  size = 'middle',
  disabled,
  style,
  className,
  children = '提交',
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!payload?.acctGroupId || !Array.isArray(payload?.acctList)) {
      message.warning('缺少提交参数');
      return;
    }
    // 👇 新增：检查是否至少选择了一个账户
    if (payload?.acctList.length === 0) {
      message.warning('至少应选择一个账户');
      return;
    }
    setLoading(true);
    try {
      const res = await submitAccountGroup(payload);

      const unitLabel = payload?.unitLabel;
      const faultRaw = res?.data?.faultList || [];

      if (faultRaw.length > 0) {
        const faultList = enhanceFaultList
          ? enhanceFaultList(faultRaw, unitLabel)
          : faultRaw;
        onFault?.(faultList);
        return;
      }

      message.success(`成功添加 ${payload.acctList.length} 个账户`);
      onSuccess?.(payload.acctList.length);
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type={type}
      size={size}
      loading={loading}
      onClick={handleClick}
      disabled={disabled}
      style={style}
      className={className}
    >
      {children}
    </Button>
  );
};

export default AccountGroupSubmitButton;
