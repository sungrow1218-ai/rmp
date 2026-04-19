import React, { useEffect, useState } from 'react';
import withKeepAlive from '@/wrappers/KeepAlive';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import LeftClassify, { ParseDataType } from './LeftRebuild';
import RightTable from './Right';
import styles from './style.less';
import { getIsIfram } from '@/utils/utils';
import SearchTreeTop from './components/SearchTreeTop';
import { Form, FormInstance } from 'antd';
import PageTitle from '@/components/PageTitle';
import { useWorkGroup } from '@/hooks/useWorkGroup';

export interface SearchObj {
  workGroupId: number;
  secuPoolLayerName: string;
  secuPoolName: string;
  creater: string;
}

const SecurityPool = () => {
  const [key, setKey] = useState<string>(''); // 选中的证券Id
  const [riskAuth, setRiskAuth] = useState(false);
  const [treeFrom] = Form.useForm();
  const [searchObj, setSearchObj] = useState<SearchObj | undefined>(undefined);
  const [selectInfo, setSelectInfo] = useState<ParseDataType | undefined>();

  const workGroupList = useWorkGroup(0);
  const changeKey = (value: string) => {
    setKey(value);
  };
  const isIfram = getIsIfram();
  const onFilter = (form: FormInstance) => {
    const data = form.getFieldsValue();
    setSearchObj(data);
  };

  return (
    // <MyList>
    <div
      style={{ minWidth: '1600px' }}
      className={` ${styles.secuPoolAll} ${isIfram ? styles.isIfram : ''}`}
    >
      <PageTitle
        title="证券池管理"
        showIcon={true}
        popRender={
          <>
            可创建券池，维护静态证券范围，支持人工批量导入与在线添加证券列表，{' '}
            <br />
            风控规则设置能关联证券池。
          </>
        }
      />
      <div style={{ width: '100%' }}>
        <SearchTreeTop
          form={treeFrom}
          onFilter={onFilter}
          workGroupList={workGroupList}
        />
      </div>
      <div className={styles.secuPoolContainer}>
        <LeftClassify
          searchObj={searchObj}
          changeKey={changeKey}
          setRiskAuth={setRiskAuth}
          setSelectInfo={setSelectInfo}
          workGroupList={workGroupList}
        />
        <RightTable
          selectKey={key}
          riskAuth={riskAuth}
          selectInfo={selectInfo}
        />
      </div>
    </div>
    // </MyList>
  );
};

export default withKeepAlive({ cacheKey: KEEPALIVE_CACHE_KEY.SECURITY_POOL })(
  SecurityPool
);
