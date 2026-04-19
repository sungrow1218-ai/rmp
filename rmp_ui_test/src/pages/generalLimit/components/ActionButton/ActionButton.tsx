import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from '../../styles.less';
import { Input, Button, message } from 'antd';
import { SearchOutlined } from '@ht-icons/sprite-ui-react';
import { debounce } from 'lodash';
import { PaginationType } from '@/services/typing';
import { GeneraList } from '../../RightTable';
import { exportGeneralLimitDetail } from '@/services/generalLimit';
import { downloadByUrl } from '@/utils/file';
import useEIP from '@/directives/useEIP';

interface Props {
  groupKey: number;
  pagination: PaginationType;
  selectItems: GeneraList[];
  setValue: React.Dispatch<React.SetStateAction<string>>;
  getTableData: (page: number, pageSize: number) => Promise<void>;
  deletData: () => void;
  setMode: React.Dispatch<React.SetStateAction<number>>;
  onOpen: () => void;
  triggerImport: () => void;
  queryAuth: boolean;
  operateAuth: boolean;
}
const ActionButton: React.FC<Props> = ({
  setValue,
  getTableData,
  pagination,
  selectItems,
  deletData,
  setMode,
  onOpen,
  triggerImport,
  groupKey,
  operateAuth,
  queryAuth,
}) => {
  const [loading, setLoading] = useState(false);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const [_, eipRef] = useEIP();

  const exportFile = async () => {
    try {
      setLoading(true);
      const result = await exportGeneralLimitDetail({
        groupId: groupKey,
      });
      if (result.code !== 0) {
        // message.error({ content: JSON.stringify(result.message) });
        return;
      }
      const { fileUrl } = result?.data;
      downloadByUrl({ url: fileUrl });
      message.success('下载成功');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.rightSpace}>
      {queryAuth ? (
        <Input
          placeholder="请输入证券代码"
          style={{ width: '200px' }}
          prefix={<SearchOutlined />}
          onChange={debounce(onChange, 500)}
          allowClear={true}
        />
      ) : (
        <div></div>
      )}
      <div className={styles.rigthBtns}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {queryAuth ? (
            <Button
              ref={eipRef}
              onClick={exportFile}
              type="primary"
              loading={loading}
            >
              导出
            </Button>
          ) : null}
          {operateAuth ? (
            <>
              <Button
                type="primary"
                ref={eipRef}
                onClick={() => {
                  setMode(1);
                  onOpen();
                }}
              >
                添加
              </Button>
              <Button
                ref={eipRef}
                onClick={() => {
                  setMode(2);
                  onOpen();
                }}
                disabled={selectItems?.length !== 1}
              >
                修改
              </Button>
              <Button
                ref={eipRef}
                disabled={selectItems?.length === 0}
                style={{ marginLeft: '36px' }}
                onClick={deletData}
              >
                批量删除
              </Button>
              <Button ref={eipRef} onClick={triggerImport}>
                批量导入
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ActionButton;
