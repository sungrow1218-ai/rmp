import React, { PropsWithChildren, useRef } from 'react';
import { Inspector } from 'react-dev-inspector';
import { AliveScope, type CachingNode } from 'react-activation';
import { ConfigProvider } from '@ht/sprite-ui';
import { ConfigProvider as ConfigAntdProvider, Empty } from 'antd';
import { KeepAliveContext } from '@/wrappers/KeepAlive';
import zhCN from '@ht/sprite-ui/lib/locale/zh_CN';
import zhAntdCN from 'antd/locale/zh_CN';
import BaseSettings from '../../config/BaseSettings';
import NoDataSvg from '@/assets/empty/noData.svg';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';

const InspectorWrapper =
  process.env.NODE_ENV === 'development' ? Inspector : React.Fragment;

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const cachedNodes = useRef<CachingNode[]>([]);
  return (
    <AliveScope>
      <KeepAliveContext.Provider value={{ cachedNodes }}>
        <ConfigAntdProvider
          prefixCls="riskControlPlatformAntd"
          locale={zhAntdCN}
          renderEmpty={(componentName) => {
            if (componentName === 'Table') {
              return <Empty image={NoDataSvg} description={'暂无数据'} />;
            }
            if (componentName === 'Select') {
              return <Empty image={NoDataSimpleSvg} description={'暂无数据'} />;
            }
            return <Empty image={NoDataSimpleSvg} description={'暂无数据'} />;
          }}
          theme={{
            token: {
              colorPrimary: '#bb744a',
              borderRadius: 2,
              colorTextBase: '#444444',
              colorTextDisabled: '#545454',
              fontFamily: "'myfont', PingFang SC-Regular, PingFang SC",
              colorText: '#444444',
            },
            components: {
              Table: {
                headerBg: '#FEF9F4',
                headerColor: '#757575',
                rowSelectedHoverBg: '#fbefdd',
                rowSelectedBg: '#f8ddbc',
                rowHoverBg: '#fbefdd',
              },
              Button: {
                colorLink: '#bb744a',
                colorLinkActive: '#bb744a',
                colorLinkHover: '#bb744a',
              },
              Select: {
                multipleItemBg: '#faf3eb',
                optionSelectedBg: '#fff',
                multipleItemColorDisabled: '#545454',
                multipleItemBorderColorDisabled: '#dddee0',
              },
              Modal: {
                titleFontSize: 18,
              },
            },
          }}
        >
          <ConfigProvider
            prefixCls={BaseSettings.appName}
            locale={zhCN}
            renderEmpty={(componentName) => {
              if (componentName === 'Table') {
                return <Empty image={NoDataSvg} description={'暂无数据'} />;
              }
              if (componentName === 'Select') {
                return (
                  <Empty image={NoDataSimpleSvg} description={'暂无数据'} />
                );
              }
              return <Empty image={NoDataSimpleSvg} description={'暂无数据'} />;
            }}
          >
            <InspectorWrapper>{children}</InspectorWrapper>
          </ConfigProvider>
        </ConfigAntdProvider>
      </KeepAliveContext.Provider>
    </AliveScope>
  );
};

export default Layout;
