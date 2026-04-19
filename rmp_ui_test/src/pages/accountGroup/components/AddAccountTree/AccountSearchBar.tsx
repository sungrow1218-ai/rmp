// AccountSearchBar.tsx
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Input, Select, Form, Button } from '@ht/sprite-ui';
import { SearchOutlined } from '@ht-icons/sprite-ui-react';
import MultipleSelect from '@/components/MultipleSelectRebuild';
// import { queryExternSystem } from '@/services/account';
import { TRADING_MARKETS } from '@/utils/dict';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import styles from './style.less';
import useExternSystems from '../../hooks/useExternSystems';

export interface AccountSearchBarProps {
  filter: any;
  setFilter: React.Dispatch<React.SetStateAction<any>>;
  sobId?: number | string;
  bookType?: number;
  bookLevels: Array<{ label: string; value: number }>;
  title?: string;
  showTotal?: boolean;
  total?: number;
  unitLabel?: string;
  showImport?: boolean;
  /** 账户名称搜索去抖时间（毫秒） */
  searchDebounceMs?: number;
}

const transformDict = (dict: readonly { code: string; name: string }[]) =>
  dict
    .map((item) => ({ value: item.code, label: `${item.code}-${item.name}` }))
    .filter((it) => !it.label.includes('不区分'));

/** 简易去抖 */
function useDebounce<T>(value: T, delay: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const AccountSearchBar: React.FC<AccountSearchBarProps> = memo(
  ({
    filter,
    setFilter,
    sobId,
    bookLevels,
    title = '',
    showTotal = false,
    total = 0,
    unitLabel,
    showImport = false,
    bookType,
    searchDebounceMs = 50,
  }) => {
    const [form] = Form.useForm();
    const isTrader = Number(bookType) === 1;
    const isManager = Number(bookType) === 2;

    const extSystems = useExternSystems(sobId);

    // 映射为 MultipleSelect 可用的 options
    const extSysOptions = useMemo(
      () =>
        (extSystems ?? []).map((x: any) => ({
          value: x.extSysId ?? x.value,
          label: x.extSysName ?? x.label ?? String(x.extSysId ?? ''),
        })),
      [extSystems]
    );

    const [acctNameInput, setAcctNameInput] = useState<string>(
      filter?.acctName ?? ''
    );
    const debouncedAcctName = useDebounce(acctNameInput, searchDebounceMs);

    const [acctCodeInput, setAcctCodeInput] = useState<string>(
      filter?.acctCode ?? ''
    );
    const debouncedAcctCode = useDebounce(acctCodeInput, searchDebounceMs);

    useEffect(() => {
      form.setFieldsValue({
        extSysId: filter?.extSysId,
        accountType: filter?.accountType,
        marketId: filter?.marketId,
        acctCode: filter?.acctCode,
        acctName: filter?.acctName ?? '',
      });
      setAcctNameInput(filter?.acctName ?? '');
      setAcctCodeInput(filter?.acctCode ?? '');
    }, [
      filter?.extSysId,
      filter?.accountType,
      filter?.marketId,
      filter?.acctCode,
      filter?.acctName,
      form,
    ]);

    useEffect(() => {
      setFilter((prev: any) => {
        if (prev?.acctName === debouncedAcctName) return prev;
        return { ...prev, acctName: debouncedAcctName };
      });
    }, [debouncedAcctName]);

    useEffect(() => {
      setFilter((prev: any) => {
        if (prev?.acctCode === debouncedAcctCode) return prev;
        return { ...prev, acctCode: debouncedAcctCode };
      });
    }, [debouncedAcctCode]);

    const handleValuesChange = (changed: any, allValues: any) => {
      if ('acctCode' in changed) {
        return;
      }
      setFilter((prev: any) => ({ ...prev, ...allValues }));
    };

    return (
      <div className={styles.searchBar}>
        <div className={styles.searchBarHeader}>
          <div style={{ fontWeight: 600, flex: 1, fontSize: 14 }}>
            <img
              src={TitleImgSrc}
              alt=""
              style={{ width: 20, height: 20, marginRight: 6 }}
            />
            {title}
            {showTotal && (
              <span style={{ color: '#999', marginLeft: 6, fontSize: 12 }}>
                共{total}个{unitLabel ?? ''}
              </span>
            )}
          </div>
        </div>

        <Form
          form={form}
          layout="inline"
          initialValues={{
            extSysId: filter?.extSysId,
            accountType: filter?.accountType,
            marketId: filter?.marketId,
            acctCode: filter?.acctCode,
            acctName: filter?.acctName ?? '',
          }}
          onValuesChange={handleValuesChange}
          style={{ width: '100%' }}
        >
          <div className={styles.searchBarBody}>
            <div className={styles.searchBarRow}>
              <span className={styles.searchBarSpan}>交易系统：</span>
              <Form.Item
                name="extSysId"
                label={false}
                style={{ marginBottom: 0, width: '100%' }}
              >
                <MultipleSelect
                  options={extSysOptions}
                  placeholder="请选择"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>

            {isManager && (
              <div className={styles.searchBarRow}>
                <span className={styles.searchBarSpan}>账户类型：</span>
                <Form.Item
                  name="accountType"
                  label={false}
                  style={{ marginBottom: 0, width: '100%' }}
                >
                  <Select
                    placeholder="请选择"
                    style={{ width: '100%' }}
                    options={bookLevels}
                    showSearch={true}
                    optionFilterProp="label"
                  />
                </Form.Item>
              </div>
            )}

            {isTrader && (
              <div className={styles.searchBarRow}>
                <span className={styles.searchBarSpan}>交易市场：</span>
                <Form.Item
                  name="marketId"
                  label={false}
                  style={{ marginBottom: 0, width: '100%' }}
                >
                  <MultipleSelect
                    options={transformDict(TRADING_MARKETS)}
                    placeholder="请选择"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </div>
            )}

            <div className={styles.searchBarRow}>
              <span className={styles.searchBarSpan}>账户编码：</span>
              <Form.Item
                name="acctCode"
                label={false}
                style={{ marginBottom: 0, width: '100%' }}
              >
                <Input
                  placeholder="请输入"
                  suffix={<SearchOutlined />}
                  allowClear={true}
                  style={{ width: '100%' }}
                  value={acctCodeInput}
                  onChange={(e) => setAcctCodeInput(e.target.value ?? '')}
                />
              </Form.Item>
            </div>

            <div className={styles.searchBarRow}>
              <span className={styles.searchBarSpan}>账户名称：</span>
              <Form.Item
                name="acctName"
                label={false}
                style={{ marginBottom: 0, width: '100%' }}
              >
                <Input
                  placeholder="请输入"
                  suffix={<SearchOutlined />}
                  allowClear={true}
                  style={{ width: '100%' }}
                  value={acctNameInput}
                  onChange={(e) => setAcctNameInput(e.target.value ?? '')}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    );
  }
);

export default AccountSearchBar;
