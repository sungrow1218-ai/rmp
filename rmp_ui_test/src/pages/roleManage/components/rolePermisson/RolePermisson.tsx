import React, { FC, useContext } from 'react';
import { ListContext } from '@/hooks/useListClick';
import { Card, Empty, Tabs } from '@ht/sprite-ui';
import TitleImgSrc from '@/assets/common/card-title-icon.png';

import FunctionPermission from './FunctionPermission';
import AccountPermission from './AccountPermissionRebuild';
import WorkGroupPermission from './WorkGroupPermission';
import styles from '@/pages/roleManage/styles.less';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';

const RolePermisson: FC = () => {
  const { selectedItem } = useContext(ListContext); // selectedItem：当前选中的用户数据

  return (
    <>
      {selectedItem ? (
        <Tabs
          defaultActiveKey={'1'}
          items={[
            {
              label: '功能权限',
              key: '1',
              style: { height: '100%', width: '100%' },
              children: (
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={TitleImgSrc} className={styles.logo} />
                      <span className={styles.titleText}>功能权限</span>
                    </div>
                  }
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                  }}
                  bodyStyle={{ flex: 1, width: '100%' }}
                >
                  {selectedItem ? (
                    <FunctionPermission />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                      }}
                    >
                      <Empty
                        style={{ width: '100%', alignSelf: 'center' }}
                        image={NoDataSimpleSvg}
                        description={'暂无数据'}
                      />
                    </div>
                  )}
                </Card>
              ),
            },
            {
              label: '工作台权限',
              key: '2',
              style: { height: '100%', width: '100%' },
              children: (
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={TitleImgSrc} className={styles.logo} />
                      <span className={styles.titleText}>工作台权限</span>
                    </div>
                  }
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                  }}
                  bodyStyle={{ flex: 1, width: '100%' }}
                >
                  {selectedItem ? (
                    <WorkGroupPermission />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                      }}
                    >
                      <Empty
                        style={{ width: '100%', alignSelf: 'center' }}
                        image={NoDataSimpleSvg}
                        description={'暂无数据'}
                      />
                    </div>
                  )}
                </Card>
              ),
            },
            {
              label: '账户权限',
              key: '3',
              style: { height: '100%', width: '100%' },
              children: (
                <>
                  {selectedItem ? (
                    <AccountPermission />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                      }}
                    >
                      <Empty
                        style={{ width: '100%', alignSelf: 'center' }}
                        image={NoDataSimpleSvg}
                        description={'暂无数据'}
                      />
                    </div>
                  )}
                </>
              ),
            },
          ]}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
          <Empty
            style={{ width: '100%', alignSelf: 'center' }}
            image={NoDataSimpleSvg}
            description={'暂无数据'}
          />
        </div>
      )}
    </>
  );
};

export default RolePermisson;
